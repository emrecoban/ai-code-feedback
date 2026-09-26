---
title: Açıklamadan kopyaladı
items:
  - event.explanation_copied
  - event.explanation_copied.level
  - metric.copied
sample:
  - views/copied.json#facts.featured = 5
  - views/copied.json#facts.copyEvents = 60
  - views/copied.json#facts.fromFix = 23
---

# Açıklamadan kopyaladı

## Açıklamadan kopyalama nedir? {#what}

Bu olay, öğrenci açıklama panelinden her metin kopyaladığında kaydedilir. Seçimin başladığı adımı (L0–L3) saklar, ama kopyalanan metni hiçbir zaman saklamaz.

## Bir öğrenciyle örnek {#example}

S07 5 açıklamadan kopyaladı. Sınıfta 60 kopyalama kaydedildi ve bunların 23 tanesi düzeltmeden (L3) geldi.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="copied" /></ClientOnly>
<template #takeaway>Öğrenciler en çok düzeltmeden (L3) kopyalıyor. Bazı kopyalamalar bir adımın dışında başlıyor ve düzeyi yok.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler açıklamalardaki kodu programlarına alıyor mu?
- **Araştırmacı:** Yanıt, düzenleme benzerliğinin gözden kaçırabileceği biçimde ne sıklıkla doğrudan alınıyor?

## Ham veri örneği {#raw}

Düzeltmeden bir kopyalama.

`events`:

<<< @/../.vitepress/data/sample/snippets/copied.json

### Kopyalandı (panel) {#metric-copied}

Dönemde kopyalama olayı olan farklı sorular. Panel kopyalamaları düzeye göre de sayar.

<FormulaVersion ids="metric.copied" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `copies_fix` = L3’ten kopyalamalar ve `copy_share` = kopyalama olan sorular ÷ sorular.
- **Örnek analiz:** L3’ten sık kopyalayan öğrencilerin öğrenme kazancını diğerleriyle karşılaştırın (Mann–Whitney U).

**Araştırma soruları**

<RqList ids="metric.copied" />

**Örnek cümle (Yöntem):** "Geri bildirim panelindeki kopyalama eylemleri, kopyalanan içerik olmadan, geldikleri ipucu düzeyiyle birlikte kaydedilmiştir."

## Bu verinin göstermedikleri {#limits}

Bir kopyalama her zaman koda yapıştırma demek değildir: öğrenciler not almak ya da arama yapmak için de kopyalar. Düzey, seçimin başladığı düzeydir. Bu yüzden birkaç adıma yayılan bir seçim yalnızca ilkini alır.

## Öğretmen için {#teacher}

::: tip Derste
Düzeltmeyi kopyalamak tek başına bir sorun değildir. Öğrencilerden paneli kapatıp kodu ezberden değiştirmelerini, sonra karşılaştırmalarını isteyin.
:::
