import { dec, pc } from './gen.mjs';
import { values } from '../../.vitepress/data/terms.ts';

const v = (ns, code, l) => values[ns][code][l];
const T = (en, tr, es) => ({ en, tr, es });
const code = (s) => `\`${s}\``;
const some = T('(some columns)', '(bazı sütunlar)', '(algunas columnas)');
const tbl = (name, part = true) => ({ en: `${code(name)}${part ? ` ${some.en}` : ''}`, tr: `${code(name)}${part ? ` ${some.tr}` : ''}`, es: `${code(name)}${part ? ` ${some.es}` : ''}` });

export default [
  // ------------------------------------------------------------------ consent status
  {
    slug: 'consent-status', category: 'accounts',
    items: ['profiles.consent_status', 'profiles.consent_at', 'consent_log.status', 'consent_log.version'],
    title: T('Consent', 'Onay', 'Consentimiento'),
    what: {
      heading: T('What is the consent status?', 'Onay durumu nedir?', '¿Qué es el estado del consentimiento?'),
      text: T(
        'The consent status is the answer of a student to the consent notice of the extension: pending, granted or declined. The notice opens at the first sign-in, before the first question. Every answer is also written to a log, together with the version of the notice text.',
        'Onay durumu, öğrencinin eklentideki onay bildirimine verdiği yanıttır: bekliyor, verildi ya da reddedildi. Bildirim ilk girişte, ilk sorudan önce açılır. Her yanıt, bildirim metninin sürümüyle birlikte ayrıca bir günlüğe yazılır.',
        'El estado del consentimiento es la respuesta del estudiante al aviso de consentimiento de la extensión: pendiente, otorgado o rechazado. El aviso se abre en el primer inicio de sesión, antes de la primera pregunta. Cada respuesta se guarda también en un registro, junto con la versión del texto del aviso.',
      ),
    },
    example: {
      en: (f) => `S07 signed in for the first time in the first lab, at ${f.featuredTime}. The consent notice opened and S07 clicked "I agree". The profile now says granted, and the log keeps one row with the text version ${f.version}. If S07 had closed the notice without an answer, the status would stay pending and the notice would open again before the next question.`,
      tr: (f) => `S07 ilk laboratuvar dersinde saat ${f.featuredTime}’de ilk kez giriş yaptı. Onay bildirimi açıldı ve S07 "Kabul ediyorum" düğmesine tıkladı. Profilde artık "verildi" yazıyor ve günlükte ${f.version} metin sürümüyle bir satır var. S07 bildirimi yanıt vermeden kapatsaydı, durum "bekliyor" olarak kalacak ve bildirim bir sonraki sorudan önce yeniden açılacaktı.`,
      es: (f) => `S07 inició sesión por primera vez en el primer laboratorio, a las ${f.featuredTime}. Se abrió el aviso de consentimiento y S07 pulsó «Acepto». El perfil indica ahora otorgado, y el registro guarda una fila con la versión del texto ${f.version}. Si S07 hubiera cerrado el aviso sin responder, el estado seguiría pendiente y el aviso volvería a abrirse antes de la siguiente pregunta.`,
    },
    takeaway: {
      en: (f) => `In the sample, ${f.granted} of ${f.accounts} accounts granted consent and ${f.declined} declined.`,
      tr: (f) => `Örnekte ${f.accounts} hesabın ${f.granted} tanesi onay verdi, ${f.declined} tanesi reddetti.`,
      es: (f) => `En la muestra, ${f.granted} de ${f.accounts} cuentas otorgaron el consentimiento y ${f.declined} lo rechazó.`,
    },
    purpose: {
      teacher: T('Which students have answered the consent notice?', 'Hangi öğrenciler onay bildirimini yanıtladı?', '¿Qué estudiantes han respondido al aviso de consentimiento?'),
      researcher: T('Which accounts may enter the analysis, and under which version of the consent text?', 'Hangi hesaplar analize girebilir ve hangi onay metni sürümüyle?', '¿Qué cuentas pueden entrar en el análisis y con qué versión del texto de consentimiento?'),
    },
    raw: {
      intro: T('The status is stored in two tables. These rows belong to S07.', 'Durum iki tabloda saklanır. Bu satırlar S07’ye aittir.', 'El estado se guarda en dos tablas. Estas filas son de S07.'),
      snippets: [{ name: 'consent-status.profiles', caption: tbl('profiles') }, { name: 'consent-status.consent_log', caption: tbl('consent_log', false) }],
    },
    research: {
      stage: T('design and analysis (defining the sample)', 'tasarım ve analiz (örneklemin belirlenmesi)', 'diseño y análisis (definición de la muestra)'),
      spss: T('`consent` coded 1 = granted, 2 = declined, 3 = pending, and `consent_version` as text.', '`consent` değişkeni 1 = verildi, 2 = reddedildi, 3 = bekliyor olarak kodlanır, `consent_version` metin olarak tutulur.', '`consent` codificado 1 = otorgado, 2 = rechazado, 3 = pendiente, y `consent_version` como texto.'),
      analysis: T('Report the number of accounts per status in the participant flow, and keep only granted accounts (cleaning rule C1).', 'Katılımcı akışında her durumdaki hesap sayısını raporlayın ve yalnızca onay veren hesapları tutun (temizleme kuralı C1).', 'Informe del número de cuentas por estado en el flujo de participantes y conserve solo las cuentas con consentimiento otorgado (regla de limpieza C1).'),
      sentence: T('Only students who granted consent in the extension (consent text version 2026-08-v1) were included in the analysis.', 'Analize yalnızca eklentide onay veren öğrenciler (onay metni sürümü 2026-08-v1) dahil edilmiştir.', 'Solo se incluyeron en el análisis los estudiantes que otorgaron su consentimiento en la extensión (versión del texto 2026-08-v1).'),
    },
    limits: T(
      'The status records an answer to the notice, not whether the student read or understood it. It does not replace the signed consent of the study. Before any analysis, check which data exists for declined and pending accounts, and remove it (cleaning rule C1).',
      'Durum, bildirime verilen yanıtı kaydeder. Öğrencinin metni okuyup anlayıp anlamadığını göstermez. Çalışmanın imzalı onam formunun yerini de tutmaz. Analizden önce reddeden ve bekleyen hesaplar için hangi verilerin bulunduğunu kontrol edin ve bunları çıkarın (temizleme kuralı C1).',
      'El estado registra una respuesta al aviso, no si el estudiante lo leyó o lo entendió. Tampoco sustituye al consentimiento firmado del estudio. Antes de cualquier análisis, compruebe qué datos existen de las cuentas que rechazaron o siguen pendientes y elimínelos (regla de limpieza C1).',
    ),
    teacher: T(
      'If some students are still pending, remind the class that the notice opens again before the next question and that both answers are fine. Do not ask a student to explain the choice.',
      'Bazı öğrenciler hâlâ "bekliyor" durumundaysa, sınıfa bildirimin bir sonraki sorudan önce yeniden açılacağını ve iki yanıtın da kabul edilebilir olduğunu hatırlatın. Hiçbir öğrenciden seçimini açıklamasını istemeyin.',
      'Si algunos estudiantes siguen pendientes, recuerde a la clase que el aviso se abre de nuevo antes de la siguiente pregunta y que ambas respuestas son válidas. No pida a nadie que explique su elección.',
    ),
  },

  // ------------------------------------------------------------------ feedback language
  {
    slug: 'feedback-language', category: 'accounts',
    items: ['profiles.feedback_language', 'event.feedback_language_changed', 'event.feedback_language_changed.from', 'event.feedback_language_changed.to'],
    title: T('Feedback language', 'Geri bildirim dili', 'Idioma de las explicaciones'),
    what: {
      heading: T('What is the feedback language?', 'Geri bildirim dili nedir?', '¿Qué es el idioma de las explicaciones?'),
      text: T(
        'The feedback language is the language in which a student reads the extension and the AI explanations: English, Turkish or Spanish. Each student chooses it, so students who share a lab computer can use different languages. Every change is also logged as an event.',
        'Geri bildirim dili, öğrencinin eklentiyi ve yapay zekâ açıklamalarını okuduğu dildir: İngilizce, Türkçe ya da İspanyolca. Dili her öğrenci kendisi seçer. Bu yüzden aynı laboratuvar bilgisayarını kullanan öğrenciler farklı diller kullanabilir. Her değişiklik ayrıca bir olay olarak kaydedilir.',
        'El idioma de las explicaciones es el idioma en que el estudiante lee la extensión y las explicaciones de la IA: inglés, turco o español. Cada estudiante lo elige, así que quienes comparten un ordenador del laboratorio pueden usar idiomas distintos. Cada cambio se registra además como un evento.',
      ),
    },
    example: {
      en: (f) => `S07 chose ${v('language', f.featuredLanguage, 'en')} at the first sign-in and never changed it. ${f.exampleStudent} started in ${v('language', f.exampleFrom, 'en')} and switched to ${v('language', f.exampleTo, 'en')} in week ${f.exampleWeek}. The profile keeps only the current language, so the event log is the only place where the switch is visible.`,
      tr: (f) => `S07 ilk girişte ${v('language', f.featuredLanguage, 'tr')} dilini seçti ve hiç değiştirmedi. ${f.exampleStudent} ise ${v('language', f.exampleFrom, 'tr')} ile başladı ve ${f.exampleWeek}. haftada ${v('language', f.exampleTo, 'tr')} diline geçti. Profil yalnızca güncel dili tutar. Bu yüzden geçiş yalnızca olay günlüğünde görünür.`,
      es: (f) => `S07 eligió ${v('language', f.featuredLanguage, 'es').toLowerCase()} en el primer inicio de sesión y no lo cambió nunca. ${f.exampleStudent} empezó en ${v('language', f.exampleFrom, 'es').toLowerCase()} y pasó al ${v('language', f.exampleTo, 'es').toLowerCase()} en la semana ${f.exampleWeek}. El perfil solo guarda el idioma actual, así que el cambio solo se ve en el registro de eventos.`,
    },
    takeaway: {
      en: (f) => `At the end of the sample, ${f.tr} students use Turkish, ${f.en} English and ${f.es} Spanish. ${f.changes} students switched once.`,
      tr: (f) => `Örneğin sonunda ${f.tr} öğrenci Türkçe, ${f.en} öğrenci İngilizce ve ${f.es} öğrenci İspanyolca kullanıyor. ${f.changes} öğrenci dili bir kez değiştirdi.`,
      es: (f) => `Al final de la muestra, ${f.tr} estudiantes usan turco, ${f.en} inglés y ${f.es} español. ${f.changes} estudiantes cambiaron de idioma una vez.`,
    },
    purpose: {
      teacher: T('In which language does each student read the explanations?', 'Her öğrenci açıklamaları hangi dilde okuyor?', '¿En qué idioma lee cada estudiante las explicaciones?'),
      researcher: T('Does the feedback language, or a switch to the first language, relate to how students use the hints?', 'Geri bildirim dili ya da ana dile geçiş, öğrencilerin ipuçlarını kullanma biçimiyle ilişkili mi?', '¿Se relaciona el idioma de las explicaciones, o el cambio a la lengua materna, con el uso de las pistas?'),
    },
    raw: {
      intro: T('The current language is in the profile. The change is an event (here the switch of the example student).', 'Güncel dil profilde durur. Değişiklik ise bir olaydır (burada örnekteki öğrencinin geçişi).', 'El idioma actual está en el perfil. El cambio es un evento (aquí, el cambio del estudiante del ejemplo).'),
      snippets: [{ name: 'feedback-language.profiles', caption: tbl('profiles') }, { name: 'feedback-language.event', caption: tbl('events', false) }],
    },
    research: {
      stage: T('design (grouping) and analysis', 'tasarım (gruplama) ve analiz', 'diseño (agrupación) y análisis'),
      spss: T('`feedback_language` as a nominal variable (1 = English, 2 = Turkish, 3 = Spanish) and `language_changes` as the number of change events.', '`feedback_language` sınıflama değişkeni olarak (1 = İngilizce, 2 = Türkçe, 3 = İspanyolca) ve `language_changes` değişiklik olaylarının sayısı olarak.', '`feedback_language` como variable nominal (1 = inglés, 2 = turco, 3 = español) y `language_changes` como número de eventos de cambio.'),
      analysis: T('Compare hint depth between language groups with a Kruskal–Wallis test, because the groups are small.', 'Gruplar küçük olduğu için dil grupları arasında ipucu derinliğini Kruskal–Wallis testiyle karşılaştırın.', 'Compare la profundidad de las pistas entre grupos de idioma con una prueba de Kruskal–Wallis, porque los grupos son pequeños.'),
      sentence: T('Students chose the language of the feedback (English, Turkish or Spanish) in the extension, and every later change was logged.', 'Öğrenciler geri bildirim dilini (İngilizce, Türkçe ya da İspanyolca) eklentide kendileri seçmiş ve sonraki her değişiklik kaydedilmiştir.', 'Los estudiantes eligieron en la extensión el idioma de las explicaciones (inglés, turco o español) y cada cambio posterior quedó registrado.'),
    },
    rq: { 'profiles.feedback_language': { RQ2: 'moderator', RQ4: 'moderator' } },
    limits: T(
      'The profile stores only the current language. The language of an older question can be rebuilt only from the change events, and only for changes made while the student was signed in. A switch can reflect comprehension, but also curiosity or a shared computer.',
      'Profil yalnızca güncel dili saklar. Eski bir sorunun dili ancak değişiklik olaylarından ve yalnızca öğrenci oturum açmışken yapılan değişiklikler için yeniden kurulabilir. Dil değişikliği anlama güçlüğünü gösterebilir, ama merak ya da ortak kullanılan bir bilgisayar da aynı sonucu verebilir.',
      'El perfil solo guarda el idioma actual. El idioma de una pregunta antigua solo puede reconstruirse a partir de los eventos de cambio, y solo para cambios hechos con la sesión iniciada. Un cambio puede reflejar dificultades de comprensión, pero también curiosidad o un ordenador compartido.',
    ),
    teacher: T(
      'If a student switches to the first language after a hard week, the task may have been difficult. Ask about the task, not about the language.',
      'Bir öğrenci zor bir haftanın ardından ana diline geçtiyse, görev zor gelmiş olabilir. Dil hakkında değil, görev hakkında soru sorun.',
      'Si un estudiante pasa a su lengua materna después de una semana difícil, puede que la tarea le haya costado. Pregunte por la tarea, no por el idioma.',
    ),
  },

  // ------------------------------------------------------------------ trigger source
  {
    slug: 'trigger-source', category: 'asking',
    items: ['interactions.trigger_source'],
    title: T('Source of the question', 'Sorunun kaynağı', 'Origen de la pregunta'),
    what: {
      heading: T('What is the source of a question?', 'Sorunun kaynağı nedir?', '¿Qué es el origen de una pregunta?'),
      text: T(
        'The source says how a help request started: from an error or warning in the code (diagnostic), or from code the student selected (selection). The database also allows runtime, stuck, paste and success, but the extension never sends these values.',
        'Kaynak, yardım isteğinin nasıl başladığını gösterir: koddaki bir hata ya da uyarıdan (diagnostic) veya öğrencinin seçtiği koddan (selection). Veritabanı runtime, stuck, paste ve success değerlerine de izin verir, ama eklenti bu değerleri hiç göndermez.',
        'El origen indica cómo empezó una petición de ayuda: desde un error o una advertencia del código (diagnostic) o desde código que el estudiante seleccionó (selection). La base de datos también admite runtime, stuck, paste y success, pero la extensión nunca envía esos valores.',
      ),
    },
    example: {
      en: (f) => `S07 asked ${f.featuredQuestions} questions in the eight weeks. ${f.featuredDiagnostic} started from an error message and ${f.featuredSelection} from selected code. The class asked ${pc(f.classDiagnosticPct, 'en')} of its questions about errors, so S07 used selections more often than most students.`,
      tr: (f) => `S07 sekiz haftada ${f.featuredQuestions} soru sordu. Bunların ${f.featuredDiagnostic} tanesi bir hata mesajından, ${f.featuredSelection} tanesi seçilen koddan başladı. Sınıf sorularının ${pc(f.classDiagnosticPct, 'tr')} kadarını hatalar hakkında sordu. Yani S07 seçimleri çoğu öğrenciden daha sık kullandı.`,
      es: (f) => `S07 hizo ${f.featuredQuestions} preguntas en las ocho semanas. ${f.featuredDiagnostic} empezaron desde un mensaje de error y ${f.featuredSelection} desde código seleccionado. La clase hizo el ${pc(f.classDiagnosticPct, 'es')} de sus preguntas sobre errores, así que S07 usó las selecciones más que la mayoría.`,
    },
    takeaway: T('Most questions in the class start from an error. S07 asks about selected code more often than most.', 'Sınıftaki soruların çoğu bir hatadan başlıyor. S07 seçilen kod hakkında çoğu öğrenciden daha sık soruyor.', 'La mayoría de las preguntas de la clase empiezan en un error. S07 pregunta por código seleccionado más que la mayoría.'),
    purpose: {
      teacher: T('Do students ask mainly about errors, or also about code that works?', 'Öğrenciler çoğunlukla hataları mı soruyor, yoksa çalışan kodu da mı?', '¿Preguntan los estudiantes sobre todo por errores, o también por código que funciona?'),
      researcher: T('Through which route do students enter the help system, and do the two routes lead to different hint depths?', 'Öğrenciler yardım sistemine hangi yoldan giriyor ve iki yol farklı ipucu derinliklerine mi götürüyor?', '¿Por qué vía entran los estudiantes al sistema de ayuda y llevan las dos vías a profundidades distintas?'),
    },
    raw: {
      intro: T('Two questions of S07, one of each kind.', 'S07’nin her türden birer sorusu.', 'Dos preguntas de S07, una de cada tipo.'),
      snippets: [{ name: 'trigger-source', caption: tbl('interactions') }],
    },
    research: {
      stage: T('during the intervention and in the analysis', 'müdahale sırasında ve analizde', 'durante la intervención y en el análisis'),
      spss: T('`share_selection` = selection questions ÷ all questions of the student.', '`share_selection` = seçim soruları ÷ öğrencinin tüm soruları.', '`share_selection` = preguntas por selección ÷ todas las preguntas del estudiante.'),
      analysis: T('Describe the weekly share of each source, and compare hint depth between error and selection questions with a chi-square test.', 'Her kaynağın haftalık payını betimleyin ve hata ile seçim soruları arasında ipucu derinliğini ki-kare testiyle karşılaştırın.', 'Describa la proporción semanal de cada origen y compare la profundidad de las pistas entre preguntas sobre errores y sobre selecciones con una prueba de chi cuadrado.'),
      sentence: T('Each help request was coded by its source: an error or warning shown by the editor, or code selected by the student.', 'Her yardım isteği kaynağına göre kodlanmıştır: editörün gösterdiği bir hata ya da uyarı veya öğrencinin seçtiği kod.', 'Cada petición de ayuda se codificó según su origen: un error o una advertencia mostrados por el editor, o código seleccionado por el estudiante.'),
    },
    rq: { 'interactions.trigger_source': { RQ1: 'descriptive', RQ2: 'moderator' } },
    limits: T(
      'The source shows where the request started, not what the student intended. A student who selects the line with an error and asks about it counts as a selection. Errors the editor cannot detect, such as logic errors, can only appear as selection questions.',
      'Kaynak, isteğin nereden başladığını gösterir, öğrencinin niyetini değil. Hatalı satırı seçip onu soran bir öğrenci seçim olarak sayılır. Editörün fark edemediği hatalar, örneğin mantık hataları, yalnızca seçim sorusu olarak görünebilir.',
      'El origen muestra dónde empezó la petición, no la intención del estudiante. Quien selecciona la línea con un error y pregunta por ella cuenta como selección. Los errores que el editor no detecta, como los errores de lógica, solo pueden aparecer como preguntas por selección.',
    ),
    teacher: T(
      'If a student almost never asks about selected code, show the class that they can also ask about code that works, for example with "Why does this work?".',
      'Bir öğrenci seçilen kod hakkında neredeyse hiç soru sormuyorsa, sınıfa çalışan kod hakkında da soru sorulabileceğini gösterin. Örneğin "Bu neden çalışıyor?" sorusuyla.',
      'Si un estudiante casi nunca pregunta por código seleccionado, muestre a la clase que también se puede preguntar por código que funciona, por ejemplo con «¿Por qué funciona esto?».',
    ),
  },

  // ------------------------------------------------------------------ trigger surface
  {
    slug: 'trigger-surface', category: 'asking',
    items: ['interactions.trigger_surface', 'metric.surfaces'],
    title: T('Where questions start', 'Sorular nereden başlıyor', 'Desde dónde se pregunta'),
    what: {
      heading: T('What is the starting point of a question?', 'Sorunun başlangıç noktası nedir?', '¿Qué es el punto de partida de una pregunta?'),
      text: T(
        'The starting point is the exact button, link or shortcut the student used to ask. There are nine values, for example the CodeLens line above an error, the lightbulb menu, the status bar or the keyboard shortcut.',
        'Başlangıç noktası, öğrencinin soru sormak için kullandığı düğme, bağlantı ya da kısayoldur. Dokuz değer vardır. Örneğin hatanın üstündeki CodeLens satırı, ampul menüsü, durum çubuğu ya da klavye kısayolu.',
        'El punto de partida es el botón, enlace o atajo exacto que el estudiante usó para preguntar. Hay nueve valores, por ejemplo la línea CodeLens sobre un error, el menú de la bombilla, la barra de estado o el atajo de teclado.',
      ),
    },
    example: {
      en: (f) => `S07 used "${v('trigger_surface', f.featuredTop, 'en')}" most often, like the class as a whole. Each button stores its own value, so the data shows which ways of asking S07 found and used.`,
      tr: (f) => `S07 en sık "${v('trigger_surface', f.featuredTop, 'tr')}" yolunu kullandı. Sınıfın geneli de böyle. Her düğme kendi değerini kaydeder. Böylece veri, S07’nin hangi soru sorma yollarını bulup kullandığını gösterir.`,
      es: (f) => `S07 usó con más frecuencia «${v('trigger_surface', f.featuredTop, 'es')}», igual que la clase en conjunto. Cada botón guarda su propio valor, así que los datos muestran qué formas de preguntar encontró y usó S07.`,
    },
    takeaway: {
      en: (f) => `The CodeLens above an error is the most used way to ask (${pc(f.topPct, 'en')} of all questions). The keyboard shortcut is rare.`,
      tr: (f) => `Hatanın üstündeki CodeLens en çok kullanılan soru sorma yolu (tüm soruların ${pc(f.topPct, 'tr')} kadarı). Klavye kısayolu nadiren kullanılıyor.`,
      es: (f) => `La CodeLens sobre un error es la forma más usada de preguntar (${pc(f.topPct, 'es')} de todas las preguntas). El atajo de teclado es poco frecuente.`,
    },
    purpose: {
      teacher: T('Which buttons do students find and use?', 'Öğrenciler hangi düğmeleri buluyor ve kullanıyor?', '¿Qué botones encuentran y usan los estudiantes?'),
      researcher: T('Which entry points do students use, and does the visibility of an entry point change how often they ask?', 'Öğrenciler hangi giriş noktalarını kullanıyor ve bir giriş noktasının görünür olması soru sıklığını değiştiriyor mu?', '¿Qué puntos de entrada usan los estudiantes y cambia la visibilidad de un punto de entrada la frecuencia con que preguntan?'),
    },
    raw: {
      intro: T('Two questions of S07 with their starting point.', 'S07’nin başlangıç noktasıyla birlikte iki sorusu.', 'Dos preguntas de S07 con su punto de partida.'),
      snippets: [{ name: 'trigger-surface', caption: tbl('interactions') }],
    },
    formulas: [{
      id: 'metric.surfaces',
      heading: T('Where questions start (dashboard)', 'Sorular nereden başlıyor (panel)', 'Desde dónde se pregunta (panel)'),
      text: T('The questions of the period, grouped by starting point. A missing value is shown as "Not recorded".', 'Dönemdeki sorular başlangıç noktasına göre gruplanır. Eksik değer "Kayıtlı değil" olarak gösterilir.', 'Las preguntas del periodo, agrupadas por punto de partida. Un valor que falta se muestra como «Sin registrar».'),
    }],
    research: {
      stage: T('during the intervention and in the analysis', 'müdahale sırasında ve analizde', 'durante la intervención y en el análisis'),
      spss: T('One share per group of entry points, for example `share_codelens` = CodeLens questions ÷ all questions.', 'Her giriş noktası grubu için bir pay, örneğin `share_codelens` = CodeLens soruları ÷ tüm sorular.', 'Una proporción por grupo de puntos de entrada, por ejemplo `share_codelens` = preguntas por CodeLens ÷ todas las preguntas.'),
      analysis: T('Describe the mix of entry points per week, and compare it between students who ask often and students who ask rarely.', 'Giriş noktalarının haftalık dağılımını betimleyin ve sık soran öğrencilerle seyrek soranlar arasında karşılaştırın.', 'Describa la combinación de puntos de entrada por semana y compárela entre quienes preguntan a menudo y quienes preguntan poco.'),
      sentence: T('The interface element used for each request (CodeLens, lightbulb, gutter link, status bar, keyboard shortcut, sidebar button or command palette) was recorded.', 'Her istek için kullanılan arayüz öğesi (CodeLens, ampul, kenar bağlantısı, durum çubuğu, klavye kısayolu, kenar paneli düğmesi ya da komut paleti) kaydedilmiştir.', 'Se registró el elemento de la interfaz usado en cada petición (CodeLens, bombilla, enlace del margen, barra de estado, atajo de teclado, botón de la barra lateral o paleta de comandos).'),
    },
    rq: { 'interactions.trigger_surface': { RQ1: 'descriptive' }, 'metric.surfaces': { RQ1: 'descriptive' } },
    limits: T(
      'A click on the gutter link of a selection is stored as "Selection: shortcut", because that link passes no value. The sidebar button and the command palette ask a fixed question without showing the question list. The mix also depends on what was visible: the editor shows the CodeLens only for the first three errors of a file.',
      'Bir seçimin kenar bağlantısına yapılan tıklama "Seçim: kısayol" olarak kaydedilir, çünkü bu bağlantı değer göndermez. Kenar paneli düğmesi ve komut paleti soru listesini göstermeden sabit bir soru sorar. Dağılım neyin görünür olduğuna da bağlıdır: editör CodeLens’i bir dosyadaki yalnızca ilk üç hata için gösterir.',
      'Un clic en el enlace del margen de una selección se guarda como «Selección: atajo», porque ese enlace no envía ningún valor. El botón de la barra lateral y la paleta de comandos hacen una pregunta fija sin mostrar la lista de preguntas. La combinación depende también de lo que estaba visible: el editor solo muestra la CodeLens para los tres primeros errores de un archivo.',
    ),
    teacher: T(
      'If almost nobody uses the selection features, show the shortcut Ctrl+Alt+Space (Cmd+Alt+Space on macOS) once in class.',
      'Seçim özelliklerini neredeyse kimse kullanmıyorsa, Ctrl+Alt+Space kısayolunu (macOS’ta Cmd+Alt+Space) derste bir kez gösterin.',
      'Si casi nadie usa las funciones de selección, muestre una vez en clase el atajo Ctrl+Alt+Espacio (Cmd+Alt+Espacio en macOS).',
    ),
  },

  // ------------------------------------------------------------------ question type
  {
    slug: 'question-type', category: 'asking',
    items: ['interactions.question_type', 'metric.analytics_question_type_resolution'],
    title: T('Question type', 'Soru türü', 'Tipo de pregunta'),
    what: {
      heading: T('What is the question type?', 'Soru türü nedir?', '¿Qué es el tipo de pregunta?'),
      text: T(
        'The question type is the question the student asked. Every error question is "What does this mean?". For selected code the student picks one of four ready questions or writes an own question.',
        'Soru türü, öğrencinin sorduğu sorudur. Her hata sorusu "Bu ne anlama geliyor?" sorusudur. Seçilen kod için öğrenci dört hazır sorudan birini seçer ya da kendi sorusunu yazar.',
        'El tipo de pregunta es la pregunta que hizo el estudiante. Toda pregunta sobre un error es «¿Qué significa esto?». Para código seleccionado, el estudiante elige una de cuatro preguntas preparadas o escribe una propia.',
      ),
    },
    example: {
      en: (f) => `S07 asked "What does this mean?" ${f.featured_what_does_this_mean} times. For selected code, S07 stored "What does this do?" ${f.featured_what_does_this_do} times, but ${f.featuredSidebar} of these came from the sidebar button, which asks this question without showing the list. S07 chose "Why does this work?" ${f.featured_why_works} times and "What's wrong here?" ${f.featured_whats_wrong} times.`,
      tr: (f) => `S07 "Bu ne anlama geliyor?" sorusunu ${f.featured_what_does_this_mean} kez sordu. Seçilen kod için "Bu ne işe yarıyor?" ${f.featured_what_does_this_do} kez kaydedildi. Ama bunların ${f.featuredSidebar} tanesi, listeyi göstermeden bu soruyu soran kenar paneli düğmesinden geldi. S07 "Bu neden çalışıyor?" sorusunu ${f.featured_why_works} kez, "Burada ne yanlış?" sorusunu ${f.featured_whats_wrong} kez seçti.`,
      es: (f) => `S07 preguntó «¿Qué significa esto?» ${f.featured_what_does_this_mean} veces. Para código seleccionado se guardó «¿Qué hace esto?» ${f.featured_what_does_this_do} veces, pero ${f.featuredSidebar} de ellas vinieron del botón de la barra lateral, que hace esta pregunta sin mostrar la lista. S07 eligió «¿Por qué funciona?» ${f.featured_why_works} veces y «¿Qué está mal aquí?» ${f.featured_whats_wrong} veces.`,
    },
    takeaway: {
      en: (f) => `The SQL report shows that "What's wrong here?" ended at the hint in ${pc(f.whatsWrongHintPct, 'en')} of the questions.`,
      tr: (f) => `SQL raporuna göre "Burada ne yanlış?" sorularının ${pc(f.whatsWrongHintPct, 'tr')} kadarı ipucu aşamasında bitti.`,
      es: (f) => `El informe SQL muestra que «¿Qué está mal aquí?» terminó en la pista en el ${pc(f.whatsWrongHintPct, 'es')} de las preguntas.`,
    },
    purpose: {
      teacher: T('What do students want to know when they select code?', 'Öğrenciler kod seçtiğinde ne öğrenmek istiyor?', '¿Qué quieren saber los estudiantes cuando seleccionan código?'),
      researcher: T('Does the kind of question relate to how far the student goes into the hints?', 'Soru türü, öğrencinin ipuçlarında ne kadar ilerlediğiyle ilişkili mi?', '¿Se relaciona el tipo de pregunta con hasta dónde llega el estudiante en las pistas?'),
    },
    raw: {
      intro: T('Two questions of S07, one about an error and one about a selection.', 'S07’nin biri hata, biri seçim hakkında iki sorusu.', 'Dos preguntas de S07, una sobre un error y otra sobre una selección.'),
      snippets: [{ name: 'question-type', caption: tbl('interactions') }],
    },
    formulas: [{
      id: 'metric.analytics_question_type_resolution',
      heading: T('The SQL report', 'SQL raporu', 'El informe SQL'),
      text: T('`supabase/analytics/question_type_resolution.sql` counts the questions per type, and how many ended at the hint (L0–L1), at the rule (L2) and at the fix (L3). The table above is this report, run on the sample.', '`supabase/analytics/question_type_resolution.sql` her tür için soruları ve bunların kaçının ipucunda (L0–L1), kuralda (L2) ve çözümde (L3) bittiğini sayar. Yukarıdaki tablo, bu raporun örnek veride çalıştırılmış halidir.', '`supabase/analytics/question_type_resolution.sql` cuenta las preguntas de cada tipo y cuántas terminaron en la pista (L0–L1), en la regla (L2) y en la solución (L3). La tabla de arriba es este informe ejecutado sobre la muestra.'),
    }],
    research: {
      stage: T('in the analysis', 'analizde', 'en el análisis'),
      spss: T('One count per type and student, for example `n_whats_wrong`, and the share of each type among the selection questions.', 'Her tür ve öğrenci için bir sayı, örneğin `n_whats_wrong`, ve her türün seçim soruları içindeki payı.', 'Un recuento por tipo y estudiante, por ejemplo `n_whats_wrong`, y la proporción de cada tipo entre las preguntas por selección.'),
      analysis: T('Cross-tabulate question type and hint depth, and test the association with a chi-square test on selection questions only.', 'Soru türü ile ipucu derinliğini çapraz tabloya koyun ve ilişkiyi yalnızca seçim soruları üzerinde ki-kare testiyle sınayın.', 'Cruce el tipo de pregunta con la profundidad de las pistas y contraste la asociación con una prueba de chi cuadrado solo en las preguntas por selección.'),
      sentence: T('For selected code, students chose one of four preset questions or wrote their own question, and the chosen type was stored with each request.', 'Öğrenciler seçilen kod için dört hazır sorudan birini seçmiş ya da kendi sorusunu yazmış ve seçilen tür her istekle birlikte saklanmıştır.', 'Para el código seleccionado, los estudiantes eligieron una de cuatro preguntas preparadas o escribieron una propia, y el tipo elegido se guardó con cada petición.'),
    },
    rq: { 'interactions.question_type': { RQ1: 'descriptive', RQ2: 'moderator' } },
    limits: T(
      '"What does this do?" is also the fixed question of the sidebar button and the command palette, so it mixes a real choice with a default. Use the starting point to separate the two. Error questions always have the same type, so the type says nothing about them.',
      '"Bu ne işe yarıyor?" aynı zamanda kenar paneli düğmesinin ve komut paletinin sabit sorusudur. Bu yüzden gerçek bir seçimle varsayılan değeri karıştırır. İkisini ayırmak için başlangıç noktasını kullanın. Hata soruları her zaman aynı türdedir, bu yüzden tür onlar hakkında bir şey söylemez.',
      '«¿Qué hace esto?» es también la pregunta fija del botón de la barra lateral y de la paleta de comandos, así que mezcla una elección real con un valor por defecto. Use el punto de partida para separarlas. Las preguntas sobre errores tienen siempre el mismo tipo, así que el tipo no dice nada sobre ellas.',
    ),
    teacher: T(
      'If students rarely use "What\'s wrong here?", remind them that they can ask it even when the editor shows no error, for example when the output looks wrong.',
      'Öğrenciler "Burada ne yanlış?" sorusunu nadiren kullanıyorsa, editör hata göstermese bile, örneğin çıktı yanlış göründüğünde, bu soruyu sorabileceklerini hatırlatın.',
      'Si los estudiantes casi no usan «¿Qué está mal aquí?», recuérdeles que pueden hacer esa pregunta aunque el editor no muestre ningún error, por ejemplo cuando la salida parece incorrecta.',
    ),
  },

  // ------------------------------------------------------------------ own question
  {
    slug: 'own-question', category: 'asking',
    items: ['interactions.free_text'],
    title: T("Student's own words", 'Öğrencinin kendi sözleri', 'Palabras del estudiante'),
    what: {
      heading: T("What is the student's own question?", 'Öğrencinin kendi sorusu nedir?', '¿Qué es la pregunta propia del estudiante?'),
      text: T(
        'When a student chooses "Something else…" for selected code, the student types a question of up to 300 characters. This text is stored as it was typed. It is the only text written by students that the system keeps.',
        'Öğrenci seçilen kod için "Başka bir şey…" seçeneğini seçtiğinde en fazla 300 karakterlik bir soru yazar. Bu metin yazıldığı gibi saklanır. Sistemin sakladığı, öğrencinin yazdığı tek metin budur.',
        'Cuando el estudiante elige «Otra cosa…» para el código seleccionado, escribe una pregunta de hasta 300 caracteres. El texto se guarda tal como se escribió. Es el único texto escrito por los estudiantes que el sistema conserva.',
      ),
    },
    example: {
      en: (f) => `S07 never wrote an own question. ${f.exampleStudent} did: the student selected a loop and wrote "${f.exampleText}" (${f.exampleLength} characters). The explanation that followed answered this question in the usual four steps.`,
      tr: (f) => `S07 hiç kendi sorusunu yazmadı. ${f.exampleStudent} ise yazdı: bir döngüyü seçti ve "${f.exampleText}" yazdı (${f.exampleLength} karakter). Ardından gelen açıklama bu soruyu her zamanki dört adımla yanıtladı.`,
      es: (f) => `S07 nunca escribió una pregunta propia. ${f.exampleStudent} sí lo hizo: seleccionó un bucle y escribió «${f.exampleText}» (${f.exampleLength} caracteres). La explicación respondió a esa pregunta con los cuatro pasos de siempre.`,
    },
    takeaway: {
      en: (f) => `Own questions are rare: ${f.freeText} of ${f.selection} selection questions (${pc(f.pctOfSelection, 'en')}).`,
      tr: (f) => `Kendi sorular seyrek: ${f.selection} seçim sorusunun ${f.freeText} tanesi (${pc(f.pctOfSelection, 'tr')}).`,
      es: (f) => `Las preguntas propias son poco frecuentes: ${f.freeText} de ${f.selection} preguntas por selección (${pc(f.pctOfSelection, 'es')}).`,
    },
    purpose: {
      teacher: T('What do students want to know in their own words?', 'Öğrenciler kendi sözleriyle ne öğrenmek istiyor?', '¿Qué quieren saber los estudiantes con sus propias palabras?'),
      researcher: T('Which misconceptions and question forms appear when students are free to ask?', 'Öğrenciler serbestçe soru sorabildiğinde hangi kavram yanılgıları ve soru biçimleri ortaya çıkıyor?', '¿Qué ideas erróneas y qué formas de pregunta aparecen cuando los estudiantes preguntan libremente?'),
    },
    raw: {
      intro: T('One own question from the sample.', 'Örnekten bir kendi soru.', 'Una pregunta propia de la muestra.'),
      snippets: [{ name: 'own-question', caption: tbl('interactions') }],
    },
    research: {
      stage: T('in the analysis (qualitative coding)', 'analizde (nitel kodlama)', 'en el análisis (codificación cualitativa)'),
      spss: T('`n_own_questions` per student. Code the texts themselves outside SPSS, for example by question form and topic.', 'Öğrenci başına `n_own_questions`. Metinlerin kendisini SPSS dışında kodlayın, örneğin soru biçimine ve konusuna göre.', '`n_own_questions` por estudiante. Codifique los textos fuera de SPSS, por ejemplo por forma de la pregunta y por tema.'),
      analysis: T('Content analysis with two coders and Cohen\'s kappa for agreement.', 'İki kodlayıcıyla içerik analizi ve uyum için Cohen kappa katsayısı.', 'Análisis de contenido con dos codificadores y el kappa de Cohen para el acuerdo.'),
      sentence: T('The free-text questions (at most 300 characters) were coded by two researchers for question form and topic.', 'Serbest metin sorular (en fazla 300 karakter) iki araştırmacı tarafından soru biçimi ve konu açısından kodlanmıştır.', 'Las preguntas de texto libre (como máximo 300 caracteres) fueron codificadas por dos investigadores según su forma y su tema.'),
    },
    rq: { 'interactions.free_text': { RQ1: 'descriptive' } },
    limits: T(
      'The texts are short and few, so they show examples, not a representative picture. A student may write personal information into the box, so read and pseudonymize the texts before sharing them.',
      'Metinler kısa ve az sayıdadır. Bu yüzden temsil edici bir tablo değil, örnekler sunar. Öğrenci kutuya kişisel bilgi yazmış olabilir. Metinleri paylaşmadan önce okuyun ve takma adlandırın.',
      'Los textos son pocos y breves, así que ofrecen ejemplos, no una imagen representativa. Un estudiante puede escribir datos personales en el cuadro, así que lea y seudonimice los textos antes de compartirlos.',
    ),
    teacher: T(
      'Read the own questions of the week before the next lab. Similar questions from several students can be a good start for a short class discussion.',
      'Bir sonraki laboratuvardan önce haftanın kendi sorularını okuyun. Birkaç öğrenciden gelen benzer sorular kısa bir sınıf tartışması için iyi bir başlangıç olabilir.',
      'Lea las preguntas propias de la semana antes del siguiente laboratorio. Preguntas parecidas de varios estudiantes pueden ser un buen punto de partida para un debate breve en clase.',
    ),
  },

  // ------------------------------------------------------------------ selection size
  {
    slug: 'selection-size', category: 'asking',
    items: ['interactions.selection_line_count', 'interactions.selection_char_count'],
    title: T('Selection size', 'Seçim boyutu', 'Tamaño de la selección'),
    what: {
      heading: T('What is the selection size?', 'Seçim boyutu nedir?', '¿Qué es el tamaño de la selección?'),
      text: T(
        'The selection size is how much code the student highlighted before asking, in lines and in characters. It is empty for error questions, and for questions asked without a selection.',
        'Seçim boyutu, öğrencinin soru sormadan önce işaretlediği kod miktarıdır, satır ve karakter olarak. Hata sorularında ve seçim yapılmadan sorulan sorularda boştur.',
        'El tamaño de la selección es la cantidad de código que el estudiante marcó antes de preguntar, en líneas y en caracteres. Está vacío en las preguntas sobre errores y en las preguntas hechas sin selección.',
      ),
    },
    example: {
      en: (f) => `S07 asked ${f.featuredSelections} questions about selected code. The median selection was ${f.featuredMedian} lines, while the class median was ${f.classMedian} lines. A small selection often means a precise idea of where the problem is, and a large one means the student does not know yet.`,
      tr: (f) => `S07 seçilen kod hakkında ${f.featuredSelections} soru sordu. Ortanca seçim ${f.featuredMedian} satırdı, sınıfın ortancası ise ${f.classMedian} satır. Küçük bir seçim çoğu zaman sorunun yeri hakkında net bir fikir olduğunu, büyük bir seçim ise öğrencinin bunu henüz bilmediğini gösterir.`,
      es: (f) => `S07 hizo ${f.featuredSelections} preguntas sobre código seleccionado. La mediana de su selección fue de ${f.featuredMedian} líneas, mientras que la de la clase fue de ${f.classMedian}. Una selección pequeña suele indicar una idea precisa de dónde está el problema, y una grande indica que el estudiante aún no lo sabe.`,
    },
    takeaway: T('Most selections are short. S07 usually selects whole blocks of code.', 'Seçimlerin çoğu kısa. S07 genellikle bütün kod bloklarını seçiyor.', 'La mayoría de las selecciones son cortas. S07 suele seleccionar bloques enteros de código.'),
    purpose: {
      teacher: T('Do students point at the exact place of a problem, or at a large block?', 'Öğrenciler sorunun tam yerini mi, yoksa büyük bir bloğu mu gösteriyor?', '¿Señalan los estudiantes el lugar exacto del problema o un bloque grande?'),
      researcher: T('Does the precision of the question change over the weeks, and does it relate to hint depth?', 'Sorunun kesinliği haftalar içinde değişiyor mu ve ipucu derinliğiyle ilişkili mi?', '¿Cambia la precisión de la pregunta con las semanas y se relaciona con la profundidad de las pistas?'),
    },
    raw: {
      intro: T('Two selection questions of S07.', 'S07’nin iki seçim sorusu.', 'Dos preguntas por selección de S07.'),
      snippets: [{ name: 'selection-size', caption: tbl('interactions') }],
    },
    formulas: [{
      id: 'interactions.selection_line_count',
      heading: T('How the line count is computed', 'Satır sayısı nasıl hesaplanır', 'Cómo se calcula el número de líneas'),
      text: T('Last line of the selection minus first line, plus 1. An empty selection gives no value, not 0.', 'Seçimin son satırı eksi ilk satırı, artı 1. Boş bir seçim 0 değil, değer yok olarak kaydedilir.', 'Última línea de la selección menos la primera, más 1. Una selección vacía no da ningún valor, no 0.'),
    }],
    research: {
      stage: T('in the analysis', 'analizde', 'en el análisis'),
      spss: T('`median_selection_lines` per student, over the questions that have a selection.', 'Seçimi olan sorular üzerinden öğrenci başına `median_selection_lines`.', '`median_selection_lines` por estudiante, sobre las preguntas que tienen selección.'),
      analysis: T('Compare the median selection size of the first and the last weeks with a Wilcoxon signed-rank test.', 'İlk ve son haftaların ortanca seçim boyutunu Wilcoxon işaretli sıralar testiyle karşılaştırın.', 'Compare la mediana del tamaño de la selección de las primeras y las últimas semanas con una prueba de rangos con signo de Wilcoxon.'),
      sentence: T('The number of selected lines was used as an indicator of how precisely the student located the problem.', 'Seçilen satır sayısı, öğrencinin sorunu ne kadar kesin konumlandırdığının göstergesi olarak kullanılmıştır.', 'El número de líneas seleccionadas se usó como indicador de la precisión con que el estudiante localizó el problema.'),
    },
    rq: { 'interactions.selection_line_count': { RQ1: 'descriptive', RQ2: 'predictor' } },
    limits: {
      en: (f) => `The size depends on the task: a question about a whole function needs a large selection. The sidebar button can ask without any selection, which gives no value (${f.missing} questions in the sample). Line count is a rough proxy for precision, not a measure of understanding.`,
      tr: (f) => `Boyut göreve bağlıdır: bütün bir fonksiyon hakkındaki soru büyük bir seçim gerektirir. Kenar paneli düğmesi seçim olmadan da soru sorabilir ve bu durumda değer kaydedilmez (örnekte ${f.missing} soru). Satır sayısı kesinlik için kaba bir göstergedir, anlamanın ölçüsü değildir.`,
      es: (f) => `El tamaño depende de la tarea: una pregunta sobre una función entera necesita una selección grande. El botón de la barra lateral puede preguntar sin selección, lo que no da ningún valor (${f.missing} preguntas en la muestra). El número de líneas es un indicador aproximado de precisión, no una medida de comprensión.`,
    },
    teacher: T(
      'If students always select large blocks, show how to narrow a problem down first, for example by printing a value or by commenting out lines.',
      'Öğrenciler hep büyük bloklar seçiyorsa, sorunu önce nasıl daraltacaklarını gösterin. Örneğin bir değeri yazdırarak ya da satırları yorum satırına çevirerek.',
      'Si los estudiantes siempre seleccionan bloques grandes, muestre cómo acotar primero el problema, por ejemplo imprimiendo un valor o comentando líneas.',
    ),
  },

  // ------------------------------------------------------------------ error type
  {
    slug: 'error-type', category: 'asking',
    items: ['interactions.error_signature', 'interactions.error_source', 'interactions.error_code', 'interactions.error_severity', 'metric.severity_mix'],
    title: T('Error type', 'Hata türü', 'Tipo de error'),
    what: {
      heading: T('What is the error type?', 'Hata türü nedir?', '¿Qué es el tipo de error?'),
      text: T(
        'For an error question, the system stores the error message as the editor showed it, the tool that reported it (for example Pylance), its rule code and its severity (error or warning). Selection questions have no error type.',
        'Hata sorularında sistem, editörün gösterdiği hata mesajını, onu bildiren aracı (örneğin Pylance), kural kodunu ve önem derecesini (hata ya da uyarı) saklar. Seçim sorularının hata türü yoktur.',
        'En una pregunta sobre un error, el sistema guarda el mensaje de error tal como lo mostró el editor, la herramienta que lo informó (por ejemplo Pylance), su código de regla y su gravedad (error o advertencia). Las preguntas por selección no tienen tipo de error.',
      ),
    },
    example: {
      en: (f) => `S07's first error question was about the message \`${f.featuredMessage}\`. Pylance reported it with the code \`${f.featuredCode}\` and the severity "${v('severity', f.featuredSeverity, 'en')}". The rule code is a precise category, while the message changes with every variable name.`,
      tr: (f) => `S07’nin ilk hata sorusu \`${f.featuredMessage}\` mesajı hakkındaydı. Pylance bu hatayı \`${f.featuredCode}\` koduyla ve "${v('severity', f.featuredSeverity, 'tr')}" önem derecesiyle bildirdi. Kural kodu kesin bir kategoridir, mesaj ise her değişken adıyla değişir.`,
      es: (f) => `La primera pregunta de S07 sobre un error fue por el mensaje \`${f.featuredMessage}\`. Pylance lo informó con el código \`${f.featuredCode}\` y la gravedad «${v('severity', f.featuredSeverity, 'es')}». El código de regla es una categoría precisa, mientras que el mensaje cambia con cada nombre de variable.`,
    },
    takeaway: {
      en: (f) => `The largest bar, "${f.top}", holds ${f.topQuestions} questions: syntax errors without a rule code, which the dashboard groups together.`,
      tr: (f) => `En büyük çubuk olan "${f.top}", ${f.topQuestions} soru içeriyor: panelin bir araya topladığı, kural kodu olmayan sözdizimi hataları.`,
      es: (f) => `La barra más grande, «${f.top}», reúne ${f.topQuestions} preguntas: errores de sintaxis sin código de regla, que el panel agrupa juntos.`,
    },
    purpose: {
      teacher: T('Which errors do my students need help with most?', 'Öğrencilerimin en çok yardıma ihtiyaç duyduğu hatalar hangileri?', '¿Con qué errores necesitan más ayuda mis estudiantes?'),
      researcher: T('Which classes of error lead students to ask, and which of them need the full fix?', 'Hangi hata sınıfları öğrencileri soru sormaya yöneltiyor ve bunların hangileri tam çözüm gerektiriyor?', '¿Qué clases de error llevan a preguntar y cuáles necesitan la solución completa?'),
    },
    raw: {
      intro: T('An error question of S07 with its classification.', 'S07’nin sınıflandırmasıyla birlikte bir hata sorusu.', 'Una pregunta de S07 sobre un error, con su clasificación.'),
      snippets: [{ name: 'error-type', caption: tbl('interactions') }],
    },
    formulas: [{
      id: 'metric.severity_mix',
      heading: T('Error questions by severity (dashboard)', 'Önem derecesine göre hata soruları (panel)', 'Preguntas sobre errores por gravedad (panel)'),
      text: {
        en: (f) => `Error questions of the period grouped by severity. In the sample: ${f.errors} errors and ${f.warnings} warnings.`,
        tr: (f) => `Dönemin hata soruları önem derecesine göre gruplanır. Örnekte: ${f.errors} hata ve ${f.warnings} uyarı.`,
        es: (f) => `Las preguntas sobre errores del periodo agrupadas por gravedad. En la muestra: ${f.errors} errores y ${f.warnings} advertencias.`,
      },
    }],
    research: {
      stage: T('in the analysis', 'analizde', 'en el análisis'),
      spss: T('Counts per error category and student, for example `n_err_undefined`. Build the categories from the rule code, and from the message when there is no code.', 'Her hata kategorisi ve öğrenci için sayı, örneğin `n_err_undefined`. Kategorileri kural kodundan, kod yoksa mesajdan oluşturun.', 'Recuentos por categoría de error y estudiante, por ejemplo `n_err_undefined`. Construya las categorías a partir del código de regla, y del mensaje cuando no hay código.'),
      analysis: T('Describe the ten most frequent categories, and compare the share of questions that reached the fix between categories.', 'En sık on kategoriyi betimleyin ve çözüme kadar ilerleyen soruların payını kategoriler arasında karşılaştırın.', 'Describa las diez categorías más frecuentes y compare entre categorías la proporción de preguntas que llegaron a la solución.'),
      sentence: T('Errors were classified by the rule code of the language server (Pylance), and by the normalized message for errors without a code.', 'Hatalar dil sunucusunun (Pylance) kural koduna, kodu olmayan hatalar ise normalleştirilmiş mesaja göre sınıflandırılmıştır.', 'Los errores se clasificaron según el código de regla del servidor de lenguaje (Pylance) y, en los errores sin código, según el mensaje normalizado.'),
    },
    rq: { 'interactions.error_code': { RQ1: 'descriptive', RQ2: 'moderator' }, 'metric.severity_mix': { RQ1: 'descriptive' } },
    limits: T(
      'The dashboard groups errors by "tool + code", and an error without a code falls under the tool name alone. So all syntax errors appear as one row called "Pylance". The message can contain names and values from the student\'s code. Only the first diagnostic of a request is stored.',
      'Panel hataları "araç + kod" biçiminde gruplar. Kodu olmayan bir hata yalnızca araç adının altına düşer. Bu yüzden bütün sözdizimi hataları "Pylance" adlı tek bir satırda görünür. Mesaj, öğrencinin kodundan adlar ve değerler içerebilir. Bir istekte yalnızca ilk tanılama (diagnostic) saklanır.',
      'El panel agrupa los errores por «herramienta + código», y un error sin código queda solo bajo el nombre de la herramienta. Por eso todos los errores de sintaxis aparecen en una única fila llamada «Pylance». El mensaje puede contener nombres y valores del código del estudiante. De cada petición solo se guarda el primer diagnóstico.',
    ),
    teacher: T(
      'If one error type dominates a week, show it once at the start of the next lab and let students predict what the message means before you explain it.',
      'Bir hata türü bir haftaya damgasını vurduysa, bir sonraki laboratuvarın başında onu bir kez gösterin ve siz açıklamadan önce öğrencilerin mesajın anlamını tahmin etmesini isteyin.',
      'Si un tipo de error domina una semana, muéstrelo una vez al inicio del siguiente laboratorio y deje que los estudiantes adivinen qué significa el mensaje antes de explicarlo.',
    ),
  },

  // ------------------------------------------------------------------ question picker abandoned
  {
    slug: 'question-picker-abandoned', category: 'asking',
    items: ['event.question_picker_abandoned', 'event.question_picker_abandoned.stage', 'event.question_picker_abandoned.triggerSurface', 'event.question_picker_abandoned.selectionLineCount', 'event.question_picker_abandoned.selectionCharCount', 'metric.picker_abandoned'],
    title: T('Closed the question picker', 'Soru seçiciyi kapattı', 'Cerró el selector de preguntas'),
    what: {
      heading: T('What is a closed question picker?', 'Kapatılan soru seçici nedir?', '¿Qué es un selector de preguntas cerrado?'),
      text: T(
        'The event is recorded when a student opens the question list for selected code and closes it without asking, or closes the box for an own question without text. No question is created, so this event is the only trace of the attempt.',
        'Bu olay, öğrenci seçilen kod için soru listesini açıp soru sormadan kapattığında ya da kendi sorusu kutusunu boş kapattığında kaydedilir. Hiç soru oluşmaz. Bu yüzden bu olay, girişimin tek izidir.',
        'El evento se registra cuando el estudiante abre la lista de preguntas para código seleccionado y la cierra sin preguntar, o cierra vacío el cuadro de la pregunta propia. No se crea ninguna pregunta, así que este evento es la única huella del intento.',
      ),
    },
    example: {
      en: (f) => `S07 opened the question list ${f.featured} times without asking anything. Each time the event stored where the list was closed and how many lines were selected. In the interactions table these moments do not exist.`,
      tr: (f) => `S07 soru listesini ${f.featured} kez açtı ama hiçbir şey sormadı. Olay her seferinde listenin nerede kapatıldığını ve kaç satırın seçili olduğunu kaydetti. Soru tablosunda bu anlar hiç görünmez.`,
      es: (f) => `S07 abrió la lista de preguntas ${f.featured} veces sin preguntar nada. Cada vez, el evento guardó dónde se cerró la lista y cuántas líneas había seleccionadas. En la tabla de preguntas estos momentos no existen.`,
    },
    takeaway: {
      en: (f) => `In the class, the list was closed ${f.preset} times and the own-question box ${f.freeText} times, against ${f.selection} selection questions asked.`,
      tr: (f) => `Sınıfta liste ${f.preset} kez, kendi sorusu kutusu ${f.freeText} kez kapatıldı. Buna karşılık ${f.selection} seçim sorusu soruldu.`,
      es: (f) => `En la clase, la lista se cerró ${f.preset} veces y el cuadro de pregunta propia ${f.freeText}, frente a ${f.selection} preguntas por selección hechas.`,
    },
    purpose: {
      teacher: T('Do students start to ask and then give up?', 'Öğrenciler sormaya başlayıp sonra vazgeçiyor mu?', '¿Empiezan los estudiantes a preguntar y luego desisten?'),
      researcher: T('How often does hesitation occur before a question, and in which situations?', 'Sorudan önceki tereddüt ne sıklıkla ve hangi durumlarda ortaya çıkıyor?', '¿Con qué frecuencia aparece la duda antes de preguntar y en qué situaciones?'),
    },
    raw: {
      intro: T('One event from the sample.', 'Örnekten bir olay.', 'Un evento de la muestra.'),
      snippets: [{ name: 'question-picker-abandoned', caption: tbl('events', false) }],
    },
    formulas: [{
      id: 'metric.picker_abandoned',
      heading: T('Closed the question list without asking (dashboard)', 'Soru listesini sormadan kapattı (panel)', 'Cerró la lista de preguntas sin preguntar (panel)'),
      text: T('Count of these events in the period, split by where the picker was closed: the list (preset) or the own-question box (free_text).', 'Dönemdeki bu olayların sayısı, seçicinin nerede kapatıldığına göre ayrılır: liste (preset) ya da kendi sorusu kutusu (free_text).', 'Recuento de estos eventos en el periodo, separado según dónde se cerró el selector: la lista (preset) o el cuadro de pregunta propia (free_text).'),
    }],
    research: {
      stage: T('during the intervention and in the analysis', 'müdahale sırasında ve analizde', 'durante la intervención y en el análisis'),
      spss: T('`picker_abandoned_rate` = closed pickers ÷ (closed pickers + selection questions) per student.', 'Öğrenci başına `picker_abandoned_rate` = kapatılan seçiciler ÷ (kapatılan seçiciler + seçim soruları).', '`picker_abandoned_rate` = selectores cerrados ÷ (selectores cerrados + preguntas por selección) por estudiante.'),
      analysis: T('Correlate the rate with the TAM score for perceived usefulness (Spearman).', 'Bu oranı TAM algılanan fayda puanıyla ilişkilendirin (Spearman).', 'Correlacione la tasa con la puntuación TAM de utilidad percibida (Spearman).'),
      sentence: T('Opened but unused question pickers were logged as an indicator of hesitation before help-seeking.', 'Açılıp kullanılmayan soru seçiciler, yardım istemeden önceki tereddüdün göstergesi olarak kaydedilmiştir.', 'Los selectores de preguntas abiertos pero no usados se registraron como indicador de duda antes de pedir ayuda.'),
    },
    rq: { 'event.question_picker_abandoned': { RQ1: 'descriptive', RQ5: 'outcome' } },
    limits: T(
      'The event shows that the picker was closed, not why. The student may have found the answer, changed the selection or clicked by mistake. The event is only saved while a session exists.',
      'Olay seçicinin kapatıldığını gösterir, nedenini değil. Öğrenci yanıtı bulmuş, seçimi değiştirmiş ya da yanlışlıkla tıklamış olabilir. Olay yalnızca bir oturum varken kaydedilir.',
      'El evento muestra que el selector se cerró, no por qué. El estudiante pudo encontrar la respuesta, cambiar la selección o hacer clic por error. El evento solo se guarda si existe una sesión.',
    ),
    teacher: T(
      'If many pickers are closed without a question, show that the four ready questions are safe to try and that no question is "too simple".',
      'Birçok seçici soru sorulmadan kapatılıyorsa, dört hazır sorunun rahatça denenebileceğini ve hiçbir sorunun "fazla basit" olmadığını gösterin.',
      'Si se cierran muchos selectores sin preguntar, muestre que las cuatro preguntas preparadas se pueden probar sin problema y que ninguna pregunta es «demasiado simple».',
    ),
  },
];
