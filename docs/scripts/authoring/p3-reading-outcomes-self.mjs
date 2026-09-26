import { dec, pc } from './gen.mjs';

const T = (en, tr, es) => ({ en, tr, es });
const code = (s) => `\`${s}\``;
const some = T('(some columns)', '(bazı sütunlar)', '(algunas columnas)');
const tbl = (name, part = true) => ({ en: `${code(name)}${part ? ` ${some.en}` : ''}`, tr: `${code(name)}${part ? ` ${some.tr}` : ''}`, es: `${code(name)}${part ? ` ${some.es}` : ''}` });
const DURING = T('during the intervention and in the analysis', 'müdahale sırasında ve analizde', 'durante la intervención y en el análisis');
const ANALYSIS = T('in the analysis', 'analizde', 'en el análisis');
const EV = tbl('events', false);

export default [
  // ------------------------------------------------------------------ time on screen
  {
    slug: 'time-on-screen', category: 'reading',
    items: ['event.explanation_visibility', 'event.explanation_visibility.visibleMs', 'event.explanation_visibility.visibleAtDelivery', 'metric.reading_on_screen_pct', 'metric.reading_visible_median'],
    title: T('Time on screen', 'Ekranda kalma süresi', 'Tiempo en pantalla'),
    what: {
      heading: T('What is the time on screen?', 'Ekranda kalma süresi nedir?', '¿Qué es el tiempo en pantalla?'),
      text: T(
        'The time on screen is how long the panel of the extension was visible while an explanation was the current one. The event also says whether the panel was visible when the explanation arrived.',
        'Ekranda kalma süresi, bir açıklama güncel açıklamayken eklenti panelinin ne kadar süre görünür olduğudur. Olay ayrıca açıklama geldiğinde panelin görünür olup olmadığını da söyler.',
        'El tiempo en pantalla es cuánto tiempo estuvo visible el panel de la extensión mientras una explicación era la actual. El evento indica además si el panel estaba visible cuando llegó la explicación.',
      ),
    },
    example: {
      en: (f) => `For S07 the median time on screen was ${f.featuredMedianSec} seconds, and for the class ${f.classMedianSec} seconds. The time ends when the next explanation replaces the current one, or when VS Code closes.`,
      tr: (f) => `S07 için ortanca ekranda kalma süresi ${f.featuredMedianSec} saniye, sınıf için ${f.classMedianSec} saniye oldu. Süre, bir sonraki açıklama güncel açıklamanın yerini aldığında ya da VS Code kapandığında biter.`,
      es: (f) => `Para S07, la mediana del tiempo en pantalla fue de ${f.featuredMedianSec} segundos, y para la clase de ${f.classMedianSec}. El tiempo termina cuando la siguiente explicación sustituye a la actual o cuando se cierra VS Code.`,
    },
    takeaway: T('Most explanations stay on screen between 10 seconds and 2 minutes. S07 is in the 30–60 s group.', 'Açıklamaların çoğu 10 saniye ile 2 dakika arasında ekranda kalıyor. S07 30–60 sn grubunda.', 'La mayoría de las explicaciones quedan en pantalla entre 10 segundos y 2 minutos. S07 está en el grupo de 30–60 s.'),
    purpose: {
      teacher: T('Do students actually look at the explanations?', 'Öğrenciler açıklamalara gerçekten bakıyor mu?', '¿Miran realmente los estudiantes las explicaciones?'),
      researcher: T('Can the other reading measures be trusted, that is, was the panel visible at all?', 'Diğer okuma ölçülerine güvenilebilir mi, yani panel gerçekten görünür müydü?', '¿Se puede confiar en las demás medidas de lectura, es decir, estaba visible el panel?'),
    },
    raw: {
      intro: T('One event of S07.', 'S07’nin bir olayı.', 'Un evento de S07.'),
      snippets: [{ name: 'time-on-screen', caption: EV }],
    },
    formulas: [
      {
        id: 'event.explanation_visibility.visibleMs',
        heading: T('How the time is measured', 'Süre nasıl ölçülür', 'Cómo se mide el tiempo'),
        text: T('The sum of the periods in which the panel view was visible while this explanation was the current one, in milliseconds.', 'Bu açıklama güncelken panel görünümünün görünür olduğu sürelerin toplamı, milisaniye olarak.', 'La suma de los periodos en que la vista del panel estuvo visible mientras esta explicación era la actual, en milisegundos.'),
      },
      {
        id: 'metric.reading_on_screen_pct',
        heading: T('On screen when it arrived (dashboard)', 'Geldiğinde ekrandaydı (panel)', 'En pantalla al llegar (panel)'),
        text: {
          en: (f) => `Questions with an event where the panel was visible at delivery, divided by questions with any such event. In the sample: ${pc(f.onScreenPct, 'en')}.`,
          tr: (f) => `Açıklama geldiğinde panelin görünür olduğu olaya sahip sorular, böyle bir olayı olan tüm sorulara bölünür. Örnekte: ${pc(f.onScreenPct, 'tr')}.`,
          es: (f) => `Preguntas con un evento en que el panel estaba visible al llegar, divididas entre las preguntas con algún evento de este tipo. En la muestra: ${pc(f.onScreenPct, 'es')}.`,
        },
      },
      {
        id: 'metric.reading_visible_median',
        heading: T('Time on screen (median, dashboard)', 'Ekranda kalma süresi (medyan, panel)', 'Tiempo en pantalla (mediana, panel)'),
        text: T('Median of the time on screen over the events of the questions asked in the period.', 'Dönemde sorulan soruların olayları üzerinden ekranda kalma süresinin ortancası.', 'Mediana del tiempo en pantalla en los eventos de las preguntas del periodo.'),
      },
    ],
    research: {
      stage: DURING,
      spss: T('`median_visible_s` per student, and `on_screen_share` as the share of explanations visible at delivery.', 'Öğrenci başına `median_visible_s` ve geldiğinde görünür olan açıklamaların payı olarak `on_screen_share`.', '`median_visible_s` por estudiante, y `on_screen_share` como proporción de explicaciones visibles al llegar.'),
      analysis: T('Use it to filter or weight the other reading measures, and correlate the median with hint depth.', 'Diğer okuma ölçülerini süzmek ya da ağırlıklandırmak için kullanın ve ortancayı ipucu derinliğiyle ilişkilendirin.', 'Úselo para filtrar o ponderar las demás medidas de lectura y correlacione la mediana con la profundidad de las pistas.'),
      sentence: T('The time the feedback panel was visible was recorded for each explanation as an upper bound of reading time.', 'Geri bildirim panelinin görünür olduğu süre, her açıklama için okuma süresinin üst sınırı olarak kaydedilmiştir.', 'Se registró el tiempo que el panel de retroalimentación estuvo visible en cada explicación como límite superior del tiempo de lectura.'),
    },
    rq: { 'event.explanation_visibility.visibleMs': { RQ2: 'descriptive' }, 'metric.reading_visible_median': { RQ2: 'descriptive' } },
    limits: {
      en: (f) => `Visible does not mean read: the student may look at the code while the panel is open. The event of the last explanation before VS Code closes is often lost, so ${f.measured} of ${f.explanations} explanations have a value in the sample. The time is an upper bound of reading.`,
      tr: (f) => `Görünür olmak okunmuş olmak demek değildir: panel açıkken öğrenci koda bakıyor olabilir. VS Code kapanmadan önceki son açıklamanın olayı çoğu zaman kaybolur. Bu yüzden örnekte ${f.explanations} açıklamanın ${f.measured} tanesinin değeri var. Süre, okumanın üst sınırıdır.`,
      es: (f) => `Visible no significa leído: el estudiante puede mirar el código con el panel abierto. El evento de la última explicación antes de cerrar VS Code se pierde a menudo, así que en la muestra ${f.measured} de ${f.explanations} explicaciones tienen valor. El tiempo es un límite superior de la lectura.`,
    },
    teacher: T(
      'If explanations disappear from the screen after a few seconds, show students where the panel is and that it can stay open next to the code.',
      'Açıklamalar birkaç saniye sonra ekrandan kayboluyorsa, öğrencilere panelin nerede olduğunu ve kodun yanında açık kalabileceğini gösterin.',
      'Si las explicaciones desaparecen de la pantalla a los pocos segundos, muestre a los estudiantes dónde está el panel y que puede quedarse abierto junto al código.',
    ),
  },

  // ------------------------------------------------------------------ back to code
  {
    slug: 'back-to-code', category: 'reading',
    items: ['event.returned_to_code', 'event.returned_to_code.level', 'event.returned_to_code.msToReturn', 'metric.reading_back_median'],
    title: T('Went back to the code', 'Koda döndü', 'Volvió al código'),
    what: {
      heading: T('What is the return to the code?', 'Koda dönüş nedir?', '¿Qué es la vuelta al código?'),
      text: T(
        'After an explanation or a new step appears, the extension waits for the first activity in the editor: a change in the text or a move of the cursor. The event stores how long this took and which step was on screen.',
        'Bir açıklama ya da yeni bir adım göründükten sonra eklenti editördeki ilk etkinliği bekler: metinde bir değişiklik ya da imlecin hareketi. Olay bunun ne kadar sürdüğünü ve ekranda hangi adımın olduğunu saklar.',
        'Después de que aparece una explicación o un paso nuevo, la extensión espera la primera actividad en el editor: un cambio en el texto o un movimiento del cursor. El evento guarda cuánto tardó y qué paso estaba en pantalla.',
      ),
    },
    example: {
      en: (f) => `S07 went back to the code after a median of ${f.featuredMedianSec} seconds, a little later than the class (${f.classMedianSec} seconds). After the fix (L3), S07 returned quickly, probably to type the change.`,
      tr: (f) => `S07 ortanca ${f.featuredMedianSec} saniye sonra koda döndü, sınıftan biraz daha geç (${f.classMedianSec} saniye). Düzeltmeden (L3) sonra S07 hızlı döndü, büyük olasılıkla değişikliği yazmak için.`,
      es: (f) => `S07 volvió al código tras una mediana de ${f.featuredMedianSec} segundos, un poco más tarde que la clase (${f.classMedianSec} segundos). Tras la corrección (L3), S07 volvió enseguida, probablemente para escribir el cambio.`,
    },
    takeaway: T('The class goes back to the code about 15 to 20 seconds after a step. S07 takes longer after L0–L1 and L2 and returns fast after the fix.', 'Sınıf bir adımdan yaklaşık 15–20 saniye sonra koda dönüyor. S07, L0–L1 ve L2’den sonra daha uzun süre bekliyor, düzeltmeden sonra ise hızlı dönüyor.', 'La clase vuelve al código unos 15 a 20 segundos después de un paso. S07 tarda más tras L0–L1 y L2 y vuelve rápido tras la corrección.'),
    purpose: {
      teacher: T('Do students stop to read, or do they go back to typing at once?', 'Öğrenciler okumak için duruyor mu, yoksa hemen yazmaya mı dönüyor?', '¿Se detienen los estudiantes a leer o vuelven a escribir enseguida?'),
      researcher: T('How long do students engage with each step before acting on it?', 'Öğrenciler bir adıma göre davranmadan önce onunla ne kadar ilgileniyor?', '¿Cuánto tiempo dedican los estudiantes a cada paso antes de actuar?'),
    },
    raw: {
      intro: T('One event of S07.', 'S07’nin bir olayı.', 'Un evento de S07.'),
      snippets: [{ name: 'back-to-code', caption: EV }],
    },
    formulas: [
      {
        id: 'event.returned_to_code.msToReturn',
        heading: T('How the time is measured', 'Süre nasıl ölçülür', 'Cómo se mide el tiempo'),
        text: T('Time from the moment a step became visible to the first text change or cursor move in any editor, in milliseconds. After 10 minutes without activity the event becomes "Left without acting" instead.', 'Bir adımın görünür olduğu andan herhangi bir editördeki ilk metin değişikliğine ya da imleç hareketine kadar geçen süre, milisaniye olarak. 10 dakika etkinlik olmazsa olay bunun yerine "Bir şey yapmadan ayrıldı" olur.', 'Tiempo desde que un paso se hizo visible hasta el primer cambio de texto o movimiento del cursor en cualquier editor, en milisegundos. Tras 10 minutos sin actividad, el evento pasa a ser «Se fue sin actuar».'),
      },
      {
        id: 'metric.reading_back_median',
        heading: T('Back to the code after (median, dashboard)', 'Koda dönüş süresi (medyan, panel)', 'Volvió al código tras (mediana, panel)'),
        text: T('Median of the return times over the events of the questions asked in the period.', 'Dönemde sorulan soruların olayları üzerinden dönüş sürelerinin ortancası.', 'Mediana de los tiempos de vuelta en los eventos de las preguntas del periodo.'),
      },
    ],
    research: {
      stage: DURING,
      spss: T('`median_return_s` per student, and per step if you study reading at each level.', 'Öğrenci başına `median_return_s`, her düzeyde okumayı inceliyorsanız adım başına da.', '`median_return_s` por estudiante, y por paso si estudia la lectura en cada nivel.'),
      analysis: T('Compare the return time after L0–L1 between students with high and low learning gain (Mann–Whitney U).', 'L0–L1 sonrasındaki dönüş süresini yüksek ve düşük öğrenme kazancı gösteren öğrenciler arasında karşılaştırın (Mann–Whitney U).', 'Compare el tiempo de vuelta tras L0–L1 entre estudiantes con ganancia de aprendizaje alta y baja (U de Mann–Whitney).'),
      sentence: T('The time between the display of each feedback level and the first subsequent editor activity was used as an indicator of engagement with the feedback.', 'Her geri bildirim düzeyinin görünmesi ile editördeki ilk sonraki etkinlik arasındaki süre, geri bildirimle ilgilenmenin göstergesi olarak kullanılmıştır.', 'El tiempo entre la aparición de cada nivel de retroalimentación y la primera actividad posterior en el editor se usó como indicador de implicación con la retroalimentación.'),
    },
    rq: { 'event.returned_to_code.msToReturn': { RQ2: 'descriptive' }, 'metric.reading_back_median': { RQ2: 'descriptive' } },
    limits: T(
      'Any change or cursor move counts, also in another file or document, so a quick return can be accidental. A long time can be reading, thinking or a break. When a new step is opened before the return, only the last step is measured.',
      'Başka bir dosyada ya da belgede olsa bile her değişiklik ya da imleç hareketi sayılır. Bu yüzden hızlı bir dönüş rastlantısal olabilir. Uzun bir süre okuma, düşünme ya da mola olabilir. Dönüşten önce yeni bir adım açılırsa yalnızca son adım ölçülür.',
      'Cuenta cualquier cambio o movimiento del cursor, también en otro archivo o documento, así que una vuelta rápida puede ser casual. Un tiempo largo puede ser lectura, reflexión o una pausa. Si se abre un paso nuevo antes de volver, solo se mide el último paso.',
    ),
    teacher: T(
      'If students go back to typing within a few seconds after every step, ask them in class to say in one sentence what the explanation told them before they change the code.',
      'Öğrenciler her adımdan birkaç saniye sonra yazmaya dönüyorsa, derste kodu değiştirmeden önce açıklamanın onlara ne söylediğini tek bir cümleyle söylemelerini isteyin.',
      'Si los estudiantes vuelven a escribir pocos segundos después de cada paso, pídales en clase que digan en una frase qué les dijo la explicación antes de cambiar el código.',
    ),
  },

  // ------------------------------------------------------------------ left without acting
  {
    slug: 'left-without-acting', category: 'reading',
    items: ['event.feedback_abandoned', 'event.feedback_abandoned.level', 'event.feedback_abandoned.reason', 'metric.abandoned'],
    title: T('Left without acting', 'Bir şey yapmadan ayrıldı', 'Se fue sin actuar'),
    what: {
      heading: T('What does "left without acting" mean?', '"Bir şey yapmadan ayrıldı" ne demek?', '¿Qué significa «se fue sin actuar»?'),
      text: T(
        'The event is recorded when a student does nothing in the editor for 10 minutes after an explanation or a step appeared, or when VS Code closes first. It is the opposite of "Went back to the code".',
        'Bu olay, öğrenci bir açıklama ya da adım göründükten sonra 10 dakika boyunca editörde hiçbir şey yapmadığında ya da VS Code daha önce kapandığında kaydedilir. "Koda döndü" olayının tersidir.',
        'El evento se registra cuando el estudiante no hace nada en el editor durante 10 minutos después de que apareciera una explicación o un paso, o cuando VS Code se cierra antes. Es lo contrario de «Volvió al código».',
      ),
    },
    example: {
      en: (f) => `S07 left without acting after ${f.featuredAbandoned} explanations. In each case ten minutes passed without any activity in the editor.`,
      tr: (f) => `S07 ${f.featuredAbandoned} açıklamadan sonra bir şey yapmadan ayrıldı. Her seferinde editörde hiçbir etkinlik olmadan on dakika geçti.`,
      es: (f) => `S07 se fue sin actuar después de ${f.featuredAbandoned} explicaciones. En cada caso pasaron diez minutos sin actividad en el editor.`,
    },
    takeaway: {
      en: (f) => `In the class, ${pc(f.abandonedPct, 'en')} of the explanations were left without acting, mostly after 10 minutes without activity.`,
      tr: (f) => `Sınıfta açıklamaların ${pc(f.abandonedPct, 'tr')} kadarından sonra bir şey yapılmadan ayrılındı. Çoğu, 10 dakika hareketsizlikten sonra.`,
      es: (f) => `En la clase, el ${pc(f.abandonedPct, 'es')} de las explicaciones se quedó sin acción, sobre todo tras 10 minutos sin actividad.`,
    },
    purpose: {
      teacher: T('After which explanations did students stop working?', 'Öğrenciler hangi açıklamalardan sonra çalışmayı bıraktı?', '¿Después de qué explicaciones dejaron de trabajar los estudiantes?'),
      researcher: T('How often is feedback read and then dropped, and does this relate to the hint depth or the rating?', 'Geri bildirim ne sıklıkla okunup bırakılıyor ve bu, ipucu derinliği ya da değerlendirmeyle ilişkili mi?', '¿Con qué frecuencia se lee la retroalimentación y luego se abandona, y se relaciona con la profundidad o con la valoración?'),
    },
    raw: {
      intro: T('One event from the sample.', 'Örnekten bir olay.', 'Un evento de la muestra.'),
      snippets: [{ name: 'left-without-acting', caption: EV }],
    },
    formulas: [{
      id: 'metric.abandoned',
      heading: T('Left without acting (dashboard)', 'Bir şey yapmadan ayrıldı (panel)', 'Se fue sin actuar (panel)'),
      text: T('Distinct questions of the period with at least one such event.', 'Dönemde en az bir böyle olayı olan farklı sorular.', 'Preguntas distintas del periodo con al menos un evento de este tipo.'),
    }],
    research: {
      stage: DURING,
      spss: T('`abandon_share` = questions left without acting ÷ all questions, per student.', 'Öğrenci başına `abandon_share` = bir şey yapılmadan bırakılan sorular ÷ tüm sorular.', '`abandon_share` = preguntas abandonadas ÷ todas las preguntas, por estudiante.'),
      analysis: T('Compare the rate between rated-helpful and rated-unhelpful explanations (chi-square test).', 'Oranı faydalı ve faydalı değil olarak değerlendirilen açıklamalar arasında karşılaştırın (ki-kare testi).', 'Compare la tasa entre explicaciones valoradas como útiles y no útiles (prueba de chi cuadrado).'),
      sentence: T('Explanations followed by ten minutes without editor activity, or by the end of the session, were coded as abandoned.', 'Ardından on dakika boyunca editör etkinliği olmayan ya da oturumun sona erdiği açıklamalar bırakılmış olarak kodlanmıştır.', 'Las explicaciones seguidas de diez minutos sin actividad en el editor, o del fin de la sesión, se codificaron como abandonadas.'),
    },
    rq: { 'metric.abandoned': { RQ2: 'descriptive' } },
    limits: T(
      'A student can read the explanation and think about it for more than ten minutes, or work on paper. "VS Code closed" is sent during shutdown and is often lost. The event says nothing about why the student stopped.',
      'Öğrenci açıklamayı okuyup on dakikadan uzun süre düşünebilir ya da kâğıt üzerinde çalışabilir. "VS Code kapandı" kapanma sırasında gönderilir ve çoğu zaman kaybolur. Olay, öğrencinin neden durduğu hakkında bir şey söylemez.',
      'Un estudiante puede leer la explicación y pensar en ella más de diez minutos, o trabajar en papel. «VS Code se cerró» se envía durante el cierre y a menudo se pierde. El evento no dice nada sobre por qué el estudiante se detuvo.',
    ),
    teacher: T(
      'Look at the questions that were left without acting near the end of the lab. They can show a task that students gave up on.',
      'Laboratuvarın sonuna doğru bir şey yapılmadan bırakılan sorulara bakın. Öğrencilerin vazgeçtiği bir görevi gösterebilirler.',
      'Mire las preguntas abandonadas cerca del final del laboratorio. Pueden señalar una tarea que los estudiantes dejaron por imposible.',
    ),
  },

  // ------------------------------------------------------------------ edit after fix
  {
    slug: 'edit-after-fix', category: 'reading',
    items: ['event.post_feedback_edit', 'event.post_feedback_edit.overlapRatio', 'event.post_feedback_edit.editedLineDistance', 'metric.after_edited', 'metric.after_on_line_pct', 'metric.after_overlap_avg'],
    title: T('First edit after the fix', 'Çözümden sonraki ilk düzenleme', 'Primera edición tras la corrección'),
    what: {
      heading: T('What is the first edit after the fix?', 'Çözümden sonraki ilk düzenleme nedir?', '¿Qué es la primera edición tras la corrección?'),
      text: T(
        'When a student opens the fix (L3), the extension watches the next edit in the same file for five minutes. It stores two numbers: how similar the new text is to the suggested fix, and how far from the pointed line the edit landed. The text itself is not sent.',
        'Öğrenci düzeltmeyi (L3) açtığında eklenti aynı dosyadaki bir sonraki düzenlemeyi beş dakika boyunca izler. İki sayı saklar: yeni metnin önerilen düzeltmeye ne kadar benzediği ve düzenlemenin gösterilen satırdan ne kadar uzağa düştüğü. Metnin kendisi gönderilmez.',
        'Cuando el estudiante abre la corrección (L3), la extensión observa la siguiente edición en el mismo archivo durante cinco minutos. Guarda dos números: cuánto se parece el texto nuevo a la corrección sugerida y a qué distancia de la línea señalada cayó la edición. El texto en sí no se envía.',
      ),
    },
    example: {
      en: (f) => `S07 edited the code after ${f.featuredEdited} fixes. The average similarity of the new text to the suggested fix was ${f.featuredOverlapPct}%. In the class the average was ${f.overlapPct}%, and ${pc(f.onLinePct, 'en')} of the edits landed within two lines of the pointed line.`,
      tr: (f) => `S07 ${f.featuredEdited} düzeltmeden sonra kodu düzenledi. Yeni metnin önerilen düzeltmeye ortalama benzerliği %${f.featuredOverlapPct} oldu. Sınıfta ortalama %${f.overlapPct} oldu ve düzenlemelerin ${pc(f.onLinePct, 'tr')} kadarı gösterilen satıra iki satır mesafede kaldı.`,
      es: (f) => `S07 editó el código después de ${f.featuredEdited} correcciones. El parecido medio del texto nuevo con la corrección sugerida fue del ${f.featuredOverlapPct}%. En la clase la media fue del ${f.overlapPct}%, y el ${pc(f.onLinePct, 'es')} de las ediciones cayó a dos líneas o menos de la línea señalada.`,
    },
    takeaway: T('Most first edits have a similarity between 0.4 and 0.8 to the suggested fix. S07 is in the 0.6–0.8 group.', 'İlk düzenlemelerin çoğunun önerilen düzeltmeye benzerliği 0,4 ile 0,8 arasında. S07 0,6–0,8 grubunda.', 'La mayoría de las primeras ediciones tienen un parecido de entre 0,4 y 0,8 con la corrección sugerida. S07 está en el grupo 0,6–0,8.'),
    purpose: {
      teacher: T('Do students copy the fix as it is, or do they write their own change?', 'Öğrenciler düzeltmeyi olduğu gibi mi alıyor, yoksa kendi değişikliklerini mi yazıyor?', '¿Copian los estudiantes la corrección tal cual o escriben su propio cambio?'),
      researcher: T('How closely does the student\'s action follow the feedback?', 'Öğrencinin eylemi geri bildirimi ne kadar yakından izliyor?', '¿Hasta qué punto sigue la acción del estudiante a la retroalimentación?'),
    },
    raw: {
      intro: T('One event of S07.', 'S07’nin bir olayı.', 'Un evento de S07.'),
      snippets: [{ name: 'edit-after-fix', caption: EV }],
    },
    formulas: [
      {
        id: 'event.post_feedback_edit.overlapRatio',
        heading: T('How similarity is computed', 'Benzerlik nasıl hesaplanır', 'Cómo se calcula el parecido'),
        text: T('Jaccard overlap of the lower-case word tokens (letters, digits, underscore) of the inserted text and of the suggested change: shared tokens divided by all distinct tokens. 0 means nothing in common, 1 means the same tokens.', 'Eklenen metnin ve önerilen değişikliğin küçük harfli sözcük parçalarının (harf, rakam, alt çizgi) Jaccard örtüşmesi: ortak parçalar tüm farklı parçalara bölünür. 0 hiçbir ortaklık yok, 1 aynı parçalar demektir.', 'Solapamiento de Jaccard de los tokens de palabras en minúsculas (letras, dígitos, guion bajo) del texto insertado y del cambio sugerido: tokens compartidos divididos entre todos los tokens distintos. 0 significa nada en común y 1, los mismos tokens.'),
      },
      {
        id: 'event.post_feedback_edit.editedLineDistance',
        heading: T('How the distance is computed', 'Uzaklık nasıl hesaplanır', 'Cómo se calcula la distancia'),
        text: T('Lines from the line the explanation was about to the nearest edge of the changed range. 0 means an edit on the pointed line.', 'Açıklamanın ilgili olduğu satırdan değiştirilen aralığın en yakın kenarına kadar olan satır sayısı. 0, gösterilen satırda yapılan düzenleme demektir.', 'Líneas desde la línea de la explicación hasta el borde más cercano del rango cambiado. 0 significa una edición en la línea señalada.'),
      },
      {
        id: 'metric.after_edited',
        heading: T('Edited the code (dashboard)', 'Kodu düzenledi (panel)', 'Editó el código (panel)'),
        text: T('Distinct questions of the period with this event.', 'Dönemde bu olaya sahip farklı sorular.', 'Preguntas distintas del periodo con este evento.'),
      },
      {
        id: 'metric.after_on_line_pct',
        heading: T('Within 2 lines of the pointed line (dashboard)', 'Gösterilen satıra 2 satır mesafede (panel)', 'A 2 líneas o menos de la señalada (panel)'),
        text: T('Questions whose edit landed at most 2 lines away, divided by questions with this event.', 'Düzenlemesi en fazla 2 satır uzağa düşen sorular, bu olaya sahip sorulara bölünür.', 'Preguntas cuya edición cayó como máximo a 2 líneas, divididas entre las preguntas con este evento.'),
      },
      {
        id: 'metric.after_overlap_avg',
        heading: T('Similar to the suggested fix (average, dashboard)', 'Önerilen düzeltmeye benzerlik (ortalama, panel)', 'Parecido a la corrección sugerida (media, panel)'),
        text: T('100 times the mean similarity, rounded to a whole number.', 'Ortalama benzerliğin 100 katı, tam sayıya yuvarlanır.', '100 por la media del parecido, redondeado a un número entero.'),
      },
    ],
    research: {
      stage: DURING,
      spss: T('`mean_overlap` and `on_line_share` per student, over the questions that reached the fix.', 'Düzeltmeye ulaşan sorular üzerinden öğrenci başına `mean_overlap` ve `on_line_share`.', '`mean_overlap` y `on_line_share` por estudiante, en las preguntas que llegaron a la corrección.'),
      analysis: T('Correlate the mean similarity with the learning gain: high copying with low gain can point to passive use of the fix.', 'Ortalama benzerliği öğrenme kazancıyla ilişkilendirin: yüksek kopyalama ile düşük kazanç, düzeltmenin edilgen kullanımına işaret edebilir.', 'Correlacione el parecido medio con la ganancia de aprendizaje: mucha copia con poca ganancia puede indicar un uso pasivo de la corrección.'),
      sentence: T('After the fix was revealed, the similarity between the student\'s next edit and the suggested change was computed as a token-based Jaccard index.', 'Düzeltme gösterildikten sonra öğrencinin bir sonraki düzenlemesi ile önerilen değişiklik arasındaki benzerlik, sözcük parçalarına dayalı Jaccard indeksi olarak hesaplanmıştır.', 'Tras mostrar la corrección, el parecido entre la siguiente edición del estudiante y el cambio sugerido se calculó como un índice de Jaccard basado en tokens.'),
    },
    rq: { 'event.post_feedback_edit.overlapRatio': { RQ2: 'outcome', RQ4: 'predictor' }, 'metric.after_overlap_avg': { RQ2: 'descriptive' } },
    limits: T(
      'Only the first qualifying edit is measured, so a fix typed in several steps looks less similar than it is. A fix pasted into another file is not seen. Similarity of words does not show understanding: a student can type the fix without knowing why it works.',
      'Yalnızca ilk uygun düzenleme ölçülür. Bu yüzden birkaç adımda yazılan bir düzeltme olduğundan daha az benzer görünür. Başka bir dosyaya yapıştırılan bir düzeltme görülmez. Sözcük benzerliği anlamayı göstermez: öğrenci düzeltmenin neden işe yaradığını bilmeden de onu yazabilir.',
      'Solo se mide la primera edición válida, así que una corrección escrita en varios pasos parece menos parecida de lo que es. Una corrección pegada en otro archivo no se ve. El parecido de las palabras no muestra comprensión: un estudiante puede escribir la corrección sin saber por qué funciona.',
    ),
    teacher: T(
      'If a student\'s edits almost always match the fix word for word, ask them to explain the change in their own words before the next task.',
      'Bir öğrencinin düzenlemeleri neredeyse her zaman düzeltmeyle sözcüğü sözcüğüne örtüşüyorsa, bir sonraki görevden önce değişikliği kendi sözleriyle açıklamasını isteyin.',
      'Si las ediciones de un estudiante coinciden casi siempre palabra por palabra con la corrección, pídale que explique el cambio con sus palabras antes de la siguiente tarea.',
    ),
  },

  // ------------------------------------------------------------------ fix undone
  {
    slug: 'fix-undone', category: 'reading',
    items: ['event.fix_undone', 'metric.after_undone'],
    title: T('Undid the change', 'Değişikliği geri aldı', 'Deshizo el cambio'),
    what: {
      heading: T('What is an undone change?', 'Geri alınan değişiklik nedir?', '¿Qué es un cambio deshecho?'),
      text: T(
        'The event is recorded when the student uses Undo in the same file within two minutes after the first edit after the fix. It is a sign that the change did not work or was not understood.',
        'Bu olay, öğrenci düzeltmeden sonraki ilk düzenlemenin ardından iki dakika içinde aynı dosyada Geri Al komutunu kullandığında kaydedilir. Değişikliğin işe yaramadığının ya da anlaşılmadığının bir işaretidir.',
        'El evento se registra cuando el estudiante usa Deshacer en el mismo archivo en los dos minutos siguientes a la primera edición tras la corrección. Es una señal de que el cambio no funcionó o no se entendió.',
      ),
    },
    example: {
      en: (f) => `S07 undid a change after a fix ${f.featuredUndone} time in the eight weeks. In the whole class, ${f.undone} of the ${f.edited} edits after a fix were undone within two minutes.`,
      tr: (f) => `S07 sekiz haftada ${f.featuredUndone} kez bir düzeltmeden sonra yaptığı değişikliği geri aldı. Tüm sınıfta, düzeltmeden sonraki ${f.edited} düzenlemenin ${f.undone} tanesi iki dakika içinde geri alındı.`,
      es: (f) => `S07 deshizo ${f.featuredUndone} vez un cambio tras una corrección en las ocho semanas. En toda la clase, ${f.undone} de las ${f.edited} ediciones tras una corrección se deshicieron en menos de dos minutos.`,
    },
    takeaway: T('Undoing a fix is rare. A small table is enough to show it.', 'Bir düzeltmeyi geri almak seyrek görülüyor. Bunu göstermek için küçük bir tablo yeterli.', 'Deshacer una corrección es poco frecuente. Basta una tabla pequeña para mostrarlo.'),
    purpose: {
      teacher: T('Did a fix fail for some students?', 'Bir düzeltme bazı öğrenciler için işe yaramadı mı?', '¿Falló una corrección para algunos estudiantes?'),
      researcher: T('How often does acting on the fix end in a quick reversal?', 'Düzeltmeye göre davranmak ne sıklıkla hızlı bir geri almayla bitiyor?', '¿Con qué frecuencia actuar según la corrección termina en una marcha atrás rápida?'),
    },
    raw: {
      intro: T('One event from the sample. It has no payload.', 'Örnekten bir olay. Olay verisi boştur.', 'Un evento de la muestra. No tiene datos adicionales.'),
      snippets: [{ name: 'fix-undone', caption: EV }],
    },
    formulas: [{
      id: 'metric.after_undone',
      heading: T('Undid the change (dashboard)', 'Değişikliği geri aldı (panel)', 'Deshizo el cambio (panel)'),
      text: T('Distinct questions of the period with this event.', 'Dönemde bu olaya sahip farklı sorular.', 'Preguntas distintas del periodo con este evento.'),
    }],
    research: {
      stage: ANALYSIS,
      spss: T('`undo_count` per student. The numbers are small, so use them descriptively.', 'Öğrenci başına `undo_count`. Sayılar küçüktür, bu yüzden betimsel olarak kullanın.', '`undo_count` por estudiante. Los números son pequeños, así que úselos de forma descriptiva.'),
      analysis: T('Report the rate of undone fixes next to the self-reported outcome of the same questions.', 'Geri alınan düzeltmelerin oranını aynı soruların öz bildirimli sonucuyla birlikte raporlayın.', 'Informe de la tasa de correcciones deshechas junto al resultado autoinformado de las mismas preguntas.'),
      sentence: T('An undo in the same file within two minutes after the first post-feedback edit was logged as a reversal of the applied fix.', 'Geri bildirim sonrası ilk düzenlemeden sonraki iki dakika içinde aynı dosyada yapılan bir geri alma, uygulanan düzeltmenin geri çevrilmesi olarak kaydedilmiştir.', 'Un deshacer en el mismo archivo en los dos minutos posteriores a la primera edición tras la retroalimentación se registró como reversión de la corrección aplicada.'),
    },
    limits: T(
      'An undo can also remove a typo that was made while typing the fix. Only the first edit after the fix is watched. The event is rare, so it cannot carry an analysis alone.',
      'Bir geri alma, düzeltme yazılırken yapılan bir yazım hatasını da silebilir. Yalnızca düzeltmeden sonraki ilk düzenleme izlenir. Olay seyrektir, bu yüzden tek başına bir analizi taşıyamaz.',
      'Un deshacer también puede borrar una errata cometida al escribir la corrección. Solo se observa la primera edición tras la corrección. El evento es poco frecuente, así que no puede sostener un análisis por sí solo.',
    ),
    teacher: T(
      'When several students undo the same fix, the suggested change may not fit the task. Check the explanation in the dashboard.',
      'Birkaç öğrenci aynı düzeltmeyi geri alıyorsa, önerilen değişiklik göreve uymuyor olabilir. Açıklamayı panelde kontrol edin.',
      'Si varios estudiantes deshacen la misma corrección, puede que el cambio sugerido no encaje con la tarea. Revise la explicación en el panel.',
    ),
  },

  // ------------------------------------------------------------------ copied
  {
    slug: 'copied', category: 'reading',
    items: ['event.explanation_copied', 'event.explanation_copied.level', 'metric.copied'],
    title: T('Copied from the explanation', 'Açıklamadan kopyaladı', 'Copió de la explicación'),
    what: {
      heading: T('What is a copy from the explanation?', 'Açıklamadan kopyalama nedir?', '¿Qué es una copia de la explicación?'),
      text: T(
        'The event is recorded each time the student copies text from the explanation panel. It stores the step the selection started in (L0 to L3), but never the copied text.',
        'Bu olay, öğrenci açıklama panelinden her metin kopyaladığında kaydedilir. Seçimin başladığı adımı (L0–L3) saklar, ama kopyalanan metni hiçbir zaman saklamaz.',
        'El evento se registra cada vez que el estudiante copia texto del panel de la explicación. Guarda el paso en que empezó la selección (L0 a L3), pero nunca el texto copiado.',
      ),
    },
    example: {
      en: (f) => `S07 copied from ${f.featured} explanations. In the class, ${f.copyEvents} copies were recorded, and ${f.fromFix} of them came from the fix (L3).`,
      tr: (f) => `S07 ${f.featured} açıklamadan kopyaladı. Sınıfta ${f.copyEvents} kopyalama kaydedildi ve bunların ${f.fromFix} tanesi düzeltmeden (L3) geldi.`,
      es: (f) => `S07 copió de ${f.featured} explicaciones. En la clase se registraron ${f.copyEvents} copias, y ${f.fromFix} vinieron de la corrección (L3).`,
    },
    takeaway: T('Students copy most often from the fix (L3). Some copies start outside a step and have no level.', 'Öğrenciler en çok düzeltmeden (L3) kopyalıyor. Bazı kopyalamalar bir adımın dışında başlıyor ve düzeyi yok.', 'Los estudiantes copian sobre todo de la corrección (L3). Algunas copias empiezan fuera de un paso y no tienen nivel.'),
    purpose: {
      teacher: T('Do students take code from the explanations into their programs?', 'Öğrenciler açıklamalardaki kodu programlarına alıyor mu?', '¿Llevan los estudiantes código de las explicaciones a sus programas?'),
      researcher: T('How often is the answer taken directly, which the edit similarity may miss?', 'Yanıt, düzenleme benzerliğinin gözden kaçırabileceği biçimde ne sıklıkla doğrudan alınıyor?', '¿Con qué frecuencia se toma la respuesta directamente, algo que el parecido de las ediciones puede no detectar?'),
    },
    raw: {
      intro: T('One copy from the fix.', 'Düzeltmeden bir kopyalama.', 'Una copia de la corrección.'),
      snippets: [{ name: 'copied', caption: EV }],
    },
    formulas: [{
      id: 'metric.copied',
      heading: T('Copied from it (dashboard)', 'Kopyalandı (panel)', 'Copió de ella (panel)'),
      text: T('Distinct questions of the period with a copy event. The dashboard also counts the copies by level.', 'Dönemde kopyalama olayı olan farklı sorular. Panel kopyalamaları düzeye göre de sayar.', 'Preguntas distintas del periodo con un evento de copia. El panel cuenta también las copias por nivel.'),
    }],
    research: {
      stage: DURING,
      spss: T('`copies_fix` = copies from L3 per student, and `copy_share` = questions with a copy ÷ questions.', 'Öğrenci başına `copies_fix` = L3’ten kopyalamalar ve `copy_share` = kopyalama olan sorular ÷ sorular.', '`copies_fix` = copias de L3 por estudiante, y `copy_share` = preguntas con copia ÷ preguntas.'),
      analysis: T('Compare the learning gain of students who copy often from L3 with the others (Mann–Whitney U).', 'L3’ten sık kopyalayan öğrencilerin öğrenme kazancını diğerleriyle karşılaştırın (Mann–Whitney U).', 'Compare la ganancia de aprendizaje de quienes copian a menudo de L3 con la del resto (U de Mann–Whitney).'),
      sentence: T('Copy actions within the feedback panel were logged with the hint level they came from, without the copied content.', 'Geri bildirim panelindeki kopyalama eylemleri, kopyalanan içerik olmadan, geldikleri ipucu düzeyiyle birlikte kaydedilmiştir.', 'Las acciones de copia en el panel se registraron con el nivel de la pista del que procedían, sin el contenido copiado.'),
    },
    rq: { 'metric.copied': { RQ2: 'descriptive', RQ4: 'predictor' } },
    limits: T(
      'A copy is not always a paste into the code: students also copy to take notes or to search. The level is the one where the selection starts, so a selection across several steps gets only the first.',
      'Bir kopyalama her zaman koda yapıştırma demek değildir: öğrenciler not almak ya da arama yapmak için de kopyalar. Düzey, seçimin başladığı düzeydir. Bu yüzden birkaç adıma yayılan bir seçim yalnızca ilkini alır.',
      'Copiar no siempre es pegar en el código: los estudiantes también copian para tomar notas o para buscar. El nivel es el del inicio de la selección, así que una selección de varios pasos solo recibe el primero.',
    ),
    teacher: T(
      'Copying the fix is not a problem in itself. Ask students to close the panel and change the code from memory, then compare.',
      'Düzeltmeyi kopyalamak tek başına bir sorun değildir. Öğrencilerden paneli kapatıp kodu ezberden değiştirmelerini, sonra karşılaştırmalarını isteyin.',
      'Copiar la corrección no es un problema en sí. Pida a los estudiantes que cierren el panel, cambien el código de memoria y luego comparen.',
    ),
  },

  // ------------------------------------------------------------------ reopened
  {
    slug: 'reopened', category: 'reading',
    items: ['event.explanation_reopened', 'metric.reopened'],
    title: T('Opened again later', 'Sonra yeniden açtı', 'La volvió a abrir'),
    what: {
      heading: T('What is a reopened explanation?', 'Yeniden açılan açıklama nedir?', '¿Qué es una explicación reabierta?'),
      text: T(
        'The progress panel of the extension lists the last ten questions. A click on a card shows the stored explanation again, and the event records this.',
        'Eklentinin ilerleme paneli son on soruyu listeler. Bir karta tıklamak saklanan açıklamayı yeniden gösterir ve olay bunu kaydeder.',
        'El panel de progreso de la extensión muestra las diez últimas preguntas. Un clic en una tarjeta muestra otra vez la explicación guardada, y el evento lo registra.',
      ),
    },
    example: {
      en: (f) => `S07 reopened ${f.featured} explanation from the history list. In the class, ${f.reopened} of ${f.explanations} explanations were opened again later.`,
      tr: (f) => `S07 geçmiş listesinden ${f.featured} açıklamayı yeniden açtı. Sınıfta ${f.explanations} açıklamanın ${f.reopened} tanesi daha sonra yeniden açıldı.`,
      es: (f) => `S07 reabrió ${f.featured} explicación desde el historial. En la clase, ${f.reopened} de ${f.explanations} explicaciones se volvieron a abrir más tarde.`,
    },
    takeaway: T('Most explanations are reopened four to seven days later, around the next lab.', 'Açıklamaların çoğu dört ile yedi gün sonra, bir sonraki laboratuvar sırasında yeniden açılıyor.', 'La mayoría de las explicaciones se reabren entre cuatro y siete días después, cerca del siguiente laboratorio.'),
    purpose: {
      teacher: T('Which explanations are worth coming back to?', 'Hangi açıklamalara geri dönmeye değer?', '¿A qué explicaciones merece la pena volver?'),
      researcher: T('Do students use past feedback for review?', 'Öğrenciler geçmiş geri bildirimi tekrar için kullanıyor mu?', '¿Usan los estudiantes la retroalimentación anterior para repasar?'),
    },
    raw: {
      intro: T('One event from the sample. It has no payload.', 'Örnekten bir olay. Olay verisi boştur.', 'Un evento de la muestra. No tiene datos adicionales.'),
      snippets: [{ name: 'reopened', caption: EV }],
    },
    formulas: [{
      id: 'metric.reopened',
      heading: T('Opened again later (dashboard)', 'Sonra yeniden açtı (panel)', 'La volvió a abrir (panel)'),
      text: T('Distinct questions of the period with at least one reopening, whenever it happened.', 'Ne zaman olursa olsun, en az bir kez yeniden açılan dönem soruları.', 'Preguntas distintas del periodo con al menos una reapertura, sea cuando sea.'),
    }],
    research: {
      stage: T('during the intervention and after it (review)', 'müdahale sırasında ve sonrasında (tekrar)', 'durante la intervención y después (repaso)'),
      spss: T('`reopen_count` per student.', 'Öğrenci başına `reopen_count`.', '`reopen_count` por estudiante.'),
      analysis: T('Correlate the number of reopenings in the last week with the post-test score (Spearman).', 'Son haftadaki yeniden açma sayısını son test puanıyla ilişkilendirin (Spearman).', 'Correlacione el número de reaperturas de la última semana con la puntuación del postest (Spearman).'),
      sentence: T('Reopening a past explanation from the history list was logged as a review action.', 'Geçmiş bir açıklamanın geçmiş listesinden yeniden açılması bir tekrar eylemi olarak kaydedilmiştir.', 'La reapertura de una explicación anterior desde el historial se registró como una acción de repaso.'),
    },
    rq: { 'metric.reopened': { RQ4: 'predictor' } },
    limits: T(
      'Only the last ten questions appear in the list, so older explanations cannot be reopened there. A click can be curiosity rather than study. The event says nothing about how long the student read.',
      'Listede yalnızca son on soru görünür, bu yüzden daha eski açıklamalar orada yeniden açılamaz. Bir tıklama çalışmadan çok merak olabilir. Olay öğrencinin ne kadar süre okuduğu hakkında bir şey söylemez.',
      'En la lista solo aparecen las diez últimas preguntas, así que las explicaciones más antiguas no pueden reabrirse ahí. Un clic puede ser curiosidad más que estudio. El evento no dice nada sobre cuánto leyó el estudiante.',
    ),
    teacher: T(
      'Before a test, remind students that their past explanations are in the progress panel and can be read again.',
      'Bir sınavdan önce öğrencilere geçmiş açıklamalarının ilerleme panelinde olduğunu ve yeniden okunabileceğini hatırlatın.',
      'Antes de un examen, recuerde a los estudiantes que sus explicaciones anteriores están en el panel de progreso y se pueden volver a leer.',
    ),
  },

  // ------------------------------------------------------------------ error gone
  {
    slug: 'error-gone', category: 'outcomes',
    items: ['event.diagnostic_resolved', 'event.diagnostic_resolved.msToResolution', 'event.diagnostic_resolved.msPresent', 'event.diagnostic_resolved.editsWhilePresent', 'metric.error_gone_pct', 'metric.error_gone_by_level'],
    title: T('Error gone after explaining', 'Açıklamadan sonra hata gitti', 'Error resuelto tras explicar'),
    what: {
      heading: T('What does "error gone after explaining" mean?', '"Açıklamadan sonra hata gitti" ne demek?', '¿Qué significa «error resuelto tras explicar»?'),
      text: T(
        'After a student asks about an error, the extension watches that error in the open file. When it disappears, an event stores how long this took from the question. It is the most direct sign that the explanation was followed by a fix.',
        'Öğrenci bir hata hakkında soru sorduktan sonra eklenti açık dosyada o hatayı izler. Hata kaybolduğunda bir olay, bunun sorudan itibaren ne kadar sürdüğünü saklar. Açıklamanın ardından bir düzeltme geldiğinin en doğrudan işaretidir.',
        'Después de que el estudiante pregunta por un error, la extensión observa ese error en el archivo abierto. Cuando desaparece, un evento guarda cuánto tardó desde la pregunta. Es la señal más directa de que a la explicación le siguió una corrección.',
      ),
    },
    example: {
      en: (f) => `S07 asked about ${f.featuredQuestions} errors, and ${f.featuredResolved} of them later went away. In the class the share was ${pc(f.classPct, 'en')}, with a median time of ${f.classMedianSec} seconds from the question to the moment the error disappeared.`,
      tr: (f) => `S07 ${f.featuredQuestions} hata hakkında soru sordu ve bunların ${f.featuredResolved} tanesi sonradan ortadan kalktı. Sınıfta bu pay ${pc(f.classPct, 'tr')} oldu. Sorudan hatanın kaybolduğu ana kadar geçen ortanca süre ${f.classMedianSec} saniyeydi.`,
      es: (f) => `S07 preguntó por ${f.featuredQuestions} errores y ${f.featuredResolved} desaparecieron después. En la clase la proporción fue del ${pc(f.classPct, 'es')}, con una mediana de ${f.classMedianSec} segundos desde la pregunta hasta que el error desapareció.`,
    },
    takeaway: T('The error went away in about three of four questions at every hint depth. S07 is above the class.', 'Hata, her ipucu derinliğinde yaklaşık dört sorudan üçünde ortadan kalktı. S07 sınıfın üstünde.', 'El error desapareció en unas tres de cada cuatro preguntas en todas las profundidades. S07 está por encima de la clase.'),
    purpose: {
      teacher: T('Did the explanations help students get rid of their errors?', 'Açıklamalar öğrencilerin hatalardan kurtulmasına yardım etti mi?', '¿Ayudaron las explicaciones a los estudiantes a eliminar sus errores?'),
      researcher: T('Is a deeper hint level related to a higher or faster resolution of the error?', 'Daha derin bir ipucu düzeyi, hatanın daha sık ya da daha hızlı çözülmesiyle ilişkili mi?', '¿Se relaciona un nivel de pista más profundo con una resolución más frecuente o más rápida del error?'),
    },
    raw: {
      intro: T('One event of S07.', 'S07’nin bir olayı.', 'Un evento de S07.'),
      snippets: [{ name: 'error-gone', caption: EV }],
    },
    formulas: [
      {
        id: 'event.diagnostic_resolved.msToResolution',
        heading: T('How the time is measured', 'Süre nasıl ölçülür', 'Cómo se mide el tiempo'),
        text: T('Time from the click on the help link to the moment the error was no longer in the file, in milliseconds. An error is identified by file, line and message.', 'Yardım bağlantısına tıklamadan hatanın artık dosyada olmadığı ana kadar geçen süre, milisaniye olarak. Bir hata dosya, satır ve mesajla tanımlanır.', 'Tiempo desde el clic en el enlace de ayuda hasta que el error ya no estaba en el archivo, en milisegundos. Un error se identifica por archivo, línea y mensaje.'),
      },
      {
        id: 'event.diagnostic_resolved.msPresent',
        heading: T('Time the error was present', 'Hatanın açık kaldığı süre', 'Tiempo que el error estuvo presente'),
        text: T('Time from the first display of the help offer to the disappearance. Missing when there was no visible offer.', 'Yardım teklifinin ilk görünmesinden kaybolmaya kadar geçen süre. Görünür bir teklif yoksa değer yoktur.', 'Tiempo desde la primera aparición de la oferta de ayuda hasta la desaparición. Falta si no hubo oferta visible.'),
      },
      {
        id: 'event.diagnostic_resolved.editsWhilePresent',
        heading: T('Edits while the error was present', 'Hata varken yapılan düzenlemeler', 'Ediciones mientras el error estaba presente'),
        text: T('Edit events in the file between the offer and the disappearance. Missing when there was no visible offer.', 'Teklif ile kaybolma arasında dosyadaki düzenleme olayları. Görünür bir teklif yoksa değer yoktur.', 'Eventos de edición en el archivo entre la oferta y la desaparición. Falta si no hubo oferta visible.'),
      },
      {
        id: 'metric.error_gone_pct',
        heading: T('Error gone after explaining (dashboard)', 'Açıklamadan sonra hata gitti (panel)', 'Error resuelto tras explicar (panel)'),
        text: T('Error questions of the period with at least one such event, divided by all error questions of the period. The median time uses the first event of each question.', 'Dönemde en az bir böyle olayı olan hata soruları, dönemin tüm hata sorularına bölünür. Ortanca süre her sorunun ilk olayını kullanır.', 'Preguntas sobre errores del periodo con al menos un evento de este tipo, divididas entre todas las preguntas sobre errores del periodo. La mediana usa el primer evento de cada pregunta.'),
      },
      {
        id: 'metric.error_gone_by_level',
        heading: T('Did the error go away? By hint depth (dashboard)', 'Hata ortadan kalktı mı? İpucu derinliğine göre (panel)', '¿Desapareció el error? Por profundidad (panel)'),
        text: T('The same share and median time, split into questions that ended at L0–L1, at L2 and at L3.', 'Aynı pay ve ortanca süre, L0–L1’de, L2’de ve L3’te biten sorulara ayrılır.', 'La misma proporción y mediana, separadas en preguntas que terminaron en L0–L1, en L2 y en L3.'),
      },
    ],
    research: {
      stage: T('during the intervention and in the analysis (proximal outcome)', 'müdahale sırasında ve analizde (yakın sonuç)', 'durante la intervención y en el análisis (resultado próximo)'),
      spss: T('`resolved_share` = error questions with the event ÷ error questions, and `median_resolution_s`, per student.', 'Öğrenci başına `resolved_share` = olayı olan hata soruları ÷ hata soruları ve `median_resolution_s`.', '`resolved_share` = preguntas sobre errores con el evento ÷ preguntas sobre errores, y `median_resolution_s`, por estudiante.'),
      analysis: T('Model resolution per question with a mixed logistic regression, with hint depth as predictor and student as random effect.', 'Soru başına çözülmeyi, ipucu derinliği yordayıcı ve öğrenci rastgele etki olmak üzere karma lojistik regresyonla modelleyin.', 'Modele la resolución por pregunta con una regresión logística mixta, con la profundidad como predictor y el estudiante como efecto aleatorio.'),
      sentence: T('An error was considered resolved when the diagnostic the student had asked about disappeared from the open file.', 'Öğrencinin sorduğu tanılama açık dosyadan kaybolduğunda hata çözülmüş kabul edilmiştir.', 'Un error se consideró resuelto cuando el diagnóstico por el que había preguntado el estudiante desapareció del archivo abierto.'),
    },
    rq: { 'metric.error_gone_pct': { RQ2: 'outcome', RQ3: 'outcome' }, 'event.diagnostic_resolved.msToResolution': { RQ2: 'outcome' } },
    limits: T(
      'An error is identified by file, line and message, so an edit that moves the error to another line looks like a resolution. An error can also disappear because code was deleted, not fixed. Errors in closed files are not watched.',
      'Bir hata dosya, satır ve mesajla tanımlanır. Bu yüzden hatayı başka bir satıra kaydıran bir düzenleme çözülme gibi görünür. Bir hata düzeltildiği için değil, kod silindiği için de kaybolabilir. Kapalı dosyalardaki hatalar izlenmez.',
      'Un error se identifica por archivo, línea y mensaje, así que una edición que mueve el error a otra línea parece una resolución. Un error también puede desaparecer porque se borró código, no porque se corrigiera. Los errores de archivos cerrados no se observan.',
    ),
    teacher: T(
      'If many errors stay after the explanation for one task, go through that error with the class. If they go away quickly, the explanations are doing their job for that topic.',
      'Bir görev için birçok hata açıklamadan sonra da kalıyorsa, o hatayı sınıfla birlikte ele alın. Hatalar hızla gidiyorsa, açıklamalar o konu için işini yapıyor demektir.',
      'Si en una tarea muchos errores siguen ahí después de la explicación, repase ese error con la clase. Si desaparecen rápido, las explicaciones están cumpliendo su función en ese tema.',
    ),
  },

  // ------------------------------------------------------------------ fixed without asking
  {
    slug: 'fixed-without-asking', category: 'outcomes',
    items: ['coding_sessions.errors_resolved_without_asking', 'metric.fixed_unaided'],
    title: T('Fixed without asking', 'Sormadan düzeltilen', 'Corregidos sin preguntar'),
    what: {
      heading: T('What is an error fixed without asking?', 'Sormadan düzeltilen hata nedir?', '¿Qué es un error corregido sin preguntar?'),
      text: T(
        'It is an error or warning that disappeared from an open file although the student never asked about it. It is the only direct sign of unaided work that the extension can see.',
        'Öğrencinin hiç sormadığı halde açık bir dosyadan kaybolan bir hata ya da uyarıdır. Eklentinin görebildiği yardımsız çalışmanın tek doğrudan işaretidir.',
        'Es un error o una advertencia que desapareció de un archivo abierto sin que el estudiante preguntara por él. Es la única señal directa de trabajo sin ayuda que la extensión puede ver.',
      ),
    },
    example: {
      en: (f) => `S07 fixed ${f.featuredWeek1} errors without asking in week 1 and ${f.featuredWeek8} in week 8, ${f.featuredTotal} in total. The student panel shows the same total as "Errors you fixed without asking". The panel number "Errors you worked out yourself" (${f.workedOut}) is something else: it counts questions where S07 did not open the rule or the fix.`,
      tr: (f) => `S07 birinci haftada ${f.featuredWeek1}, sekizinci haftada ${f.featuredWeek8} hatayı sormadan düzeltti. Toplam ${f.featuredTotal} hata. Öğrenci paneli aynı toplamı "Sormadan düzelttiğin hatalar" olarak gösteriyor. Paneldeki "Kendin çözdüğün hatalar" sayısı (${f.workedOut}) başka bir şeydir: S07’nin kuralı ya da düzeltmeyi açmadığı soruları sayar.`,
      es: (f) => `S07 corrigió ${f.featuredWeek1} errores sin preguntar en la semana 1 y ${f.featuredWeek8} en la semana 8, ${f.featuredTotal} en total. El panel del estudiante muestra el mismo total como «Errores que arreglaste sin preguntar». El número «Errores que resolviste tú mismo/a» (${f.workedOut}) es otra cosa: cuenta las preguntas en las que S07 no abrió la regla ni la corrección.`,
    },
    takeaway: T('S07 fixes more errors alone in the last weeks than at the start.', 'S07 son haftalarda başlangıca göre daha fazla hatayı tek başına düzeltiyor.', 'S07 corrige más errores por su cuenta en las últimas semanas que al principio.'),
    purpose: {
      teacher: T('Are students solving more errors on their own as the course goes on?', 'Öğrenciler ders ilerledikçe daha fazla hatayı kendi başına mı çözüyor?', '¿Resuelven los estudiantes más errores por su cuenta a medida que avanza el curso?'),
      researcher: T('Does unaided error resolution grow over the weeks, next to help-seeking?', 'Yardımsız hata çözme, yardım istemeyle birlikte haftalar içinde artıyor mu?', '¿Crece la resolución de errores sin ayuda con las semanas, junto a la búsqueda de ayuda?'),
    },
    raw: {
      intro: T('Two sessions of S07 with their counters.', 'S07’nin sayaçlarıyla birlikte iki oturumu.', 'Dos sesiones de S07 con sus contadores.'),
      snippets: [{ name: 'fixed-without-asking', caption: tbl('coding_sessions') }],
    },
    formulas: [
      {
        id: 'coding_sessions.errors_resolved_without_asking',
        heading: T('How it is counted', 'Nasıl sayılır', 'Cómo se cuenta'),
        text: T('The extension compares the list of errors and warnings of an open file before and after each change settles (about 1.2 seconds). Each diagnostic that is gone and was never asked about adds 1.', 'Eklenti açık bir dosyanın hata ve uyarı listesini her değişiklik oturduktan sonra (yaklaşık 1,2 saniye) öncesi ve sonrasıyla karşılaştırır. Kaybolan ve hiç sorulmamış her tanılama 1 ekler.', 'La extensión compara la lista de errores y advertencias de un archivo abierto antes y después de que se asiente cada cambio (unos 1,2 segundos). Cada diagnóstico que ha desaparecido y nunca se preguntó suma 1.'),
      },
      {
        id: 'metric.fixed_unaided',
        heading: T('Fixed without asking (dashboard)', 'Sormadan düzeltilen (panel)', 'Corregidos sin preguntar (panel)'),
        text: T('Sum of the counter over the sessions that started in the period.', 'Dönemde başlayan oturumlar üzerinden sayacın toplamı.', 'Suma del contador en las sesiones que empezaron en el periodo.'),
      },
    ],
    research: {
      stage: DURING,
      spss: T('`fixed_unaided` per student and per week or block of weeks. Divide by active hours when students work very different amounts.', 'Öğrenci başına ve hafta ya da hafta bloğu başına `fixed_unaided`. Öğrencilerin çalışma süreleri çok farklıysa aktif saatlere bölün.', '`fixed_unaided` por estudiante y por semana o bloque de semanas. Divida entre las horas activas si los estudiantes trabajan cantidades muy distintas.'),
      analysis: T('Test the change from early to late weeks with a paired t-test on errors fixed per active hour.', 'Erken haftalardan geç haftalara değişimi, aktif saat başına düzeltilen hatalar üzerinde eşleştirilmiş t-testiyle sınayın.', 'Contraste el cambio de las primeras a las últimas semanas con una prueba t para muestras relacionadas sobre errores corregidos por hora activa.'),
      sentence: T('Errors and warnings that disappeared without a help request were counted as resolved without assistance.', 'Yardım isteği olmadan kaybolan hata ve uyarılar yardımsız çözülmüş olarak sayılmıştır.', 'Los errores y advertencias que desaparecieron sin una petición de ayuda se contaron como resueltos sin asistencia.'),
    },
    rq: { 'coding_sessions.errors_resolved_without_asking': { RQ3: 'outcome', RQ4: 'predictor' }, 'metric.fixed_unaided': { RQ3: 'outcome' } },
    limits: T(
      'An error is identified by file, line and message, so an edit that only moves an error to another line counts as a fix. Errors that were never shown as an offer are counted too, so this counter and the help offers are not on the same base. More errors met also means more errors fixed.',
      'Bir hata dosya, satır ve mesajla tanımlanır. Bu yüzden bir hatayı yalnızca başka bir satıra kaydıran düzenleme de düzeltme sayılır. Hiç teklif olarak gösterilmemiş hatalar da sayılır, bu yüzden bu sayaç ile yardım teklifleri aynı temele dayanmaz. Daha fazla hatayla karşılaşmak daha fazla düzeltilen hata da demektir.',
      'Un error se identifica por archivo, línea y mensaje, así que una edición que solo mueve un error a otra línea cuenta como corrección. También se cuentan errores que nunca se mostraron como oferta, así que este contador y las ofertas de ayuda no tienen la misma base. Encontrar más errores también significa corregir más.',
    ),
    teacher: T(
      'A rising line is a good moment for positive feedback: tell the student that they fix most small errors alone now.',
      'Yükselen bir çizgi olumlu geri bildirim için iyi bir andır: öğrenciye artık küçük hataların çoğunu tek başına düzelttiğini söyleyin.',
      'Una línea que sube es un buen momento para un comentario positivo: dígale al estudiante que ahora corrige solo la mayoría de los errores pequeños.',
    ),
  },

  // ------------------------------------------------------------------ edits per unaided fix
  {
    slug: 'edits-per-unaided-fix', category: 'outcomes',
    items: ['coding_sessions.silent_resolution_edits', 'metric.edits_per_unaided_fix'],
    title: T('Edits per unaided fix', 'Yardımsız düzeltme başına düzenleme', 'Ediciones por corrección sin ayuda'),
    what: {
      heading: T('What are the edits per unaided fix?', 'Yardımsız düzeltme başına düzenleme nedir?', '¿Qué son las ediciones por corrección sin ayuda?'),
      text: T(
        'For every error fixed without asking, the extension adds up the edits made while the error was shown. Divided by the number of such fixes, this gives the average cost of an unaided fix.',
        'Sormadan düzeltilen her hata için eklenti, hata gösterilirken yapılan düzenlemeleri toplar. Bu tür düzeltmelerin sayısına bölündüğünde, yardımsız bir düzeltmenin ortalama maliyeti elde edilir.',
        'Para cada error corregido sin preguntar, la extensión suma las ediciones hechas mientras se mostraba el error. Dividido entre el número de esas correcciones, da el coste medio de una corrección sin ayuda.',
      ),
    },
    example: {
      en: (f) => `S07 needed ${dec(f.featuredEpf, 'en')} edits on average for an error fixed alone, and made about three edits before asking about an error. In the class the values were ${dec(f.classEpf, 'en')} and a little more than two.`,
      tr: (f) => `S07 tek başına düzelttiği bir hata için ortalama ${dec(f.featuredEpf, 'tr')} düzenleme yaptı ve bir hatayı sormadan önce yaklaşık üç düzenleme yaptı. Sınıfta bu değerler ${dec(f.classEpf, 'tr')} ve ikiden biraz fazla oldu.`,
      es: (f) => `S07 necesitó ${dec(f.featuredEpf, 'es')} ediciones de media para un error corregido por su cuenta, y hacía unas tres ediciones antes de preguntar por un error. En la clase los valores fueron ${dec(f.classEpf, 'es')} y algo más de dos.`,
    },
    takeaway: T('Unaided fixes take about two edits. Errors that end in a question have a few more edits before them.', 'Yardımsız düzeltmeler yaklaşık iki düzenleme gerektiriyor. Soruyla biten hatalardan önce biraz daha fazla düzenleme var.', 'Las correcciones sin ayuda requieren unas dos ediciones. Los errores que terminan en una pregunta tienen algunas ediciones más antes.'),
    purpose: {
      teacher: T('Are the errors students fix alone the easy ones?', 'Öğrencilerin tek başına düzelttiği hatalar kolay olanlar mı?', '¿Son fáciles los errores que los estudiantes corrigen por su cuenta?'),
      researcher: T('How does the effort of unaided fixes compare with the effort before a help request?', 'Yardımsız düzeltmelerin çabası, yardım isteğinden önceki çabayla nasıl karşılaştırılır?', '¿Cómo se compara el esfuerzo de las correcciones sin ayuda con el esfuerzo previo a una petición de ayuda?'),
    },
    raw: {
      intro: T('Two sessions of S07 with unaided fixes.', 'S07’nin yardımsız düzeltmeler içeren iki oturumu.', 'Dos sesiones de S07 con correcciones sin ayuda.'),
      snippets: [{ name: 'edits-per-unaided-fix', caption: tbl('coding_sessions') }],
    },
    formulas: [
      {
        id: 'coding_sessions.silent_resolution_edits',
        heading: T('How the edits are counted', 'Düzenlemeler nasıl sayılır', 'Cómo se cuentan las ediciones'),
        text: T('For each error fixed without asking, the edit events in its file between the first offer and the disappearance. An error without a visible offer adds 0.', 'Sormadan düzeltilen her hata için, ilk teklif ile kaybolma arasında dosyasındaki düzenleme olayları. Görünür teklifi olmayan bir hata 0 ekler.', 'Para cada error corregido sin preguntar, los eventos de edición en su archivo entre la primera oferta y la desaparición. Un error sin oferta visible suma 0.'),
      },
      {
        id: 'metric.edits_per_unaided_fix',
        heading: T('Edits per unaided fix (dashboard)', 'Yardımsız düzeltme başına düzenleme (panel)', 'Ediciones por corrección sin ayuda (panel)'),
        text: {
          en: (f) => `Sum of the edits divided by the sum of errors fixed without asking, over the sessions of the period (${f.classEdits} ÷ ${f.classFixed} in the sample). The dashboard computes this in the browser.`,
          tr: (f) => `Dönemin oturumları üzerinden düzenlemelerin toplamı, sormadan düzeltilen hataların toplamına bölünür (örnekte ${f.classEdits} ÷ ${f.classFixed}). Panel bunu tarayıcıda hesaplar.`,
          es: (f) => `Suma de las ediciones dividida entre la suma de errores corregidos sin preguntar, en las sesiones del periodo (${f.classEdits} ÷ ${f.classFixed} en la muestra). El panel lo calcula en el navegador.`,
        },
      },
    ],
    research: {
      stage: ANALYSIS,
      spss: T('`edits_per_unaided_fix` per student, computed from the two sums, not as a mean of session ratios.', 'Öğrenci başına `edits_per_unaided_fix`, oturum oranlarının ortalaması olarak değil, iki toplamdan hesaplanır.', '`edits_per_unaided_fix` por estudiante, calculado a partir de las dos sumas, no como media de razones por sesión.'),
      analysis: T('Compare it with the median edits before asking of the same student (paired Wilcoxon test).', 'Aynı öğrencinin sormadan önceki ortanca düzenlemeleriyle karşılaştırın (eşleştirilmiş Wilcoxon testi).', 'Compárelo con la mediana de ediciones antes de preguntar del mismo estudiante (prueba de Wilcoxon para muestras relacionadas).'),
      sentence: T('The effort of unaided fixes was expressed as the mean number of edits made while the resolved error was displayed.', 'Yardımsız düzeltmelerin çabası, çözülen hata gösterilirken yapılan ortalama düzenleme sayısı olarak ifade edilmiştir.', 'El esfuerzo de las correcciones sin ayuda se expresó como el número medio de ediciones hechas mientras se mostraba el error resuelto.'),
    },
    rq: { 'metric.edits_per_unaided_fix': { RQ3: 'descriptive' } },
    limits: T(
      'Errors fixed without a visible offer add a fix but no edits, which pulls the average down. Line shifts can create false fixes with zero edits. An edit event is not the same as an attempt.',
      'Görünür bir teklif olmadan düzeltilen hatalar bir düzeltme ekler ama düzenleme eklemez. Bu da ortalamayı düşürür. Satır kaymaları sıfır düzenlemeli sahte düzeltmeler oluşturabilir. Bir düzenleme olayı bir denemeyle aynı şey değildir.',
      'Los errores corregidos sin oferta visible suman una corrección pero ninguna edición, lo que baja la media. Los desplazamientos de líneas pueden crear correcciones falsas con cero ediciones. Un evento de edición no es lo mismo que un intento.',
    ),
    teacher: T(
      'Use the number only together with the questions: a student who fixes alone with few edits and asks after many edits may be asking about the right things.',
      'Bu sayıyı yalnızca sorularla birlikte kullanın: az düzenlemeyle tek başına düzelten ve çok düzenlemeden sonra soran bir öğrenci doğru şeyleri soruyor olabilir.',
      'Use este número solo junto con las preguntas: quien corrige solo con pocas ediciones y pregunta tras muchas puede estar preguntando por lo que de verdad le cuesta.',
    ),
  },

  // ------------------------------------------------------------------ follow-on errors
  {
    slug: 'follow-on-errors', category: 'outcomes',
    items: ['coding_sessions.follow_on_error_count'],
    title: T('New errors right after a fix', 'Düzeltmenin hemen ardından yeni hata', 'Errores nuevos justo después de corregir'),
    what: {
      heading: T('What is a new error right after a fix?', 'Düzeltmenin hemen ardından gelen yeni hata nedir?', '¿Qué es un error nuevo justo después de corregir?'),
      text: T(
        'It is an error or warning that appears in a file at the same moment another one there was fixed, or within 60 seconds after it. It separates a change that solved the problem from one that only moved it.',
        'Bir dosyada başka bir hata düzeltildiği anda ya da ondan sonraki 60 saniye içinde ortaya çıkan bir hata ya da uyarıdır. Sorunu çözen bir değişikliği, sorunu yalnızca başka yere taşıyan değişiklikten ayırır.',
        'Es un error o una advertencia que aparece en un archivo en el mismo momento en que se corrigió otro allí, o en los 60 segundos siguientes. Distingue un cambio que resolvió el problema de uno que solo lo trasladó.',
      ),
    },
    example: {
      en: (f) => `S07 had ${f.featuredTotal} new errors right after a fix in the eight weeks, three of them in week 8. In the whole class, ${f.classTotal} follow-on errors were counted next to ${f.classFixed} errors fixed without asking.`,
      tr: (f) => `S07 sekiz haftada ${f.featuredTotal} kez bir düzeltmenin hemen ardından yeni bir hatayla karşılaştı. Bunların üçü sekizinci haftadaydı. Tüm sınıfta sormadan düzeltilen ${f.classFixed} hatanın yanında ${f.classTotal} ardışık hata sayıldı.`,
      es: (f) => `S07 tuvo ${f.featuredTotal} errores nuevos justo después de una corrección en las ocho semanas, tres de ellos en la semana 8. En toda la clase se contaron ${f.classTotal} errores de este tipo frente a ${f.classFixed} errores corregidos sin preguntar.`,
    },
    takeaway: T('Follow-on errors are few per week, about one per student. S07 has a peak in week 8.', 'Ardışık hatalar haftada az, öğrenci başına yaklaşık bir tane. S07’de sekizinci haftada bir tepe var.', 'Los errores encadenados son pocos por semana, alrededor de uno por estudiante. S07 tiene un pico en la semana 8.'),
    purpose: {
      teacher: T('Do fixes create new problems for my students?', 'Düzeltmeler öğrencilerim için yeni sorunlar yaratıyor mu?', '¿Crean las correcciones problemas nuevos para mis estudiantes?'),
      researcher: T('How often does a change only move the problem instead of solving it?', 'Bir değişiklik ne sıklıkla sorunu çözmek yerine yalnızca taşıyor?', '¿Con qué frecuencia un cambio solo traslada el problema en lugar de resolverlo?'),
    },
    raw: {
      intro: T('Two sessions of S07 with follow-on errors.', 'S07’nin ardışık hatalar içeren iki oturumu.', 'Dos sesiones de S07 con errores encadenados.'),
      snippets: [{ name: 'follow-on-errors', caption: tbl('coding_sessions') }],
    },
    formulas: [{
      id: 'coding_sessions.follow_on_error_count',
      heading: T('How it is counted', 'Nasıl sayılır', 'Cómo se cuenta'),
      text: T('Each diagnostic that newly appears in a file adds 1 when, in the same check, another diagnostic there was resolved, or when the last resolution in that file was at most 60 seconds earlier.', 'Bir dosyada yeni ortaya çıkan her tanılama, aynı denetimde orada başka bir tanılama çözüldüyse ya da o dosyadaki son çözülme en fazla 60 saniye önceyse 1 ekler.', 'Cada diagnóstico que aparece de nuevo en un archivo suma 1 cuando, en la misma comprobación, se resolvió otro allí, o cuando la última resolución en ese archivo fue como máximo 60 segundos antes.'),
    }],
    research: {
      stage: ANALYSIS,
      spss: T('`follow_on_rate` = follow-on errors ÷ errors fixed (with and without asking), per student.', 'Öğrenci başına `follow_on_rate` = ardışık hatalar ÷ düzeltilen hatalar (sorarak ve sormadan).', '`follow_on_rate` = errores encadenados ÷ errores corregidos (con y sin pregunta), por estudiante.'),
      analysis: T('Compare the rate between early and late weeks, as a sign of more precise changes.', 'Daha kesin değişikliklerin bir işareti olarak oranı erken ve geç haftalar arasında karşılaştırın.', 'Compare la tasa entre las primeras y las últimas semanas, como señal de cambios más precisos.'),
      sentence: T('Diagnostics appearing within 60 seconds of a resolution in the same file were counted as follow-on errors.', 'Aynı dosyada bir çözülmeden sonraki 60 saniye içinde ortaya çıkan tanılamalar ardışık hata olarak sayılmıştır.', 'Los diagnósticos que aparecieron en los 60 segundos siguientes a una resolución en el mismo archivo se contaron como errores encadenados.'),
    },
    rq: { 'coding_sessions.follow_on_error_count': { RQ3: 'descriptive' } },
    limits: T(
      'When an edit moves an error to another line, the code sees a fix and a new error, so the count can be too high. A new error can be unrelated, for example a half-typed line. The 60-second window is a fixed choice.',
      'Bir düzenleme bir hatayı başka bir satıra kaydırdığında kod bir düzeltme ve yeni bir hata görür. Bu yüzden sayı olması gerekenden yüksek olabilir. Yeni bir hata ilgisiz de olabilir, örneğin yarım yazılmış bir satır. 60 saniyelik pencere sabit bir seçimdir.',
      'Cuando una edición mueve un error a otra línea, el código ve una corrección y un error nuevo, así que el recuento puede ser demasiado alto. Un error nuevo puede no tener relación, por ejemplo una línea a medio escribir. La ventana de 60 segundos es una elección fija.',
    ),
    teacher: T(
      'If a student often gets a new error right after a fix, show how to run the program after each small change instead of changing many lines at once.',
      'Bir öğrenci bir düzeltmenin hemen ardından sık sık yeni bir hata alıyorsa, birçok satırı birden değiştirmek yerine her küçük değişiklikten sonra programı çalıştırmayı gösterin.',
      'Si un estudiante suele tener un error nuevo justo después de corregir, muéstrele cómo ejecutar el programa tras cada cambio pequeño en lugar de cambiar muchas líneas a la vez.',
    ),
  },

  // ------------------------------------------------------------------ files worked through
  {
    slug: 'files-worked-through', category: 'outcomes',
    items: ['event.file_cleared', 'event.file_cleared.fileName', 'event.file_cleared.msWithErrors', 'event.file_cleared.editsWhileErrors', 'event.file_cleared.diagnosticsSeen', 'event.file_cleared.diagnosticsAsked', 'metric.files_cleared_list'],
    title: T('Files worked through', 'Hatasız hale getirilen dosyalar', 'Archivos que quedaron sin errores'),
    what: {
      heading: T('What is a file worked through?', 'Hatasız hale getirilen dosya nedir?', '¿Qué es un archivo que quedó sin errores?'),
      text: T(
        'The event is recorded when a file that had errors or warnings has none left. It summarizes the whole episode: how long the file had problems, how many edits it took, how many problems appeared and how many the student asked about.',
        'Bu olay, hata ya da uyarısı olan bir dosyada hiçbiri kalmadığında kaydedilir. Tüm süreci özetler: dosyanın ne kadar süre sorunlu kaldığı, kaç düzenleme gerektiği, kaç sorunun ortaya çıktığı ve öğrencinin bunlardan kaçını sorduğu.',
        'El evento se registra cuando un archivo que tenía errores o advertencias se queda sin ninguno. Resume todo el episodio: cuánto tiempo tuvo problemas el archivo, cuántas ediciones hicieron falta, cuántos problemas aparecieron y por cuántos preguntó el estudiante.',
      ),
    },
    example: {
      en: (f) => `The latest episode of S07 was in ${f.exFile}. The file had errors for ${dec(f.exMin, 'en')} minutes. S07 made ${f.exEdits} edits, saw ${f.exSeen} problems and asked about ${f.exAsked} of them. Over the eight weeks, S07 cleared files ${f.featuredEpisodes} times.`,
      tr: (f) => `S07’nin en son süreci ${f.exFile} dosyasındaydı. Dosya ${dec(f.exMin, 'tr')} dakika boyunca hatalıydı. S07 ${f.exEdits} düzenleme yaptı, ${f.exSeen} sorun gördü ve bunların ${f.exAsked} tanesini sordu. Sekiz haftada S07 ${f.featuredEpisodes} kez bir dosyayı hatasız hale getirdi.`,
      es: (f) => `El último episodio de S07 fue en ${f.exFile}. El archivo tuvo errores durante ${dec(f.exMin, 'es')} minutos. S07 hizo ${f.exEdits} ediciones, vio ${f.exSeen} problemas y preguntó por ${f.exAsked}. En las ocho semanas, S07 dejó archivos sin errores ${f.featuredEpisodes} veces.`,
    },
    takeaway: {
      en: (f) => `A small table works best here. In the class, a file took a median of ${dec(f.medianMin, 'en')} minutes to become error-free.`,
      tr: (f) => `Burada küçük bir tablo en iyisi. Sınıfta bir dosyanın hatasız hale gelmesi ortanca ${dec(f.medianMin, 'tr')} dakika sürdü.`,
      es: (f) => `Aquí funciona mejor una tabla pequeña. En la clase, un archivo tardó una mediana de ${dec(f.medianMin, 'es')} minutos en quedar sin errores.`,
    },
    purpose: {
      teacher: T('How much work does it take my students to get a file working?', 'Öğrencilerimin bir dosyayı çalışır hale getirmesi ne kadar emek gerektiriyor?', '¿Cuánto trabajo les cuesta a mis estudiantes que un archivo funcione?'),
      researcher: T('What does the whole repair of a file cost, and which share of its problems needed help?', 'Bir dosyanın tüm onarımı neye mal oluyor ve sorunlarının ne kadarı yardım gerektirdi?', '¿Cuánto cuesta la reparación completa de un archivo y qué parte de sus problemas necesitó ayuda?'),
    },
    raw: {
      intro: T('The latest episode of S07.', 'S07’nin en son süreci.', 'El último episodio de S07.'),
      snippets: [{ name: 'files-worked-through', caption: EV }],
    },
    formulas: [
      {
        id: 'event.file_cleared.msWithErrors',
        heading: T('How the episode is measured', 'Süreç nasıl ölçülür', 'Cómo se mide el episodio'),
        text: T('The episode starts when the first problem appears in a file and ends when the last one goes away. Time with errors is the difference in milliseconds. Edits are the change events in between.', 'Süreç, bir dosyada ilk sorun ortaya çıktığında başlar ve sonuncusu gittiğinde biter. Hatalı geçen süre bu ikisi arasındaki farktır, milisaniye olarak. Düzenlemeler aradaki değişiklik olaylarıdır.', 'El episodio empieza cuando aparece el primer problema en un archivo y termina cuando desaparece el último. El tiempo con errores es la diferencia en milisegundos. Las ediciones son los eventos de cambio entre ambos momentos.'),
      },
      {
        id: 'event.file_cleared.editsWhileErrors',
        heading: T('Edits', 'Düzenleme', 'Ediciones'),
        text: T('Edit events in the file during the episode.', 'Süreç boyunca dosyadaki düzenleme olayları.', 'Eventos de edición en el archivo durante el episodio.'),
      },
      {
        id: 'event.file_cleared.diagnosticsSeen',
        heading: T('Errors seen', 'Görülen hata', 'Errores vistos'),
        text: T('Problems present at the start of the episode plus those that appeared later.', 'Sürecin başında var olan sorunlar artı daha sonra ortaya çıkanlar.', 'Problemas presentes al inicio del episodio más los que aparecieron después.'),
      },
      {
        id: 'metric.files_cleared_list',
        heading: T('Files worked through (dashboard)', 'Hatasız hale getirilen dosyalar (panel)', 'Archivos que quedaron sin errores (panel)'),
        text: T('The latest 25 episodes of the period with their values.', 'Dönemin değerleriyle birlikte en son 25 süreci.', 'Los 25 últimos episodios del periodo con sus valores.'),
      },
    ],
    research: {
      stage: ANALYSIS,
      spss: T('`median_episode_min` and `asked_share` = asked ÷ seen, per student over all episodes.', 'Tüm süreçler üzerinden öğrenci başına `median_episode_min` ve `asked_share` = sorulan ÷ görülen.', '`median_episode_min` y `asked_share` = preguntados ÷ vistos, por estudiante en todos los episodios.'),
      analysis: T('Compare the median episode time of weeks 1–4 and 5–8 (Wilcoxon), as a measure of growing fluency.', 'Artan akıcılığın bir ölçüsü olarak 1.–4. ve 5.–8. haftaların ortanca süreç süresini karşılaştırın (Wilcoxon).', 'Compare la mediana de la duración de los episodios de las semanas 1–4 y 5–8 (Wilcoxon), como medida de una mayor soltura.'),
      sentence: T('A repair episode was defined as the period from the first diagnostic in a file until the file had no diagnostics left.', 'Bir onarım süreci, bir dosyadaki ilk tanılamadan dosyada hiç tanılama kalmayana kadar geçen süre olarak tanımlanmıştır.', 'Un episodio de reparación se definió como el periodo desde el primer diagnóstico en un archivo hasta que el archivo quedó sin diagnósticos.'),
    },
    rq: { 'event.file_cleared.msWithErrors': { RQ3: 'outcome' } },
    limits: T(
      'The file name is stored, and a file name can contain personal information. An episode also ends when the problems disappear because code was deleted. Files closed before they became error-free produce no event.',
      'Dosya adı saklanır ve bir dosya adı kişisel bilgi içerebilir. Bir süreç, sorunlar kod silindiği için kaybolduğunda da biter. Hatasız hale gelmeden kapatılan dosyalar olay üretmez.',
      'Se guarda el nombre del archivo, y un nombre de archivo puede contener información personal. Un episodio también termina cuando los problemas desaparecen porque se borró código. Los archivos cerrados antes de quedar sin errores no generan evento.',
    ),
    teacher: T(
      'If files stay broken for a long time in a lab, stop the class once and show a strategy: fix the first error at the top of the file, then run again.',
      'Bir laboratuvarda dosyalar uzun süre hatalı kalıyorsa, sınıfı bir kez durdurun ve bir strateji gösterin: dosyanın en üstündeki ilk hatayı düzeltin, sonra yeniden çalıştırın.',
      'Si en un laboratorio los archivos siguen rotos mucho tiempo, detenga una vez la clase y muestre una estrategia: corregir el primer error de arriba del archivo y volver a ejecutar.',
    ),
  },

  // ------------------------------------------------------------------ running code
  {
    slug: 'running-code', category: 'outcomes',
    items: ['event.run_finished', 'event.run_finished.exitCode', 'event.run_finished.success', 'metric.runs'],
    title: T('Running the code', 'Kodu çalıştırma', 'Ejecutar el código'),
    what: {
      heading: T('What is recorded about running the code?', 'Kodu çalıştırma hakkında ne kaydedilir?', '¿Qué se registra al ejecutar el código?'),
      text: T(
        'When a VS Code task finishes, the extension records its exit code and whether it ended without error. A program started by typing a command into the terminal, or with the usual "Run Python File" button, is not a task and is not seen.',
        'Bir VS Code görevi bittiğinde eklenti çıkış kodunu ve hatasız bitip bitmediğini kaydeder. Terminale komut yazılarak ya da alışılmış "Run Python File" düğmesiyle başlatılan bir program görev değildir ve görülmez.',
        'Cuando termina una tarea de VS Code, la extensión registra su código de salida y si terminó sin error. Un programa iniciado escribiendo una orden en el terminal, o con el botón habitual «Run Python File», no es una tarea y no se ve.',
      ),
    },
    example: {
      en: (f) => `S07 ran a task ${f.featuredRuns} times in eight weeks. Like most students, S07 ran programs with the Run button or the debugger, which the task events do not capture. In the class, ${f.runs} task runs were recorded next to ${f.debugRuns} debug runs.`,
      tr: (f) => `S07 sekiz haftada ${f.featuredRuns} kez görev çalıştırdı. Çoğu öğrenci gibi S07 de programları görev olaylarının yakalamadığı Çalıştır düğmesiyle ya da hata ayıklayıcıyla çalıştırdı. Sınıfta ${f.debugRuns} hata ayıklama çalıştırmasının yanında ${f.runs} görev çalıştırması kaydedildi.`,
      es: (f) => `S07 ejecutó una tarea ${f.featuredRuns} veces en ocho semanas. Como la mayoría, ejecutaba los programas con el botón de ejecutar o con el depurador, que los eventos de tareas no recogen. En la clase se registraron ${f.runs} ejecuciones de tareas frente a ${f.debugRuns} depuraciones.`,
    },
    takeaway: T('Task runs are rare next to debug runs. About six in ten task runs end without error.', 'Görev çalıştırmaları hata ayıklama çalıştırmalarının yanında seyrek. Görev çalıştırmalarının yaklaşık onda altısı hatasız bitiyor.', 'Las ejecuciones de tareas son poco frecuentes frente a las depuraciones. Unas seis de cada diez terminan sin error.'),
    purpose: {
      teacher: T('Do students test their programs after a change?', 'Öğrenciler bir değişiklikten sonra programlarını deniyor mu?', '¿Prueban los estudiantes sus programas después de un cambio?'),
      researcher: T('Does a run after an explanation end without error more often?', 'Bir açıklamadan sonraki çalıştırma daha sık mı hatasız bitiyor?', '¿Termina sin error con más frecuencia una ejecución posterior a una explicación?'),
    },
    raw: {
      intro: T('One event from the sample.', 'Örnekten bir olay.', 'Un evento de la muestra.'),
      snippets: [{ name: 'running-code', caption: EV }],
    },
    formulas: [
      {
        id: 'event.run_finished.success',
        heading: T('Ended without error', 'Hatasız bitti', 'Terminaron sin error'),
        text: T('True when the exit code of the task is 0.', 'Görevin çıkış kodu 0 olduğunda doğru.', 'Verdadero cuando el código de salida de la tarea es 0.'),
      },
      {
        id: 'metric.runs',
        heading: T('Running the code (dashboard)', 'Kodu çalıştırma (panel)', 'Ejecutar el código (panel)'),
        text: T('Runs of the period, runs without error, runs within 15 minutes after a question in the same session, and how many of those ended without error.', 'Dönemin çalıştırmaları, hatasız çalıştırmalar, aynı oturumda bir sorudan sonraki 15 dakika içindeki çalıştırmalar ve bunlardan kaçının hatasız bittiği.', 'Ejecuciones del periodo, ejecuciones sin error, ejecuciones en los 15 minutos siguientes a una pregunta en la misma sesión y cuántas de ellas terminaron sin error.'),
      },
    ],
    research: {
      stage: T('in the analysis (only if the course uses VS Code tasks)', 'analizde (yalnızca ders VS Code görevlerini kullanıyorsa)', 'en el análisis (solo si la asignatura usa tareas de VS Code)'),
      spss: T('`task_runs` and `task_success_share` per student.', 'Öğrenci başına `task_runs` ve `task_success_share`.', '`task_runs` y `task_success_share` por estudiante.'),
      analysis: T('Describe only. The measure is too incomplete for inference unless the course runs all programs as tasks.', 'Yalnızca betimleyin. Ders bütün programları görev olarak çalıştırmıyorsa ölçü çıkarım için fazla eksiktir.', 'Solo de forma descriptiva. La medida es demasiado incompleta para hacer inferencias, salvo que la asignatura ejecute todos los programas como tareas.'),
      sentence: T('Program runs were observable only when started as VS Code tasks, so they were reported descriptively.', 'Program çalıştırmaları yalnızca VS Code görevi olarak başlatıldığında gözlenebildiği için betimsel olarak raporlanmıştır.', 'Las ejecuciones de programas solo eran observables cuando se iniciaban como tareas de VS Code, por lo que se informaron de forma descriptiva.'),
    },
    limits: T(
      'Most beginner programs are not started as tasks, so this data misses most runs. The dashboard subtitle "Runs in the terminal" overstates what is observed. An exit code of 0 only means the program did not crash, not that its output was correct.',
      'Yeni başlayanların programlarının çoğu görev olarak başlatılmaz. Bu yüzden bu veri çalıştırmaların çoğunu kaçırır. Paneldeki "Terminaldeki çalıştırmalar" alt başlığı gözlenenden fazlasını söyler. 0 çıkış kodu yalnızca programın çökmediği anlamına gelir, çıktısının doğru olduğu anlamına gelmez.',
      'La mayoría de los programas de principiantes no se inician como tareas, así que estos datos no recogen la mayoría de las ejecuciones. El subtítulo del panel «Ejecuciones en el terminal» exagera lo que se observa. Un código de salida 0 solo significa que el programa no falló, no que su salida fuera correcta.',
    ),
    teacher: T(
      'Do not read a low number of runs as a lack of testing. Ask students directly how they run their programs.',
      'Az sayıda çalıştırmayı deneme eksikliği olarak okumayın. Öğrencilere programlarını nasıl çalıştırdıklarını doğrudan sorun.',
      'No interprete un número bajo de ejecuciones como falta de pruebas. Pregunte directamente a los estudiantes cómo ejecutan sus programas.',
    ),
  },

  // ------------------------------------------------------------------ helpful rating
  {
    slug: 'helpful-rating', category: 'self-report',
    items: ['interactions.helpful_rating', 'metric.rated_helpful_pct'],
    title: T('Rating', 'Değerlendirme', 'Valoración'),
    what: {
      heading: T('What is the helpful rating?', 'Faydalılık değerlendirmesi nedir?', '¿Qué es la valoración de utilidad?'),
      text: T(
        'Under each explanation the student can answer "Was this helpful?" with one click: Yes (1) or Not really (−1). The answer is optional. No answer leaves the value empty.',
        'Öğrenci her açıklamanın altındaki "Bu yardımcı oldu mu?" sorusunu tek tıkla yanıtlayabilir: Evet (1) ya da Pek değil (−1). Yanıt isteğe bağlıdır. Yanıt verilmezse değer boş kalır.',
        'Bajo cada explicación, el estudiante puede responder con un clic a «¿Te ha servido?»: Sí (1) o No mucho (−1). La respuesta es opcional. Sin respuesta, el valor queda vacío.',
      ),
    },
    example: {
      en: (f) => `S07 rated ${f.featuredUp} explanations as helpful and ${f.featuredDown} as not helpful, and left the rest without an answer. In the class, ${pc(f.ratedHelpfulPct, 'en')} of the given ratings were "Helpful".`,
      tr: (f) => `S07 ${f.featuredUp} açıklamayı faydalı, ${f.featuredDown} açıklamayı faydalı değil olarak değerlendirdi ve gerisini yanıtsız bıraktı. Sınıfta verilen değerlendirmelerin ${pc(f.ratedHelpfulPct, 'tr')} kadarı "Faydalı" idi.`,
      es: (f) => `S07 valoró ${f.featuredUp} explicaciones como útiles y ${f.featuredDown} como no útiles, y dejó el resto sin responder. En la clase, el ${pc(f.ratedHelpfulPct, 'es')} de las valoraciones fueron «Útil».`,
    },
    takeaway: T('About half of the answers get no rating. When students rate, most ratings are "Helpful".', 'Yanıtların yaklaşık yarısı değerlendirilmiyor. Öğrenciler değerlendirdiğinde çoğu "Faydalı" diyor.', 'Aproximadamente la mitad de las respuestas no reciben valoración. Cuando los estudiantes valoran, la mayoría dicen «Útil».'),
    purpose: {
      teacher: T('Do students find the explanations helpful?', 'Öğrenciler açıklamaları faydalı buluyor mu?', '¿Encuentran útiles los estudiantes las explicaciones?'),
      researcher: T('How do students judge the feedback, and does their judgement relate to what they did next?', 'Öğrenciler geri bildirimi nasıl değerlendiriyor ve bu değerlendirme sonraki davranışlarıyla ilişkili mi?', '¿Cómo juzgan los estudiantes la retroalimentación y se relaciona su juicio con lo que hicieron después?'),
    },
    raw: {
      intro: T('Two rated questions of S07.', 'S07’nin değerlendirilmiş iki sorusu.', 'Dos preguntas valoradas de S07.'),
      snippets: [{ name: 'helpful-rating', caption: tbl('interactions') }],
    },
    formulas: [{
      id: 'metric.rated_helpful_pct',
      heading: T('Rated helpful (dashboard)', 'Faydalı bulunan (panel)', 'Valorado útil (panel)'),
      text: T('Ratings of 1 divided by all given ratings (1 and −1) in the period. Questions without a rating are left out.', 'Dönemdeki 1 değerlendirmeleri, verilen tüm değerlendirmelere (1 ve −1) bölünür. Değerlendirmesi olmayan sorular dışarıda kalır.', 'Valoraciones de 1 divididas entre todas las valoraciones dadas (1 y −1) del periodo. Las preguntas sin valoración quedan fuera.'),
    }],
    research: {
      stage: T('during the intervention and after it', 'müdahale sırasında ve sonrasında', 'durante la intervención y después'),
      spss: T('`helpful_share` = ratings of 1 ÷ given ratings, and `rating_rate` = given ratings ÷ questions, per student. Missing: −97 when no rating was given.', 'Öğrenci başına `helpful_share` = 1 değerlendirmeleri ÷ verilen değerlendirmeler ve `rating_rate` = verilen değerlendirmeler ÷ sorular. Eksik değer: değerlendirme verilmediyse −97.', '`helpful_share` = valoraciones de 1 ÷ valoraciones dadas, y `rating_rate` = valoraciones dadas ÷ preguntas, por estudiante. Valor perdido: −97 si no hubo valoración.'),
      analysis: T('Correlate the helpful share with the TAM perceived usefulness score (Spearman).', 'Faydalı payını TAM algılanan fayda puanıyla ilişkilendirin (Spearman).', 'Correlacione la proporción de útiles con la puntuación TAM de utilidad percibida (Spearman).'),
      sentence: T('After each explanation, students could rate its helpfulness with one click, and unanswered ratings were treated as missing.', 'Öğrenciler her açıklamadan sonra onun faydasını tek tıkla değerlendirebilmiş, yanıtlanmayan değerlendirmeler eksik veri olarak ele alınmıştır.', 'Tras cada explicación, los estudiantes podían valorar su utilidad con un clic, y las valoraciones no respondidas se trataron como datos perdidos.'),
    },
    rq: { 'interactions.helpful_rating': { RQ5: 'outcome', RQ2: 'moderator' }, 'metric.rated_helpful_pct': { RQ5: 'outcome' } },
    limits: T(
      'The rating is optional, so the students and moments with a rating may differ from the rest. There is no time stamp for the answer, and a later answer from the history list replaces the first one. "Helpful" is a feeling, not a learning outcome.',
      'Değerlendirme isteğe bağlıdır. Bu yüzden değerlendirme yapan öğrenciler ve anlar diğerlerinden farklı olabilir. Yanıtın zaman damgası yoktur ve geçmiş listesinden verilen sonraki bir yanıt ilkinin yerini alır. "Faydalı" bir duygudur, bir öğrenme sonucu değildir.',
      'La valoración es opcional, así que los estudiantes y los momentos con valoración pueden diferir del resto. La respuesta no tiene marca de tiempo, y una respuesta posterior desde el historial sustituye a la primera. «Útil» es una percepción, no un resultado de aprendizaje.',
    ),
    teacher: T(
      'Read the explanations rated "Not helpful" in the dashboard. A pattern, such as one topic, can show where your own explanation in class can add most.',
      '"Faydalı değil" olarak değerlendirilen açıklamaları panelde okuyun. Tek bir konu gibi bir örüntü, derste kendi anlatımınızın en çok nerede katkı sağlayacağını gösterebilir.',
      'Lea en el panel las explicaciones valoradas como «No útil». Un patrón, como un tema concreto, puede mostrar dónde su propia explicación en clase aporta más.',
    ),
  },

  // ------------------------------------------------------------------ outcome
  {
    slug: 'outcome', category: 'self-report',
    items: ['interactions.self_reported_outcome'],
    title: T('Outcome', 'Sonuç', 'Resultado'),
    what: {
      heading: T('What is the self-reported outcome?', 'Öz bildirimli sonuç nedir?', '¿Qué es el resultado autoinformado?'),
      text: T(
        'Under each explanation the student can answer "How did it go?" with one click: Solved it, or Still stuck. It is the student\'s own view of the result, next to the behaviour the system measures.',
        'Öğrenci her açıklamanın altındaki "Sonuç ne oldu?" sorusunu tek tıkla yanıtlayabilir: Çözdüm ya da Hâlâ takıldım. Sistemin ölçtüğü davranışın yanında, öğrencinin sonuca kendi bakışıdır.',
        'Bajo cada explicación, el estudiante puede responder con un clic a «¿Cómo te fue?»: Lo resolví o Sigo atascado/a. Es la visión del propio estudiante sobre el resultado, junto al comportamiento que mide el sistema.',
      ),
    },
    example: {
      en: (f) => `S07 answered "Solved it" ${f.featuredSolved} times and "Still stuck" ${f.featuredStuck} times. In the class, ${pc(f.answeredPct, 'en')} of the questions got an answer.`,
      tr: (f) => `S07 ${f.featuredSolved} kez "Çözdüm", ${f.featuredStuck} kez "Hâlâ takıldım" yanıtını verdi. Sınıfta soruların ${pc(f.answeredPct, 'tr')} kadarı yanıtlandı.`,
      es: (f) => `S07 respondió «Lo resolví» ${f.featuredSolved} veces y «Sigo atascado/a» ${f.featuredStuck} veces. En la clase, el ${pc(f.answeredPct, 'es')} de las preguntas recibió respuesta.`,
    },
    takeaway: T('Questions that reached the fix have the highest share of "Still stuck".', '"Hâlâ takıldı" payı en yüksek olan sorular düzeltmeye ulaşan sorular.', 'Las preguntas que llegaron a la corrección tienen la mayor proporción de «Sigue atascado».'),
    purpose: {
      teacher: T('Which students say they are still stuck after an explanation?', 'Hangi öğrenciler bir açıklamadan sonra hâlâ takıldıklarını söylüyor?', '¿Qué estudiantes dicen que siguen atascados después de una explicación?'),
      researcher: T('Do the behavioural signals, such as the error going away, agree with what students report?', 'Hatanın ortadan kalkması gibi davranışsal işaretler öğrencilerin bildirdikleriyle örtüşüyor mu?', '¿Coinciden las señales de comportamiento, como la desaparición del error, con lo que informan los estudiantes?'),
    },
    raw: {
      intro: T('Two answered questions of S07.', 'S07’nin yanıtlanmış iki sorusu.', 'Dos preguntas respondidas de S07.'),
      snippets: [{ name: 'outcome', caption: tbl('interactions') }],
    },
    research: {
      stage: T('during the intervention and in the analysis (validation)', 'müdahale sırasında ve analizde (geçerleme)', 'durante la intervención y en el análisis (validación)'),
      spss: T('`solved_share` = solved ÷ answered, per student. Missing: −97 when there was no answer.', 'Öğrenci başına `solved_share` = çözdüm ÷ yanıtlanan. Eksik değer: yanıt yoksa −97.', '`solved_share` = resueltas ÷ respondidas, por estudiante. Valor perdido: −97 si no hubo respuesta.'),
      analysis: T('Cross-tabulate the answer with "Error gone after explaining" for error questions and report the agreement (Cohen\'s kappa).', 'Hata sorularında yanıtı "Açıklamadan sonra hata gitti" ile çapraz tabloya koyun ve uyumu raporlayın (Cohen kappa).', 'Cruce la respuesta con «Error resuelto tras explicar» en las preguntas sobre errores e informe del acuerdo (kappa de Cohen).'),
      sentence: T('Self-reported outcomes were compared with the disappearance of the diagnostic to validate the behavioural indicator.', 'Davranışsal göstergeyi geçerlemek için öz bildirimli sonuçlar tanılamanın kaybolmasıyla karşılaştırılmıştır.', 'Los resultados autoinformados se compararon con la desaparición del diagnóstico para validar el indicador de comportamiento.'),
    },
    rq: { 'interactions.self_reported_outcome': { RQ2: 'outcome', RQ3: 'outcome' } },
    limits: T(
      'Students answer at different moments, some right away and some later, and the time of the answer is not stored. The answer can be changed from the history list. Students who are stuck may leave without answering.',
      'Öğrenciler farklı anlarda yanıt verir, bazıları hemen, bazıları sonra, ve yanıtın zamanı saklanmaz. Yanıt geçmiş listesinden değiştirilebilir. Takılan öğrenciler yanıt vermeden ayrılabilir.',
      'Los estudiantes responden en momentos distintos, unos enseguida y otros más tarde, y el momento de la respuesta no se guarda. La respuesta se puede cambiar desde el historial. Quienes están atascados pueden irse sin responder.',
    ),
    teacher: T(
      '"Still stuck" is a direct request for help. The dashboard lists these students under "Needs attention", so check it during the lab.',
      '"Hâlâ takıldım" doğrudan bir yardım isteğidir. Panel bu öğrencileri "Dikkat gerektirenler" altında listeler, bu yüzden laboratuvar sırasında oraya bakın.',
      '«Sigo atascado/a» es una petición directa de ayuda. El panel muestra a estos estudiantes en «Requieren atención», así que revíselo durante el laboratorio.',
    ),
  },

  // ------------------------------------------------------------------ confidence
  {
    slug: 'confidence', category: 'self-report',
    items: ['interactions.post_confidence', 'metric.calibration'],
    title: T('Could do it alone', 'Tek başına yapabilir', 'Podría hacerlo solo'),
    what: {
      heading: T('What is the confidence answer?', 'Özgüven yanıtı nedir?', '¿Qué es la respuesta de confianza?'),
      text: T(
        'Under each explanation the student can answer "Could you do this one yourself now?" with Yes, Maybe or Not yet. The dashboard checks later whether the same error or concept came back.',
        'Öğrenci her açıklamanın altındaki "Bunu şimdi kendin yapabilir misin?" sorusunu Evet, Belki ya da Henüz değil diye yanıtlayabilir. Panel daha sonra aynı hatanın ya da kavramın geri gelip gelmediğini kontrol eder.',
        'Bajo cada explicación, el estudiante puede responder a «¿Podrías hacerlo tú ahora?» con Sí, Quizás o Todavía no. Más tarde, el panel comprueba si volvió el mismo error o concepto.',
      ),
    },
    example: {
      en: (f) => `S07 answered Yes ${f.featuredYes} time, Maybe ${f.featuredMaybe} times and Not yet ${f.featuredNo} times. In the class, students who said Yes came back later with the same error or concept in ${pc(f.yesAgainPct, 'en')} of the cases, and students who said No in ${pc(f.noAgainPct, 'en')}.`,
      tr: (f) => `S07 ${f.featuredYes} kez Evet, ${f.featuredMaybe} kez Belki ve ${f.featuredNo} kez Henüz değil yanıtını verdi. Sınıfta Evet diyen öğrenciler vakaların ${pc(f.yesAgainPct, 'tr')} kadarında, Hayır diyenler ise ${pc(f.noAgainPct, 'tr')} kadarında daha sonra aynı hata ya da kavramla geri geldi.`,
      es: (f) => `S07 respondió Sí ${f.featuredYes} vez, Quizás ${f.featuredMaybe} veces y Todavía no ${f.featuredNo} veces. En la clase, quienes dijeron Sí volvieron más tarde con el mismo error o concepto en el ${pc(f.yesAgainPct, 'es')} de los casos, y quienes dijeron No en el ${pc(f.noAgainPct, 'es')}.`,
    },
    takeaway: T('The less confident the answer, the more often the same error or concept came back. The answers carry some real information.', 'Yanıt ne kadar az güvenliyse, aynı hata ya da kavram o kadar sık geri geldi. Yanıtlar gerçek bir bilgi taşıyor.', 'Cuanto menos confiada era la respuesta, más a menudo volvió el mismo error o concepto. Las respuestas contienen información real.'),
    purpose: {
      teacher: T('Do students feel able to solve similar problems alone after an explanation?', 'Öğrenciler bir açıklamadan sonra benzer sorunları tek başına çözebilecek gibi hissediyor mu?', '¿Se sienten los estudiantes capaces de resolver solos problemas parecidos después de una explicación?'),
      researcher: T('Is the students\' confidence calibrated, that is, does it predict whether the problem comes back?', 'Öğrencilerin özgüveni ayarlı mı, yani sorunun geri gelip gelmeyeceğini yordayabiliyor mu?', '¿Está calibrada la confianza de los estudiantes, es decir, predice si el problema vuelve?'),
    },
    raw: {
      intro: T('Two answered questions of S07.', 'S07’nin yanıtlanmış iki sorusu.', 'Dos preguntas respondidas de S07.'),
      snippets: [{ name: 'confidence', caption: tbl('interactions') }],
    },
    formulas: [{
      id: 'metric.calibration',
      heading: T('Does confidence hold up? (dashboard)', 'Özgüven gerçekle örtüşüyor mu? (panel)', '¿Se sostiene la confianza? (panel)'),
      text: T('For each answer (Yes, Maybe, No) on the questions of the period: the number of answers, and how many of them were followed later, at any time, by a question of the same student with the same normalized error or the same concept.', 'Dönemin sorularındaki her yanıt (Evet, Belki, Hayır) için: yanıt sayısı ve bunlardan kaçının ardından, herhangi bir zamanda, aynı öğrencinin aynı normalleştirilmiş hataya ya da aynı kavrama sahip bir sorusunun geldiği.', 'Para cada respuesta (Sí, Quizás, No) en las preguntas del periodo: el número de respuestas y cuántas fueron seguidas más tarde, en cualquier momento, por una pregunta del mismo estudiante con el mismo error normalizado o el mismo concepto.'),
    }],
    research: {
      stage: T('during the intervention and in the analysis', 'müdahale sırasında ve analizde', 'durante la intervención y en el análisis'),
      spss: T('`conf_yes_share` = Yes ÷ answers per student, and a calibration variable = share of Yes answers not followed by a repeat.', 'Öğrenci başına `conf_yes_share` = Evet ÷ yanıtlar ve bir ayar değişkeni = ardından tekrar gelmeyen Evet yanıtlarının payı.', '`conf_yes_share` = Sí ÷ respuestas por estudiante, y una variable de calibración = proporción de respuestas Sí no seguidas de una repetición.'),
      analysis: T('Test whether the answer predicts a later repeat with a mixed logistic regression (student as random effect).', 'Yanıtın sonraki bir tekrarı yordayıp yordamadığını karma lojistik regresyonla sınayın (öğrenci rastgele etki olarak).', 'Contraste si la respuesta predice una repetición posterior con una regresión logística mixta (estudiante como efecto aleatorio).'),
      sentence: T('Calibration was assessed as the proportion of confident answers that were not followed by a later request about the same error or concept.', 'Ayar, ardından aynı hata ya da kavram hakkında sonraki bir istek gelmeyen güvenli yanıtların oranı olarak değerlendirilmiştir.', 'La calibración se evaluó como la proporción de respuestas seguras que no fueron seguidas de una petición posterior sobre el mismo error o concepto.'),
    },
    rq: { 'interactions.post_confidence': { RQ3: 'predictor', RQ4: 'predictor' }, 'metric.calibration': { RQ3: 'descriptive' } },
    limits: T(
      'The check has no time limit, so answers from early weeks have more time for a repeat than late ones. A repeat is only visible when the student asks again, not when they meet the error and fix it alone. Concepts written differently are not matched.',
      'Kontrolün süre sınırı yoktur. Bu yüzden erken haftaların yanıtlarının bir tekrar için geç haftalarınkinden daha fazla zamanı vardır. Bir tekrar yalnızca öğrenci yeniden sorduğunda görünür, hatayla karşılaşıp tek başına düzelttiğinde görünmez. Farklı yazılan kavramlar eşleşmez.',
      'La comprobación no tiene límite de tiempo, así que las respuestas de las primeras semanas tienen más tiempo para una repetición que las últimas. Una repetición solo se ve si el estudiante vuelve a preguntar, no si encuentra el error y lo corrige solo. Los conceptos escritos de forma distinta no coinciden.',
    ),
    teacher: T(
      'When a student often answers "Not yet", give one short practice task on the same idea and ask them to try it without the extension.',
      'Bir öğrenci sık sık "Henüz değil" diyorsa, aynı fikir üzerine kısa bir alıştırma verin ve eklentiyi kullanmadan denemesini isteyin.',
      'Si un estudiante responde a menudo «Todavía no», proponga una práctica breve sobre la misma idea y pídale que la intente sin la extensión.',
    ),
  },
];
