---
title: İpucu derinliği
items:
  - interactions.max_level_reached
  - metric.hint_depth_distribution
sample:
  - views/hint-depth.json#facts.featuredQuestions = 37
  - views/hint-depth.json#facts.featuredHint = 22
  - views/hint-depth.json#facts.featuredRule = 5
  - views/hint-depth.json#facts.featuredFix = 10
  - views/hint-depth.json#facts.classFixPct = 28.8
  - views/hint-depth.json#facts.levelOne = 0
---

# İpucu derinliği

## İpucu derinliği nedir? {#what}

Her yanıt dört adımlı bir merdivendir. Çöz (L0) ve Bul (L1) birlikte görünür. Kural (L2) ve düzeltme (L3) yalnızca öğrenci tıklarsa açılır. İpucu derinliği, öğrencinin açtığı en yüksek adımdır: L0–L1 için 0, kural için 2 ve düzeltme için 3.

## Bir öğrenciyle örnek {#example}

S07 37 soru sordu. Bunların 22 tanesi L0–L1’den sonra, 5 tanesi kuralda ve 10 tanesi düzeltmede bitti. İlk haftalarda S07 çoğu zaman düzeltmeyi açtı. Sonra daha sık ilk iki adımda durdu.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="hint-depth" /></ClientOnly>
<template #takeaway>Sınıfta soruların %28,8 kadarı düzeltmeye ulaştı. S07 sınıfın geneline benziyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler ne sıklıkla tam düzeltmeye ihtiyaç duyuyor, ne sıklıkla bir ipucu yetiyor?
- **Araştırmacı:** Öğrenciler merdivende ne kadar ilerliyor ve derinlik haftalar içinde değişiyor mu?

## Ham veri örneği {#raw}

S07’nin iki sorusu: biri L0–L1’den sonra bitti, biri düzeltmeye ulaştı.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/hint-depth.json

### Öğrenciler ipuçlarında ne kadar ilerledi (panel) {#metric-hint-depth-distribution}

Dönemdeki sorular üç grupta toplanır: yalnızca ipucu (derinlik 0 ya da 1), kural (2) ve düzeltme (3).

<FormulaVersion ids="metric.hint_depth_distribution" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `fix_share` = derinliği 3 olan sorular ÷ tüm sorular. Düzey başına sayıları da tutun.
- **Örnek analiz:** 1.–4. haftalardan 5.–8. haftalara düzeltme payındaki değişimi eşleştirilmiş t-testiyle sınayın ya da soru başına derinliği karma sıralı regresyonla modelleyin (öğrenci rastgele etki olarak).

**Araştırma soruları**

<RqList ids="interactions.max_level_reached,metric.hint_depth_distribution" />

**Örnek cümle (Yöntem):** "İpucu derinliği, öğrencinin her istek için dört adımlı ipucu merdiveninde açtığı en yüksek düzey olarak kodlanmıştır (L0–L1, L2 ya da L3)."

## Bu verinin göstermedikleri {#limits}

1 değeri hiç saklanmaz (örnekte 0 satır), çünkü L0 ve L1 her zaman birlikte görünür. Bir adımı açmak onu okumak demek değildir. Düzeltmeyi açmamak da öğrencinin sorunu çözdüğü anlamına gelmez. Öğrenci adımları daha sonra, açıklamayı geçmiş listesinden yeniden açtığında da açabilir.

## Öğretmen için {#teacher}

::: tip Derste
Bir öğrenci neredeyse her soruda düzeltmeyi açıyorsa, önce ilk iki adımı kullanmayı konuşun. Tüm sınıf bir görev için düzeltmeye ihtiyaç duyuyorsa, o görev derste daha fazla destek gerektirebilir.
:::
