// Build-time loader: the pages only need a small part of inventory.json.
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineLoader } from 'vitepress'

export interface ItemLite {
  id: string
  kind: 'raw' | 'derived'
  level: string
  category: string
  table?: string
  column?: string
  type?: string
  page?: string
  anchor?: string
  formula_version?: string
  computed_in?: string
  sources: string[]
  research: boolean
  status: string
  stage: string[]
}

declare const data: { items: ItemLite[]; snapshot: { commit: string; read_on: string } }
export { data }

const file = resolve(dirname(fileURLToPath(import.meta.url)), '../data/inventory.json')

export default defineLoader({
  watch: [file],
  load() {
    const inv = JSON.parse(readFileSync(file, 'utf8'))
    return {
      snapshot: inv.code_snapshot,
      items: inv.items
        .map((i: ItemLite) => ({
          id: i.id, kind: i.kind, level: i.level, category: i.category, table: i.table, column: i.column,
          type: i.type, page: i.page, anchor: i.anchor, formula_version: i.formula_version,
          computed_in: i.computed_in, sources: i.sources, research: i.research, status: i.status, stage: i.stage,
        })),
    }
  },
})
