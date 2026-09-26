---
title: Öğrencinin kendi sözleri
items:
  - interactions.free_text
sample:
  - views/own-question.json#facts.exampleStudent = S22
  - views/own-question.json#facts.exampleText = why does this loop stop too early?
  - views/own-question.json#facts.exampleLength = 34
  - views/own-question.json#facts.freeText = 22
  - views/own-question.json#facts.selection = 271
  - views/own-question.json#facts.pctOfSelection = 8.1
---

# Öğrencinin kendi sözleri

## Öğrencinin kendi sorusu nedir? {#what}

Öğrenci seçilen kod için "Başka bir şey…" seçeneğini seçtiğinde en fazla 300 karakterlik bir soru yazar. Bu metin yazıldığı gibi saklanır. Sistemin sakladığı, öğrencinin yazdığı tek metin budur.

## Bir öğrenciyle örnek {#example}

S07 hiç kendi sorusunu yazmadı. S22 ise yazdı: bir döngüyü seçti ve "why does this loop stop too early?" yazdı (34 karakter). Ardından gelen açıklama bu soruyu her zamanki dört adımla yanıtladı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="own-question" /></ClientOnly>
<template #takeaway>Kendi sorular seyrek: 271 seçim sorusunun 22 tanesi (%8,1).</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler kendi sözleriyle ne öğrenmek istiyor?
- **Araştırmacı:** Öğrenciler serbestçe soru sorabildiğinde hangi kavram yanılgıları ve soru biçimleri ortaya çıkıyor?

## Ham veri örneği {#raw}

Örnekten bir kendi soru.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/own-question.json

## Araştırmada kullanım {#research}

- **Aşama:** analizde (nitel kodlama)
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `n_own_questions`. Metinlerin kendisini SPSS dışında kodlayın, örneğin soru biçimine ve konusuna göre.
- **Örnek analiz:** İki kodlayıcıyla içerik analizi ve uyum için Cohen kappa katsayısı.

**Araştırma soruları**

<RqList ids="interactions.free_text" />

**Örnek cümle (Yöntem):** "Serbest metin sorular (en fazla 300 karakter) iki araştırmacı tarafından soru biçimi ve konu açısından kodlanmıştır."

## Bu verinin göstermedikleri {#limits}

Metinler kısa ve az sayıdadır. Bu yüzden temsil edici bir tablo değil, örnekler sunar. Öğrenci kutuya kişisel bilgi yazmış olabilir. Metinleri paylaşmadan önce okuyun ve takma adlandırın.

## Öğretmen için {#teacher}

::: tip Derste
Bir sonraki laboratuvardan önce haftanın kendi sorularını okuyun. Birkaç öğrenciden gelen benzer sorular kısa bir sınıf tartışması için iyi bir başlangıç olabilir.
:::
