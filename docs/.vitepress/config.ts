import { defineConfig, type DefaultTheme } from 'vitepress'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { a11y, categories, langOf, ui, type Lang } from './data/terms'
import { dataTree, draftPages, endPages, referencePages, researchPages, topPages } from './data/site'
import { ethicsPagePublished } from './data/project'

const here = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(here, '../src')
// Drafts (the ethics page) show in `docs:dev`, and in a build only with DOCS_DRAFTS=1.
const showDrafts = process.argv.includes('dev') || process.env.DOCS_DRAFTS === '1'
const excludeDrafts = !ethicsPagePublished && !showDrafts

const prefix = (l: Lang) => (l === 'en' ? '' : `${l}/`)

function frontmatterTitle(file: string): string | undefined {
  if (!existsSync(file)) return undefined
  const fm = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const title = fm?.[1].match(/^title:\s*(.+)$/m)?.[1].trim()
  return title?.replace(/^(['"])(.*)\1$/, '$2')
}

function pageLink(l: Lang, page: string): DefaultTheme.SidebarItem | undefined {
  const title = frontmatterTitle(resolve(srcDir, `${prefix(l)}${page}.md`))
  if (!title) return undefined
  const path = page === 'index' ? '' : page
  return { text: title, link: `/${prefix(l)}${path}` }
}

const present = <T>(xs: (T | undefined)[]) => xs.filter((x): x is T => !!x)

function sidebar(l: Lang): DefaultTheme.SidebarItem[] {
  // One flat level: every data page sits directly under "Data pages", in the
  // order of site.ts, with no category sub-menus.
  const groups: DefaultTheme.SidebarItem[] = [{ items: present(topPages.map((p) => pageLink(l, p))) }]
  const data = present(dataTree.flatMap((g) => g.pages.map((p) => pageLink(l, `data/${g.category}/${p}`))))
  if (data.length) groups.push({ text: ui.dataPages[l], items: data })
  const reference = present(referencePages.map((p) => pageLink(l, `reference/${p}`)))
  if (reference.length) groups.push({ text: ui.tableReference[l], items: reference })
  const research = present(researchPages.map((p) => pageLink(l, p)))
  if (research.length) groups.push({ text: ui.research[l], items: research })
  const end = present([...(excludeDrafts ? [] : draftPages), ...endPages].map((p) => pageLink(l, p)))
  if (end.length) groups.push({ items: end })
  return groups
}

function themeFor(l: Lang): DefaultTheme.Config {
  return {
    // No top menu: everything is reached from the sidebar.
    nav: [],
    sidebar: sidebar(l),
    outline: { level: [2, 3], label: ui.outline[l] },
    docFooter: { prev: ui.prev[l], next: ui.next[l] },
    darkModeSwitchLabel: ui.darkMode[l],
    lightModeSwitchTitle: ui.lightTitle[l],
    darkModeSwitchTitle: ui.darkTitle[l],
    sidebarMenuLabel: ui.menu[l],
    returnToTopLabel: ui.returnToTop[l],
    langMenuLabel: ui.langMenu[l],
    skipToContentLabel: ui.skipToContent[l],
    notFound: {
      title: ui.notFoundTitle[l],
      quote: ui.notFoundQuote[l],
      linkLabel: ui.notFoundLink[l],
      linkText: ui.notFoundLink[l],
      code: '404',
    },
  }
}

function searchTranslations(l: Lang) {
  return {
    button: { buttonText: ui.searchButton[l], buttonAriaLabel: ui.searchButton[l] },
    modal: {
      displayDetails: ui.searchDetails[l],
      resetButtonTitle: ui.searchReset[l],
      backButtonTitle: ui.searchBack[l],
      noResultsText: ui.searchNoResults[l],
      footer: {
        selectText: ui.searchSelect[l],
        selectKeyAriaLabel: 'Enter',
        navigateText: ui.searchNavigate[l],
        navigateUpKeyAriaLabel: '↑',
        navigateDownKeyAriaLabel: '↓',
        closeText: ui.searchClose[l],
        closeKeyAriaLabel: 'Esc',
      },
    },
  }
}

export default defineConfig({
  srcDir: 'src',
  srcExclude: excludeDrafts ? draftPages.flatMap((p) => [`${p}.md`, `tr/${p}.md`, `es/${p}.md`]) : [],
  cleanUrls: true,
  lastUpdated: false,
  appearance: true,
  head: [['meta', { name: 'theme-color', content: '#2a78d6' }]],

  locales: {
    root: { label: 'English', lang: 'en-US', title: ui.siteTitle.en, description: ui.siteDescription.en, themeConfig: themeFor('en') },
    tr: { label: 'Türkçe', lang: 'tr-TR', link: '/tr/', title: ui.siteTitle.tr, description: ui.siteDescription.tr, themeConfig: themeFor('tr') },
    es: { label: 'Español', lang: 'es-ES', link: '/es/', title: ui.siteTitle.es, description: ui.siteDescription.es, themeConfig: themeFor('es') },
  },

  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: { translations: searchTranslations('en') },
          tr: { translations: searchTranslations('tr') },
          es: { translations: searchTranslations('es') },
        },
      },
    },
  },

  markdown: {
    // Container titles are always written in the page itself. The copy button
    // of code blocks and the heading links get their labels in the page's
    // language here (VitePress writes them in English).
    config(md) {
      const langOfEnv = (env: { relativePath?: string }) => langOf(String(env.relativePath ?? '').split('/')[0])
      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = (tokens, idx, options, env, self) =>
        fence(tokens, idx, options, env, self).replace('title="Copy Code"', `title="${ui.copyCode[langOfEnv(env)]}"`)
      md.core.ruler.push('localized_permalinks', (state) => {
        const l = langOfEnv(state.env)
        for (const token of state.tokens) {
          for (const child of token.children ?? []) {
            const label = child.type === 'link_open' ? child.attrGet('aria-label') : null
            const m = label?.match(/^Permalink to "(.*)"$/s)
            if (m) child.attrSet('aria-label', ui.permalink[l].replace('{title}', m[1].replace(/\s*\{#[^}]+\}\s*$/, '')))
          }
        }
      })
    },
  },

  // English-only screen-reader labels of the default theme, in the page's language.
  transformHtml(code, _id, { pageData }) {
    const l = langOf(pageData.relativePath.split('/')[0])
    if (l === 'en') return code
    return Object.entries(a11y).reduce(
      (html, [english, t3]) => html.replaceAll(`>${english}<`, `>${t3[l]}<`).replaceAll(`"${english}"`, `"${t3[l]}"`).replaceAll(` ${english} <`, ` ${t3[l]} <`),
      code,
    )
  },

  vite: {
    resolve: { alias: { '@data': resolve(here, 'data') } },
  },
})
