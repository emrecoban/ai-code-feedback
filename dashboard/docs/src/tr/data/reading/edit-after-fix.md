---
title: Çözümden sonraki ilk düzenleme
items:
  - event.post_feedback_edit
  - event.post_feedback_edit.overlapRatio
  - event.post_feedback_edit.editedLineDistance
  - metric.after_edited
  - metric.after_on_line_pct
  - metric.after_overlap_avg
sample:
  - views/edit-after-fix.json#facts.featuredEdited = 9
  - views/edit-after-fix.json#facts.featuredOverlapPct = 60
  - views/edit-after-fix.json#facts.overlapPct = 53
  - views/edit-after-fix.json#facts.onLinePct = 84.5
---

# Çözümden sonraki ilk düzenleme

## Çözümden sonraki ilk düzenleme nedir? {#what}

Öğrenci düzeltmeyi (L3) açtığında eklenti aynı dosyadaki bir sonraki düzenlemeyi beş dakika boyunca izler. İki sayı saklar: yeni metnin önerilen düzeltmeye ne kadar benzediği ve düzenlemenin gösterilen satırdan ne kadar uzağa düştüğü. Metnin kendisi gönderilmez.

## Bir öğrenciyle örnek {#example}

S07 9 düzeltmeden sonra kodu düzenledi. Yeni metnin önerilen düzeltmeye ortalama benzerliği %60 oldu. Sınıfta ortalama %53 oldu ve düzenlemelerin %84,5 kadarı gösterilen satıra iki satır mesafede kaldı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="edit-after-fix" /></ClientOnly>
<template #takeaway>İlk düzenlemelerin çoğunun önerilen düzeltmeye benzerliği 0,4 ile 0,8 arasında. S07 0,6–0,8 grubunda.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler düzeltmeyi olduğu gibi mi alıyor, yoksa kendi değişikliklerini mi yazıyor?
- **Araştırmacı:** Öğrencinin eylemi geri bildirimi ne kadar yakından izliyor?

## Ham veri örneği {#raw}

S07’nin bir olayı.

`events`:

<<< @/../.vitepress/data/sample/snippets/edit-after-fix.json

### Benzerlik nasıl hesaplanır {#event-post-feedback-edit-overlapratio}

Eklenen metnin ve önerilen değişikliğin küçük harfli sözcük parçalarının (harf, rakam, alt çizgi) Jaccard örtüşmesi: ortak parçalar tüm farklı parçalara bölünür. 0 hiçbir ortaklık yok, 1 aynı parçalar demektir.

<FormulaVersion ids="event.post_feedback_edit.overlapRatio" />

### Uzaklık nasıl hesaplanır {#event-post-feedback-edit-editedlinedistance}

Açıklamanın ilgili olduğu satırdan değiştirilen aralığın en yakın kenarına kadar olan satır sayısı. 0, gösterilen satırda yapılan düzenleme demektir.

<FormulaVersion ids="event.post_feedback_edit.editedLineDistance" />

### Kodu düzenledi (panel) {#metric-after-edited}

Dönemde bu olaya sahip farklı sorular.

<FormulaVersion ids="metric.after_edited" />

### Gösterilen satıra 2 satır mesafede (panel) {#metric-after-on-line-pct}

Düzenlemesi en fazla 2 satır uzağa düşen sorular, bu olaya sahip sorulara bölünür.

<FormulaVersion ids="metric.after_on_line_pct" />

### Önerilen düzeltmeye benzerlik (ortalama, panel) {#metric-after-overlap-avg}

Ortalama benzerliğin 100 katı, tam sayıya yuvarlanır.

<FormulaVersion ids="metric.after_overlap_avg" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Düzeltmeye ulaşan sorular üzerinden öğrenci başına `mean_overlap` ve `on_line_share`.
- **Örnek analiz:** Ortalama benzerliği öğrenme kazancıyla ilişkilendirin: yüksek kopyalama ile düşük kazanç, düzeltmenin edilgen kullanımına işaret edebilir.

**Araştırma soruları**

<RqList ids="event.post_feedback_edit.overlapRatio,metric.after_overlap_avg" />

**Örnek cümle (Yöntem):** "Düzeltme gösterildikten sonra öğrencinin bir sonraki düzenlemesi ile önerilen değişiklik arasındaki benzerlik, sözcük parçalarına dayalı Jaccard indeksi olarak hesaplanmıştır."

## Bu verinin göstermedikleri {#limits}

Yalnızca ilk uygun düzenleme ölçülür. Bu yüzden birkaç adımda yazılan bir düzeltme olduğundan daha az benzer görünür. Başka bir dosyaya yapıştırılan bir düzeltme görülmez. Sözcük benzerliği anlamayı göstermez: öğrenci düzeltmenin neden işe yaradığını bilmeden de onu yazabilir.

## Öğretmen için {#teacher}

::: tip Derste
Bir öğrencinin düzenlemeleri neredeyse her zaman düzeltmeyle sözcüğü sözcüğüne örtüşüyorsa, bir sonraki görevden önce değişikliği kendi sözleriyle açıklamasını isteyin.
:::
