---
title: Kullanılan token
items:
  - interactions.prompt_tokens
  - interactions.completion_tokens
  - metric.tokens_used
sample:
  - views/tokens.json#facts.total = 1977570
  - views/tokens.json#facts.prompt = 1502433
  - views/tokens.json#facts.completion = 475137
  - views/tokens.json#facts.perAnswer = 2302
---

# Kullanılan token

## Token nedir? {#what}

Token, bir yapay zekâ sağlayıcısının metni saydığı birimdir. Her yanıt, sağlayıcının bildirdiği biçimde isteğin (istem) ve yanıtın (tamamlama) tokenlerini saklar. Hizmetin maliyeti bunlara bağlıdır.

## Bir öğrenciyle örnek {#example}

Örnekte sınıf 1.977.570 token kullandı: istekler için 1.502.433, yanıtlar için 475.137. Üretilen bir yanıt ortalama 2.302 token kullandı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="tokens" /></ClientOnly>
<template #takeaway>Tokenler soru sayısını izliyor: en çok üçüncü haftada, en az sekizinci haftada.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Hizmet sınıfım için ne kadara mal oluyor?
- **Araştırmacı:** Yaklaşımın uygulanabilirliği üzerine bir rapor için işletme maliyetleri nedir?

## Ham veri örneği {#raw}

S07’nin üretilmiş bir yanıtı.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/tokens.json

### Kullanılan token (panel) {#metric-tokens-used}

Dönemin sorularının istek ve yanıt tokenlerinin toplamı, zaman dilimi ve sağlayıcı başına da.

<FormulaVersion ids="metric.tokens_used" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde (veri niteliği ve Yöntem bölümü)
- **SPSS için öğrenci başına tek değer:** Öğrenci başına gerekmez. Toplamı ve yanıt başına ortalamayı raporlayın.
- **Örnek analiz:** Sağlayıcının token başına fiyatından öğrenci ve ders başına maliyeti tahmin edin.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Yapay zekâ sağlayıcısının bildirdiği token kullanımı, öğrenci başına işletme maliyetini tahmin etmek için kullanılmıştır."

## Bu verinin göstermedikleri {#limits}

Yalnızca son başarılı çağrı saklanır, bu yüzden bir onarım çağrısı ya da başarısız bir ilk çağrı sayılmaz ve gerçek maliyet daha yüksektir. Yedek sağlayıcı tokenleri başka bir biçimde sayabilir. Yapay zekâ öğrenme özetleri dahil değildir.

## Öğretmen için {#teacher}

::: tip Derste
Bu sayfa esas olarak hizmeti işletenler içindir. Öğretim için soru sayısı daha yararlıdır.
:::
