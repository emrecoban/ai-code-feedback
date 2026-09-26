---
title: Aynı hatadan bu yana geçen süre
items:
  - interactions.ms_since_previous_same_error
  - metric.quick_repeats
sample:
  - views/time-since-same-error.json#facts.featuredRepeats = 10
  - views/time-since-same-error.json#facts.featuredQuick = 1
  - views/time-since-same-error.json#facts.quickPct = 12.3
---

# Aynı hatadan bu yana geçen süre

## Aynı hatadan bu yana geçen süre nedir? {#what}

Tekrarlanan bir hata için bu, öğrencinin aynı normalleştirilmiş hatayı en son sorduğu zamandan bu yana geçen süredir. Kısa bir süre, son açıklamanın yerine ulaşmadığını gösterir. Uzun bir süre ise hatanın daha sonra geri geldiğini gösterir.

## Bir öğrenciyle örnek {#example}

S07 daha önceki bir hatayı 10 kez tekrarladı. Bunlardan yalnızca 1 tanesi önceki sorudan sonraki on dakika içinde geldi. Tekrarların çoğu günler sonra, benzer bir görev aynı hatayı geri getirdiğinde geldi.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="time-since-same-error" /></ClientOnly>
<template #takeaway>Sınıfta tekrarların %12,3 kadarı on dakika içinde geldi.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Son açıklama işe yaradı mı, yoksa öğrenci hemen yeniden mi sordu?
- **Araştırmacı:** Hızlı tekrarlar, zamanla unutmadan ayrı olarak bir açıklamanın başarısız olduğunun işareti sayılabilir mi?

## Ham veri örneği {#raw}

S07’nin tekrarlanan bir hata sorusu.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/time-since-same-error.json

### Süre nasıl hesaplanır {#interactions-ms-since-previous-same-error}

Yeni sorunun zamanı eksi aynı normalleştirilmiş mesaja sahip en son önceki sorunun zamanı, milisaniye olarak. İlk kez görülen hatalarda ve seçim sorularında boştur.

<FormulaVersion ids="interactions.ms_since_previous_same_error" />

### 10 dakika içinde yeniden sordu (panel) {#metric-quick-repeats}

Dönemdeki, aynı hatadan bu yana geçen süresi en fazla 600.000 ms (10 dakika) olan sorular.

<FormulaVersion ids="metric.quick_repeats" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `quick_repeats` = 10 dakika içindeki tekrarların sayısı ve `quick_repeat_share` = hızlı tekrarlar ÷ tekrarlar.
- **Örnek analiz:** L0–L1’de biten sorularla L3’e ulaşan sorular arasında hızlı tekrar oranını karşılaştırın (ki-kare testi).

**Araştırma soruları**

<RqList ids="metric.quick_repeats" />

**Örnek cümle (Yöntem):** "Aynı hata için önceki istekten sonraki on dakika içinde gelen bir tekrar, önceki açıklamanın sorunu çözmediğinin işareti olarak alınmıştır."

## Bu verinin göstermedikleri {#limits}

Aynı normalleştirilmiş mesaja sahip iki farklı hata aynı hata sayılır. Bu yüzden hızlı bir "tekrar" yeni ama benzer bir sorun olabilir. On dakikalık sınır panelin sabit bir seçimidir, sınanmış bir eşik değildir.

## Öğretmen için {#teacher}

::: tip Derste
Hızlı bir tekrar, birebir konuşmak için iyi bir andır: ekrandaki açıklama işe yaramadı, bu yüzden farklı bir anlatım büyük olasılıkla daha iyi sonuç verir.
:::
