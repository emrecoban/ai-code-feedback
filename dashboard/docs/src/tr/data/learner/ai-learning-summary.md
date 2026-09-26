---
title: Yapay zekâ öğrenme özeti
items:
  - learner_profiles.student_summary
sample:
  - views/ai-learning-summary.json#facts.writtenDay = 2030-04-16
  - views/ai-learning-summary.json#facts.withSummary = 25
---

# Yapay zekâ öğrenme özeti

## Yapay zekâ öğrenme özeti nedir? {#what}

Yapay zekâ öğrenme özeti, yapay zekâ modelinin öğrenci için yazdığı üç ile beş cümlelik kısa bir metindir. Son 30 soruya dayanır. Geri bildirim dilinde yazılır ve kenar çubuğunda ve panelde gösterilir.

## Bir öğrenciyle örnek {#example}

S07’nin son özeti 2030-04-16 tarihinde İngilizce yazıldı. Metin bir sonraki bölümde gösteriliyor. Örnekte 25 öğrencinin 25 tanesinin dersin sonunda bir özeti vardı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="ai-learning-summary" /></ClientOnly>
<template #takeaway>Özet doğrudan öğrenciye hitap ediyor ve tekrar edilmeye değer tek bir konuyla bitiyor. Örnek metin İngilizce sentetik bir örnektir.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Araç her öğrenciye kendi çalışması hakkında ne söylüyor?
- **Araştırmacı:** Öğrenciler ipuçlarının yanında hangi yansıtıcı geri bildirimi aldı?

## Ham veri örneği {#raw}

Örneğin sonunda S07’nin özeti.

`learner_profiles` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/ai-learning-summary.json

### Nasıl yazılır {#learner-profiles-student-summary}

Model son 30 soruyu başlıkları ve sonuçlarıyla birlikte ve öğrenci hakkında birkaç sayı alır. Öğrenciye üç ile beş cümle, en fazla 700 karakter yazmalıdır. Ne olduğunu betimlemeli, öğrencinin yeteneğini asla değerlendirmemelidir. "Tekrar göz atmakta fayda var:" ile başlayan bir cümleyle bitebilir. Gizli notlarla birlikte yeniden yazılır.

<FormulaVersion ids="learner_profiles.student_summary" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahaleden sonra (nitel)
- **SPSS için öğrenci başına tek değer:** Yok. Bu bir metindir. Bir değişkene ihtiyacınız varsa önce kodlayın, örneğin son cümlede adı geçen konu.
- **Örnek analiz:** Son özetlerin nitel içerik analizi: model hangi konuları adlandırıyor ve bunlar öğrencinin ön test ve son testte yanlış yaptığı maddelerle örtüşüyor mu?

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Öğrencilere gösterilen yapay zekâ tarafından üretilmiş öğrenme özetleri, tekrar için önerdikleri konular açısından nitel olarak analiz edilmiştir."

## Bu verinin göstermedikleri {#limits}

Metin bir yapay zekâ modeli tarafından yazılır ve yanlış olabilir. Yalnızca son sürüm saklanır, bu yüzden önceki özetler kaybolur. Özet, öğrencinin ne öğrendiğini değil, modelin sorularda ne gördüğünü söyler.

## Öğretmen için {#teacher}

::: tip Derste
Birebir bir görüşmeden önce birkaç öğrencinin özetini okuyun. İddiaları tekrarlamadan önce paneldeki sorularla karşılaştırın.
:::
