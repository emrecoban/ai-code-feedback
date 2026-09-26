---
title: Yapay zekâ yanıt süresi
items:
  - interactions.model_used
  - interactions.latency_ms
  - metric.ai_response_time_avg
  - metric.response_time_median
sample:
  - views/response-time.json#facts.avgSec = 4.5
  - views/response-time.json#facts.p50Sec = 4.3
  - views/response-time.json#facts.p95Sec = 7.6
  - views/response-time.json#facts.cacheHits = 69
---

# Yapay zekâ yanıt süresi

## Yapay zekâ yanıt süresi nedir? {#what}

Sunucunun bir yanıt için yapay zekâ modelini beklediği süredir, milisaniye olarak. Aynı satır hangi yapay zekâ sağlayıcısının yanıt verdiğini de saklar.

## Bir öğrenciyle örnek {#example}

Örnekte ortalama yanıt süresi 4,5 saniyeydi. Yanıtların yarısı 4,3 saniyeden, %95’i 7,6 saniyeden kısa sürdü. Önbellekten gelen 69 yanıtın yanıt süresi yoktur.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="response-time" /></ClientOnly>
<template #takeaway>Yanıtların çoğu 3 ile 6 saniye arasında sürüyor. Çok azı 8 saniyeden uzun sürüyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler bir yanıt için uzun süre bekliyor mu?
- **Araştırmacı:** Müdahalenin bir koşulu olarak hizmet çalışma boyunca yeterince hızlı ve kararlı mıydı?

## Ham veri örneği {#raw}

Üretilmiş bir yanıt ve önbellekten gelen bir yanıt.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/response-time.json

### Süre nasıl ölçülür {#interactions-latency-ms}

Sunucu işlevinin içinde, ilk model çağrısından önceden son denetimden sonraya kadar geçen süre. İlk yanıt bir denetimi geçemediyse onarım çağrısı da dahildir. Önbellekten gelen yanıtlarda boştur.

<FormulaVersion ids="interactions.latency_ms" />

### Yapay zekâ sağlayıcısı {#interactions-model-used}

Yanıt veren sağlayıcı türünün kimliği (örneğin `openai_compatible`), modelin adı değil. Önbellekten gelen bir yanıtta önbellekteki yanıtın sağlayıcısıdır.

<FormulaVersion ids="interactions.model_used" />

### Yapay zekâ yanıt süresi (panel) {#metric-ai-response-time-avg}

Önbellekten gelen yanıtlar olmadan, dönemin sorularının ortalama yanıt süresi.

<FormulaVersion ids="metric.ai_response_time_avg" />

### Yanıt süresi (medyan, panel) {#metric-response-time-median}

Aynı sürelerin ortancası ve 95. yüzdeliği.

<FormulaVersion ids="metric.response_time_median" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde (veri niteliği ve Yöntem bölümü)
- **SPSS için öğrenci başına tek değer:** Öğrenci başına gerekmez. Tüm çalışma için ortancayı ve 95. yüzdeliği raporlayın.
- **Örnek analiz:** Kullanımdaki farkları açıklayamayacağından emin olmak için yanıt süresinin haftalar ya da gruplar arasında değişmediğini kontrol edin.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Müdahalenin koşullarını belgelemek için yapay zekâ geri bildirim hizmetinin sunucu tarafındaki ortanca yanıt süresi kaydedilmiştir."

## Bu verinin göstermedikleri {#limits}

Bu, öğrencinin gördüğü bekleme süresi değildir: ağ ve eklenti süreye eklenir. Başarısız isteklerin satırı yoktur, bu yüzden süresi dolan yavaş istekler eksiktir. Sağlayıcı alanı tam modeli adlandırmaz.

## Öğretmen için {#teacher}

::: tip Derste
Öğrenciler aracın yavaş olduğunu söylerse, laboratuvar sırasında panelin bu bölümüne bakın. Herkes için uzun süreler öğrencilerin bilgisayarlarına değil, yapay zekâ hizmetine işaret eder.
:::
