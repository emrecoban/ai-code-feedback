<script setup lang="ts">
// Cleaning and exclusion rules C1 to C14 (data in research.ts). Every rule is
// a proposal until confirmed, so each carries a CONFIRM badge.
import { cleaning } from '../../data/research'
import { useLang } from '../composables'
import Todo from './Todo.vue'

const { l, tr } = useLang()
</script>

<template>
  <div class="rules">
    <section v-for="r in cleaning" :key="r.id" class="rule">
      <h3 :id="`rule-${r.id.toLowerCase()}`">{{ r.id }}</h3>
      <p class="rule-text">{{ r.rule[l] }} <Todo kind="confirm" /></p>
      <p><strong>{{ tr('why') }}:</strong> {{ r.why[l] }}</p>
      <p v-if="r.sample" class="rule-sample">✓ {{ tr('appliedInSample') }}</p>
    </section>
  </div>
</template>

<style scoped>
.rule {
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 8px;
}
.rule h3 {
  margin-top: 8px;
}
.rule-text {
  font-weight: 500;
}
.rule-sample {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
</style>
