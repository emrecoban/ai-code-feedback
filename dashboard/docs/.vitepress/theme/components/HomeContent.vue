<script setup lang="ts">
// Home page body, rendered from .vitepress/data/project.ts in the page's language.
import { computed, ref } from 'vue'
import { project, type Fact } from '../../data/project'
import type { T3 } from '../../data/terms'
import FactText from './FactText.vue'
import HowItWorks from './HowItWorks.vue'
import { useLang } from '../composables'

const { l, locale, tr } = useLang()
const dev = project.developer
const pub = project.publications[0]

const date = (iso: string) =>
  new Intl.DateTimeFormat(locale.value, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${iso}T00:00:00Z`))
const when = (w: string | T3 | Fact): Fact =>
  typeof w === 'string' ? (/^\d{4}-\d{2}-\d{2}$/.test(w) ? date(w) : w) : 'en' in w ? (w as T3)[l.value] : (w as Fact)
const pages = computed(() => (typeof pub.pages === 'string' ? pub.pages : null))

const bibtex = computed(
  () => `@inproceedings{${pub.id},
  author    = {${pub.authorsBib}},
  title     = {{AI Code Feedback}: An {AI}-Based Companion for Enhancing Introductory Programming Education},
  booktitle = {${pub.proceedingsApa}},
  address   = {${pub.place}},
  year      = {${pub.year}},
  pages     = {${pages.value ?? 'TODO'}},
  publisher = {IEEE},
  doi       = {${pub.doi}}
}`,
)
const copied = ref(false)
async function copyBib() {
  await navigator.clipboard.writeText(bibtex.value)
  copied.value = true
  setTimeout(() => (copied.value = false), 1500)
}
</script>

<template>
  <div class="home-block">
    <p>{{ project.summary[l] }}</p>
    <p>
      <em>“{{ project.principle[l] }}”</em>
    </p>
    <ul>
      <li v-for="v in project.versions" :key="v.version">
        <strong>{{ v.version }}</strong> ({{ v.label[l] }}) · {{ date(v.date) }}
      </li>
    </ul>
    <p>
      <a :href="project.marketplaceUrl" target="_blank" rel="noreferrer">{{ project.marketplaceId }}</a>
    </p>

    <h2 id="features">{{ tr('features') }}</h2>
    <ClientOnly><HowItWorks /></ClientOnly>
    <ul>
      <li v-for="f in project.features[l]" :key="f">{{ f }}</li>
    </ul>

    <h2 id="developer">{{ tr('developer') }}</h2>
    <p>
      <strong>{{ dev.name }}</strong><br />
      {{ dev.role[l] }}<br />
      <em>“{{ dev.thesis }}”</em> · {{ dev.supervisor[l] }}<br />
      {{ dev.position[l] }}
    </p>
    <p>
      ORCID <a :href="`https://orcid.org/${dev.orcid}`" target="_blank" rel="noreferrer">{{ dev.orcid }}</a> ·
      GitHub <a :href="`https://github.com/${dev.github}`" target="_blank" rel="noreferrer">github.com/{{ dev.github }}</a> ·
      <a :href="`mailto:${dev.email}`">{{ dev.email }}</a>
    </p>

    <h2 id="publications">{{ tr('publications') }}</h2>
    <div class="citation">
      <span class="style">APA 7</span>
      {{ pub.authorsApa }} ({{ pub.year }}). {{ pub.titleApa }}. In <em>{{ pub.proceedingsApa }}</em>
      (pp. <FactText :fact="pub.pages" />). IEEE.
      <a :href="`https://doi.org/${pub.doi}`" target="_blank" rel="noreferrer">https://doi.org/{{ pub.doi }}</a>
    </div>
    <div class="citation">
      <span class="style">IEEE</span>
      {{ pub.authorsIeee }}, “{{ pub.title }},” in <em>{{ pub.proceedingsIeee }}</em>, {{ pub.place }},
      {{ pub.year }}, pp. <FactText :fact="pub.pages" />, doi: {{ pub.doi }}.
    </div>
    <div class="bibtex">
      <div class="language-bibtex vp-adaptive-theme"><pre><code>{{ bibtex }}</code></pre></div>
      <button type="button" @click="copyBib">{{ copied ? tr('copied') : tr('copy') }}</button>
    </div>
    <p v-if="!pages">BibTeX: <FactText :fact="pub.pages" /></p>

    <h2 id="phases">{{ tr('timeline') }}</h2>
    <ol class="timeline">
      <li v-for="(p, k) in project.phases" :key="k">
        <span class="when"><FactText :fact="when(p.when)" /></span>
        <span class="title">{{ p.title[l] }}</span>
        <p>
          <FactText :fact="p.text[l]" />
          <template v-for="(o, j) in p.open ?? []" :key="j"> <FactText :fact="o" /></template>
        </p>
      </li>
    </ol>
  </div>
</template>
