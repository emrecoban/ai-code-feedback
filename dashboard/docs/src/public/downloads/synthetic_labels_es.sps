* Datos de muestra sintéticos. No son datos reales del estudio.
* Lee synthetic_students_wide.csv y aplica en español las etiquetas de variables, las etiquetas de valores y los códigos de valores perdidos.
* Ejecute SET UNICODE=ON. sin ningún conjunto de datos abierto antes de ejecutar este archivo.

GET DATA /TYPE=TXT /FILE='synthetic_students_wide.csv' /ENCODING='UTF8'
  /ARRANGEMENT=DELIMITED /DELIMITERS="," /QUALIFIER='"' /FIRSTCASE=2
  /VARIABLES=
    student A8
    feedback_language F4.0
    n_sessions F4.0
    active_hours F8.2
    active_days F4.0
    questions F4.0
    questions_per_hour F8.2
    error_question_pct F8.2
    hint_enough_pct F8.2
    fix_pct F8.2
    mean_edits_before_ask F8.2
    median_help_latency_s F8.2
    offers_taken_pct F8.2
    fixed_unaided F4.0
    fixed_unaided_per_hour F8.2
    no_help_session_pct F8.2
    error_gone_pct F8.2
    median_visible_s F8.2
    median_return_s F8.2
    abandon_pct F8.2
    copies F4.0
    reopens F4.0
    helpful_pct F8.2
    solved_pct F8.2
    confident_pct F8.2
    large_pastes F4.0
    left_vscode_per_hour F8.2
    lines_added F4.0
    failed_requests F4.0
    cache_pct F8.2
    pre_total F4.0
    post_total F4.0
    gain F4.0
    tam_pu F8.2
    tam_sn F8.2
    tam_bi F8.2
    tam_att F8.2
    tam_au F8.2
    PreQ1 F4.0
    PreQ2 F4.0
    PreQ3 F4.0
    PreQ4 F4.0
    PreQ5 F4.0
    PreQ6 F4.0
    PreQ7 F4.0
    PreQ8 F4.0
    PreQ9 F4.0
    PreQ10 F4.0
    PreQ11 F4.0
    PreQ12 F4.0
    PreQ13 F4.0
    PreQ14 F4.0
    PreQ15 F4.0
    PreQ16 F4.0
    PreQ17 F4.0
    PreQ18 F4.0
    PreQ19 F4.0
    PreQ20 F4.0
    PreQ21 F4.0
    PreQ22 F4.0
    PreQ23 F4.0
    PreQ24 F4.0
    PreQ25 F4.0
    PreQ26 F4.0
    PreQ27 F4.0
    PreQ28 F4.0
    PostQ1 F4.0
    PostQ2 F4.0
    PostQ3 F4.0
    PostQ4 F4.0
    PostQ5 F4.0
    PostQ6 F4.0
    PostQ7 F4.0
    PostQ8 F4.0
    PostQ9 F4.0
    PostQ10 F4.0
    PostQ11 F4.0
    PostQ12 F4.0
    PostQ13 F4.0
    PostQ14 F4.0
    PostQ15 F4.0
    PostQ16 F4.0
    PostQ17 F4.0
    PostQ18 F4.0
    PostQ19 F4.0
    PostQ20 F4.0
    PostQ21 F4.0
    PostQ22 F4.0
    PostQ23 F4.0
    PostQ24 F4.0
    PostQ25 F4.0
    PostQ26 F4.0
    PostQ27 F4.0
    PostQ28 F4.0
    Item1 F4.0
    Item2 F4.0
    Item3 F4.0
    Item4 F4.0
    Item5 F4.0
    Item6 F4.0
    Item7 F4.0
    Item8 F4.0
    Item9 F4.0
    Item10 F4.0
    Item11 F4.0
    Item12 F4.0
    Item13 F4.0
    Item14 F4.0
    Item15 F4.0
    Item16 F4.0
    Item17 F4.0
    Item18 F4.0
    Item19 F4.0.
EXECUTE.

VARIABLE LABELS
  student 'Código de participante' /
  feedback_language 'Idioma de las explicaciones' /
  n_sessions 'Sesiones (sin sesiones vacías)' /
  active_hours 'Tiempo activo programando (horas)' /
  active_days 'Días activos' /
  questions 'Preguntas' /
  questions_per_hour 'Preguntas por hora activa' /
  error_question_pct 'Preguntas sobre un error (%)' /
  hint_enough_pct 'Bastó con la pista (%)' /
  fix_pct 'Preguntas que llegaron a la corrección (%)' /
  mean_edits_before_ask 'Ediciones antes de preguntar (media)' /
  median_help_latency_s 'Espera tras la oferta de ayuda (mediana, s)' /
  offers_taken_pct 'Pidió ayuda cuando se le ofreció (%)' /
  fixed_unaided 'Corregidos sin preguntar' /
  fixed_unaided_per_hour 'Corregidos sin preguntar por hora activa' /
  no_help_session_pct 'Sesiones sin ayuda (%, sin sesiones vacías)' /
  error_gone_pct 'Error resuelto tras explicar (%)' /
  median_visible_s 'Tiempo en pantalla (mediana, s)' /
  median_return_s 'Volvió al código tras (mediana, s)' /
  abandon_pct 'Preguntas sin actuar después (%)' /
  copies 'Copias de explicaciones' /
  reopens 'Explicaciones reabiertas' /
  helpful_pct 'Valorado útil (% de las valoraciones)' /
  solved_pct 'Respondió «lo resolví» (% de respuestas)' /
  confident_pct 'Respondió «sí, podría solo» (% de respuestas)' /
  large_pastes 'Pegados grandes' /
  left_vscode_per_hour 'Salidas de VS Code por hora activa' /
  lines_added 'Líneas añadidas' /
  failed_requests 'Solicitudes fallidas' /
  cache_pct 'Respondido desde caché (%)' /
  pre_total 'Puntuación del pretest' /
  post_total 'Puntuación del postest' /
  gain 'Ganancia de aprendizaje (postest menos pretest)' /
  tam_pu 'Utilidad percibida (TAM)' /
  tam_sn 'Norma subjetiva (TAM)' /
  tam_bi 'Intención de uso (TAM)' /
  tam_att 'Actitud (TAM)' /
  tam_au 'Uso real (TAM)' /
  PreQ1 'Ítem 1 del pretest' /
  PreQ2 'Ítem 2 del pretest' /
  PreQ3 'Ítem 3 del pretest' /
  PreQ4 'Ítem 4 del pretest' /
  PreQ5 'Ítem 5 del pretest' /
  PreQ6 'Ítem 6 del pretest' /
  PreQ7 'Ítem 7 del pretest' /
  PreQ8 'Ítem 8 del pretest' /
  PreQ9 'Ítem 9 del pretest' /
  PreQ10 'Ítem 10 del pretest' /
  PreQ11 'Ítem 11 del pretest' /
  PreQ12 'Ítem 12 del pretest' /
  PreQ13 'Ítem 13 del pretest' /
  PreQ14 'Ítem 14 del pretest' /
  PreQ15 'Ítem 15 del pretest' /
  PreQ16 'Ítem 16 del pretest' /
  PreQ17 'Ítem 17 del pretest' /
  PreQ18 'Ítem 18 del pretest' /
  PreQ19 'Ítem 19 del pretest' /
  PreQ20 'Ítem 20 del pretest' /
  PreQ21 'Ítem 21 del pretest' /
  PreQ22 'Ítem 22 del pretest' /
  PreQ23 'Ítem 23 del pretest' /
  PreQ24 'Ítem 24 del pretest' /
  PreQ25 'Ítem 25 del pretest' /
  PreQ26 'Ítem 26 del pretest' /
  PreQ27 'Ítem 27 del pretest' /
  PreQ28 'Ítem 28 del pretest' /
  PostQ1 'Ítem 1 del postest' /
  PostQ2 'Ítem 2 del postest' /
  PostQ3 'Ítem 3 del postest' /
  PostQ4 'Ítem 4 del postest' /
  PostQ5 'Ítem 5 del postest' /
  PostQ6 'Ítem 6 del postest' /
  PostQ7 'Ítem 7 del postest' /
  PostQ8 'Ítem 8 del postest' /
  PostQ9 'Ítem 9 del postest' /
  PostQ10 'Ítem 10 del postest' /
  PostQ11 'Ítem 11 del postest' /
  PostQ12 'Ítem 12 del postest' /
  PostQ13 'Ítem 13 del postest' /
  PostQ14 'Ítem 14 del postest' /
  PostQ15 'Ítem 15 del postest' /
  PostQ16 'Ítem 16 del postest' /
  PostQ17 'Ítem 17 del postest' /
  PostQ18 'Ítem 18 del postest' /
  PostQ19 'Ítem 19 del postest' /
  PostQ20 'Ítem 20 del postest' /
  PostQ21 'Ítem 21 del postest' /
  PostQ22 'Ítem 22 del postest' /
  PostQ23 'Ítem 23 del postest' /
  PostQ24 'Ítem 24 del postest' /
  PostQ25 'Ítem 25 del postest' /
  PostQ26 'Ítem 26 del postest' /
  PostQ27 'Ítem 27 del postest' /
  PostQ28 'Ítem 28 del postest' /
  Item1 'Ítem 1 del TAM' /
  Item2 'Ítem 2 del TAM' /
  Item3 'Ítem 3 del TAM' /
  Item4 'Ítem 4 del TAM' /
  Item5 'Ítem 5 del TAM' /
  Item6 'Ítem 6 del TAM' /
  Item7 'Ítem 7 del TAM' /
  Item8 'Ítem 8 del TAM' /
  Item9 'Ítem 9 del TAM' /
  Item10 'Ítem 10 del TAM' /
  Item11 'Ítem 11 del TAM' /
  Item12 'Ítem 12 del TAM' /
  Item13 'Ítem 13 del TAM' /
  Item14 'Ítem 14 del TAM' /
  Item15 'Ítem 15 del TAM' /
  Item16 'Ítem 16 del TAM' /
  Item17 'Ítem 17 del TAM' /
  Item18 'Ítem 18 del TAM' /
  Item19 'Ítem 19 del TAM'.

ADD VALUE LABELS
  feedback_language 1 'Inglés' 2 'Turco' 3 'Español' /
  PreQ1 PreQ2 PreQ3 PreQ4 PreQ5 PreQ6 PreQ7 PreQ8 PreQ9 PreQ10 PreQ11 PreQ12 PreQ13 PreQ14 PreQ15 PreQ16 PreQ17 PreQ18 PreQ19 PreQ20 PreQ21 PreQ22 PreQ23 PreQ24 PreQ25 PreQ26 PreQ27 PreQ28 PostQ1 PostQ2 PostQ3 PostQ4 PostQ5 PostQ6 PostQ7 PostQ8 PostQ9 PostQ10 PostQ11 PostQ12 PostQ13 PostQ14 PostQ15 PostQ16 PostQ17 PostQ18 PostQ19 PostQ20 PostQ21 PostQ22 PostQ23 PostQ24 PostQ25 PostQ26 PostQ27 PostQ28 0 'incorrecto' 1 'correcto' /
  feedback_language n_sessions active_hours active_days questions questions_per_hour error_question_pct hint_enough_pct fix_pct mean_edits_before_ask median_help_latency_s offers_taken_pct fixed_unaided fixed_unaided_per_hour no_help_session_pct error_gone_pct median_visible_s median_return_s abandon_pct copies reopens helpful_pct solved_pct confident_pct large_pastes left_vscode_per_hour lines_added failed_requests cache_pct pre_total post_total gain tam_pu tam_sn tam_bi tam_att tam_au PreQ1 PreQ2 PreQ3 PreQ4 PreQ5 PreQ6 PreQ7 PreQ8 PreQ9 PreQ10 PreQ11 PreQ12 PreQ13 PreQ14 PreQ15 PreQ16 PreQ17 PreQ18 PreQ19 PreQ20 PreQ21 PreQ22 PreQ23 PreQ24 PreQ25 PreQ26 PreQ27 PreQ28 PostQ1 PostQ2 PostQ3 PostQ4 PostQ5 PostQ6 PostQ7 PostQ8 PostQ9 PostQ10 PostQ11 PostQ12 PostQ13 PostQ14 PostQ15 PostQ16 PostQ17 PostQ18 PostQ19 PostQ20 PostQ21 PostQ22 PostQ23 PostQ24 PostQ25 PostQ26 PostQ27 PostQ28 Item1 Item2 Item3 Item4 Item5 Item6 Item7 Item8 Item9 Item10 Item11 Item12 Item13 Item14 Item15 Item16 Item17 Item18 Item19 -99 'No aplicable' -98 'No medido' -97 'Sin respuesta'.

MISSING VALUES
  feedback_language n_sessions active_hours active_days questions questions_per_hour error_question_pct hint_enough_pct fix_pct mean_edits_before_ask median_help_latency_s offers_taken_pct fixed_unaided fixed_unaided_per_hour no_help_session_pct error_gone_pct median_visible_s median_return_s abandon_pct copies reopens helpful_pct solved_pct confident_pct large_pastes left_vscode_per_hour lines_added failed_requests cache_pct pre_total post_total gain tam_pu tam_sn tam_bi tam_att tam_au PreQ1 PreQ2 PreQ3 PreQ4 PreQ5 PreQ6 PreQ7 PreQ8 PreQ9 PreQ10 PreQ11 PreQ12 PreQ13 PreQ14 PreQ15 PreQ16 PreQ17 PreQ18 PreQ19 PreQ20 PreQ21 PreQ22 PreQ23 PreQ24 PreQ25 PreQ26 PreQ27 PreQ28 PostQ1 PostQ2 PostQ3 PostQ4 PostQ5 PostQ6 PostQ7 PostQ8 PostQ9 PostQ10 PostQ11 PostQ12 PostQ13 PostQ14 PostQ15 PostQ16 PostQ17 PostQ18 PostQ19 PostQ20 PostQ21 PostQ22 PostQ23 PostQ24 PostQ25 PostQ26 PostQ27 PostQ28 Item1 Item2 Item3 Item4 Item5 Item6 Item7 Item8 Item9 Item10 Item11 Item12 Item13 Item14 Item15 Item16 Item17 Item18 Item19 (-99, -98, -97).

EXECUTE.
