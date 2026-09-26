---
title: Öğrenci paneli
items:
  - metric.ext_explanations_asked
  - metric.ext_errors_worked_out
  - metric.ext_days_using
  - metric.ext_activity_totals
sample:
  - views/student-panel.json#facts.explanationsAskedFor = 37
  - views/student-panel.json#facts.daysUsingThis = 11
  - views/student-panel.json#facts.totalActiveHours = 11.7
  - views/student-panel.json#facts.errorsWorkedOutYourself = 22
  - views/student-panel.json#facts.errorsFixedWithoutAsking = 52
---

# Öğrenci paneli

## Öğrenci paneli nedir? {#what}

Eklentinin kenar çubuğu her öğrenciye kendi çalışması hakkında birkaç sayı gösterir. Eklenti bunları öğrencinin bilgisayarında, öğrencinin kendi satırlarından hesaplar. Bu panel için yeni bir şey saklanmaz.

## Bir öğrenciyle örnek {#example}

Örneğin sonunda S07’nin paneli 37 istenen açıklama, 11 kullanım günü ve 11,7 saat aktif süre gösteriyor. İki sayı kolayca karışır: "Kendin çözdüğün hatalar" (22) S07’nin kuralı ya da düzeltmeyi açmadığı soruları, "Sormadan düzelttiğin hatalar" (52) ise hiç soru sorulmadan giden hataları sayar.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="student-panel" /></ClientOnly>
<template #takeaway>Tablo, panelin S07 için gösterdiği tüm sayıları listeliyor. Her sayı kendi veri sayfasında açıklanıyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Bir öğrenci kendi ilerlemesi hakkında ne görüyor?
- **Araştırmacı:** Öğrenciler kendi davranışları hakkında, davranışın kendisini de değiştirebilecek hangi geri bildirimi aldı?

## Ham veri örneği {#raw}

Panel hiçbir şey saklamaz. Öğrencinin `interactions` ve `coding_sessions` tablolarındaki satırlarını okur. Bu satırlar diğer veri sayfalarında açıklanır.

### İstenen açıklama sayısı {#metric-ext-explanations-asked}

Öğrencinin tüm soruları.

<FormulaVersion ids="metric.ext_explanations_asked" />

### Kendin çözdüğün hatalar {#metric-ext-errors-worked-out}

Öğrencinin L0–L1’de biten soruları. Öğrenci yine de bir açıklama istemiştir.

<FormulaVersion ids="metric.ext_errors_worked_out" />

### Kullandığın gün sayısı {#metric-ext-days-using}

Oturum başlangıçlarının farklı takvim günleri, öğrencinin bilgisayarının saat diliminde.

<FormulaVersion ids="metric.ext_days_using" />

### Tüm oturumlar üzerinden toplamlar {#metric-ext-activity-totals}

Öğrencinin tüm oturumları üzerinden toplamlar: aktif süre (saat olarak), eklenen satırlar, silinen satırlar, oluşturulan dosyalar ve sormadan düzeltilen hatalar.

<FormulaVersion ids="metric.ext_activity_totals" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında (uygulamanın bir parçası)
- **SPSS için öğrenci başına tek değer:** Yok. Aynı değerler diğer sayfalardaki ham veriden hesaplanabilir.
- **Örnek analiz:** Paneli Yöntem bölümünde müdahalenin bir parçası olarak betimleyin.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Eklenti her öğrenciye kendi kullanım istatistiklerini içeren bir özet paneli göstermiştir. Bu panel müdahalenin bir parçasıydı."

## Bu verinin göstermedikleri {#limits}

İki hata sayısının adları benzerdir ama farklı şeyler ölçerler. "Kullandığın gün sayısı" öğrencinin saat dilimini kullandığı için panelden farklı olabilir. Panel tüm zamanların toplamlarını gösterir, bu yüzden haftalar içindeki değişimi gösteremez.

## Öğretmen için {#teacher}

::: tip Derste
İki hata sayısını sınıfa bir kez açıklayın. Aksi halde öğrenciler "Kendin çözdüğün hatalar" sayısını araç olmadan çözdükleri hatalar olarak okuyabilir.
:::
