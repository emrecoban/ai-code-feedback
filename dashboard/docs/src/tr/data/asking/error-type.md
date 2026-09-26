---
title: Hata türü
items:
  - interactions.error_signature
  - interactions.error_source
  - interactions.error_code
  - interactions.error_severity
  - metric.severity_mix
sample:
  - views/error-type.json#facts.featuredMessage = "total" is not defined
  - views/error-type.json#facts.featuredCode = reportUndefinedVariable
  - views/error-type.json#facts.featuredSeverity = error
  - views/error-type.json#facts.top = Pylance
  - views/error-type.json#facts.topQuestions = 203
  - views/error-type.json#facts.errors = 568
  - views/error-type.json#facts.warnings = 89
---

# Hata türü

## Hata türü nedir? {#what}

Hata sorularında sistem, editörün gösterdiği hata mesajını, onu bildiren aracı (örneğin Pylance), kural kodunu ve önem derecesini (hata ya da uyarı) saklar. Seçim sorularının hata türü yoktur.

## Bir öğrenciyle örnek {#example}

S07’nin ilk hata sorusu `"total" is not defined` mesajı hakkındaydı. Pylance bu hatayı `reportUndefinedVariable` koduyla ve "Hata" önem derecesiyle bildirdi. Kural kodu kesin bir kategoridir, mesaj ise her değişken adıyla değişir.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="error-type" /></ClientOnly>
<template #takeaway>En büyük çubuk olan "Pylance", 203 soru içeriyor: panelin bir araya topladığı, kural kodu olmayan sözdizimi hataları.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrencilerimin en çok yardıma ihtiyaç duyduğu hatalar hangileri?
- **Araştırmacı:** Hangi hata sınıfları öğrencileri soru sormaya yöneltiyor ve bunların hangileri tam çözüm gerektiriyor?

## Ham veri örneği {#raw}

S07’nin sınıflandırmasıyla birlikte bir hata sorusu.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/error-type.json

### Önem derecesine göre hata soruları (panel) {#metric-severity-mix}

Dönemin hata soruları önem derecesine göre gruplanır. Örnekte: 568 hata ve 89 uyarı.

<FormulaVersion ids="metric.severity_mix" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Her hata kategorisi ve öğrenci için sayı, örneğin `n_err_undefined`. Kategorileri kural kodundan, kod yoksa mesajdan oluşturun.
- **Örnek analiz:** En sık on kategoriyi betimleyin ve çözüme kadar ilerleyen soruların payını kategoriler arasında karşılaştırın.

**Araştırma soruları**

<RqList ids="interactions.error_code,metric.severity_mix" />

**Örnek cümle (Yöntem):** "Hatalar dil sunucusunun (Pylance) kural koduna, kodu olmayan hatalar ise normalleştirilmiş mesaja göre sınıflandırılmıştır."

## Bu verinin göstermedikleri {#limits}

Panel hataları "araç + kod" biçiminde gruplar. Kodu olmayan bir hata yalnızca araç adının altına düşer. Bu yüzden bütün sözdizimi hataları "Pylance" adlı tek bir satırda görünür. Mesaj, öğrencinin kodundan adlar ve değerler içerebilir. Bir istekte yalnızca ilk tanılama (diagnostic) saklanır.

## Öğretmen için {#teacher}

::: tip Derste
Bir hata türü bir haftaya damgasını vurduysa, bir sonraki laboratuvarın başında onu bir kez gösterin ve siz açıklamadan önce öğrencilerin mesajın anlamını tahmin etmesini isteyin.
:::
