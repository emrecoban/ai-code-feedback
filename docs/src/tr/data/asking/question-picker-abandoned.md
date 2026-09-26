---
title: Soru seçiciyi kapattı
items:
  - event.question_picker_abandoned
  - event.question_picker_abandoned.stage
  - event.question_picker_abandoned.triggerSurface
  - event.question_picker_abandoned.selectionLineCount
  - event.question_picker_abandoned.selectionCharCount
  - metric.picker_abandoned
sample:
  - views/question-picker-abandoned.json#facts.featured = 5
  - views/question-picker-abandoned.json#facts.preset = 44
  - views/question-picker-abandoned.json#facts.freeText = 12
  - views/question-picker-abandoned.json#facts.selection = 271
---

# Soru seçiciyi kapattı

## Kapatılan soru seçici nedir? {#what}

Bu olay, öğrenci seçilen kod için soru listesini açıp soru sormadan kapattığında ya da kendi sorusu kutusunu boş kapattığında kaydedilir. Hiç soru oluşmaz. Bu yüzden bu olay, girişimin tek izidir.

## Bir öğrenciyle örnek {#example}

S07 soru listesini 5 kez açtı ama hiçbir şey sormadı. Olay her seferinde listenin nerede kapatıldığını ve kaç satırın seçili olduğunu kaydetti. Soru tablosunda bu anlar hiç görünmez.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="question-picker-abandoned" /></ClientOnly>
<template #takeaway>Sınıfta liste 44 kez, kendi sorusu kutusu 12 kez kapatıldı. Buna karşılık 271 seçim sorusu soruldu.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler sormaya başlayıp sonra vazgeçiyor mu?
- **Araştırmacı:** Sorudan önceki tereddüt ne sıklıkla ve hangi durumlarda ortaya çıkıyor?

## Ham veri örneği {#raw}

Örnekten bir olay.

`events`:

<<< @/../.vitepress/data/sample/snippets/question-picker-abandoned.json

### Soru listesini sormadan kapattı (panel) {#metric-picker-abandoned}

Dönemdeki bu olayların sayısı, seçicinin nerede kapatıldığına göre ayrılır: liste (preset) ya da kendi sorusu kutusu (free_text).

<FormulaVersion ids="metric.picker_abandoned" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `picker_abandoned_rate` = kapatılan seçiciler ÷ (kapatılan seçiciler + seçim soruları).
- **Örnek analiz:** Bu oranı TAM algılanan fayda puanıyla ilişkilendirin (Spearman).

**Araştırma soruları**

<RqList ids="event.question_picker_abandoned" />

**Örnek cümle (Yöntem):** "Açılıp kullanılmayan soru seçiciler, yardım istemeden önceki tereddüdün göstergesi olarak kaydedilmiştir."

## Bu verinin göstermedikleri {#limits}

Olay seçicinin kapatıldığını gösterir, nedenini değil. Öğrenci yanıtı bulmuş, seçimi değiştirmiş ya da yanlışlıkla tıklamış olabilir. Olay yalnızca bir oturum varken kaydedilir.

## Öğretmen için {#teacher}

::: tip Derste
Birçok seçici soru sorulmadan kapatılıyorsa, dört hazır sorunun rahatça denenebileceğini ve hiçbir sorunun "fazla basit" olmadığını gösterin.
:::
