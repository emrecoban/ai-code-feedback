// Data flow page: labels of the diagram and, per data category, where the data
// is created, where it is stored and where it is shown. Taken from the code
// (extension/src, supabase/functions, supabase/migrations, dashboard/src).

import type { T3 } from './terms'

const t = (en: string, tr: string, es: string): T3 => ({ en, tr, es })

export const flowLabels = {
  extension: t('VS Code extension', 'VS Code eklentisi', 'Extensión de VS Code'),
  extensionSub: t('on the student’s computer', 'öğrencinin bilgisayarında', 'en el ordenador del estudiante'),
  supabase: t('Supabase (EU region)', 'Supabase (AB bölgesi)', 'Supabase (región de la UE)'),
  tables: t('Database tables', 'Veritabanı tabloları', 'Tablas de la base de datos'),
  tablesSub: t('sessions, questions, events …', 'oturumlar, sorular, olaylar …', 'sesiones, preguntas, eventos …'),
  functions: t('Server functions', 'Sunucu işlevleri', 'Funciones del servidor'),
  functionsSub: t('explain, log-event …', 'explain, log-event …', 'explain, log-event …'),
  ai: t('AI provider', 'Yapay zekâ sağlayıcısı', 'Proveedor de IA'),
  aiSub: t('outside Supabase', 'Supabase dışında', 'fuera de Supabase'),
  dashboard: t('Dashboard', 'Panel', 'Panel'),
  dashboardSub: t('teacher and researcher', 'öğretmen ve araştırmacı', 'profesorado e investigación'),
  ownRows: t('own rows: account, consent, sessions', 'kendi satırları: hesap, onay, oturumlar', 'filas propias: cuenta, consentimiento, sesiones'),
  requests: t('help requests, events, answers', 'yardım istekleri, olaylar, yanıtlar', 'peticiones de ayuda, eventos, respuestas'),
  writes: t('questions, events, cache and summaries are written', 'sorular, olaylar, önbellek ve özetler yazılır', 'se escriben preguntas, eventos, caché y resúmenes'),
  toAi: t('redacted code and question', 'maskelenmiş kod ve soru', 'código enmascarado y pregunta'),
  fromAi: t('hint ladder, summaries', 'ipucu merdiveni, özetler', 'escalera de pistas, resúmenes'),
  toDashboard: t('reads with a session token, live signal', 'oturum belirteciyle okur, canlı sinyal', 'lee con un token de sesión, señal en directo'),
  diagramTitle: t('How data moves between the parts of the system', 'Verinin sistemin parçaları arasında nasıl taşındığı', 'Cómo se mueven los datos entre las partes del sistema'),
  category: t('Data category', 'Veri kategorisi', 'Categoría de datos'),
  created: t('Created in', 'Oluştuğu yer', 'Se crea en'),
  stored: t('Stored in', 'Saklandığı yer', 'Se guarda en'),
  shown: t('Shown in', 'Gösterildiği yer', 'Se muestra en'),
}

const EXT = t('Extension', 'Eklenti', 'Extensión')
const DASH = t('Dashboard', 'Panel', 'Panel')
const DASH_PANEL = t('Dashboard and student panel', 'Panel ve öğrenci paneli', 'Panel y panel del estudiante')

/** One row per data category (ids from terms.categories). Table names stay in code form. */
export const flowRows: { category: string; created: T3; stored: string; shown: T3 }[] = [
  { category: 'accounts', created: t('Extension (sign-in and consent dialog)', 'Eklenti (giriş ve onay penceresi)', 'Extensión (inicio de sesión y diálogo de consentimiento)'), stored: 'profiles, consent_log', shown: DASH },
  { category: 'asking', created: t('Extension, then the server function explain', 'Eklenti, ardından explain sunucu işlevi', 'Extensión, después la función del servidor explain'), stored: 'interactions, events', shown: DASH },
  { category: 'before', created: EXT, stored: 'interactions, coding_sessions', shown: DASH },
  { category: 'ladder', created: t('AI provider through explain, and the extension (steps opened)', 'explain aracılığıyla yapay zekâ sağlayıcısı ve eklenti (açılan adımlar)', 'Proveedor de IA a través de explain, y la extensión (pasos abiertos)'), stored: 'interactions, events, explanations', shown: t('Extension and dashboard', 'Eklenti ve panel', 'Extensión y panel') },
  { category: 'reading', created: EXT, stored: 'events', shown: DASH },
  { category: 'outcomes', created: EXT, stored: 'events, coding_sessions', shown: DASH_PANEL },
  { category: 'self-report', created: t('Extension (buttons under each explanation)', 'Eklenti (her açıklamanın altındaki düğmeler)', 'Extensión (botones bajo cada explicación)'), stored: 'interactions', shown: DASH },
  { category: 'activity', created: t('Extension (counters, sent every 3 minutes)', 'Eklenti (her 3 dakikada gönderilen sayaçlar)', 'Extensión (contadores enviados cada 3 minutos)'), stored: 'coding_sessions', shown: DASH_PANEL },
  { category: 'learner', created: t('AI provider through generate-summary', 'generate-summary aracılığıyla yapay zekâ sağlayıcısı', 'Proveedor de IA a través de generate-summary'), stored: 'learner_profiles', shown: t('Extension sidebar and dashboard (not the private notes)', 'Eklenti kenar çubuğu ve panel (gizli notlar hariç)', 'Barra lateral de la extensión y panel (no las notas privadas)') },
  { category: 'indicators', created: t('Database functions of the dashboard, and the extension (student panel)', 'Panelin veritabanı işlevleri ve eklenti (öğrenci paneli)', 'Funciones de base de datos del panel, y la extensión (panel del estudiante)'), stored: '–', shown: DASH_PANEL },
  { category: 'system', created: t('Server function explain and the extension (failed requests)', 'explain sunucu işlevi ve eklenti (başarısız istekler)', 'Función del servidor explain y la extensión (peticiones fallidas)'), stored: 'interactions, explanations, usage_counters, rate_limits, events', shown: DASH },
]

/** Shown under the table: indicators are computed, not stored. */
export const flowNote = t(
  'A dash in the "Stored in" column means the values are computed from the tables when the dashboard or the student panel reads them.',
  '"Saklandığı yer" sütunundaki çizgi, değerlerin panel ya da öğrenci paneli onları okurken tablolardan hesaplandığı anlamına gelir.',
  'Un guion en la columna «Se guarda en» significa que los valores se calculan a partir de las tablas cuando el panel o el panel del estudiante los leen.',
)
