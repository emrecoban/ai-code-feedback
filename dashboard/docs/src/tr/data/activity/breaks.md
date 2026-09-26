---
title: Molalar
items:
  - coding_sessions.idle_gap_count
  - metric.breaks_avg
sample:
  - views/breaks.json#facts.featuredAvg = 1.7
  - views/breaks.json#facts.classAvg = 1.9
  - views/breaks.json#facts.sessions = 306
---

# Molalar

## Mola nedir? {#what}

Mola, VS Code’da hiçbir etkinlik olmadan geçen iki dakikadan uzun bir duraklamadır. Aktif kodlama süresinde neyin sayılacağına karar veren kuralın aynısıdır.

## Bir öğrenciyle örnek {#example}

S07’nin oturum başına ortalama 1,7 molası oldu, sınıfın 1,9. Mola öğretmenle bir konuşma, görev kâğıdına bir bakış ya da bir açıklamayı okumaya ayrılan daha uzun bir süre olabilir.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="breaks" /></ClientOnly>
<template #takeaway>306 oturumun çoğunda sıfır ile üç arasında mola var. Oturum başına iki molalı grup en büyüğü.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler takılıp uzun süre duruyor mu?
- **Araştırmacı:** Bir oturum içinde çalışma ne kadar kesintisiz?

## Ham veri örneği {#raw}

S07’nin iki oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/breaks.json

### Molalar nasıl sayılır {#coding-sessions-idle-gap-count}

İki kalp atışı (düzenleme, imleç hareketi, dosya değişikliği ya da kaydetme) arasındaki aralık iki dakikadan uzunsa 1 ekler.

<FormulaVersion ids="coding_sessions.idle_gap_count" />

### Oturum başına mola (ortalama, panel) {#metric-breaks-avg}

Dönemin oturumları üzerinden ortalama mola sayısı.

<FormulaVersion ids="metric.breaks_avg" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `breaks_per_hour` = molalar ÷ aktif saat.
- **Örnek analiz:** Betimleyin ve "Hâlâ takıldım" yanıtlarının sayısıyla ilişkilendirin (Spearman).

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Editör etkinliği olmadan geçen iki dakikadan uzun duraklamalar mola olarak sayılmıştır."

## Bu verinin göstermedikleri {#limits}

Mola, öğrencinin görevi düşünmeyi bıraktığı anlamına gelmez: okuma, kâğıt üzerinde plan yapma ve öğretmeni dinleme aynı görünür. VS Code dışında geçen süre bir kalp atışı değildir, bu yüzden tarayıcıya bir ziyaret de mola olarak bitebilir.

## Öğretmen için {#teacher}

::: tip Derste
Bir laboratuvardaki çok sayıda mola, başta daha fazla açıklama gerektiren bir görevi gösterebilir. Sınıfın molalarını laboratuvarlar arasında karşılaştırın.
:::
