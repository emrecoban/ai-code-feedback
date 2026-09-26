---
title: Gizli öğrenci notları
items:
  - learner_profiles.summary
  - learner_profiles.summary_generated_at
  - learner_profiles.interactions_since_update
  - metric.ext_summary_progress
  - metric.summary_cadence
sample:
  - views/private-notes.json#facts.rewrites = 8
  - views/private-notes.json#facts.featuredQuestions = 37
  - views/private-notes.json#facts.cacheHits = 3
  - views/private-notes.json#facts.current = 1
---

# Gizli öğrenci notları

## Gizli öğrenci notları nedir? {#what}

Gizli öğrenci notları, modelin kendisi için öğrenci hakkında yazdığı kısa bir İngilizce metindir. Model ipuçlarını uyarlayabilsin diye sonraki her açıklama isteğiyle birlikte gönderilir. Kenar çubuğu ve panel bunları göstermez.

## Bir öğrenciyle örnek {#example}

S07’nin notları sekiz haftada yapay zekâ öğrenme özetiyle birlikte 8 kez yeniden yazıldı. S07 37 soru sordu ve 3 yanıt önbellekten geldi. Bu yanıtlar bir sonraki yeniden yazım için sayılmadı. Sonunda 1 yeni soru bir sonraki yeniden yazımı bekliyordu. Veritabanı yalnızca son sürümü tutar. Bir sonraki bölümdeki yeniden yazım listesi örnek veri üretecinden gelir ve kuralın nasıl işlediğini gösterir.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="private-notes" /></ClientOnly>
<template #takeaway>S07’nin notları yaklaşık haftada bir, her seferinde üç ile altı yeni sorudan sonra yeniden yazıldı.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Model bir öğrenci hakkında neyi "hatırlıyor"?
- **Araştırmacı:** Geri bildirim nasıl kişiselleştiriliyor ve kişiselleştirme ne sıklıkla değişiyor?

## Ham veri örneği {#raw}

Örneğin sonunda S07’nin notları.

`learner_profiles` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/private-notes.json

### Notlar nasıl yazılır {#learner-profiles-summary}

İngilizce, üçüncü tekil şahısla, yalnızca model için iki ile dört kısa cümle. Model bunları yapay zekâ öğrenme özetiyle aynı çağrıda yazar.

<FormulaVersion ids="learner_profiles.summary" />

### Notlar ne zaman yeniden yazılır {#metric-summary-cadence}

24 saat geçtiğinde ve en az 3 yeni soru olduğunda yeni bir sürüm yazılır. Geri bildirim dili değiştirildikten sonra hemen yazılır. Model son 30 soruyu başlıkları ve sonuçlarıyla görür.

<FormulaVersion ids="metric.summary_cadence" />

### Özetten sonraki yeni sorular {#learner-profiles-interactions-since-update}

Önbellekten gelmeyen her yanıt için 1 artar ve notlar yeniden yazıldığında 0’a döner.

<FormulaVersion ids="learner_profiles.interactions_since_update" />

### Özet ilerleme çubuğu {#metric-ext-summary-progress}

Kenar çubuğu iki paydan küçük olanı gösterir: son özetten bu yana geçen saat ÷ 24 ve yeni sorular ÷ 3, en fazla 1. Değer 1 olduğunda eklenti yeni bir özet ister.

<FormulaVersion ids="metric.ext_summary_progress" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde (kişiselleştirmeyi betimlemek için)
- **SPSS için öğrenci başına tek değer:** Yok. Yalnızca son metin ve zamanı saklanır, bu yüzden yeniden yazım sayısı sonradan sayılamaz.
- **Örnek analiz:** Kuralı Yöntem bölümünde betimleyin. Kişisel veri içermediklerini kontrol etmek için son notlardan bir örneklem okuyun.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Geri bildirim, modelin öğrencinin son sorularından günde en fazla bir kez yeniden yazdığı kısa bir öğrenci profiliyle kişiselleştirilmiştir."

## Bu verinin göstermedikleri {#limits}

Yalnızca son sürüm saklanır, bu yüzden notların geçmişi kaybolur. Önbellekten gelen yanıtlar bir sonraki yeniden yazım için sayılmaz. Notlar modelin öğrenciye bakışıdır ve yanlış olabilir.

## Öğretmen için {#teacher}

::: tip Derste
Öğrenciler ipuçlarının zamanla neden değiştiğini sorabilir. Aracın ipuçlarını uyarlamak için son soruları hakkında kısa notlar tuttuğunu açıklayabilirsiniz.
:::
