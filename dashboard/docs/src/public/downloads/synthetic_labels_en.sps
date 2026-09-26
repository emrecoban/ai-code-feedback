* Synthetic sample data. Not real study data.
* Reads synthetic_students_wide.csv and applies English variable labels, value labels and missing codes.
* Run SET UNICODE=ON. with no data set open before you run this file.

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
  student 'Participant code' /
  feedback_language 'Feedback language' /
  n_sessions 'Sessions (without empty sessions)' /
  active_hours 'Active coding time (hours)' /
  active_days 'Active days' /
  questions 'Questions' /
  questions_per_hour 'Questions per active hour' /
  error_question_pct 'Questions about an error (%)' /
  hint_enough_pct 'Hint was enough (%)' /
  fix_pct 'Questions that reached the fix (%)' /
  mean_edits_before_ask 'Edits before asking (mean)' /
  median_help_latency_s 'Wait after the help offer (median, s)' /
  offers_taken_pct 'Asked for help when offered (%)' /
  fixed_unaided 'Fixed without asking' /
  fixed_unaided_per_hour 'Fixed without asking per active hour' /
  no_help_session_pct 'Sessions without help (%, without empty sessions)' /
  error_gone_pct 'Error gone after explaining (%)' /
  median_visible_s 'Time on screen (median, s)' /
  median_return_s 'Back to the code after (median, s)' /
  abandon_pct 'Questions left without acting (%)' /
  copies 'Copies from explanations' /
  reopens 'Explanations opened again' /
  helpful_pct 'Rated helpful (% of given ratings)' /
  solved_pct 'Answered "solved it" (% of answers)' /
  confident_pct 'Answered "yes, I could do it alone" (% of answers)' /
  large_pastes 'Large pastes' /
  left_vscode_per_hour 'Left VS Code per active hour' /
  lines_added 'Lines added' /
  failed_requests 'Failed requests' /
  cache_pct 'Answered from cache (%)' /
  pre_total 'Pre-test score' /
  post_total 'Post-test score' /
  gain 'Learning gain (post minus pre)' /
  tam_pu 'Perceived usefulness (TAM)' /
  tam_sn 'Subjective norm (TAM)' /
  tam_bi 'Behavioral intention (TAM)' /
  tam_att 'Attitude (TAM)' /
  tam_au 'Actual use (TAM)' /
  PreQ1 'Pre-test item 1' /
  PreQ2 'Pre-test item 2' /
  PreQ3 'Pre-test item 3' /
  PreQ4 'Pre-test item 4' /
  PreQ5 'Pre-test item 5' /
  PreQ6 'Pre-test item 6' /
  PreQ7 'Pre-test item 7' /
  PreQ8 'Pre-test item 8' /
  PreQ9 'Pre-test item 9' /
  PreQ10 'Pre-test item 10' /
  PreQ11 'Pre-test item 11' /
  PreQ12 'Pre-test item 12' /
  PreQ13 'Pre-test item 13' /
  PreQ14 'Pre-test item 14' /
  PreQ15 'Pre-test item 15' /
  PreQ16 'Pre-test item 16' /
  PreQ17 'Pre-test item 17' /
  PreQ18 'Pre-test item 18' /
  PreQ19 'Pre-test item 19' /
  PreQ20 'Pre-test item 20' /
  PreQ21 'Pre-test item 21' /
  PreQ22 'Pre-test item 22' /
  PreQ23 'Pre-test item 23' /
  PreQ24 'Pre-test item 24' /
  PreQ25 'Pre-test item 25' /
  PreQ26 'Pre-test item 26' /
  PreQ27 'Pre-test item 27' /
  PreQ28 'Pre-test item 28' /
  PostQ1 'Post-test item 1' /
  PostQ2 'Post-test item 2' /
  PostQ3 'Post-test item 3' /
  PostQ4 'Post-test item 4' /
  PostQ5 'Post-test item 5' /
  PostQ6 'Post-test item 6' /
  PostQ7 'Post-test item 7' /
  PostQ8 'Post-test item 8' /
  PostQ9 'Post-test item 9' /
  PostQ10 'Post-test item 10' /
  PostQ11 'Post-test item 11' /
  PostQ12 'Post-test item 12' /
  PostQ13 'Post-test item 13' /
  PostQ14 'Post-test item 14' /
  PostQ15 'Post-test item 15' /
  PostQ16 'Post-test item 16' /
  PostQ17 'Post-test item 17' /
  PostQ18 'Post-test item 18' /
  PostQ19 'Post-test item 19' /
  PostQ20 'Post-test item 20' /
  PostQ21 'Post-test item 21' /
  PostQ22 'Post-test item 22' /
  PostQ23 'Post-test item 23' /
  PostQ24 'Post-test item 24' /
  PostQ25 'Post-test item 25' /
  PostQ26 'Post-test item 26' /
  PostQ27 'Post-test item 27' /
  PostQ28 'Post-test item 28' /
  Item1 'TAM item 1' /
  Item2 'TAM item 2' /
  Item3 'TAM item 3' /
  Item4 'TAM item 4' /
  Item5 'TAM item 5' /
  Item6 'TAM item 6' /
  Item7 'TAM item 7' /
  Item8 'TAM item 8' /
  Item9 'TAM item 9' /
  Item10 'TAM item 10' /
  Item11 'TAM item 11' /
  Item12 'TAM item 12' /
  Item13 'TAM item 13' /
  Item14 'TAM item 14' /
  Item15 'TAM item 15' /
  Item16 'TAM item 16' /
  Item17 'TAM item 17' /
  Item18 'TAM item 18' /
  Item19 'TAM item 19'.

ADD VALUE LABELS
  feedback_language 1 'English' 2 'Turkish' 3 'Spanish' /
  PreQ1 PreQ2 PreQ3 PreQ4 PreQ5 PreQ6 PreQ7 PreQ8 PreQ9 PreQ10 PreQ11 PreQ12 PreQ13 PreQ14 PreQ15 PreQ16 PreQ17 PreQ18 PreQ19 PreQ20 PreQ21 PreQ22 PreQ23 PreQ24 PreQ25 PreQ26 PreQ27 PreQ28 PostQ1 PostQ2 PostQ3 PostQ4 PostQ5 PostQ6 PostQ7 PostQ8 PostQ9 PostQ10 PostQ11 PostQ12 PostQ13 PostQ14 PostQ15 PostQ16 PostQ17 PostQ18 PostQ19 PostQ20 PostQ21 PostQ22 PostQ23 PostQ24 PostQ25 PostQ26 PostQ27 PostQ28 0 'wrong' 1 'right' /
  feedback_language n_sessions active_hours active_days questions questions_per_hour error_question_pct hint_enough_pct fix_pct mean_edits_before_ask median_help_latency_s offers_taken_pct fixed_unaided fixed_unaided_per_hour no_help_session_pct error_gone_pct median_visible_s median_return_s abandon_pct copies reopens helpful_pct solved_pct confident_pct large_pastes left_vscode_per_hour lines_added failed_requests cache_pct pre_total post_total gain tam_pu tam_sn tam_bi tam_att tam_au PreQ1 PreQ2 PreQ3 PreQ4 PreQ5 PreQ6 PreQ7 PreQ8 PreQ9 PreQ10 PreQ11 PreQ12 PreQ13 PreQ14 PreQ15 PreQ16 PreQ17 PreQ18 PreQ19 PreQ20 PreQ21 PreQ22 PreQ23 PreQ24 PreQ25 PreQ26 PreQ27 PreQ28 PostQ1 PostQ2 PostQ3 PostQ4 PostQ5 PostQ6 PostQ7 PostQ8 PostQ9 PostQ10 PostQ11 PostQ12 PostQ13 PostQ14 PostQ15 PostQ16 PostQ17 PostQ18 PostQ19 PostQ20 PostQ21 PostQ22 PostQ23 PostQ24 PostQ25 PostQ26 PostQ27 PostQ28 Item1 Item2 Item3 Item4 Item5 Item6 Item7 Item8 Item9 Item10 Item11 Item12 Item13 Item14 Item15 Item16 Item17 Item18 Item19 -99 'Not applicable' -98 'Not measured' -97 'Not answered'.

MISSING VALUES
  feedback_language n_sessions active_hours active_days questions questions_per_hour error_question_pct hint_enough_pct fix_pct mean_edits_before_ask median_help_latency_s offers_taken_pct fixed_unaided fixed_unaided_per_hour no_help_session_pct error_gone_pct median_visible_s median_return_s abandon_pct copies reopens helpful_pct solved_pct confident_pct large_pastes left_vscode_per_hour lines_added failed_requests cache_pct pre_total post_total gain tam_pu tam_sn tam_bi tam_att tam_au PreQ1 PreQ2 PreQ3 PreQ4 PreQ5 PreQ6 PreQ7 PreQ8 PreQ9 PreQ10 PreQ11 PreQ12 PreQ13 PreQ14 PreQ15 PreQ16 PreQ17 PreQ18 PreQ19 PreQ20 PreQ21 PreQ22 PreQ23 PreQ24 PreQ25 PreQ26 PreQ27 PreQ28 PostQ1 PostQ2 PostQ3 PostQ4 PostQ5 PostQ6 PostQ7 PostQ8 PostQ9 PostQ10 PostQ11 PostQ12 PostQ13 PostQ14 PostQ15 PostQ16 PostQ17 PostQ18 PostQ19 PostQ20 PostQ21 PostQ22 PostQ23 PostQ24 PostQ25 PostQ26 PostQ27 PostQ28 Item1 Item2 Item3 Item4 Item5 Item6 Item7 Item8 Item9 Item10 Item11 Item12 Item13 Item14 Item15 Item16 Item17 Item18 Item19 (-99, -98, -97).

EXECUTE.
