---
title: Oluşturulan dosya
items:
  - coding_sessions.files_created
sample:
  - views/files-created.json#facts.featured = 5
  - views/files-created.json#facts.classMedian = 6
---

# Oluşturulan dosya

## Oluşturulan dosyalar nedir? {#what}

Sayaç, öğrencinin VS Code aracılığıyla oluşturduğu her dosya için bir artar, örneğin gezgindeki "Yeni Dosya" ile. Dosya adları burada saklanmaz.

## Bir öğrenciyle örnek {#example}

S07 sekiz haftada 5 dosya oluşturdu. Sınıfın ortancası 6 idi.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="files-created" /></ClientOnly>
<template #takeaway>Öğrencilerin çoğu sekiz haftada üç ile sekiz dosya oluşturdu. S07 3–5 grubunda.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler her görev için yeni bir dosya açıyor mu?
- **Araştırmacı:** Öğrenciler çalışmalarını nasıl düzenliyor?

## Ham veri örneği {#raw}

S07’nin iki oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/files-created.json

### Nasıl sayılır {#coding-sessions-files-created}

Eklenti öğrenci çalışırken sayacı artırır ve her 3 dakikada bir oturum satırına ekler.

<FormulaVersion ids="coding_sessions.files_created" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `files_created`.
- **Örnek analiz:** Yalnızca betimleyin. Öğrencilerin dersin görev yapısını izleyip izlemediğini kontrol etmek için kullanın.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Editörde oluşturulan dosya sayısı, öğrencilerin çalışmalarını nasıl düzenlediğinin betimsel bir göstergesi olarak kaydedilmiştir."

## Bu verinin göstermedikleri {#limits}

Terminalde, başka bir programla ya da bir klasör kopyalanarak oluşturulan dosyalar sayılmaz. Öğretmenin verdiği dosyalar da sayılmaz. Sayı dosyaların içeriği hakkında bir şey söylemez.

## Öğretmen için {#teacher}

::: tip Derste
Görevleriniz her alıştırma için bir dosya bekliyorsa, çok düşük bir sayı öğrencilerin eski çözümlerini neden kaybettiğini açıklayabilir.
:::
