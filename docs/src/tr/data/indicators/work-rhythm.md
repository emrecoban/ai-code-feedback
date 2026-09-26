---
title: Öğrenciler ne zaman çalışıyor
items:
  - metric.work_rhythm
sample:
  - views/work-rhythm.json#facts.peakDay = 2
  - views/work-rhythm.json#facts.peakHour = 10
  - views/work-rhythm.json#facts.labPct = 78
---

# Öğrenciler ne zaman çalışıyor

## Çalışma ritmi nedir? {#what}

Panel soruları ve oturum başlangıçlarını haftanın gününe ve günün saatine göre sayar. Sonuç 7 gün ve 24 saatlik bir tablodur.

## Bir öğrenciyle örnek {#example}

Sınıfın en yoğun hücresi haftanın 2. günü (salı) saat 10.00, yani laboratuvar saati. Tüm soruların %78 kadarı salı günü 10.00 ile 12.00 arasında soruldu. Geri kalanı diğer günlerin akşamlarına dağıldı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="work-rhythm" /></ClientOnly>
<template #takeaway>Soruların çoğu laboratuvarda soruluyor. Evdeki çalışma akşam oluyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler laboratuvar saatleri dışında da yardım istiyor mu?
- **Araştırmacı:** Kullanımın ne kadarı derste, ne kadarı bireysel çalışmada oluyor?

## Ham veri örneği {#raw}

Tablonun üç hücresi: haftanın günü (1 = pazartesi), saat ve soru sayısı.

`dashboard_insights` işlevinin döndürdüğü JSON’un bir parçası:

<<< @/../.vitepress/data/sample/snippets/work-rhythm.json

### Öğrenciler ne zaman çalışıyor (panel) {#metric-work-rhythm}

Görüntüleyenin saat diliminde ISO haftanın günü (1–7) ve saate (0–23) göre sayımlar: sorular zamanlarına, oturumlar başlangıçlarına göre.

<FormulaVersion ids="metric.work_rhythm" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `lab_share` = laboratuvar saatlerindeki sorular ÷ tüm sorular.
- **Örnek analiz:** Evde de çalışan öğrencileri yalnızca laboratuvarda çalışanlarla öğrenme kazancı açısından karşılaştırın (Mann–Whitney U).

**Araştırma soruları**

<RqList ids="metric.work_rhythm" />

**Örnek cümle (Yöntem):** "Yardım istekleri planlanmış laboratuvar saatleri içinde ya da dışında yapılmış olarak sınıflandırılmıştır."

## Bu verinin göstermedikleri {#limits}

Saatler öğrencinin değil, paneli görüntüleyen kişinin saat diliminde gösterilir. Tablo laboratuvar programını bilmez, bu yüzden "laboratuvar saatleri" araştırmacı tarafından tanımlanmalıdır. Tablo çalışmaya harcanan süreyi değil, olayları sayar.

## Öğretmen için {#teacher}

::: tip Derste
Bir teslim tarihinden önceki akşam geç saatlerde çok soru geliyorsa, daha erken bir teslim tarihi ya da kısa bir çevrimiçi görüşme saati düşünün.
:::
