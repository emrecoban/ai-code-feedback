// Content used to fill the synthetic rows: Python errors in the form Pylance
// reports them, lab topics, and short texts in the three feedback languages.
// Everything here is invented for the sample.

export const LANGS = ['en', 'tr', 'es'];

const same = (s) => ({ en: s, tr: s, es: s });

/** Pylance-style diagnostics a beginner meets. weeks = relative weight per lab week 1-8. */
export const ERRORS = [
  {
    key: 'undefined', code: 'reportUndefinedVariable', severity: 'error', vars: ['total', 'count', 'name', 'result', 'item'],
    msg: (v) => `"${v}" is not defined`,
    concept: { en: 'variable definition', tr: 'değişken tanımlama', es: 'definición de variables' },
    title: { en: (v) => `Undefined variable ${v}`, tr: (v) => `Tanımsız değişken: ${v}`, es: (v) => `Variable ${v} no definida` },
    weeks: [3, 2, 2, 1, 1, 1, 1, 1],
  },
  {
    key: 'indent', code: null, severity: 'error', msg: () => 'Expected indented block',
    concept: { en: 'indentation', tr: 'girinti', es: 'sangría' },
    title: { en: () => 'Missing indented block', tr: () => 'Eksik girintili blok', es: () => 'Falta el bloque sangrado' },
    weeks: [3, 3, 2, 1, 1, 1, 1, 1],
  },
  {
    key: 'colon', code: null, severity: 'error', msg: () => 'Expected ":"',
    concept: { en: 'statement syntax', tr: 'deyim sözdizimi', es: 'sintaxis de sentencias' },
    title: { en: () => 'Missing colon after a condition', tr: () => 'Koşuldan sonra eksik iki nokta', es: () => 'Faltan los dos puntos tras la condición' },
    weeks: [1, 3, 2, 1, 1, 1, 0.5, 0.5],
  },
  {
    key: 'str_int', code: 'reportOperatorIssue', severity: 'error',
    msg: () => 'Operator "+" not supported for types "Literal[\'Total: \']" and "int"',
    concept: { en: 'type conversion', tr: 'tür dönüşümü', es: 'conversión de tipos' },
    title: { en: () => 'Adding text and a number', tr: () => 'Metin ile sayıyı toplama', es: () => 'Sumar texto y un número' },
    weeks: [3, 2, 1, 1, 2, 1, 1, 1],
  },
  {
    key: 'arg_type', code: 'reportArgumentType', severity: 'error',
    msg: () => 'Argument of type "str" cannot be assigned to parameter "stop" of type "SupportsIndex"',
    concept: { en: 'type conversion', tr: 'tür dönüşümü', es: 'conversión de tipos' },
    title: { en: () => 'Text passed to range()', tr: () => "range() içine metin verildi", es: () => 'Texto pasado a range()' },
    weeks: [1, 1, 3, 1, 1, 1, 1, 1],
  },
  {
    key: 'unbound', code: 'reportPossiblyUnbound', severity: 'warning', vars: ['result', 'largest', 'found'],
    msg: (v) => `"${v}" is possibly unbound`,
    concept: { en: 'variable scope', tr: 'değişken kapsamı', es: 'ámbito de variables' },
    title: { en: (v) => `${v} may have no value`, tr: (v) => `${v} değersiz kalabilir`, es: (v) => `${v} puede no tener valor` },
    weeks: [0.5, 2, 2, 1, 1, 2, 1, 1],
  },
  {
    key: 'attr', code: 'reportAttributeAccessIssue', severity: 'error', vars: ['apend', 'push', 'lenght'],
    msg: (v) => `Cannot access attribute "${v}" for class "list[int]"`,
    concept: { en: 'list methods', tr: 'liste metotları', es: 'métodos de listas' },
    title: { en: (v) => `Unknown list method ${v}`, tr: (v) => `Bilinmeyen liste metodu: ${v}`, es: (v) => `Método de lista desconocido: ${v}` },
    weeks: [0, 0, 0.5, 3, 2, 1, 1, 1],
  },
  {
    key: 'index', code: 'reportIndexIssue', severity: 'error', msg: () => '"__getitem__" method not defined on type "int"',
    concept: { en: 'indexing', tr: 'indeksleme', es: 'indexación' },
    title: { en: () => 'Indexing a number', tr: () => 'Sayıyı indeksleme', es: () => 'Indexar un número' },
    weeks: [0, 0, 1, 3, 3, 1, 1, 1],
  },
  {
    key: 'str_lit', code: null, severity: 'error', msg: () => 'String literal is unterminated',
    concept: { en: 'string literals', tr: 'dize sabitleri', es: 'literales de cadena' },
    title: { en: () => 'Unclosed string', tr: () => 'Kapanmamış dize', es: () => 'Cadena sin cerrar' },
    weeks: [2, 1, 1, 1, 3, 1, 1, 1],
  },
  {
    key: 'call', code: 'reportCallIssue', severity: 'error', vars: ['1', '2'],
    msg: (v) => `Expected ${v} positional argument${v === '1' ? '' : 's'}`,
    concept: { en: 'function parameters', tr: 'fonksiyon parametreleri', es: 'parámetros de funciones' },
    title: { en: () => 'Wrong number of arguments', tr: () => 'Yanlış argüman sayısı', es: () => 'Número incorrecto de argumentos' },
    weeks: [0, 0, 0, 0.5, 1, 4, 2, 2],
  },
  {
    key: 'return', code: null, severity: 'error', msg: () => '"return" can be used only within a function',
    concept: { en: 'function definition', tr: 'fonksiyon tanımı', es: 'definición de funciones' },
    title: { en: () => 'return outside a function', tr: () => 'Fonksiyon dışında return', es: () => 'return fuera de una función' },
    weeks: [0, 0, 0, 0, 0.5, 3, 1, 1],
  },
  {
    key: 'dict', code: 'reportAttributeAccessIssue', severity: 'error', vars: ['append', 'add'],
    msg: (v) => `Cannot access attribute "${v}" for class "dict[str, int]"`,
    concept: { en: 'dictionaries', tr: 'sözlükler', es: 'diccionarios' },
    title: { en: () => 'Adding to a dictionary', tr: () => 'Sözlüğe ekleme', es: () => 'Añadir a un diccionario' },
    weeks: [0, 0, 0, 0, 0, 1, 4, 2],
  },
  {
    key: 'unused', code: 'reportUnusedExpression', severity: 'warning', msg: () => 'Expression value is unused',
    concept: { en: 'expressions and statements', tr: 'ifadeler ve deyimler', es: 'expresiones y sentencias' },
    title: { en: () => 'A line that does nothing', tr: () => 'Hiçbir şey yapmayan satır', es: () => 'Una línea que no hace nada' },
    weeks: [2, 1, 1, 1, 1, 1, 1, 1],
  },
];

/** Lab topic per week, for selection questions and file names. */
export const TOPICS = [
  { file: 'input', concept: { en: 'input and output', tr: 'girdi ve çıktı', es: 'entrada y salida' }, noun: { en: 'input line', tr: 'girdi satırı', es: 'línea de entrada' } },
  { file: 'conditions', concept: { en: 'conditionals', tr: 'koşullar', es: 'condicionales' }, noun: { en: 'if block', tr: 'if bloğu', es: 'bloque if' } },
  { file: 'loops', concept: { en: 'for loops', tr: 'for döngüleri', es: 'bucles for' }, noun: { en: 'for loop', tr: 'for döngüsü', es: 'bucle for' } },
  { file: 'lists', concept: { en: 'lists', tr: 'listeler', es: 'listas' }, noun: { en: 'list code', tr: 'liste kodu', es: 'código de listas' } },
  { file: 'strings', concept: { en: 'string methods', tr: 'dize metotları', es: 'métodos de cadenas' }, noun: { en: 'string method', tr: 'dize metodu', es: 'método de cadena' } },
  { file: 'functions', concept: { en: 'functions', tr: 'fonksiyonlar', es: 'funciones' }, noun: { en: 'function', tr: 'fonksiyon', es: 'función' } },
  { file: 'dicts', concept: { en: 'dictionaries', tr: 'sözlükler', es: 'diccionarios' }, noun: { en: 'dictionary loop', tr: 'sözlük döngüsü', es: 'bucle de diccionario' } },
  { file: 'review', concept: { en: 'nested loops', tr: 'iç içe döngüler', es: 'bucles anidados' }, noun: { en: 'nested loop', tr: 'iç içe döngü', es: 'bucle anidado' } },
];

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
export const SELECTION_TITLE = {
  what_does_this_do: { en: (n) => `Explaining the ${n}`, tr: (n) => `Açıklama: ${n}`, es: (n) => `Explicación: ${n}` },
  why_works: { en: (n) => `Why the ${n} works`, tr: (n) => `${cap(n)} neden çalışıyor`, es: (n) => `Por qué funciona: ${n}` },
  whats_wrong: { en: (n) => `Possible bug in the ${n}`, tr: (n) => `${cap(n)} içinde olası hata`, es: (n) => `Posible error: ${n}` },
  simpler_example: { en: (n) => `Simpler ${n} example`, tr: (n) => `Daha basit ${n} örneği`, es: (n) => `Ejemplo más simple: ${n}` },
  free_text: { en: (n) => `Question about the ${n}`, tr: (n) => `${cap(n)} hakkında soru`, es: (n) => `Pregunta sobre: ${n}` },
};

/** Invented "own questions" (interactions.free_text). */
export const FREE_TEXT = {
  en: ['why does this loop stop too early?', 'is there a shorter way to write this?', 'what is the difference between = and ==?', 'why do I get the same number every time?', 'how can I check if the list is empty?'],
  tr: ['bu döngü neden erken bitiyor?', 'bunu daha kısa yazmanın yolu var mı?', '= ile == arasındaki fark ne?', 'neden her seferinde aynı sayıyı alıyorum?', 'listenin boş olup olmadığını nasıl anlarım?'],
  es: ['¿por qué este bucle termina antes de tiempo?', '¿hay una forma más corta de escribir esto?', '¿cuál es la diferencia entre = y ==?', '¿por qué obtengo siempre el mismo número?', '¿cómo compruebo si la lista está vacía?'],
};

/** One short, generic hint ladder per language, used for every synthetic answer. */
export const LADDER = {
  en: {
    l0_decode: 'The editor cannot find a value with this name at this point of the program.',
    l1_locate: 'Where in your code does this name get its first value?',
    l2_concept: { rule: 'A name must have a value before a line reads it.', example: 'price = 10\nprint(price)' },
    l3_fix: { change: 'Give the variable a starting value before the loop.', why: 'Then the name exists when the loop reads it for the first time.' },
  },
  tr: {
    l0_decode: 'Editör, programın bu noktasında bu adla bir değer bulamıyor.',
    l1_locate: 'Kodunda bu ad ilk değerini nerede alıyor?',
    l2_concept: { rule: 'Bir satır bir adı okumadan önce o ada değer verilmiş olmalıdır.', example: 'fiyat = 10\nprint(fiyat)' },
    l3_fix: { change: 'Döngüden önce değişkene bir başlangıç değeri ver.', why: 'Böylece döngü onu ilk kez okuduğunda ad tanımlı olur.' },
  },
  es: {
    l0_decode: 'El editor no encuentra ningún valor con este nombre en este punto del programa.',
    l1_locate: '¿En qué parte de tu código recibe este nombre su primer valor?',
    l2_concept: { rule: 'Un nombre debe tener un valor antes de que una línea lo lea.', example: 'precio = 10\nprint(precio)' },
    l3_fix: { change: 'Da un valor inicial a la variable antes del bucle.', why: 'Así el nombre existe cuando el bucle lo lee por primera vez.' },
  },
};

export const SUMMARY_PREFIX = { en: 'Worth going back over:', tr: 'Tekrar göz atmakta fayda var:', es: 'Vale la pena repasar:' };

export const STUDENT_SUMMARY = {
  en: (c) => `You asked most often about ${c}. In the recent questions you opened the fix less often than at the start. Many of your questions ended after the first two steps. ${SUMMARY_PREFIX.en} ${c}.`,
  tr: (c) => `En çok ${c} hakkında soru sordun. Son sorularında çözümü başlangıca göre daha az açtın. Sorularının çoğu ilk iki adımdan sonra bitti. ${SUMMARY_PREFIX.tr} ${c}.`,
  es: (c) => `Preguntaste sobre todo por ${c}. En las preguntas recientes abriste la solución menos veces que al principio. Muchas de tus preguntas terminaron tras los dos primeros pasos. ${SUMMARY_PREFIX.es} ${c}.`,
};

export const PRACTICE = {
  en: (c) => `Write a short program that uses ${c}. Change one line and predict the result before you run it again.`,
  tr: (c) => `${c} kullanan kısa bir program yaz. Bir satırı değiştir ve yeniden çalıştırmadan önce sonucu tahmin et.`,
  es: (c) => `Escribe un programa corto que use ${c}. Cambia una línea y predice el resultado antes de ejecutarlo de nuevo.`,
};

export const PRIVATE_NOTES = (c, pct) =>
  `Asks mostly about ${c}. Opened the fix in about ${pct}% of questions. Short explanations work well.`;

export { same };
