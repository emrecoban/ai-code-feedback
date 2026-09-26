---
title: Ekranda kalma süresi
items:
  - event.explanation_visibility
  - event.explanation_visibility.visibleMs
  - event.explanation_visibility.visibleAtDelivery
  - metric.reading_on_screen_pct
  - metric.reading_visible_median
sample:
  - views/time-on-screen.json#facts.featuredMedianSec = 52
  - views/time-on-screen.json#facts.classMedianSec = 44
  - views/time-on-screen.json#facts.onScreenPct = 84.9
  - views/time-on-screen.json#facts.measured = 837
  - views/time-on-screen.json#facts.explanations = 928
---

# Ekranda kalma süresi

## Ekranda kalma süresi nedir? {#what}

Ekranda kalma süresi, bir açıklama güncel açıklamayken eklenti panelinin ne kadar süre görünür olduğudur. Olay ayrıca açıklama geldiğinde panelin görünür olup olmadığını da söyler.

## Bir öğrenciyle örnek {#example}

S07 için ortanca ekranda kalma süresi 52 saniye, sınıf için 44 saniye oldu. Süre, bir sonraki açıklama güncel açıklamanın yerini aldığında ya da VS Code kapandığında biter.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="time-on-screen" /></ClientOnly>
<template #takeaway>Açıklamaların çoğu 10 saniye ile 2 dakika arasında ekranda kalıyor. S07 30–60 sn grubunda.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler açıklamalara gerçekten bakıyor mu?
- **Araştırmacı:** Diğer okuma ölçülerine güvenilebilir mi, yani panel gerçekten görünür müydü?

## Ham veri örneği {#raw}

S07’nin bir olayı.

`events`:

<<< @/../.vitepress/data/sample/snippets/time-on-screen.json

### Süre nasıl ölçülür {#event-explanation-visibility-visiblems}

Bu açıklama güncelken panel görünümünün görünür olduğu sürelerin toplamı, milisaniye olarak.

<FormulaVersion ids="event.explanation_visibility.visibleMs" />

### Geldiğinde ekrandaydı (panel) {#metric-reading-on-screen-pct}

Açıklama geldiğinde panelin görünür olduğu olaya sahip sorular, böyle bir olayı olan tüm sorulara bölünür. Örnekte: %84,9.

<FormulaVersion ids="metric.reading_on_screen_pct" />

### Ekranda kalma süresi (medyan, panel) {#metric-reading-visible-median}

Dönemde sorulan soruların olayları üzerinden ekranda kalma süresinin ortancası.

<FormulaVersion ids="metric.reading_visible_median" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `median_visible_s` ve geldiğinde görünür olan açıklamaların payı olarak `on_screen_share`.
- **Örnek analiz:** Diğer okuma ölçülerini süzmek ya da ağırlıklandırmak için kullanın ve ortancayı ipucu derinliğiyle ilişkilendirin.

**Araştırma soruları**

<RqList ids="event.explanation_visibility.visibleMs,metric.reading_visible_median" />

**Örnek cümle (Yöntem):** "Geri bildirim panelinin görünür olduğu süre, her açıklama için okuma süresinin üst sınırı olarak kaydedilmiştir."

## Bu verinin göstermedikleri {#limits}

Görünür olmak okunmuş olmak demek değildir: panel açıkken öğrenci koda bakıyor olabilir. VS Code kapanmadan önceki son açıklamanın olayı çoğu zaman kaybolur. Bu yüzden örnekte 928 açıklamanın 837 tanesinin değeri var. Süre, okumanın üst sınırıdır.

## Öğretmen için {#teacher}

::: tip Derste
Açıklamalar birkaç saniye sonra ekrandan kayboluyorsa, öğrencilere panelin nerede olduğunu ve kodun yanında açık kalabileceğini gösterin.
:::
