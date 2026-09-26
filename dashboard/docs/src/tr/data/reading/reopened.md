---
title: Sonra yeniden açtı
items:
  - event.explanation_reopened
  - metric.reopened
sample:
  - views/reopened.json#facts.featured = 1
  - views/reopened.json#facts.reopened = 60
  - views/reopened.json#facts.explanations = 928
---

# Sonra yeniden açtı

## Yeniden açılan açıklama nedir? {#what}

Eklentinin ilerleme paneli son on soruyu listeler. Bir karta tıklamak saklanan açıklamayı yeniden gösterir ve olay bunu kaydeder.

## Bir öğrenciyle örnek {#example}

S07 geçmiş listesinden 1 açıklamayı yeniden açtı. Sınıfta 928 açıklamanın 60 tanesi daha sonra yeniden açıldı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="reopened" /></ClientOnly>
<template #takeaway>Açıklamaların çoğu dört ile yedi gün sonra, bir sonraki laboratuvar sırasında yeniden açılıyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Hangi açıklamalara geri dönmeye değer?
- **Araştırmacı:** Öğrenciler geçmiş geri bildirimi tekrar için kullanıyor mu?

## Ham veri örneği {#raw}

Örnekten bir olay. Olay verisi boştur.

`events`:

<<< @/../.vitepress/data/sample/snippets/reopened.json

### Sonra yeniden açtı (panel) {#metric-reopened}

Ne zaman olursa olsun, en az bir kez yeniden açılan dönem soruları.

<FormulaVersion ids="metric.reopened" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve sonrasında (tekrar)
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `reopen_count`.
- **Örnek analiz:** Son haftadaki yeniden açma sayısını son test puanıyla ilişkilendirin (Spearman).

**Araştırma soruları**

<RqList ids="metric.reopened" />

**Örnek cümle (Yöntem):** "Geçmiş bir açıklamanın geçmiş listesinden yeniden açılması bir tekrar eylemi olarak kaydedilmiştir."

## Bu verinin göstermedikleri {#limits}

Listede yalnızca son on soru görünür, bu yüzden daha eski açıklamalar orada yeniden açılamaz. Bir tıklama çalışmadan çok merak olabilir. Olay öğrencinin ne kadar süre okuduğu hakkında bir şey söylemez.

## Öğretmen için {#teacher}

::: tip Derste
Bir sınavdan önce öğrencilere geçmiş açıklamalarının ilerleme panelinde olduğunu ve yeniden okunabileceğini hatırlatın.
:::
