---
title: Dosyalar arası geçiş
items:
  - coding_sessions.editor_switch_count
  - coding_sessions.files_visited
sample:
  - views/file-switches.json#facts.featuredSwitches = 119
  - views/file-switches.json#facts.classMeanSwitches = 119
  - views/file-switches.json#facts.featuredFiles = 17
---

# Dosyalar arası geçiş

## Dosyalar arası geçiş nedir? {#what}

İlk sayaç, etkin editör her farklı bir dosyaya geçtiğinde artar. İkinci sayı, oturumda kaç farklı dosyanın etkin olduğudur. Dosya adları burada saklanmaz.

## Bir öğrenciyle örnek {#example}

S07 sekiz haftada 119 kez dosyalar arasında geçiş yaptı. Bu, sınıf ortalamasıyla (119) aynı. Tüm oturumlar toplandığında S07 17 dosya açtı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="file-switches" /></ClientOnly>
<template #takeaway>Sınıf haftada yaklaşık 13 ile 17 kez dosya değiştiriyor. S07 haftadan haftaya sınıf ortalamasının çevresinde dolaşıyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler çalışırken önceki bir çözüm gibi başka dosyalara bakıyor mu?
- **Araştırmacı:** Öğrenciler, kendi kodlarını yeniden kullanmanın bir işareti olarak, dosyalar arasında ne kadar geziniyor?

## Ham veri örneği {#raw}

S07’nin iki oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/file-switches.json

### Dosyalar arası geçiş {#coding-sessions-editor-switch-count}

Etkin editör diskteki farklı bir dosyaya geçtiğinde 1 ekler. Eklenti öğrenci çalışırken sayacı artırır ve her 3 dakikada bir oturum satırına ekler.

<FormulaVersion ids="coding_sessions.editor_switch_count" />

### Açılan dosya {#coding-sessions-files-visited}

VS Code penceresinde etkin editör olan farklı dosyaların sayısı. Her güncellemede eklenmez, yeniden atanır.

<FormulaVersion ids="coding_sessions.files_visited" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `switches_per_hour` = geçişler ÷ aktif saat.
- **Örnek analiz:** Betimleyin. Çalışma biçimlerinin kümeleme analizinde değişkenlerden biri olabilir.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Gezinme, editördeki dosyalar arası geçiş sayısıyla betimlenmiştir."

## Bu verinin göstermedikleri {#limits}

İki oturumda açılan dosyalar, oturumlar toplandığında iki kez sayılır. Bir ayarlar sayfasına ya da çıktı paneline geçmek sayılmaz. Sayaç öğrencinin bir dosyayı neden açtığını söyleyemez.

## Öğretmen için {#teacher}

::: tip Derste
Önceki çözümlere bakmak iyi bir alışkanlıktır. Bir laboratuvarın tüm görevlerini tek bir klasörde tutarak bunu teşvik edebilirsiniz.
:::
