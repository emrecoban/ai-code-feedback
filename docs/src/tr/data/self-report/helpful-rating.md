---
title: Değerlendirme
items:
  - interactions.helpful_rating
  - metric.rated_helpful_pct
sample:
  - views/helpful-rating.json#facts.featuredUp = 18
  - views/helpful-rating.json#facts.featuredDown = 2
  - views/helpful-rating.json#facts.ratedHelpfulPct = 81
---

# Değerlendirme

## Faydalılık değerlendirmesi nedir? {#what}

Öğrenci her açıklamanın altındaki "Bu yardımcı oldu mu?" sorusunu tek tıkla yanıtlayabilir: Evet (1) ya da Pek değil (−1). Yanıt isteğe bağlıdır. Yanıt verilmezse değer boş kalır.

## Bir öğrenciyle örnek {#example}

S07 18 açıklamayı faydalı, 2 açıklamayı faydalı değil olarak değerlendirdi ve gerisini yanıtsız bıraktı. Sınıfta verilen değerlendirmelerin %81 kadarı "Faydalı" idi.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="helpful-rating" /></ClientOnly>
<template #takeaway>Yanıtların yaklaşık yarısı değerlendirilmiyor. Öğrenciler değerlendirdiğinde çoğu "Faydalı" diyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler açıklamaları faydalı buluyor mu?
- **Araştırmacı:** Öğrenciler geri bildirimi nasıl değerlendiriyor ve bu değerlendirme sonraki davranışlarıyla ilişkili mi?

## Ham veri örneği {#raw}

S07’nin değerlendirilmiş iki sorusu.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/helpful-rating.json

### Faydalı bulunan (panel) {#metric-rated-helpful-pct}

Dönemdeki 1 değerlendirmeleri, verilen tüm değerlendirmelere (1 ve −1) bölünür. Değerlendirmesi olmayan sorular dışarıda kalır.

<FormulaVersion ids="metric.rated_helpful_pct" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve sonrasında
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `helpful_share` = 1 değerlendirmeleri ÷ verilen değerlendirmeler ve `rating_rate` = verilen değerlendirmeler ÷ sorular. Eksik değer: değerlendirme verilmediyse −97.
- **Örnek analiz:** Faydalı payını TAM algılanan fayda puanıyla ilişkilendirin (Spearman).

**Araştırma soruları**

<RqList ids="interactions.helpful_rating,metric.rated_helpful_pct" />

**Örnek cümle (Yöntem):** "Öğrenciler her açıklamadan sonra onun faydasını tek tıkla değerlendirebilmiş, yanıtlanmayan değerlendirmeler eksik veri olarak ele alınmıştır."

## Bu verinin göstermedikleri {#limits}

Değerlendirme isteğe bağlıdır. Bu yüzden değerlendirme yapan öğrenciler ve anlar diğerlerinden farklı olabilir. Yanıtın zaman damgası yoktur ve geçmiş listesinden verilen sonraki bir yanıt ilkinin yerini alır. "Faydalı" bir duygudur, bir öğrenme sonucu değildir.

## Öğretmen için {#teacher}

::: tip Derste
"Faydalı değil" olarak değerlendirilen açıklamaları panelde okuyun. Tek bir konu gibi bir örüntü, derste kendi anlatımınızın en çok nerede katkı sağlayacağını gösterebilir.
:::
