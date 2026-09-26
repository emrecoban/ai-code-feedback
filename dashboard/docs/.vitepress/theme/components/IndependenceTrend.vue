<script setup lang="ts">
// The three weekly rates of the dashboard's "Independence trend", as small
// multiples: the featured student, the whole class, and the middle half of
// the class (25th-75th percentile of the students' own weekly values).
// Values come from dashboard.weekly_trend run on the synthetic sample.
import { computed } from 'vue'
import view from '@data/sample/views/independence-trend.json'
import LineChart from './LineChart.vue'
import { useLang } from '../composables'

const props = withDefaults(defineProps<{ only?: 'pct_offers_taken' | 'pct_hint_enough' | 'pct_sessions_without_help' }>(), {})

const { tr, name, pct } = useLang()
// Panel titles are the dashboard's own trend labels.
const RATE_ITEMS = {
  pct_offers_taken: 'metric.pct_offers_taken',
  pct_hint_enough: 'metric.hint_enough_pct',
  pct_sessions_without_help: 'metric.sessions_without_help_pct',
} as const
type Rate = keyof typeof RATE_ITEMS

const rates = computed(() => (props.only ? [props.only] : (Object.keys(RATE_ITEMS) as Rate[])))
const ticks = view.weeks.map((w) => String(w.week))
const title = (rate: Rate) => name(RATE_ITEMS[rate])
</script>

<template>
  <div>
    <ul class="chart-legend">
      <li><span class="key-line" aria-hidden="true" />{{ view.featured }}</li>
      <li><span class="key-line class" aria-hidden="true" />{{ tr('class') }}</li>
      <li><span class="key-band" aria-hidden="true" />{{ tr('middleHalf') }}</li>
    </ul>
    <div class="small-multiples">
      <div v-for="rate in rates" :key="rate">
        <p class="panel-title">{{ title(rate) }}</p>
        <LineChart
          :ticks="ticks"
          :featured="view.rates[rate].featured"
          :class-line="view.rates[rate].class"
          :band="{ lo: view.rates[rate].q1, hi: view.rates[rate].q3 }"
          :aria-label="`${title(rate)}: ${view.featured}, ${tr('class')}`"
        />
        <p class="axis-caption">{{ tr('week') }}</p>
      </div>
    </div>
    <details>
      <summary>{{ tr('showTable') }}</summary>
      <table>
        <thead>
          <tr>
            <th>{{ tr('week') }}</th>
            <template v-for="rate in rates" :key="rate">
              <th>{{ title(rate) }} · {{ view.featured }}</th>
              <th>{{ title(rate) }} · {{ tr('class') }}</th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(w, k) in view.weeks" :key="w.week">
            <td>{{ w.week }}</td>
            <template v-for="rate in rates" :key="rate">
              <td>{{ view.rates[rate].featured[k] == null ? tr('noData') : pct(view.rates[rate].featured[k]) }}</td>
              <td>{{ view.rates[rate].class[k] == null ? tr('noData') : pct(view.rates[rate].class[k]) }}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </details>
  </div>
</template>
