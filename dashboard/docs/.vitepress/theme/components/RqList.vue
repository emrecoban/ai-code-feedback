<script setup lang="ts">
// The research questions an item serves, with its role, linked to the matrix.
import { computed } from 'vue'
import { matrix, questions, type Role } from '../../data/research'
import { useLang } from '../composables'

const props = defineProps<{ ids: string }>()
const { l, tr, localPath } = useLang()
const roleKey: Record<Role, 'roleOutcome' | 'rolePredictor' | 'roleModerator' | 'roleDescriptive'> = {
  outcome: 'roleOutcome', predictor: 'rolePredictor', moderator: 'roleModerator', descriptive: 'roleDescriptive',
}
const rows = computed(() => {
  const ids = props.ids.split(',').map((s) => s.trim())
  return questions
    .map((q) => ({ q, roles: [...new Set(ids.map((id) => matrix[id]?.[q.id]).filter((r): r is Role => !!r))] }))
    .filter((r) => r.roles.length)
})
</script>

<template>
  <ul class="rq-list">
    <li v-for="r in rows" :key="r.q.id">
      <span class="role">{{ r.roles.map((x) => tr(roleKey[x])).join(', ') }}</span>
      <a :href="`${localPath('research/questions')}#${r.q.id.toLowerCase()}`">{{ r.q.id }}</a>
      <span v-if="r.q.status === 'draft'" class="draft-badge">{{ tr('draft') }}</span>
      · {{ r.q.text[l] }}
    </li>
  </ul>
</template>
