// Table reference pages: what each table holds, who writes it and who can read
// it, in three languages. The columns themselves come from inventory.json.
// Source: supabase/migrations 0001 to 0024 (read on the commit in inventory.json).

import type { T3 } from './terms'

const t = (en: string, tr: string, es: string): T3 => ({ en, tr, es })

export interface TableRef {
  /** inventory table ids shown on the page (schema.table for the dashboard schema) */
  tables: string[]
  what: T3
  writer: T3
  read: T3
}

/** reference page slug -> tables */
export const tableRefs: Record<string, TableRef> = {
  profiles: {
    tables: ['profiles'],
    what: t('One row per student account. A database trigger creates it when the student signs in for the first time.', 'Her öğrenci hesabı için bir satır. Öğrenci ilk kez giriş yaptığında bir veritabanı tetikleyicisi oluşturur.', 'Una fila por cuenta de estudiante. Un disparador de la base de datos la crea cuando el estudiante inicia sesión por primera vez.'),
    writer: t('The sign-up trigger and the extension (own row only).', 'Kayıt tetikleyicisi ve eklenti (yalnızca kendi satırı).', 'El disparador de alta y la extensión (solo su propia fila).'),
    read: t('The student (own row) and the dashboard.', 'Öğrenci (kendi satırı) ve panel.', 'El estudiante (su propia fila) y el panel.'),
  },
  'consent-log': {
    tables: ['consent_log'],
    what: t('Every answer to the consent question, with the version of the consent text.', 'Onay sorusuna verilen her yanıt, onay metninin sürümüyle birlikte.', 'Cada respuesta a la pregunta de consentimiento, con la versión del texto.'),
    writer: t('The extension (own rows, insert only).', 'Eklenti (kendi satırları, yalnızca ekleme).', 'La extensión (sus propias filas, solo inserción).'),
    read: t('The student (own rows) and the dashboard.', 'Öğrenci (kendi satırları) ve panel.', 'El estudiante (sus propias filas) y el panel.'),
  },
  'coding-sessions': {
    tables: ['coding_sessions'],
    what: t('One row per sign-in or restore in one VS Code window. The activity counters are added to it every 3 minutes.', 'Bir VS Code penceresindeki her giriş ya da geri yükleme için bir satır. Etkinlik sayaçları her 3 dakikada bir eklenir.', 'Una fila por cada inicio de sesión o restauración en una ventana de VS Code. Los contadores de actividad se suman cada 3 minutos.'),
    writer: t('The extension (own rows).', 'Eklenti (kendi satırları).', 'La extensión (sus propias filas).'),
    read: t('The student (own rows) and the dashboard.', 'Öğrenci (kendi satırları) ve panel.', 'El estudiante (sus propias filas) y el panel.'),
  },
  interactions: {
    tables: ['interactions'],
    what: t('One row per help request that received an answer, also when the answer came from the cache.', 'Yanıt alan her yardım isteği için bir satır, yanıt önbellekten gelse bile.', 'Una fila por cada petición de ayuda con respuesta, también si la respuesta salió de la caché.'),
    writer: t('The server functions explain, record-level and record-self-report.', 'explain, record-level ve record-self-report sunucu işlevleri.', 'Las funciones del servidor explain, record-level y record-self-report.'),
    read: t('The student (own rows, read only) and the dashboard.', 'Öğrenci (kendi satırları, yalnızca okuma) ve panel.', 'El estudiante (sus propias filas, solo lectura) y el panel.'),
  },
  events: {
    tables: ['events'],
    what: t('Research events. One row per observed moment, with a small JSON payload of measurements and no code or typed text.', 'Araştırma olayları. Gözlenen her an için bir satır, küçük bir JSON ölçüm verisiyle. Kod ya da yazılan metin içermez.', 'Eventos de investigación. Una fila por cada momento observado, con una pequeña carga JSON de medidas, sin código ni texto escrito.'),
    writer: t('The server functions log-event and record-level.', 'log-event ve record-level sunucu işlevleri.', 'Las funciones del servidor log-event y record-level.'),
    read: t('Only the server and the dashboard. Students cannot read this table.', 'Yalnızca sunucu ve panel. Öğrenciler bu tabloyu okuyamaz.', 'Solo el servidor y el panel. Los estudiantes no pueden leer esta tabla.'),
  },
  explanations: {
    tables: ['explanations'],
    what: t('The shared cache of generated hint ladders, found by a hash of the question. It has no student id.', 'Üretilmiş ipucu merdivenlerinin ortak önbelleği, sorunun bir özetiyle bulunur. Öğrenci kimliği içermez.', 'La caché compartida de escaleras de pistas generadas, que se encuentran por un hash de la pregunta. No tiene id de estudiante.'),
    writer: t('The server function explain.', 'explain sunucu işlevi.', 'La función del servidor explain.'),
    read: t('Every signed-in student can read all rows (see issue I-19).', 'Giriş yapmış her öğrenci tüm satırları okuyabilir (I-19 bulgusuna bakın).', 'Cualquier estudiante con sesión iniciada puede leer todas las filas (véase la incidencia I-19).'),
  },
  'learner-profiles': {
    tables: ['learner_profiles'],
    what: t('The three texts the model writes about each student, and the counter that decides when to rewrite them.', 'Modelin her öğrenci hakkında yazdığı üç metin ve bunların ne zaman yeniden yazılacağına karar veren sayaç.', 'Los tres textos que el modelo escribe sobre cada estudiante y el contador que decide cuándo reescribirlos.'),
    writer: t('The server functions explain (counter) and generate-summary (texts).', 'explain (sayaç) ve generate-summary (metinler) sunucu işlevleri.', 'Las funciones del servidor explain (contador) y generate-summary (textos).'),
    read: t('The student (own row, read only) and the dashboard.', 'Öğrenci (kendi satırı, yalnızca okuma) ve panel.', 'El estudiante (su propia fila, solo lectura) y el panel.'),
  },
  'usage-counters': {
    tables: ['usage_counters'],
    what: t('Requests and tokens per student and UTC hour, used for the usage limits.', 'Kullanım sınırları için öğrenci ve UTC saati başına istekler ve tokenler.', 'Peticiones y tokens por estudiante y hora UTC, para los límites de uso.'),
    writer: t('The server function explain.', 'explain sunucu işlevi.', 'La función del servidor explain.'),
    read: t('Only the server and the dashboard.', 'Yalnızca sunucu ve panel.', 'Solo el servidor y el panel.'),
  },
  'rate-limits': {
    tables: ['rate_limits'],
    what: t('At most one row with the hourly and daily limits set in the dashboard.', 'Panelde belirlenen saatlik ve günlük sınırları içeren en fazla bir satır.', 'Como máximo una fila con los límites por hora y por día fijados en el panel.'),
    writer: t('An admin, through the dashboard.', 'Panel aracılığıyla bir yönetici.', 'Una persona administradora, desde el panel.'),
    read: t('Only the server and the dashboard.', 'Yalnızca sunucu ve panel.', 'Solo el servidor y el panel.'),
  },
  'concept-vocabulary': {
    tables: ['concept_vocabulary'],
    what: t('A reference table from the first version of the schema. No migration fills it, and no code reads or writes it.', 'Şemanın ilk sürümünden kalan bir başvuru tablosu. Hiçbir geçiş onu doldurmaz ve hiçbir kod onu okumaz ya da yazmaz.', 'Una tabla de referencia de la primera versión del esquema. Ninguna migración la llena, y ningún código la lee ni la escribe.'),
    writer: t('Nobody.', 'Hiç kimse.', 'Nadie.'),
    read: t('Every signed-in user.', 'Giriş yapmış her kullanıcı.', 'Cualquier usuario con sesión iniciada.'),
  },
  'dashboard-accounts': {
    tables: ['dashboard.admins', 'dashboard.sessions', 'dashboard.audit_log'],
    what: t('The accounts of the dashboard (admin or viewer), their sign-in sessions and the activity log. These are not student accounts, and the database API does not expose this schema.', 'Panel hesapları (yönetici ya da izleyici), giriş oturumları ve etkinlik kaydı. Bunlar öğrenci hesabı değildir ve veritabanı API’si bu şemayı dışarıya açmaz.', 'Las cuentas del panel (administrador o lector), sus sesiones y el registro de actividad. No son cuentas de estudiantes, y la API de la base de datos no expone este esquema.'),
    writer: t('The dashboard functions (sign-in, accounts, activity log).', 'Panel işlevleri (giriş, hesaplar, etkinlik kaydı).', 'Las funciones del panel (inicio de sesión, cuentas, registro de actividad).'),
    read: t('Only the dashboard functions. The activity log is visible to admins.', 'Yalnızca panel işlevleri. Etkinlik kaydını yöneticiler görebilir.', 'Solo las funciones del panel. El registro de actividad lo ven las personas administradoras.'),
  },
}

/** Groups of database functions and triggers on the "functions" reference page. */
export const functionGroups: { id: string; title: T3; text: T3; ids: string[] }[] = [
  {
    id: 'student-accounts',
    title: t('Student accounts', 'Öğrenci hesapları', 'Cuentas de estudiantes'),
    text: t('Create the profile row at the first sign-in and keep the username from changing.', 'İlk girişte profil satırını oluşturur ve kullanıcı adının değişmesini engeller.', 'Crean la fila del perfil en el primer inicio de sesión e impiden que cambie el nombre de usuario.'),
    ids: ['public.handle_new_user', 'public.prevent_username_change', 'trigger.on_auth_user_created', 'trigger.profiles_lock_username', 'dashboard.student_password_problem'],
  },
  {
    id: 'cache',
    title: t('Answer cache', 'Yanıt önbelleği', 'Caché de respuestas'),
    text: t('Adds one to the reuse count of a cached answer, in one step so that no count is lost.', 'Önbellekteki bir yanıtın yeniden kullanım sayısına, hiçbir sayım kaybolmasın diye tek adımda bir ekler.', 'Suma uno al recuento de reutilización de una respuesta en caché, en un solo paso para que no se pierda ninguno.'),
    ids: ['public.increment_explanation_reuse'],
  },
  {
    id: 'dashboard-sign-in',
    title: t('Dashboard sign-in and accounts', 'Panel girişi ve hesapları', 'Acceso al panel y cuentas'),
    text: t('Sign-in with password and an optional two-step code, dashboard accounts and roles, and the activity log.', 'Parola ve isteğe bağlı iki adımlı kodla giriş, panel hesapları ve roller, etkinlik kaydı.', 'Inicio de sesión con contraseña y un código opcional en dos pasos, cuentas y roles del panel, y el registro de actividad.'),
    ids: [
      'public.dashboard_login', 'public.dashboard_session', 'public.dashboard_logout', 'public.dashboard_change_password',
      'public.dashboard_totp_begin', 'public.dashboard_totp_enable', 'public.dashboard_totp_disable',
      'public.dashboard_accounts', 'public.dashboard_account_create', 'public.dashboard_account_set_role',
      'public.dashboard_account_reset_password', 'public.dashboard_account_reset_totp', 'public.dashboard_account_delete',
      'public.dashboard_audit_log', 'dashboard.hash_token', 'dashboard.session_admin', 'dashboard.require_session',
      'dashboard.require_admin', 'dashboard.account_json', 'dashboard.base32_encode', 'dashboard.base32_decode',
      'dashboard.totp_code', 'dashboard.totp_match', 'dashboard.password_problem', 'dashboard.audit',
    ],
  },
  {
    id: 'dashboard-data',
    title: t('Dashboard data', 'Panel verisi', 'Datos del panel'),
    text: t('Read the data for the dashboard tabs and the export. They compute the metrics described on the data pages.', 'Panel sekmeleri ve dışa aktarma için veriyi okur. Veri sayfalarında açıklanan metrikleri hesaplar.', 'Leen los datos de las pestañas del panel y de la exportación. Calculan las métricas descritas en las páginas de datos.'),
    ids: [
      'public.dashboard_overview', 'public.dashboard_students', 'public.dashboard_student_detail', 'public.dashboard_question',
      'public.dashboard_insights', 'public.dashboard_export', 'public.dashboard_engagement', 'dashboard.safe_tz',
      'dashboard.resolve_range', 'dashboard.slot_labels', 'dashboard.slot_label', 'dashboard.last_active',
      'dashboard.attention', 'dashboard.weekly_trend', 'dashboard.students_json', 'dashboard.num',
    ],
  },
  {
    id: 'dashboard-changes',
    title: t('Changes from the dashboard', 'Panelden yapılan değişiklikler', 'Cambios desde el panel'),
    text: t('Reset or delete a student, set a student password and set the usage limits. Only admins can use them, and every use is written to the activity log.', 'Bir öğrenciyi sıfırlar ya da siler, öğrenci parolası ve kullanım sınırlarını belirler. Yalnızca yöneticiler kullanabilir ve her kullanım etkinlik kaydına yazılır.', 'Restablecen o eliminan a un estudiante, fijan su contraseña y los límites de uso. Solo pueden usarlas las personas administradoras, y cada uso queda en el registro de actividad.'),
    ids: ['public.dashboard_reset_student', 'public.dashboard_delete_student', 'public.dashboard_student_set_password', 'public.dashboard_set_rate_limits'],
  },
  {
    id: 'realtime',
    title: t('Live updates', 'Canlı güncellemeler', 'Actualizaciones en directo'),
    text: t('When questions, sessions, events or profiles change, the dashboard gets a short signal with the table name only and loads the data again.', 'Sorular, oturumlar, olaylar ya da profiller değiştiğinde panel yalnızca tablo adını içeren kısa bir sinyal alır ve veriyi yeniden yükler.', 'Cuando cambian preguntas, sesiones, eventos o perfiles, el panel recibe una señal breve con solo el nombre de la tabla y vuelve a cargar los datos.'),
    ids: ['dashboard.broadcast_change', 'trigger.dashboard_broadcast'],
  },
]
