---
title: Önerilen alıştırma
items:
  - learner_profiles.suggested_practice
sample:
  - views/suggested-practice.json#facts.writtenDay = 2030-04-16
---

# Önerilen alıştırma

## Önerilen alıştırma nedir? {#what}

Önerilen alıştırma, iki ya da üç cümlelik kısa bir alıştırmadır. Model bunu yapay zekâ öğrenme özetiyle birlikte, öğrencinin sorularında en çok tekrarlanan hata ya da konu üzerine yazar.

## Bir öğrenciyle örnek {#example}

S07 için alıştırma 2030-04-16 tarihinde yazıldı ve S07’nin en sık sorduğu iki konudan biri olan listeler hakkında. Metin bir sonraki bölümde gösteriliyor.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="suggested-practice" /></ClientOnly>
<template #takeaway>Alıştırma kısa ve tek bir konuyu adlandırıyor. Küçük bir tahmin göreviyle bitiyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Araç her öğrenciye hangi ek alıştırmayı öneriyor?
- **Araştırmacı:** Önerilen konu, öğrencinin testlerdeki zayıf noktalarıyla örtüşüyor mu?

## Ham veri örneği {#raw}

Örneğin sonunda S07’nin alıştırması.

`learner_profiles` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/suggested-practice.json

### Nasıl yazılır {#learner-profiles-suggested-practice}

En çok tekrarlanan hata ya da konu üzerine iki ya da üç cümlelik, en fazla 400 karakterlik kısa bir alıştırma. Hiçbir şey tekrarlanmıyorsa model en son soruyu kullanır.

<FormulaVersion ids="learner_profiles.suggested_practice" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahaleden sonra (nitel)
- **SPSS için öğrenci başına tek değer:** Yok. Bu bir metindir. Bir değişkene ihtiyacınız varsa konuyu kodlayın.
- **Örnek analiz:** Her son alıştırmanın konusunu kodlayın ve öğrencinin yanlış yaptığı test maddeleriyle karşılaştırın.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Yapay zekânın önerdiği alıştırma görevlerinin konuları kodlanmış ve öğrencilerin son test hatalarıyla karşılaştırılmıştır."

## Bu verinin göstermedikleri {#limits}

Eklenti öğrencinin alıştırmayı yapıp yapmadığını kaydetmez. Yalnızca son sürüm saklanır. Metin bir yapay zekâ modeli tarafından yazılır ve çok kolay, çok zor ya da konu dışı olabilir.

## Öğretmen için {#teacher}

::: tip Derste
Sınıfın önerilen alıştırmalarını bir sonraki laboratuvar için kısa ısınma görevlerinin kaynağı olarak kullanabilirsiniz.
:::
