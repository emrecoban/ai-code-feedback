---
title: Bağımsızlık eğilimi
items:
  - metric.pct_offers_taken
  - metric.pct_hint_enough_weekly
  - metric.pct_sessions_without_help_weekly
  - metric.analytics_dependency_trend
sample:
  - views/independence-trend.json#featuredRows.0.help_offers = 7
  - views/independence-trend.json#featuredRows.0.from_errors = 5
  - views/independence-trend.json#featuredRows.0.questions = 6
  - views/independence-trend.json#featuredRows.7.help_offers = 17
  - views/independence-trend.json#featuredRows.7.from_errors = 1
  - views/independence-trend.json#featuredRows.7.sessions_without_help = 2
  - views/independence-trend.json#featuredRows.2.sessions_without_help = 1
  - views/independence-trend.json#analysis.early.mean = 47.5
  - views/independence-trend.json#analysis.late.mean = 24.1
  - views/independence-trend.json#analysis.pairedT.t = -5.39
  - views/independence-trend.json#analysis.gainCorrelation.r = 0.07
---

# Bağımsızlık eğilimi

## Bağımsızlık eğilimi nedir? {#what}

Bağımsızlık eğilimi, haftalık üç orandan oluşur. Bu oranlar birlikte, öğrencinin haftalar ilerledikçe daha az yardım isteyip istemediğini ve daha az ipucu adımına ihtiyaç duyup duymadığını gösterir. Araştırma paneli bu eğilimi hem tek bir öğrenci hem de tüm sınıf için son 12 hafta boyunca gösterir.

## Bir öğrenciyle örnek {#example}

S07, örnek verideki kurgusal bir öğrencidir. Birinci haftada eklenti 7 hata için yardım teklif etti ve S07 bunların 5’ini sordu. S07, 6 sorunun 5’inde kuralı ya da çözümü açtı. Yani ipucu yalnızca bir kez yeterli oldu. Sekizinci haftada tablo değişti. Eklenti 17 hata için yardım teklif etti, S07 ise yalnızca 1’ini sordu. Üçüncü haftada S07 ikinci bir VS Code penceresi açtı ama bu pencerede çalışmadı. Bu pencere boş bir oturum oluşturdu. Bu yüzden o haftaki oturumların yarısı yardımsız oturum sayılıyor.

## Örnek veride {#visual}

<Figure>
<ClientOnly><IndependenceTrend /></ClientOnly>
<template #takeaway>S07 yardım istemede sınıfın üstünde başlıyor ve altında bitiriyor. Bu sırada ilk ipucu giderek daha sık yeterli oluyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Sınıfım haftalar ilerledikçe hataları kendi başına çözmeye başlıyor mu?
- **Araştırmacı:** Yardım isteme haftalar içinde azalıyor mu ve ilk ipucu daha sık yeterli oluyor mu? Bu, sınıf için ve her öğrenci için nasıl değişiyor?

## Ham veri örneği {#raw}

Eğilim iki tablodan hesaplanır. Aşağıdaki satırlar S07’nin üçüncü haftasına aittir. Yalnızca formüllerin okuduğu sütunlar gösterilmiştir.

`coding_sessions` (ikinci satır, ikinci pencerenin boş oturumudur):

<<< @/../.vitepress/data/sample/snippets/independence-trend.sessions.json

`interactions`:

<<< @/../.vitepress/data/sample/snippets/independence-trend.interactions.json

Panel işlevi `dashboard.weekly_trend`, her hafta için bir satır döndürür. S07’nin üçüncü haftası şöyledir:

<<< @/../.vitepress/data/sample/snippets/independence-trend.week.json

Haftalar, paneli kullanan kişinin saat diliminde pazartesiden pazara kadar sürer. Panel, seçilen dönemin son haftasıyla biten 12 haftayı gösterir.

### Teklif edilince yardım istedi {#offers-taken}

Haftada hatalar hakkında sorulan soruların sayısı, o hafta başlayan oturumlarda sayılan yardım tekliflerine bölünür ve 100 ile çarpılır. Değer en fazla %100 olur. Teklif olmayan haftanın değeri yoktur.

<FormulaVersion ids="metric.pct_offers_taken" />

### İpucu yeterli oldu {#hint-enough}

Öğrencinin ne kuralı (L2) ne de çözümü (L3) açtığı soruların sayısı, haftadaki tüm sorulara bölünür ve 100 ile çarpılır. Sorusu olmayan haftanın değeri yoktur.

<FormulaVersion ids="metric.pct_hint_enough_weekly" />

### Yardımsız oturumlar {#sessions-without-help}

O hafta başlayan ve içinde hiç soru olmayan oturumların sayısı, o hafta başlayan tüm oturumlara bölünür ve 100 ile çarpılır. Oturumu olmayan haftanın değeri yoktur.

<FormulaVersion ids="metric.pct_sessions_without_help_weekly" />

### SQL raporu {#sql-report}

`supabase/analytics/dependency_trend.sql` dosyası, SQL düzenleyicisinde elle çalıştırılan benzer bir haftalık tablo üretir. Bu rapor her soruyu kendi oturumunun haftasına koyar, UTC haftalarını kullanır ve ilk oranı %100 ile sınırlamaz. Bu yüzden değerleri paneldekilerden farklı olabilir.

<FormulaVersion ids="metric.analytics_dependency_trend" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında (haftalık izleme) ve analizde.
- **SPSS için öğrenci başına tek değer:** önce sayıları toplayın, sonra bölün. Örneğin `offers_taken_early` = 100 × (1. ve 2. haftalardaki hata soruları) ÷ (1. ve 2. haftalardaki yardım teklifleri), en fazla 100. `offers_taken_late` değerini 7. ve 8. haftalar için aynı yolla hesaplayın ve farkı değişim puanı olarak kullanın. Haftalık yüzdelerin ortalamasını almayın. Aksi halde tek sorulu bir hafta, on sorulu bir haftayla aynı ağırlığı taşır.
- **Örnek analiz:** `offers_taken_early` ile `offers_taken_late` için eşleştirilmiş örneklemler t-testi ve değişim puanı ile ön testten son teste öğrenme kazancı arasında korelasyon. Sentetik örnekte ortalama %47,5’ten %24,1’e düştü, t(24) = −5,39, p < ,001. Değişim puanı kazançla ilişkili çıkmadı, r(23) = ,07, p = ,744.

**Araştırma soruları**

<RqList ids="metric.pct_offers_taken,metric.pct_hint_enough_weekly,metric.pct_sessions_without_help_weekly" />

**Örnek cümle (sentetik sayılar):** "Yardım isteme, öğrencinin yardım teklif edilen hatalardan soru sorduklarının oranı olarak ölçülmüş (panel formülü, sürüm 1.0) ve 1.–2. haftalar ile 7.–8. haftalar için ayrı ayrı toplanmıştır. Oran %47,5’ten (SS = 27,4) %24,1’e (SS = 22,5) düşmüştür, t(24) = −5,39, p < ,001, dz = −1,08."

## Bu verinin göstermedikleri {#limits}

Bu oranlar öğrencinin eklenti içinde ne yaptığını anlatır, ne öğrendiğini değil. Yardım istemenin azalması artan bağımsızlık anlamına gelebilir. Ama daha kolay görevler, laboratuvarda geçen daha kısa süre ya da arkadaşlardan veya tarayıcıdaki yapay zekâ araçlarından alınan yardım da aynı sonucu verebilir. Yardım teklifleri yalnızca etkin editörde simgeyle işaretlenen hataları sayar (dosya başına en fazla üç). Bu yüzden ilk oranın paydası eksiktir. Fazladan açılan VS Code pencerelerinin boş oturumları yardımsız oturumların payını artırır ve yalnızca bir ya da iki soru içeren haftalar kararsız oranlar verir.

## Öğretmen için {#teacher}

::: tip Derste
"Teklif edilince yardım istedi" sınıf çizgisi ilk haftalardan sonra da yüksek kalıyorsa, sık görülen iki üç hata mesajını birlikte okuyun ve her birinin kodda nereyi gösterdiğini tartışın. Bir öğrencinin çizgisi yeniden yükseliyorsa, o haftaki görevin nasıl gittiğini sorun. Eğilim bir değişimi gösterir, nedenini göstermez.
:::
