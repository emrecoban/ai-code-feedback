---
title: Açıklamadan sonra hata gitti
items:
  - event.diagnostic_resolved
  - event.diagnostic_resolved.msToResolution
  - event.diagnostic_resolved.msPresent
  - event.diagnostic_resolved.editsWhilePresent
  - metric.error_gone_pct
  - metric.error_gone_by_level
sample:
  - views/error-gone.json#facts.featuredQuestions = 22
  - views/error-gone.json#facts.featuredResolved = 19
  - views/error-gone.json#facts.classPct = 72.9
  - views/error-gone.json#facts.classMedianSec = 86
---

# Açıklamadan sonra hata gitti

## "Açıklamadan sonra hata gitti" ne demek? {#what}

Öğrenci bir hata hakkında soru sorduktan sonra eklenti açık dosyada o hatayı izler. Hata kaybolduğunda bir olay, bunun sorudan itibaren ne kadar sürdüğünü saklar. Açıklamanın ardından bir düzeltme geldiğinin en doğrudan işaretidir.

## Bir öğrenciyle örnek {#example}

S07 22 hata hakkında soru sordu ve bunların 19 tanesi sonradan ortadan kalktı. Sınıfta bu pay %72,9 oldu. Sorudan hatanın kaybolduğu ana kadar geçen ortanca süre 86 saniyeydi.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="error-gone" /></ClientOnly>
<template #takeaway>Hata, her ipucu derinliğinde yaklaşık dört sorudan üçünde ortadan kalktı. S07 sınıfın üstünde.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Açıklamalar öğrencilerin hatalardan kurtulmasına yardım etti mi?
- **Araştırmacı:** Daha derin bir ipucu düzeyi, hatanın daha sık ya da daha hızlı çözülmesiyle ilişkili mi?

## Ham veri örneği {#raw}

S07’nin bir olayı.

`events`:

<<< @/../.vitepress/data/sample/snippets/error-gone.json

### Süre nasıl ölçülür {#event-diagnostic-resolved-mstoresolution}

Yardım bağlantısına tıklamadan hatanın artık dosyada olmadığı ana kadar geçen süre, milisaniye olarak. Bir hata dosya, satır ve mesajla tanımlanır.

<FormulaVersion ids="event.diagnostic_resolved.msToResolution" />

### Hatanın açık kaldığı süre {#event-diagnostic-resolved-mspresent}

Yardım teklifinin ilk görünmesinden kaybolmaya kadar geçen süre. Görünür bir teklif yoksa değer yoktur.

<FormulaVersion ids="event.diagnostic_resolved.msPresent" />

### Hata varken yapılan düzenlemeler {#event-diagnostic-resolved-editswhilepresent}

Teklif ile kaybolma arasında dosyadaki düzenleme olayları. Görünür bir teklif yoksa değer yoktur.

<FormulaVersion ids="event.diagnostic_resolved.editsWhilePresent" />

### Açıklamadan sonra hata gitti (panel) {#metric-error-gone-pct}

Dönemde en az bir böyle olayı olan hata soruları, dönemin tüm hata sorularına bölünür. Ortanca süre her sorunun ilk olayını kullanır.

<FormulaVersion ids="metric.error_gone_pct" />

### Hata ortadan kalktı mı? İpucu derinliğine göre (panel) {#metric-error-gone-by-level}

Aynı pay ve ortanca süre, L0–L1’de, L2’de ve L3’te biten sorulara ayrılır.

<FormulaVersion ids="metric.error_gone_by_level" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde (yakın sonuç)
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `resolved_share` = olayı olan hata soruları ÷ hata soruları ve `median_resolution_s`.
- **Örnek analiz:** Soru başına çözülmeyi, ipucu derinliği yordayıcı ve öğrenci rastgele etki olmak üzere karma lojistik regresyonla modelleyin.

**Araştırma soruları**

<RqList ids="metric.error_gone_pct,event.diagnostic_resolved.msToResolution" />

**Örnek cümle (Yöntem):** "Öğrencinin sorduğu tanılama açık dosyadan kaybolduğunda hata çözülmüş kabul edilmiştir."

## Bu verinin göstermedikleri {#limits}

Bir hata dosya, satır ve mesajla tanımlanır. Bu yüzden hatayı başka bir satıra kaydıran bir düzenleme çözülme gibi görünür. Bir hata düzeltildiği için değil, kod silindiği için de kaybolabilir. Kapalı dosyalardaki hatalar izlenmez.

## Öğretmen için {#teacher}

::: tip Derste
Bir görev için birçok hata açıklamadan sonra da kalıyorsa, o hatayı sınıfla birlikte ele alın. Hatalar hızla gidiyorsa, açıklamalar o konu için işini yapıyor demektir.
:::
