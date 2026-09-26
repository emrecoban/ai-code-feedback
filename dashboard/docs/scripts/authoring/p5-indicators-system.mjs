import { dec, pc } from './gen.mjs';

const T = (en, tr, es) => ({ en, tr, es });
const code = (s) => `\`${s}\``;
const some = T('(some columns)', '(bazı sütunlar)', '(algunas columnas)');
const tbl = (name, part = true) => ({ en: `${code(name)}${part ? ` ${some.en}` : ''}`, tr: `${code(name)}${part ? ` ${some.tr}` : ''}`, es: `${code(name)}${part ? ` ${some.es}` : ''}` });
const rpc = (name) => T(`Part of the JSON that ${code(name)} returns`, `${code(name)} işlevinin döndürdüğü JSON’un bir parçası`, `Parte del JSON que devuelve ${code(name)}`);
const DURING = T('during the intervention and in the analysis', 'müdahale sırasında ve analizde', 'durante la intervención y en el análisis');
const ANALYSIS = T('in the analysis', 'analizde', 'en el análisis');
const DURING_ONLY = T('during the intervention (to follow the class)', 'müdahale sırasında (sınıfı izlemek için)', 'durante la intervención (para seguir a la clase)');
const QUALITY = T('in the analysis (data quality and Method section)', 'analizde (veri niteliği ve Yöntem bölümü)', 'en el análisis (calidad de los datos y sección de Método)');
const EV = tbl('events', false);

export default [
  // ------------------------------------------------------------------ hint was enough
  {
    slug: 'hint-was-enough', category: 'indicators',
    items: ['metric.hint_enough_pct'],
    title: T('Hint was enough', 'İpucu yeterli oldu', 'Bastó con la pista'),
    what: {
      heading: T('What does "hint was enough" mean?', '"İpucu yeterli oldu" ne demek?', '¿Qué significa «bastó con la pista»?'),
      text: T(
        'It is the share of questions in which the student did not open the rule (L2) or the fix (L3). The first hint, which shows the error in plain words and where it is (L0–L1), was enough to go on.',
        'Öğrencinin kuralı (L2) ya da düzeltmeyi (L3) açmadığı soruların payıdır. Hatayı sade sözcüklerle ve yerini gösteren ilk ipucu (L0–L1) devam etmek için yeterli oldu.',
        'Es la proporción de preguntas en las que el estudiante no abrió la regla (L2) ni la corrección (L3). La primera pista, que explica el error con palabras sencillas y dónde está (L0–L1), bastó para seguir.',
      ),
    },
    example: {
      en: (f) => `S07 asked ${f.featuredQuestions} questions and stopped after the first hint in ${f.featuredSolvedAlone} of them, which is ${pc(f.featuredPct, 'en')}. The class value was ${pc(f.classPct, 'en')}. The weekly version of this rate is on the page [Independence trend](./independence-trend#hint-enough).`,
      tr: (f) => `S07 ${f.featuredQuestions} soru sordu ve bunların ${f.featuredSolvedAlone} tanesinde ilk ipucundan sonra durdu. Bu ${pc(f.featuredPct, 'tr')} demektir. Sınıfın değeri ${pc(f.classPct, 'tr')} oldu. Bu oranın haftalık sürümü [Bağımsızlık eğilimi](./independence-trend#hint-enough) sayfasındadır.`,
      es: (f) => `S07 hizo ${f.featuredQuestions} preguntas y se detuvo tras la primera pista en ${f.featuredSolvedAlone}, es decir, el ${pc(f.featuredPct, 'es')}. El valor de la clase fue del ${pc(f.classPct, 'es')}. La versión semanal de esta tasa está en la página [Tendencia de autonomía](./independence-trend#hint-enough).`,
    },
    takeaway: T('Most students stopped after the first hint in more than 40% of their questions. S07 is in the 40–60% group.', 'Öğrencilerin çoğu sorularının %40’tan fazlasında ilk ipucundan sonra durdu. S07 %40–60 grubunda.', 'La mayoría de los estudiantes se detuvieron tras la primera pista en más del 40% de sus preguntas. S07 está en el grupo del 40–60%.'),
    purpose: {
      teacher: T('How often is a small hint enough for my students?', 'Öğrencilerim için küçük bir ipucu ne sıklıkla yeterli oluyor?', '¿Con qué frecuencia basta una pista pequeña para mis estudiantes?'),
      researcher: T('How much support do students need per question, as one measure of independence?', 'Bağımsızlığın bir ölçüsü olarak öğrenciler soru başına ne kadar desteğe ihtiyaç duyuyor?', '¿Cuánto apoyo necesitan los estudiantes por pregunta, como una medida de autonomía?'),
    },
    raw: {
      intro: T('The value comes from the hint depth of each question. The row of S07 in the student list of the dashboard:', 'Değer her sorunun ipucu derinliğinden gelir. Paneldeki öğrenci listesinde S07’nin satırı:', 'El valor procede de la profundidad de cada pregunta. La fila de S07 en la lista de estudiantes del panel:'),
      snippets: [{ name: 'hint-was-enough', caption: rpc('dashboard_students') }],
    },
    formulas: [{
      id: 'metric.hint_enough_pct',
      heading: T('Hint was enough (dashboard)', 'İpucu yeterli oldu (panel)', 'Bastó con la pista (panel)'),
      text: T('Questions of the period that ended at L0–L1 (hint depth 0 or 1) divided by all questions of the period. For one student the dashboard uses the same rule on that student\'s questions.', 'Dönemin L0–L1’de (ipucu derinliği 0 ya da 1) biten soruları, dönemin tüm sorularına bölünür. Tek bir öğrenci için panel aynı kuralı o öğrencinin sorularına uygular.', 'Preguntas del periodo que terminaron en L0–L1 (profundidad 0 o 1) divididas entre todas las preguntas del periodo. Para un estudiante, el panel aplica la misma regla a sus preguntas.'),
    }],
    research: {
      stage: DURING,
      spss: T('`hint_enough_pct` per student over the whole study, and per week for trend analyses.', 'Tüm çalışma boyunca öğrenci başına `hint_enough_pct` ve eğilim analizleri için hafta başına.', '`hint_enough_pct` por estudiante en todo el estudio, y por semana para los análisis de tendencia.'),
      analysis: T('Compare the early and late weeks with a paired t-test, and correlate the overall value with the learning gain.', 'Erken ve geç haftaları eşleştirilmiş t-testiyle karşılaştırın ve genel değeri öğrenme kazancıyla ilişkilendirin.', 'Compare las primeras y las últimas semanas con una prueba t para muestras relacionadas, y correlacione el valor global con la ganancia de aprendizaje.'),
      sentence: T('The proportion of help requests that ended after the first hint level was used as an indicator of independence.', 'İlk ipucu düzeyinden sonra biten yardım isteklerinin oranı bağımsızlığın bir göstergesi olarak kullanılmıştır.', 'La proporción de peticiones de ayuda que terminaron tras el primer nivel de pista se usó como indicador de autonomía.'),
    },
    rq: { 'metric.hint_enough_pct': { RQ2: 'outcome', RQ3: 'outcome', RQ4: 'predictor' } },
    limits: T(
      'A student who stopped after the first hint may have given up, asked a classmate or solved the problem. The rate says nothing about errors fixed without asking. The level L1 is never stored alone, so L0 and L1 always appear together.',
      'İlk ipucundan sonra duran bir öğrenci vazgeçmiş, bir arkadaşına sormuş ya da sorunu çözmüş olabilir. Oran sormadan düzeltilen hatalar hakkında bir şey söylemez. L1 düzeyi hiçbir zaman tek başına saklanmaz, bu yüzden L0 ve L1 hep birlikte görünür.',
      'Un estudiante que se detuvo tras la primera pista pudo rendirse, preguntar a un compañero o resolver el problema. La tasa no dice nada de los errores corregidos sin preguntar. El nivel L1 nunca se guarda solo, así que L0 y L1 aparecen siempre juntos.',
    ),
    teacher: T(
      'Read this rate together with "Error gone after explaining". A high rate with errors that go away is a good sign. A high rate with errors that stay can mean students give up early.',
      'Bu oranı "Açıklamadan sonra hata gitti" ile birlikte okuyun. Hataların gittiği yüksek bir oran iyi bir işarettir. Hataların kaldığı yüksek bir oran öğrencilerin erken vazgeçtiği anlamına gelebilir.',
      'Lea esta tasa junto a «Error resuelto tras explicar». Una tasa alta con errores que desaparecen es buena señal. Una tasa alta con errores que siguen puede indicar que los estudiantes se rinden pronto.',
    ),
  },

  // ------------------------------------------------------------------ sessions without help
  {
    slug: 'sessions-without-help', category: 'indicators',
    items: ['metric.sessions_without_help_pct', 'metric.analytics_sessions_without_help'],
    title: T('Sessions without help', 'Yardımsız oturumlar', 'Sesiones sin ayuda'),
    what: {
      heading: T('What is a session without help?', 'Yardımsız oturum nedir?', '¿Qué es una sesión sin ayuda?'),
      text: T(
        'It is a session in which the student asked no question at all. The dashboard shows the share of such sessions among all sessions of the period.',
        'Öğrencinin hiç soru sormadığı bir oturumdur. Panel bu tür oturumların dönemin tüm oturumları içindeki payını gösterir.',
        'Es una sesión en la que el estudiante no hizo ninguna pregunta. El panel muestra la proporción de estas sesiones entre todas las del periodo.',
      ),
    },
    example: {
      en: (f) => `${pc(f.featuredPct, 'en')} of the sessions of S07 had no question. One of them was an empty session: VS Code was opened and closed again without any activity. Without empty sessions the value of S07 falls to ${pc(f.featuredPctNoEmpty, 'en')}, and the class value from ${pc(f.classPct, 'en')} to ${pc(f.classPctNoEmpty, 'en')}.`,
      tr: (f) => `S07’nin oturumlarının ${pc(f.featuredPct, 'tr')} kadarında hiç soru yoktu. Bunlardan biri boş bir oturumdu: VS Code hiçbir etkinlik olmadan açılıp yeniden kapandı. Boş oturumlar olmadan S07’nin değeri ${pc(f.featuredPctNoEmpty, 'tr')} düzeyine, sınıfın değeri ise ${pc(f.classPct, 'tr')} düzeyinden ${pc(f.classPctNoEmpty, 'tr')} düzeyine iner.`,
      es: (f) => `El ${pc(f.featuredPct, 'es')} de las sesiones de S07 no tuvo ninguna pregunta. Una de ellas era una sesión vacía: se abrió VS Code y se cerró sin actividad. Sin sesiones vacías, el valor de S07 baja al ${pc(f.featuredPctNoEmpty, 'es')}, y el de la clase del ${pc(f.classPct, 'es')} al ${pc(f.classPctNoEmpty, 'es')}.`,
    },
    takeaway: T('Empty sessions raise the rate. Leaving them out gives a fairer picture of real work without help.', 'Boş oturumlar oranı yükseltiyor. Onları dışarıda bırakmak yardımsız gerçek çalışmanın daha adil bir resmini veriyor.', 'Las sesiones vacías elevan la tasa. Excluirlas da una imagen más justa del trabajo real sin ayuda.'),
    purpose: {
      teacher: T('Do students also work without asking the tool?', 'Öğrenciler araca sormadan da çalışıyor mu?', '¿Trabajan también los estudiantes sin preguntar a la herramienta?'),
      researcher: T('Does the share of sessions without help grow over the weeks?', 'Yardımsız oturumların payı haftalar içinde artıyor mu?', '¿Crece la proporción de sesiones sin ayuda con las semanas?'),
    },
    raw: {
      intro: T('An empty session and a normal session of S07.', 'S07’nin boş bir oturumu ve normal bir oturumu.', 'Una sesión vacía y una sesión normal de S07.'),
      snippets: [{ name: 'sessions-without-help', caption: tbl('coding_sessions') }],
    },
    formulas: [
      {
        id: 'metric.sessions_without_help_pct',
        heading: T('Sessions without help (dashboard)', 'Yardımsız oturumlar (panel)', 'Sesiones sin ayuda (panel)'),
        text: T('Sessions of the period with no question linked to them, divided by all sessions of the period. Empty sessions are included.', 'Dönemin kendisine bağlı hiç soru olmayan oturumları, dönemin tüm oturumlarına bölünür. Boş oturumlar da dahildir.', 'Sesiones del periodo sin ninguna pregunta vinculada, divididas entre todas las sesiones del periodo. Se incluyen las sesiones vacías.'),
      },
      {
        id: 'metric.analytics_sessions_without_help',
        heading: T('Sessions without help report (SQL)', 'Yardımsız oturumlar raporu (SQL)', 'Informe de sesiones sin ayuda (SQL)'),
        text: T('A read-only SQL report in the repository. Per student: sessions, sessions without a question, their share, errors fixed without asking and help offers.', 'Depodaki salt okunur bir SQL raporu. Öğrenci başına: oturumlar, sorusuz oturumlar, bunların payı, sormadan düzeltilen hatalar ve yardım teklifleri.', 'Un informe SQL de solo lectura del repositorio. Por estudiante: sesiones, sesiones sin preguntas, su proporción, errores corregidos sin preguntar y ofertas de ayuda.'),
      },
    ],
    research: {
      stage: DURING,
      spss: T('`no_help_share` per student, computed without empty sessions (active time 0).', 'Öğrenci başına `no_help_share`, boş oturumlar (aktif süre 0) olmadan hesaplanır.', '`no_help_share` por estudiante, calculado sin las sesiones vacías (tiempo activo 0).'),
      analysis: T('Test the change from the first to the second half of the course (paired Wilcoxon test).', 'Dersin ilk yarısından ikinci yarısına değişimi sınayın (eşleştirilmiş Wilcoxon testi).', 'Contraste el cambio de la primera a la segunda mitad del curso (prueba de Wilcoxon para muestras relacionadas).'),
      sentence: T('The proportion of coding sessions without any help request was computed after excluding sessions without editor activity.', 'Hiç yardım isteği olmayan kodlama oturumlarının oranı, editör etkinliği olmayan oturumlar çıkarıldıktan sonra hesaplanmıştır.', 'La proporción de sesiones de programación sin ninguna petición de ayuda se calculó tras excluir las sesiones sin actividad en el editor.'),
    },
    rq: { 'metric.sessions_without_help_pct': { RQ3: 'outcome' } },
    limits: T(
      'The dashboard counts empty sessions, and a reload of VS Code creates one. A session without help can also be a short session in which the student only read code. It does not show that the student met a difficulty and solved it alone.',
      'Panel boş oturumları da sayar ve VS Code’un yeniden yüklenmesi bir tane oluşturur. Yardımsız bir oturum, öğrencinin yalnızca kod okuduğu kısa bir oturum da olabilir. Öğrencinin bir güçlükle karşılaşıp onu tek başına çözdüğünü göstermez.',
      'El panel cuenta las sesiones vacías, y recargar VS Code crea una. Una sesión sin ayuda también puede ser una sesión corta en la que el estudiante solo leyó código. No muestra que el estudiante encontrara una dificultad y la resolviera solo.',
    ),
    teacher: T(
      'Do not read a low rate as a problem in the lab: most lab tasks lead to at least one question. Look at the trend over the weeks instead.',
      'Düşük bir oranı laboratuvarda bir sorun olarak okumayın: çoğu laboratuvar görevi en az bir soruya yol açar. Bunun yerine haftalar içindeki eğilime bakın.',
      'No interprete una tasa baja como un problema en el laboratorio: la mayoría de las tareas llevan al menos a una pregunta. Mire mejor la tendencia a lo largo de las semanas.',
    ),
  },

  // ------------------------------------------------------------------ needs attention
  {
    slug: 'needs-attention', category: 'indicators',
    items: ['metric.needs_attention'],
    title: T('Needs attention', 'Dikkat gerektirenler', 'Requieren atención'),
    what: {
      heading: T('What does "needs attention" mean?', '"Dikkat gerektirenler" ne demek?', '¿Qué significa «requieren atención»?'),
      text: T(
        'The dashboard lists students who meet at least one of six rules in the chosen period, with the reasons. The list helps the teacher decide whom to visit first in a lab.',
        'Panel, seçilen dönemde altı kuraldan en az birini karşılayan öğrencileri nedenleriyle birlikte listeler. Liste, öğretmenin bir laboratuvarda önce kimin yanına gideceğine karar vermesine yardım eder.',
        'El panel muestra a los estudiantes que cumplen al menos una de seis reglas en el periodo elegido, con los motivos. La lista ayuda al profesorado a decidir a quién atender primero en un laboratorio.',
      ),
    },
    example: {
      en: (f) => `Over the whole eight weeks, ${f.flagged} of ${f.cohort} students are on the list, S07 among them. For example, ${f.stillStuck} students answered "Still stuck" at least once. In week 8 alone, ${f.lastWeekFlagged} students are on the list, and S07 is ${f.featuredLastWeek ? 'one of them' : 'not'}.`,
      tr: (f) => `Sekiz haftanın tamamında ${f.cohort} öğrencinin ${f.flagged} tanesi listede, S07 de dahil. Örneğin ${f.stillStuck} öğrenci en az bir kez "Hâlâ takıldım" yanıtını verdi. Yalnızca sekizinci haftada listede ${f.lastWeekFlagged} öğrenci var ve ${f.featuredLastWeek ? 'S07 de bunların arasında' : 'S07 bunların arasında değil'}.`,
      es: (f) => `En las ocho semanas completas, ${f.flagged} de ${f.cohort} estudiantes están en la lista, S07 entre ellos. Por ejemplo, ${f.stillStuck} estudiantes respondieron «Sigo atascado/a» al menos una vez. Solo en la semana 8 hay ${f.lastWeekFlagged} estudiantes en la lista, y S07 ${f.featuredLastWeek ? 'está entre ellos' : 'no está'}.`,
    },
    takeaway: T('Over a long period almost every student meets a rule. The list is useful for a short period, such as one lab week.', 'Uzun bir dönemde neredeyse her öğrenci bir kuralı karşılıyor. Liste bir laboratuvar haftası gibi kısa bir dönem için yararlı.', 'En un periodo largo casi todos los estudiantes cumplen alguna regla. La lista es útil para un periodo corto, como una semana de laboratorio.'),
    purpose: {
      teacher: T('Who needs my help now?', 'Şu anda kimin yardımıma ihtiyacı var?', '¿Quién necesita mi ayuda ahora?'),
      researcher: T('Can simple rules on the log data find students at risk, and do they agree with the test results?', 'Kayıt verisi üzerindeki basit kurallar risk altındaki öğrencileri bulabilir mi ve bunlar test sonuçlarıyla örtüşüyor mu?', '¿Pueden unas reglas sencillas sobre los registros detectar estudiantes en riesgo, y coinciden con los resultados de los tests?'),
    },
    raw: {
      intro: T('One entry of the list over the whole range.', 'Tüm aralık için listeden bir kayıt.', 'Una entrada de la lista en todo el rango.'),
      snippets: [{ name: 'needs-attention', caption: rpc('dashboard_overview') }],
    },
    formulas: [{
      id: 'metric.needs_attention',
      heading: T('The six rules', 'Altı kural', 'Las seis reglas'),
      text: T(
        'Same error 3+ times (the same normalized error asked about three or more times). Said "still stuck" (at least one such answer). Needed the fix for 70%+ of 5+ questions. 8+ edits before asking on average (at least two measured questions). 2+ "not helpful" ratings. No activity for 7+ days (this rule ignores the period). Students are sorted by the number of reasons.',
        'Aynı hata 3+ kez (aynı normalleştirilmiş hata hakkında üç ya da daha fazla soru). "Hâlâ takıldım" dedi (en az bir böyle yanıt). 5+ sorunun %70+ kadarında çözümü açtı. Sormadan önce ortalama 8+ düzenleme (en az iki ölçülmüş soru). 2+ "faydalı değil" değerlendirmesi. 7+ gündür etkinlik yok (bu kural dönemi dikkate almaz). Öğrenciler neden sayısına göre sıralanır.',
        'Mismo error 3+ veces (el mismo error normalizado preguntado tres o más veces). Dijo «sigo atascado» (al menos una respuesta así). Necesitó la solución en el 70%+ de 5+ preguntas. 8+ ediciones de media antes de preguntar (al menos dos preguntas medidas). 2+ valoraciones «no útil». Sin actividad en 7+ días (esta regla ignora el periodo). Los estudiantes se ordenan por número de motivos.',
      ),
    }],
    research: {
      stage: DURING_ONLY,
      spss: T('Not needed as such. If you want a flag variable, compute each rule per week from the raw data.', 'Olduğu gibi gerekmez. Bir işaret değişkeni istiyorsanız her kuralı ham veriden hafta başına hesaplayın.', 'No es necesario como tal. Si quiere una variable indicadora, calcule cada regla por semana a partir de los datos brutos.'),
      analysis: T('Check whether the number of weeks a student was flagged relates to a low post-test score (Spearman).', 'Bir öğrencinin işaretlendiği hafta sayısının düşük son test puanıyla ilişkili olup olmadığını kontrol edin (Spearman).', 'Compruebe si el número de semanas en que un estudiante aparece en la lista se relaciona con una puntuación baja en el postest (Spearman).'),
      sentence: T('The dashboard flagged students for the instructor with six rule-based indicators computed for the selected period.', 'Panel, öğrencileri öğretmen için seçilen dönem üzerinden hesaplanan altı kurala dayalı göstergeyle işaretlemiştir.', 'El panel señalaba estudiantes al profesorado con seis indicadores basados en reglas calculados para el periodo elegido.'),
    },
    limits: T(
      'The rules count events and do not grow stricter with the length of the period, so over many weeks almost everyone is flagged. A student who asks nothing is flagged only by the inactivity rule. The list is a prompt for the teacher, not a diagnosis.',
      'Kurallar olayları sayar ve dönemin uzunluğuyla birlikte sıkılaşmaz. Bu yüzden birçok hafta boyunca neredeyse herkes işaretlenir. Hiç soru sormayan bir öğrenci yalnızca etkinlik yokluğu kuralıyla işaretlenir. Liste öğretmen için bir hatırlatmadır, bir tanı değildir.',
      'Las reglas cuentan eventos y no se vuelven más estrictas con la duración del periodo, así que en muchas semanas casi todos aparecen. Un estudiante que no pregunta nada solo aparece por la regla de inactividad. La lista es un aviso para el profesorado, no un diagnóstico.',
    ),
    teacher: T(
      'Set the period to the current lab or week before you read the list. Start with students who have two or more reasons.',
      'Listeyi okumadan önce dönemi o anki laboratuvara ya da haftaya ayarlayın. İki ya da daha fazla nedeni olan öğrencilerle başlayın.',
      'Ajuste el periodo al laboratorio o a la semana actual antes de leer la lista. Empiece por los estudiantes con dos o más motivos.',
    ),
  },

  // ------------------------------------------------------------------ online and active
  {
    slug: 'online-and-active', category: 'indicators',
    items: ['metric.online_now', 'metric.active_students', 'metric.new_students', 'metric.last_active'],
    title: T('Online and active students', 'Çevrimiçi ve aktif öğrenciler', 'Estudiantes en línea y activos'),
    what: {
      heading: T('What do "online" and "active" mean?', '"Çevrimiçi" ve "aktif" ne demek?', '¿Qué significan «en línea» y «activo»?'),
      text: T(
        'The dashboard shows four simple counts. Online now: students with any trace in the last 10 minutes. Active students: students with any trace in the period. New students: accounts created in the period. Last active: the latest trace of each student.',
        'Panel dört basit sayı gösterir. Şu an çevrimiçi: son 10 dakikada herhangi bir izi olan öğrenciler. Aktif öğrenciler: dönemde herhangi bir izi olan öğrenciler. Yeni öğrenciler: dönemde oluşturulan hesaplar. Son etkinlik: her öğrencinin en son izi.',
        'El panel muestra cuatro recuentos sencillos. En línea ahora: estudiantes con alguna huella en los últimos 10 minutos. Estudiantes activos: estudiantes con alguna huella en el periodo. Estudiantes nuevos: cuentas creadas en el periodo. Última actividad: la huella más reciente de cada estudiante.',
      ),
    },
    example: {
      en: (f) => `In the sample, ${f.active} of ${f.total} students were active over the eight weeks, ${f.week1} in week 1 and ${f.week8} in week 8. While S07 works in a lab, the extension sends activity every 3 minutes, so S07 stays "online" in the dashboard.`,
      tr: (f) => `Örnekte ${f.total} öğrencinin ${f.active} tanesi sekiz hafta boyunca aktifti, birinci haftada ${f.week1}, sekizinci haftada ${f.week8}. S07 bir laboratuvarda çalışırken eklenti her 3 dakikada bir etkinlik gönderir. Bu yüzden S07 panelde "çevrimiçi" kalır.`,
      es: (f) => `En la muestra, ${f.active} de ${f.total} estudiantes estuvieron activos en las ocho semanas, ${f.week1} en la semana 1 y ${f.week8} en la semana 8. Mientras S07 trabaja en un laboratorio, la extensión envía actividad cada 3 minutos, así que S07 sigue «en línea» en el panel.`,
    },
    takeaway: T('Almost every student was active in every week of the course.', 'Neredeyse her öğrenci dersin her haftasında aktifti.', 'Casi todos los estudiantes estuvieron activos todas las semanas del curso.'),
    purpose: {
      teacher: T('Who is working right now, and who has not been seen for a while?', 'Şu anda kim çalışıyor ve kim bir süredir görünmüyor?', '¿Quién está trabajando ahora y a quién hace tiempo que no se ve?'),
      researcher: T('How many students took part in each week, as a base for attrition and missing data?', 'Kayıp ve eksik veri için bir temel olarak her haftaya kaç öğrenci katıldı?', '¿Cuántos estudiantes participaron cada semana, como base para el abandono y los datos perdidos?'),
    },
    raw: {
      intro: T('The row of S07 in the student list of the dashboard.', 'Paneldeki öğrenci listesinde S07’nin satırı.', 'La fila de S07 en la lista de estudiantes del panel.'),
      snippets: [{ name: 'online-and-active', caption: rpc('dashboard_students') }],
    },
    formulas: [
      {
        id: 'metric.online_now',
        heading: T('Online now (dashboard)', 'Şu an çevrimiçi (panel)', 'En línea ahora (panel)'),
        text: T('Students with a session start, an activity update, a question or an event in the last 10 minutes. It ignores the period. The 10 minutes must stay longer than the 3-minute update of the extension.', 'Son 10 dakikada bir oturum başlangıcı, bir etkinlik güncellemesi, bir soru ya da bir olayı olan öğrenciler. Dönemi dikkate almaz. 10 dakika, eklentinin 3 dakikalık güncellemesinden uzun kalmalıdır.', 'Estudiantes con un inicio de sesión, una actualización de actividad, una pregunta o un evento en los últimos 10 minutos. Ignora el periodo. Los 10 minutos deben ser más que la actualización de 3 minutos de la extensión.'),
      },
      {
        id: 'metric.active_students',
        heading: T('Active students (dashboard)', 'Aktif öğrenci (panel)', 'Estudiantes activos (panel)'),
        text: T('Students with any trace in the period: a session start, an activity update, a question or an event.', 'Dönemde herhangi bir izi olan öğrenciler: bir oturum başlangıcı, bir etkinlik güncellemesi, bir soru ya da bir olay.', 'Estudiantes con alguna huella en el periodo: un inicio de sesión, una actualización de actividad, una pregunta o un evento.'),
      },
      {
        id: 'metric.new_students',
        heading: T('New students (dashboard)', 'Yeni öğrenci (panel)', 'Estudiantes nuevos (panel)'),
        text: T('Accounts created in the period.', 'Dönemde oluşturulan hesaplar.', 'Cuentas creadas en el periodo.'),
      },
      {
        id: 'metric.last_active',
        heading: T('Last active (dashboard)', 'Son etkinlik (panel)', 'Última actividad (panel)'),
        text: T('The latest of the session start, the activity update, the question time and the event time of the student, over all time.', 'Öğrencinin oturum başlangıcı, etkinlik güncellemesi, soru zamanı ve olay zamanından en sonuncusu, tüm zamanlar üzerinden.', 'La más reciente entre el inicio de sesión, la actualización de actividad, la hora de las preguntas y la de los eventos del estudiante, en todo el tiempo.'),
      },
    ],
    research: {
      stage: T('during the intervention and in the analysis (participation)', 'müdahale sırasında ve analizde (katılım)', 'durante la intervención y en el análisis (participación)'),
      spss: T('`weeks_active` per student (number of weeks with any trace).', 'Öğrenci başına `weeks_active` (herhangi bir izi olan hafta sayısı).', '`weeks_active` por estudiante (número de semanas con alguna huella).'),
      analysis: T('Report participation per week in the Method section, and decide on a minimum number of active weeks before the main analysis.', 'Yöntem bölümünde hafta başına katılımı raporlayın ve ana analizden önce en az aktif hafta sayısına karar verin.', 'Informe de la participación semanal en la sección de Método y decida un número mínimo de semanas activas antes del análisis principal.'),
      sentence: T('Participation was described as the number of students with any recorded activity in each week of the intervention.', 'Katılım, müdahalenin her haftasında kaydedilmiş herhangi bir etkinliği olan öğrenci sayısı olarak betimlenmiştir.', 'La participación se describió como el número de estudiantes con alguna actividad registrada en cada semana de la intervención.'),
    },
    limits: T(
      'An empty session or a single event is enough to count as active. The dashboard counts research events as activity, but the daily sheet of its export does not, so the two numbers can differ. Being active says nothing about the amount of work.',
      'Boş bir oturum ya da tek bir olay aktif sayılmak için yeterlidir. Panel araştırma olaylarını etkinlik olarak sayar, ama dışa aktarımının günlük sayfası saymaz. Bu yüzden iki sayı farklı olabilir. Aktif olmak çalışmanın miktarı hakkında bir şey söylemez.',
      'Una sesión vacía o un solo evento bastan para contar como activo. El panel cuenta los eventos de investigación como actividad, pero la hoja diaria de su exportación no, así que los dos números pueden diferir. Estar activo no dice nada sobre la cantidad de trabajo.',
    ),
    teacher: T(
      'At the start of a lab, "Online now" shows who has signed in. A student who is missing may have a problem with the extension.',
      'Bir laboratuvarın başında "Şu an çevrimiçi" kimin giriş yaptığını gösterir. Görünmeyen bir öğrencinin eklentiyle ilgili bir sorunu olabilir.',
      'Al inicio de un laboratorio, «En línea ahora» muestra quién ha iniciado sesión. A un estudiante que no aparece puede fallarle la extensión.',
    ),
  },

  // ------------------------------------------------------------------ questions over time
  {
    slug: 'questions-over-time', category: 'indicators',
    items: ['metric.questions', 'metric.questions_total'],
    title: T('Questions over time', 'Zaman içinde sorular', 'Preguntas a lo largo del tiempo'),
    what: {
      heading: T('What is the number of questions?', 'Soru sayısı nedir?', '¿Qué es el número de preguntas?'),
      text: T(
        'Each help request that received an answer is one question, that is, one row in the `interactions` table. The dashboard counts them per period and compares the count with the previous period of the same length.',
        'Yanıt alan her yardım isteği bir sorudur, yani `interactions` tablosunda bir satırdır. Panel bunları dönem başına sayar ve sayıyı aynı uzunluktaki önceki dönemle karşılaştırır.',
        'Cada petición de ayuda que recibió respuesta es una pregunta, es decir, una fila de la tabla `interactions`. El panel las cuenta por periodo y compara el recuento con el periodo anterior de la misma duración.',
      ),
    },
    example: {
      en: (f) => `S07 asked ${f.featured} questions in eight weeks: ${f.featuredWeek1} in week 1 and ${f.featuredWeek8} in week 8. The class asked ${f.total} questions, ${f.week1} in week 1 and ${f.week8} in week 8.`,
      tr: (f) => `S07 sekiz haftada ${f.featured} soru sordu: birinci haftada ${f.featuredWeek1}, sekizinci haftada ${f.featuredWeek8}. Sınıf ${f.total} soru sordu, birinci haftada ${f.week1}, sekizinci haftada ${f.week8}.`,
      es: (f) => `S07 hizo ${f.featured} preguntas en ocho semanas: ${f.featuredWeek1} en la semana 1 y ${f.featuredWeek8} en la semana 8. La clase hizo ${f.total} preguntas, ${f.week1} en la semana 1 y ${f.week8} en la semana 8.`,
    },
    takeaway: T('The class asks most in week 3 and less in each week after it.', 'Sınıf en çok üçüncü haftada soruyor ve sonraki her haftada daha az.', 'La clase pregunta más en la semana 3 y menos cada semana a partir de ahí.'),
    purpose: {
      teacher: T('Is the class asking more or less than before?', 'Sınıf öncekinden daha mı çok, daha mı az soruyor?', '¿Pregunta la clase más o menos que antes?'),
      researcher: T('How does help-seeking change over the weeks?', 'Yardım isteme haftalar içinde nasıl değişiyor?', '¿Cómo cambia la búsqueda de ayuda con las semanas?'),
    },
    raw: {
      intro: T('Two days of the class series in the dashboard.', 'Paneldeki sınıf serisinden iki gün.', 'Dos días de la serie de la clase en el panel.'),
      snippets: [{ name: 'questions-over-time', caption: rpc('dashboard_overview') }],
    },
    formulas: [
      {
        id: 'metric.questions',
        heading: T('Questions (dashboard)', 'Sorular (panel)', 'Preguntas (panel)'),
        text: T('Questions created in the period. The previous period has the same length and ends where this one starts.', 'Dönemde oluşturulan sorular. Önceki dönem aynı uzunluktadır ve bu dönemin başladığı yerde biter.', 'Preguntas creadas en el periodo. El periodo anterior tiene la misma duración y termina donde empieza este.'),
      },
      {
        id: 'metric.questions_total',
        heading: T('All-time questions (dashboard)', 'Toplam soru (panel)', 'Preguntas totales (panel)'),
        text: T('All questions of the student, whatever the period.', 'Dönemden bağımsız olarak öğrencinin tüm soruları.', 'Todas las preguntas del estudiante, sea cual sea el periodo.'),
      },
    ],
    research: {
      stage: DURING,
      spss: T('`questions` per student, and `questions_per_hour` = questions ÷ active hours.', 'Öğrenci başına `questions` ve `questions_per_hour` = sorular ÷ aktif saat.', '`questions` por estudiante, y `questions_per_hour` = preguntas ÷ horas activas.'),
      analysis: T('Model the weekly count per student with a mixed Poisson regression, with week as predictor.', 'Öğrenci başına haftalık sayıyı, hafta yordayıcı olmak üzere karma Poisson regresyonuyla modelleyin.', 'Modele el recuento semanal por estudiante con una regresión de Poisson mixta, con la semana como predictor.'),
      sentence: T('Help-seeking was measured as the number of help requests per student and week.', 'Yardım isteme, öğrenci ve hafta başına yardım isteği sayısı olarak ölçülmüştür.', 'La búsqueda de ayuda se midió como el número de peticiones de ayuda por estudiante y semana.'),
    },
    rq: { 'metric.questions': { RQ1: 'outcome', RQ3: 'outcome', RQ4: 'predictor', RQ5: 'outcome' } },
    limits: T(
      'Failed requests do not create a question. Fewer questions can mean more independence, harder tasks that students give up on, or simply fewer errors. The tasks change every week, so weeks are not fully comparable.',
      'Başarısız istekler soru oluşturmaz. Daha az soru daha fazla bağımsızlık, öğrencilerin vazgeçtiği daha zor görevler ya da yalnızca daha az hata anlamına gelebilir. Görevler her hafta değişir, bu yüzden haftalar tam olarak karşılaştırılabilir değildir.',
      'Las peticiones fallidas no crean pregunta. Menos preguntas pueden significar más autonomía, tareas más difíciles que los estudiantes abandonan o simplemente menos errores. Las tareas cambian cada semana, así que las semanas no son del todo comparables.',
    ),
    teacher: T(
      'A sudden rise in one week often points to a new topic. Plan a short explanation at the start of the next lab.',
      'Bir haftadaki ani bir artış çoğu zaman yeni bir konuya işaret eder. Bir sonraki laboratuvarın başı için kısa bir açıklama planlayın.',
      'Una subida brusca en una semana suele señalar un tema nuevo. Prepare una explicación breve para el inicio del siguiente laboratorio.',
    ),
  },

  // ------------------------------------------------------------------ concepts and errors
  {
    slug: 'concepts-and-errors', category: 'indicators',
    items: ['metric.concepts_top_class', 'metric.errors_top_class'],
    title: T('Concepts and errors', 'Kavramlar ve hatalar', 'Conceptos y errores'),
    what: {
      heading: T('What are the top concepts and errors?', 'En sık kavramlar ve hatalar nedir?', '¿Qué son los conceptos y errores más frecuentes?'),
      text: T(
        'Two lists in the dashboard. The first counts the programming concepts that the model named in its answers. The second counts the errors students asked about. For each row the dashboard shows the questions, the students and the questions that reached the fix.',
        'Paneldeki iki liste. İlki modelin yanıtlarında adlandırdığı programlama kavramlarını sayar. İkincisi öğrencilerin sorduğu hataları sayar. Panel her satır için soruları, öğrencileri ve düzeltmeye ulaşan soruları gösterir.',
        'Dos listas del panel. La primera cuenta los conceptos de programación que el modelo nombró en sus respuestas. La segunda cuenta los errores por los que preguntaron los estudiantes. Para cada fila, el panel muestra las preguntas, los estudiantes y las preguntas que llegaron a la corrección.',
      ),
    },
    example: {
      en: (f) => `The top concept in the sample is "${f.top}" (type conversion), with ${f.topQuestions} questions from ${f.topStudents} students. It appears in Turkish because the concept is written in the feedback language, and ${f.trStudents} of 25 students use Turkish. The top error row is "${f.topError}" with ${f.topErrorQuestions} questions from ${f.topErrorStudents} students. This row mixes many different syntax errors (see below).`,
      tr: (f) => `Örnekteki en sık kavram "${f.top}", ${f.topStudents} öğrenciden ${f.topQuestions} soruyla. Kavram geri bildirim dilinde yazılır ve 25 öğrencinin ${f.trStudents} tanesi Türkçe kullanıyor. En sık hata satırı ${f.topErrorStudents} öğrenciden ${f.topErrorQuestions} soruyla "${f.topError}". Bu satır birçok farklı sözdizimi hatasını karıştırır (aşağıya bakın).`,
      es: (f) => `El concepto más frecuente de la muestra es «${f.top}» (conversión de tipos), con ${f.topQuestions} preguntas de ${f.topStudents} estudiantes. Aparece en turco porque el concepto se escribe en el idioma de las explicaciones, y ${f.trStudents} de 25 estudiantes usan el turco. La fila de error más frecuente es «${f.topError}», con ${f.topErrorQuestions} preguntas de ${f.topErrorStudents} estudiantes. Esta fila mezcla muchos errores de sintaxis distintos (véase más abajo).`,
    },
    takeaway: T('The chart shows the concepts. The same concept can appear in up to three rows, one per feedback language.', 'Grafik kavramları gösteriyor. Aynı kavram her geri bildirim dili için bir tane olmak üzere en fazla üç satırda görünebilir.', 'El gráfico muestra los conceptos. El mismo concepto puede aparecer hasta en tres filas, una por idioma de las explicaciones.'),
    purpose: {
      teacher: T('Which topics and errors should I explain again in class?', 'Derste hangi konuları ve hataları yeniden açıklamalıyım?', '¿Qué temas y errores debo volver a explicar en clase?'),
      researcher: T('Which concepts cause the most help requests in the course?', 'Derste en çok yardım isteğine hangi kavramlar yol açıyor?', '¿Qué conceptos generan más peticiones de ayuda en la asignatura?'),
    },
    raw: {
      intro: T('The first two rows of the concept list.', 'Kavram listesinin ilk iki satırı.', 'Las dos primeras filas de la lista de conceptos.'),
      snippets: [{ name: 'concepts-and-errors', caption: rpc('dashboard_insights') }],
    },
    formulas: [
      {
        id: 'metric.concepts_top_class',
        heading: T('Concepts students ask about most (dashboard)', 'En çok sorulan kavramlar (panel)', 'Conceptos más preguntados (panel)'),
        text: T('The 12 most frequent concepts of the period. Upper and lower case are treated as the same.', 'Dönemin en sık 12 kavramı. Büyük ve küçük harf aynı kabul edilir.', 'Los 12 conceptos más frecuentes del periodo. Mayúsculas y minúsculas se tratan igual.'),
      },
      {
        id: 'metric.errors_top_class',
        heading: T('Most common errors (dashboard)', 'En sık görülen hatalar (panel)', 'Errores más frecuentes (panel)'),
        text: T('The 12 most frequent errors of the period. An error is grouped by its source and rule code (for example `Pylance reportUndefinedVariable`). When the code is missing, the SQL keeps only the source, so all syntax errors of Pylance end up in one row called "Pylance".', 'Dönemin en sık 12 hatası. Bir hata kaynağına ve kural koduna göre gruplanır (örneğin `Pylance reportUndefinedVariable`). Kod yoksa SQL yalnızca kaynağı tutar, bu yüzden Pylance’ın tüm sözdizimi hataları "Pylance" adlı tek bir satırda toplanır.', 'Los 12 errores más frecuentes del periodo. Un error se agrupa por su fuente y su código de regla (por ejemplo `Pylance reportUndefinedVariable`). Si falta el código, el SQL conserva solo la fuente, así que todos los errores de sintaxis de Pylance acaban en una fila llamada «Pylance».'),
      },
    ],
    research: {
      stage: T('after the intervention (course design)', 'müdahaleden sonra (ders tasarımı)', 'después de la intervención (diseño de la asignatura)'),
      spss: T('None. Recode the concepts into one list of topics in one language first, then count questions per topic and student.', 'Yok. Önce kavramları tek dilde tek bir konu listesine yeniden kodlayın, sonra konu ve öğrenci başına soruları sayın.', 'Ninguno. Recodifique primero los conceptos en una lista de temas en un solo idioma y luego cuente las preguntas por tema y estudiante.'),
      analysis: T('Relate the topics with the most questions to the test items with the lowest post-test scores.', 'En çok sorusu olan konuları son testte en düşük puan alan test maddeleriyle ilişkilendirin.', 'Relacione los temas con más preguntas con los ítems del test con las puntuaciones más bajas en el postest.'),
      sentence: T('The concepts named in the feedback were recoded into a common topic list across the three feedback languages.', 'Geri bildirimde adlandırılan kavramlar, üç geri bildirim dilinde ortak bir konu listesine yeniden kodlanmıştır.', 'Los conceptos nombrados en la retroalimentación se recodificaron en una lista común de temas para los tres idiomas.'),
    },
    limits: T(
      'The concept is chosen by the model, so the same idea can have several names. The "Pylance" row of the error list mixes different syntax errors and should not be read as one error. The lists show the frequency of questions, not the frequency of errors in the code.',
      'Kavramı model seçer, bu yüzden aynı fikrin birkaç adı olabilir. Hata listesindeki "Pylance" satırı farklı sözdizimi hatalarını karıştırır ve tek bir hata olarak okunmamalıdır. Listeler koddaki hataların sıklığını değil, soruların sıklığını gösterir.',
      'El concepto lo elige el modelo, así que la misma idea puede tener varios nombres. La fila «Pylance» de la lista de errores mezcla errores de sintaxis distintos y no debe leerse como un solo error. Las listas muestran la frecuencia de las preguntas, no la de los errores en el código.',
    ),
    teacher: T(
      'Use the concept list to choose the topic of a short review at the start of the next lab. Open the detail of a student to see the actual error messages.',
      'Bir sonraki laboratuvarın başındaki kısa tekrarın konusunu seçmek için kavram listesini kullanın. Gerçek hata mesajlarını görmek için bir öğrencinin ayrıntısını açın.',
      'Use la lista de conceptos para elegir el tema de un repaso breve al inicio del siguiente laboratorio. Abra el detalle de un estudiante para ver los mensajes de error reales.',
    ),
  },

  // ------------------------------------------------------------------ work rhythm
  {
    slug: 'work-rhythm', category: 'indicators',
    items: ['metric.work_rhythm'],
    title: T('When students work', 'Öğrenciler ne zaman çalışıyor', 'Cuándo trabajan los estudiantes'),
    what: {
      heading: T('What is the work rhythm?', 'Çalışma ritmi nedir?', '¿Qué es el ritmo de trabajo?'),
      text: T(
        'The dashboard counts questions and session starts by day of the week and hour of the day. The result is a grid of 7 days and 24 hours.',
        'Panel soruları ve oturum başlangıçlarını haftanın gününe ve günün saatine göre sayar. Sonuç 7 gün ve 24 saatlik bir tablodur.',
        'El panel cuenta las preguntas y los inicios de sesión por día de la semana y hora del día. El resultado es una cuadrícula de 7 días y 24 horas.',
      ),
    },
    example: {
      en: (f) => `The busiest cell of the class is day ${f.peakDay} of the week (Tuesday) at ${f.peakHour}:00, which is lab time. ${pc(f.labPct, 'en')} of all questions were asked on Tuesday between 10:00 and 12:00. The rest were spread over the evenings of the other days.`,
      tr: (f) => `Sınıfın en yoğun hücresi haftanın ${f.peakDay}. günü (salı) saat ${f.peakHour}.00, yani laboratuvar saati. Tüm soruların ${pc(f.labPct, 'tr')} kadarı salı günü 10.00 ile 12.00 arasında soruldu. Geri kalanı diğer günlerin akşamlarına dağıldı.`,
      es: (f) => `La celda con más actividad de la clase es el día ${f.peakDay} de la semana (martes) a las ${f.peakHour}:00, en horario de laboratorio. El ${pc(f.labPct, 'es')} de todas las preguntas se hizo el martes entre las 10:00 y las 12:00. El resto se repartió por las tardes de los demás días.`,
    },
    takeaway: T('Most questions are asked in the lab. Work at home happens in the evening.', 'Soruların çoğu laboratuvarda soruluyor. Evdeki çalışma akşam oluyor.', 'La mayoría de las preguntas se hacen en el laboratorio. El trabajo en casa se hace por la tarde.'),
    purpose: {
      teacher: T('Do students also ask for help outside lab hours?', 'Öğrenciler laboratuvar saatleri dışında da yardım istiyor mu?', '¿Piden ayuda los estudiantes también fuera del horario de laboratorio?'),
      researcher: T('How much of the use happens in class and how much in self-study?', 'Kullanımın ne kadarı derste, ne kadarı bireysel çalışmada oluyor?', '¿Qué parte del uso ocurre en clase y qué parte en el estudio autónomo?'),
    },
    raw: {
      intro: T('Three cells of the grid: day of the week (1 = Monday), hour and number of questions.', 'Tablonun üç hücresi: haftanın günü (1 = pazartesi), saat ve soru sayısı.', 'Tres celdas de la cuadrícula: día de la semana (1 = lunes), hora y número de preguntas.'),
      snippets: [{ name: 'work-rhythm', caption: rpc('dashboard_insights') }],
    },
    formulas: [{
      id: 'metric.work_rhythm',
      heading: T('When students work (dashboard)', 'Öğrenciler ne zaman çalışıyor (panel)', 'Cuándo trabajan los estudiantes (panel)'),
      text: T('Counts by ISO day of the week (1 to 7) and hour (0 to 23) in the time zone of the viewer: questions by their time and sessions by their start.', 'Görüntüleyenin saat diliminde ISO haftanın günü (1–7) ve saate (0–23) göre sayımlar: sorular zamanlarına, oturumlar başlangıçlarına göre.', 'Recuentos por día ISO de la semana (1 a 7) y hora (0 a 23) en la zona horaria de quien mira: preguntas por su hora y sesiones por su inicio.'),
    }],
    research: {
      stage: ANALYSIS,
      spss: T('`lab_share` = questions in lab hours ÷ all questions, per student.', 'Öğrenci başına `lab_share` = laboratuvar saatlerindeki sorular ÷ tüm sorular.', '`lab_share` = preguntas en horario de laboratorio ÷ todas las preguntas, por estudiante.'),
      analysis: T('Compare students who also work at home with those who work only in the lab on the learning gain (Mann–Whitney U).', 'Evde de çalışan öğrencileri yalnızca laboratuvarda çalışanlarla öğrenme kazancı açısından karşılaştırın (Mann–Whitney U).', 'Compare la ganancia de aprendizaje de quienes también trabajan en casa con la de quienes solo trabajan en el laboratorio (U de Mann–Whitney).'),
      sentence: T('Help requests were classified as made during scheduled lab hours or outside them.', 'Yardım istekleri planlanmış laboratuvar saatleri içinde ya da dışında yapılmış olarak sınıflandırılmıştır.', 'Las peticiones de ayuda se clasificaron según se hicieran dentro o fuera del horario de laboratorio.'),
    },
    rq: { 'metric.work_rhythm': { RQ1: 'descriptive' } },
    limits: T(
      'The hours are shown in the time zone of the person who views the dashboard, not of the student. The grid does not know the lab timetable, so "lab hours" must be defined by the researcher. It counts events, not time spent working.',
      'Saatler öğrencinin değil, paneli görüntüleyen kişinin saat diliminde gösterilir. Tablo laboratuvar programını bilmez, bu yüzden "laboratuvar saatleri" araştırmacı tarafından tanımlanmalıdır. Tablo çalışmaya harcanan süreyi değil, olayları sayar.',
      'Las horas se muestran en la zona horaria de quien ve el panel, no en la del estudiante. La cuadrícula no conoce el horario de laboratorio, así que el «horario de laboratorio» debe definirlo quien investiga. Cuenta eventos, no el tiempo de trabajo.',
    ),
    teacher: T(
      'If many questions come late in the evening before a deadline, consider an earlier deadline or a short online office hour.',
      'Bir teslim tarihinden önceki akşam geç saatlerde çok soru geliyorsa, daha erken bir teslim tarihi ya da kısa bir çevrimiçi görüşme saati düşünün.',
      'Si llegan muchas preguntas tarde la noche antes de una entrega, piense en un plazo más temprano o en una breve tutoría en línea.',
    ),
  },

  // ------------------------------------------------------------------ student panel
  {
    slug: 'student-panel', category: 'indicators',
    items: ['metric.ext_explanations_asked', 'metric.ext_errors_worked_out', 'metric.ext_days_using', 'metric.ext_activity_totals'],
    title: T('Student panel', 'Öğrenci paneli', 'Panel del estudiante'),
    what: {
      heading: T('What is the student panel?', 'Öğrenci paneli nedir?', '¿Qué es el panel del estudiante?'),
      text: T(
        'The sidebar of the extension shows each student a few numbers about their own work. The extension computes them on the student\'s computer from the student\'s own rows. Nothing new is stored for this panel.',
        'Eklentinin kenar çubuğu her öğrenciye kendi çalışması hakkında birkaç sayı gösterir. Eklenti bunları öğrencinin bilgisayarında, öğrencinin kendi satırlarından hesaplar. Bu panel için yeni bir şey saklanmaz.',
        'La barra lateral de la extensión muestra a cada estudiante algunos números sobre su propio trabajo. La extensión los calcula en el ordenador del estudiante a partir de sus propias filas. Para este panel no se guarda nada nuevo.',
      ),
    },
    example: {
      en: (f) => `The panel of S07 at the end of the sample shows ${f.explanationsAskedFor} explanations asked for, ${f.daysUsingThis} days using this and ${dec(f.totalActiveHours, 'en')} hours of active time. Two numbers are easy to confuse: "Errors you worked out yourself" (${f.errorsWorkedOutYourself}) counts questions where S07 did not open the rule or the fix, and "Errors you fixed without asking" (${f.errorsFixedWithoutAsking}) counts errors that went away with no question at all.`,
      tr: (f) => `Örneğin sonunda S07’nin paneli ${f.explanationsAskedFor} istenen açıklama, ${f.daysUsingThis} kullanım günü ve ${dec(f.totalActiveHours, 'tr')} saat aktif süre gösteriyor. İki sayı kolayca karışır: "Kendin çözdüğün hatalar" (${f.errorsWorkedOutYourself}) S07’nin kuralı ya da düzeltmeyi açmadığı soruları, "Sormadan düzelttiğin hatalar" (${f.errorsFixedWithoutAsking}) ise hiç soru sorulmadan giden hataları sayar.`,
      es: (f) => `El panel de S07 al final de la muestra indica ${f.explanationsAskedFor} explicaciones solicitadas, ${f.daysUsingThis} días de uso y ${dec(f.totalActiveHours, 'es')} horas de tiempo activo. Dos números se confunden con facilidad: «Errores que resolviste tú mismo/a» (${f.errorsWorkedOutYourself}) cuenta las preguntas en las que S07 no abrió la regla ni la corrección, y «Errores que arreglaste sin preguntar» (${f.errorsFixedWithoutAsking}) cuenta los errores que desaparecieron sin ninguna pregunta.`,
    },
    takeaway: T('The table lists every number of the panel for S07. Each number is described on its own data page.', 'Tablo, panelin S07 için gösterdiği tüm sayıları listeliyor. Her sayı kendi veri sayfasında açıklanıyor.', 'La tabla recoge todos los números del panel de S07. Cada número se describe en su propia página de datos.'),
    purpose: {
      teacher: T('What does a student see about their own progress?', 'Bir öğrenci kendi ilerlemesi hakkında ne görüyor?', '¿Qué ve un estudiante sobre su propio progreso?'),
      researcher: T('Which feedback about their own behaviour did students receive, which may itself change the behaviour?', 'Öğrenciler kendi davranışları hakkında, davranışın kendisini de değiştirebilecek hangi geri bildirimi aldı?', '¿Qué retroalimentación sobre su propio comportamiento recibieron los estudiantes, que a su vez puede cambiar ese comportamiento?'),
    },
    raw: {
      intro: T('The panel stores nothing. It reads the student\'s rows in `interactions` and `coding_sessions`, which are described on the other data pages.', 'Panel hiçbir şey saklamaz. Öğrencinin `interactions` ve `coding_sessions` tablolarındaki satırlarını okur. Bu satırlar diğer veri sayfalarında açıklanır.', 'El panel no guarda nada. Lee las filas del estudiante en `interactions` y `coding_sessions`, que se describen en las demás páginas de datos.'),
      snippets: [],
    },
    formulas: [
      {
        id: 'metric.ext_explanations_asked',
        heading: T('Explanations asked for', 'İstenen açıklama sayısı', 'Explicaciones solicitadas'),
        text: T('All questions of the student.', 'Öğrencinin tüm soruları.', 'Todas las preguntas del estudiante.'),
      },
      {
        id: 'metric.ext_errors_worked_out',
        heading: T('Errors you worked out yourself', 'Kendin çözdüğün hatalar', 'Errores que resolviste tú mismo/a'),
        text: T('Questions of the student that ended at L0–L1. The student still asked for an explanation.', 'Öğrencinin L0–L1’de biten soruları. Öğrenci yine de bir açıklama istemiştir.', 'Preguntas del estudiante que terminaron en L0–L1. El estudiante sí pidió una explicación.'),
      },
      {
        id: 'metric.ext_days_using',
        heading: T('Days using this', 'Kullandığın gün sayısı', 'Días usando esto'),
        text: T('Different calendar dates of the session starts, in the time zone of the student\'s computer.', 'Oturum başlangıçlarının farklı takvim günleri, öğrencinin bilgisayarının saat diliminde.', 'Fechas distintas de los inicios de sesión, en la zona horaria del ordenador del estudiante.'),
      },
      {
        id: 'metric.ext_activity_totals',
        heading: T('Totals over all sessions', 'Tüm oturumlar üzerinden toplamlar', 'Totales de todas las sesiones'),
        text: T('Sums over all sessions of the student: active time (in hours), lines added, lines deleted, files created and errors fixed without asking.', 'Öğrencinin tüm oturumları üzerinden toplamlar: aktif süre (saat olarak), eklenen satırlar, silinen satırlar, oluşturulan dosyalar ve sormadan düzeltilen hatalar.', 'Sumas de todas las sesiones del estudiante: tiempo activo (en horas), líneas añadidas, líneas borradas, archivos creados y errores corregidos sin preguntar.'),
      },
    ],
    research: {
      stage: T('during the intervention (part of the treatment)', 'müdahale sırasında (uygulamanın bir parçası)', 'durante la intervención (parte del tratamiento)'),
      spss: T('None. The same values can be computed from the raw data on the other pages.', 'Yok. Aynı değerler diğer sayfalardaki ham veriden hesaplanabilir.', 'Ninguno. Los mismos valores pueden calcularse con los datos brutos de las demás páginas.'),
      analysis: T('Describe the panel in the Method section as part of the intervention.', 'Paneli Yöntem bölümünde müdahalenin bir parçası olarak betimleyin.', 'Describa el panel en la sección de Método como parte de la intervención.'),
      sentence: T('The extension showed each student a summary panel with their own usage statistics, which was part of the intervention.', 'Eklenti her öğrenciye kendi kullanım istatistiklerini içeren bir özet paneli göstermiştir. Bu panel müdahalenin bir parçasıydı.', 'La extensión mostraba a cada estudiante un panel resumen con sus propias estadísticas de uso, que formaba parte de la intervención.'),
    },
    limits: T(
      'The two error numbers have similar names but measure different things. "Days using this" can differ from the dashboard because it uses the student\'s time zone. The panel shows all-time totals, so it cannot show change over the weeks.',
      'İki hata sayısının adları benzerdir ama farklı şeyler ölçerler. "Kullandığın gün sayısı" öğrencinin saat dilimini kullandığı için panelden farklı olabilir. Panel tüm zamanların toplamlarını gösterir, bu yüzden haftalar içindeki değişimi gösteremez.',
      'Los dos números de errores tienen nombres parecidos pero miden cosas distintas. «Días usando esto» puede diferir del panel del profesorado porque usa la zona horaria del estudiante. El panel muestra totales de todo el tiempo, así que no puede mostrar el cambio a lo largo de las semanas.',
    ),
    teacher: T(
      'Explain the two error numbers to the class once. Students may otherwise read "Errors you worked out yourself" as errors they solved without the tool.',
      'İki hata sayısını sınıfa bir kez açıklayın. Aksi halde öğrenciler "Kendin çözdüğün hatalar" sayısını araç olmadan çözdükleri hatalar olarak okuyabilir.',
      'Explique una vez a la clase los dos números de errores. Si no, los estudiantes pueden entender «Errores que resolviste tú mismo/a» como errores resueltos sin la herramienta.',
    ),
  },

  // ------------------------------------------------------------------ response time
  {
    slug: 'response-time', category: 'system',
    items: ['interactions.model_used', 'interactions.latency_ms', 'metric.ai_response_time_avg', 'metric.response_time_median'],
    title: T('AI response time', 'Yapay zekâ yanıt süresi', 'Tiempo de respuesta de la IA'),
    what: {
      heading: T('What is the AI response time?', 'Yapay zekâ yanıt süresi nedir?', '¿Qué es el tiempo de respuesta de la IA?'),
      text: T(
        'It is the time the server spent waiting for the AI model for one answer, in milliseconds. The same row also stores which AI provider answered.',
        'Sunucunun bir yanıt için yapay zekâ modelini beklediği süredir, milisaniye olarak. Aynı satır hangi yapay zekâ sağlayıcısının yanıt verdiğini de saklar.',
        'Es el tiempo que el servidor esperó al modelo de IA para una respuesta, en milisegundos. La misma fila guarda también qué proveedor de IA respondió.',
      ),
    },
    example: {
      en: (f) => `In the sample, the mean response time was ${dec(f.avgSec, 'en')} seconds. Half of the answers took less than ${dec(f.p50Sec, 'en')} seconds, and 95% less than ${dec(f.p95Sec, 'en')} seconds. The ${f.cacheHits} answers from the cache have no response time.`,
      tr: (f) => `Örnekte ortalama yanıt süresi ${dec(f.avgSec, 'tr')} saniyeydi. Yanıtların yarısı ${dec(f.p50Sec, 'tr')} saniyeden, %95’i ${dec(f.p95Sec, 'tr')} saniyeden kısa sürdü. Önbellekten gelen ${f.cacheHits} yanıtın yanıt süresi yoktur.`,
      es: (f) => `En la muestra, el tiempo medio de respuesta fue de ${dec(f.avgSec, 'es')} segundos. La mitad de las respuestas tardó menos de ${dec(f.p50Sec, 'es')} segundos, y el 95% menos de ${dec(f.p95Sec, 'es')}. Las ${f.cacheHits} respuestas de la caché no tienen tiempo de respuesta.`,
    },
    takeaway: T('Most answers take between 3 and 6 seconds. Few take more than 8 seconds.', 'Yanıtların çoğu 3 ile 6 saniye arasında sürüyor. Çok azı 8 saniyeden uzun sürüyor.', 'La mayoría de las respuestas tardan entre 3 y 6 segundos. Pocas tardan más de 8 segundos.'),
    purpose: {
      teacher: T('Do students wait long for an answer?', 'Öğrenciler bir yanıt için uzun süre bekliyor mu?', '¿Esperan mucho los estudiantes una respuesta?'),
      researcher: T('Was the service fast and stable enough during the study, as a condition of the intervention?', 'Müdahalenin bir koşulu olarak hizmet çalışma boyunca yeterince hızlı ve kararlı mıydı?', '¿Fue el servicio lo bastante rápido y estable durante el estudio, como condición de la intervención?'),
    },
    raw: {
      intro: T('A generated answer and an answer from the cache.', 'Üretilmiş bir yanıt ve önbellekten gelen bir yanıt.', 'Una respuesta generada y una respuesta de la caché.'),
      snippets: [{ name: 'response-time', caption: tbl('interactions') }],
    },
    formulas: [
      {
        id: 'interactions.latency_ms',
        heading: T('How the time is measured', 'Süre nasıl ölçülür', 'Cómo se mide el tiempo'),
        text: T('Time inside the server function from before the first model call to after the last check, including a repair call when the first answer failed a check. Empty for answers from the cache.', 'Sunucu işlevinin içinde, ilk model çağrısından önceden son denetimden sonraya kadar geçen süre. İlk yanıt bir denetimi geçemediyse onarım çağrısı da dahildir. Önbellekten gelen yanıtlarda boştur.', 'Tiempo dentro de la función del servidor desde antes de la primera llamada al modelo hasta después de la última comprobación, incluida una llamada de reparación si la primera respuesta no pasó una comprobación. Vacío en las respuestas de la caché.'),
      },
      {
        id: 'interactions.model_used',
        heading: T('AI provider', 'Yapay zekâ sağlayıcısı', 'Proveedor de IA'),
        text: T('The id of the provider type that answered (for example `openai_compatible`), not the name of the model. For an answer from the cache it is the provider of the cached answer.', 'Yanıt veren sağlayıcı türünün kimliği (örneğin `openai_compatible`), modelin adı değil. Önbellekten gelen bir yanıtta önbellekteki yanıtın sağlayıcısıdır.', 'El identificador del tipo de proveedor que respondió (por ejemplo `openai_compatible`), no el nombre del modelo. En una respuesta de la caché es el proveedor de la respuesta guardada.'),
      },
      {
        id: 'metric.ai_response_time_avg',
        heading: T('AI response time (dashboard)', 'Yapay zekâ yanıt süresi (panel)', 'Tiempo de respuesta de la IA (panel)'),
        text: T('Mean response time of the questions of the period, without the answers from the cache.', 'Önbellekten gelen yanıtlar olmadan, dönemin sorularının ortalama yanıt süresi.', 'Tiempo medio de respuesta de las preguntas del periodo, sin las respuestas de la caché.'),
      },
      {
        id: 'metric.response_time_median',
        heading: T('Response time (median, dashboard)', 'Yanıt süresi (medyan, panel)', 'Tiempo de respuesta (mediana, panel)'),
        text: T('Median and 95th percentile of the same times.', 'Aynı sürelerin ortancası ve 95. yüzdeliği.', 'Mediana y percentil 95 de los mismos tiempos.'),
      },
    ],
    research: {
      stage: QUALITY,
      spss: T('Not needed per student. Report the median and the 95th percentile for the whole study.', 'Öğrenci başına gerekmez. Tüm çalışma için ortancayı ve 95. yüzdeliği raporlayın.', 'No es necesario por estudiante. Informe de la mediana y del percentil 95 de todo el estudio.'),
      analysis: T('Check that the response time did not change between weeks or groups, so it cannot explain differences in use.', 'Kullanımdaki farkları açıklayamayacağından emin olmak için yanıt süresinin haftalar ya da gruplar arasında değişmediğini kontrol edin.', 'Compruebe que el tiempo de respuesta no cambió entre semanas o grupos, para que no pueda explicar diferencias de uso.'),
      sentence: T('The median server-side response time of the AI feedback service was recorded to document the conditions of the intervention.', 'Müdahalenin koşullarını belgelemek için yapay zekâ geri bildirim hizmetinin sunucu tarafındaki ortanca yanıt süresi kaydedilmiştir.', 'Se registró la mediana del tiempo de respuesta del servicio de retroalimentación de IA en el servidor para documentar las condiciones de la intervención.'),
    },
    limits: T(
      'This is not the wait the student saw: the network and the extension add time. Failed requests have no row, so slow requests that ran out of time are missing. The provider field does not name the exact model.',
      'Bu, öğrencinin gördüğü bekleme süresi değildir: ağ ve eklenti süreye eklenir. Başarısız isteklerin satırı yoktur, bu yüzden süresi dolan yavaş istekler eksiktir. Sağlayıcı alanı tam modeli adlandırmaz.',
      'No es la espera que vio el estudiante: la red y la extensión añaden tiempo. Las peticiones fallidas no tienen fila, así que faltan las peticiones lentas que agotaron el tiempo. El campo del proveedor no nombra el modelo exacto.',
    ),
    teacher: T(
      'If students say the tool is slow, check this page of the dashboard during the lab. Long times for everyone point to the AI service, not to the students\' computers.',
      'Öğrenciler aracın yavaş olduğunu söylerse, laboratuvar sırasında panelin bu bölümüne bakın. Herkes için uzun süreler öğrencilerin bilgisayarlarına değil, yapay zekâ hizmetine işaret eder.',
      'Si los estudiantes dicen que la herramienta va lenta, revise esta parte del panel durante el laboratorio. Tiempos largos para todos apuntan al servicio de IA, no a los ordenadores de los estudiantes.',
    ),
  },

  // ------------------------------------------------------------------ tokens
  {
    slug: 'tokens', category: 'system',
    items: ['interactions.prompt_tokens', 'interactions.completion_tokens', 'metric.tokens_used'],
    title: T('Tokens used', 'Kullanılan token', 'Tokens usados'),
    what: {
      heading: T('What are tokens?', 'Token nedir?', '¿Qué son los tokens?'),
      text: T(
        'Tokens are the units in which an AI provider counts text. Each answer stores the tokens of the request (prompt) and of the answer (completion), as the provider reported them. The cost of the service depends on them.',
        'Token, bir yapay zekâ sağlayıcısının metni saydığı birimdir. Her yanıt, sağlayıcının bildirdiği biçimde isteğin (istem) ve yanıtın (tamamlama) tokenlerini saklar. Hizmetin maliyeti bunlara bağlıdır.',
        'Los tokens son las unidades con las que un proveedor de IA cuenta el texto. Cada respuesta guarda los tokens de la petición (prompt) y de la respuesta (completion), tal como los informó el proveedor. El coste del servicio depende de ellos.',
      ),
    },
    example: {
      en: (f) => `In the sample the class used ${dec(f.total, 'en')} tokens: ${dec(f.prompt, 'en')} for requests and ${dec(f.completion, 'en')} for answers. A generated answer used ${dec(f.perAnswer, 'en')} tokens on average.`,
      tr: (f) => `Örnekte sınıf ${dec(f.total, 'tr')} token kullandı: istekler için ${dec(f.prompt, 'tr')}, yanıtlar için ${dec(f.completion, 'tr')}. Üretilen bir yanıt ortalama ${dec(f.perAnswer, 'tr')} token kullandı.`,
      es: (f) => `En la muestra, la clase usó ${dec(f.total, 'es')} tokens: ${dec(f.prompt, 'es')} para las peticiones y ${dec(f.completion, 'es')} para las respuestas. Una respuesta generada usó ${dec(f.perAnswer, 'es')} tokens de media.`,
    },
    takeaway: T('Tokens follow the number of questions: most in week 3, fewest in week 8.', 'Tokenler soru sayısını izliyor: en çok üçüncü haftada, en az sekizinci haftada.', 'Los tokens siguen al número de preguntas: más en la semana 3 y menos en la semana 8.'),
    purpose: {
      teacher: T('How much does the service cost for my class?', 'Hizmet sınıfım için ne kadara mal oluyor?', '¿Cuánto cuesta el servicio para mi clase?'),
      researcher: T('What are the running costs, for a report on the feasibility of the approach?', 'Yaklaşımın uygulanabilirliği üzerine bir rapor için işletme maliyetleri nedir?', '¿Cuáles son los costes de funcionamiento, para un informe sobre la viabilidad del enfoque?'),
    },
    raw: {
      intro: T('One generated answer of S07.', 'S07’nin üretilmiş bir yanıtı.', 'Una respuesta generada de S07.'),
      snippets: [{ name: 'tokens', caption: tbl('interactions') }],
    },
    formulas: [{
      id: 'metric.tokens_used',
      heading: T('Tokens used (dashboard)', 'Kullanılan token (panel)', 'Tokens usados (panel)'),
      text: T('Sum of the request and answer tokens of the questions of the period, also per time slot and per provider.', 'Dönemin sorularının istek ve yanıt tokenlerinin toplamı, zaman dilimi ve sağlayıcı başına da.', 'Suma de los tokens de petición y de respuesta de las preguntas del periodo, también por franja de tiempo y por proveedor.'),
    }],
    research: {
      stage: QUALITY,
      spss: T('Not needed per student. Report the total and the mean per answer.', 'Öğrenci başına gerekmez. Toplamı ve yanıt başına ortalamayı raporlayın.', 'No es necesario por estudiante. Informe del total y de la media por respuesta.'),
      analysis: T('Estimate the cost per student and course from the provider\'s price per token.', 'Sağlayıcının token başına fiyatından öğrenci ve ders başına maliyeti tahmin edin.', 'Estime el coste por estudiante y asignatura a partir del precio por token del proveedor.'),
      sentence: T('The token usage reported by the AI provider was used to estimate the running cost per student.', 'Yapay zekâ sağlayıcısının bildirdiği token kullanımı, öğrenci başına işletme maliyetini tahmin etmek için kullanılmıştır.', 'El uso de tokens informado por el proveedor de IA se usó para estimar el coste de funcionamiento por estudiante.'),
    },
    limits: T(
      'Only the last successful call is stored, so a repair call or a failed first call is not counted and the real cost is higher. The fallback provider may count tokens in another way. The AI learning summaries are not included.',
      'Yalnızca son başarılı çağrı saklanır, bu yüzden bir onarım çağrısı ya da başarısız bir ilk çağrı sayılmaz ve gerçek maliyet daha yüksektir. Yedek sağlayıcı tokenleri başka bir biçimde sayabilir. Yapay zekâ öğrenme özetleri dahil değildir.',
      'Solo se guarda la última llamada con éxito, así que una llamada de reparación o una primera llamada fallida no se cuentan y el coste real es mayor. El proveedor de respaldo puede contar los tokens de otra forma. Los resúmenes de aprendizaje de IA no se incluyen.',
    ),
    teacher: T(
      'This page is mainly for the people who run the service. For teaching, the number of questions is more useful.',
      'Bu sayfa esas olarak hizmeti işletenler içindir. Öğretim için soru sayısı daha yararlıdır.',
      'Esta página es sobre todo para quienes gestionan el servicio. Para la docencia es más útil el número de preguntas.',
    ),
  },

  // ------------------------------------------------------------------ cache
  {
    slug: 'cache', category: 'system',
    items: ['interactions.cache_hit', 'explanations.reuse_count', 'metric.cache_rate'],
    title: T('Answered from cache', 'Önbellekten yanıtlanan', 'Respondido desde caché'),
    what: {
      heading: T('What is an answer from the cache?', 'Önbellekten gelen yanıt nedir?', '¿Qué es una respuesta de la caché?'),
      text: T(
        'When an earlier answer exists for the same language, question type, error and code, the server sends that answer again instead of asking the AI model. In the error, numbers and quoted text are replaced first. In the code, comments and extra spaces are removed first.',
        'Aynı dil, soru türü, hata ve kod için daha önce bir yanıt varsa, sunucu yapay zekâ modeline sormak yerine o yanıtı yeniden gönderir. Hatada önce sayılar ve tırnak içindeki metinler değiştirilir. Kodda önce yorumlar ve fazla boşluklar kaldırılır.',
        'Cuando ya existe una respuesta anterior para el mismo idioma, tipo de pregunta, error y código, el servidor vuelve a enviar esa respuesta en lugar de preguntar al modelo de IA. En el error se sustituyen antes los números y el texto entre comillas. En el código se quitan antes los comentarios y los espacios de más.',
      ),
    },
    example: {
      en: (f) => `In the sample, ${f.hits} of ${f.questions} questions (${pc(f.ratePct, 'en')}) were answered from the cache. The cache held ${f.cacheRows} answers, and ${f.reusedRows} of them were used again at least once.`,
      tr: (f) => `Örnekte ${f.questions} sorunun ${f.hits} tanesi (${pc(f.ratePct, 'tr')}) önbellekten yanıtlandı. Önbellekte ${f.cacheRows} yanıt vardı ve bunların ${f.reusedRows} tanesi en az bir kez yeniden kullanıldı.`,
      es: (f) => `En la muestra, ${f.hits} de ${f.questions} preguntas (${pc(f.ratePct, 'es')}) se respondieron desde la caché. La caché tenía ${f.cacheRows} respuestas, y ${f.reusedRows} se reutilizaron al menos una vez.`,
    },
    takeaway: T('Few answers come from the cache, because students\' code is rarely identical.', 'Yanıtların azı önbellekten geliyor, çünkü öğrencilerin kodu nadiren birebir aynı.', 'Pocas respuestas salen de la caché, porque el código de los estudiantes rara vez es idéntico.'),
    purpose: {
      teacher: T('Did students get the same answer as a classmate?', 'Öğrenciler bir sınıf arkadaşıyla aynı yanıtı aldı mı?', '¿Recibieron los estudiantes la misma respuesta que un compañero?'),
      researcher: T('Which answers were not personalised, which matters for the private notes and the analysis?', 'Hangi yanıtlar kişiselleştirilmedi? Bu, gizli notlar ve analiz için önemlidir.', '¿Qué respuestas no se personalizaron? Esto importa para las notas privadas y para el análisis.'),
    },
    raw: {
      intro: T('One cached answer (the text of the answer is not shown).', 'Önbellekteki bir yanıt (yanıtın metni gösterilmiyor).', 'Una respuesta guardada en la caché (no se muestra el texto de la respuesta).'),
      snippets: [{ name: 'cache', caption: tbl('explanations') }],
    },
    formulas: [
      {
        id: 'explanations.reuse_count',
        heading: T('Times reused', 'Yeniden kullanım sayısı', 'Veces reutilizada'),
        text: T('Goes up by one on every answer from the cache. Hits before migration 0022 (a bug fix) were not counted.', 'Önbellekten gelen her yanıtta bir artar. 0022 geçişinden (bir hata düzeltmesi) önceki kullanımlar sayılmadı.', 'Sube uno con cada respuesta de la caché. Los usos anteriores a la migración 0022 (una corrección de un fallo) no se contaron.'),
      },
      {
        id: 'metric.cache_rate',
        heading: T('Answered from cache (dashboard)', 'Önbellekten yanıtlanan (panel)', 'Respondido desde caché (panel)'),
        text: T('Questions of the period answered from the cache, divided by all questions of the period, also per provider.', 'Dönemin önbellekten yanıtlanan soruları, dönemin tüm sorularına bölünür, sağlayıcı başına da.', 'Preguntas del periodo respondidas desde la caché, divididas entre todas las preguntas del periodo, también por proveedor.'),
      },
    ],
    research: {
      stage: QUALITY,
      spss: T('`cache_share` per student, if you want to control for answers that were not personalised.', 'Kişiselleştirilmemiş yanıtları kontrol etmek istiyorsanız öğrenci başına `cache_share`.', '`cache_share` por estudiante, si quiere controlar las respuestas no personalizadas.'),
      analysis: T('Run a sensitivity analysis without answers from the cache.', 'Önbellekten gelen yanıtlar olmadan bir duyarlılık analizi yapın.', 'Haga un análisis de sensibilidad sin las respuestas de la caché.'),
      sentence: T('Answers served from the cache were identified and excluded in a sensitivity analysis.', 'Önbellekten sunulan yanıtlar belirlenmiş ve bir duyarlılık analizinde dışarıda bırakılmıştır.', 'Las respuestas servidas desde la caché se identificaron y se excluyeron en un análisis de sensibilidad.'),
    },
    limits: T(
      'An answer from the cache was written for another question, possibly of another student, and does not use the private notes of the current student. Cached answers do not count toward the next rewrite of the notes. Old hits before the bug fix are missing from the reuse count.',
      'Önbellekten gelen bir yanıt başka bir soru için, belki başka bir öğrenci için yazılmıştır ve o anki öğrencinin gizli notlarını kullanmaz. Önbellekteki yanıtlar notların bir sonraki yeniden yazımı için sayılmaz. Hata düzeltmesinden önceki eski kullanımlar yeniden kullanım sayısında eksiktir.',
      'Una respuesta de la caché se escribió para otra pregunta, quizá de otro estudiante, y no usa las notas privadas del estudiante actual. Las respuestas de la caché no cuentan para la siguiente reescritura de las notas. Los usos anteriores a la corrección del fallo faltan en el recuento.',
    ),
    teacher: T(
      'When several students get the same answer, they probably made the same error in the same task. It can be worth one explanation for the whole class.',
      'Birkaç öğrenci aynı yanıtı alıyorsa, büyük olasılıkla aynı görevde aynı hatayı yapmışlardır. Tüm sınıf için tek bir açıklamaya değer olabilir.',
      'Si varios estudiantes reciben la misma respuesta, probablemente cometieron el mismo error en la misma tarea. Puede merecer una explicación para toda la clase.',
    ),
  },

  // ------------------------------------------------------------------ failed requests
  {
    slug: 'failed-requests', category: 'system',
    items: ['event.request_failed', 'event.request_failed.kind', 'event.request_failed.code', 'event.request_failed.retryAfterSeconds', 'metric.failed_requests', 'metric.failure_rate'],
    title: T('Failed requests', 'Başarısız istekler', 'Solicitudes fallidas'),
    what: {
      heading: T('What is a failed request?', 'Başarısız istek nedir?', '¿Qué es una solicitud fallida?'),
      text: T(
        'The event is recorded when the student asked for help but no answer arrived: no answer within 25 seconds, an error from the server, or another error. The student sees an error message and no question is stored.',
        'Bu olay, öğrenci yardım istediği halde yanıt gelmediğinde kaydedilir: 25 saniye içinde yanıt yok, sunucudan bir hata ya da başka bir hata. Öğrenci bir hata mesajı görür ve soru saklanmaz.',
        'El evento se registra cuando el estudiante pidió ayuda pero no llegó respuesta: ninguna respuesta en 25 segundos, un error del servidor u otro error. El estudiante ve un mensaje de error y no se guarda ninguna pregunta.',
      ),
    },
    example: {
      en: (f) => `In the sample, ${f.failures} requests failed next to ${f.questions} answered questions, a failure rate of ${pc(f.ratePct, 'en')}. Most failures were errors of the AI service. Two requests hit the usage limit.`,
      tr: (f) => `Örnekte yanıtlanan ${f.questions} sorunun yanında ${f.failures} istek başarısız oldu. Başarısızlık oranı ${pc(f.ratePct, 'tr')}. Başarısızlıkların çoğu yapay zekâ hizmetinin hatalarıydı. İki istek kullanım sınırına takıldı.`,
      es: (f) => `En la muestra fallaron ${f.failures} peticiones frente a ${f.questions} preguntas respondidas, una tasa de fallos del ${pc(f.ratePct, 'es')}. La mayoría de los fallos fueron errores del servicio de IA. Dos peticiones chocaron con el límite de uso.`,
    },
    takeaway: T('Failures are rare. Most come from the AI service, not from the students.', 'Başarısızlıklar seyrek. Çoğu öğrencilerden değil, yapay zekâ hizmetinden kaynaklanıyor.', 'Los fallos son poco frecuentes. La mayoría vienen del servicio de IA, no de los estudiantes.'),
    purpose: {
      teacher: T('Did the tool fail when students needed it?', 'Öğrencilerin ihtiyacı olduğunda araç başarısız oldu mu?', '¿Falló la herramienta cuando los estudiantes la necesitaban?'),
      researcher: T('How reliable was the service, and are there requests missing from the question data?', 'Hizmet ne kadar güvenilirdi ve soru verisinde eksik istekler var mı?', '¿Qué fiabilidad tuvo el servicio y faltan peticiones en los datos de preguntas?'),
    },
    raw: {
      intro: T('One event from the sample.', 'Örnekten bir olay.', 'Un evento de la muestra.'),
      snippets: [{ name: 'failed-requests', caption: EV }],
    },
    formulas: [
      {
        id: 'event.request_failed.kind',
        heading: T('Kind and code', 'Tür ve kod', 'Tipo y código'),
        text: T('The kind is `timeout` (no answer within 25 seconds), `backend` (the server returned an error) or `unknown`. For `backend` the code of the server is stored, for example `provider_error` or `rate_limited`. For `rate_limited` the event also stores the seconds until the limit resets.', 'Tür `timeout` (25 saniye içinde yanıt yok), `backend` (sunucu bir hata döndürdü) ya da `unknown` olur. `backend` için sunucunun kodu saklanır, örneğin `provider_error` ya da `rate_limited`. `rate_limited` için olay sınırın sıfırlanmasına kalan saniyeleri de saklar.', 'El tipo es `timeout` (ninguna respuesta en 25 segundos), `backend` (el servidor devolvió un error) o `unknown`. Para `backend` se guarda el código del servidor, por ejemplo `provider_error` o `rate_limited`. Para `rate_limited` el evento guarda además los segundos que faltan para que se reinicie el límite.'),
      },
      {
        id: 'metric.failed_requests',
        heading: T('Failed requests (dashboard)', 'Başarısız istekler (panel)', 'Solicitudes fallidas (panel)'),
        text: T('Failure events of the period, grouped by kind and code.', 'Dönemin başarısızlık olayları, tür ve koda göre gruplanır.', 'Eventos de fallo del periodo, agrupados por tipo y código.'),
      },
      {
        id: 'metric.failure_rate',
        heading: T('Failure rate (dashboard)', 'Hata oranı (panel)', 'Tasa de fallos (panel)'),
        text: T('Failures divided by the sum of questions and failures in the period.', 'Başarısızlıklar, dönemdeki soruların ve başarısızlıkların toplamına bölünür.', 'Fallos divididos entre la suma de preguntas y fallos del periodo.'),
      },
    ],
    research: {
      stage: QUALITY,
      spss: T('`failed_requests` per student, to check that no student was affected much more than others.', 'Hiçbir öğrencinin diğerlerinden çok daha fazla etkilenmediğini kontrol etmek için öğrenci başına `failed_requests`.', '`failed_requests` por estudiante, para comprobar que ningún estudiante se vio mucho más afectado que los demás.'),
      analysis: T('Report the failure rate in the Method section. Add failed requests to the questions when you count help-seeking attempts.', 'Başarısızlık oranını Yöntem bölümünde raporlayın. Yardım isteme girişimlerini sayarken başarısız istekleri sorulara ekleyin.', 'Informe de la tasa de fallos en la sección de Método. Sume las peticiones fallidas a las preguntas al contar los intentos de pedir ayuda.'),
      sentence: T('Failed help requests were logged separately and counted as help-seeking attempts.', 'Başarısız yardım istekleri ayrıca kaydedilmiş ve yardım isteme girişimi olarak sayılmıştır.', 'Las peticiones de ayuda fallidas se registraron por separado y se contaron como intentos de búsqueda de ayuda.'),
    },
    rq: { 'event.request_failed': { RQ1: 'descriptive' } },
    limits: T(
      'The event is sent by the extension, so a failure without a network connection may never arrive. A student who tried twice creates two events. The event does not tell which error or question the student asked about.',
      'Olayı eklenti gönderir, bu yüzden ağ bağlantısı olmadan yaşanan bir başarısızlık hiç ulaşmayabilir. İki kez deneyen bir öğrenci iki olay oluşturur. Olay, öğrencinin hangi hata ya da soru hakkında sorduğunu söylemez.',
      'El evento lo envía la extensión, así que un fallo sin conexión de red puede no llegar nunca. Un estudiante que lo intentó dos veces genera dos eventos. El evento no dice sobre qué error o pregunta se preguntó.',
    ),
    teacher: T(
      'If many requests fail during a lab, tell the students to wait a minute and try again. The error message does not mean their code is wrong.',
      'Bir laboratuvar sırasında birçok istek başarısız oluyorsa öğrencilere bir dakika bekleyip yeniden denemelerini söyleyin. Hata mesajı kodlarının yanlış olduğu anlamına gelmez.',
      'Si fallan muchas peticiones durante un laboratorio, diga a los estudiantes que esperen un minuto y lo intenten de nuevo. El mensaje de error no significa que su código esté mal.',
    ),
  },

  // ------------------------------------------------------------------ usage limits
  {
    slug: 'usage-limits', category: 'system',
    items: ['usage_counters.requests', 'usage_counters.total_tokens', 'rate_limits.hourly', 'rate_limits.daily', 'metric.quota_today'],
    title: T('Usage limits', 'Kullanım sınırları', 'Límites de uso'),
    what: {
      heading: T('What are the usage limits?', 'Kullanım sınırları nedir?', '¿Qué son los límites de uso?'),
      text: T(
        'Each student may ask a limited number of questions per hour and per day. The server counts the generated answers of each student per hour. An admin can change the two limits in the dashboard.',
        'Her öğrenci saatte ve günde sınırlı sayıda soru sorabilir. Sunucu her öğrencinin üretilen yanıtlarını saat başına sayar. Bir yönetici iki sınırı panelde değiştirebilir.',
        'Cada estudiante puede hacer un número limitado de preguntas por hora y por día. El servidor cuenta las respuestas generadas de cada estudiante por hora. Una persona administradora puede cambiar los dos límites en el panel.',
      ),
    },
    example: {
      en: (f) => `In the sample the limits were the defaults: ${f.defaultHourly} requests per hour and ${f.defaultDaily} per day. No student came close: the highest value in one hour was ${f.maxPerHour} requests. The counters have ${f.hours} rows, one per student and hour with at least one answer.`,
      tr: (f) => `Örnekte sınırlar varsayılan değerlerdeydi: saatte ${f.defaultHourly}, günde ${f.defaultDaily} istek. Hiçbir öğrenci bunlara yaklaşmadı: bir saatteki en yüksek değer ${f.maxPerHour} istekti. Sayaçların ${f.hours} satırı var, en az bir yanıtın olduğu her öğrenci ve saat için bir satır.`,
      es: (f) => `En la muestra los límites eran los predeterminados: ${f.defaultHourly} peticiones por hora y ${f.defaultDaily} por día. Ningún estudiante se acercó: el valor más alto en una hora fue de ${f.maxPerHour} peticiones. Los contadores tienen ${f.hours} filas, una por estudiante y hora con al menos una respuesta.`,
    },
    takeaway: T('Most student-hours have only one or two answers, far below the limit.', 'Öğrenci-saatlerin çoğunda yalnızca bir ya da iki yanıt var, sınırın çok altında.', 'La mayoría de las horas por estudiante tienen solo una o dos respuestas, muy por debajo del límite.'),
    purpose: {
      teacher: T('Is the limit high enough for a lab, and does anyone ask very often?', 'Sınır bir laboratuvar için yeterince yüksek mi ve çok sık soran biri var mı?', '¿Es el límite lo bastante alto para un laboratorio, y hay alguien que pregunta muy a menudo?'),
      researcher: T('Did the limits restrict help-seeking during the study?', 'Sınırlar çalışma sırasında yardım istemeyi kısıtladı mı?', '¿Restringieron los límites la búsqueda de ayuda durante el estudio?'),
    },
    raw: {
      intro: T('Two hours of S07.', 'S07’nin iki saati.', 'Dos horas de S07.'),
      snippets: [{ name: 'usage-limits', caption: tbl('usage_counters', false) }],
    },
    formulas: [
      {
        id: 'usage_counters.requests',
        heading: T('How requests are counted', 'İstekler nasıl sayılır', 'Cómo se cuentan las peticiones'),
        text: T('Goes up by one for each generated answer in the UTC hour. Answers from the cache do not count.', 'UTC saatindeki her üretilen yanıt için bir artar. Önbellekten gelen yanıtlar sayılmaz.', 'Sube uno por cada respuesta generada en la hora UTC. Las respuestas de la caché no cuentan.'),
      },
      {
        id: 'rate_limits.daily',
        heading: T('Limits', 'Sınırlar', 'Límites'),
        text: {
          en: (f) => `An admin sets the hourly and the daily limit in the dashboard. Until then, the server uses its own defaults (${f.defaultHourly} and ${f.defaultDaily}). The day starts at 00:00 UTC.`,
          tr: (f) => `Bir yönetici saatlik ve günlük sınırı panelde belirler. O zamana kadar sunucu kendi varsayılan değerlerini (${f.defaultHourly} ve ${f.defaultDaily}) kullanır. Gün 00.00 UTC’de başlar.`,
          es: (f) => `Una persona administradora fija el límite por hora y por día en el panel. Hasta entonces, el servidor usa sus propios valores predeterminados (${f.defaultHourly} y ${f.defaultDaily}). El día empieza a las 00:00 UTC.`,
        },
      },
      {
        id: 'metric.quota_today',
        heading: T('Usage limits today (dashboard)', 'Bugünkü kullanım sınırları (panel)', 'Límites de uso de hoy (panel)'),
        text: T('For the ten most active students: requests in the current UTC hour, and requests and tokens since 00:00 UTC.', 'En aktif on öğrenci için: o anki UTC saatindeki istekler ve 00.00 UTC’den bu yana istekler ve tokenler.', 'Para los diez estudiantes más activos: peticiones en la hora UTC actual, y peticiones y tokens desde las 00:00 UTC.'),
      },
    ],
    research: {
      stage: QUALITY,
      spss: T('`max_requests_hour` per student, to show that nobody was blocked often.', 'Hiç kimsenin sık engellenmediğini göstermek için öğrenci başına `max_requests_hour`.', '`max_requests_hour` por estudiante, para mostrar que nadie quedó bloqueado a menudo.'),
      analysis: T('Report the limits in the Method section together with the number of `rate_limited` failures.', 'Sınırları Yöntem bölümünde `rate_limited` başarısızlıklarının sayısıyla birlikte raporlayın.', 'Informe de los límites en la sección de Método junto al número de fallos `rate_limited`.'),
      sentence: T('Each student could request up to a fixed number of AI answers per hour and per day, and the limits were rarely reached.', 'Her öğrenci saatte ve günde belirli sayıda yapay zekâ yanıtı isteyebilmiş ve sınırlara nadiren ulaşılmıştır.', 'Cada estudiante podía pedir un número fijo de respuestas de IA por hora y por día, y los límites rara vez se alcanzaron.'),
    },
    limits: T(
      'The counters use UTC hours and days, which do not match local lab hours. Only generated answers count, so failed requests and answers from the cache are not in the counters. The table keeps only the current limits. Earlier values are in the audit log of the dashboard.',
      'Sayaçlar UTC saatlerini ve günlerini kullanır. Bunlar yerel laboratuvar saatleriyle örtüşmez. Yalnızca üretilen yanıtlar sayılır, bu yüzden başarısız istekler ve önbellekten gelen yanıtlar sayaçlarda yoktur. Tablo yalnızca güncel sınırları tutar. Önceki değerler panelin denetim kaydındadır.',
      'Los contadores usan horas y días UTC, que no coinciden con las horas locales de laboratorio. Solo cuentan las respuestas generadas, así que las peticiones fallidas y las respuestas de la caché no están en los contadores. La tabla solo guarda los límites actuales. Los valores anteriores están en el registro de auditoría del panel.',
    ),
    teacher: T(
      'If a student reaches the limit in a lab, talk with them. Very frequent questions can be a sign of trial and error without reading the hints.',
      'Bir öğrenci bir laboratuvarda sınıra ulaşırsa onunla konuşun. Çok sık sorular, ipuçlarını okumadan deneme yanılma yapıldığının bir işareti olabilir.',
      'Si un estudiante alcanza el límite en un laboratorio, hable con él o ella. Preguntas muy frecuentes pueden indicar prueba y error sin leer las pistas.',
    ),
  },
];
