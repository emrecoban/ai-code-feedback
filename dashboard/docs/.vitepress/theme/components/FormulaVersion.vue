<script setup lang="ts">
// "Formula version 1.0", read from inventory.json, with a link to the
// metric changelog row of each item.
import { computed } from 'vue'
import { data } from '../inventory.data'
import { anchorOf, useLang } from '../composables'

const props = defineProps<{ ids: string }>()
const { tr, name, localPath } = useLang()
const rows = computed(() =>
  props.ids.split(',').map((id) => id.trim()).map((id) => ({ id, item: data.items.find((i) => i.id === id) })),
)
</script>

<template>
  <ul class="facts">
    <li v-for="r in rows" :key="r.id">
      {{ name(r.id) }}: {{ tr('formulaVersion') }} <strong>{{ r.item?.formula_version ?? '?' }}</strong>
      (<a :href="`${localPath('changelog')}#${anchorOf(r.id)}`">{{ tr('seeChangelog') }}</a>)
    </li>
  </ul>
</template>
