<script setup lang="ts">
// Metric changelog: every derived item of inventory.json with its formula
// version. History entries for later versions go in `history` below.
import { computed } from 'vue'
import { data } from '../inventory.data'
import { categories } from '../../data/terms'
import { anchorOf, useLang } from '../composables'

const { l, locale, tr, name, localPath } = useLang()
const BASELINE = '2026-09-26' // formulas as in extension 0.2.0 and migrations 0001-0024
const date = (iso: string) =>
  new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`))

const groups = computed(() => {
  const derived = data.items.filter((i) => i.kind === 'derived')
  const order = Object.keys(categories)
  return order
    .map((c) => ({ category: c, items: derived.filter((i) => i.category === c) }))
    .filter((g) => g.items.length)
})
const pageLink = (page?: string, anchor?: string) =>
  page ? `${localPath(page)}${anchor ? `#${anchor}` : ''}` : undefined
</script>

<template>
  <div v-for="g in groups" :key="g.category">
    <h3 :id="`cat-${g.category}`">{{ categories[g.category][l] }}</h3>
    <table>
      <thead>
        <tr>
          <th>{{ tr('metric') }}</th>
          <th>{{ tr('version') }}</th>
          <th>{{ tr('date') }}</th>
          <th>{{ tr('change') }}</th>
          <th>{{ tr('comparable') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in g.items" :id="anchorOf(i.id)" :key="i.id">
          <td>
            <a v-if="pageLink(i.page, i.anchor)" :href="pageLink(i.page, i.anchor)">{{ name(i.id) }}</a>
            <span v-else>{{ name(i.id) }}</span>
            <br /><code>{{ i.id }}</code>
          </td>
          <td>{{ i.formula_version }}</td>
          <td>{{ date(BASELINE) }}</td>
          <td>{{ tr('initialVersion') }}</td>
          <td>{{ tr('notApplicable') }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
