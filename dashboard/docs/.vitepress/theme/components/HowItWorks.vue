<script setup lang="ts">
// A short looping animation of one question: an error appears, the student
// asks, L0-L1 arrive, L2-L3 open only on request, and the extension stores
// what happened. Labels are the extension's and the dashboard's own words.
// Without motion (prefers-reduced-motion) it shows the last step and does
// not play by itself.
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { items, values, type T3 } from '../../data/terms'
import { useLang } from '../composables'

const { l, tr } = useLang()
const STEPS = 5
const step = ref(0)
const playing = ref(true)
const visible = ref(true)
let timer: ReturnType<typeof setInterval> | undefined
let observer: IntersectionObserver | undefined
const root = ref<HTMLElement>()

const T = (en: string, trText: string, es: string): T3 => ({ en, tr: trText, es })
const text = {
  codeLens: T('What does this mean?', 'Bu ne anlama geliyor?', '¿Qué significa esto?'),
  empty: T('Ask about an error or a selection.', 'Bir hata ya da seçim hakkında soru sor.', 'Pregunta por un error o por una selección.'),
  showRule: T('Show me the rule', 'Kuralı göster', 'Mostrar la regla'),
  showFix: T('Show me the fix', 'Düzeltmeyi göster', 'Mostrar la corrección'),
  l0: T('Python cannot find a value called totl at this point.', 'Python bu noktada totl adında bir değer bulamıyor.', 'Python no encuentra ningún valor llamado totl en este punto.'),
  l1: T('Which name did you give the sum in line 2?', '2. satırda toplama hangi adı verdin?', '¿Qué nombre le diste a la suma en la línea 2?'),
  l2: T('A name must be written the same way every time it is used.', 'Bir ad her kullanıldığında aynı biçimde yazılmalıdır.', 'Un nombre debe escribirse igual cada vez que se usa.'),
  l3: T('In line 5, change totl to total.', '5. satırda totl yerine total yaz.', 'En la línea 5, cambia totl por total.'),
  database: T('Database (Supabase)', 'Veritabanı (Supabase)', 'Base de datos (Supabase)'),
  dashboard: T('Research dashboard', 'Araştırma paneli', 'Panel de investigación'),
}
const captions: T3[] = [
  T('An error appears in the code. Nothing is sent yet.', 'Kodda bir hata çıkıyor. Henüz hiçbir şey gönderilmiyor.', 'Aparece un error en el código. Todavía no se envía nada.'),
  T('The student decides to ask. Only now the code around the error goes to the AI service.', 'Öğrenci sormaya karar veriyor. Hatanın çevresindeki kod ancak şimdi yapay zekâ servisine gider.', 'El estudiante decide preguntar. Solo ahora el código cercano al error va al servicio de IA.'),
  T('Decode (L0) and Locate (L1) appear first.', 'Önce Çöz (L0) ve Bul (L1) görünür.', 'Primero aparecen Descifrar (L0) y Ubicar (L1).'),
  T('The rule (L2) and the fix (L3) open only if the student asks for them.', 'Kural (L2) ve düzeltme (L3) yalnızca öğrenci isterse açılır.', 'La regla (L2) y la corrección (L3) solo se abren si el estudiante las pide.'),
  T('The extension stores what happened: clicks, times and counts. The code sent to the AI is not stored. The dashboard shows the data to the teacher.', 'Eklenti olanları kaydeder: tıklamalar, süreler ve sayılar. Yapay zekâya giden kod saklanmaz. Panel bu veriyi öğretmene gösterir.', 'La extensión guarda lo que pasó: clics, tiempos y recuentos. El código enviado a la IA no se guarda. El panel muestra los datos al profesorado.'),
]
const chips = ['event.level_reached', 'event.returned_to_code', 'event.diagnostic_resolved', 'coding_sessions.active_seconds']
const at = (k: number) => step.value >= k
const caption = computed(() => captions[step.value][l.value])

function start() {
  stop()
  timer = setInterval(() => {
    if (playing.value && visible.value) step.value = (step.value + 1) % STEPS
  }, 3600)
}
function stop() {
  if (timer) clearInterval(timer)
  timer = undefined
}
function go(k: number) {
  step.value = k
  playing.value = false
}
function toggle() {
  playing.value = !playing.value
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    playing.value = false
    step.value = STEPS - 1
  }
  if (root.value && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(([e]) => (visible.value = e.isIntersecting))
    observer.observe(root.value)
  }
  start()
})
onBeforeUnmount(() => {
  stop()
  observer?.disconnect()
})
</script>

<template>
  <figure ref="root" class="hiw" :aria-label="tr('howItWorks')">
    <div class="hiw-stage">
      <!-- Editor -->
      <div class="hiw-editor" aria-hidden="true">
        <div class="hiw-titlebar"><span /><span /><span /> lab3_loops.py</div>
        <pre class="hiw-code"><span class="ln">1</span>numbers = [3, 5, 8]
<span class="ln">2</span>total = 0
<span class="ln">3</span>for n in numbers:
<span class="ln">4</span>    total = total + n
<span class="hiw-lens" :class="{ show: at(0), pressed: at(1) }"><span class="ln" />{{ text.codeLens[l] }}<span class="hiw-cursor" :class="{ click: at(1) }" /></span><span class="ln">5</span>print(<span class="hiw-err" :class="{ show: at(0) }">totl</span>)</pre>
      </div>

      <!-- Extension panel -->
      <div class="hiw-panel" aria-hidden="true">
        <div class="hiw-panel-title">AI Code Feedback</div>
        <p v-if="!at(2)" class="hiw-empty">{{ text.empty[l] }}</p>
        <div class="hiw-card" :class="{ show: at(2) }"><b>{{ values.ladder.L0[l] }}</b>{{ text.l0[l] }}</div>
        <div class="hiw-card" :class="{ show: at(2) }"><b>{{ values.ladder.L1[l] }}</b>{{ text.l1[l] }}</div>
        <div class="hiw-buttons" :class="{ show: at(2) && !at(3) }">
          <span class="hiw-btn">{{ text.showRule[l] }}</span>
        </div>
        <div class="hiw-card deep" :class="{ show: at(3) }"><b>{{ values.ladder.L2[l] }}</b>{{ text.l2[l] }}</div>
        <div class="hiw-card deep" :class="{ show: at(3) }"><b>{{ values.ladder.L3[l] }}</b>{{ text.l3[l] }}</div>
      </div>
    </div>

    <!-- Data -->
    <div class="hiw-data" :class="{ show: at(4) }" aria-hidden="true">
      <div class="hiw-chips">
        <span v-for="(c, k) in chips" :key="c" class="hiw-chip" :style="{ transitionDelay: `${k * 180}ms` }">{{ items[c][l] }}</span>
      </div>
      <span class="hiw-arrow">↳</span>
      <span class="hiw-db">{{ text.database[l] }}</span>
      <span class="hiw-arrow">→</span>
      <span class="hiw-dash">
        {{ text.dashboard[l] }}
        <span class="hiw-bars"><i style="--h: 40%" /><i style="--h: 70%" /><i style="--h: 55%" /><i style="--h: 85%" /></span>
      </span>
    </div>

    <figcaption class="hiw-caption" aria-live="polite">
      <span class="hiw-step">{{ tr('stepN', { n: step + 1 }) }}</span> {{ caption }}
    </figcaption>
    <div class="hiw-controls">
      <button type="button" class="hiw-play" @click="toggle">{{ playing ? tr('pause') : tr('play') }}</button>
      <button
        v-for="k in STEPS"
        :key="k"
        type="button"
        class="hiw-dot"
        :class="{ active: step === k - 1 }"
        :aria-label="tr('stepN', { n: k })"
        :aria-current="step === k - 1 ? 'step' : undefined"
        @click="go(k - 1)"
      />
    </div>
  </figure>
</template>

<style scoped>
.hiw {
  margin: 16px 0 24px;
  padding: 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
}
.hiw-stage {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 14px;
  min-height: 250px;
}
@media (max-width: 640px) {
  .hiw-stage {
    grid-template-columns: 1fr;
  }
}
.hiw-editor,
.hiw-panel {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  overflow: hidden;
}
.hiw-titlebar {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 10px;
  font-size: 12px;
  color: var(--vp-c-text-2);
  border-bottom: 1px solid var(--vp-c-divider);
}
.hiw-titlebar span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-default-2);
}
.hiw-code {
  margin: 0;
  padding: 10px 12px;
  font-family: var(--vp-font-family-mono);
  font-size: 13px;
  line-height: 1.75;
  white-space: pre;
  overflow-x: auto;
  background: transparent;
}
.ln {
  display: inline-block;
  width: 22px;
  color: var(--vp-c-text-3);
}
.hiw-lens {
  position: relative;
  display: block;
  font-family: var(--vp-font-family-base);
  font-size: 12px;
  color: var(--vp-c-text-2);
  opacity: 0;
  transition: opacity 0.4s;
}
.hiw-lens.show {
  opacity: 1;
}
.hiw-lens.pressed {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}
.hiw-err {
  text-decoration: none;
  transition: text-decoration-color 0.4s;
}
.hiw-err.show {
  text-decoration: underline wavy #e5484d;
  text-underline-offset: 3px;
}
.hiw-cursor {
  position: absolute;
  left: 64px;
  top: 4px;
  width: 12px;
  height: 16px;
  background: var(--vp-c-text-1);
  clip-path: polygon(0 0, 0 100%, 30% 72%, 55% 100%, 70% 92%, 45% 66%, 100% 66%);
  opacity: 0;
  transform: translate(60px, 50px);
  transition: transform 0.9s ease, opacity 0.3s;
}
.hiw-cursor.click {
  opacity: 1;
  transform: translate(0, 0);
}
.hiw-panel {
  padding: 10px 12px;
  font-size: 13px;
}
.hiw-panel-title {
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.02em;
  color: var(--vp-c-text-2);
}
.hiw-empty {
  margin: 0;
  color: var(--vp-c-text-3);
}
.hiw-card {
  margin: 0 0 8px;
  padding: 6px 8px;
  border-left: 3px solid var(--vp-c-brand-3);
  border-radius: 0 6px 6px 0;
  background: var(--vp-c-bg-soft);
  line-height: 1.4;
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  transform: translateY(6px);
  transition: opacity 0.5s, transform 0.5s, max-height 0.5s;
}
.hiw-card b {
  display: block;
  font-size: 11px;
  color: var(--vp-c-text-2);
}
.hiw-card.deep {
  border-left-color: #104281;
}
.dark .hiw-card.deep {
  border-left-color: #86b6ef;
}
.hiw-card.show {
  opacity: 1;
  max-height: 120px;
  transform: none;
}
.hiw-buttons {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.4s, max-height 0.4s;
}
.hiw-buttons.show {
  max-height: 40px;
  margin-bottom: 8px;
  opacity: 1;
}
.hiw-btn {
  display: inline-block;
  padding: 2px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 12px;
  background: var(--vp-c-bg);
}
.hiw-data {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 14px;
  min-height: 44px;
  font-size: 12px;
  opacity: 0.25;
  transition: opacity 0.5s;
}
.hiw-data.show {
  opacity: 1;
}
.hiw-chips {
  display: flex;
  flex-basis: 100%;
  flex-wrap: wrap;
  gap: 6px;
}
.hiw-chip {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  transform: translateX(-8px);
  opacity: 0;
  transition: transform 0.5s, opacity 0.5s;
}
.hiw-data.show .hiw-chip {
  transform: none;
  opacity: 1;
}
.hiw-arrow {
  color: var(--vp-c-text-3);
}
.hiw-db,
.hiw-dash {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
}
.hiw-bars {
  display: inline-flex;
  align-items: flex-end;
  gap: 2px;
  height: 18px;
}
.hiw-bars i {
  width: 5px;
  height: 0;
  background: var(--vp-c-brand-3);
  transition: height 0.8s 0.6s;
}
.hiw-data.show .hiw-bars i {
  height: var(--h);
}
.hiw-caption {
  margin-top: 12px;
  font-size: 15px;
  line-height: 1.5;
  min-height: 3em;
}
.hiw-step {
  margin-right: 6px;
  font-size: 12px;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}
.hiw-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
}
.hiw-play {
  padding: 2px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  font-size: 13px;
  background: var(--vp-c-bg);
}
.hiw-dot {
  width: 10px;
  height: 10px;
  padding: 0;
  border-radius: 50%;
  background: var(--vp-c-default-3);
}
.hiw-dot.active {
  background: var(--vp-c-brand-1);
}
@media (prefers-reduced-motion: reduce) {
  .hiw * {
    transition: none !important;
  }
}
</style>
