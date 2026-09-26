import DefaultTheme from 'vitepress/theme'
import { useData, useRoute, type Theme } from 'vitepress'
import { nextTick, onMounted, watch } from 'vue'
import { a11y, langOf } from '../data/terms'
import './style.css'
import ChangelogTable from './components/ChangelogTable.vue'
import CleaningRules from './components/CleaningRules.vue'
import DataFlow from './components/DataFlow.vue'
import DataGlance from './components/DataGlance.vue'
import Downloads from './components/Downloads.vue'
import FactText from './components/FactText.vue'
import Figure from './components/Figure.vue'
import FormulaVersion from './components/FormulaVersion.vue'
import HomeContent from './components/HomeContent.vue'
import IndependenceTrend from './components/IndependenceTrend.vue'
import LineChart from './components/LineChart.vue'
import LinkingExample from './components/LinkingExample.vue'
import RqList from './components/RqList.vue'
import RqMatrix from './components/RqMatrix.vue'
import SampleVisual from './components/SampleVisual.vue'
import TableReference from './components/TableReference.vue'
import Todo from './components/Todo.vue'

/** Puts the default theme's English-only screen-reader labels into the page's language. */
function translateA11yLabels(lang: string) {
  const l = langOf(lang)
  const label = (english: string) => a11y[english][l]
  for (const [id, english] of [['main-nav-aria-label', 'Main Navigation'], ['sidebar-aria-label', 'Sidebar Navigation'], ['doc-footer-aria-label', 'Pager']]) {
    const el = document.getElementById(id)
    if (el) el.textContent = label(english)
  }
  for (const [selector, english] of [['.VPNavBarExtra button', 'extra navigation'], ['.VPNavBarHamburger', 'mobile navigation'], ['.VPSidebarItem .caret', 'toggle section']]) {
    document.querySelectorAll(selector).forEach((el) => el.setAttribute('aria-label', label(english)))
  }
}

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    for (const [name, component] of Object.entries({
      ChangelogTable, CleaningRules, DataFlow, DataGlance, Downloads, FactText, Figure, FormulaVersion, HomeContent, IndependenceTrend,
      LineChart, LinkingExample, RqList, RqMatrix, SampleVisual, TableReference, Todo,
    })) {
      app.component(name, component)
    }
  },
  setup() {
    const route = useRoute()
    const { lang } = useData()
    const run = () => nextTick(() => translateA11yLabels(lang.value))
    onMounted(run)
    watch(() => [route.path, lang.value], run)
  },
} satisfies Theme
