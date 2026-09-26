<script setup lang="ts">
// Data flow diagram (inline SVG, labels in the page language) and a table that
// says, per data category, where the data is created, stored and shown.
import { categories } from '../../data/terms'
import { flowLabels as F, flowNote, flowRows } from '../../data/flow'
import { useLang } from '../composables'

const props = withDefaults(defineProps<{ part?: 'diagram' | 'table' }>(), { part: 'diagram' })
const { l } = useLang()
/** Arrow labels in legend order, and the badge position on each arrow. */
const edges = ['ownRows', 'requests', 'writes', 'toAi', 'fromAi', 'toDashboard'] as const
const badges: [number, number][] = [[124, 110], [296, 110], [211, 190], [306, 255], [336, 255], [99, 255]]
</script>

<template>
  <figure v-if="props.part === 'diagram'" class="flow">
    <svg viewBox="0 0 420 360" role="img" :aria-label="F.diagramTitle[l]">
      <defs>
        <marker id="flow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" class="flow-head" />
        </marker>
      </defs>
      <!-- Supabase region -->
      <rect x="4" y="128" width="412" height="104" rx="10" class="flow-region" />
      <text x="14" y="146" class="flow-region-label">{{ F.supabase[l] }}</text>
      <!-- boxes -->
      <g>
        <rect x="110" y="8" width="200" height="54" rx="8" class="flow-box accent" />
        <text x="210" y="31" class="flow-title">{{ F.extension[l] }}</text>
        <text x="210" y="49" class="flow-sub">{{ F.extensionSub[l] }}</text>
      </g>
      <g>
        <rect x="14" y="160" width="170" height="60" rx="8" class="flow-box" />
        <text x="99" y="185" class="flow-title">{{ F.tables[l] }}</text>
        <text x="99" y="204" class="flow-sub">{{ F.tablesSub[l] }}</text>
      </g>
      <g>
        <rect x="236" y="160" width="170" height="60" rx="8" class="flow-box" />
        <text x="321" y="185" class="flow-title">{{ F.functions[l] }}</text>
        <text x="321" y="204" class="flow-sub">{{ F.functionsSub[l] }}</text>
      </g>
      <g>
        <rect x="14" y="292" width="170" height="56" rx="8" class="flow-box accent" />
        <text x="99" y="316" class="flow-title">{{ F.dashboard[l] }}</text>
        <text x="99" y="334" class="flow-sub">{{ F.dashboardSub[l] }}</text>
      </g>
      <g>
        <rect x="236" y="292" width="170" height="56" rx="8" class="flow-box outside" />
        <text x="321" y="316" class="flow-title">{{ F.ai[l] }}</text>
        <text x="321" y="334" class="flow-sub">{{ F.aiSub[l] }}</text>
      </g>
      <!-- arrows, numbered; the legend under the diagram says what moves -->
      <path d="M150 62 L99 158" class="flow-line" marker-end="url(#flow-arrow)" />
      <path d="M270 62 L321 158" class="flow-line" marker-end="url(#flow-arrow)" />
      <path d="M236 190 L186 190" class="flow-line" marker-end="url(#flow-arrow)" />
      <path d="M306 220 L306 290" class="flow-line" marker-end="url(#flow-arrow)" />
      <path d="M336 290 L336 222" class="flow-line" marker-end="url(#flow-arrow)" />
      <path d="M99 220 L99 290" class="flow-line" marker-end="url(#flow-arrow)" />
      <g v-for="(p, k) in badges" :key="k">
        <circle :cx="p[0]" :cy="p[1]" r="9" class="flow-badge" />
        <text :x="p[0]" :y="p[1] + 3.5" class="flow-badge-text">{{ k + 1 }}</text>
      </g>
    </svg>
    <ol class="flow-legend">
      <li v-for="e in edges" :key="e">{{ F[e][l] }}</li>
    </ol>
  </figure>

  <div v-else class="flow-table">
    <table>
      <thead>
        <tr>
          <th>{{ F.category[l] }}</th>
          <th>{{ F.created[l] }}</th>
          <th>{{ F.stored[l] }}</th>
          <th>{{ F.shown[l] }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in flowRows" :key="r.category">
          <td>{{ categories[r.category][l] }}</td>
          <td>{{ r.created[l] }}</td>
          <td><code v-if="r.stored !== '–'">{{ r.stored }}</code><span v-else>–</span></td>
          <td>{{ r.shown[l] }}</td>
        </tr>
      </tbody>
    </table>
    <p class="flow-note">{{ flowNote[l] }}</p>
  </div>
</template>

<style scoped>
.flow {
  margin: 16px auto;
  max-width: 560px;
}
.flow svg {
  width: 100%;
  height: auto;
  display: block;
}
.flow-region {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-dasharray: 5 4;
}
.flow-region-label {
  font-size: 11px;
  fill: var(--vp-c-text-2);
}
.flow-box {
  fill: var(--vp-c-bg-soft);
  stroke: var(--vp-c-divider);
}
.flow-box.accent {
  stroke: var(--vp-c-brand-1);
}
.flow-box.outside {
  stroke-dasharray: 4 3;
}
.flow-title {
  font-size: 13px;
  font-weight: 600;
  text-anchor: middle;
  fill: var(--vp-c-text-1);
}
.flow-sub {
  font-size: 10px;
  text-anchor: middle;
  fill: var(--vp-c-text-2);
}
.flow-line {
  stroke: var(--vp-c-text-3);
  stroke-width: 1.4;
  fill: none;
}
.flow-head {
  fill: var(--vp-c-text-3);
}
.flow-badge {
  fill: var(--vp-c-brand-1);
}
.flow-badge-text {
  font-size: 10px;
  font-weight: 700;
  text-anchor: middle;
  fill: var(--vp-c-white);
}
.flow-legend {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin-top: 8px;
}
.flow-table {
  overflow-x: auto;
}
.flow-table table {
  font-size: 13px;
}
.flow-note {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
