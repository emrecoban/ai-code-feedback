---
title: Geri bildirim dili
items:
  - profiles.feedback_language
  - event.feedback_language_changed
  - event.feedback_language_changed.from
  - event.feedback_language_changed.to
sample:
  - views/feedback-language.json#facts.featuredLanguage = en
  - views/feedback-language.json#facts.exampleStudent = S03
  - views/feedback-language.json#facts.exampleFrom = en
  - views/feedback-language.json#facts.exampleTo = tr
  - views/feedback-language.json#facts.exampleWeek = 2
  - views/feedback-language.json#facts.tr = 20
  - views/feedback-language.json#facts.en = 4
  - views/feedback-language.json#facts.es = 1
  - views/feedback-language.json#facts.changes = 3
---

# Geri bildirim dili

## Geri bildirim dili nedir? {#what}

Geri bildirim dili, öğrencinin eklentiyi ve yapay zekâ açıklamalarını okuduğu dildir: İngilizce, Türkçe ya da İspanyolca. Dili her öğrenci kendisi seçer. Bu yüzden aynı laboratuvar bilgisayarını kullanan öğrenciler farklı diller kullanabilir. Her değişiklik ayrıca bir olay olarak kaydedilir.

## Bir öğrenciyle örnek {#example}

S07 ilk girişte İngilizce dilini seçti ve hiç değiştirmedi. S03 ise İngilizce ile başladı ve 2. haftada Türkçe diline geçti. Profil yalnızca güncel dili tutar. Bu yüzden geçiş yalnızca olay günlüğünde görünür.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="feedback-language" /></ClientOnly>
<template #takeaway>Örneğin sonunda 20 öğrenci Türkçe, 4 öğrenci İngilizce ve 1 öğrenci İspanyolca kullanıyor. 3 öğrenci dili bir kez değiştirdi.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Her öğrenci açıklamaları hangi dilde okuyor?
- **Araştırmacı:** Geri bildirim dili ya da ana dile geçiş, öğrencilerin ipuçlarını kullanma biçimiyle ilişkili mi?

## Ham veri örneği {#raw}

Güncel dil profilde durur. Değişiklik ise bir olaydır (burada örnekteki öğrencinin geçişi).

`profiles` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/feedback-language.profiles.json

`events`:

<<< @/../.vitepress/data/sample/snippets/feedback-language.event.json

## Araştırmada kullanım {#research}

- **Aşama:** tasarım (gruplama) ve analiz
- **SPSS için öğrenci başına tek değer:** `feedback_language` sınıflama değişkeni olarak (1 = İngilizce, 2 = Türkçe, 3 = İspanyolca) ve `language_changes` değişiklik olaylarının sayısı olarak.
- **Örnek analiz:** Gruplar küçük olduğu için dil grupları arasında ipucu derinliğini Kruskal–Wallis testiyle karşılaştırın.

**Araştırma soruları**

<RqList ids="profiles.feedback_language" />

**Örnek cümle (Yöntem):** "Öğrenciler geri bildirim dilini (İngilizce, Türkçe ya da İspanyolca) eklentide kendileri seçmiş ve sonraki her değişiklik kaydedilmiştir."

## Bu verinin göstermedikleri {#limits}

Profil yalnızca güncel dili saklar. Eski bir sorunun dili ancak değişiklik olaylarından ve yalnızca öğrenci oturum açmışken yapılan değişiklikler için yeniden kurulabilir. Dil değişikliği anlama güçlüğünü gösterebilir, ama merak ya da ortak kullanılan bir bilgisayar da aynı sonucu verebilir.

## Öğretmen için {#teacher}

::: tip Derste
Bir öğrenci zor bir haftanın ardından ana diline geçtiyse, görev zor gelmiş olabilir. Dil hakkında değil, görev hakkında soru sorun.
:::
