---
title: Açıklama
items:
  - interactions.title
  - interactions.ladder_payload
sample:
  - views/explanation.json#facts.title = Undefined variable total
  - views/explanation.json#facts.degraded = 10
---

# Açıklama

## Açıklama hakkında ne saklanır? {#what}

Sistem her soru için yapay zekâ modelinin yanıtının tamamını saklar: kısa bir başlık, kavram, dört adım ve iki işaret (güven ve "daha fazla bağlam gerekli"). Öğrenci onu geçmiş listesinden yeniden okuyabilir.

## Bir öğrenciyle örnek {#example}

S07’nin sorusu "Undefined variable total" başlığını aldı. Aşağıdaki yanıt, örnekteki her satır için kullanılan sentetik metindir. Gerçek veride her yanıt farklıdır ve geri bildirim dilinde yazılır.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="explanation" /></ClientOnly>
<template #takeaway>Dört adım, mesajı anlamaktan somut değişikliğe doğru ilerler.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenci tam olarak ne okudu?
- **Araştırmacı:** Öğrencinin aldığı geri bildirimin niteliği ve içeriği neydi?

## Ham veri örneği {#raw}

Yukarıdaki sorunun başlığı, kavramı ve saklanan yanıtı.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/explanation.json

## Araştırmada kullanım {#research}

- **Aşama:** analizde (geri bildirimin niteliği)
- **SPSS için öğrenci başına tek değer:** Metnin kendisi SPSS’e girmez. Rastgele bir yanıt örneklemini bir dereceli puanlama anahtarıyla değerlendirin ve puanları soru başına ekleyin.
- **Örnek analiz:** Yanıtların doğruluğunu iki değerlendiriciyle kontrol edin ve uyumu raporlayın (Cohen kappa).

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Üretilen açıklamalardan rastgele bir örneklem, doğruluk ve dört adımlı biçime uyum açısından iki araştırmacı tarafından değerlendirilmiştir."

## Bu verinin göstermedikleri {#limits}

Metin öğrencinin kodundan parçalar alıntılayabilir. İki katı denetim (yanlış dil ya da gizli notların sızması) iki kez başarısız olursa L2 ve L3 boş saklanır (örnekte 10 yanıt). Önbellekten gelen yanıtlar, başka bir öğrencinin aynı sorusu için yazılmıştır.

## Öğretmen için {#teacher}

::: tip Derste
Bir öğrenci açıklamanın kafa karıştırıcı olduğunu söylediğinde, soruyu panelde açın ve dört adımı birlikte okuyun. Yanlış anlamanın nerede başladığını görmenin hızlı bir yoludur.
:::
