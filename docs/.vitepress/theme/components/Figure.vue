<script setup lang="ts">
// Wrapper for every visual: the chart, the "Synthetic sample data" label and
// a one-line takeaway (the #takeaway slot, written in the page's language).
import { useLang } from '../composables'

const { tr } = useLang()
</script>

<template>
  <figure class="figure">
    <slot />
    <figcaption class="figure-caption">
      <span class="synthetic">{{ tr('synthetic') }}</span>
      <p class="takeaway"><slot name="takeaway" /></p>
    </figcaption>
  </figure>
</template>
