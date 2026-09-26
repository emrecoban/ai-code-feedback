* Sentetik örnek veri. Gerçek çalışma verisi değildir.
* synthetic_students_wide.csv dosyasını okur ve Türkçe değişken etiketlerini, değer etiketlerini ve eksik değer kodlarını uygular.
* Bu dosyayı çalıştırmadan önce, açık veri seti yokken SET UNICODE=ON. komutunu çalıştırın.

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
  student 'Katılımcı kodu' /
  feedback_language 'Geri bildirim dili' /
  n_sessions 'Oturumlar (boş oturumlar olmadan)' /
  active_hours 'Aktif kodlama süresi (saat)' /
  active_days 'Aktif gün' /
  questions 'Sorular' /
  questions_per_hour 'Aktif saat başına soru' /
  error_question_pct 'Bir hata hakkındaki sorular (%)' /
  hint_enough_pct 'İpucu yeterli oldu (%)' /
  fix_pct 'Düzeltmeye ulaşan sorular (%)' /
  mean_edits_before_ask 'Sormadan önceki düzenlemeler (ortalama)' /
  median_help_latency_s 'Yardım teklifinden sonra bekleme (ortanca, sn)' /
  offers_taken_pct 'Teklif edildiğinde yardım istedi (%)' /
  fixed_unaided 'Sormadan düzeltilen' /
  fixed_unaided_per_hour 'Aktif saat başına sormadan düzeltilen' /
  no_help_session_pct 'Yardımsız oturumlar (%, boş oturumlar olmadan)' /
  error_gone_pct 'Açıklamadan sonra hata gitti (%)' /
  median_visible_s 'Ekranda kalma süresi (ortanca, sn)' /
  median_return_s 'Koda dönüş süresi (ortanca, sn)' /
  abandon_pct 'Bir şey yapmadan bırakılan sorular (%)' /
  copies 'Açıklamalardan kopyalamalar' /
  reopens 'Yeniden açılan açıklamalar' /
  helpful_pct 'Faydalı bulunan (verilen değerlendirmelerin %)' /
  solved_pct '"Çözdüm" yanıtı (yanıtların %)' /
  confident_pct '"Evet, tek başıma yapabilirim" yanıtı (yanıtların %)' /
  large_pastes 'Büyük yapıştırma' /
  left_vscode_per_hour 'Aktif saat başına VS Code’dan ayrılma' /
  lines_added 'Eklenen satır' /
  failed_requests 'Başarısız istekler' /
  cache_pct 'Önbellekten yanıtlanan (%)' /
  pre_total 'Ön test puanı' /
  post_total 'Son test puanı' /
  gain 'Öğrenme kazancı (son test eksi ön test)' /
  tam_pu 'Algılanan fayda (TAM)' /
  tam_sn 'Öznel norm (TAM)' /
  tam_bi 'Davranışsal niyet (TAM)' /
  tam_att 'Tutum (TAM)' /
  tam_au 'Gerçek kullanım (TAM)' /
  PreQ1 'Ön test maddesi 1' /
  PreQ2 'Ön test maddesi 2' /
  PreQ3 'Ön test maddesi 3' /
  PreQ4 'Ön test maddesi 4' /
  PreQ5 'Ön test maddesi 5' /
  PreQ6 'Ön test maddesi 6' /
  PreQ7 'Ön test maddesi 7' /
  PreQ8 'Ön test maddesi 8' /
  PreQ9 'Ön test maddesi 9' /
  PreQ10 'Ön test maddesi 10' /
  PreQ11 'Ön test maddesi 11' /
  PreQ12 'Ön test maddesi 12' /
  PreQ13 'Ön test maddesi 13' /
  PreQ14 'Ön test maddesi 14' /
  PreQ15 'Ön test maddesi 15' /
  PreQ16 'Ön test maddesi 16' /
  PreQ17 'Ön test maddesi 17' /
  PreQ18 'Ön test maddesi 18' /
  PreQ19 'Ön test maddesi 19' /
  PreQ20 'Ön test maddesi 20' /
  PreQ21 'Ön test maddesi 21' /
  PreQ22 'Ön test maddesi 22' /
  PreQ23 'Ön test maddesi 23' /
  PreQ24 'Ön test maddesi 24' /
  PreQ25 'Ön test maddesi 25' /
  PreQ26 'Ön test maddesi 26' /
  PreQ27 'Ön test maddesi 27' /
  PreQ28 'Ön test maddesi 28' /
  PostQ1 'Son test maddesi 1' /
  PostQ2 'Son test maddesi 2' /
  PostQ3 'Son test maddesi 3' /
  PostQ4 'Son test maddesi 4' /
  PostQ5 'Son test maddesi 5' /
  PostQ6 'Son test maddesi 6' /
  PostQ7 'Son test maddesi 7' /
  PostQ8 'Son test maddesi 8' /
  PostQ9 'Son test maddesi 9' /
  PostQ10 'Son test maddesi 10' /
  PostQ11 'Son test maddesi 11' /
  PostQ12 'Son test maddesi 12' /
  PostQ13 'Son test maddesi 13' /
  PostQ14 'Son test maddesi 14' /
  PostQ15 'Son test maddesi 15' /
  PostQ16 'Son test maddesi 16' /
  PostQ17 'Son test maddesi 17' /
  PostQ18 'Son test maddesi 18' /
  PostQ19 'Son test maddesi 19' /
  PostQ20 'Son test maddesi 20' /
  PostQ21 'Son test maddesi 21' /
  PostQ22 'Son test maddesi 22' /
  PostQ23 'Son test maddesi 23' /
  PostQ24 'Son test maddesi 24' /
  PostQ25 'Son test maddesi 25' /
  PostQ26 'Son test maddesi 26' /
  PostQ27 'Son test maddesi 27' /
  PostQ28 'Son test maddesi 28' /
  Item1 'TAM maddesi 1' /
  Item2 'TAM maddesi 2' /
  Item3 'TAM maddesi 3' /
  Item4 'TAM maddesi 4' /
  Item5 'TAM maddesi 5' /
  Item6 'TAM maddesi 6' /
  Item7 'TAM maddesi 7' /
  Item8 'TAM maddesi 8' /
  Item9 'TAM maddesi 9' /
  Item10 'TAM maddesi 10' /
  Item11 'TAM maddesi 11' /
  Item12 'TAM maddesi 12' /
  Item13 'TAM maddesi 13' /
  Item14 'TAM maddesi 14' /
  Item15 'TAM maddesi 15' /
  Item16 'TAM maddesi 16' /
  Item17 'TAM maddesi 17' /
  Item18 'TAM maddesi 18' /
  Item19 'TAM maddesi 19'.

ADD VALUE LABELS
  feedback_language 1 'İngilizce' 2 'Türkçe' 3 'İspanyolca' /
  PreQ1 PreQ2 PreQ3 PreQ4 PreQ5 PreQ6 PreQ7 PreQ8 PreQ9 PreQ10 PreQ11 PreQ12 PreQ13 PreQ14 PreQ15 PreQ16 PreQ17 PreQ18 PreQ19 PreQ20 PreQ21 PreQ22 PreQ23 PreQ24 PreQ25 PreQ26 PreQ27 PreQ28 PostQ1 PostQ2 PostQ3 PostQ4 PostQ5 PostQ6 PostQ7 PostQ8 PostQ9 PostQ10 PostQ11 PostQ12 PostQ13 PostQ14 PostQ15 PostQ16 PostQ17 PostQ18 PostQ19 PostQ20 PostQ21 PostQ22 PostQ23 PostQ24 PostQ25 PostQ26 PostQ27 PostQ28 0 'yanlış' 1 'doğru' /
  feedback_language n_sessions active_hours active_days questions questions_per_hour error_question_pct hint_enough_pct fix_pct mean_edits_before_ask median_help_latency_s offers_taken_pct fixed_unaided fixed_unaided_per_hour no_help_session_pct error_gone_pct median_visible_s median_return_s abandon_pct copies reopens helpful_pct solved_pct confident_pct large_pastes left_vscode_per_hour lines_added failed_requests cache_pct pre_total post_total gain tam_pu tam_sn tam_bi tam_att tam_au PreQ1 PreQ2 PreQ3 PreQ4 PreQ5 PreQ6 PreQ7 PreQ8 PreQ9 PreQ10 PreQ11 PreQ12 PreQ13 PreQ14 PreQ15 PreQ16 PreQ17 PreQ18 PreQ19 PreQ20 PreQ21 PreQ22 PreQ23 PreQ24 PreQ25 PreQ26 PreQ27 PreQ28 PostQ1 PostQ2 PostQ3 PostQ4 PostQ5 PostQ6 PostQ7 PostQ8 PostQ9 PostQ10 PostQ11 PostQ12 PostQ13 PostQ14 PostQ15 PostQ16 PostQ17 PostQ18 PostQ19 PostQ20 PostQ21 PostQ22 PostQ23 PostQ24 PostQ25 PostQ26 PostQ27 PostQ28 Item1 Item2 Item3 Item4 Item5 Item6 Item7 Item8 Item9 Item10 Item11 Item12 Item13 Item14 Item15 Item16 Item17 Item18 Item19 -99 'Uygulanamaz' -98 'Ölçülmedi' -97 'Yanıtlanmadı'.

MISSING VALUES
  feedback_language n_sessions active_hours active_days questions questions_per_hour error_question_pct hint_enough_pct fix_pct mean_edits_before_ask median_help_latency_s offers_taken_pct fixed_unaided fixed_unaided_per_hour no_help_session_pct error_gone_pct median_visible_s median_return_s abandon_pct copies reopens helpful_pct solved_pct confident_pct large_pastes left_vscode_per_hour lines_added failed_requests cache_pct pre_total post_total gain tam_pu tam_sn tam_bi tam_att tam_au PreQ1 PreQ2 PreQ3 PreQ4 PreQ5 PreQ6 PreQ7 PreQ8 PreQ9 PreQ10 PreQ11 PreQ12 PreQ13 PreQ14 PreQ15 PreQ16 PreQ17 PreQ18 PreQ19 PreQ20 PreQ21 PreQ22 PreQ23 PreQ24 PreQ25 PreQ26 PreQ27 PreQ28 PostQ1 PostQ2 PostQ3 PostQ4 PostQ5 PostQ6 PostQ7 PostQ8 PostQ9 PostQ10 PostQ11 PostQ12 PostQ13 PostQ14 PostQ15 PostQ16 PostQ17 PostQ18 PostQ19 PostQ20 PostQ21 PostQ22 PostQ23 PostQ24 PostQ25 PostQ26 PostQ27 PostQ28 Item1 Item2 Item3 Item4 Item5 Item6 Item7 Item8 Item9 Item10 Item11 Item12 Item13 Item14 Item15 Item16 Item17 Item18 Item19 (-99, -98, -97).

EXECUTE.
