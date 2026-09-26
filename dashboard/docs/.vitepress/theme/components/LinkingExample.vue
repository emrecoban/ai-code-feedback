<script setup lang="ts">
// Worked linking example with the synthetic cohort: the key table maps a
// username to a student number, the instruments are joined by that number, and
// the result is one row per student in the wide file. Shows S07 and the merged
// username of S12 (cleaning rule C3).
import { computed } from 'vue'
import keyTable from '../../data/sample/external/key_table.json'
import wide from '../../data/sample/wide.json'
import { useLang } from '../composables'

const props = withDefaults(defineProps<{ part?: 'key' | 'wide' }>(), { part: 'key' })
const { tr, num, name } = useLang()
const keyRows = (keyTable as { username: string; student_no: string }[]).filter((k) => ['s07', 's12', 's12x'].includes(k.username))
const row = computed(() => (wide as Record<string, number | string>[]).find((r) => r.student === 'S07')!)
const WIDE_VARS: [string, string][] = [
  ['student', 'profiles.username'],
  ['questions', 'metric.questions'],
  ['hint_enough_pct', 'metric.hint_enough_pct'],
  ['fixed_unaided', 'coding_sessions.errors_resolved_without_asking'],
  ['active_hours', 'coding_sessions.active_seconds'],
  ['pre_total', 'external.pre_total'],
  ['post_total', 'external.post_total'],
  ['gain', 'external.gain'],
  ['tam_pu', 'external.tam_pu'],
]
const show = (v: number | string) => (typeof v === 'number' ? num(v, 2) : v)
</script>

<template>
  <div v-if="props.part === 'key'" class="link-table">
    <p class="link-caption">{{ tr('keyTable') }}</p>
    <table>
      <thead>
        <tr><th><code>username</code></th><th><code>student_no</code></th></tr>
      </thead>
      <tbody>
        <tr v-for="k in keyRows" :key="k.username"><td><code>{{ k.username }}</code></td><td><code>{{ k.student_no }}</code></td></tr>
      </tbody>
    </table>
  </div>
  <div v-else class="link-table">
    <p class="link-caption">{{ tr('wideRow') }} (S07)</p>
    <table>
      <thead>
        <tr><th>{{ tr('variable') }}</th><th>{{ tr('name') }}</th><th>{{ tr('value') }}</th></tr>
      </thead>
      <tbody>
        <tr v-for="[v, id] in WIDE_VARS" :key="v">
          <td><code>{{ v }}</code></td>
          <td>{{ v === 'student' ? tr('student') : name(id) }}</td>
          <td>{{ show(row[v]) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.link-table {
  overflow-x: auto;
}
.link-table table {
  font-size: 13px;
}
.link-caption {
  margin-bottom: 0;
  font-size: 14px;
  font-weight: 600;
}
</style>
