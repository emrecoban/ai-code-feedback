// Research questions for the 0.2.0 data, and how each data item serves them.
// All questions are DRAFT until the developer confirms them. The questions of
// the combined manuscript are not listed here until it is published.

import type { T3 } from './terms'

export type Role = 'outcome' | 'predictor' | 'moderator' | 'descriptive'

export interface ResearchQuestion {
  id: string
  status: 'draft' | 'confirmed'
  text: T3
}

export const questions: ResearchQuestion[] = [
  {
    id: 'RQ1',
    status: 'draft',
    text: {
      en: 'How do students seek help inside the extension (which entry points, how often, and when during a lab session)?',
      tr: 'Öğrenciler eklenti içinde nasıl yardım istiyor (hangi giriş noktalarından, ne sıklıkla ve laboratuvar oturumunun hangi anında)?',
      es: '¿Cómo piden ayuda los estudiantes dentro de la extensión (por qué puntos de entrada, con qué frecuencia y en qué momento de la sesión de laboratorio)?',
    },
  },
  {
    id: 'RQ2',
    status: 'draft',
    text: {
      en: 'How far do students go down the four-step ladder (Decode, Locate, Concept, Fix), and does this depth change over the weeks?',
      tr: 'Öğrenciler dört adımlı merdivende (Çöz, Bul, Kavram, Düzeltme) ne kadar ilerliyor ve bu derinlik haftalar içinde değişiyor mu?',
      es: '¿Hasta dónde llegan los estudiantes en la escalera de cuatro pasos (Descifrar, Ubicar, Concepto, Corrección) y cambia esta profundidad con las semanas?',
    },
  },
  {
    id: 'RQ3',
    status: 'draft',
    text: {
      en: 'Does independence (errors resolved without asking, or with the first steps only) increase over the weeks?',
      tr: 'Bağımsızlık (sormadan ya da yalnızca ilk adımlarla çözülen hatalar) haftalar içinde artıyor mu?',
      es: '¿Aumenta la autonomía (errores resueltos sin preguntar o solo con los primeros pasos) a lo largo de las semanas?',
    },
  },
  {
    id: 'RQ4',
    status: 'draft',
    text: {
      en: 'Are help-seeking and independence patterns associated with learning gain from pre-test to post-test?',
      tr: 'Yardım isteme ve bağımsızlık örüntüleri, ön testten son teste öğrenme kazancıyla ilişkili mi?',
      es: '¿Se asocian los patrones de búsqueda de ayuda y de autonomía con la ganancia de aprendizaje del pretest al postest?',
    },
  },
  {
    id: 'RQ5',
    status: 'draft',
    text: {
      en: 'Is technology acceptance (TAM) associated with in-extension usage patterns?',
      tr: 'Teknoloji kabulü (TAM), eklenti içindeki kullanım örüntüleriyle ilişkili mi?',
      es: '¿Se asocia la aceptación tecnológica (TAM) con los patrones de uso dentro de la extensión?',
    },
  },
]

/** item id (inventory) -> research question -> role. Extended page by page. */
export const matrix: Record<string, Partial<Record<string, Role>>> = {
  'metric.pct_offers_taken': { RQ1: 'descriptive', RQ3: 'outcome', RQ4: 'predictor', RQ5: 'outcome' },
  'metric.pct_hint_enough_weekly': { RQ2: 'outcome', RQ3: 'outcome', RQ4: 'predictor' },
  'metric.pct_sessions_without_help_weekly': { RQ1: 'descriptive', RQ3: 'outcome', RQ4: 'predictor', RQ5: 'outcome' },
  'profiles.feedback_language': { RQ2: 'moderator', RQ4: 'moderator' },
  'coding_sessions.active_seconds': { RQ4: 'moderator', RQ5: 'predictor' },
  'coding_sessions.errors_resolved_without_asking': { RQ3: 'outcome', RQ4: 'predictor' },
  'coding_sessions.diagnostics_offered': { RQ1: 'descriptive', RQ3: 'descriptive' },
  'coding_sessions.focus_loss_count': { RQ1: 'descriptive' },
  'coding_sessions.follow_on_error_count': { RQ3: 'descriptive' },
  'interactions.trigger_source': { RQ1: 'descriptive', RQ2: 'moderator' },
  'interactions.trigger_surface': { RQ1: 'descriptive' },
  'interactions.question_type': { RQ1: 'descriptive', RQ2: 'moderator' },
  'interactions.free_text': { RQ1: 'descriptive' },
  'interactions.selection_line_count': { RQ1: 'descriptive', RQ2: 'predictor' },
  'interactions.error_code': { RQ1: 'descriptive', RQ2: 'moderator' },
  'interactions.help_latency_ms': { RQ1: 'descriptive', RQ3: 'outcome' },
  'interactions.edits_before_ask': { RQ1: 'descriptive', RQ3: 'outcome' },
  'interactions.recurring_error_count': { RQ3: 'outcome', RQ4: 'predictor' },
  'interactions.concept': { RQ2: 'moderator' },
  'interactions.recurring_concept_count': { RQ3: 'outcome' },
  'interactions.max_level_reached': { RQ2: 'outcome', RQ3: 'outcome', RQ4: 'predictor' },
  'interactions.helpful_rating': { RQ2: 'moderator', RQ5: 'outcome' },
  'interactions.self_reported_outcome': { RQ2: 'outcome', RQ3: 'outcome' },
  'interactions.post_confidence': { RQ3: 'predictor', RQ4: 'predictor' },
  'event.explanation_visibility.visibleMs': { RQ2: 'descriptive' },
  'event.returned_to_code.msToReturn': { RQ2: 'descriptive' },
  'event.post_feedback_edit.overlapRatio': { RQ2: 'outcome', RQ4: 'predictor' },
  'event.diagnostic_resolved.msToResolution': { RQ2: 'outcome' },
  'event.file_cleared.msWithErrors': { RQ3: 'outcome' },
  'event.question_picker_abandoned': { RQ1: 'descriptive', RQ5: 'outcome' },
  'event.request_failed': { RQ1: 'descriptive' },
  'metric.questions': { RQ1: 'outcome', RQ3: 'outcome', RQ4: 'predictor', RQ5: 'outcome' },
  'metric.active_coding_time': { RQ5: 'predictor' },
  'metric.sessions': { RQ5: 'predictor' },
  'metric.active_days': { RQ4: 'moderator', RQ5: 'predictor' },
  'metric.sessions_without_help_pct': { RQ3: 'outcome' },
  'metric.hint_enough_pct': { RQ2: 'outcome', RQ3: 'outcome', RQ4: 'predictor' },
  'metric.hint_depth_distribution': { RQ2: 'descriptive' },
  'metric.error_gone_pct': { RQ2: 'outcome', RQ3: 'outcome' },
  'metric.fixed_unaided': { RQ3: 'outcome' },
  'metric.edits_per_unaided_fix': { RQ3: 'descriptive' },
  'metric.rated_helpful_pct': { RQ5: 'outcome' },
  'metric.repeat_errors': { RQ3: 'outcome' },
  'metric.quick_repeats': { RQ2: 'outcome', RQ3: 'outcome' },
  'metric.avg_edits_before_ask': { RQ4: 'predictor' },
  'metric.median_help_latency': { RQ3: 'outcome' },
  'metric.reading_visible_median': { RQ2: 'descriptive' },
  'metric.reading_back_median': { RQ2: 'descriptive' },
  'metric.reading_to_rule_median': { RQ2: 'descriptive' },
  'metric.reading_to_fix_median': { RQ2: 'descriptive' },
  'metric.abandoned': { RQ2: 'descriptive' },
  'metric.reopened': { RQ4: 'predictor' },
  'metric.copied': { RQ2: 'descriptive', RQ4: 'predictor' },
  'metric.after_overlap_avg': { RQ2: 'descriptive' },
  'metric.surfaces': { RQ1: 'descriptive' },
  'metric.severity_mix': { RQ1: 'descriptive' },
  'metric.work_rhythm': { RQ1: 'descriptive' },
  'metric.calibration': { RQ3: 'descriptive' },
  'external.pre_total': { RQ4: 'descriptive' },
  'external.post_total': { RQ4: 'outcome' },
  'external.gain': { RQ4: 'outcome' },
  'external.tam_pu': { RQ5: 'predictor' },
  'external.tam_sn': { RQ5: 'predictor' },
  'external.tam_bi': { RQ5: 'predictor' },
  'external.tam_att': { RQ5: 'predictor' },
  'external.tam_au': { RQ5: 'predictor' },
}

/**
 * Data cleaning and exclusion rules. All are proposals (CONFIRM) until the
 * researcher confirms, changes or drops each one. `sample` marks the rules the
 * synthetic sample applies before any view or download is computed.
 */
export interface CleaningRule {
  id: string
  rule: T3
  why: T3
  sample: boolean
}

export const cleaning: CleaningRule[] = [
  {
    id: 'C1',
    rule: { en: 'Keep only students whose consent status is "granted".', tr: 'Yalnızca onay durumu "verildi" olan öğrencileri tutun.', es: 'Conserve solo a los estudiantes cuyo consentimiento sea «concedido».' },
    why: { en: 'The extension records all students, also those who declined or closed the dialog (issue I-01). Only consenting students may be analysed.', tr: 'Eklenti, reddeden ya da pencereyi kapatanlar da dahil olmak üzere tüm öğrencileri kaydeder (I-01 bulgusu). Yalnızca onay veren öğrenciler analiz edilebilir.', es: 'La extensión registra a todos los estudiantes, también a quienes rechazaron o cerraron el diálogo (incidencia I-01). Solo se pueden analizar quienes dieron su consentimiento.' },
    sample: true,
  },
  {
    id: 'C2',
    rule: { en: 'Remove test, developer and teacher accounts, using a list kept outside the repository.', tr: 'Depo dışında tutulan bir listeyi kullanarak test, geliştirici ve öğretmen hesaplarını çıkarın.', es: 'Elimine las cuentas de prueba, de desarrollo y del profesorado, con una lista guardada fuera del repositorio.' },
    why: { en: 'The system has no flag for such accounts (issue I-22), and their data would distort class values.', tr: 'Sistemde bu tür hesaplar için bir işaret yoktur (I-22 bulgusu) ve verileri sınıf değerlerini bozar.', es: 'El sistema no marca estas cuentas (incidencia I-22), y sus datos distorsionarían los valores de la clase.' },
    sample: true,
  },
  {
    id: 'C3',
    rule: { en: 'Merge usernames that belong to the same person, using the key table.', tr: 'Anahtar tabloyu kullanarak aynı kişiye ait kullanıcı adlarını birleştirin.', es: 'Una los nombres de usuario que pertenecen a la misma persona, con la tabla de claves.' },
    why: { en: 'A new or mistyped username silently creates a second account (issue I-21).', tr: 'Yeni ya da yanlış yazılmış bir kullanıcı adı sessizce ikinci bir hesap oluşturur (I-21 bulgusu).', es: 'Un nombre de usuario nuevo o mal escrito crea en silencio una segunda cuenta (incidencia I-21).' },
    sample: true,
  },
  {
    id: 'C4',
    rule: { en: 'Keep only data inside the study window, in one agreed time zone.', tr: 'Tek bir ortak saat diliminde, yalnızca çalışma dönemi içindeki verileri tutun.', es: 'Conserve solo los datos dentro del periodo del estudio, en una zona horaria acordada.' },
    why: { en: 'The dashboard, the student panel and the SQL reports use different time zones (issues I-15 and I-17).', tr: 'Panel, öğrenci paneli ve SQL raporları farklı saat dilimleri kullanır (I-15 ve I-17 bulguları).', es: 'El panel, el panel del estudiante y los informes SQL usan zonas horarias distintas (incidencias I-15 e I-17).' },
    sample: true,
  },
  {
    id: 'C5',
    rule: { en: 'Leave empty sessions (no active time, no questions, no events) out of session measures.', tr: 'Boş oturumları (aktif süre, soru ve olay olmayan) oturum ölçülerinin dışında bırakın.', es: 'Excluya de las medidas de sesión las sesiones vacías (sin tiempo activo, preguntas ni eventos).' },
    why: { en: 'A reload or a second window creates a session with no work in it (issue I-14).', tr: 'Yeniden yükleme ya da ikinci bir pencere içinde çalışma olmayan bir oturum oluşturur (I-14 bulgusu).', es: 'Recargar o abrir una segunda ventana crea una sesión sin trabajo (incidencia I-14).' },
    sample: true,
  },
  {
    id: 'C6',
    rule: { en: 'Keep one event of each kind per question for events that can happen only once.', tr: 'Yalnızca bir kez olabilen olaylar için soru başına her türden bir olay tutun.', es: 'Conserve un evento de cada tipo por pregunta en los eventos que solo pueden ocurrir una vez.' },
    why: { en: 'The server already ignores exact repeats, but a retry after a network error can still add a second row.', tr: 'Sunucu birebir tekrarları zaten yok sayar, ama ağ hatasından sonraki bir yeniden deneme yine de ikinci bir satır ekleyebilir.', es: 'El servidor ya ignora las repeticiones exactas, pero un reintento tras un error de red puede añadir una segunda fila.' },
    sample: false,
  },
  {
    id: 'C7',
    rule: { en: 'Flag double-click duplicates: the same student asks about the same error less than 30 seconds apart.', tr: 'Çift tıklama tekrarlarını işaretleyin: aynı öğrenci aynı hatayı 30 saniyeden kısa arayla sorar.', es: 'Marque los duplicados por doble clic: el mismo estudiante pregunta por el mismo error con menos de 30 segundos de diferencia.' },
    why: { en: 'Such pairs are one request for help, not two, and they would inflate help-seeking.', tr: 'Bu tür çiftler iki değil, tek bir yardım isteğidir ve yardım istemeyi olduğundan fazla gösterir.', es: 'Estos pares son una sola petición de ayuda, no dos, y harían parecer mayor la búsqueda de ayuda.' },
    sample: false,
  },
  {
    id: 'C8',
    rule: { en: 'Use missing codes: -99 not applicable, -98 not measured, -97 not answered. Do not impute. Ratio measures need at least 3 questions.', tr: 'Eksik değer kodlarını kullanın: -99 uygulanamaz, -98 ölçülmedi, -97 yanıtlanmadı. Değer atamayın. Oran ölçüleri en az 3 soru gerektirir.', es: 'Use códigos de valores perdidos: -99 no aplicable, -98 no medido, -97 sin respuesta. No impute. Las medidas de proporción necesitan al menos 3 preguntas.' },
    why: { en: 'An empty value can mean different things, and a share from one or two questions is not stable.', tr: 'Boş bir değer farklı anlamlara gelebilir ve bir ya da iki sorudan hesaplanan bir pay kararlı değildir.', es: 'Un valor vacío puede significar cosas distintas, y una proporción de una o dos preguntas no es estable.' },
    sample: true,
  },
  {
    id: 'C9',
    rule: { en: 'Use medians for times. Flag values beyond 3 × IQR and use the flag only in sensitivity checks.', tr: 'Süreler için ortanca kullanın. 3 × IQR dışındaki değerleri işaretleyin ve işareti yalnızca duyarlılık kontrollerinde kullanın.', es: 'Use medianas para los tiempos. Marque los valores más allá de 3 × RIC y use la marca solo en comprobaciones de sensibilidad.' },
    why: { en: 'Times have long tails: a break or a closed laptop can produce very long values.', tr: 'Sürelerin uzun kuyrukları vardır: bir mola ya da kapatılan bir dizüstü bilgisayar çok uzun değerler üretebilir.', es: 'Los tiempos tienen colas largas: una pausa o un portátil cerrado pueden producir valores muy largos.' },
    sample: false,
  },
  {
    id: 'C10',
    rule: { en: 'Compare values only within the same formula version and extension version.', tr: 'Değerleri yalnızca aynı formül sürümü ve eklenti sürümü içinde karşılaştırın.', es: 'Compare valores solo dentro de la misma versión de fórmula y de extensión.' },
    why: { en: 'A changed threshold or time window changes the meaning of a number (see the metric changelog).', tr: 'Değişen bir eşik ya da zaman aralığı bir sayının anlamını değiştirir (metrik değişiklik günlüğüne bakın).', es: 'Un umbral o una ventana de tiempo distintos cambian el significado de un número (véase el registro de cambios de métricas).' },
    sample: false,
  },
  {
    id: 'C11',
    rule: { en: 'Flag students whose data an admin reset in the dashboard (visible in the activity log).', tr: 'Verileri bir yönetici tarafından panelde sıfırlanan öğrencileri işaretleyin (etkinlik kaydında görünür).', es: 'Marque a los estudiantes cuyos datos restableció una persona administradora en el panel (visible en el registro de actividad).' },
    why: { en: 'A reset deletes questions and events but keeps the account, so the data looks complete but is not.', tr: 'Sıfırlama soruları ve olayları siler ama hesabı tutar. Bu yüzden veri tam görünür ama tam değildir.', es: 'Un restablecimiento borra preguntas y eventos pero conserva la cuenta, así que los datos parecen completos sin estarlo.' },
    sample: false,
  },
  {
    id: 'C12',
    rule: { en: 'Leave answers from the cache out of timing and token analyses.', tr: 'Önbellekten gelen yanıtları süre ve token analizlerinin dışında bırakın.', es: 'Excluya las respuestas de la caché de los análisis de tiempos y de tokens.' },
    why: { en: 'They have no response time and no tokens.', tr: 'Bunların yanıt süresi ve tokeni yoktur.', es: 'No tienen tiempo de respuesta ni tokens.' },
    sample: true,
  },
  {
    id: 'C13',
    rule: { en: 'Leave degraded answers (the rule and the fix were empty) out of hint-depth analyses.', tr: 'Bozulmuş yanıtları (kural ve düzeltme boş) ipucu derinliği analizlerinin dışında bırakın.', es: 'Excluya las respuestas degradadas (la regla y la corrección estaban vacías) de los análisis de profundidad.' },
    why: { en: 'In these answers the student could not open L2 or L3, so the depth does not reflect a choice.', tr: 'Bu yanıtlarda öğrenci L2 ya da L3’ü açamazdı, bu yüzden derinlik bir tercihi yansıtmaz.', es: 'En estas respuestas el estudiante no podía abrir L2 ni L3, así que la profundidad no refleja una elección.' },
    sample: false,
  },
  {
    id: 'C14',
    rule: { en: 'For pre-test and post-test analyses, drop students who miss a test (listwise) and report how many.', tr: 'Ön test ve son test analizlerinde bir testi kaçıran öğrencileri çıkarın (liste bazında) ve sayılarını raporlayın.', es: 'En los análisis de pretest y postest, excluya a quienes falten a un test (por lista) e informe de cuántos son.' },
    why: { en: 'A gain needs both scores, and the number of dropped students shows possible bias.', tr: 'Kazanç her iki puanı da gerektirir ve çıkarılan öğrenci sayısı olası yanlılığı gösterir.', es: 'La ganancia necesita ambas puntuaciones, y el número de exclusiones muestra un posible sesgo.' },
    sample: false,
  },
]
