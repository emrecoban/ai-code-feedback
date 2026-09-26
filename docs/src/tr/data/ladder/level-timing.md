---
title: İpucu adımlarını açma
items:
  - event.level_reached
  - event.level_reached.level
  - event.level_reached.isEscalation
  - event.level_reached.msSinceCreated
  - metric.reading_to_rule_median
  - metric.reading_to_fix_median
sample:
  - views/level-timing.json#facts.title = Undefined variable total
  - views/level-timing.json#facts.toRuleSec = 38
  - views/level-timing.json#facts.toFixSec = 47
  - views/level-timing.json#facts.classToRuleSec = 22
  - views/level-timing.json#facts.classToFixSec = 44
---

# İpucu adımlarını açma

## İpucu adımlarının zamanlaması neyi gösterir? {#what}

Öğrenci her kural (L2) ya da düzeltme (L3) açtığında sunucu, sorunun sorulmasından bu yana geçen süreyle birlikte bir olay kaydeder. Olaylar, öğrencinin önce ilk adımları mı okuduğunu, yoksa doğrudan düzeltmeye mi tıkladığını gösterir.

## Bir öğrenciyle örnek {#example}

S07 "Undefined variable total" hakkında soru sordu. S07 kuralı sorudan 38 saniye, düzeltmeyi ise 47 saniye sonra açtı. Sınıfın ortancaları 22 ve 44 saniye. Aşağıdaki zaman çizelgesi bu sorudan sonra başka neler olduğunu gösteriyor.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="level-timing" /></ClientOnly>
<template #takeaway>Tek bir soru, birçok iz: adımlar, koda dönüş, ilk düzenleme ve hatanın ortadan kalktığı an.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler ilk adımları okuyor mu, yoksa yanıta mı atlıyor?
- **Araştırmacı:** Öğrenciler bir sonrakini açmadan önce her adımda ne kadar zaman geçiriyor?

## Ham veri örneği {#raw}

Zaman çizelgesindeki sorunun iki adım olayı.

`events`:

<<< @/../.vitepress/data/sample/snippets/level-timing.json

### Süre nasıl hesaplanır {#event-level-reached-mssincecreated}

Adımın açıldığı sunucu zamanı eksi sorunun kaydedildiği zaman, milisaniye olarak. Aynı adım bir soru için yalnızca bir kez saklanır.

<FormulaVersion ids="event.level_reached.msSinceCreated" />

### L2 açılma süresi (medyan, panel) {#metric-reading-to-rule-median}

Dönemde sorulan soruların adım olayları üzerinden L2 açılma sürelerinin ortancası.

<FormulaVersion ids="metric.reading_to_rule_median" />

### L3 açılma süresi (medyan, panel) {#metric-reading-to-fix-median}

L3 için aynı ortanca.

<FormulaVersion ids="metric.reading_to_fix_median" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Adımın açıldığı sorular üzerinden öğrenci başına `median_s_to_rule` ve `median_s_to_fix`.
- **Örnek analiz:** Düzeltmeye kadar geçen süreyi erken ve geç haftalarda karşılaştırın ya da bir sonraki düzenlemenin düzeltmeye benzerliğinin yordayıcısı olarak kullanın.

**Araştırma soruları**

<RqList ids="metric.reading_to_rule_median,metric.reading_to_fix_median" />

**Örnek cümle (Yöntem):** "İstekten her derin adımın açılmasına kadar geçen süre sunucuda kaydedilmiştir."

## Bu verinin göstermedikleri {#limits}

Süre sunucuda ölçülür, bu yüzden ağ gecikmesini de içerir. Uzun bir süre dikkatli okuma anlamına gelebilir, ama panelin gizli olduğu anlamına da gelebilir. Öğrenci günler sonra yeniden açılan bir açıklamada bir adım açarsa süre çok uzun olur.

## Öğretmen için {#teacher}

::: tip Derste
Öğrenciler düzeltmeyi birkaç saniye içinde açıyorsa, derste satırı kendileri bulmak için Bul sorusunu (L1) nasıl kullanacaklarını gösterin.
:::
