---
title: Önbellekten yanıtlanan
items:
  - interactions.cache_hit
  - explanations.reuse_count
  - metric.cache_rate
sample:
  - views/cache.json#facts.hits = 69
  - views/cache.json#facts.questions = 928
  - views/cache.json#facts.ratePct = 7.4
  - views/cache.json#facts.cacheRows = 868
  - views/cache.json#facts.reusedRows = 63
---

# Önbellekten yanıtlanan

## Önbellekten gelen yanıt nedir? {#what}

Aynı dil, soru türü, hata ve kod için daha önce bir yanıt varsa, sunucu yapay zekâ modeline sormak yerine o yanıtı yeniden gönderir. Hatada önce sayılar ve tırnak içindeki metinler değiştirilir. Kodda önce yorumlar ve fazla boşluklar kaldırılır.

## Bir öğrenciyle örnek {#example}

Örnekte 928 sorunun 69 tanesi (%7,4) önbellekten yanıtlandı. Önbellekte 868 yanıt vardı ve bunların 63 tanesi en az bir kez yeniden kullanıldı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="cache" /></ClientOnly>
<template #takeaway>Yanıtların azı önbellekten geliyor, çünkü öğrencilerin kodu nadiren birebir aynı.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler bir sınıf arkadaşıyla aynı yanıtı aldı mı?
- **Araştırmacı:** Hangi yanıtlar kişiselleştirilmedi? Bu, gizli notlar ve analiz için önemlidir.

## Ham veri örneği {#raw}

Önbellekteki bir yanıt (yanıtın metni gösterilmiyor).

`explanations` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/cache.json

### Yeniden kullanım sayısı {#explanations-reuse-count}

Önbellekten gelen her yanıtta bir artar. 0022 geçişinden (bir hata düzeltmesi) önceki kullanımlar sayılmadı.

<FormulaVersion ids="explanations.reuse_count" />

### Önbellekten yanıtlanan (panel) {#metric-cache-rate}

Dönemin önbellekten yanıtlanan soruları, dönemin tüm sorularına bölünür, sağlayıcı başına da.

<FormulaVersion ids="metric.cache_rate" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde (veri niteliği ve Yöntem bölümü)
- **SPSS için öğrenci başına tek değer:** Kişiselleştirilmemiş yanıtları kontrol etmek istiyorsanız öğrenci başına `cache_share`.
- **Örnek analiz:** Önbellekten gelen yanıtlar olmadan bir duyarlılık analizi yapın.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Önbellekten sunulan yanıtlar belirlenmiş ve bir duyarlılık analizinde dışarıda bırakılmıştır."

## Bu verinin göstermedikleri {#limits}

Önbellekten gelen bir yanıt başka bir soru için, belki başka bir öğrenci için yazılmıştır ve o anki öğrencinin gizli notlarını kullanmaz. Önbellekteki yanıtlar notların bir sonraki yeniden yazımı için sayılmaz. Hata düzeltmesinden önceki eski kullanımlar yeniden kullanım sayısında eksiktir.

## Öğretmen için {#teacher}

::: tip Derste
Birkaç öğrenci aynı yanıtı alıyorsa, büyük olasılıkla aynı görevde aynı hatayı yapmışlardır. Tüm sınıf için tek bir açıklamaya değer olabilir.
:::
