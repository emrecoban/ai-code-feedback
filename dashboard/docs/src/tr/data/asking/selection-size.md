---
title: Seçim boyutu
items:
  - interactions.selection_line_count
  - interactions.selection_char_count
sample:
  - views/selection-size.json#facts.featuredSelections = 15
  - views/selection-size.json#facts.featuredMedian = 18
  - views/selection-size.json#facts.classMedian = 5
  - views/selection-size.json#facts.missing = 22
---

# Seçim boyutu

## Seçim boyutu nedir? {#what}

Seçim boyutu, öğrencinin soru sormadan önce işaretlediği kod miktarıdır, satır ve karakter olarak. Hata sorularında ve seçim yapılmadan sorulan sorularda boştur.

## Bir öğrenciyle örnek {#example}

S07 seçilen kod hakkında 15 soru sordu. Ortanca seçim 18 satırdı, sınıfın ortancası ise 5 satır. Küçük bir seçim çoğu zaman sorunun yeri hakkında net bir fikir olduğunu, büyük bir seçim ise öğrencinin bunu henüz bilmediğini gösterir.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="selection-size" /></ClientOnly>
<template #takeaway>Seçimlerin çoğu kısa. S07 genellikle bütün kod bloklarını seçiyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler sorunun tam yerini mi, yoksa büyük bir bloğu mu gösteriyor?
- **Araştırmacı:** Sorunun kesinliği haftalar içinde değişiyor mu ve ipucu derinliğiyle ilişkili mi?

## Ham veri örneği {#raw}

S07’nin iki seçim sorusu.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/selection-size.json

### Satır sayısı nasıl hesaplanır {#interactions-selection-line-count}

Seçimin son satırı eksi ilk satırı, artı 1. Boş bir seçim 0 değil, değer yok olarak kaydedilir.

<FormulaVersion ids="interactions.selection_line_count" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Seçimi olan sorular üzerinden öğrenci başına `median_selection_lines`.
- **Örnek analiz:** İlk ve son haftaların ortanca seçim boyutunu Wilcoxon işaretli sıralar testiyle karşılaştırın.

**Araştırma soruları**

<RqList ids="interactions.selection_line_count" />

**Örnek cümle (Yöntem):** "Seçilen satır sayısı, öğrencinin sorunu ne kadar kesin konumlandırdığının göstergesi olarak kullanılmıştır."

## Bu verinin göstermedikleri {#limits}

Boyut göreve bağlıdır: bütün bir fonksiyon hakkındaki soru büyük bir seçim gerektirir. Kenar paneli düğmesi seçim olmadan da soru sorabilir ve bu durumda değer kaydedilmez (örnekte 22 soru). Satır sayısı kesinlik için kaba bir göstergedir, anlamanın ölçüsü değildir.

## Öğretmen için {#teacher}

::: tip Derste
Öğrenciler hep büyük bloklar seçiyorsa, sorunu önce nasıl daraltacaklarını gösterin. Örneğin bir değeri yazdırarak ya da satırları yorum satırına çevirerek.
:::
