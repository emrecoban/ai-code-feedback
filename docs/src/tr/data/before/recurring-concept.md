---
title: Kavram
items:
  - interactions.concept
  - interactions.recurring_concept_count
  - metric.concepts_top_student
sample:
  - views/recurring-concept.json#facts.featuredTop = lists
  - views/recurring-concept.json#facts.featuredTopCount = 5
  - views/recurring-concept.json#facts.maxRecurring = 4
  - views/recurring-concept.json#facts.typeConversionEn = 22
  - views/recurring-concept.json#facts.typeConversionTr = 92
  - views/recurring-concept.json#facts.typeConversionEs = 13
---

# Kavram

## Bir sorunun kavramı nedir? {#what}

Kavram, bir sorunun arkasındaki genel programlama fikrinin kısa adıdır, örneğin "değişken kapsamı". Yapay zekâ modeli bunu her yanıtla birlikte geri bildirim dilinde yazar. Sunucu ayrıca öğrencinin daha önceki kaç sorusunun aynı kavrama sahip olduğunu sayar.

## Bir öğrenciyle örnek {#example}

S07’nin en sık kavramı 5 soruyla "lists" oldu. S07 için bir kavramın en yüksek tekrar sayısı 4. Sınıfta tek bir fikir, her dilde bir tane olmak üzere üç adla göründü: "type conversion" 22 kez, "tür dönüşümü" 92 kez ve "conversión de tipos" 13 kez.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="recurring-concept" /></ClientOnly>
<template #takeaway>S07’nin kavramlarında "lists" başı çekiyor. Etiketler modelden, öğrencinin dilinde geliyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Her öğrenci, tek tek hata mesajlarının ötesinde hangi fikirlerde zorlanıyor?
- **Araştırmacı:** Kavram yanılgıları farklı görünen hatalarda tekrar ediyor mu?

## Ham veri örneği {#raw}

S07’nin kavramı daha önce de görülmüş bir sorusu.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/recurring-concept.json

### Kavram tekrarları nasıl sayılır {#interactions-recurring-concept-count}

Aynı öğrencinin, kavramı büyük ve küçük harf farkı gözetilmeden bununla eşleşen önceki sorularının sayısı. Soru kaydedilirken sayılır.

<FormulaVersion ids="interactions.recurring_concept_count" />

### Tekrarlayan kavramlar (panel) {#metric-concepts-top-student}

Bir öğrencinin dönemdeki en sık beş kavramı, küçük harfe çevrilmiş ve kırpılmış metne göre gruplanır.

<FormulaVersion ids="metric.concepts_top_student" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Önce kavramları üç dilde de sabit bir konu listesine eşleyin. Sonra öğrenci başına `n_topic_<ad>` hesaplayın.
- **Örnek analiz:** Konuları haftalara göre betimleyin ve tekrar eden konu sayısını yüksek ve düşük kazanç gösteren öğrenciler arasında karşılaştırın.

**Araştırma soruları**

<RqList ids="interactions.concept,interactions.recurring_concept_count" />

**Örnek cümle (Yöntem):** "Modelin atadığı kavramlar analizden önce üç geri bildirim dilinde ortak bir konu listesine eşlenmiştir."

## Bu verinin göstermedikleri {#limits}

Kavramı model yazar ve sabit bir listeyle karşılaştırılmaz. Aynı fikir farklı adlar alabilir, farklı dillerde de, ve panel bunları ayrı sayar. Kavramı ölçülmüş bir kategori olarak değil, kodlama için bir ipucu olarak ele alın.

## Öğretmen için {#teacher}

::: tip Derste
Birebir bir konuşmadan önce öğrencinin tekrarlayan kavramlarına bakın. Bir kavram seçin ve onunla ilgili küçük, odaklı bir alıştırma verin.
:::
