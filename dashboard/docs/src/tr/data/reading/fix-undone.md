---
title: Değişikliği geri aldı
items:
  - event.fix_undone
  - metric.after_undone
sample:
  - views/fix-undone.json#facts.featuredUndone = 1
  - views/fix-undone.json#facts.undone = 15
  - views/fix-undone.json#facts.edited = 194
---

# Değişikliği geri aldı

## Geri alınan değişiklik nedir? {#what}

Bu olay, öğrenci düzeltmeden sonraki ilk düzenlemenin ardından iki dakika içinde aynı dosyada Geri Al komutunu kullandığında kaydedilir. Değişikliğin işe yaramadığının ya da anlaşılmadığının bir işaretidir.

## Bir öğrenciyle örnek {#example}

S07 sekiz haftada 1 kez bir düzeltmeden sonra yaptığı değişikliği geri aldı. Tüm sınıfta, düzeltmeden sonraki 194 düzenlemenin 15 tanesi iki dakika içinde geri alındı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="fix-undone" /></ClientOnly>
<template #takeaway>Bir düzeltmeyi geri almak seyrek görülüyor. Bunu göstermek için küçük bir tablo yeterli.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Bir düzeltme bazı öğrenciler için işe yaramadı mı?
- **Araştırmacı:** Düzeltmeye göre davranmak ne sıklıkla hızlı bir geri almayla bitiyor?

## Ham veri örneği {#raw}

Örnekten bir olay. Olay verisi boştur.

`events`:

<<< @/../.vitepress/data/sample/snippets/fix-undone.json

### Değişikliği geri aldı (panel) {#metric-after-undone}

Dönemde bu olaya sahip farklı sorular.

<FormulaVersion ids="metric.after_undone" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `undo_count`. Sayılar küçüktür, bu yüzden betimsel olarak kullanın.
- **Örnek analiz:** Geri alınan düzeltmelerin oranını aynı soruların öz bildirimli sonucuyla birlikte raporlayın.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Geri bildirim sonrası ilk düzenlemeden sonraki iki dakika içinde aynı dosyada yapılan bir geri alma, uygulanan düzeltmenin geri çevrilmesi olarak kaydedilmiştir."

## Bu verinin göstermedikleri {#limits}

Bir geri alma, düzeltme yazılırken yapılan bir yazım hatasını da silebilir. Yalnızca düzeltmeden sonraki ilk düzenleme izlenir. Olay seyrektir, bu yüzden tek başına bir analizi taşıyamaz.

## Öğretmen için {#teacher}

::: tip Derste
Birkaç öğrenci aynı düzeltmeyi geri alıyorsa, önerilen değişiklik göreve uymuyor olabilir. Açıklamayı panelde kontrol edin.
:::
