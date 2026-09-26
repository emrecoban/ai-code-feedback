---
title: Sormadan önceki düzenlemeler
items:
  - interactions.edits_before_ask
  - metric.avg_edits_before_ask
sample:
  - views/edits-before-asking.json#facts.featuredAvg = 2.8
  - views/edits-before-asking.json#facts.classMedian = 2
  - views/edits-before-asking.json#facts.eightPlus = 4
---

# Sormadan önceki düzenlemeler

## Sormadan önceki düzenlemeler nedir? {#what}

Bu sayı, yardım teklifinin göründüğü an ile ona tıklandığı an arasında öğrencinin dosyada yaptığı değişiklikleri sayar. Sorudan önce kaç deneme yapıldığını gösterir.

## Bir öğrenciyle örnek {#example}

S07 sormadan önce ortalama 2,8 düzenleme yaptı. Sınıfın ortancası 2. Tüm sınıfta yalnızca 4 soru sekiz ya da daha fazla düzenlemeden sonra geldi.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="edits-before-asking" /></ClientOnly>
<template #takeaway>Soruların çoğu sıfır ile dört deneme arasında geliyor. Sormadan önceki uzun deneme dizileri seyrek.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler sormadan önce bir şey deniyor mu?
- **Araştırmacı:** Bir yardım isteğinden önce ne kadar çaba harcanıyor ve bu, yardımsız düzeltmelerin çabasıyla nasıl karşılaştırılıyor?

## Ham veri örneği {#raw}

S07’nin iki hata sorusu.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/edits-before-asking.json

### Düzenlemeler nasıl sayılır {#interactions-edits-before-ask}

Teklif ile tıklama arasında belgedeki değişiklik olaylarının sayısı. Bir değişiklik olayı, yazılan tek bir karakter ya da yapıştırılan bir blok olabilir. Görünür bir teklif yoksa boştur.

<FormulaVersion ids="interactions.edits_before_ask" />

### Sormadan önceki düzenlemeler (panel) {#metric-avg-edits-before-ask}

Öğrenci görünümü boş olmayan değerlerin ortalamasını bir ondalıkla gösterir. Öğrenme davranışının sınıf görünümü ise ortancayı gösterir.

<FormulaVersion ids="metric.avg_edits_before_ask" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `median_edits_before_ask`. Ortancayı tercih edin, çünkü tek tük uzun yazma oturumları ortalamayı şişirir.
- **Örnek analiz:** Aynı öğrencinin yardımsız düzeltme başına düzenlemeleriyle karşılaştırın (eşleştirilmiş Wilcoxon testi).

**Araştırma soruları**

<RqList ids="interactions.edits_before_ask,metric.avg_edits_before_ask" />

**Örnek cümle (Yöntem):** "Yardım istemeden önceki sebat, yardım bağlantısının görünmesi ile istek arasındaki düzenleme sayısı olarak işlevselleştirilmiştir."

## Bu verinin göstermedikleri {#limits}

Bir düzenleme olayı, öğrenme anlamında bir deneme değildir: tek bir sözcük yazmak birçok olay oluşturur, bir yapıştırma ise tek olay. Başka dosyalardaki düzenlemeler sayılmaz. Seçim sorularında değer boştur.

## Öğretmen için {#teacher}

::: tip Derste
Bir öğrenci çoğu zaman hiç düzenleme yapmadan soruyorsa, önce hata mesajını kendi sözleriyle açıklamasını isteyin. Sormadan önce çok fazla düzenleme yapan bir öğrenciye ise daha erken sormasını önermek hayal kırıklığını azaltabilir.
:::
