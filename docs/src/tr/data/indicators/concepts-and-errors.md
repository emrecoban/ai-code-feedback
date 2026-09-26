---
title: Kavramlar ve hatalar
items:
  - metric.concepts_top_class
  - metric.errors_top_class
sample:
  - views/concepts-and-errors.json#facts.top = tür dönüşümü
  - views/concepts-and-errors.json#facts.topQuestions = 92
  - views/concepts-and-errors.json#facts.topStudents = 17
  - views/concepts-and-errors.json#facts.trStudents = 20
  - views/concepts-and-errors.json#facts.topError = Pylance
  - views/concepts-and-errors.json#facts.topErrorQuestions = 203
  - views/concepts-and-errors.json#facts.topErrorStudents = 24
---

# Kavramlar ve hatalar

## En sık kavramlar ve hatalar nedir? {#what}

Paneldeki iki liste. İlki modelin yanıtlarında adlandırdığı programlama kavramlarını sayar. İkincisi öğrencilerin sorduğu hataları sayar. Panel her satır için soruları, öğrencileri ve düzeltmeye ulaşan soruları gösterir.

## Bir öğrenciyle örnek {#example}

Örnekteki en sık kavram "tür dönüşümü", 17 öğrenciden 92 soruyla. Kavram geri bildirim dilinde yazılır ve 25 öğrencinin 20 tanesi Türkçe kullanıyor. En sık hata satırı 24 öğrenciden 203 soruyla "Pylance". Bu satır birçok farklı sözdizimi hatasını karıştırır (aşağıya bakın).

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="concepts-and-errors" /></ClientOnly>
<template #takeaway>Grafik kavramları gösteriyor. Aynı kavram her geri bildirim dili için bir tane olmak üzere en fazla üç satırda görünebilir.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Derste hangi konuları ve hataları yeniden açıklamalıyım?
- **Araştırmacı:** Derste en çok yardım isteğine hangi kavramlar yol açıyor?

## Ham veri örneği {#raw}

Kavram listesinin ilk iki satırı.

`dashboard_insights` işlevinin döndürdüğü JSON’un bir parçası:

<<< @/../.vitepress/data/sample/snippets/concepts-and-errors.json

### En çok sorulan kavramlar (panel) {#metric-concepts-top-class}

Dönemin en sık 12 kavramı. Büyük ve küçük harf aynı kabul edilir.

<FormulaVersion ids="metric.concepts_top_class" />

### En sık görülen hatalar (panel) {#metric-errors-top-class}

Dönemin en sık 12 hatası. Bir hata kaynağına ve kural koduna göre gruplanır (örneğin `Pylance reportUndefinedVariable`). Kod yoksa SQL yalnızca kaynağı tutar, bu yüzden Pylance’ın tüm sözdizimi hataları "Pylance" adlı tek bir satırda toplanır.

<FormulaVersion ids="metric.errors_top_class" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahaleden sonra (ders tasarımı)
- **SPSS için öğrenci başına tek değer:** Yok. Önce kavramları tek dilde tek bir konu listesine yeniden kodlayın, sonra konu ve öğrenci başına soruları sayın.
- **Örnek analiz:** En çok sorusu olan konuları son testte en düşük puan alan test maddeleriyle ilişkilendirin.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Geri bildirimde adlandırılan kavramlar, üç geri bildirim dilinde ortak bir konu listesine yeniden kodlanmıştır."

## Bu verinin göstermedikleri {#limits}

Kavramı model seçer, bu yüzden aynı fikrin birkaç adı olabilir. Hata listesindeki "Pylance" satırı farklı sözdizimi hatalarını karıştırır ve tek bir hata olarak okunmamalıdır. Listeler koddaki hataların sıklığını değil, soruların sıklığını gösterir.

## Öğretmen için {#teacher}

::: tip Derste
Bir sonraki laboratuvarın başındaki kısa tekrarın konusunu seçmek için kavram listesini kullanın. Gerçek hata mesajlarını görmek için bir öğrencinin ayrıntısını açın.
:::
