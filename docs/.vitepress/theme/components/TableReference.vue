<script setup lang="ts">
// One table reference page: what the table holds, who writes and reads it,
// and every column with its name, type and the data page that explains it.
// On the "functions" page it lists the database functions by group instead.
import { computed } from 'vue'
import { data } from '../inventory.data'
import { functionGroups, tableRefs } from '../../data/reference'
import { anchorOf, useLang } from '../composables'

const props = defineProps<{ page: string }>()
const { l, tr, name, localPath } = useLang()

const info = computed(() => tableRefs[props.page])
const tableKey = (i: { table?: string; id: string }) => (i.id.startsWith('dashboard.') ? i.id.split('.').slice(0, 2).join('.') : i.table)
const columns = (table: string) => data.items.filter((i) => i.level === 'column' && tableKey(i) === table)
const events = computed(() => (props.page === 'events' ? data.items.filter((i) => i.level === 'event') : []))
const link = (i: { page?: string; anchor?: string }) =>
  i.page?.startsWith('data/') || i.page?.startsWith('research/') ? `${localPath(i.page)}${i.anchor ? `#${i.anchor}` : ''}` : undefined
const storage = computed(() => data.items.filter((i) => i.level === 'storage'))
</script>

<template>
  <div v-if="info" class="tref">
    <p>{{ info.what[l] }}</p>
    <dl class="tref-facts">
      <dt>{{ tr('writtenBy') }}</dt>
      <dd>{{ info.writer[l] }}</dd>
      <dt>{{ tr('readAccess') }}</dt>
      <dd>{{ info.read[l] }}</dd>
    </dl>
    <div v-for="table in info.tables" :key="table" class="tref-table">
      <h3 v-if="info.tables.length > 1" :id="anchorOf(table)"><code>{{ table }}</code></h3>
      <table>
        <thead>
          <tr>
            <th>{{ tr('column') }}</th>
            <th>{{ tr('name') }}</th>
            <th>{{ tr('dataType') }}</th>
            <th>{{ tr('dataPage') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="c in columns(table)" :id="anchorOf(c.id)" :key="c.id">
            <td><code>{{ c.column }}</code></td>
            <td>{{ name(c.id) }}</td>
            <td><code>{{ c.type }}</code></td>
            <td><a v-if="link(c)" :href="link(c)">{{ tr('dataPage') }}</a><span v-else>–</span></td>
          </tr>
        </tbody>
      </table>
    </div>
    <template v-if="events.length">
      <h3 id="event-types">event_type</h3>
      <ul>
        <li v-for="e in events" :id="anchorOf(e.id)" :key="e.id">
          <code>{{ e.id.slice(6) }}</code>: <a v-if="link(e)" :href="link(e)">{{ name(e.id) }}</a><span v-else>{{ name(e.id) }}</span>
        </li>
      </ul>
    </template>
  </div>

  <div v-else-if="props.page === 'functions'" class="tref">
    <section v-for="g in functionGroups" :key="g.id">
      <h3 :id="g.id">{{ g.title[l] }}</h3>
      <p>{{ g.text[l] }}</p>
      <ul class="tref-functions">
        <li v-for="f in g.ids" :id="anchorOf(`function.${f}`)" :key="f"><code>{{ f }}</code></li>
      </ul>
    </section>
    <section v-for="s in storage" :key="s.id">
      <h3 :id="anchorOf(s.id)">{{ name(s.id) }}</h3>
    </section>
  </div>
</template>

<style scoped>
.tref-facts {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 4px 16px;
  font-size: 14px;
}
.tref-facts dt {
  font-weight: 600;
}
.tref-facts dd {
  margin: 0;
}
.tref-table {
  overflow-x: auto;
}
.tref-table table {
  font-size: 13px;
}
.tref-functions {
  columns: 2 240px;
  font-size: 13px;
}
</style>
