import { dec, pc } from './gen.mjs';

const T = (en, tr, es) => ({ en, tr, es });
const code = (s) => `\`${s}\``;
const some = T('(some columns)', '(bazı sütunlar)', '(algunas columnas)');
const tbl = (name, part = true) => ({ en: `${code(name)}${part ? ` ${some.en}` : ''}`, tr: `${code(name)}${part ? ` ${some.tr}` : ''}`, es: `${code(name)}${part ? ` ${some.es}` : ''}` });
const CS = tbl('coding_sessions');
const LP = tbl('learner_profiles');
const DURING = T('during the intervention and in the analysis', 'müdahale sırasında ve analizde', 'durante la intervención y en el análisis');
const ANALYSIS = T('in the analysis', 'analizde', 'en el análisis');
const COVARIATE = T('in the analysis (as a control variable)', 'analizde (kontrol değişkeni olarak)', 'en el análisis (como variable de control)');
const TWO_SESSIONS = T('Two sessions of S07.', 'S07’nin iki oturumu.', 'Dos sesiones de S07.');
const FLUSH = T(
  'The extension adds to the counter while the student works and merges it into the session row every 3 minutes.',
  'Eklenti öğrenci çalışırken sayacı artırır ve her 3 dakikada bir oturum satırına ekler.',
  'La extensión suma al contador mientras el estudiante trabaja y lo añade a la fila de la sesión cada 3 minutos.',
);
const text3 = (a, b) => ({ en: `${a.en} ${b.en}`, tr: `${a.tr} ${b.tr}`, es: `${a.es} ${b.es}` });

export default [
  // ------------------------------------------------------------------ sessions
  {
    slug: 'sessions', category: 'activity',
    items: ['coding_sessions.started_at', 'coding_sessions.last_seen_at', 'metric.sessions', 'metric.session_length_avg', 'metric.analytics_session_rhythm'],
    title: T('Sessions', 'Oturumlar', 'Sesiones'),
    what: {
      heading: T('What is a session?', 'Oturum nedir?', '¿Qué es una sesión?'),
      text: T(
        'A session is one row in the `coding_sessions` table. The extension creates it when the student signs in or when VS Code opens a window with the student already signed in. All activity counters on the following pages belong to a session.',
        'Oturum, `coding_sessions` tablosundaki bir satırdır. Eklenti bu satırı öğrenci giriş yaptığında ya da VS Code, öğrenci zaten giriş yapmışken bir pencere açtığında oluşturur. Sonraki sayfalardaki tüm etkinlik sayaçları bir oturuma aittir.',
        'Una sesión es una fila de la tabla `coding_sessions`. La extensión la crea cuando el estudiante inicia sesión o cuando VS Code abre una ventana con el estudiante ya conectado. Todos los contadores de actividad de las páginas siguientes pertenecen a una sesión.',
      ),
    },
    example: {
      en: (f) => `S07 had ${f.featuredSessions} sessions in the eight weeks, the class ${dec(f.classMeanSessions, 'en')} on average. Most weeks S07 had one session in the lab. In weeks 3 and 4 there were two, and in week 8 three. In the class, a session lasted ${dec(f.avgMinutes, 'en')} minutes on average.`,
      tr: (f) => `S07’nin sekiz haftada ${f.featuredSessions} oturumu oldu, sınıfın ortalaması ${dec(f.classMeanSessions, 'tr')}. S07’nin çoğu hafta laboratuvarda bir oturumu vardı. 3. ve 4. haftalarda iki, sekizinci haftada üç oturum oldu. Sınıfta bir oturum ortalama ${dec(f.avgMinutes, 'tr')} dakika sürdü.`,
      es: (f) => `S07 tuvo ${f.featuredSessions} sesiones en las ocho semanas, y la clase ${dec(f.classMeanSessions, 'es')} de media. Casi todas las semanas S07 tuvo una sesión en el laboratorio. En las semanas 3 y 4 hubo dos, y en la semana 8, tres. En la clase, una sesión duró ${dec(f.avgMinutes, 'es')} minutos de media.`,
    },
    takeaway: T('Most students have one or two sessions a week. S07 has more sessions in weeks 3, 4 and 8.', 'Öğrencilerin çoğunun haftada bir ya da iki oturumu var. S07’nin 3., 4. ve 8. haftalarda daha fazla oturumu var.', 'La mayoría de los estudiantes tienen una o dos sesiones por semana. S07 tiene más sesiones en las semanas 3, 4 y 8.'),
    purpose: {
      teacher: T('Do students work with the extension outside the lab?', 'Öğrenciler eklentiyle laboratuvar dışında da çalışıyor mu?', '¿Trabajan los estudiantes con la extensión fuera del laboratorio?'),
      researcher: T('What is the unit for the activity counters, and how much did each student use the environment?', 'Etkinlik sayaçlarının birimi nedir ve her öğrenci ortamı ne kadar kullandı?', '¿Cuál es la unidad de los contadores de actividad y cuánto usó cada estudiante el entorno?'),
    },
    raw: {
      intro: TWO_SESSIONS,
      snippets: [{ name: 'sessions', caption: CS }],
    },
    formulas: [
      {
        id: 'metric.sessions',
        heading: T('Sessions (dashboard)', 'Oturumlar (panel)', 'Sesiones (panel)'),
        text: T('Number of session rows that started in the period.', 'Dönemde başlayan oturum satırlarının sayısı.', 'Número de filas de sesión que empezaron en el periodo.'),
      },
      {
        id: 'metric.session_length_avg',
        heading: T('Session length (average, dashboard)', 'Oturum süresi (ortalama, panel)', 'Duración de la sesión (media, panel)'),
        text: T('Mean of the last activity update minus the session start, in minutes, over the sessions of the period.', 'Dönemin oturumları üzerinden son etkinlik güncellemesi eksi oturum başlangıcının ortalaması, dakika olarak.', 'Media de la última actualización de actividad menos el inicio de la sesión, en minutos, en las sesiones del periodo.'),
      },
      {
        id: 'metric.analytics_session_rhythm',
        heading: T('Session rhythm report (SQL)', 'Oturum ritmi raporu (SQL)', 'Informe de ritmo de sesiones (SQL)'),
        text: T('A read-only SQL report in the repository. Per student and week: sessions, mean session minutes, mean active minutes, mean breaks, and sessions by part of the day. It uses the time zone of the database.', 'Depodaki salt okunur bir SQL raporu. Öğrenci ve hafta başına: oturumlar, ortalama oturum dakikası, ortalama aktif dakika, ortalama mola ve günün bölümüne göre oturumlar. Veritabanının saat dilimini kullanır.', 'Un informe SQL de solo lectura del repositorio. Por estudiante y semana: sesiones, minutos medios por sesión, minutos activos medios, pausas medias y sesiones por franja del día. Usa la zona horaria de la base de datos.'),
      },
    ],
    research: {
      stage: COVARIATE,
      spss: T('`n_sessions` and `mean_session_min` per student. Leave out empty sessions (no active time).', 'Öğrenci başına `n_sessions` ve `mean_session_min`. Boş oturumları (aktif süresi olmayanları) dışarıda bırakın.', '`n_sessions` y `mean_session_min` por estudiante. Excluya las sesiones vacías (sin tiempo activo).'),
      analysis: T('Use the number of sessions as a measure of exposure when you compare students or groups.', 'Öğrencileri ya da grupları karşılaştırırken oturum sayısını maruz kalma ölçüsü olarak kullanın.', 'Use el número de sesiones como medida de exposición al comparar estudiantes o grupos.'),
      sentence: T('Usage was summarised per student as the number of coding sessions and their mean length.', 'Kullanım, öğrenci başına kodlama oturumlarının sayısı ve ortalama süresi olarak özetlenmiştir.', 'El uso se resumió por estudiante como el número de sesiones de programación y su duración media.'),
    },
    rq: { 'metric.sessions': { RQ5: 'predictor' } },
    limits: {
      en: (f) => `A reload of VS Code or a second window starts a new session, so a session is not the same as a lab. The end of a session is never stored, and the length is only a lower bound. Sessions without any activity exist (${f.emptySessions} of ${f.allSessions} in the sample).`,
      tr: (f) => `VS Code’un yeniden yüklenmesi ya da ikinci bir pencere yeni bir oturum başlatır. Bu yüzden oturum bir laboratuvarla aynı şey değildir. Oturumun sonu hiçbir zaman saklanmaz ve süre yalnızca bir alt sınırdır. Hiç etkinlik olmayan oturumlar vardır (örnekte ${f.allSessions} oturumun ${f.emptySessions} tanesi).`,
      es: (f) => `Recargar VS Code o abrir una segunda ventana inicia una sesión nueva, así que una sesión no es lo mismo que un laboratorio. El fin de la sesión nunca se guarda, y la duración es solo un límite inferior. Existen sesiones sin actividad (${f.emptySessions} de ${f.allSessions} en la muestra).`,
    },
    teacher: T(
      'Sessions outside lab hours show who practises at home. They are a good starting point for a short talk about study habits.',
      'Laboratuvar saatleri dışındaki oturumlar kimin evde çalıştığını gösterir. Çalışma alışkanlıkları üzerine kısa bir konuşma için iyi bir başlangıçtır.',
      'Las sesiones fuera del horario de laboratorio muestran quién practica en casa. Son un buen punto de partida para una charla breve sobre hábitos de estudio.',
    ),
  },

  // ------------------------------------------------------------------ active days
  {
    slug: 'active-days', category: 'activity',
    items: ['metric.active_days'],
    title: T('Active days', 'Aktif gün', 'Días activos'),
    what: {
      heading: T('What are active days?', 'Aktif günler nedir?', '¿Qué son los días activos?'),
      text: T(
        'Active days are the number of different calendar dates on which at least one session started. It is a simple measure of how regularly a student worked with the extension.',
        'Aktif günler, en az bir oturumun başladığı farklı takvim günlerinin sayısıdır. Öğrencinin eklentiyle ne kadar düzenli çalıştığının basit bir ölçüsüdür.',
        'Los días activos son el número de fechas distintas en las que empezó al menos una sesión. Es una medida sencilla de la regularidad con la que el estudiante trabajó con la extensión.',
      ),
    },
    example: {
      en: (f) => `S07 was active on ${f.featured} days in eight weeks. The student panel shows the same number as "Days using this". The class median was ${f.classMedian} days, so most students also worked on some days outside the ${f.labs} labs.`,
      tr: (f) => `S07 sekiz haftada ${f.featured} gün aktifti. Öğrenci paneli aynı sayıyı "Kullandığın gün sayısı" olarak gösteriyor. Sınıfın ortancası ${f.classMedian} gündü. Yani öğrencilerin çoğu ${f.labs} laboratuvarın dışında da bazı günlerde çalıştı.`,
      es: (f) => `S07 estuvo activo ${f.featured} días en ocho semanas. El panel del estudiante muestra el mismo número como «Días usando esto». La mediana de la clase fue de ${f.classMedian} días, así que la mayoría también trabajó algunos días fuera de los ${f.labs} laboratorios.`,
    },
    takeaway: T('Every student was active on at least six days. S07 is in the 9–11 group, close to the class median.', 'Her öğrenci en az altı gün aktifti. S07 9–11 grubunda, sınıf ortancasına yakın.', 'Todos los estudiantes estuvieron activos al menos seis días. S07 está en el grupo de 9–11, cerca de la mediana de la clase.'),
    purpose: {
      teacher: T('Who uses the extension only in the lab, and who also at home?', 'Eklentiyi kim yalnızca laboratuvarda, kim evde de kullanıyor?', '¿Quién usa la extensión solo en el laboratorio y quién también en casa?'),
      researcher: T('How regular is the use, as a control for exposure?', 'Maruz kalmanın kontrolü olarak kullanım ne kadar düzenli?', '¿Qué regularidad tiene el uso, como control de la exposición?'),
    },
    raw: {
      intro: T('Active days are counted from the session start times. Three sessions of S07 on three different days:', 'Aktif günler oturum başlangıç zamanlarından sayılır. S07’nin üç farklı gündeki üç oturumu:', 'Los días activos se cuentan a partir de las horas de inicio de las sesiones. Tres sesiones de S07 en tres días distintos:'),
      snippets: [{ name: 'active-days', caption: CS }],
    },
    formulas: [{
      id: 'metric.active_days',
      heading: T('Active days (dashboard)', 'Aktif gün (panel)', 'Días activos (panel)'),
      text: T('Distinct calendar dates of the session starts in the period, in the time zone of the person who views the dashboard.', 'Dönemdeki oturum başlangıçlarının farklı takvim günleri, paneli görüntüleyen kişinin saat diliminde.', 'Fechas distintas de los inicios de sesión del periodo, en la zona horaria de quien ve el panel.'),
    }],
    research: {
      stage: COVARIATE,
      spss: T('`active_days` per student.', 'Öğrenci başına `active_days`.', '`active_days` por estudiante.'),
      analysis: T('Add it as a covariate when you relate usage patterns to learning gain.', 'Kullanım örüntülerini öğrenme kazancıyla ilişkilendirirken bunu ortak değişken olarak ekleyin.', 'Inclúyalo como covariable al relacionar los patrones de uso con la ganancia de aprendizaje.'),
      sentence: T('Regularity of use was measured as the number of distinct days with at least one coding session.', 'Kullanımın düzenliliği, en az bir kodlama oturumu olan farklı günlerin sayısı olarak ölçülmüştür.', 'La regularidad de uso se midió como el número de días distintos con al menos una sesión de programación.'),
    },
    rq: { 'metric.active_days': { RQ5: 'predictor', RQ4: 'moderator' } },
    limits: T(
      'The number has three versions: the dashboard uses the viewer\'s time zone, the student panel uses the student\'s computer, and the AI summary uses UTC. A day with only an empty session still counts. It says nothing about how long the student worked that day.',
      'Bu sayının üç sürümü vardır: panel görüntüleyenin saat dilimini, öğrenci paneli öğrencinin bilgisayarını, yapay zekâ özeti ise UTC’yi kullanır. Yalnızca boş bir oturumun olduğu bir gün de sayılır. Öğrencinin o gün ne kadar çalıştığı hakkında bir şey söylemez.',
      'El número tiene tres versiones: el panel usa la zona horaria de quien lo ve, el panel del estudiante usa el ordenador del estudiante y el resumen de IA usa UTC. Un día con solo una sesión vacía también cuenta. No dice nada sobre cuánto trabajó el estudiante ese día.',
    ),
    teacher: T(
      'A student with active days only on lab days is not doing anything wrong. Use the number to plan: short tasks between labs can spread the practice.',
      'Yalnızca laboratuvar günlerinde aktif olan bir öğrenci yanlış bir şey yapmıyor. Sayıyı plan yapmak için kullanın: laboratuvarlar arasındaki kısa görevler alıştırmayı haftaya yayabilir.',
      'Un estudiante activo solo los días de laboratorio no hace nada mal. Use el número para planificar: tareas breves entre laboratorios pueden repartir la práctica.',
    ),
  },

  // ------------------------------------------------------------------ active time
  {
    slug: 'active-time', category: 'activity',
    items: ['coding_sessions.active_seconds', 'metric.active_coding_time'],
    title: T('Active coding time', 'Aktif kodlama süresi', 'Tiempo activo programando'),
    what: {
      heading: T('What is active coding time?', 'Aktif kodlama süresi nedir?', '¿Qué es el tiempo activo programando?'),
      text: T(
        'Active coding time is the time in which the student was doing something in VS Code: typing, moving the cursor, changing the file or saving. Pauses longer than two minutes are not counted.',
        'Aktif kodlama süresi, öğrencinin VS Code’da bir şey yaptığı süredir: yazmak, imleci hareket ettirmek, dosya değiştirmek ya da kaydetmek. İki dakikadan uzun duraklamalar sayılmaz.',
        'El tiempo activo programando es el tiempo en que el estudiante hacía algo en VS Code: escribir, mover el cursor, cambiar de archivo o guardar. Las pausas de más de dos minutos no se cuentan.',
      ),
    },
    example: {
      en: (f) => `S07 had ${dec(f.featuredHours, 'en')} hours of active coding time in eight weeks, and the class ${dec(f.classMeanHours, 'en')} hours on average. The student panel shows the same total as "Total active time". S07 worked much longer than usual in weeks 4 and 8.`,
      tr: (f) => `S07’nin sekiz haftada ${dec(f.featuredHours, 'tr')} saat aktif kodlama süresi oldu, sınıfın ortalaması ${dec(f.classMeanHours, 'tr')} saat. Öğrenci paneli aynı toplamı "Toplam aktif kullanım süresi" olarak gösteriyor. S07 4. ve 8. haftalarda her zamankinden çok daha uzun çalıştı.`,
      es: (f) => `S07 tuvo ${dec(f.featuredHours, 'es')} horas de tiempo activo en ocho semanas, y la clase ${dec(f.classMeanHours, 'es')} horas de media. El panel del estudiante muestra el mismo total como «Tiempo activo total». S07 trabajó bastante más de lo habitual en las semanas 4 y 8.`,
    },
    takeaway: T('The class mean stays between 80 and 92 minutes a week. S07 has two peaks, in weeks 4 and 8.', 'Sınıf ortalaması haftada 80 ile 92 dakika arasında kalıyor. S07’nin 4. ve 8. haftalarda iki tepesi var.', 'La media de la clase se mantiene entre 80 y 92 minutos por semana. S07 tiene dos picos, en las semanas 4 y 8.'),
    purpose: {
      teacher: T('How much time do students spend on the tasks?', 'Öğrenciler görevlere ne kadar zaman ayırıyor?', '¿Cuánto tiempo dedican los estudiantes a las tareas?'),
      researcher: T('How long was each student exposed to the environment, as a base for rates per hour?', 'Saat başına oranlar için bir temel olarak her öğrenci ortama ne kadar süre maruz kaldı?', '¿Cuánto tiempo estuvo expuesto cada estudiante al entorno, como base para tasas por hora?'),
    },
    raw: {
      intro: TWO_SESSIONS,
      snippets: [{ name: 'active-time', caption: CS }],
    },
    formulas: [
      {
        id: 'coding_sessions.active_seconds',
        heading: T('How the time is measured', 'Süre nasıl ölçülür', 'Cómo se mide el tiempo'),
        text: T('Each edit, cursor move, change of file or save while the window has focus is a heartbeat. The gap to the previous heartbeat is added when it is two minutes or less.', 'Pencere odaktayken her düzenleme, imleç hareketi, dosya değişikliği ya da kaydetme bir kalp atışıdır. Önceki kalp atışına olan aralık iki dakika ya da daha kısaysa eklenir.', 'Cada edición, movimiento del cursor, cambio de archivo o guardado con la ventana enfocada es un latido. El intervalo desde el latido anterior se suma cuando es de dos minutos o menos.'),
      },
      {
        id: 'metric.active_coding_time',
        heading: T('Active coding time (dashboard)', 'Aktif kodlama süresi (panel)', 'Tiempo activo programando (panel)'),
        text: T('Sum of the active time over the sessions that started in the period.', 'Dönemde başlayan oturumlar üzerinden aktif sürenin toplamı.', 'Suma del tiempo activo en las sesiones que empezaron en el periodo.'),
      },
    ],
    research: {
      stage: COVARIATE,
      spss: T('`active_hours` per student. Use it as the denominator for rates such as questions per hour.', 'Öğrenci başına `active_hours`. Saat başına soru gibi oranlar için payda olarak kullanın.', '`active_hours` por estudiante. Úselo como denominador de tasas como preguntas por hora.'),
      analysis: T('Normalize counts by active hours before you compare students, and report the mean and SD of active hours per group.', 'Öğrencileri karşılaştırmadan önce sayıları aktif saatlere göre normalleştirin ve grup başına aktif saatlerin ortalamasını ve standart sapmasını raporlayın.', 'Normalice los recuentos por horas activas antes de comparar estudiantes, e informe de la media y la DT de las horas activas por grupo.'),
      sentence: T('Active coding time was estimated from editor activity, counting gaps between events of up to two minutes.', 'Aktif kodlama süresi editör etkinliğinden, olaylar arasındaki en fazla iki dakikalık aralıklar sayılarak tahmin edilmiştir.', 'El tiempo activo se estimó a partir de la actividad del editor, contando los intervalos entre eventos de hasta dos minutos.'),
    },
    rq: { 'coding_sessions.active_seconds': { RQ4: 'moderator', RQ5: 'predictor' }, 'metric.active_coding_time': { RQ5: 'predictor' } },
    limits: T(
      'Reading code or an explanation without moving the cursor for more than two minutes is not counted. Time in the browser or on paper is not seen. A student who leaves the cursor moving in an idle window would add time, but this is unlikely.',
      'İmleci iki dakikadan uzun süre oynatmadan kod ya da açıklama okumak sayılmaz. Tarayıcıda ya da kâğıt üzerinde geçen süre görülmez. Boş bir pencerede imleci hareket ettiren bir öğrenci süre ekler, ama bu pek olası değildir.',
      'Leer código o una explicación sin mover el cursor durante más de dos minutos no se cuenta. El tiempo en el navegador o en papel no se ve. Un estudiante que moviera el cursor en una ventana sin uso añadiría tiempo, pero es poco probable.',
    ),
    teacher: T(
      'Compare the active time with the length of the lab. A large difference can mean long reading, talking with classmates or work outside VS Code.',
      'Aktif süreyi laboratuvarın süresiyle karşılaştırın. Büyük bir fark uzun okuma, arkadaşlarla konuşma ya da VS Code dışında çalışma anlamına gelebilir.',
      'Compare el tiempo activo con la duración del laboratorio. Una gran diferencia puede indicar lectura larga, conversación con compañeros o trabajo fuera de VS Code.',
    ),
  },

  // ------------------------------------------------------------------ lines
  {
    slug: 'lines', category: 'activity',
    items: ['coding_sessions.lines_written', 'coding_sessions.lines_deleted'],
    title: T('Lines added and deleted', 'Eklenen ve silinen satırlar', 'Líneas añadidas y borradas'),
    what: {
      heading: T('What are lines added and deleted?', 'Eklenen ve silinen satırlar nedir?', '¿Qué son las líneas añadidas y borradas?'),
      text: T(
        'The extension counts the new lines and the removed lines in each edit of a file. Undo, redo and very large edits (more than 20 lines at once) are left out. The code itself is not sent.',
        'Eklenti bir dosyadaki her düzenlemede yeni satırları ve silinen satırları sayar. Geri alma, yineleme ve çok büyük düzenlemeler (bir seferde 20 satırdan fazla) dışarıda kalır. Kodun kendisi gönderilmez.',
        'La extensión cuenta las líneas nuevas y las líneas eliminadas en cada edición de un archivo. Se excluyen deshacer, rehacer y las ediciones muy grandes (más de 20 líneas a la vez). El código en sí no se envía.',
      ),
    },
    example: {
      en: (f) => `S07 added ${f.featuredWritten} lines and deleted ${f.featuredDeleted} lines in eight weeks. The class added ${f.classMeanWritten} lines per student on average. S07 added the most lines in weeks 4 and 8, the same weeks with the longest active time.`,
      tr: (f) => `S07 sekiz haftada ${f.featuredWritten} satır ekledi ve ${f.featuredDeleted} satır sildi. Sınıf öğrenci başına ortalama ${f.classMeanWritten} satır ekledi. S07 en çok satırı 4. ve 8. haftalarda ekledi. Bunlar aktif sürenin en uzun olduğu haftalar.`,
      es: (f) => `S07 añadió ${f.featuredWritten} líneas y borró ${f.featuredDeleted} en ocho semanas. La clase añadió ${f.classMeanWritten} líneas por estudiante de media. S07 añadió más líneas en las semanas 4 y 8, las mismas semanas con más tiempo activo.`,
    },
    takeaway: T('The class adds about 90 lines per student each week. S07 is close to the class, with peaks in weeks 4 and 8.', 'Sınıf her hafta öğrenci başına yaklaşık 90 satır ekliyor. S07 sınıfa yakın, 4. ve 8. haftalarda tepeleri var.', 'La clase añade unas 90 líneas por estudiante cada semana. S07 está cerca de la clase, con picos en las semanas 4 y 8.'),
    purpose: {
      teacher: T('How much code do students write in a lab?', 'Öğrenciler bir laboratuvarda ne kadar kod yazıyor?', '¿Cuánto código escriben los estudiantes en un laboratorio?'),
      researcher: T('How much production is there, and how much of it is rewriting?', 'Ne kadar üretim var ve bunun ne kadarı yeniden yazma?', '¿Cuánta producción hay y cuánta es reescritura?'),
    },
    raw: {
      intro: TWO_SESSIONS,
      snippets: [{ name: 'lines', caption: CS }],
    },
    formulas: [
      {
        id: 'coding_sessions.lines_written',
        heading: T('How lines added are counted', 'Eklenen satırlar nasıl sayılır', 'Cómo se cuentan las líneas añadidas'),
        text: T('Sum of the new line breaks in the edits of files on disk. Undo and redo are left out, and an edit that adds or removes more than 20 lines is ignored.', 'Diskteki dosyaların düzenlemelerindeki yeni satır sonlarının toplamı. Geri alma ve yineleme dışarıda kalır ve 20 satırdan fazlasını ekleyen ya da silen bir düzenleme yok sayılır.', 'Suma de los saltos de línea nuevos en las ediciones de archivos en disco. Se excluyen deshacer y rehacer, y se ignora una edición que añade o quita más de 20 líneas.'),
      },
      {
        id: 'coding_sessions.lines_deleted',
        heading: T('How lines deleted are counted', 'Silinen satırlar nasıl sayılır', 'Cómo se cuentan las líneas borradas'),
        text: T('Sum of the removed line spans in the same edits, with the same rules.', 'Aynı kurallarla, aynı düzenlemelerdeki silinen satır aralıklarının toplamı.', 'Suma de los tramos de líneas eliminados en las mismas ediciones, con las mismas reglas.'),
      },
    ],
    research: {
      stage: COVARIATE,
      spss: T('`lines_added` and `lines_deleted` per student, and `rewrite_ratio` = deleted ÷ added.', 'Öğrenci başına `lines_added` ve `lines_deleted` ile `rewrite_ratio` = silinen ÷ eklenen.', '`lines_added` y `lines_deleted` por estudiante, y `rewrite_ratio` = borradas ÷ añadidas.'),
      analysis: T('Use lines added per active hour as a rough productivity control.', 'Aktif saat başına eklenen satırları kaba bir üretkenlik kontrolü olarak kullanın.', 'Use las líneas añadidas por hora activa como control aproximado de productividad.'),
      sentence: T('Code production was approximated by the number of lines added and deleted, excluding undo, redo and edits larger than 20 lines.', 'Kod üretimi, geri alma, yineleme ve 20 satırdan büyük düzenlemeler hariç, eklenen ve silinen satır sayısıyla yaklaşık olarak ölçülmüştür.', 'La producción de código se aproximó con el número de líneas añadidas y borradas, sin deshacer, rehacer ni ediciones de más de 20 líneas.'),
    },
    limits: T(
      'A line is a line break, so a long line and an empty line count the same. Pasted code up to 20 lines is counted as written. The numbers say nothing about the quality of the code.',
      'Bir satır bir satır sonudur, bu yüzden uzun bir satır ile boş bir satır aynı sayılır. 20 satıra kadar yapıştırılan kod yazılmış sayılır. Sayılar kodun niteliği hakkında bir şey söylemez.',
      'Una línea es un salto de línea, así que una línea larga y una vacía cuentan igual. El código pegado de hasta 20 líneas se cuenta como escrito. Los números no dicen nada sobre la calidad del código.',
    ),
    teacher: T(
      'Many deleted lines are not a bad sign. They often show that a student tries, checks and rewrites.',
      'Çok sayıda silinen satır kötü bir işaret değildir. Çoğu zaman öğrencinin denediğini, kontrol ettiğini ve yeniden yazdığını gösterir.',
      'Muchas líneas borradas no son una mala señal. A menudo muestran que el estudiante prueba, comprueba y reescribe.',
    ),
  },

  // ------------------------------------------------------------------ files created
  {
    slug: 'files-created', category: 'activity',
    items: ['coding_sessions.files_created'],
    title: T('Files created', 'Oluşturulan dosya', 'Archivos creados'),
    what: {
      heading: T('What are files created?', 'Oluşturulan dosyalar nedir?', '¿Qué son los archivos creados?'),
      text: T(
        'The counter goes up by one for each file that the student creates through VS Code, for example with "New File" in the explorer. File names are not stored here.',
        'Sayaç, öğrencinin VS Code aracılığıyla oluşturduğu her dosya için bir artar, örneğin gezgindeki "Yeni Dosya" ile. Dosya adları burada saklanmaz.',
        'El contador sube uno por cada archivo que el estudiante crea desde VS Code, por ejemplo con «Nuevo archivo» en el explorador. Aquí no se guardan los nombres de archivo.',
      ),
    },
    example: {
      en: (f) => `S07 created ${f.featured} files in eight weeks. The class median was ${f.classMedian}.`,
      tr: (f) => `S07 sekiz haftada ${f.featured} dosya oluşturdu. Sınıfın ortancası ${f.classMedian} idi.`,
      es: (f) => `S07 creó ${f.featured} archivos en ocho semanas. La mediana de la clase fue ${f.classMedian}.`,
    },
    takeaway: T('Most students created three to eight files in eight weeks. S07 is in the 3–5 group.', 'Öğrencilerin çoğu sekiz haftada üç ile sekiz dosya oluşturdu. S07 3–5 grubunda.', 'La mayoría de los estudiantes crearon entre tres y ocho archivos en ocho semanas. S07 está en el grupo de 3–5.'),
    purpose: {
      teacher: T('Do students start a new file for each task?', 'Öğrenciler her görev için yeni bir dosya açıyor mu?', '¿Empiezan los estudiantes un archivo nuevo para cada tarea?'),
      researcher: T('How do students organize their work?', 'Öğrenciler çalışmalarını nasıl düzenliyor?', '¿Cómo organizan los estudiantes su trabajo?'),
    },
    raw: {
      intro: TWO_SESSIONS,
      snippets: [{ name: 'files-created', caption: CS }],
    },
    formulas: [{
      id: 'coding_sessions.files_created',
      heading: T('How it is counted', 'Nasıl sayılır', 'Cómo se cuenta'),
      text: FLUSH,
    }],
    research: {
      stage: ANALYSIS,
      spss: T('`files_created` per student.', 'Öğrenci başına `files_created`.', '`files_created` por estudiante.'),
      analysis: T('Describe only. Use it to check whether students followed the task structure of the course.', 'Yalnızca betimleyin. Öğrencilerin dersin görev yapısını izleyip izlemediğini kontrol etmek için kullanın.', 'Solo de forma descriptiva. Úselo para comprobar si los estudiantes siguieron la estructura de tareas de la asignatura.'),
      sentence: T('The number of files created in the editor was recorded as a descriptive indicator of how students organised their work.', 'Editörde oluşturulan dosya sayısı, öğrencilerin çalışmalarını nasıl düzenlediğinin betimsel bir göstergesi olarak kaydedilmiştir.', 'El número de archivos creados en el editor se registró como indicador descriptivo de cómo organizaban los estudiantes su trabajo.'),
    },
    limits: T(
      'Files created in the terminal, by another program or by copying a folder are not counted. Files given by the teacher are not counted either. The number says nothing about what the files contain.',
      'Terminalde, başka bir programla ya da bir klasör kopyalanarak oluşturulan dosyalar sayılmaz. Öğretmenin verdiği dosyalar da sayılmaz. Sayı dosyaların içeriği hakkında bir şey söylemez.',
      'No se cuentan los archivos creados en el terminal, con otro programa o copiando una carpeta. Tampoco los archivos que da el profesorado. El número no dice nada sobre el contenido de los archivos.',
    ),
    teacher: T(
      'If your tasks expect one file per exercise, a very low number can explain why students lose track of older solutions.',
      'Görevleriniz her alıştırma için bir dosya bekliyorsa, çok düşük bir sayı öğrencilerin eski çözümlerini neden kaybettiğini açıklayabilir.',
      'Si sus tareas esperan un archivo por ejercicio, un número muy bajo puede explicar por qué los estudiantes pierden de vista soluciones anteriores.',
    ),
  },

  // ------------------------------------------------------------------ languages edited
  {
    slug: 'languages-edited', category: 'activity',
    items: ['coding_sessions.language_counts', 'metric.languages_top'],
    title: T('Languages edited', 'Düzenlenen diller', 'Lenguajes editados'),
    what: {
      heading: T('What are the languages edited?', 'Düzenlenen diller nedir?', '¿Qué son los lenguajes editados?'),
      text: T(
        'For each counted edit, the extension adds one to the language of the file, as VS Code names it (for example `python` or `markdown`). The result is a small list of languages with a number each.',
        'Sayılan her düzenleme için eklenti, dosyanın diline bir ekler. Dil, VS Code’un verdiği addır (örneğin `python` ya da `markdown`). Sonuç, her biri bir sayıyla birlikte küçük bir dil listesidir.',
        'Por cada edición contada, la extensión suma uno al lenguaje del archivo, con el nombre que le da VS Code (por ejemplo `python` o `markdown`). El resultado es una pequeña lista de lenguajes con un número cada uno.',
      ),
    },
    example: {
      en: (f) => `S07 edited files in ${f.languages} languages, and ${pc(f.pythonPct, 'en')} of the edits were in Python. The other edits were in Markdown and plain text files.`,
      tr: (f) => `S07 ${f.languages} dilde dosya düzenledi ve düzenlemelerin ${pc(f.pythonPct, 'tr')} kadarı Python’daydı. Diğer düzenlemeler Markdown ve düz metin dosyalarındaydı.`,
      es: (f) => `S07 editó archivos en ${f.languages} lenguajes, y el ${pc(f.pythonPct, 'es')} de las ediciones fueron en Python. Las demás fueron en archivos Markdown y de texto plano.`,
    },
    takeaway: T('Almost all edits of S07 are in Python, as expected in a Python course.', 'S07’nin neredeyse tüm düzenlemeleri, bir Python dersinde beklendiği gibi, Python’da.', 'Casi todas las ediciones de S07 son en Python, como se espera en una asignatura de Python.'),
    purpose: {
      teacher: T('Do students work in the language of the course?', 'Öğrenciler dersin dilinde mi çalışıyor?', '¿Trabajan los estudiantes en el lenguaje de la asignatura?'),
      researcher: T('Which share of the activity belongs to the course language, as a check on the data?', 'Verinin bir kontrolü olarak, etkinliğin ne kadarı dersin diline ait?', '¿Qué parte de la actividad corresponde al lenguaje de la asignatura, como comprobación de los datos?'),
    },
    raw: {
      intro: TWO_SESSIONS,
      snippets: [{ name: 'languages-edited', caption: CS }],
    },
    formulas: [
      {
        id: 'coding_sessions.language_counts',
        heading: T('How it is counted', 'Nasıl sayılır', 'Cómo se cuenta'),
        text: T('Each edit that counts for the lines added or deleted adds 1 to the language of its file. The numbers are merged by addition for each language.', 'Eklenen ya da silinen satırlar için sayılan her düzenleme, dosyasının diline 1 ekler. Sayılar her dil için toplanarak birleştirilir.', 'Cada edición que cuenta para las líneas añadidas o borradas suma 1 al lenguaje de su archivo. Los números se combinan sumando por lenguaje.'),
      },
      {
        id: 'metric.languages_top',
        heading: T('Languages edited (dashboard)', 'Düzenlenen diller (panel)', 'Lenguajes editados (panel)'),
        text: T('The six languages with the most edits over the sessions of the period.', 'Dönemin oturumları üzerinden en çok düzenlemesi olan altı dil.', 'Los seis lenguajes con más ediciones en las sesiones del periodo.'),
      },
    ],
    research: {
      stage: ANALYSIS,
      spss: T('`course_language_share` = edits in the course language ÷ all edits, per student.', 'Öğrenci başına `course_language_share` = ders dilindeki düzenlemeler ÷ tüm düzenlemeler.', '`course_language_share` = ediciones en el lenguaje de la asignatura ÷ todas las ediciones, por estudiante.'),
      analysis: T('Use it for data cleaning: a student with little activity in the course language may have used another editor for the tasks.', 'Veri temizliği için kullanın: ders dilinde az etkinliği olan bir öğrenci görevler için başka bir editör kullanmış olabilir.', 'Úselo para la limpieza de datos: un estudiante con poca actividad en el lenguaje de la asignatura pudo usar otro editor para las tareas.'),
      sentence: T('The share of editing activity in the course language was used to check that the logged activity reflected the programming tasks.', 'Ders dilindeki düzenleme etkinliğinin payı, kaydedilen etkinliğin programlama görevlerini yansıttığını kontrol etmek için kullanılmıştır.', 'La proporción de actividad de edición en el lenguaje de la asignatura se usó para comprobar que la actividad registrada reflejaba las tareas de programación.'),
    },
    limits: T(
      'The count is of edits, not of lines or time. The language comes from VS Code, so a Python file saved without the `.py` extension can appear as plain text. It does not show which language the student knows best.',
      'Sayılan şey düzenlemelerdir, satırlar ya da süre değil. Dil VS Code’dan gelir, bu yüzden `.py` uzantısı olmadan kaydedilen bir Python dosyası düz metin olarak görünebilir. Öğrencinin en iyi bildiği dili göstermez.',
      'Se cuentan ediciones, no líneas ni tiempo. El lenguaje viene de VS Code, así que un archivo Python guardado sin la extensión `.py` puede aparecer como texto plano. No muestra qué lenguaje conoce mejor el estudiante.',
    ),
    teacher: T(
      'If many edits are in plain text, remind students to save their programs with the right file extension. Otherwise VS Code cannot show errors for them.',
      'Düzenlemelerin çoğu düz metindeyse öğrencilere programlarını doğru dosya uzantısıyla kaydetmelerini hatırlatın. Aksi halde VS Code onlar için hata gösteremez.',
      'Si muchas ediciones son en texto plano, recuerde a los estudiantes que guarden sus programas con la extensión correcta. Si no, VS Code no puede mostrarles los errores.',
    ),
  },

  // ------------------------------------------------------------------ large pastes
  {
    slug: 'large-pastes', category: 'activity',
    items: ['coding_sessions.large_paste_count', 'coding_sessions.large_paste_lines'],
    title: T('Large pastes', 'Büyük yapıştırma', 'Pegados grandes'),
    what: {
      heading: T('What is a large paste?', 'Büyük yapıştırma nedir?', '¿Qué es un pegado grande?'),
      text: T(
        'A large paste is one edit that adds more than 20 lines at once and removes at most one line. VS Code does not say whether an edit was a paste, so this is an estimate. The pasted text is not sent.',
        'Büyük yapıştırma, bir seferde 20 satırdan fazla ekleyen ve en fazla bir satır silen tek bir düzenlemedir. VS Code bir düzenlemenin yapıştırma olup olmadığını söylemez, bu yüzden bu bir tahmindir. Yapıştırılan metin gönderilmez.',
        'Un pegado grande es una edición que añade más de 20 líneas de una vez y quita como mucho una línea. VS Code no indica si una edición fue un pegado, así que es una estimación. El texto pegado no se envía.',
      ),
    },
    example: {
      en: (f) => `S07 made ${f.featured} large pastes in eight weeks. In the class, ${f.withAny} of 25 students made at least one, and one student made ${f.maxStudent}. Together the class pasted ${f.lines} lines this way.`,
      tr: (f) => `S07 sekiz haftada ${f.featured} büyük yapıştırma yaptı. Sınıfta 25 öğrencinin ${f.withAny} tanesi en az bir tane yaptı ve bir öğrenci ${f.maxStudent} tane yaptı. Sınıf bu yolla toplam ${f.lines} satır yapıştırdı.`,
      es: (f) => `S07 hizo ${f.featured} pegados grandes en ocho semanas. En la clase, ${f.withAny} de 25 estudiantes hicieron al menos uno, y un estudiante hizo ${f.maxStudent}. En total, la clase pegó ${f.lines} líneas de esta forma.`,
    },
    takeaway: T('Most students paste a large block only a few times in eight weeks. One student stands out with many large pastes.', 'Öğrencilerin çoğu sekiz haftada yalnızca birkaç kez büyük bir blok yapıştırıyor. Bir öğrenci çok sayıda büyük yapıştırmayla öne çıkıyor.', 'La mayoría de los estudiantes pegan un bloque grande solo unas pocas veces en ocho semanas. Un estudiante destaca con muchos pegados grandes.'),
    purpose: {
      teacher: T('Is code coming into the tasks from outside?', 'Görevlere dışarıdan kod geliyor mu?', '¿Entra código en las tareas desde fuera?'),
      researcher: T('How much of the code was not typed, which may affect the other activity measures?', 'Kodun ne kadarı yazılmadı ve bu diğer etkinlik ölçülerini etkileyebilir mi?', '¿Cuánto código no se tecleó, lo que puede afectar a las demás medidas de actividad?'),
    },
    raw: {
      intro: T('One session from the sample with a large paste.', 'Örnekten büyük bir yapıştırma içeren bir oturum.', 'Una sesión de la muestra con un pegado grande.'),
      snippets: [{ name: 'large-pastes', caption: CS }],
    },
    formulas: [
      {
        id: 'coding_sessions.large_paste_count',
        heading: T('How a large paste is detected', 'Büyük yapıştırma nasıl belirlenir', 'Cómo se detecta un pegado grande'),
        text: T('One edit event with exactly one change that adds more than 20 lines and removes at most 1 line.', 'Tam olarak bir değişiklik içeren, 20 satırdan fazla ekleyen ve en fazla 1 satır silen tek bir düzenleme olayı.', 'Un evento de edición con exactamente un cambio que añade más de 20 líneas y quita como mucho 1 línea.'),
      },
      {
        id: 'coding_sessions.large_paste_lines',
        heading: T('Large paste lines', 'Büyük yapıştırma satırı', 'Líneas de pegados grandes'),
        text: T('Sum of the added lines of these edits.', 'Bu düzenlemelerin eklenen satırlarının toplamı.', 'Suma de las líneas añadidas de esas ediciones.'),
      },
    ],
    research: {
      stage: ANALYSIS,
      spss: T('`large_pastes` per student, and `paste_share` = large paste lines ÷ (lines added + large paste lines).', 'Öğrenci başına `large_pastes` ve `paste_share` = büyük yapıştırma satırları ÷ (eklenen satırlar + büyük yapıştırma satırları).', '`large_pastes` por estudiante, y `paste_share` = líneas de pegados grandes ÷ (líneas añadidas + líneas de pegados grandes).'),
      analysis: T('Use it as a control or for a sensitivity analysis: repeat the main analysis without students with a high paste share.', 'Kontrol olarak ya da bir duyarlılık analizi için kullanın: ana analizi yapıştırma payı yüksek öğrenciler olmadan tekrarlayın.', 'Úselo como control o para un análisis de sensibilidad: repita el análisis principal sin los estudiantes con una proporción alta de pegados.'),
      sentence: T('Single edits adding more than 20 lines were counted as large pastes and used in a sensitivity analysis.', '20 satırdan fazla ekleyen tek düzenlemeler büyük yapıştırma olarak sayılmış ve bir duyarlılık analizinde kullanılmıştır.', 'Las ediciones únicas que añadían más de 20 líneas se contaron como pegados grandes y se usaron en un análisis de sensibilidad.'),
    },
    limits: T(
      'The source of the paste is unknown: it can be the student\'s own older code, a template from the teacher or code from the web. A code template from an extension can look the same. Pastes of 20 lines or less are not counted here.',
      'Yapıştırmanın kaynağı bilinmez: öğrencinin kendi eski kodu, öğretmenden bir şablon ya da internetten kod olabilir. Bir eklentiden gelen kod şablonu da aynı görünebilir. 20 satır ya da daha kısa yapıştırmalar burada sayılmaz.',
      'Se desconoce el origen del pegado: puede ser código antiguo del propio estudiante, una plantilla del profesorado o código de internet. Una plantilla de código de otra extensión puede verse igual. Los pegados de 20 líneas o menos no se cuentan aquí.',
    ),
    teacher: T(
      'Do not treat a large paste as copying from others. If you give starter code, a paste at the start of the lab is expected.',
      'Büyük bir yapıştırmayı başkasından kopyalama olarak görmeyin. Başlangıç kodu veriyorsanız, laboratuvarın başındaki bir yapıştırma beklenen bir durumdur.',
      'No trate un pegado grande como copia de otros. Si da código de partida, es normal un pegado al inicio del laboratorio.',
    ),
  },

  // ------------------------------------------------------------------ left VS Code
  {
    slug: 'left-vscode', category: 'activity',
    items: ['coding_sessions.focus_loss_count', 'coding_sessions.unfocused_seconds', 'metric.habits_totals'],
    title: T('Left VS Code', 'VS Code’dan ayrıldı', 'Salió de VS Code'),
    what: {
      heading: T('What does "left VS Code" mean?', '"VS Code’dan ayrıldı" ne demek?', '¿Qué significa «salió de VS Code»?'),
      text: T(
        'The counter goes up each time the VS Code window loses focus, for example when the student clicks on the browser. A second number sums the time until the student comes back, with at most ten minutes per absence.',
        'Sayaç, VS Code penceresi her odağı kaybettiğinde artar, örneğin öğrenci tarayıcıya tıkladığında. İkinci bir sayı, öğrenci geri dönene kadar geçen süreyi toplar. Her ayrılık için en fazla on dakika sayılır.',
        'El contador sube cada vez que la ventana de VS Code pierde el foco, por ejemplo cuando el estudiante hace clic en el navegador. Un segundo número suma el tiempo hasta que vuelve, con un máximo de diez minutos por ausencia.',
      ),
    },
    example: {
      en: (f) => `S07 left VS Code ${f.featuredLosses} times in eight weeks and was away for ${f.featuredAwayMin} minutes in total. The class mean was ${f.classMeanLosses} times. In week 8, S07 left VS Code most often.`,
      tr: (f) => `S07 sekiz haftada ${f.featuredLosses} kez VS Code’dan ayrıldı ve toplam ${f.featuredAwayMin} dakika dışarıda kaldı. Sınıf ortalaması ${f.classMeanLosses} kezdi. S07 en sık sekizinci haftada VS Code’dan ayrıldı.`,
      es: (f) => `S07 salió de VS Code ${f.featuredLosses} veces en ocho semanas y estuvo fuera ${f.featuredAwayMin} minutos en total. La media de la clase fue de ${f.classMeanLosses} veces. En la semana 8, S07 salió de VS Code con más frecuencia.`,
    },
    takeaway: T('The class leaves VS Code about seven times a week. S07 is close to the class, with a peak in week 8.', 'Sınıf haftada yaklaşık yedi kez VS Code’dan ayrılıyor. S07 sınıfa yakın, sekizinci haftada bir tepesi var.', 'La clase sale de VS Code unas siete veces por semana. S07 está cerca de la clase, con un pico en la semana 8.'),
    purpose: {
      teacher: T('Do students look for help outside the editor, for example in the browser?', 'Öğrenciler editörün dışında, örneğin tarayıcıda yardım arıyor mu?', '¿Buscan los estudiantes ayuda fuera del editor, por ejemplo en el navegador?'),
      researcher: T('How often do students switch to other sources, which the extension cannot see?', 'Öğrenciler eklentinin göremediği başka kaynaklara ne sıklıkla geçiyor?', '¿Con qué frecuencia pasan los estudiantes a otras fuentes, que la extensión no puede ver?'),
    },
    raw: {
      intro: TWO_SESSIONS,
      snippets: [{ name: 'left-vscode', caption: CS }],
    },
    formulas: [
      {
        id: 'coding_sessions.unfocused_seconds',
        heading: T('How the time away is measured', 'Dışarıda geçen süre nasıl ölçülür', 'Cómo se mide el tiempo fuera'),
        text: T('Length of each finished absence (the window loses focus, then gets it back), with at most ten minutes per absence. An absence that never ends, for example because VS Code closes, is not counted.', 'Tamamlanan her ayrılığın süresi (pencere odağı kaybeder, sonra geri alır), her ayrılık için en fazla on dakika. Hiç bitmeyen bir ayrılık, örneğin VS Code kapandığı için, sayılmaz.', 'Duración de cada ausencia terminada (la ventana pierde el foco y luego lo recupera), con un máximo de diez minutos por ausencia. Una ausencia que nunca termina, por ejemplo porque se cierra VS Code, no se cuenta.'),
      },
      {
        id: 'metric.habits_totals',
        heading: T('Work habits (dashboard)', 'Çalışma alışkanlıkları (panel)', 'Hábitos de trabajo (panel)'),
        text: T('The dashboard sums this counter and the other habit counters on the next pages over the sessions of the period.', 'Panel bu sayacı ve sonraki sayfalardaki diğer alışkanlık sayaçlarını dönemin oturumları üzerinden toplar.', 'El panel suma este contador y los demás contadores de hábitos de las páginas siguientes en las sesiones del periodo.'),
      },
    ],
    research: {
      stage: DURING,
      spss: T('`focus_losses_per_hour` = times left ÷ active hours, and `away_min`, per student.', 'Öğrenci başına `focus_losses_per_hour` = ayrılma sayısı ÷ aktif saat ve `away_min`.', '`focus_losses_per_hour` = salidas ÷ horas activas, y `away_min`, por estudiante.'),
      analysis: T('Relate leaving VS Code to the number of questions: students who ask less may look for help elsewhere (Spearman).', 'VS Code’dan ayrılmayı soru sayısıyla ilişkilendirin: daha az soran öğrenciler başka yerde yardım arıyor olabilir (Spearman).', 'Relacione las salidas de VS Code con el número de preguntas: quienes preguntan menos pueden buscar ayuda en otro sitio (Spearman).'),
      sentence: T('Switches away from the editor window were counted as an indirect indicator of help sought outside the extension.', 'Editör penceresinden başka yere geçişler, eklenti dışında aranan yardımın dolaylı bir göstergesi olarak sayılmıştır.', 'Los cambios fuera de la ventana del editor se contaron como indicador indirecto de ayuda buscada fuera de la extensión.'),
    },
    rq: { 'coding_sessions.focus_loss_count': { RQ1: 'descriptive' } },
    limits: T(
      'The extension does not know where the student went: it can be the task sheet, a search engine, another AI tool or a chat. A click on the terminal panel inside VS Code does not count. Time away is capped, so long breaks look short.',
      'Eklenti öğrencinin nereye gittiğini bilmez: görev kâğıdı, bir arama motoru, başka bir yapay zekâ aracı ya da bir sohbet olabilir. VS Code içindeki terminal paneline tıklamak sayılmaz. Dışarıda geçen süre sınırlıdır, bu yüzden uzun molalar kısa görünür.',
      'La extensión no sabe adónde fue el estudiante: puede ser el enunciado, un buscador, otra herramienta de IA o un chat. Un clic en el panel del terminal dentro de VS Code no cuenta. El tiempo fuera tiene un límite, así que las pausas largas parecen cortas.',
    ),
    teacher: T(
      'If you give the task sheet as a PDF, students must leave VS Code to read it. Putting the task into the code file as a comment keeps them in one place.',
      'Görev kâğıdını PDF olarak veriyorsanız öğrenciler onu okumak için VS Code’dan ayrılmak zorundadır. Görevi kod dosyasına yorum olarak koymak onları tek bir yerde tutar.',
      'Si da el enunciado en PDF, los estudiantes tienen que salir de VS Code para leerlo. Poner la tarea como comentario en el archivo de código los mantiene en un solo lugar.',
    ),
  },

  // ------------------------------------------------------------------ saves
  {
    slug: 'saves', category: 'activity',
    items: ['coding_sessions.save_count'],
    title: T('Saves', 'Kaydetme', 'Guardados'),
    what: {
      heading: T('What are saves?', 'Kaydetmeler nedir?', '¿Qué son los guardados?'),
      text: T(
        'The counter goes up by one each time a file is saved in VS Code. Beginners often save right before they run the program, so saves are a rough sign of the "try it and see" loop.',
        'Sayaç, VS Code’da bir dosya her kaydedildiğinde bir artar. Yeni başlayanlar çoğu zaman programı çalıştırmadan hemen önce kaydeder. Bu yüzden kaydetmeler "dene ve gör" döngüsünün kaba bir işaretidir.',
        'El contador sube uno cada vez que se guarda un archivo en VS Code. Los principiantes suelen guardar justo antes de ejecutar el programa, así que los guardados son una señal aproximada del ciclo de «probar y ver».',
      ),
    },
    example: {
      en: (f) => `S07 saved files ${f.featured} times in eight weeks, and the class ${f.classMean} times on average. S07 saved most often in weeks 4 and 8.`,
      tr: (f) => `S07 sekiz haftada ${f.featured} kez dosya kaydetti, sınıf ortalaması ${f.classMean} kez. S07 en sık 4. ve 8. haftalarda kaydetti.`,
      es: (f) => `S07 guardó archivos ${f.featured} veces en ocho semanas, y la clase ${f.classMean} veces de media. S07 guardó con más frecuencia en las semanas 4 y 8.`,
    },
    takeaway: T('The class saves about 21 to 23 times a week. S07 follows the same peaks as in active time.', 'Sınıf haftada yaklaşık 21 ile 23 kez kaydediyor. S07 aktif sürede olduğu gibi aynı tepeleri izliyor.', 'La clase guarda unas 21 a 23 veces por semana. S07 sigue los mismos picos que en el tiempo activo.'),
    purpose: {
      teacher: T('How often do students test their changes?', 'Öğrenciler değişikliklerini ne sıklıkla deniyor?', '¿Con qué frecuencia prueban los estudiantes sus cambios?'),
      researcher: T('How short is the edit-and-run cycle?', 'Düzenle ve çalıştır döngüsü ne kadar kısa?', '¿Cómo de corto es el ciclo de editar y ejecutar?'),
    },
    raw: {
      intro: TWO_SESSIONS,
      snippets: [{ name: 'saves', caption: CS }],
    },
    formulas: [{
      id: 'coding_sessions.save_count',
      heading: T('How it is counted', 'Nasıl sayılır', 'Cómo se cuenta'),
      text: text3(T('Each save event of a document adds 1.', 'Bir belgenin her kaydetme olayı 1 ekler.', 'Cada evento de guardado de un documento suma 1.'), FLUSH),
    }],
    research: {
      stage: ANALYSIS,
      spss: T('`saves_per_hour` = saves ÷ active hours, per student.', 'Öğrenci başına `saves_per_hour` = kaydetmeler ÷ aktif saat.', '`saves_per_hour` = guardados ÷ horas activas, por estudiante.'),
      analysis: T('Describe it, and check that auto save was off in the lab before you interpret it.', 'Betimleyin ve yorumlamadan önce laboratuvarda otomatik kaydetmenin kapalı olduğunu kontrol edin.', 'Descríbalo, y compruebe que el guardado automático estaba desactivado en el laboratorio antes de interpretarlo.'),
      sentence: T('Save events were counted as a proxy for the frequency of edit-and-test cycles.', 'Kaydetme olayları, düzenle ve dene döngülerinin sıklığı için dolaylı bir ölçü olarak sayılmıştır.', 'Los eventos de guardado se contaron como aproximación a la frecuencia de los ciclos de editar y probar.'),
    },
    limits: T(
      'With auto save turned on, VS Code saves by itself and the number loses its meaning. Some students save out of habit after every line. A save does not show that the program was run.',
      'Otomatik kaydetme açıkken VS Code kendiliğinden kaydeder ve sayı anlamını yitirir. Bazı öğrenciler alışkanlıkla her satırdan sonra kaydeder. Bir kaydetme, programın çalıştırıldığını göstermez.',
      'Con el guardado automático activado, VS Code guarda solo y el número pierde su sentido. Algunos estudiantes guardan por costumbre tras cada línea. Un guardado no muestra que se ejecutara el programa.',
    ),
    teacher: T(
      'A student who saves very rarely may run big blocks of code at once. Encourage small steps: change, save, run.',
      'Çok seyrek kaydeden bir öğrenci büyük kod bloklarını bir seferde çalıştırıyor olabilir. Küçük adımları teşvik edin: değiştir, kaydet, çalıştır.',
      'Un estudiante que guarda muy poco puede ejecutar grandes bloques de código de una vez. Anime a dar pasos pequeños: cambiar, guardar, ejecutar.',
    ),
  },

  // ------------------------------------------------------------------ debug and task runs
  {
    slug: 'debug-and-task-runs', category: 'activity',
    items: ['coding_sessions.debug_session_count', 'coding_sessions.task_run_count'],
    title: T('Debug and task runs', 'Hata ayıklama ve görev çalıştırmaları', 'Depuraciones y tareas ejecutadas'),
    what: {
      heading: T('What are debug and task runs?', 'Hata ayıklama ve görev çalıştırmaları nedir?', '¿Qué son las depuraciones y las tareas ejecutadas?'),
      text: T(
        'Two counters. The first goes up each time a debug session starts in VS Code, which also happens with "Run Without Debugging" in the Run menu. The second goes up each time a VS Code task starts. A program typed as a command into the terminal is neither.',
        'İki sayaç. İlki VS Code’da her hata ayıklama oturumu başladığında artar. Bu, Çalıştır menüsündeki "Hata Ayıklamadan Çalıştır" ile de olur. İkincisi her VS Code görevi başladığında artar. Terminale komut olarak yazılan bir program ikisi de değildir.',
        'Dos contadores. El primero sube cada vez que empieza una sesión de depuración en VS Code, lo que también ocurre con «Ejecutar sin depurar» del menú Ejecutar. El segundo sube cada vez que empieza una tarea de VS Code. Un programa escrito como orden en el terminal no es ninguna de las dos cosas.',
      ),
    },
    example: {
      en: (f) => `S07 started ${f.featuredDebug} debug runs and ${f.featuredTasks} task runs in eight weeks. Week 4 had the most debug runs. In the class, debug runs (${f.classDebug}) were far more common than task runs (${f.classTasks}).`,
      tr: (f) => `S07 sekiz haftada ${f.featuredDebug} hata ayıklama çalıştırması ve ${f.featuredTasks} görev çalıştırması başlattı. En çok hata ayıklama çalıştırması 4. haftadaydı. Sınıfta hata ayıklama çalıştırmaları (${f.classDebug}) görev çalıştırmalarından (${f.classTasks}) çok daha yaygındı.`,
      es: (f) => `S07 inició ${f.featuredDebug} depuraciones y ${f.featuredTasks} tareas en ocho semanas. La semana 4 tuvo más depuraciones. En la clase, las depuraciones (${f.classDebug}) fueron mucho más frecuentes que las tareas (${f.classTasks}).`,
    },
    takeaway: T('The chart shows debug runs. The class starts about four a week. S07 has a clear peak in week 4.', 'Grafik hata ayıklama çalıştırmalarını gösteriyor. Sınıf haftada yaklaşık dört tane başlatıyor. S07’nin 4. haftada belirgin bir tepesi var.', 'El gráfico muestra las depuraciones. La clase inicia unas cuatro por semana. S07 tiene un pico claro en la semana 4.'),
    purpose: {
      teacher: T('Do students use the debugger?', 'Öğrenciler hata ayıklayıcıyı kullanıyor mu?', '¿Usan los estudiantes el depurador?'),
      researcher: T('How often do students run their programs from VS Code, as far as the extension can see it?', 'Öğrenciler programlarını, eklentinin görebildiği kadarıyla, VS Code’dan ne sıklıkla çalıştırıyor?', '¿Con qué frecuencia ejecutan los estudiantes sus programas desde VS Code, en la medida en que la extensión lo ve?'),
    },
    raw: {
      intro: TWO_SESSIONS,
      snippets: [{ name: 'debug-and-task-runs', caption: CS }],
    },
    formulas: [
      {
        id: 'coding_sessions.debug_session_count',
        heading: T('Debug runs', 'Hata ayıklama çalıştırması', 'Depuraciones'),
        text: text3(T('Each debug session started in VS Code adds 1.', 'VS Code’da başlatılan her hata ayıklama oturumu 1 ekler.', 'Cada sesión de depuración iniciada en VS Code suma 1.'), FLUSH),
      },
      {
        id: 'coding_sessions.task_run_count',
        heading: T('Task runs', 'Görev çalıştırması', 'Tareas ejecutadas'),
        text: T('Each VS Code task started adds 1. The result of the task is recorded on the page "Running the code".', 'Başlatılan her VS Code görevi 1 ekler. Görevin sonucu "Kodu çalıştırma" sayfasında kaydedilir.', 'Cada tarea de VS Code iniciada suma 1. El resultado de la tarea se registra en la página «Ejecutar el código».'),
      },
    ],
    research: {
      stage: ANALYSIS,
      spss: T('`runs_per_hour` = (debug runs + task runs) ÷ active hours, per student.', 'Öğrenci başına `runs_per_hour` = (hata ayıklama + görev çalıştırmaları) ÷ aktif saat.', '`runs_per_hour` = (depuraciones + tareas) ÷ horas activas, por estudiante.'),
      analysis: T('Describe it next to saves. Do not use it as a full count of program runs.', 'Kaydetmelerin yanında betimleyin. Program çalıştırmalarının tam sayısı olarak kullanmayın.', 'Descríbalo junto a los guardados. No lo use como recuento completo de ejecuciones.'),
      sentence: T('Runs started from the editor (debug sessions and tasks) were counted, while runs typed into the terminal were not observable.', 'Editörden başlatılan çalıştırmalar (hata ayıklama oturumları ve görevler) sayılmış, terminale yazılan çalıştırmalar ise gözlenememiştir.', 'Se contaron las ejecuciones iniciadas desde el editor (sesiones de depuración y tareas), mientras que las escritas en el terminal no eran observables.'),
    },
    limits: T(
      'The "Run Python File" button of the Python extension runs the program in the terminal and is not counted. So the numbers depend on how each student runs code. A debug run does not mean the student used breakpoints.',
      'Python eklentisinin "Run Python File" düğmesi programı terminalde çalıştırır ve sayılmaz. Bu yüzden sayılar her öğrencinin kodu nasıl çalıştırdığına bağlıdır. Bir hata ayıklama çalıştırması öğrencinin kesme noktası kullandığı anlamına gelmez.',
      'El botón «Run Python File» de la extensión de Python ejecuta el programa en el terminal y no se cuenta. Por eso los números dependen de cómo ejecuta cada estudiante el código. Una depuración no significa que el estudiante usara puntos de interrupción.',
    ),
    teacher: T(
      'If almost nobody uses the debugger, a short demo of breakpoints in one lab can be worth the time.',
      'Neredeyse hiç kimse hata ayıklayıcıyı kullanmıyorsa, bir laboratuvarda kesme noktalarının kısa bir gösterimi zamana değer olabilir.',
      'Si casi nadie usa el depurador, una breve demostración de puntos de interrupción en un laboratorio puede merecer la pena.',
    ),
  },

  // ------------------------------------------------------------------ breaks
  {
    slug: 'breaks', category: 'activity',
    items: ['coding_sessions.idle_gap_count', 'metric.breaks_avg'],
    title: T('Breaks', 'Molalar', 'Pausas'),
    what: {
      heading: T('What is a break?', 'Mola nedir?', '¿Qué es una pausa?'),
      text: T(
        'A break is a pause of more than two minutes without any activity in VS Code. It is the same rule that decides what counts as active coding time.',
        'Mola, VS Code’da hiçbir etkinlik olmadan geçen iki dakikadan uzun bir duraklamadır. Aktif kodlama süresinde neyin sayılacağına karar veren kuralın aynısıdır.',
        'Una pausa es un periodo de más de dos minutos sin ninguna actividad en VS Code. Es la misma regla que decide qué cuenta como tiempo activo.',
      ),
    },
    example: {
      en: (f) => `S07 had ${dec(f.featuredAvg, 'en')} breaks per session on average, the class ${dec(f.classAvg, 'en')}. A break can be a talk with the teacher, a look at the task sheet or a longer time spent reading an explanation.`,
      tr: (f) => `S07’nin oturum başına ortalama ${dec(f.featuredAvg, 'tr')} molası oldu, sınıfın ${dec(f.classAvg, 'tr')}. Mola öğretmenle bir konuşma, görev kâğıdına bir bakış ya da bir açıklamayı okumaya ayrılan daha uzun bir süre olabilir.`,
      es: (f) => `S07 tuvo ${dec(f.featuredAvg, 'es')} pausas por sesión de media, y la clase ${dec(f.classAvg, 'es')}. Una pausa puede ser una conversación con el profesorado, una mirada al enunciado o un rato largo leyendo una explicación.`,
    },
    takeaway: {
      en: (f) => `Most of the ${f.sessions} sessions have between zero and three breaks. The group with two breaks per session is the largest.`,
      tr: (f) => `${f.sessions} oturumun çoğunda sıfır ile üç arasında mola var. Oturum başına iki molalı grup en büyüğü.`,
      es: (f) => `La mayoría de las ${f.sessions} sesiones tienen entre cero y tres pausas. El grupo con dos pausas por sesión es el más grande.`,
    },
    purpose: {
      teacher: T('Do students get stuck and stop for long periods?', 'Öğrenciler takılıp uzun süre duruyor mu?', '¿Se atascan los estudiantes y se detienen durante mucho tiempo?'),
      researcher: T('How continuous is the work within a session?', 'Bir oturum içinde çalışma ne kadar kesintisiz?', '¿Cómo de continuo es el trabajo dentro de una sesión?'),
    },
    raw: {
      intro: TWO_SESSIONS,
      snippets: [{ name: 'breaks', caption: CS }],
    },
    formulas: [
      {
        id: 'coding_sessions.idle_gap_count',
        heading: T('How breaks are counted', 'Molalar nasıl sayılır', 'Cómo se cuentan las pausas'),
        text: T('Adds 1 when the gap between two heartbeats (edit, cursor move, change of file or save) is longer than two minutes.', 'İki kalp atışı (düzenleme, imleç hareketi, dosya değişikliği ya da kaydetme) arasındaki aralık iki dakikadan uzunsa 1 ekler.', 'Suma 1 cuando el intervalo entre dos latidos (edición, movimiento del cursor, cambio de archivo o guardado) supera los dos minutos.'),
      },
      {
        id: 'metric.breaks_avg',
        heading: T('Breaks per session (average, dashboard)', 'Oturum başına mola (ortalama, panel)', 'Pausas por sesión (media, panel)'),
        text: T('Mean number of breaks over the sessions of the period.', 'Dönemin oturumları üzerinden ortalama mola sayısı.', 'Número medio de pausas en las sesiones del periodo.'),
      },
    ],
    research: {
      stage: ANALYSIS,
      spss: T('`breaks_per_hour` = breaks ÷ active hours, per student.', 'Öğrenci başına `breaks_per_hour` = molalar ÷ aktif saat.', '`breaks_per_hour` = pausas ÷ horas activas, por estudiante.'),
      analysis: T('Describe it, and relate it to the number of "Still stuck" answers (Spearman).', 'Betimleyin ve "Hâlâ takıldım" yanıtlarının sayısıyla ilişkilendirin (Spearman).', 'Descríbalo y relaciónelo con el número de respuestas «Sigo atascado/a» (Spearman).'),
      sentence: T('Pauses of more than two minutes without editor activity were counted as breaks.', 'Editör etkinliği olmadan geçen iki dakikadan uzun duraklamalar mola olarak sayılmıştır.', 'Las pausas de más de dos minutos sin actividad en el editor se contaron como pausas.'),
    },
    limits: T(
      'A break does not mean the student stopped thinking about the task: reading, planning on paper and listening to the teacher all look the same. Time away from VS Code is not a heartbeat, so a visit to the browser can also end as a break.',
      'Mola, öğrencinin görevi düşünmeyi bıraktığı anlamına gelmez: okuma, kâğıt üzerinde plan yapma ve öğretmeni dinleme aynı görünür. VS Code dışında geçen süre bir kalp atışı değildir, bu yüzden tarayıcıya bir ziyaret de mola olarak bitebilir.',
      'Una pausa no significa que el estudiante dejara de pensar en la tarea: leer, planificar en papel y escuchar al profesorado se ven igual. El tiempo fuera de VS Code no es un latido, así que una visita al navegador también puede acabar como pausa.',
    ),
    teacher: T(
      'Many breaks in one lab can show a task that needs more explanation at the start. Compare the breaks of the class across labs.',
      'Bir laboratuvardaki çok sayıda mola, başta daha fazla açıklama gerektiren bir görevi gösterebilir. Sınıfın molalarını laboratuvarlar arasında karşılaştırın.',
      'Muchas pausas en un laboratorio pueden indicar una tarea que necesita más explicación al principio. Compare las pausas de la clase entre laboratorios.',
    ),
  },

  // ------------------------------------------------------------------ file switches
  {
    slug: 'file-switches', category: 'activity',
    items: ['coding_sessions.editor_switch_count', 'coding_sessions.files_visited'],
    title: T('Switched between files', 'Dosyalar arası geçiş', 'Cambios entre archivos'),
    what: {
      heading: T('What are file switches?', 'Dosyalar arası geçiş nedir?', '¿Qué son los cambios entre archivos?'),
      text: T(
        'The first counter goes up each time the active editor changes to a different file. The second number is how many different files became active in the session. File names are not stored here.',
        'İlk sayaç, etkin editör her farklı bir dosyaya geçtiğinde artar. İkinci sayı, oturumda kaç farklı dosyanın etkin olduğudur. Dosya adları burada saklanmaz.',
        'El primer contador sube cada vez que el editor activo cambia a otro archivo. El segundo número es cuántos archivos distintos estuvieron activos en la sesión. Aquí no se guardan los nombres de archivo.',
      ),
    },
    example: {
      en: (f) => `S07 switched between files ${f.featuredSwitches} times in eight weeks, the same as the class mean (${f.classMeanSwitches}). Added over all sessions, S07 opened ${f.featuredFiles} files.`,
      tr: (f) => `S07 sekiz haftada ${f.featuredSwitches} kez dosyalar arasında geçiş yaptı. Bu, sınıf ortalamasıyla (${f.classMeanSwitches}) aynı. Tüm oturumlar toplandığında S07 ${f.featuredFiles} dosya açtı.`,
      es: (f) => `S07 cambió de archivo ${f.featuredSwitches} veces en ocho semanas, igual que la media de la clase (${f.classMeanSwitches}). Sumando todas las sesiones, S07 abrió ${f.featuredFiles} archivos.`,
    },
    takeaway: T('The class switches files about 13 to 17 times a week. S07 moves around the class mean from week to week.', 'Sınıf haftada yaklaşık 13 ile 17 kez dosya değiştiriyor. S07 haftadan haftaya sınıf ortalamasının çevresinde dolaşıyor.', 'La clase cambia de archivo unas 13 a 17 veces por semana. S07 se mueve alrededor de la media de la clase de una semana a otra.'),
    purpose: {
      teacher: T('Do students look at other files, such as an earlier solution, while they work?', 'Öğrenciler çalışırken önceki bir çözüm gibi başka dosyalara bakıyor mu?', '¿Miran los estudiantes otros archivos, como una solución anterior, mientras trabajan?'),
      researcher: T('How much do students navigate between files, as a sign of reuse of their own code?', 'Öğrenciler, kendi kodlarını yeniden kullanmanın bir işareti olarak, dosyalar arasında ne kadar geziniyor?', '¿Cuánto navegan los estudiantes entre archivos, como señal de reutilización de su propio código?'),
    },
    raw: {
      intro: TWO_SESSIONS,
      snippets: [{ name: 'file-switches', caption: CS }],
    },
    formulas: [
      {
        id: 'coding_sessions.editor_switch_count',
        heading: T('Switched between files', 'Dosyalar arası geçiş', 'Cambios entre archivos'),
        text: text3(T('Adds 1 when the active editor changes to a different file on disk.', 'Etkin editör diskteki farklı bir dosyaya geçtiğinde 1 ekler.', 'Suma 1 cuando el editor activo cambia a otro archivo en disco.'), FLUSH),
      },
      {
        id: 'coding_sessions.files_visited',
        heading: T('Files opened', 'Açılan dosya', 'Archivos abiertos'),
        text: T('Number of different files that became the active editor in the VS Code window. It is set, not added, at each update.', 'VS Code penceresinde etkin editör olan farklı dosyaların sayısı. Her güncellemede eklenmez, yeniden atanır.', 'Número de archivos distintos que fueron el editor activo en la ventana de VS Code. Se asigna, no se suma, en cada actualización.'),
      },
    ],
    research: {
      stage: ANALYSIS,
      spss: T('`switches_per_hour` = switches ÷ active hours, per student.', 'Öğrenci başına `switches_per_hour` = geçişler ÷ aktif saat.', '`switches_per_hour` = cambios ÷ horas activas, por estudiante.'),
      analysis: T('Describe it. It can be one variable in a cluster analysis of work styles.', 'Betimleyin. Çalışma biçimlerinin kümeleme analizinde değişkenlerden biri olabilir.', 'Descríbalo. Puede ser una de las variables de un análisis de conglomerados de estilos de trabajo.'),
      sentence: T('Navigation was described by the number of switches between files in the editor.', 'Gezinme, editördeki dosyalar arası geçiş sayısıyla betimlenmiştir.', 'La navegación se describió con el número de cambios entre archivos en el editor.'),
    },
    limits: T(
      'Files opened in two sessions are counted twice when sessions are added. Switching to a settings page or an output panel does not count. The counter cannot tell why the student opened a file.',
      'İki oturumda açılan dosyalar, oturumlar toplandığında iki kez sayılır. Bir ayarlar sayfasına ya da çıktı paneline geçmek sayılmaz. Sayaç öğrencinin bir dosyayı neden açtığını söyleyemez.',
      'Los archivos abiertos en dos sesiones se cuentan dos veces al sumar las sesiones. Cambiar a una página de ajustes o a un panel de salida no cuenta. El contador no puede decir por qué el estudiante abrió un archivo.',
    ),
    teacher: T(
      'Looking at earlier solutions is a good habit. You can encourage it by keeping all tasks of a lab in one folder.',
      'Önceki çözümlere bakmak iyi bir alışkanlıktır. Bir laboratuvarın tüm görevlerini tek bir klasörde tutarak bunu teşvik edebilirsiniz.',
      'Consultar soluciones anteriores es un buen hábito. Puede fomentarlo guardando todas las tareas de un laboratorio en una carpeta.',
    ),
  },

  // ------------------------------------------------------------------ AI learning summary
  {
    slug: 'ai-learning-summary', category: 'learner',
    items: ['learner_profiles.student_summary'],
    title: T('AI learning summary', 'Yapay zekâ öğrenme özeti', 'Resumen de aprendizaje de IA'),
    what: {
      heading: T('What is the AI learning summary?', 'Yapay zekâ öğrenme özeti nedir?', '¿Qué es el resumen de aprendizaje de IA?'),
      text: T(
        'The AI learning summary is a short text of three to five sentences that the AI model writes for the student. It is based on the last 30 questions. It is written in the feedback language and shown in the sidebar and in the dashboard.',
        'Yapay zekâ öğrenme özeti, yapay zekâ modelinin öğrenci için yazdığı üç ile beş cümlelik kısa bir metindir. Son 30 soruya dayanır. Geri bildirim dilinde yazılır ve kenar çubuğunda ve panelde gösterilir.',
        'El resumen de aprendizaje de IA es un texto breve de tres a cinco frases que el modelo de IA escribe para el estudiante. Se basa en las 30 últimas preguntas. Se escribe en el idioma de las explicaciones y se muestra en la barra lateral y en el panel.',
      ),
    },
    example: {
      en: (f) => `The last summary of S07 was written on ${f.writtenDay} in English. The text is shown in the next section. In the sample, ${f.withSummary} of 25 students had a summary at the end of the course.`,
      tr: (f) => `S07’nin son özeti ${f.writtenDay} tarihinde İngilizce yazıldı. Metin bir sonraki bölümde gösteriliyor. Örnekte 25 öğrencinin ${f.withSummary} tanesinin dersin sonunda bir özeti vardı.`,
      es: (f) => `El último resumen de S07 se escribió el ${f.writtenDay} en inglés. El texto aparece en la sección siguiente. En la muestra, ${f.withSummary} de 25 estudiantes tenían un resumen al final del curso.`,
    },
    takeaway: T('The summary speaks to the student and ends with one thing worth going back over. The sample text is a synthetic example in English.', 'Özet doğrudan öğrenciye hitap ediyor ve tekrar edilmeye değer tek bir konuyla bitiyor. Örnek metin İngilizce sentetik bir örnektir.', 'El resumen se dirige al estudiante y termina con un tema que merece repasar. El texto de muestra es un ejemplo sintético en inglés.'),
    purpose: {
      teacher: T('What does the tool tell each student about their own work?', 'Araç her öğrenciye kendi çalışması hakkında ne söylüyor?', '¿Qué le dice la herramienta a cada estudiante sobre su propio trabajo?'),
      researcher: T('What reflective feedback did students receive, beside the hints?', 'Öğrenciler ipuçlarının yanında hangi yansıtıcı geri bildirimi aldı?', '¿Qué retroalimentación reflexiva recibieron los estudiantes, además de las pistas?'),
    },
    raw: {
      intro: T('The summary of S07 at the end of the sample.', 'Örneğin sonunda S07’nin özeti.', 'El resumen de S07 al final de la muestra.'),
      snippets: [{ name: 'ai-learning-summary', caption: LP }],
    },
    formulas: [{
      id: 'learner_profiles.student_summary',
      heading: T('How it is written', 'Nasıl yazılır', 'Cómo se escribe'),
      text: T(
        'The model gets the last 30 questions with their titles and outcomes and a few counts about the student. It must write three to five sentences to the student, at most 700 characters. It must describe what happened, never judge the student\'s ability, and it may end with one sentence that starts with "Worth going back over:". It is rewritten together with the private notes.',
        'Model son 30 soruyu başlıkları ve sonuçlarıyla birlikte ve öğrenci hakkında birkaç sayı alır. Öğrenciye üç ile beş cümle, en fazla 700 karakter yazmalıdır. Ne olduğunu betimlemeli, öğrencinin yeteneğini asla değerlendirmemelidir. "Tekrar göz atmakta fayda var:" ile başlayan bir cümleyle bitebilir. Gizli notlarla birlikte yeniden yazılır.',
        'El modelo recibe las 30 últimas preguntas con sus títulos y resultados y algunos recuentos sobre el estudiante. Debe escribir al estudiante de tres a cinco frases, como máximo 700 caracteres. Debe describir lo que ocurrió, nunca juzgar la capacidad del estudiante, y puede terminar con una frase que empiece por «Vale la pena repasar:». Se reescribe junto con las notas privadas.',
      ),
    }],
    research: {
      stage: T('after the intervention (qualitative)', 'müdahaleden sonra (nitel)', 'después de la intervención (cualitativo)'),
      spss: T('None. It is text. Code it first if you need a variable, for example the topic named in the last sentence.', 'Yok. Bu bir metindir. Bir değişkene ihtiyacınız varsa önce kodlayın, örneğin son cümlede adı geçen konu.', 'Ninguno. Es texto. Codifíquelo primero si necesita una variable, por ejemplo el tema nombrado en la última frase.'),
      analysis: T('Qualitative content analysis of the final summaries: which topics does the model name, and do they match the pre-test and post-test items the student got wrong?', 'Son özetlerin nitel içerik analizi: model hangi konuları adlandırıyor ve bunlar öğrencinin ön test ve son testte yanlış yaptığı maddelerle örtüşüyor mu?', 'Análisis cualitativo de contenido de los resúmenes finales: ¿qué temas nombra el modelo y coinciden con los ítems del pretest y del postest que el estudiante falló?'),
      sentence: T('The AI-generated learning summaries shown to students were analysed qualitatively for the topics they recommended for review.', 'Öğrencilere gösterilen yapay zekâ tarafından üretilmiş öğrenme özetleri, tekrar için önerdikleri konular açısından nitel olarak analiz edilmiştir.', 'Los resúmenes de aprendizaje generados por IA que se mostraron a los estudiantes se analizaron cualitativamente según los temas que recomendaban repasar.'),
    },
    limits: T(
      'The text is written by an AI model and can be wrong. Only the last version is stored, so earlier summaries are lost. The summary says what the model saw in the questions, not what the student learned.',
      'Metin bir yapay zekâ modeli tarafından yazılır ve yanlış olabilir. Yalnızca son sürüm saklanır, bu yüzden önceki özetler kaybolur. Özet, öğrencinin ne öğrendiğini değil, modelin sorularda ne gördüğünü söyler.',
      'El texto lo escribe un modelo de IA y puede ser erróneo. Solo se guarda la última versión, así que los resúmenes anteriores se pierden. El resumen dice lo que el modelo vio en las preguntas, no lo que aprendió el estudiante.',
    ),
    teacher: T(
      'Read the summaries of a few students before a one-to-one talk. Check the claims against the questions in the dashboard before you repeat them.',
      'Birebir bir görüşmeden önce birkaç öğrencinin özetini okuyun. İddiaları tekrarlamadan önce paneldeki sorularla karşılaştırın.',
      'Lea los resúmenes de algunos estudiantes antes de una tutoría. Contraste lo que dicen con las preguntas del panel antes de repetirlo.',
    ),
  },

  // ------------------------------------------------------------------ suggested practice
  {
    slug: 'suggested-practice', category: 'learner',
    items: ['learner_profiles.suggested_practice'],
    title: T('Suggested practice', 'Önerilen alıştırma', 'Práctica sugerida'),
    what: {
      heading: T('What is the suggested practice?', 'Önerilen alıştırma nedir?', '¿Qué es la práctica sugerida?'),
      text: T(
        'The suggested practice is a short exercise of two or three sentences. The model writes it together with the AI learning summary, on the error or topic that repeats most in the student\'s questions.',
        'Önerilen alıştırma, iki ya da üç cümlelik kısa bir alıştırmadır. Model bunu yapay zekâ öğrenme özetiyle birlikte, öğrencinin sorularında en çok tekrarlanan hata ya da konu üzerine yazar.',
        'La práctica sugerida es un ejercicio breve de dos o tres frases. El modelo la escribe junto con el resumen de aprendizaje de IA, sobre el error o el tema que más se repite en las preguntas del estudiante.',
      ),
    },
    example: {
      en: (f) => `The practice for S07 was written on ${f.writtenDay} and is about lists, one of the two topics S07 asked about most often. The text is shown in the next section.`,
      tr: (f) => `S07 için alıştırma ${f.writtenDay} tarihinde yazıldı ve S07’nin en sık sorduğu iki konudan biri olan listeler hakkında. Metin bir sonraki bölümde gösteriliyor.`,
      es: (f) => `La práctica de S07 se escribió el ${f.writtenDay} y trata sobre listas, uno de los dos temas por los que S07 preguntó más. El texto aparece en la sección siguiente.`,
    },
    takeaway: T('The practice is short and names one topic. It ends with a small prediction task.', 'Alıştırma kısa ve tek bir konuyu adlandırıyor. Küçük bir tahmin göreviyle bitiyor.', 'La práctica es breve y nombra un solo tema. Termina con una pequeña tarea de predicción.'),
    purpose: {
      teacher: T('What extra practice does the tool suggest to each student?', 'Araç her öğrenciye hangi ek alıştırmayı öneriyor?', '¿Qué práctica adicional sugiere la herramienta a cada estudiante?'),
      researcher: T('Does the suggested topic match the student\'s weak points in the tests?', 'Önerilen konu, öğrencinin testlerdeki zayıf noktalarıyla örtüşüyor mu?', '¿Coincide el tema sugerido con los puntos débiles del estudiante en los tests?'),
    },
    raw: {
      intro: T('The practice of S07 at the end of the sample.', 'Örneğin sonunda S07’nin alıştırması.', 'La práctica de S07 al final de la muestra.'),
      snippets: [{ name: 'suggested-practice', caption: LP }],
    },
    formulas: [{
      id: 'learner_profiles.suggested_practice',
      heading: T('How it is written', 'Nasıl yazılır', 'Cómo se escribe'),
      text: T(
        'One short practice problem of two or three sentences, at most 400 characters, on the error or topic that repeats most. When nothing repeats, the model uses the latest question.',
        'En çok tekrarlanan hata ya da konu üzerine iki ya da üç cümlelik, en fazla 400 karakterlik kısa bir alıştırma. Hiçbir şey tekrarlanmıyorsa model en son soruyu kullanır.',
        'Un problema breve de práctica de dos o tres frases, como máximo 400 caracteres, sobre el error o el tema que más se repite. Si nada se repite, el modelo usa la última pregunta.',
      ),
    }],
    research: {
      stage: T('after the intervention (qualitative)', 'müdahaleden sonra (nitel)', 'después de la intervención (cualitativo)'),
      spss: T('None. It is text. Code the topic if you need a variable.', 'Yok. Bu bir metindir. Bir değişkene ihtiyacınız varsa konuyu kodlayın.', 'Ninguno. Es texto. Codifique el tema si necesita una variable.'),
      analysis: T('Code the topic of each final practice and compare it with the test items the student got wrong.', 'Her son alıştırmanın konusunu kodlayın ve öğrencinin yanlış yaptığı test maddeleriyle karşılaştırın.', 'Codifique el tema de cada práctica final y compárelo con los ítems del test que el estudiante falló.'),
      sentence: T('The topics of the AI-suggested practice tasks were coded and compared with the students\' post-test errors.', 'Yapay zekânın önerdiği alıştırma görevlerinin konuları kodlanmış ve öğrencilerin son test hatalarıyla karşılaştırılmıştır.', 'Los temas de las prácticas sugeridas por la IA se codificaron y se compararon con los errores de los estudiantes en el postest.'),
    },
    limits: T(
      'The extension does not record whether the student did the practice. Only the last version is stored. The text is written by an AI model and can be too easy, too hard or off topic.',
      'Eklenti öğrencinin alıştırmayı yapıp yapmadığını kaydetmez. Yalnızca son sürüm saklanır. Metin bir yapay zekâ modeli tarafından yazılır ve çok kolay, çok zor ya da konu dışı olabilir.',
      'La extensión no registra si el estudiante hizo la práctica. Solo se guarda la última versión. El texto lo escribe un modelo de IA y puede ser demasiado fácil, demasiado difícil o no venir al caso.',
    ),
    teacher: T(
      'You can use the suggested practices of the class as a source of short warm-up tasks for the next lab.',
      'Sınıfın önerilen alıştırmalarını bir sonraki laboratuvar için kısa ısınma görevlerinin kaynağı olarak kullanabilirsiniz.',
      'Puede usar las prácticas sugeridas de la clase como fuente de tareas breves de calentamiento para el siguiente laboratorio.',
    ),
  },

  // ------------------------------------------------------------------ private notes
  {
    slug: 'private-notes', category: 'learner',
    items: ['learner_profiles.summary', 'learner_profiles.summary_generated_at', 'learner_profiles.interactions_since_update', 'metric.ext_summary_progress', 'metric.summary_cadence'],
    title: T('Private learner notes', 'Gizli öğrenci notları', 'Notas privadas del estudiante'),
    what: {
      heading: T('What are the private learner notes?', 'Gizli öğrenci notları nedir?', '¿Qué son las notas privadas del estudiante?'),
      text: T(
        'The private learner notes are a short English text about the student that the model writes for itself. They are sent with every later request for an explanation, so the model can adapt its hints. The sidebar and the dashboard do not show them.',
        'Gizli öğrenci notları, modelin kendisi için öğrenci hakkında yazdığı kısa bir İngilizce metindir. Model ipuçlarını uyarlayabilsin diye sonraki her açıklama isteğiyle birlikte gönderilir. Kenar çubuğu ve panel bunları göstermez.',
        'Las notas privadas del estudiante son un texto breve en inglés sobre el estudiante que el modelo escribe para sí mismo. Se envían con cada petición de explicación posterior para que el modelo adapte sus pistas. La barra lateral y el panel no las muestran.',
      ),
    },
    example: {
      en: (f) => `The notes of S07 were rewritten ${f.rewrites} times in eight weeks, together with the AI learning summary. S07 asked ${f.featuredQuestions} questions, and ${f.cacheHits} answers came from the cache and did not count toward the next rewrite. At the end, ${f.current} new question was waiting for the next rewrite. The database keeps only the last version. The list of rewrites in the next section comes from the sample generator and shows how the rule works.`,
      tr: (f) => `S07’nin notları sekiz haftada yapay zekâ öğrenme özetiyle birlikte ${f.rewrites} kez yeniden yazıldı. S07 ${f.featuredQuestions} soru sordu ve ${f.cacheHits} yanıt önbellekten geldi. Bu yanıtlar bir sonraki yeniden yazım için sayılmadı. Sonunda ${f.current} yeni soru bir sonraki yeniden yazımı bekliyordu. Veritabanı yalnızca son sürümü tutar. Bir sonraki bölümdeki yeniden yazım listesi örnek veri üretecinden gelir ve kuralın nasıl işlediğini gösterir.`,
      es: (f) => `Las notas de S07 se reescribieron ${f.rewrites} veces en ocho semanas, junto con el resumen de aprendizaje de IA. S07 hizo ${f.featuredQuestions} preguntas, y ${f.cacheHits} respuestas salieron de la caché y no contaron para la siguiente reescritura. Al final, ${f.current} pregunta nueva esperaba la siguiente reescritura. La base de datos solo guarda la última versión. La lista de reescrituras de la sección siguiente procede del generador de la muestra y muestra cómo funciona la regla.`,
    },
    takeaway: T('The notes of S07 were rewritten about once a week, each time after three to six new questions.', 'S07’nin notları yaklaşık haftada bir, her seferinde üç ile altı yeni sorudan sonra yeniden yazıldı.', 'Las notas de S07 se reescribieron aproximadamente una vez por semana, cada vez tras tres a seis preguntas nuevas.'),
    purpose: {
      teacher: T('What does the model "remember" about a student?', 'Model bir öğrenci hakkında neyi "hatırlıyor"?', '¿Qué «recuerda» el modelo sobre un estudiante?'),
      researcher: T('How is the feedback personalised, and how often does the personalisation change?', 'Geri bildirim nasıl kişiselleştiriliyor ve kişiselleştirme ne sıklıkla değişiyor?', '¿Cómo se personaliza la retroalimentación y con qué frecuencia cambia la personalización?'),
    },
    raw: {
      intro: T('The notes of S07 at the end of the sample.', 'Örneğin sonunda S07’nin notları.', 'Las notas de S07 al final de la muestra.'),
      snippets: [{ name: 'private-notes', caption: LP }],
    },
    formulas: [
      {
        id: 'learner_profiles.summary',
        heading: T('How the notes are written', 'Notlar nasıl yazılır', 'Cómo se escriben las notas'),
        text: T('Two to four short sentences in English, in the third person, for the model only. The model writes them in the same call as the AI learning summary.', 'İngilizce, üçüncü tekil şahısla, yalnızca model için iki ile dört kısa cümle. Model bunları yapay zekâ öğrenme özetiyle aynı çağrıda yazar.', 'De dos a cuatro frases breves en inglés, en tercera persona, solo para el modelo. El modelo las escribe en la misma llamada que el resumen de aprendizaje de IA.'),
      },
      {
        id: 'metric.summary_cadence',
        heading: T('When the notes are rewritten', 'Notlar ne zaman yeniden yazılır', 'Cuándo se reescriben las notas'),
        text: T('A new version is written when 24 hours have passed since the last one and there are at least 3 new questions. After a change of the feedback language it is written at once. The model sees the last 30 questions with their titles and outcomes.', '24 saat geçtiğinde ve en az 3 yeni soru olduğunda yeni bir sürüm yazılır. Geri bildirim dili değiştirildikten sonra hemen yazılır. Model son 30 soruyu başlıkları ve sonuçlarıyla görür.', 'Se escribe una versión nueva cuando han pasado 24 horas desde la anterior y hay al menos 3 preguntas nuevas. Tras un cambio del idioma de las explicaciones se escribe enseguida. El modelo ve las 30 últimas preguntas con sus títulos y resultados.'),
      },
      {
        id: 'learner_profiles.interactions_since_update',
        heading: T('New questions since the summary', 'Özetten sonraki yeni sorular', 'Preguntas nuevas desde el resumen'),
        text: T('Goes up by 1 for each answer that did not come from the cache, and goes back to 0 when the notes are rewritten.', 'Önbellekten gelmeyen her yanıt için 1 artar ve notlar yeniden yazıldığında 0’a döner.', 'Sube 1 por cada respuesta que no salió de la caché, y vuelve a 0 cuando se reescriben las notas.'),
      },
      {
        id: 'metric.ext_summary_progress',
        heading: T('Summary progress bar', 'Özet ilerleme çubuğu', 'Barra de progreso del resumen'),
        text: T('The sidebar shows the smaller of two shares: hours since the last summary ÷ 24 and new questions ÷ 3, with 1 as the maximum. At 1 the extension asks for a new summary.', 'Kenar çubuğu iki paydan küçük olanı gösterir: son özetten bu yana geçen saat ÷ 24 ve yeni sorular ÷ 3, en fazla 1. Değer 1 olduğunda eklenti yeni bir özet ister.', 'La barra lateral muestra la menor de dos proporciones: horas desde el último resumen ÷ 24 y preguntas nuevas ÷ 3, con 1 como máximo. Al llegar a 1, la extensión pide un resumen nuevo.'),
      },
    ],
    research: {
      stage: T('in the analysis (to describe the personalisation)', 'analizde (kişiselleştirmeyi betimlemek için)', 'en el análisis (para describir la personalización)'),
      spss: T('None. Only the last text and its time are stored, so the number of rewrites cannot be counted afterwards.', 'Yok. Yalnızca son metin ve zamanı saklanır, bu yüzden yeniden yazım sayısı sonradan sayılamaz.', 'Ninguno. Solo se guardan el último texto y su hora, así que el número de reescrituras no puede contarse después.'),
      analysis: T('Describe the rule in the Method section. Read a sample of final notes to check that they contain no personal data.', 'Kuralı Yöntem bölümünde betimleyin. Kişisel veri içermediklerini kontrol etmek için son notlardan bir örneklem okuyun.', 'Describa la regla en la sección de Método. Lea una muestra de notas finales para comprobar que no contienen datos personales.'),
      sentence: T('Feedback was personalised with a short learner profile that the model rewrote at most once a day from the student\'s recent questions.', 'Geri bildirim, modelin öğrencinin son sorularından günde en fazla bir kez yeniden yazdığı kısa bir öğrenci profiliyle kişiselleştirilmiştir.', 'La retroalimentación se personalizó con un perfil breve del estudiante que el modelo reescribía como mucho una vez al día a partir de sus preguntas recientes.'),
    },
    limits: T(
      'Only the last version is stored, so the history of the notes is lost. Answers from the cache do not count toward the next rewrite. The notes are the model\'s view of the student and can be wrong.',
      'Yalnızca son sürüm saklanır, bu yüzden notların geçmişi kaybolur. Önbellekten gelen yanıtlar bir sonraki yeniden yazım için sayılmaz. Notlar modelin öğrenciye bakışıdır ve yanlış olabilir.',
      'Solo se guarda la última versión, así que se pierde el historial de las notas. Las respuestas de la caché no cuentan para la siguiente reescritura. Las notas son la visión del modelo sobre el estudiante y pueden ser erróneas.',
    ),
    teacher: T(
      'Students may ask why the hints change over time. You can explain that the tool keeps short notes on their recent questions to adapt the hints.',
      'Öğrenciler ipuçlarının zamanla neden değiştiğini sorabilir. Aracın ipuçlarını uyarlamak için son soruları hakkında kısa notlar tuttuğunu açıklayabilirsiniz.',
      'Los estudiantes pueden preguntar por qué cambian las pistas con el tiempo. Puede explicarles que la herramienta guarda notas breves sobre sus preguntas recientes para adaptar las pistas.',
    ),
  },
];
