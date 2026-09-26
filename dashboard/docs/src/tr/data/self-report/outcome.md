---
title: Sonuç
items:
  - interactions.self_reported_outcome
sample:
  - views/outcome.json#facts.featuredSolved = 21
  - views/outcome.json#facts.featuredStuck = 2
  - views/outcome.json#facts.answeredPct = 44.8
---

# Sonuç

## Öz bildirimli sonuç nedir? {#what}

Öğrenci her açıklamanın altındaki "Sonuç ne oldu?" sorusunu tek tıkla yanıtlayabilir: Çözdüm ya da Hâlâ takıldım. Sistemin ölçtüğü davranışın yanında, öğrencinin sonuca kendi bakışıdır.

## Bir öğrenciyle örnek {#example}

S07 21 kez "Çözdüm", 2 kez "Hâlâ takıldım" yanıtını verdi. Sınıfta soruların %44,8 kadarı yanıtlandı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="outcome" /></ClientOnly>
<template #takeaway>"Hâlâ takıldı" payı en yüksek olan sorular düzeltmeye ulaşan sorular.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Hangi öğrenciler bir açıklamadan sonra hâlâ takıldıklarını söylüyor?
- **Araştırmacı:** Hatanın ortadan kalkması gibi davranışsal işaretler öğrencilerin bildirdikleriyle örtüşüyor mu?

## Ham veri örneği {#raw}

S07’nin yanıtlanmış iki sorusu.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/outcome.json

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde (geçerleme)
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `solved_share` = çözdüm ÷ yanıtlanan. Eksik değer: yanıt yoksa −97.
- **Örnek analiz:** Hata sorularında yanıtı "Açıklamadan sonra hata gitti" ile çapraz tabloya koyun ve uyumu raporlayın (Cohen kappa).

**Araştırma soruları**

<RqList ids="interactions.self_reported_outcome" />

**Örnek cümle (Yöntem):** "Davranışsal göstergeyi geçerlemek için öz bildirimli sonuçlar tanılamanın kaybolmasıyla karşılaştırılmıştır."

## Bu verinin göstermedikleri {#limits}

Öğrenciler farklı anlarda yanıt verir, bazıları hemen, bazıları sonra, ve yanıtın zamanı saklanmaz. Yanıt geçmiş listesinden değiştirilebilir. Takılan öğrenciler yanıt vermeden ayrılabilir.

## Öğretmen için {#teacher}

::: tip Derste
"Hâlâ takıldım" doğrudan bir yardım isteğidir. Panel bu öğrencileri "Dikkat gerektirenler" altında listeler, bu yüzden laboratuvar sırasında oraya bakın.
:::
