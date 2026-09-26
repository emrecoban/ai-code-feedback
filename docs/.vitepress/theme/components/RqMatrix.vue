<script setup lang="ts">
// Research questions × data categories. Each cell lists the items of that
// category that serve the question, with their role. A second list shows the
// research items that serve no question yet.
import { computed } from 'vue'
import { data } from '../inventory.data'
import { categories } from '../../data/terms'
import { matrix, questions, type Role } from '../../data/research'
import { anchorOf, useLang } from '../composables'

const props = withDefaults(defineProps<{ part?: 'questions' | 'matrix' | 'unused' }>(), { part: 'matrix' })
const { l, tr, name, localPath } = useLang()
const roleKey: Record<Role, 'roleOutcome' | 'rolePredictor' | 'roleModerator' | 'roleDescriptive'> = {
  outcome: 'roleOutcome', predictor: 'rolePredictor', moderator: 'roleModerator', descriptive: 'roleDescriptive',
}
const byId = new Map(data.items.map((i) => [i.id, i]))
const mapped = Object.keys(matrix)
const columns = computed(() =>
  Object.keys(categories).filter((c) => mapped.some((id) => byId.get(id)?.category === c)),
)
const cell = (rq: string, category: string) =>
  mapped
    .filter((id) => byId.get(id)?.category === category && matrix[id][rq])
    .map((id) => ({ id, role: matrix[id][rq]! }))
const link = (id: string) => {
  const i = byId.get(id)
  return i?.page ? `${localPath(i.page)}${i.anchor ? `#${i.anchor}` : ''}` : undefined
}
const unused = computed(() =>
  data.items.filter((i) => i.research && i.status === 'active' && i.level !== 'payload' && !matrix[i.id] && i.page?.startsWith('data/')),
)
</script>

<template>
  <div v-if="props.part === 'questions'">
    <div v-for="q in questions" :key="q.id">
      <h3 :id="q.id.toLowerCase()">
        {{ q.id }} <span v-if="q.status === 'draft'" class="draft-badge">{{ tr('draft') }}</span>
      </h3>
      <p>{{ q.text[l] }}</p>
    </div>
  </div>

  <div v-else-if="props.part === 'matrix'" style="overflow-x: auto">
    <table>
      <thead>
        <tr>
          <th />
          <th v-for="c in columns" :key="c">{{ categories[c][l] }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="q in questions" :key="q.id">
          <th><a :href="`#${q.id.toLowerCase()}`">{{ q.id }}</a></th>
          <td v-for="c in columns" :key="c">
            <div v-for="x in cell(q.id, c)" :key="x.id">
              <a v-if="link(x.id)" :href="link(x.id)">{{ name(x.id) }}</a><span v-else>{{ name(x.id) }}</span>
              <span class="role"> · {{ tr(roleKey[x.role]) }}</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <ul v-else>
    <li v-for="i in unused" :key="i.id" :id="anchorOf(i.id)">
      <a v-if="link(i.id)" :href="link(i.id)">{{ name(i.id) }}</a> <code>{{ i.id }}</code>
    </li>
  </ul>
</template>
