---
title: Aktif gün
items:
  - metric.active_days
sample:
  - views/active-days.json#facts.featured = 11
  - views/active-days.json#facts.classMedian = 12
  - views/active-days.json#facts.labs = 8
---

# Aktif gün

## Aktif günler nedir? {#what}

Aktif günler, en az bir oturumun başladığı farklı takvim günlerinin sayısıdır. Öğrencinin eklentiyle ne kadar düzenli çalıştığının basit bir ölçüsüdür.

## Bir öğrenciyle örnek {#example}

S07 sekiz haftada 11 gün aktifti. Öğrenci paneli aynı sayıyı "Kullandığın gün sayısı" olarak gösteriyor. Sınıfın ortancası 12 gündü. Yani öğrencilerin çoğu 8 laboratuvarın dışında da bazı günlerde çalıştı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="active-days" /></ClientOnly>
<template #takeaway>Her öğrenci en az altı gün aktifti. S07 9–11 grubunda, sınıf ortancasına yakın.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Eklentiyi kim yalnızca laboratuvarda, kim evde de kullanıyor?
- **Araştırmacı:** Maruz kalmanın kontrolü olarak kullanım ne kadar düzenli?

## Ham veri örneği {#raw}

Aktif günler oturum başlangıç zamanlarından sayılır. S07’nin üç farklı gündeki üç oturumu:

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/active-days.json

### Aktif gün (panel) {#metric-active-days}

Dönemdeki oturum başlangıçlarının farklı takvim günleri, paneli görüntüleyen kişinin saat diliminde.

<FormulaVersion ids="metric.active_days" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde (kontrol değişkeni olarak)
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `active_days`.
- **Örnek analiz:** Kullanım örüntülerini öğrenme kazancıyla ilişkilendirirken bunu ortak değişken olarak ekleyin.

**Araştırma soruları**

<RqList ids="metric.active_days" />

**Örnek cümle (Yöntem):** "Kullanımın düzenliliği, en az bir kodlama oturumu olan farklı günlerin sayısı olarak ölçülmüştür."

## Bu verinin göstermedikleri {#limits}

Bu sayının üç sürümü vardır: panel görüntüleyenin saat dilimini, öğrenci paneli öğrencinin bilgisayarını, yapay zekâ özeti ise UTC’yi kullanır. Yalnızca boş bir oturumun olduğu bir gün de sayılır. Öğrencinin o gün ne kadar çalıştığı hakkında bir şey söylemez.

## Öğretmen için {#teacher}

::: tip Derste
Yalnızca laboratuvar günlerinde aktif olan bir öğrenci yanlış bir şey yapmıyor. Sayıyı plan yapmak için kullanın: laboratuvarlar arasındaki kısa görevler alıştırmayı haftaya yayabilir.
:::
