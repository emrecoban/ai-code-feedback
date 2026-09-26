<script setup lang="ts">
// Draws the visual of one data page from .vitepress/data/sample/views/<view>.json
// (written by `npm run docs:sample`). Types: weekly, bars, hist, columns,
// stacked, timeline, heatmap, table, card. All labels are resolved in the
// page's language; the featured student is always drawn in the accent colour.
import { computed, onMounted, shallowRef } from 'vue'
import LineChart from './LineChart.vue'
import { useLang } from '../composables'

const props = defineProps<{ view: string }>()
const { l, locale, tr, name, fmt, label, num } = useLang()
// The trend page imports its view statically, so it is left out here.
const modules = import.meta.glob(['../../data/sample/views/*.json', '!../../data/sample/views/independence-trend.json'])
const data = shallowRef<any>(null)
const FEATURED = 'S07'

onMounted(async () => {
  const load = modules[`../../data/sample/views/${props.view}.json`]
  if (load) data.value = ((await load()) as any).default
})
const v = computed(() => data.value?.visual)

// ---------- scales
const maxOf = (xs: (number | null | undefined)[]) => Math.max(1e-9, ...xs.filter((x): x is number => x != null))
const barMax = computed(() => (v.value?.type === 'bars' ? maxOf(v.value.rows.flatMap((r: any) => [r.featured, r.class])) : 1))
const histMax = computed(() => (v.value?.type === 'hist' ? maxOf(v.value.bins.map((b: any) => b.count)) : 1))
const colMax = computed(() => (v.value?.type === 'columns' ? maxOf(v.value.values) : 1))
const colFeaturedMax = computed(() => (v.value?.type === 'columns' && v.value.featured ? maxOf(v.value.featured) : 1))
const w = (value: number | null | undefined, max: number) => `${value == null ? 0 : Math.max(0, (100 * value) / max)}%`

// ---------- stacked
const stackTotal = (row: any) => Object.values(row.values as Record<string, number>).reduce((a, b) => a + b, 0)
const share = (row: any, key: string) => (stackTotal(row) ? (100 * row.values[key]) / stackTotal(row) : 0)

// ---------- timeline
const tlEnd = computed(() => (v.value?.type === 'timeline' ? Math.max(...v.value.events.map((e: any) => e.ms)) * 1.05 : 1))
const tlLabel = (e: any) =>
  e.type === 'asked' ? tr('asked') : e.type === 'level_reached' ? `${name('event.level_reached')} (L${e.level})` : name(`event.${e.type}`)
const tlTime = (ms: number) => (ms < 90_000 ? `+${num(ms / 1000, 0)} ${tr('unitSec')}` : `+${num(ms / 60_000, 1)} ${tr('unitMin')}`)

// ---------- heatmap (ISO weekday 1-7 x hour 0-23)
const heat = computed(() => {
  if (v.value?.type !== 'heatmap') return null
  const grid = Array.from({ length: 7 }, () => Array(24).fill(0))
  for (const [d, h, n] of v.value.cells) grid[d - 1][h] = n
  return { grid, max: maxOf(grid.flat()) }
})
const weekday = (d: number) =>
  new Intl.DateTimeFormat(locale.value, { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2030, 2, 3 + d)))

// ---------- table cells
const cell = (c: any) => {
  if (c == null) return '–'
  if (typeof c === 'number') return num(c, 1)
  if (typeof c === 'string') return c
  if ('pct' in c) return fmt(c.pct, 'pct')
  if ('min' in c) return fmt(c.min, 'min')
  if ('hour' in c) return fmt(c.hour, 'hour')
  if ('list' in c) return c.list.map(label).join(' · ')
  return label(c)
}
const classLabel = computed(() => (v.value?.classLabel === 'classMean' ? tr('classMean') : tr('class')))
const seriesLabel = (s: string) => (s === 'featured' ? FEATURED : tr('class'))
</script>

<template>
  <div v-if="v" class="sv" :data-type="v.type">
    <!-- weekly lines -->
    <template v-if="v.type === 'weekly'">
      <ul class="chart-legend">
        <li><span class="key-line" aria-hidden="true" />{{ FEATURED }}</li>
        <li><span class="key-line class" aria-hidden="true" />{{ classLabel }}</li>
        <li v-if="v.band"><span class="key-band" aria-hidden="true" />{{ tr('middleHalf') }}</li>
      </ul>
      <LineChart
        :ticks="v.featured.map((_: unknown, k: number) => String(k + 1))"
        :featured="v.featured"
        :class-line="v.class"
        :band="v.band"
        :unit="v.unit"
        :aria-label="`${FEATURED}, ${classLabel}`"
        :height="200"
      />
      <p class="axis-caption">{{ tr('week') }}<template v-if="v.unit === 'min' || v.unit === 'sec'"> · {{ v.unit === 'min' ? tr('unitMin') : tr('unitSec') }}</template></p>
      <details>
        <summary>{{ tr('showTable') }}</summary>
        <table>
          <thead><tr><th>{{ tr('week') }}</th><th>{{ FEATURED }}</th><th>{{ classLabel }}</th></tr></thead>
          <tbody>
            <tr v-for="(f, k) in v.featured" :key="k"><td>{{ k + 1 }}</td><td>{{ fmt(f, v.unit) }}</td><td>{{ fmt(v.class[k], v.unit) }}</td></tr>
          </tbody>
        </table>
      </details>
    </template>

    <!-- horizontal bars, one or two series -->
    <template v-else-if="v.type === 'bars'">
      <ul v-if="v.series.length > 1" class="chart-legend">
        <li v-for="s in v.series" :key="s"><span class="key-box" :class="s" aria-hidden="true" />{{ seriesLabel(s) }}</li>
      </ul>
      <div class="sv-bars">
        <div v-for="(r, k) in v.rows" :key="k" class="sv-bar-row">
          <div class="sv-bar-label">{{ label(r.label) }}</div>
          <div class="sv-bar-tracks">
            <div v-for="s in v.series" :key="s" class="sv-bar-track">
              <span class="sv-bar" :class="s" :style="{ width: w(r[s], barMax) }" />
              <span class="sv-bar-value">{{ fmt(r[s], v.unit) }}<template v-if="v.series.length === 1 && v.series[0] === 'featured'"> </template></span>
            </div>
          </div>
        </div>
      </div>
      <p v-if="v.series.length === 1" class="axis-caption">{{ seriesLabel(v.series[0]) }}</p>
    </template>

    <!-- histogram -->
    <template v-else-if="v.type === 'hist'">
      <div class="sv-cols" role="img" :aria-label="v.bins.map((b: any) => `${label(b.label)}: ${b.count}`).join(', ')">
        <div v-for="(b, k) in v.bins" :key="k" class="sv-col">
          <span class="sv-col-value">{{ num(b.count) }}</span>
          <span class="sv-col-bar" :class="{ featured: b.featured }" :style="{ height: w(b.count, histMax) }" />
          <span class="sv-col-label">{{ label(b.label) }}</span>
        </div>
      </div>
      <ul class="chart-legend legend-below">
        <li><span class="key-box hist" aria-hidden="true" />{{ tr('count') }}</li>
        <li v-if="v.bins.some((b: any) => b.featured)"><span class="key-box featured" aria-hidden="true" />{{ tr('featuredBin', { code: FEATURED }) }}</li>
      </ul>
    </template>

    <!-- vertical columns over weeks -->
    <template v-else-if="v.type === 'columns'">
      <div class="sv-col-panels">
        <div>
          <p class="panel-title">{{ tr('class') }}</p>
          <div class="sv-cols">
            <div v-for="(x, k) in v.x" :key="k" class="sv-col">
              <span class="sv-col-value">{{ num(v.values[k]) }}</span>
              <span class="sv-col-bar hist" :style="{ height: w(v.values[k], colMax) }" />
              <span class="sv-col-label">{{ label(x) }}</span>
            </div>
          </div>
        </div>
        <div v-if="v.featured">
          <p class="panel-title">{{ FEATURED }}</p>
          <div class="sv-cols">
            <div v-for="(x, k) in v.x" :key="k" class="sv-col">
              <span class="sv-col-value">{{ num(v.featured[k]) }}</span>
              <span class="sv-col-bar featured" :style="{ height: w(v.featured[k], colFeaturedMax) }" />
              <span class="sv-col-label">{{ label(x) }}</span>
            </div>
          </div>
        </div>
      </div>
      <p v-if="v.xLabel" class="axis-caption">{{ label(v.xLabel) }}</p>
    </template>

    <!-- 100% stacked bars -->
    <template v-else-if="v.type === 'stacked'">
      <ul class="chart-legend">
        <li v-for="(p, k) in v.parts" :key="p.key"><span class="key-box" :class="`part-${k}`" aria-hidden="true" />{{ label(p.label) }}</li>
      </ul>
      <div v-for="(r, k) in v.rows" :key="k" class="sv-stack-row">
        <div class="sv-bar-label">{{ label(r.label) }}</div>
        <div class="sv-stack">
          <span
            v-for="(p, j) in v.parts"
            :key="p.key"
            class="sv-stack-part"
            :class="`part-${j}`"
            :style="{ width: `${share(r, p.key)}%` }"
            :title="`${label(p.label)}: ${num(r.values[p.key])}`"
          >{{ share(r, p.key) >= 9 ? fmt(share(r, p.key), 'pct').replace(/[.,]\d/, '') : '' }}</span>
        </div>
      </div>
      <details>
        <summary>{{ tr('showTable') }}</summary>
        <table>
          <thead><tr><th /><th v-for="p in v.parts" :key="p.key">{{ label(p.label) }}</th></tr></thead>
          <tbody><tr v-for="(r, k) in v.rows" :key="k"><td>{{ label(r.label) }}</td><td v-for="p in v.parts" :key="p.key">{{ num(r.values[p.key]) }}</td></tr></tbody>
        </table>
      </details>
    </template>

    <!-- timeline of one question -->
    <template v-else-if="v.type === 'timeline'">
      <ol class="sv-timeline">
        <li v-for="(e, k) in v.events" :key="k">
          <span class="sv-tl-time">{{ tlTime(e.ms) }}</span>
          <span class="sv-tl-dot" :class="{ first: k === 0 }" aria-hidden="true" />
          <span class="sv-tl-label">{{ tlLabel(e) }}</span>
          <span class="sv-tl-track" aria-hidden="true"><i :style="{ left: w(e.ms, tlEnd) }" /></span>
        </li>
      </ol>
    </template>

    <!-- weekday x hour heatmap -->
    <template v-else-if="v.type === 'heatmap' && heat">
      <div class="sv-heat" role="img" :aria-label="name('metric.work_rhythm')">
        <template v-for="(row, d) in heat.grid" :key="d">
          <span class="sv-heat-day">{{ weekday(d + 1) }}</span>
          <span
            v-for="(n, h) in row"
            :key="h"
            class="sv-heat-cell"
            :style="{ opacity: n ? 0.15 + (0.85 * n) / heat.max : 0.06 }"
            :title="`${weekday(d + 1)} ${String(h).padStart(2, '0')}:00 · ${n}`"
          />
        </template>
        <span />
        <span v-for="h in 24" :key="`h${h}`" class="sv-heat-hour">{{ (h - 1) % 3 === 0 ? h - 1 : '' }}</span>
      </div>
      <p class="axis-caption">{{ tr('hour') }} · {{ tr('less') }} <span class="sv-heat-key" /> {{ tr('more') }}</p>
    </template>

    <!-- small table -->
    <template v-else-if="v.type === 'table'">
      <table class="sv-table">
        <thead><tr><th v-for="(c, k) in v.columns" :key="k">{{ label(c) }}</th></tr></thead>
        <tbody>
          <tr v-for="(r, k) in v.rows" :key="k"><td v-for="(c, j) in r" :key="j">{{ cell(c) }}</td></tr>
        </tbody>
      </table>
    </template>

    <!-- text card -->
    <template v-else-if="v.type === 'card'">
      <div class="sv-card">
        <p v-if="v.title" class="sv-card-title">{{ v.title }}</p>
        <div v-for="(b, k) in v.blocks" :key="k" class="sv-card-block">
          <span class="sv-card-label">{{ label(b.label) }}</span>
          <p>{{ b.text }}</p>
        </div>
      </div>
    </template>
  </div>
  <p v-else class="sv-loading" aria-hidden="true">…</p>
</template>

<style scoped>
.sv table {
  margin: 8px 0 0;
}
.chart-legend .key-box {
  display: inline-block;
  width: 12px;
  height: 10px;
  border-radius: 2px;
  background: var(--chart-class);
}
.key-box.featured,
.sv-bar.featured,
.sv-col-bar.featured {
  background: var(--chart-featured);
}
.key-box.class,
.sv-bar.class {
  background: var(--chart-class);
  opacity: 0.55;
}
.key-box.hist,
.sv-col-bar,
.sv-col-bar.hist {
  background: var(--chart-hist);
}
.legend-below {
  margin: 10px 0 0;
}
/* bars */
.sv-bars {
  display: grid;
  gap: 10px;
}
.sv-bar-row {
  display: grid;
  grid-template-columns: minmax(120px, 34%) 1fr;
  gap: 10px;
  align-items: center;
}
@media (max-width: 560px) {
  .sv-bar-row {
    grid-template-columns: 1fr;
    gap: 2px;
  }
}
.sv-bar-label {
  font-size: 13px;
  line-height: 1.3;
  color: var(--vp-c-text-1);
}
.sv-bar-tracks {
  display: grid;
  gap: 3px;
}
.sv-bar-track {
  display: flex;
  align-items: center;
  gap: 6px;
}
.sv-bar {
  display: block;
  height: 12px;
  min-width: 2px;
  border-radius: 0 3px 3px 0;
}
.sv-bar-value {
  font-size: 12px;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}
/* columns and histogram */
.sv-col-panels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.sv-cols {
  display: flex;
  align-items: flex-end;
  gap: 6px;
  height: 170px;
  padding-top: 4px;
  border-bottom: 1px solid var(--chart-baseline);
}
.sv-col {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  min-width: 0;
}
.sv-col-bar {
  display: block;
  width: 100%;
  max-width: 44px;
  min-height: 1px;
  border-radius: 3px 3px 0 0;
}
.sv-col-value {
  font-size: 11px;
  color: var(--vp-c-text-2);
}
.sv-col-label {
  position: relative;
  top: 18px;
  height: 0;
  font-size: 11px;
  color: var(--vp-c-text-2);
  text-align: center;
  white-space: nowrap;
}
.sv-cols + .chart-legend,
.sv-col-panels + .axis-caption,
.sv-cols + .axis-caption {
  margin-top: 26px;
}
/* stacked */
.sv-stack-row {
  display: grid;
  grid-template-columns: minmax(90px, 22%) 1fr;
  gap: 10px;
  align-items: center;
  margin: 8px 0;
}
.sv-stack {
  display: flex;
  height: 22px;
  border-radius: 4px;
  overflow: hidden;
}
.sv-stack-part {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  color: #fff;
}
.part-0 {
  background: var(--level-hint);
  color: #0b2a4f;
}
.part-1 {
  background: var(--level-rule);
}
.part-2 {
  background: var(--level-fix);
}
.key-box.part-0 {
  background: var(--level-hint);
}
.key-box.part-1 {
  background: var(--level-rule);
}
.key-box.part-2 {
  background: var(--level-fix);
}
/* timeline */
.sv-timeline {
  margin: 0;
  padding: 0;
  list-style: none;
}
.sv-timeline li {
  display: grid;
  grid-template-columns: 72px 14px 1fr;
  grid-template-rows: auto 6px;
  column-gap: 8px;
  align-items: center;
  margin: 0 0 6px;
  font-size: 13px;
}
.sv-tl-time {
  font-variant-numeric: tabular-nums;
  color: var(--vp-c-text-2);
  text-align: right;
}
.sv-tl-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--chart-featured);
}
.sv-tl-dot.first {
  background: var(--vp-c-text-1);
}
.sv-tl-track {
  position: relative;
  grid-column: 3;
  height: 4px;
  border-radius: 2px;
  background: var(--chart-grid);
}
.sv-tl-track i {
  position: absolute;
  top: -2px;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  border-radius: 50%;
  background: var(--chart-featured);
}
/* heatmap */
.sv-heat {
  display: grid;
  /* minmax(0, 1fr): with 1fr the square cells take the row height as their
     minimum width and the grid overflows the card on narrow screens. */
  grid-template-columns: 34px repeat(24, minmax(0, 1fr));
  gap: 2px;
  font-size: 10px;
  line-height: 1.2;
  color: var(--vp-c-text-2);
}
.sv-heat-cell {
  min-width: 0;
  aspect-ratio: 1;
  border-radius: 2px;
  background: var(--chart-featured);
}
.sv-heat-day {
  align-self: center;
}
.sv-heat-hour {
  text-align: center;
}
.sv-heat-key {
  display: inline-block;
  width: 40px;
  height: 8px;
  border-radius: 2px;
  background: linear-gradient(90deg, color-mix(in srgb, var(--chart-featured) 15%, transparent), var(--chart-featured));
  vertical-align: middle;
}
/* table and card */
.sv-table {
  font-size: 13px;
}
.sv-card {
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}
.sv-card-title {
  margin: 0 0 8px;
  font-weight: 600;
}
.sv-card-block + .sv-card-block {
  margin-top: 10px;
}
.sv-card-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
.sv-card-block p {
  margin: 2px 0 0;
  white-space: pre-wrap;
  line-height: 1.5;
}
.sv-loading {
  min-height: 120px;
}
</style>
