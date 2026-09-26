---
title: Sorunun kaynağı
items:
  - interactions.trigger_source
sample:
  - views/trigger-source.json#facts.featuredQuestions = 37
  - views/trigger-source.json#facts.featuredDiagnostic = 22
  - views/trigger-source.json#facts.featuredSelection = 15
  - views/trigger-source.json#facts.classDiagnosticPct = 70.8
---

# Sorunun kaynağı

## Sorunun kaynağı nedir? {#what}

Kaynak, yardım isteğinin nasıl başladığını gösterir: koddaki bir hata ya da uyarıdan (diagnostic) veya öğrencinin seçtiği koddan (selection). Veritabanı runtime, stuck, paste ve success değerlerine de izin verir, ama eklenti bu değerleri hiç göndermez.

## Bir öğrenciyle örnek {#example}

S07 sekiz haftada 37 soru sordu. Bunların 22 tanesi bir hata mesajından, 15 tanesi seçilen koddan başladı. Sınıf sorularının %70,8 kadarını hatalar hakkında sordu. Yani S07 seçimleri çoğu öğrenciden daha sık kullandı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="trigger-source" /></ClientOnly>
<template #takeaway>Sınıftaki soruların çoğu bir hatadan başlıyor. S07 seçilen kod hakkında çoğu öğrenciden daha sık soruyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler çoğunlukla hataları mı soruyor, yoksa çalışan kodu da mı?
- **Araştırmacı:** Öğrenciler yardım sistemine hangi yoldan giriyor ve iki yol farklı ipucu derinliklerine mi götürüyor?

## Ham veri örneği {#raw}

S07’nin her türden birer sorusu.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/trigger-source.json

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** `share_selection` = seçim soruları ÷ öğrencinin tüm soruları.
- **Örnek analiz:** Her kaynağın haftalık payını betimleyin ve hata ile seçim soruları arasında ipucu derinliğini ki-kare testiyle karşılaştırın.

**Araştırma soruları**

<RqList ids="interactions.trigger_source" />

**Örnek cümle (Yöntem):** "Her yardım isteği kaynağına göre kodlanmıştır: editörün gösterdiği bir hata ya da uyarı veya öğrencinin seçtiği kod."

## Bu verinin göstermedikleri {#limits}

Kaynak, isteğin nereden başladığını gösterir, öğrencinin niyetini değil. Hatalı satırı seçip onu soran bir öğrenci seçim olarak sayılır. Editörün fark edemediği hatalar, örneğin mantık hataları, yalnızca seçim sorusu olarak görünebilir.

## Öğretmen için {#teacher}

::: tip Derste
Bir öğrenci seçilen kod hakkında neredeyse hiç soru sormuyorsa, sınıfa çalışan kod hakkında da soru sorulabileceğini gösterin. Örneğin "Bu neden çalışıyor?" sorusuyla.
:::
