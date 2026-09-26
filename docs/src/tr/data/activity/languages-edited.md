---
title: Düzenlenen diller
items:
  - coding_sessions.language_counts
  - metric.languages_top
sample:
  - views/languages-edited.json#facts.languages = 3
  - views/languages-edited.json#facts.pythonPct = 98.3
---

# Düzenlenen diller

## Düzenlenen diller nedir? {#what}

Sayılan her düzenleme için eklenti, dosyanın diline bir ekler. Dil, VS Code’un verdiği addır (örneğin `python` ya da `markdown`). Sonuç, her biri bir sayıyla birlikte küçük bir dil listesidir.

## Bir öğrenciyle örnek {#example}

S07 3 dilde dosya düzenledi ve düzenlemelerin %98,3 kadarı Python’daydı. Diğer düzenlemeler Markdown ve düz metin dosyalarındaydı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="languages-edited" /></ClientOnly>
<template #takeaway>S07’nin neredeyse tüm düzenlemeleri, bir Python dersinde beklendiği gibi, Python’da.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler dersin dilinde mi çalışıyor?
- **Araştırmacı:** Verinin bir kontrolü olarak, etkinliğin ne kadarı dersin diline ait?

## Ham veri örneği {#raw}

S07’nin iki oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/languages-edited.json

### Nasıl sayılır {#coding-sessions-language-counts}

Eklenen ya da silinen satırlar için sayılan her düzenleme, dosyasının diline 1 ekler. Sayılar her dil için toplanarak birleştirilir.

<FormulaVersion ids="coding_sessions.language_counts" />

### Düzenlenen diller (panel) {#metric-languages-top}

Dönemin oturumları üzerinden en çok düzenlemesi olan altı dil.

<FormulaVersion ids="metric.languages_top" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `course_language_share` = ders dilindeki düzenlemeler ÷ tüm düzenlemeler.
- **Örnek analiz:** Veri temizliği için kullanın: ders dilinde az etkinliği olan bir öğrenci görevler için başka bir editör kullanmış olabilir.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Ders dilindeki düzenleme etkinliğinin payı, kaydedilen etkinliğin programlama görevlerini yansıttığını kontrol etmek için kullanılmıştır."

## Bu verinin göstermedikleri {#limits}

Sayılan şey düzenlemelerdir, satırlar ya da süre değil. Dil VS Code’dan gelir, bu yüzden `.py` uzantısı olmadan kaydedilen bir Python dosyası düz metin olarak görünebilir. Öğrencinin en iyi bildiği dili göstermez.

## Öğretmen için {#teacher}

::: tip Derste
Düzenlemelerin çoğu düz metindeyse öğrencilere programlarını doğru dosya uzantısıyla kaydetmelerini hatırlatın. Aksi halde VS Code onlar için hata gösteremez.
:::
