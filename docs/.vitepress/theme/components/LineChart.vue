<script setup lang="ts">
// Values over weeks, drawn like the dashboard's LineChart: one featured
// student, the class (dashed) and an optional band. Percentages use a fixed
// 0-100 axis, other units a rounded maximum. null leaves a gap: "no data
// that week" is not 0.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useLang } from '../composables'

const props = withDefaults(
  defineProps<{
    ticks: string[]
    featured: (number | null)[]
    classLine?: (number | null)[]
    band?: { lo: (number | null)[]; hi: (number | null)[] }
    ariaLabel: string
    height?: number
    unit?: string
  }>(),
  { height: 170, unit: 'pct' },
)

const { pct, num } = useLang()
const box = ref<HTMLElement>()
const width = ref(300)
let observer: ResizeObserver | undefined
onMounted(() => {
  if (!box.value) return
  width.value = box.value.clientWidth || 300
  observer = new ResizeObserver(([entry]) => (width.value = entry.contentRect.width || 300))
  observer.observe(box.value)
})
onBeforeUnmount(() => observer?.disconnect())

const M = { top: 10, right: 10, bottom: 22, left: 38 }
const n = computed(() => props.ticks.length)
const plotW = computed(() => Math.max(0, width.value - M.left - M.right))
const plotH = computed(() => props.height - M.top - M.bottom)
const x = (i: number) => M.left + (n.value > 1 ? (plotW.value * i) / (n.value - 1) : plotW.value / 2)
function niceMax(v: number) {
  if (v <= 0) return 1
  const p = 10 ** Math.floor(Math.log10(v))
  return [1, 2, 2.5, 5, 10].map((m) => m * p).find((c) => c >= v) ?? 10 * p
}
const yMax = computed(() => {
  if (props.unit === 'pct') return 100
  const all = [...props.featured, ...(props.classLine ?? []), ...(props.band?.hi ?? [])].filter((v): v is number => v != null)
  return niceMax(Math.max(1, ...all))
})
const ticksY = computed(() => [0, yMax.value / 2, yMax.value])
const tickLabel = (v: number) => (props.unit === 'pct' ? pct(v) : num(v, v < 10 ? 1 : 0))
const y = (v: number) => M.top + plotH.value - (v / yMax.value) * plotH.value

function segments(values: (number | null)[]) {
  const parts: string[] = []
  let current = ''
  values.forEach((v, i) => {
    if (v == null) {
      if (current) parts.push(current)
      current = ''
    } else current += `${current ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`
  })
  if (current) parts.push(current)
  return parts
}

const bandPath = computed(() => {
  if (!props.band) return ''
  const { lo, hi } = props.band
  const idx = lo.map((_, i) => i).filter((i) => lo[i] != null && hi[i] != null)
  if (idx.length < 2) return ''
  const top = idx.map((i, k) => `${k ? 'L' : 'M'}${x(i).toFixed(1)},${y(hi[i]!).toFixed(1)}`).join('')
  const bottom = [...idx].reverse().map((i) => `L${x(i).toFixed(1)},${y(lo[i]!).toFixed(1)}`).join('')
  return `${top}${bottom}Z`
})
</script>

<template>
  <div ref="box">
    <svg class="chart" :width="width" :height="height" role="img" :aria-label="ariaLabel">
      <g v-for="v in ticksY" :key="v">
        <line :class="v === 0 ? 'baseline' : 'grid'" :x1="M.left" :x2="width - M.right" :y1="y(v)" :y2="y(v)" />
        <text class="tick" :x="M.left - 6" :y="y(v)" dy="0.32em" text-anchor="end">{{ tickLabel(v) }}</text>
      </g>
      <text
        v-for="(tick, i) in ticks"
        :key="`t${i}`"
        class="tick"
        :x="x(i)"
        :y="height - 5"
        text-anchor="middle"
      >{{ tick }}</text>
      <path v-if="bandPath" class="band" :d="bandPath" />
      <path v-for="(d, i) in classLine ? segments(classLine) : []" :key="`c${i}`" class="line-class" :d="d" />
      <path v-for="(d, i) in segments(featured)" :key="`f${i}`" class="line-featured" :d="d" />
      <template v-for="(v, i) in featured" :key="`d${i}`">
        <circle v-if="v != null" class="dot-featured" :cx="x(i)" :cy="y(v)" r="3.5" />
      </template>
    </svg>
  </div>
</template>
