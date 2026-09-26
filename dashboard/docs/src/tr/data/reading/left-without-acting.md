---
title: Bir şey yapmadan ayrıldı
items:
  - event.feedback_abandoned
  - event.feedback_abandoned.level
  - event.feedback_abandoned.reason
  - metric.abandoned
sample:
  - views/left-without-acting.json#facts.featuredAbandoned = 3
  - views/left-without-acting.json#facts.abandonedPct = 12.2
---

# Bir şey yapmadan ayrıldı

## "Bir şey yapmadan ayrıldı" ne demek? {#what}

Bu olay, öğrenci bir açıklama ya da adım göründükten sonra 10 dakika boyunca editörde hiçbir şey yapmadığında ya da VS Code daha önce kapandığında kaydedilir. "Koda döndü" olayının tersidir.

## Bir öğrenciyle örnek {#example}

S07 3 açıklamadan sonra bir şey yapmadan ayrıldı. Her seferinde editörde hiçbir etkinlik olmadan on dakika geçti.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="left-without-acting" /></ClientOnly>
<template #takeaway>Sınıfta açıklamaların %12,2 kadarından sonra bir şey yapılmadan ayrılındı. Çoğu, 10 dakika hareketsizlikten sonra.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler hangi açıklamalardan sonra çalışmayı bıraktı?
- **Araştırmacı:** Geri bildirim ne sıklıkla okunup bırakılıyor ve bu, ipucu derinliği ya da değerlendirmeyle ilişkili mi?

## Ham veri örneği {#raw}

Örnekten bir olay.

`events`:

<<< @/../.vitepress/data/sample/snippets/left-without-acting.json

### Bir şey yapmadan ayrıldı (panel) {#metric-abandoned}

Dönemde en az bir böyle olayı olan farklı sorular.

<FormulaVersion ids="metric.abandoned" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `abandon_share` = bir şey yapılmadan bırakılan sorular ÷ tüm sorular.
- **Örnek analiz:** Oranı faydalı ve faydalı değil olarak değerlendirilen açıklamalar arasında karşılaştırın (ki-kare testi).

**Araştırma soruları**

<RqList ids="metric.abandoned" />

**Örnek cümle (Yöntem):** "Ardından on dakika boyunca editör etkinliği olmayan ya da oturumun sona erdiği açıklamalar bırakılmış olarak kodlanmıştır."

## Bu verinin göstermedikleri {#limits}

Öğrenci açıklamayı okuyup on dakikadan uzun süre düşünebilir ya da kâğıt üzerinde çalışabilir. "VS Code kapandı" kapanma sırasında gönderilir ve çoğu zaman kaybolur. Olay, öğrencinin neden durduğu hakkında bir şey söylemez.

## Öğretmen için {#teacher}

::: tip Derste
Laboratuvarın sonuna doğru bir şey yapılmadan bırakılan sorulara bakın. Öğrencilerin vazgeçtiği bir görevi gösterebilirler.
:::
