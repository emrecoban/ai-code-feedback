<script setup lang="ts">
// A visible placeholder for a fact that is still open: <Todo>…</Todo> or
// <Todo kind="confirm">…</Todo>. The label follows the page language.
import { useLang } from '../composables'

withDefaults(defineProps<{ kind?: 'todo' | 'confirm' }>(), { kind: 'todo' })
const { tr } = useLang()
</script>

<template>
  <span class="todo-badge" :class="kind"><strong>{{ tr(kind) }}</strong> <slot /></span>
</template>
