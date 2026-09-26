---
title: Soru türü
items:
  - interactions.question_type
  - metric.analytics_question_type_resolution
sample:
  - views/question-type.json#facts.featured_what_does_this_mean = 22
  - views/question-type.json#facts.featured_what_does_this_do = 10
  - views/question-type.json#facts.featuredSidebar = 4
  - views/question-type.json#facts.featured_why_works = 2
  - views/question-type.json#facts.featured_whats_wrong = 2
  - views/question-type.json#facts.whatsWrongHintPct = 75.4
---

# Soru türü

## Soru türü nedir? {#what}

Soru türü, öğrencinin sorduğu sorudur. Her hata sorusu "Bu ne anlama geliyor?" sorusudur. Seçilen kod için öğrenci dört hazır sorudan birini seçer ya da kendi sorusunu yazar.

## Bir öğrenciyle örnek {#example}

S07 "Bu ne anlama geliyor?" sorusunu 22 kez sordu. Seçilen kod için "Bu ne işe yarıyor?" 10 kez kaydedildi. Ama bunların 4 tanesi, listeyi göstermeden bu soruyu soran kenar paneli düğmesinden geldi. S07 "Bu neden çalışıyor?" sorusunu 2 kez, "Burada ne yanlış?" sorusunu 2 kez seçti.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="question-type" /></ClientOnly>
<template #takeaway>SQL raporuna göre "Burada ne yanlış?" sorularının %75,4 kadarı ipucu aşamasında bitti.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler kod seçtiğinde ne öğrenmek istiyor?
- **Araştırmacı:** Soru türü, öğrencinin ipuçlarında ne kadar ilerlediğiyle ilişkili mi?

## Ham veri örneği {#raw}

S07’nin biri hata, biri seçim hakkında iki sorusu.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/question-type.json

### SQL raporu {#metric-analytics-question-type-resolution}

`supabase/analytics/question_type_resolution.sql` her tür için soruları ve bunların kaçının ipucunda (L0–L1), kuralda (L2) ve çözümde (L3) bittiğini sayar. Yukarıdaki tablo, bu raporun örnek veride çalıştırılmış halidir.

<FormulaVersion ids="metric.analytics_question_type_resolution" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Her tür ve öğrenci için bir sayı, örneğin `n_whats_wrong`, ve her türün seçim soruları içindeki payı.
- **Örnek analiz:** Soru türü ile ipucu derinliğini çapraz tabloya koyun ve ilişkiyi yalnızca seçim soruları üzerinde ki-kare testiyle sınayın.

**Araştırma soruları**

<RqList ids="interactions.question_type" />

**Örnek cümle (Yöntem):** "Öğrenciler seçilen kod için dört hazır sorudan birini seçmiş ya da kendi sorusunu yazmış ve seçilen tür her istekle birlikte saklanmıştır."

## Bu verinin göstermedikleri {#limits}

"Bu ne işe yarıyor?" aynı zamanda kenar paneli düğmesinin ve komut paletinin sabit sorusudur. Bu yüzden gerçek bir seçimle varsayılan değeri karıştırır. İkisini ayırmak için başlangıç noktasını kullanın. Hata soruları her zaman aynı türdedir, bu yüzden tür onlar hakkında bir şey söylemez.

## Öğretmen için {#teacher}

::: tip Derste
Öğrenciler "Burada ne yanlış?" sorusunu nadiren kullanıyorsa, editör hata göstermese bile, örneğin çıktı yanlış göründüğünde, bu soruyu sorabileceklerini hatırlatın.
:::
