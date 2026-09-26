---
title: Zaman içinde sorular
items:
  - metric.questions
  - metric.questions_total
sample:
  - views/questions-over-time.json#facts.featured = 37
  - views/questions-over-time.json#facts.featuredWeek1 = 6
  - views/questions-over-time.json#facts.featuredWeek8 = 2
  - views/questions-over-time.json#facts.total = 928
  - views/questions-over-time.json#facts.week1 = 130
  - views/questions-over-time.json#facts.week8 = 85
---

# Zaman içinde sorular

## Soru sayısı nedir? {#what}

Yanıt alan her yardım isteği bir sorudur, yani `interactions` tablosunda bir satırdır. Panel bunları dönem başına sayar ve sayıyı aynı uzunluktaki önceki dönemle karşılaştırır.

## Bir öğrenciyle örnek {#example}

S07 sekiz haftada 37 soru sordu: birinci haftada 6, sekizinci haftada 2. Sınıf 928 soru sordu, birinci haftada 130, sekizinci haftada 85.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="questions-over-time" /></ClientOnly>
<template #takeaway>Sınıf en çok üçüncü haftada soruyor ve sonraki her haftada daha az.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Sınıf öncekinden daha mı çok, daha mı az soruyor?
- **Araştırmacı:** Yardım isteme haftalar içinde nasıl değişiyor?

## Ham veri örneği {#raw}

Paneldeki sınıf serisinden iki gün.

`dashboard_overview` işlevinin döndürdüğü JSON’un bir parçası:

<<< @/../.vitepress/data/sample/snippets/questions-over-time.json

### Sorular (panel) {#metric-questions}

Dönemde oluşturulan sorular. Önceki dönem aynı uzunluktadır ve bu dönemin başladığı yerde biter.

<FormulaVersion ids="metric.questions" />

### Toplam soru (panel) {#metric-questions-total}

Dönemden bağımsız olarak öğrencinin tüm soruları.

<FormulaVersion ids="metric.questions_total" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `questions` ve `questions_per_hour` = sorular ÷ aktif saat.
- **Örnek analiz:** Öğrenci başına haftalık sayıyı, hafta yordayıcı olmak üzere karma Poisson regresyonuyla modelleyin.

**Araştırma soruları**

<RqList ids="metric.questions" />

**Örnek cümle (Yöntem):** "Yardım isteme, öğrenci ve hafta başına yardım isteği sayısı olarak ölçülmüştür."

## Bu verinin göstermedikleri {#limits}

Başarısız istekler soru oluşturmaz. Daha az soru daha fazla bağımsızlık, öğrencilerin vazgeçtiği daha zor görevler ya da yalnızca daha az hata anlamına gelebilir. Görevler her hafta değişir, bu yüzden haftalar tam olarak karşılaştırılabilir değildir.

## Öğretmen için {#teacher}

::: tip Derste
Bir haftadaki ani bir artış çoğu zaman yeni bir konuya işaret eder. Bir sonraki laboratuvarın başı için kısa bir açıklama planlayın.
:::
