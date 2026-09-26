<script setup lang="ts">
// "Data at a glance": every inventory item in one table, with its category,
// raw or derived, research stage and what it is for. Filters by category,
// research use and name. Names and purposes follow the page language.
import { computed, ref } from 'vue'
import { data } from '../inventory.data'
import { categories, type UiKey } from '../../data/terms'
import purposes from '../../data/purposes.json'
import { anchorOf, useLang } from '../composables'

const { l, tr, name, localPath } = useLang()
const category = ref('')
const onlyResearch = ref(false)
const query = ref('')

const order = Object.keys(categories)
const rows = [...data.items].sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category))

const purpose = (i: (typeof rows)[number]) => {
  if (i.page?.startsWith('data/')) return (purposes as Record<string, Record<string, string>>)[i.page]?.[l.value] ?? ''
  if (i.id === 'profiles.username') return tr('usernamePurpose')
  if (i.category === 'external') return tr('externalPurpose')
  if (i.level === 'function' || i.level === 'storage') return tr('functionPurpose')
  return tr('technicalPurpose')
}
const link = (i: (typeof rows)[number]) => {
  if (!i.page) return undefined
  const anchor = i.page.startsWith('reference/') ? anchorOf(i.id) : i.anchor
  return `${localPath(i.page)}${anchor ? `#${anchor}` : ''}`
}
const stages = (i: (typeof rows)[number]) => (i.stage ?? []).map((s) => tr(`stage_${s}` as UiKey)).join(', ')

const shown = computed(() => {
  const q = query.value.trim().toLocaleLowerCase(l.value)
  return rows.filter(
    (i) =>
      (!category.value || i.category === category.value) &&
      (!onlyResearch.value || i.research) &&
      (!q || name(i.id).toLocaleLowerCase(l.value).includes(q) || i.id.toLowerCase().includes(q)),
  )
})
</script>

<template>
  <div class="glance">
    <div class="glance-filters">
      <label>
        <span class="visually-hidden">{{ tr('category') }}</span>
        <select v-model="category">
          <option value="">{{ tr('allCategories') }}</option>
          <option v-for="c in order" :key="c" :value="c">{{ categories[c][l] }}</option>
        </select>
      </label>
      <label>
        <span class="visually-hidden">{{ tr('filterByName') }}</span>
        <input v-model="query" type="search" :placeholder="tr('filterByName')" />
      </label>
      <label class="glance-check"><input v-model="onlyResearch" type="checkbox" /> {{ tr('onlyResearch') }}</label>
      <span class="glance-count" aria-live="polite">{{ tr('shownOf', { n: shown.length, total: rows.length }) }}</span>
    </div>
    <div class="glance-table">
      <table>
        <thead>
          <tr>
            <th>{{ tr('name') }}</th>
            <th>{{ tr('category') }}</th>
            <th>{{ tr('kind') }}</th>
            <th>{{ tr('stage') }}</th>
            <th>{{ tr('purpose') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in shown" :key="i.id">
            <td>
              <a v-if="link(i)" :href="link(i)">{{ name(i.id) }}</a><span v-else>{{ name(i.id) }}</span>
              <br /><code class="glance-id">{{ i.id }}</code>
            </td>
            <td>{{ categories[i.category]?.[l] }}</td>
            <td>{{ i.kind === 'derived' ? tr('kindDerived') : tr('kindRaw') }}</td>
            <td>{{ stages(i) }}</td>
            <td>{{ purpose(i) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.glance-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: center;
  margin: 16px 0 8px;
  font-size: 14px;
}
.glance-filters select,
.glance-filters input[type='search'] {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  padding: 4px 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  max-width: 100%;
}
.glance-check {
  display: inline-flex;
  gap: 6px;
  align-items: center;
}
.glance-count {
  color: var(--vp-c-text-2);
}
.glance-table {
  overflow-x: auto;
}
.glance-table table {
  font-size: 13px;
}
.glance-id {
  font-size: 11px;
  color: var(--vp-c-text-2);
  word-break: break-all;
}
</style>
