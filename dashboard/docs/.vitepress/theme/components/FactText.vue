<script setup lang="ts">
// Renders one fact from project.ts: plain text, or a TODO / CONFIRM placeholder.
import type { Fact } from '../../data/project'
import Todo from './Todo.vue'
import { useLang } from '../composables'

defineProps<{ fact: Fact }>()
const { l } = useLang()
</script>

<template>
  <span v-if="typeof fact === 'string'">{{ fact }}</span>
  <Todo v-else-if="'todo' in fact">{{ fact.todo[l] }}</Todo>
  <span v-else>
    <span v-if="fact.value">{{ fact.value }} </span>
    <Todo kind="confirm">{{ fact.confirm[l] }}</Todo>
  </span>
</template>
