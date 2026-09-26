---
title: Koda döndü
items:
  - event.returned_to_code
  - event.returned_to_code.level
  - event.returned_to_code.msToReturn
  - metric.reading_back_median
sample:
  - views/back-to-code.json#facts.featuredMedianSec = 24
  - views/back-to-code.json#facts.classMedianSec = 18
---

# Koda döndü

## Koda dönüş nedir? {#what}

Bir açıklama ya da yeni bir adım göründükten sonra eklenti editördeki ilk etkinliği bekler: metinde bir değişiklik ya da imlecin hareketi. Olay bunun ne kadar sürdüğünü ve ekranda hangi adımın olduğunu saklar.

## Bir öğrenciyle örnek {#example}

S07 ortanca 24 saniye sonra koda döndü, sınıftan biraz daha geç (18 saniye). Düzeltmeden (L3) sonra S07 hızlı döndü, büyük olasılıkla değişikliği yazmak için.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="back-to-code" /></ClientOnly>
<template #takeaway>Sınıf bir adımdan yaklaşık 15–20 saniye sonra koda dönüyor. S07, L0–L1 ve L2’den sonra daha uzun süre bekliyor, düzeltmeden sonra ise hızlı dönüyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler okumak için duruyor mu, yoksa hemen yazmaya mı dönüyor?
- **Araştırmacı:** Öğrenciler bir adıma göre davranmadan önce onunla ne kadar ilgileniyor?

## Ham veri örneği {#raw}

S07’nin bir olayı.

`events`:

<<< @/../.vitepress/data/sample/snippets/back-to-code.json

### Süre nasıl ölçülür {#event-returned-to-code-mstoreturn}

Bir adımın görünür olduğu andan herhangi bir editördeki ilk metin değişikliğine ya da imleç hareketine kadar geçen süre, milisaniye olarak. 10 dakika etkinlik olmazsa olay bunun yerine "Bir şey yapmadan ayrıldı" olur.

<FormulaVersion ids="event.returned_to_code.msToReturn" />

### Koda dönüş süresi (medyan, panel) {#metric-reading-back-median}

Dönemde sorulan soruların olayları üzerinden dönüş sürelerinin ortancası.

<FormulaVersion ids="metric.reading_back_median" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `median_return_s`, her düzeyde okumayı inceliyorsanız adım başına da.
- **Örnek analiz:** L0–L1 sonrasındaki dönüş süresini yüksek ve düşük öğrenme kazancı gösteren öğrenciler arasında karşılaştırın (Mann–Whitney U).

**Araştırma soruları**

<RqList ids="event.returned_to_code.msToReturn,metric.reading_back_median" />

**Örnek cümle (Yöntem):** "Her geri bildirim düzeyinin görünmesi ile editördeki ilk sonraki etkinlik arasındaki süre, geri bildirimle ilgilenmenin göstergesi olarak kullanılmıştır."

## Bu verinin göstermedikleri {#limits}

Başka bir dosyada ya da belgede olsa bile her değişiklik ya da imleç hareketi sayılır. Bu yüzden hızlı bir dönüş rastlantısal olabilir. Uzun bir süre okuma, düşünme ya da mola olabilir. Dönüşten önce yeni bir adım açılırsa yalnızca son adım ölçülür.

## Öğretmen için {#teacher}

::: tip Derste
Öğrenciler her adımdan birkaç saniye sonra yazmaya dönüyorsa, derste kodu değiştirmeden önce açıklamanın onlara ne söylediğini tek bir cümleyle söylemelerini isteyin.
:::
