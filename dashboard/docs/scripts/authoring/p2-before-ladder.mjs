import { dec, pc } from './gen.mjs';

const T = (en, tr, es) => ({ en, tr, es });
const code = (s) => `\`${s}\``;
const some = T('(some columns)', '(bazı sütunlar)', '(algunas columnas)');
const tbl = (name, part = true) => ({ en: `${code(name)}${part ? ` ${some.en}` : ''}`, tr: `${code(name)}${part ? ` ${some.tr}` : ''}`, es: `${code(name)}${part ? ` ${some.es}` : ''}` });
const DURING = T('during the intervention and in the analysis', 'müdahale sırasında ve analizde', 'durante la intervención y en el análisis');
const ANALYSIS = T('in the analysis', 'analizde', 'en el análisis');

export default [
  // ------------------------------------------------------------------ help offers
  {
    slug: 'help-offers', category: 'before',
    items: ['coding_sessions.diagnostics_offered'],
    title: T('Help offers', 'Yardım teklifi', 'Ofertas de ayuda'),
    what: {
      heading: T('What is a help offer?', 'Yardım teklifi nedir?', '¿Qué es una oferta de ayuda?'),
      text: T(
        'A help offer is an error or warning next to which the extension showed "What does this mean?". The counter grows by one the first time the offer icon appears for a diagnostic in the open editor. It is the base for the question "how often did the student ask when help was offered?".',
        'Yardım teklifi, eklentinin yanında "Bu ne anlama geliyor?" gösterdiği bir hata ya da uyarıdır. Sayaç, açık editörde bir tanılama için teklif simgesi ilk kez göründüğünde bir artar. "Öğrenci yardım teklif edildiğinde ne sıklıkla sordu?" sorusunun paydası budur.',
        'Una oferta de ayuda es un error o una advertencia junto al que la extensión mostró «¿Qué significa esto?». El contador sube en uno la primera vez que aparece el icono de la oferta para un diagnóstico en el editor abierto. Es la base de la pregunta «¿con qué frecuencia preguntó el estudiante cuando se le ofreció ayuda?».',
      ),
    },
    example: {
      en: (f) => `The extension offered help ${f.featuredWeek1} times to S07 in week 1 and ${f.featuredWeek8} times in week 8. Over the eight weeks S07 saw ${f.featuredTotal} offers. More offers do not mean more questions: in week 8 S07 asked about only one of them.`,
      tr: (f) => `Eklenti birinci haftada S07’ye ${f.featuredWeek1}, sekizinci haftada ${f.featuredWeek8} kez yardım teklif etti. Sekiz haftada S07 toplam ${f.featuredTotal} teklif gördü. Daha fazla teklif daha fazla soru demek değildir: sekizinci haftada S07 bunlardan yalnızca birini sordu.`,
      es: (f) => `La extensión ofreció ayuda a S07 ${f.featuredWeek1} veces en la semana 1 y ${f.featuredWeek8} en la semana 8. En las ocho semanas, S07 vio ${f.featuredTotal} ofertas. Más ofertas no significan más preguntas: en la semana 8, S07 solo preguntó por una de ellas.`,
    },
    takeaway: T('The number of offers follows the errors a student meets, so it rises and falls with the difficulty of the week.', 'Teklif sayısı öğrencinin karşılaştığı hataları izler. Bu yüzden haftanın zorluğuyla birlikte artar ve azalır.', 'El número de ofertas sigue a los errores que encuentra el estudiante, así que sube y baja con la dificultad de la semana.'),
    purpose: {
      teacher: T('How many errors did my students meet while they worked?', 'Öğrencilerim çalışırken kaç hatayla karşılaştı?', '¿Con cuántos errores se encontraron mis estudiantes mientras trabajaban?'),
      researcher: T('What is the base for the share of errors on which students asked for help?', 'Öğrencilerin yardım istediği hataların payı için payda nedir?', '¿Cuál es la base para la proporción de errores en los que los estudiantes pidieron ayuda?'),
    },
    raw: {
      intro: T('Two sessions of S07. The counter is merged into the session every three minutes.', 'S07’nin iki oturumu. Sayaç her üç dakikada bir oturuma eklenir.', 'Dos sesiones de S07. El contador se suma a la sesión cada tres minutos.'),
      snippets: [{ name: 'help-offers', caption: tbl('coding_sessions') }],
    },
    formulas: [{
      id: 'coding_sessions.diagnostics_offered',
      heading: T('How an offer is counted', 'Bir teklif nasıl sayılır', 'Cómo se cuenta una oferta'),
      text: T('+1 the first time the offer icon is drawn next to an error or warning in the active editor, for at most three diagnostics per file. When the diagnostic goes away and comes back, it counts again.', 'Etkin editörde bir hata ya da uyarının yanında teklif simgesi ilk kez çizildiğinde +1, dosya başına en fazla üç tanılama için. Tanılama kaybolup geri gelirse yeniden sayılır.', '+1 la primera vez que se dibuja el icono de la oferta junto a un error o una advertencia en el editor activo, como máximo para tres diagnósticos por archivo. Si el diagnóstico desaparece y vuelve, cuenta de nuevo.'),
    }],
    research: {
      stage: DURING,
      spss: T('`help_offers_total` per student, and per week or per block of weeks when you study change.', 'Öğrenci başına `help_offers_total`, değişimi inceliyorsanız hafta ya da hafta bloğu başına da.', '`help_offers_total` por estudiante, y por semana o bloque de semanas si estudia el cambio.'),
      analysis: T('Use it as the denominator of the rate "Asked for help when offered", and as a covariate for task difficulty.', '"Teklif edilince yardım istedi" oranının paydası ve görev zorluğu için bir ortak değişken olarak kullanın.', 'Úselo como denominador de la tasa «Pidió ayuda cuando se le ofreció» y como covariable de la dificultad de la tarea.'),
      sentence: T('Help offers were counted each time the extension displayed a help link next to an error or warning in the active editor.', 'Yardım teklifleri, eklentinin etkin editörde bir hata ya da uyarının yanında yardım bağlantısı gösterdiği her seferde sayılmıştır.', 'Las ofertas de ayuda se contaron cada vez que la extensión mostró un enlace de ayuda junto a un error o una advertencia en el editor activo.'),
    },
    rq: { 'coding_sessions.diagnostics_offered': { RQ1: 'descriptive', RQ3: 'descriptive' } },
    limits: T(
      'Only the first three diagnostics of a file get an offer, and only in the editor that is active. So errors that the student fixed without asking are counted more widely than offers, and the two counters are not on the same base. The counter follows the difficulty of the task as much as the student.',
      'Bir dosyanın yalnızca ilk üç tanılaması ve yalnızca etkin editörde teklif alır. Bu yüzden öğrencinin sormadan düzelttiği hatalar tekliflerden daha geniş sayılır ve iki sayaç aynı temele dayanmaz. Sayaç öğrenci kadar görevin zorluğunu da izler.',
      'Solo los tres primeros diagnósticos de un archivo reciben una oferta, y solo en el editor activo. Por eso los errores que el estudiante corrigió sin preguntar se cuentan de forma más amplia que las ofertas, y los dos contadores no tienen la misma base. El contador sigue tanto a la dificultad de la tarea como al estudiante.',
    ),
    teacher: T(
      'A week with many offers for the whole class points to a hard task or a new topic. Plan a short recap of the most common error at the start of the next lab.',
      'Tüm sınıf için teklif sayısının yüksek olduğu bir hafta, zor bir görevi ya da yeni bir konuyu gösterir. Bir sonraki laboratuvarın başında en sık görülen hatanın kısa bir tekrarını planlayın.',
      'Una semana con muchas ofertas para toda la clase apunta a una tarea difícil o a un tema nuevo. Prepare un breve repaso del error más frecuente al inicio del siguiente laboratorio.',
    ),
  },

  // ------------------------------------------------------------------ help latency
  {
    slug: 'help-latency', category: 'before',
    items: ['interactions.help_latency_ms', 'metric.median_help_latency'],
    title: T('Waited after the offer', 'Tekliften sonra bekleme', 'Esperó tras la oferta'),
    what: {
      heading: T('What is the wait after the offer?', 'Tekliften sonraki bekleme nedir?', '¿Qué es la espera tras la oferta?'),
      text: T(
        'The wait is the time between the moment the help offer appeared next to an error and the moment the student clicked it. It shows how long the student worked on the error alone before asking.',
        'Bekleme, bir hatanın yanında yardım teklifinin göründüğü an ile öğrencinin ona tıkladığı an arasındaki süredir. Öğrencinin sormadan önce hata üzerinde tek başına ne kadar çalıştığını gösterir.',
        'La espera es el tiempo entre el momento en que apareció la oferta de ayuda junto a un error y el momento en que el estudiante hizo clic. Muestra cuánto trabajó el estudiante solo sobre el error antes de preguntar.',
      ),
    },
    example: {
      en: (f) => `The median wait of S07 was ${f.featuredMedianSec} seconds, close to the class median of ${f.classMedianSec} seconds. In many cases S07 read the error, tried something, and asked after half a minute.`,
      tr: (f) => `S07’nin ortanca bekleme süresi ${f.featuredMedianSec} saniyeydi. Bu, sınıfın ${f.classMedianSec} saniyelik ortancasına yakın. S07 çoğu zaman hatayı okudu, bir şey denedi ve yarım dakika sonra sordu.`,
      es: (f) => `La mediana de la espera de S07 fue de ${f.featuredMedianSec} segundos, cerca de la mediana de la clase, ${f.classMedianSec} segundos. Muchas veces, S07 leyó el error, probó algo y preguntó al cabo de medio minuto.`,
    },
    takeaway: T('The weekly median of S07 moves around the class median, with large jumps in weeks with few questions.', 'S07’nin haftalık ortancası sınıf ortancasının çevresinde dolaşıyor. Az sorulu haftalarda büyük sıçramalar görülüyor.', 'La mediana semanal de S07 se mueve alrededor de la de la clase, con grandes saltos en las semanas con pocas preguntas.'),
    purpose: {
      teacher: T('Do students try on their own before they ask, or do they click at once?', 'Öğrenciler sormadan önce kendileri deniyor mu, yoksa hemen mi tıklıyor?', '¿Intentan los estudiantes resolverlo solos antes de preguntar, o hacen clic enseguida?'),
      researcher: T('How long do students persist before seeking help, and does this time grow over the weeks?', 'Öğrenciler yardım istemeden önce ne kadar direniyor ve bu süre haftalar içinde uzuyor mu?', '¿Cuánto persisten los estudiantes antes de pedir ayuda y crece ese tiempo con las semanas?'),
    },
    raw: {
      intro: T('Two error questions of S07 that started from a visible offer.', 'S07’nin görünür bir tekliften başlayan iki hata sorusu.', 'Dos preguntas de S07 sobre errores que empezaron desde una oferta visible.'),
      snippets: [{ name: 'help-latency', caption: tbl('interactions') }],
    },
    formulas: [
      {
        id: 'interactions.help_latency_ms',
        heading: T('How the wait is measured', 'Bekleme nasıl ölçülür', 'Cómo se mide la espera'),
        text: T('Click time minus the time the offer icon first appeared for this diagnostic, in milliseconds. It is empty when there was no visible offer (all selection questions, and errors past the third one in a file). A negative value is stored as empty.', 'Tıklama zamanı eksi bu tanılama için teklif simgesinin ilk göründüğü zaman, milisaniye olarak. Görünür bir teklif yoksa boştur (tüm seçim soruları ve bir dosyada üçüncüden sonraki hatalar). Negatif bir değer boş olarak saklanır.', 'Momento del clic menos el momento en que apareció por primera vez el icono de la oferta para este diagnóstico, en milisegundos. Está vacío si no hubo oferta visible (todas las preguntas por selección y los errores posteriores al tercero de un archivo). Un valor negativo se guarda vacío.'),
      },
      {
        id: 'metric.median_help_latency',
        heading: T('Waited after the offer (median, dashboard)', 'Tekliften sonra bekleme (medyan, panel)', 'Esperó tras la oferta (mediana, panel)'),
        text: T('Median of the non-empty waits of the questions asked in the period.', 'Dönemde sorulan soruların boş olmayan bekleme sürelerinin ortancası.', 'Mediana de las esperas no vacías de las preguntas hechas en el periodo.'),
      },
    ],
    research: {
      stage: DURING,
      spss: T('`median_wait_s` per student, in seconds. Use the median, because a few very long waits (a break) distort the mean.', 'Öğrenci başına saniye cinsinden `median_wait_s`. Ortancayı kullanın, çünkü birkaç çok uzun bekleme (bir mola) ortalamayı bozar.', '`median_wait_s` por estudiante, en segundos. Use la mediana, porque unas pocas esperas muy largas (una pausa) distorsionan la media.'),
      analysis: T('Compare the median wait of weeks 1–2 and weeks 7–8 with a Wilcoxon signed-rank test, and correlate the change with the learning gain.', '1.–2. haftalar ile 7.–8. haftaların ortanca beklemesini Wilcoxon işaretli sıralar testiyle karşılaştırın ve değişimi öğrenme kazancıyla ilişkilendirin.', 'Compare la mediana de la espera de las semanas 1–2 y 7–8 con una prueba de Wilcoxon y correlacione el cambio con la ganancia de aprendizaje.'),
      sentence: T('Help latency was defined as the time between the display of the help link and the student\'s request, and summarized per student as a median.', 'Yardım gecikmesi, yardım bağlantısının görünmesi ile öğrencinin isteği arasındaki süre olarak tanımlanmış ve öğrenci başına ortanca ile özetlenmiştir.', 'La latencia de ayuda se definió como el tiempo entre la aparición del enlace de ayuda y la petición del estudiante, resumido por estudiante con la mediana.'),
    },
    rq: { 'interactions.help_latency_ms': { RQ1: 'descriptive', RQ3: 'outcome' }, 'metric.median_help_latency': { RQ3: 'outcome' } },
    limits: {
      en: (f) => `A long wait can mean effort, but also a break or work in another file. Only questions that started from a visible offer have a value (${f.withLatency} of ${f.questions} in the sample), so the measure describes error questions only. The clock runs in the extension, so a sleeping laptop can add time.`,
      tr: (f) => `Uzun bir bekleme çaba anlamına gelebilir, ama bir mola ya da başka bir dosyada çalışma da olabilir. Yalnızca görünür bir tekliften başlayan soruların değeri vardır (örnekte ${f.questions} sorunun ${f.withLatency} tanesi). Bu yüzden ölçü yalnızca hata sorularını betimler. Saat eklentide çalıştığı için uyku moduna geçen bir dizüstü bilgisayar süreyi uzatabilir.`,
      es: (f) => `Una espera larga puede indicar esfuerzo, pero también una pausa o trabajo en otro archivo. Solo tienen valor las preguntas que empezaron desde una oferta visible (${f.withLatency} de ${f.questions} en la muestra), así que la medida describe solo preguntas sobre errores. El reloj corre en la extensión, así que un portátil en reposo puede sumar tiempo.`,
    },
    teacher: T(
      'If a student almost always asks within a few seconds, suggest a simple habit: read the message twice and try one change before clicking.',
      'Bir öğrenci neredeyse her zaman birkaç saniye içinde soruyorsa, basit bir alışkanlık önerin: mesajı iki kez okumak ve tıklamadan önce bir değişiklik denemek.',
      'Si un estudiante casi siempre pregunta en pocos segundos, sugiera un hábito sencillo: leer el mensaje dos veces y probar un cambio antes de hacer clic.',
    ),
  },

  // ------------------------------------------------------------------ edits before asking
  {
    slug: 'edits-before-asking', category: 'before',
    items: ['interactions.edits_before_ask', 'metric.avg_edits_before_ask'],
    title: T('Edits before asking', 'Sormadan önceki düzenlemeler', 'Ediciones antes de preguntar'),
    what: {
      heading: T('What are the edits before asking?', 'Sormadan önceki düzenlemeler nedir?', '¿Qué son las ediciones antes de preguntar?'),
      text: T(
        'This number counts the changes the student made to the file between the moment the help offer appeared and the click on it. It shows how many attempts came before the question.',
        'Bu sayı, yardım teklifinin göründüğü an ile ona tıklandığı an arasında öğrencinin dosyada yaptığı değişiklikleri sayar. Sorudan önce kaç deneme yapıldığını gösterir.',
        'Este número cuenta los cambios que hizo el estudiante en el archivo entre el momento en que apareció la oferta de ayuda y el clic. Muestra cuántos intentos hubo antes de la pregunta.',
      ),
    },
    example: {
      en: (f) => `S07 made ${dec(f.featuredAvg, 'en')} edits on average before asking. The class median was ${f.classMedian}. Only ${f.eightPlus} questions in the whole class came after eight or more edits.`,
      tr: (f) => `S07 sormadan önce ortalama ${dec(f.featuredAvg, 'tr')} düzenleme yaptı. Sınıfın ortancası ${f.classMedian}. Tüm sınıfta yalnızca ${f.eightPlus} soru sekiz ya da daha fazla düzenlemeden sonra geldi.`,
      es: (f) => `S07 hizo ${dec(f.featuredAvg, 'es')} ediciones de media antes de preguntar. La mediana de la clase fue ${f.classMedian}. En toda la clase, solo ${f.eightPlus} preguntas llegaron tras ocho o más ediciones.`,
    },
    takeaway: T('Most questions come after zero to four attempts. Long series of attempts before asking are rare.', 'Soruların çoğu sıfır ile dört deneme arasında geliyor. Sormadan önceki uzun deneme dizileri seyrek.', 'La mayoría de las preguntas llegan tras cero a cuatro intentos. Las series largas de intentos antes de preguntar son raras.'),
    purpose: {
      teacher: T('Do students try something before they ask?', 'Öğrenciler sormadan önce bir şey deniyor mu?', '¿Prueban algo los estudiantes antes de preguntar?'),
      researcher: T('How much effort comes before a help request, and how does it compare with the effort of unaided fixes?', 'Bir yardım isteğinden önce ne kadar çaba harcanıyor ve bu, yardımsız düzeltmelerin çabasıyla nasıl karşılaştırılıyor?', '¿Cuánto esfuerzo hay antes de una petición de ayuda y cómo se compara con el de las correcciones sin ayuda?'),
    },
    raw: {
      intro: T('Two error questions of S07.', 'S07’nin iki hata sorusu.', 'Dos preguntas de S07 sobre errores.'),
      snippets: [{ name: 'edits-before-asking', caption: tbl('interactions') }],
    },
    formulas: [
      {
        id: 'interactions.edits_before_ask',
        heading: T('How the edits are counted', 'Düzenlemeler nasıl sayılır', 'Cómo se cuentan las ediciones'),
        text: T('Number of change events in the document between the offer and the click. One change event can be one typed character or one pasted block. Empty when there was no visible offer.', 'Teklif ile tıklama arasında belgedeki değişiklik olaylarının sayısı. Bir değişiklik olayı, yazılan tek bir karakter ya da yapıştırılan bir blok olabilir. Görünür bir teklif yoksa boştur.', 'Número de eventos de cambio en el documento entre la oferta y el clic. Un evento de cambio puede ser un carácter tecleado o un bloque pegado. Vacío si no hubo oferta visible.'),
      },
      {
        id: 'metric.avg_edits_before_ask',
        heading: T('Edits before asking (dashboard)', 'Sormadan önceki düzenlemeler (panel)', 'Ediciones antes de preguntar (panel)'),
        text: T('The student view shows the mean of the non-empty values, with one decimal. The class view of learning behaviour shows the median instead.', 'Öğrenci görünümü boş olmayan değerlerin ortalamasını bir ondalıkla gösterir. Öğrenme davranışının sınıf görünümü ise ortancayı gösterir.', 'La vista del estudiante muestra la media de los valores no vacíos, con un decimal. La vista de clase del comportamiento de aprendizaje muestra en cambio la mediana.'),
      },
    ],
    research: {
      stage: DURING,
      spss: T('`median_edits_before_ask` per student. Prefer the median, because single long sessions of typing inflate the mean.', 'Öğrenci başına `median_edits_before_ask`. Ortancayı tercih edin, çünkü tek tük uzun yazma oturumları ortalamayı şişirir.', '`median_edits_before_ask` por estudiante. Prefiera la mediana, porque algunas sesiones largas de escritura inflan la media.'),
      analysis: T('Compare it with the edits per unaided fix of the same student (paired Wilcoxon test).', 'Aynı öğrencinin yardımsız düzeltme başına düzenlemeleriyle karşılaştırın (eşleştirilmiş Wilcoxon testi).', 'Compárelo con las ediciones por corrección sin ayuda del mismo estudiante (prueba de Wilcoxon para muestras relacionadas).'),
      sentence: T('Persistence before help-seeking was operationalized as the number of edits between the display of the help link and the request.', 'Yardım istemeden önceki sebat, yardım bağlantısının görünmesi ile istek arasındaki düzenleme sayısı olarak işlevselleştirilmiştir.', 'La persistencia antes de pedir ayuda se operacionalizó como el número de ediciones entre la aparición del enlace de ayuda y la petición.'),
    },
    rq: { 'interactions.edits_before_ask': { RQ1: 'descriptive', RQ3: 'outcome' }, 'metric.avg_edits_before_ask': { RQ4: 'predictor' } },
    limits: T(
      'An edit event is not an attempt in the learning sense: typing one word creates many events, and a paste creates one. Edits in other files are not counted. The value is empty for selection questions.',
      'Bir düzenleme olayı, öğrenme anlamında bir deneme değildir: tek bir sözcük yazmak birçok olay oluşturur, bir yapıştırma ise tek olay. Başka dosyalardaki düzenlemeler sayılmaz. Seçim sorularında değer boştur.',
      'Un evento de edición no es un intento en el sentido del aprendizaje: escribir una palabra genera muchos eventos y pegar un bloque genera uno. Las ediciones en otros archivos no se cuentan. El valor está vacío en las preguntas por selección.',
    ),
    teacher: T(
      'If a student asks without any edits most of the time, ask them to explain the error message in their own words first. If a student makes very many edits before asking, a hint to ask earlier can save frustration.',
      'Bir öğrenci çoğu zaman hiç düzenleme yapmadan soruyorsa, önce hata mesajını kendi sözleriyle açıklamasını isteyin. Sormadan önce çok fazla düzenleme yapan bir öğrenciye ise daha erken sormasını önermek hayal kırıklığını azaltabilir.',
      'Si un estudiante pregunta casi siempre sin editar nada, pídale que explique primero el mensaje de error con sus palabras. Si otro hace muchísimas ediciones antes de preguntar, sugerirle que pregunte antes puede ahorrarle frustración.',
    ),
  },

  // ------------------------------------------------------------------ repeated error
  {
    slug: 'repeated-error', category: 'before',
    items: ['interactions.error_signature_normalized', 'interactions.recurring_error_count', 'metric.repeat_errors'],
    title: T('Asked about the same error again', 'Aynı hatayı yeniden sordu', 'Preguntó otra vez por el mismo error'),
    what: {
      heading: T('What is a repeated error?', 'Tekrarlanan hata nedir?', '¿Qué es un error repetido?'),
      text: T(
        'For each error question, the server counts how many earlier questions of the same student had the same error. "The same" means the same normalized message: numbers and quoted names are replaced, so errors that differ only in a line number or a variable name match.',
        'Sunucu her hata sorusu için aynı öğrencinin daha önceki kaç sorusunun aynı hatayı içerdiğini sayar. "Aynı", aynı normalleştirilmiş mesaj demektir: sayılar ve tırnak içindeki adlar değiştirilir. Böylece yalnızca satır numarası ya da değişken adı farklı olan hatalar eşleşir.',
        'Para cada pregunta sobre un error, el servidor cuenta cuántas preguntas anteriores del mismo estudiante tenían el mismo error. «El mismo» significa el mismo mensaje normalizado: los números y los nombres entre comillas se sustituyen, así que coinciden los errores que solo difieren en el número de línea o en el nombre de una variable.',
      ),
    },
    example: {
      en: (f) => `In week ${f.pairWeek1}, S07 asked about \`${f.pairMessage}\`. In week ${f.pairWeek2}, the same kind of message came back, and the server stored 1 as the number of earlier questions. Both messages become \`${f.pairNormalized}\` after normalization. In total, ${f.featuredRepeats} of S07's ${f.featuredQuestions} questions repeated an earlier error.`,
      tr: (f) => `S07, ${f.pairWeek1}. haftada \`${f.pairMessage}\` hatasını sordu. ${f.pairWeek2}. haftada aynı türden mesaj geri geldi ve sunucu önceki soru sayısı olarak 1 kaydetti. İki mesaj da normalleştirmeden sonra \`${f.pairNormalized}\` olur. Toplamda S07’nin ${f.featuredQuestions} sorusundan ${f.featuredRepeats} tanesi daha önceki bir hatayı tekrarlıyordu.`,
      es: (f) => `En la semana ${f.pairWeek1}, S07 preguntó por \`${f.pairMessage}\`. En la semana ${f.pairWeek2} volvió el mismo tipo de mensaje y el servidor guardó 1 como número de preguntas anteriores. Los dos mensajes quedan como \`${f.pairNormalized}\` tras la normalización. En total, ${f.featuredRepeats} de las ${f.featuredQuestions} preguntas de S07 repetían un error anterior.`,
    },
    takeaway: T('In the class, the share of repeated errors rises in the first weeks and then stays near one half. The line of S07 jumps, because S07 asked few error questions per week.', 'Sınıfta tekrarlanan hataların payı ilk haftalarda artıyor, sonra yarıya yakın kalıyor. S07’nin çizgisi sıçrıyor, çünkü S07 haftada az hata sorusu sordu.', 'En la clase, la proporción de errores repetidos sube en las primeras semanas y luego se queda cerca de la mitad. La línea de S07 da saltos, porque S07 hizo pocas preguntas sobre errores por semana.'),
    purpose: {
      teacher: T('Which students keep meeting the same error?', 'Hangi öğrenciler aynı hatayla karşılaşmaya devam ediyor?', '¿Qué estudiantes se siguen encontrando con el mismo error?'),
      researcher: T('Does an explanation lead to lasting understanding, or does the same error come back?', 'Bir açıklama kalıcı bir anlamaya yol açıyor mu, yoksa aynı hata geri mi geliyor?', '¿Lleva una explicación a una comprensión duradera o vuelve el mismo error?'),
    },
    raw: {
      intro: T('Two questions of S07 with the same normalized message.', 'S07’nin aynı normalleştirilmiş mesaja sahip iki sorusu.', 'Dos preguntas de S07 con el mismo mensaje normalizado.'),
      snippets: [{ name: 'repeated-error', caption: tbl('interactions') }],
    },
    formulas: [
      {
        id: 'interactions.error_signature_normalized',
        heading: T('How the message is normalized', 'Mesaj nasıl normalleştirilir', 'Cómo se normaliza el mensaje'),
        text: T('Every run of digits becomes #, every quoted text becomes "X", and the result is trimmed and written in lower case. The same function builds the cache key of the explanations.', 'Her rakam dizisi # olur, tırnak içindeki her metin "X" olur ve sonuç kırpılıp küçük harfe çevrilir. Açıklamaların önbellek anahtarı da aynı işlevle oluşturulur.', 'Cada serie de dígitos pasa a ser #, cada texto entre comillas pasa a ser "X", y el resultado se recorta y se pasa a minúsculas. La misma función construye la clave de caché de las explicaciones.'),
      },
      {
        id: 'interactions.recurring_error_count',
        heading: T('How repeats are counted', 'Tekrarlar nasıl sayılır', 'Cómo se cuentan las repeticiones'),
        text: T('Number of earlier questions of the same student with the same normalized message, counted when the question is stored. 0 means "first time". Selection questions always have 0.', 'Aynı öğrencinin aynı normalleştirilmiş mesaja sahip önceki sorularının sayısı, soru kaydedilirken sayılır. 0 "ilk kez" demektir. Seçim sorularında değer her zaman 0’dır.', 'Número de preguntas anteriores del mismo estudiante con el mismo mensaje normalizado, contado al guardar la pregunta. 0 significa «primera vez». Las preguntas por selección tienen siempre 0.'),
      },
      {
        id: 'metric.repeat_errors',
        heading: T('Asked about the same error again (dashboard)', 'Aynı hatayı yeniden sordu (panel)', 'Preguntó otra vez por el mismo error (panel)'),
        text: T('Questions of the period with a repeat count above 0.', 'Dönemdeki tekrar sayısı 0’dan büyük olan sorular.', 'Preguntas del periodo con un número de repeticiones mayor que 0.'),
      },
    ],
    research: {
      stage: DURING,
      spss: T('`repeat_share` = repeated error questions ÷ error questions, per student.', 'Öğrenci başına `repeat_share` = tekrarlanan hata soruları ÷ hata soruları.', '`repeat_share` = preguntas sobre errores repetidos ÷ preguntas sobre errores, por estudiante.'),
      analysis: T('Correlate the repeat share with the learning gain from pre-test to post-test (Spearman).', 'Tekrar payını ön testten son teste öğrenme kazancıyla ilişkilendirin (Spearman).', 'Correlacione la proporción de repeticiones con la ganancia de aprendizaje del pretest al postest (Spearman).'),
      sentence: T('An error was counted as repeated when the same student had asked about the same normalized error message before.', 'Aynı öğrenci aynı normalleştirilmiş hata mesajını daha önce sormuşsa hata tekrarlanan olarak sayılmıştır.', 'Un error se contó como repetido cuando el mismo estudiante ya había preguntado antes por el mismo mensaje de error normalizado.'),
    },
    rq: { 'interactions.recurring_error_count': { RQ3: 'outcome', RQ4: 'predictor' }, 'metric.repeat_errors': { RQ3: 'outcome' } },
    limits: T(
      'Normalization can also join different errors: every "name is not defined" becomes one error, whatever the name. The count only sees questions, not errors the student met without asking. It grows with time by construction, so compare periods of the same length.',
      'Normalleştirme farklı hataları da birleştirebilir: adı ne olursa olsun her "ad tanımlı değil" hatası tek bir hata olur. Sayım yalnızca soruları görür, öğrencinin sormadan karşılaştığı hataları değil. Yapısı gereği zamanla artar. Bu yüzden aynı uzunluktaki dönemleri karşılaştırın.',
      'La normalización también puede juntar errores distintos: todo «nombre no definido» se convierte en un solo error, sea cual sea el nombre. El recuento solo ve preguntas, no los errores que el estudiante encontró sin preguntar. Por construcción crece con el tiempo, así que compare periodos de la misma duración.',
    ),
    teacher: T(
      'If one student asks about the same error again and again, sit with them for two minutes and let them explain the rule of that error back to you.',
      'Bir öğrenci aynı hatayı tekrar tekrar soruyorsa, iki dakika yanına oturun ve o hatanın kuralını size geri anlatmasını isteyin.',
      'Si un estudiante pregunta una y otra vez por el mismo error, siéntese dos minutos con él y pídale que le explique la regla de ese error.',
    ),
  },

  // ------------------------------------------------------------------ time since same error
  {
    slug: 'time-since-same-error', category: 'before',
    items: ['interactions.ms_since_previous_same_error', 'metric.quick_repeats'],
    title: T('Time since the same error', 'Aynı hatadan bu yana geçen süre', 'Tiempo desde el mismo error'),
    what: {
      heading: T('What is the time since the same error?', 'Aynı hatadan bu yana geçen süre nedir?', '¿Qué es el tiempo desde el mismo error?'),
      text: T(
        'For a repeated error, this is the time since the student last asked about the same normalized error. A short time means the last explanation did not land. A long time means the mistake came back later.',
        'Tekrarlanan bir hata için bu, öğrencinin aynı normalleştirilmiş hatayı en son sorduğu zamandan bu yana geçen süredir. Kısa bir süre, son açıklamanın yerine ulaşmadığını gösterir. Uzun bir süre ise hatanın daha sonra geri geldiğini gösterir.',
        'En un error repetido, es el tiempo transcurrido desde la última vez que el estudiante preguntó por el mismo error normalizado. Un tiempo corto indica que la última explicación no funcionó. Un tiempo largo indica que el error volvió más tarde.',
      ),
    },
    example: {
      en: (f) => `S07 repeated an earlier error ${f.featuredRepeats} times. Only ${f.featuredQuick} of these came within ten minutes of the earlier question. Most repeats came days later, when a similar task brought the same mistake back.`,
      tr: (f) => `S07 daha önceki bir hatayı ${f.featuredRepeats} kez tekrarladı. Bunlardan yalnızca ${f.featuredQuick} tanesi önceki sorudan sonraki on dakika içinde geldi. Tekrarların çoğu günler sonra, benzer bir görev aynı hatayı geri getirdiğinde geldi.`,
      es: (f) => `S07 repitió un error anterior ${f.featuredRepeats} veces. Solo ${f.featuredQuick} de ellas llegaron en los diez minutos siguientes a la pregunta anterior. La mayoría llegaron días después, cuando una tarea parecida trajo de vuelta el mismo error.`,
    },
    takeaway: {
      en: (f) => `In the class, ${pc(f.quickPct, 'en')} of the repeats came within ten minutes.`,
      tr: (f) => `Sınıfta tekrarların ${pc(f.quickPct, 'tr')} kadarı on dakika içinde geldi.`,
      es: (f) => `En la clase, el ${pc(f.quickPct, 'es')} de las repeticiones llegó en menos de diez minutos.`,
    },
    purpose: {
      teacher: T('Did the last explanation help, or did the student ask again at once?', 'Son açıklama işe yaradı mı, yoksa öğrenci hemen yeniden mi sordu?', '¿Sirvió la última explicación o el estudiante volvió a preguntar enseguida?'),
      researcher: T('Can quick repeats serve as a sign that an explanation failed, separate from forgetting over time?', 'Hızlı tekrarlar, zamanla unutmadan ayrı olarak bir açıklamanın başarısız olduğunun işareti sayılabilir mi?', '¿Pueden las repeticiones rápidas servir como señal de una explicación fallida, distinta del olvido con el tiempo?'),
    },
    raw: {
      intro: T('A repeated error question of S07.', 'S07’nin tekrarlanan bir hata sorusu.', 'Una pregunta de S07 sobre un error repetido.'),
      snippets: [{ name: 'time-since-same-error', caption: tbl('interactions') }],
    },
    formulas: [
      {
        id: 'interactions.ms_since_previous_same_error',
        heading: T('How the time is computed', 'Süre nasıl hesaplanır', 'Cómo se calcula el tiempo'),
        text: T('Time of the new question minus the time of the latest earlier question with the same normalized message, in milliseconds. Empty for a first occurrence and for selection questions.', 'Yeni sorunun zamanı eksi aynı normalleştirilmiş mesaja sahip en son önceki sorunun zamanı, milisaniye olarak. İlk kez görülen hatalarda ve seçim sorularında boştur.', 'Momento de la nueva pregunta menos el de la pregunta anterior más reciente con el mismo mensaje normalizado, en milisegundos. Vacío en la primera aparición y en las preguntas por selección.'),
      },
      {
        id: 'metric.quick_repeats',
        heading: T('Asked again within 10 minutes (dashboard)', '10 dakika içinde yeniden sordu (panel)', 'Volvió a preguntar en menos de 10 minutos (panel)'),
        text: T('Questions of the period with a time since the same error of at most 600,000 ms (10 minutes).', 'Dönemdeki, aynı hatadan bu yana geçen süresi en fazla 600.000 ms (10 dakika) olan sorular.', 'Preguntas del periodo con un tiempo desde el mismo error de 600.000 ms (10 minutos) como máximo.'),
      },
    ],
    research: {
      stage: DURING,
      spss: T('`quick_repeats` = number of repeats within 10 minutes per student, and `quick_repeat_share` = quick repeats ÷ repeats.', 'Öğrenci başına `quick_repeats` = 10 dakika içindeki tekrarların sayısı ve `quick_repeat_share` = hızlı tekrarlar ÷ tekrarlar.', '`quick_repeats` = número de repeticiones en menos de 10 minutos por estudiante, y `quick_repeat_share` = repeticiones rápidas ÷ repeticiones.'),
      analysis: T('Compare the rate of quick repeats between questions that ended at L0–L1 and those that reached L3 (chi-square test).', 'L0–L1’de biten sorularla L3’e ulaşan sorular arasında hızlı tekrar oranını karşılaştırın (ki-kare testi).', 'Compare la tasa de repeticiones rápidas entre las preguntas que terminaron en L0–L1 y las que llegaron a L3 (prueba de chi cuadrado).'),
      sentence: T('A repeat within ten minutes of the previous request for the same error was taken as a sign that the earlier explanation had not resolved the problem.', 'Aynı hata için önceki istekten sonraki on dakika içinde gelen bir tekrar, önceki açıklamanın sorunu çözmediğinin işareti olarak alınmıştır.', 'Una repetición en los diez minutos siguientes a la petición anterior por el mismo error se tomó como señal de que la explicación anterior no había resuelto el problema.'),
    },
    rq: { 'metric.quick_repeats': { RQ2: 'outcome', RQ3: 'outcome' } },
    limits: T(
      'Two different errors with the same normalized message count as the same error, so a quick "repeat" may be a new but similar problem. The ten-minute limit is a fixed choice of the dashboard, not a tested threshold.',
      'Aynı normalleştirilmiş mesaja sahip iki farklı hata aynı hata sayılır. Bu yüzden hızlı bir "tekrar" yeni ama benzer bir sorun olabilir. On dakikalık sınır panelin sabit bir seçimidir, sınanmış bir eşik değildir.',
      'Dos errores distintos con el mismo mensaje normalizado cuentan como el mismo error, así que una «repetición» rápida puede ser un problema nuevo pero parecido. El límite de diez minutos es una elección fija del panel, no un umbral probado.',
    ),
    teacher: T(
      'A quick repeat is a good moment for a personal word: the explanation on screen did not help, so a different way of explaining is likely to work better.',
      'Hızlı bir tekrar, birebir konuşmak için iyi bir andır: ekrandaki açıklama işe yaramadı, bu yüzden farklı bir anlatım büyük olasılıkla daha iyi sonuç verir.',
      'Una repetición rápida es un buen momento para hablar en persona: la explicación en pantalla no sirvió, así que es probable que otra forma de explicarlo funcione mejor.',
    ),
  },

  // ------------------------------------------------------------------ recurring concept
  {
    slug: 'recurring-concept', category: 'before',
    items: ['interactions.concept', 'interactions.recurring_concept_count', 'metric.concepts_top_student'],
    title: T('Concept', 'Kavram', 'Concepto'),
    what: {
      heading: T('What is the concept of a question?', 'Bir sorunun kavramı nedir?', '¿Qué es el concepto de una pregunta?'),
      text: T(
        'The concept is a short name for the general programming idea behind a question, for example "variable scope". The AI model writes it with every answer, in the feedback language. The server also counts how many earlier questions of the student had the same concept.',
        'Kavram, bir sorunun arkasındaki genel programlama fikrinin kısa adıdır, örneğin "değişken kapsamı". Yapay zekâ modeli bunu her yanıtla birlikte geri bildirim dilinde yazar. Sunucu ayrıca öğrencinin daha önceki kaç sorusunun aynı kavrama sahip olduğunu sayar.',
        'El concepto es un nombre breve para la idea general de programación detrás de una pregunta, por ejemplo «ámbito de variables». El modelo de IA lo escribe con cada respuesta, en el idioma de las explicaciones. El servidor cuenta además cuántas preguntas anteriores del estudiante tenían el mismo concepto.',
      ),
    },
    example: {
      en: (f) => `The most frequent concept of S07 was "${f.featuredTop}" with ${f.featuredTopCount} questions. The highest repeat count of a concept for S07 was ${f.maxRecurring}. In the class, one idea appeared under three names, one per language: "type conversion" ${f.typeConversionEn} times, "tür dönüşümü" ${f.typeConversionTr} times and "conversión de tipos" ${f.typeConversionEs} times.`,
      tr: (f) => `S07’nin en sık kavramı ${f.featuredTopCount} soruyla "${f.featuredTop}" oldu. S07 için bir kavramın en yüksek tekrar sayısı ${f.maxRecurring}. Sınıfta tek bir fikir, her dilde bir tane olmak üzere üç adla göründü: "type conversion" ${f.typeConversionEn} kez, "tür dönüşümü" ${f.typeConversionTr} kez ve "conversión de tipos" ${f.typeConversionEs} kez.`,
      es: (f) => `El concepto más frecuente de S07 fue «${f.featuredTop}», con ${f.featuredTopCount} preguntas. El número de repeticiones más alto de un concepto para S07 fue ${f.maxRecurring}. En la clase, una misma idea apareció con tres nombres, uno por idioma: «type conversion» ${f.typeConversionEn} veces, «tür dönüşümü» ${f.typeConversionTr} y «conversión de tipos» ${f.typeConversionEs}.`,
    },
    takeaway: {
      en: (f) => `"${f.featuredTop}" leads the concepts of S07. The labels come from the model, in the language of the student.`,
      tr: (f) => `S07’nin kavramlarında "${f.featuredTop}" başı çekiyor. Etiketler modelden, öğrencinin dilinde geliyor.`,
      es: (f) => `«${f.featuredTop}» encabeza los conceptos de S07. Las etiquetas vienen del modelo, en el idioma del estudiante.`,
    },
    purpose: {
      teacher: T('Which ideas does each student struggle with, beyond single error messages?', 'Her öğrenci, tek tek hata mesajlarının ötesinde hangi fikirlerde zorlanıyor?', '¿Con qué ideas tiene dificultades cada estudiante, más allá de mensajes de error concretos?'),
      researcher: T('Do misconceptions recur across different-looking errors?', 'Kavram yanılgıları farklı görünen hatalarda tekrar ediyor mu?', '¿Se repiten las ideas erróneas en errores de aspecto distinto?'),
    },
    raw: {
      intro: T('A question of S07 whose concept had come up before.', 'S07’nin kavramı daha önce de görülmüş bir sorusu.', 'Una pregunta de S07 cuyo concepto ya había aparecido antes.'),
      snippets: [{ name: 'recurring-concept', caption: tbl('interactions') }],
    },
    formulas: [
      {
        id: 'interactions.recurring_concept_count',
        heading: T('How concept repeats are counted', 'Kavram tekrarları nasıl sayılır', 'Cómo se cuentan las repeticiones de un concepto'),
        text: T('Number of earlier questions of the same student whose concept matches this one, ignoring upper and lower case. Counted when the question is stored.', 'Aynı öğrencinin, kavramı büyük ve küçük harf farkı gözetilmeden bununla eşleşen önceki sorularının sayısı. Soru kaydedilirken sayılır.', 'Número de preguntas anteriores del mismo estudiante cuyo concepto coincide con este, sin distinguir mayúsculas y minúsculas. Se cuenta al guardar la pregunta.'),
      },
      {
        id: 'metric.concepts_top_student',
        heading: T('Recurring concepts (dashboard)', 'Tekrarlayan kavramlar (panel)', 'Conceptos recurrentes (panel)'),
        text: T('The five most frequent concepts of a student in the period, grouped by lower-case, trimmed text.', 'Bir öğrencinin dönemdeki en sık beş kavramı, küçük harfe çevrilmiş ve kırpılmış metne göre gruplanır.', 'Los cinco conceptos más frecuentes de un estudiante en el periodo, agrupados por el texto recortado y en minúsculas.'),
      },
    ],
    research: {
      stage: ANALYSIS,
      spss: T('Map the concepts to a fixed list of topics in all three languages first. Then compute `n_topic_<name>` per student.', 'Önce kavramları üç dilde de sabit bir konu listesine eşleyin. Sonra öğrenci başına `n_topic_<ad>` hesaplayın.', 'Asigne primero los conceptos a una lista fija de temas en los tres idiomas. Después calcule `n_topic_<nombre>` por estudiante.'),
      analysis: T('Describe the topics per week, and compare the number of topics with repeats between students with high and low gain.', 'Konuları haftalara göre betimleyin ve tekrar eden konu sayısını yüksek ve düşük kazanç gösteren öğrenciler arasında karşılaştırın.', 'Describa los temas por semana y compare el número de temas repetidos entre estudiantes con ganancia alta y baja.'),
      sentence: T('The concepts assigned by the model were mapped to a common topic list across the three feedback languages before analysis.', 'Modelin atadığı kavramlar analizden önce üç geri bildirim dilinde ortak bir konu listesine eşlenmiştir.', 'Antes del análisis, los conceptos asignados por el modelo se asignaron a una lista común de temas en los tres idiomas.'),
    },
    rq: { 'interactions.concept': { RQ2: 'moderator' }, 'interactions.recurring_concept_count': { RQ3: 'outcome' } },
    limits: T(
      'The concept is written by the model and is not checked against a fixed list. The same idea can get different names, also in different languages, and the dashboard counts them separately. Treat the concept as a hint for coding, not as a measured category.',
      'Kavramı model yazar ve sabit bir listeyle karşılaştırılmaz. Aynı fikir farklı adlar alabilir, farklı dillerde de, ve panel bunları ayrı sayar. Kavramı ölçülmüş bir kategori olarak değil, kodlama için bir ipucu olarak ele alın.',
      'El concepto lo escribe el modelo y no se compara con una lista fija. La misma idea puede recibir nombres distintos, también en idiomas distintos, y el panel los cuenta por separado. Trate el concepto como una pista para codificar, no como una categoría medida.',
    ),
    teacher: T(
      'Look at the recurring concepts of a student before a one-to-one talk. Pick one concept and give a small, focused exercise on it.',
      'Birebir bir konuşmadan önce öğrencinin tekrarlayan kavramlarına bakın. Bir kavram seçin ve onunla ilgili küçük, odaklı bir alıştırma verin.',
      'Mire los conceptos recurrentes de un estudiante antes de una conversación individual. Elija uno y proponga un ejercicio breve y centrado en él.',
    ),
  },

  // ------------------------------------------------------------------ hint depth
  {
    slug: 'hint-depth', category: 'ladder',
    items: ['interactions.max_level_reached', 'metric.hint_depth_distribution'],
    title: T('Hint depth', 'İpucu derinliği', 'Profundidad de la pista'),
    what: {
      heading: T('What is the hint depth?', 'İpucu derinliği nedir?', '¿Qué es la profundidad de la pista?'),
      text: T(
        'Every answer is a ladder of four steps. Decode (L0) and Locate (L1) appear together. The rule (L2) and the fix (L3) open only when the student clicks. The hint depth is the highest step the student opened: 0 for L0–L1, 2 for the rule and 3 for the fix.',
        'Her yanıt dört adımlı bir merdivendir. Çöz (L0) ve Bul (L1) birlikte görünür. Kural (L2) ve düzeltme (L3) yalnızca öğrenci tıklarsa açılır. İpucu derinliği, öğrencinin açtığı en yüksek adımdır: L0–L1 için 0, kural için 2 ve düzeltme için 3.',
        'Cada respuesta es una escalera de cuatro pasos. Descifrar (L0) y Ubicar (L1) aparecen juntos. La regla (L2) y la corrección (L3) solo se abren si el estudiante hace clic. La profundidad es el paso más alto que abrió el estudiante: 0 para L0–L1, 2 para la regla y 3 para la corrección.',
      ),
    },
    example: {
      en: (f) => `S07 asked ${f.featuredQuestions} questions. ${f.featuredHint} ended after L0–L1, ${f.featuredRule} at the rule and ${f.featuredFix} at the fix. In the early weeks S07 often opened the fix. Later S07 more often stopped after the first two steps.`,
      tr: (f) => `S07 ${f.featuredQuestions} soru sordu. Bunların ${f.featuredHint} tanesi L0–L1’den sonra, ${f.featuredRule} tanesi kuralda ve ${f.featuredFix} tanesi düzeltmede bitti. İlk haftalarda S07 çoğu zaman düzeltmeyi açtı. Sonra daha sık ilk iki adımda durdu.`,
      es: (f) => `S07 hizo ${f.featuredQuestions} preguntas. ${f.featuredHint} terminaron tras L0–L1, ${f.featuredRule} en la regla y ${f.featuredFix} en la corrección. En las primeras semanas, S07 abría a menudo la corrección. Más tarde se detuvo con más frecuencia tras los dos primeros pasos.`,
    },
    takeaway: {
      en: (f) => `In the class, ${pc(f.classFixPct, 'en')} of the questions reached the fix. S07 looks like the class as a whole.`,
      tr: (f) => `Sınıfta soruların ${pc(f.classFixPct, 'tr')} kadarı düzeltmeye ulaştı. S07 sınıfın geneline benziyor.`,
      es: (f) => `En la clase, el ${pc(f.classFixPct, 'es')} de las preguntas llegó a la corrección. S07 se parece a la clase en conjunto.`,
    },
    purpose: {
      teacher: T('How often do students need the full fix, and how often is a hint enough?', 'Öğrenciler ne sıklıkla tam düzeltmeye ihtiyaç duyuyor, ne sıklıkla bir ipucu yetiyor?', '¿Con qué frecuencia necesitan los estudiantes la corrección completa y con qué frecuencia basta una pista?'),
      researcher: T('How far do students go down the ladder, and does the depth change over the weeks?', 'Öğrenciler merdivende ne kadar ilerliyor ve derinlik haftalar içinde değişiyor mu?', '¿Hasta dónde bajan los estudiantes por la escalera y cambia la profundidad con las semanas?'),
    },
    raw: {
      intro: T('Two questions of S07: one ended after L0–L1, one reached the fix.', 'S07’nin iki sorusu: biri L0–L1’den sonra bitti, biri düzeltmeye ulaştı.', 'Dos preguntas de S07: una terminó tras L0–L1 y otra llegó a la corrección.'),
      snippets: [{ name: 'hint-depth', caption: tbl('interactions') }],
    },
    formulas: [{
      id: 'metric.hint_depth_distribution',
      heading: T('How far students went into the hints (dashboard)', 'Öğrenciler ipuçlarında ne kadar ilerledi (panel)', 'Hasta dónde llegaron en las pistas (panel)'),
      text: T('Questions of the period in three groups: hint only (depth 0 or 1), rule (2) and fix (3).', 'Dönemdeki sorular üç grupta toplanır: yalnızca ipucu (derinlik 0 ya da 1), kural (2) ve düzeltme (3).', 'Las preguntas del periodo en tres grupos: solo la pista (profundidad 0 o 1), regla (2) y corrección (3).'),
    }],
    research: {
      stage: DURING,
      spss: T('`fix_share` = questions with depth 3 ÷ all questions, per student. Keep the counts per level too.', 'Öğrenci başına `fix_share` = derinliği 3 olan sorular ÷ tüm sorular. Düzey başına sayıları da tutun.', '`fix_share` = preguntas con profundidad 3 ÷ todas las preguntas, por estudiante. Conserve también los recuentos por nivel.'),
      analysis: T('Test the change in fix share from weeks 1–4 to weeks 5–8 with a paired t-test, or model depth per question with a mixed ordinal regression (student as random effect).', '1.–4. haftalardan 5.–8. haftalara düzeltme payındaki değişimi eşleştirilmiş t-testiyle sınayın ya da soru başına derinliği karma sıralı regresyonla modelleyin (öğrenci rastgele etki olarak).', 'Contraste el cambio de la proporción de correcciones entre las semanas 1–4 y 5–8 con una prueba t para muestras relacionadas, o modele la profundidad por pregunta con una regresión ordinal mixta (estudiante como efecto aleatorio).'),
      sentence: T('Hint depth was coded as the highest level of the four-step hint ladder that the student opened for each request (L0–L1, L2 or L3).', 'İpucu derinliği, öğrencinin her istek için dört adımlı ipucu merdiveninde açtığı en yüksek düzey olarak kodlanmıştır (L0–L1, L2 ya da L3).', 'La profundidad de la pista se codificó como el nivel más alto de la escalera de cuatro pasos que el estudiante abrió en cada petición (L0–L1, L2 o L3).'),
    },
    rq: { 'interactions.max_level_reached': { RQ2: 'outcome', RQ3: 'outcome', RQ4: 'predictor' }, 'metric.hint_depth_distribution': { RQ2: 'descriptive' } },
    limits: {
      en: (f) => `The value 1 is never stored (${f.levelOne} rows in the sample), because L0 and L1 always appear together. Opening a step does not mean reading it, and not opening the fix does not mean the student solved the problem. A student can open steps later, when the explanation is reopened from the history list.`,
      tr: (f) => `1 değeri hiç saklanmaz (örnekte ${f.levelOne} satır), çünkü L0 ve L1 her zaman birlikte görünür. Bir adımı açmak onu okumak demek değildir. Düzeltmeyi açmamak da öğrencinin sorunu çözdüğü anlamına gelmez. Öğrenci adımları daha sonra, açıklamayı geçmiş listesinden yeniden açtığında da açabilir.`,
      es: (f) => `El valor 1 no se guarda nunca (${f.levelOne} filas en la muestra), porque L0 y L1 aparecen siempre juntos. Abrir un paso no significa leerlo, y no abrir la corrección no significa que el estudiante resolviera el problema. Un estudiante puede abrir pasos más tarde, al reabrir la explicación desde el historial.`,
    },
    teacher: T(
      'If a student opens the fix for almost every question, talk about using the first two steps first. If the whole class needs the fix for one task, the task may need more support in class.',
      'Bir öğrenci neredeyse her soruda düzeltmeyi açıyorsa, önce ilk iki adımı kullanmayı konuşun. Tüm sınıf bir görev için düzeltmeye ihtiyaç duyuyorsa, o görev derste daha fazla destek gerektirebilir.',
      'Si un estudiante abre la corrección en casi todas las preguntas, hable con él sobre usar primero los dos primeros pasos. Si toda la clase necesita la corrección en una tarea, puede que esa tarea necesite más apoyo en clase.',
    ),
  },

  // ------------------------------------------------------------------ level timing
  {
    slug: 'level-timing', category: 'ladder',
    items: ['event.level_reached', 'event.level_reached.level', 'event.level_reached.isEscalation', 'event.level_reached.msSinceCreated', 'metric.reading_to_rule_median', 'metric.reading_to_fix_median'],
    title: T('Opening the hint levels', 'İpucu adımlarını açma', 'Apertura de los niveles de la pista'),
    what: {
      heading: T('What does the timing of the hint levels show?', 'İpucu adımlarının zamanlaması neyi gösterir?', '¿Qué muestra el momento en que se abren los niveles?'),
      text: T(
        'Each time a student opens the rule (L2) or the fix (L3), the server stores an event with the time since the question was asked. The events show whether a student read the first steps first or clicked straight through to the fix.',
        'Öğrenci her kural (L2) ya da düzeltme (L3) açtığında sunucu, sorunun sorulmasından bu yana geçen süreyle birlikte bir olay kaydeder. Olaylar, öğrencinin önce ilk adımları mı okuduğunu, yoksa doğrudan düzeltmeye mi tıkladığını gösterir.',
        'Cada vez que el estudiante abre la regla (L2) o la corrección (L3), el servidor guarda un evento con el tiempo transcurrido desde la pregunta. Los eventos muestran si el estudiante leyó primero los primeros pasos o pasó directamente a la corrección.',
      ),
    },
    example: {
      en: (f) => `S07 asked about "${f.title}". S07 opened the rule ${f.toRuleSec} seconds after asking and the fix ${f.toFixSec} seconds after asking. The class medians were ${f.classToRuleSec} and ${f.classToFixSec} seconds. The timeline below shows what else happened after this question.`,
      tr: (f) => `S07 "${f.title}" hakkında soru sordu. S07 kuralı sorudan ${f.toRuleSec} saniye, düzeltmeyi ise ${f.toFixSec} saniye sonra açtı. Sınıfın ortancaları ${f.classToRuleSec} ve ${f.classToFixSec} saniye. Aşağıdaki zaman çizelgesi bu sorudan sonra başka neler olduğunu gösteriyor.`,
      es: (f) => `S07 preguntó por «${f.title}». Abrió la regla ${f.toRuleSec} segundos después de preguntar y la corrección ${f.toFixSec} segundos después. Las medianas de la clase fueron ${f.classToRuleSec} y ${f.classToFixSec} segundos. La línea de tiempo de abajo muestra qué más pasó después de esta pregunta.`,
    },
    takeaway: T('One question, many traces: the levels, the return to the code, the first edit and the moment the error went away.', 'Tek bir soru, birçok iz: adımlar, koda dönüş, ilk düzenleme ve hatanın ortadan kalktığı an.', 'Una sola pregunta, muchas huellas: los niveles, la vuelta al código, la primera edición y el momento en que el error desapareció.'),
    purpose: {
      teacher: T('Do students read the first steps, or do they jump to the answer?', 'Öğrenciler ilk adımları okuyor mu, yoksa yanıta mı atlıyor?', '¿Leen los estudiantes los primeros pasos o saltan a la respuesta?'),
      researcher: T('How much time do students spend on each step before they open the next one?', 'Öğrenciler bir sonrakini açmadan önce her adımda ne kadar zaman geçiriyor?', '¿Cuánto tiempo pasan los estudiantes en cada paso antes de abrir el siguiente?'),
    },
    raw: {
      intro: T('The two level events of the question in the timeline.', 'Zaman çizelgesindeki sorunun iki adım olayı.', 'Los dos eventos de nivel de la pregunta de la línea de tiempo.'),
      snippets: [{ name: 'level-timing', caption: tbl('events', false) }],
    },
    formulas: [
      {
        id: 'event.level_reached.msSinceCreated',
        heading: T('How the time is computed', 'Süre nasıl hesaplanır', 'Cómo se calcula el tiempo'),
        text: T('Server time when the step was opened minus the time the question was stored, in milliseconds. The same step is stored only once per question.', 'Adımın açıldığı sunucu zamanı eksi sorunun kaydedildiği zaman, milisaniye olarak. Aynı adım bir soru için yalnızca bir kez saklanır.', 'Hora del servidor al abrir el paso menos el momento en que se guardó la pregunta, en milisegundos. El mismo paso se guarda una sola vez por pregunta.'),
      },
      {
        id: 'metric.reading_to_rule_median',
        heading: T('Opened L2 after (median, dashboard)', 'L2 açılma süresi (medyan, panel)', 'Abrió L2 tras (mediana, panel)'),
        text: T('Median of the times to open L2 over the level events of the questions asked in the period.', 'Dönemde sorulan soruların adım olayları üzerinden L2 açılma sürelerinin ortancası.', 'Mediana de los tiempos hasta abrir L2 en los eventos de nivel de las preguntas del periodo.'),
      },
      {
        id: 'metric.reading_to_fix_median',
        heading: T('Opened L3 after (median, dashboard)', 'L3 açılma süresi (medyan, panel)', 'Abrió L3 tras (mediana, panel)'),
        text: T('The same median for L3.', 'L3 için aynı ortanca.', 'La misma mediana para L3.'),
      },
    ],
    research: {
      stage: DURING,
      spss: T('`median_s_to_rule` and `median_s_to_fix` per student, over the questions where the step was opened.', 'Adımın açıldığı sorular üzerinden öğrenci başına `median_s_to_rule` ve `median_s_to_fix`.', '`median_s_to_rule` y `median_s_to_fix` por estudiante, en las preguntas en que se abrió el paso.'),
      analysis: T('Compare the time to the fix in early and late weeks, or use it as a predictor of the similarity of the next edit to the fix.', 'Düzeltmeye kadar geçen süreyi erken ve geç haftalarda karşılaştırın ya da bir sonraki düzenlemenin düzeltmeye benzerliğinin yordayıcısı olarak kullanın.', 'Compare el tiempo hasta la corrección en las primeras y las últimas semanas, o úselo como predictor del parecido entre la siguiente edición y la corrección.'),
      sentence: T('The time from the request to the opening of each deeper level was recorded on the server.', 'İstekten her derin adımın açılmasına kadar geçen süre sunucuda kaydedilmiştir.', 'El tiempo desde la petición hasta la apertura de cada nivel más profundo se registró en el servidor.'),
    },
    rq: { 'metric.reading_to_rule_median': { RQ2: 'descriptive' }, 'metric.reading_to_fix_median': { RQ2: 'descriptive' } },
    limits: T(
      'The time is measured on the server, so it includes network delay. A long time can mean careful reading, but also that the panel was hidden. When a student opens a step on an explanation reopened days later, the time is very long.',
      'Süre sunucuda ölçülür, bu yüzden ağ gecikmesini de içerir. Uzun bir süre dikkatli okuma anlamına gelebilir, ama panelin gizli olduğu anlamına da gelebilir. Öğrenci günler sonra yeniden açılan bir açıklamada bir adım açarsa süre çok uzun olur.',
      'El tiempo se mide en el servidor, así que incluye el retraso de la red. Un tiempo largo puede indicar una lectura atenta, pero también que el panel estaba oculto. Si un estudiante abre un paso en una explicación reabierta días después, el tiempo es muy largo.',
    ),
    teacher: T(
      'If students open the fix within a few seconds, show in class how to use the Locate question (L1) to find the line themselves.',
      'Öğrenciler düzeltmeyi birkaç saniye içinde açıyorsa, derste satırı kendileri bulmak için Bul sorusunu (L1) nasıl kullanacaklarını gösterin.',
      'Si los estudiantes abren la corrección en pocos segundos, muestre en clase cómo usar la pregunta de Ubicar (L1) para encontrar la línea por sí mismos.',
    ),
  },

  // ------------------------------------------------------------------ explanation
  {
    slug: 'explanation', category: 'ladder',
    items: ['interactions.title', 'interactions.ladder_payload'],
    title: T('The explanation', 'Açıklama', 'La explicación'),
    what: {
      heading: T('What is stored about the explanation?', 'Açıklama hakkında ne saklanır?', '¿Qué se guarda de la explicación?'),
      text: T(
        'For every question the system stores the full answer of the AI model: a short title, the concept, the four steps and two flags (confidence and "needs more context"). The student can read it again from the history list.',
        'Sistem her soru için yapay zekâ modelinin yanıtının tamamını saklar: kısa bir başlık, kavram, dört adım ve iki işaret (güven ve "daha fazla bağlam gerekli"). Öğrenci onu geçmiş listesinden yeniden okuyabilir.',
        'Para cada pregunta, el sistema guarda la respuesta completa del modelo de IA: un título breve, el concepto, los cuatro pasos y dos indicadores (confianza y «necesita más contexto»). El estudiante puede volver a leerla desde el historial.',
      ),
    },
    example: {
      en: (f) => `S07's question got the title "${f.title}". The answer below is the synthetic text used for every row of the sample. In real data every answer is different and written in the feedback language.`,
      tr: (f) => `S07’nin sorusu "${f.title}" başlığını aldı. Aşağıdaki yanıt, örnekteki her satır için kullanılan sentetik metindir. Gerçek veride her yanıt farklıdır ve geri bildirim dilinde yazılır.`,
      es: (f) => `La pregunta de S07 recibió el título «${f.title}». La respuesta de abajo es el texto sintético que se usa en todas las filas de la muestra. En los datos reales cada respuesta es distinta y está escrita en el idioma de las explicaciones.`,
    },
    takeaway: T('The four steps go from understanding the message to the concrete change.', 'Dört adım, mesajı anlamaktan somut değişikliğe doğru ilerler.', 'Los cuatro pasos van de entender el mensaje al cambio concreto.'),
    purpose: {
      teacher: T('What exactly did the student read?', 'Öğrenci tam olarak ne okudu?', '¿Qué leyó exactamente el estudiante?'),
      researcher: T('What was the quality and content of the feedback the student received?', 'Öğrencinin aldığı geri bildirimin niteliği ve içeriği neydi?', '¿Cuál fue la calidad y el contenido de la retroalimentación que recibió el estudiante?'),
    },
    raw: {
      intro: T('The title, the concept and the stored answer of the question above.', 'Yukarıdaki sorunun başlığı, kavramı ve saklanan yanıtı.', 'El título, el concepto y la respuesta guardada de la pregunta de arriba.'),
      snippets: [{ name: 'explanation', caption: tbl('interactions') }],
    },
    research: {
      stage: T('in the analysis (quality of the feedback)', 'analizde (geri bildirimin niteliği)', 'en el análisis (calidad de la retroalimentación)'),
      spss: T('The text itself does not go into SPSS. Rate a random sample of answers with a rubric, and add the rubric scores per question.', 'Metnin kendisi SPSS’e girmez. Rastgele bir yanıt örneklemini bir dereceli puanlama anahtarıyla değerlendirin ve puanları soru başına ekleyin.', 'El texto en sí no va a SPSS. Valore una muestra aleatoria de respuestas con una rúbrica y añada las puntuaciones por pregunta.'),
      analysis: T('Check the accuracy of the answers with two raters and report the agreement (Cohen\'s kappa).', 'Yanıtların doğruluğunu iki değerlendiriciyle kontrol edin ve uyumu raporlayın (Cohen kappa).', 'Compruebe la exactitud de las respuestas con dos evaluadores e informe del acuerdo (kappa de Cohen).'),
      sentence: T('A random sample of the generated explanations was rated for accuracy and adherence to the four-step format by two researchers.', 'Üretilen açıklamalardan rastgele bir örneklem, doğruluk ve dört adımlı biçime uyum açısından iki araştırmacı tarafından değerlendirilmiştir.', 'Dos investigadores valoraron una muestra aleatoria de las explicaciones generadas según su exactitud y su ajuste al formato de cuatro pasos.'),
    },
    limits: {
      en: (f) => `The text can quote parts of the student's code. When two hard checks fail twice (wrong language, or private notes leaked), L2 and L3 are stored empty (${f.degraded} answers in the sample). Answers from the cache were written for another student's identical question.`,
      tr: (f) => `Metin öğrencinin kodundan parçalar alıntılayabilir. İki katı denetim (yanlış dil ya da gizli notların sızması) iki kez başarısız olursa L2 ve L3 boş saklanır (örnekte ${f.degraded} yanıt). Önbellekten gelen yanıtlar, başka bir öğrencinin aynı sorusu için yazılmıştır.`,
      es: (f) => `El texto puede citar partes del código del estudiante. Cuando dos comprobaciones estrictas fallan dos veces (idioma incorrecto o filtración de las notas privadas), L2 y L3 se guardan vacíos (${f.degraded} respuestas en la muestra). Las respuestas de la caché se escribieron para una pregunta idéntica de otro estudiante.`,
    },
    teacher: T(
      'When a student says an explanation was confusing, open the question in the dashboard and read the four steps together. It is a quick way to see where the misunderstanding started.',
      'Bir öğrenci açıklamanın kafa karıştırıcı olduğunu söylediğinde, soruyu panelde açın ve dört adımı birlikte okuyun. Yanlış anlamanın nerede başladığını görmenin hızlı bir yoludur.',
      'Cuando un estudiante diga que una explicación fue confusa, abra la pregunta en el panel y lean juntos los cuatro pasos. Es una forma rápida de ver dónde empezó el malentendido.',
    ),
  },
];
