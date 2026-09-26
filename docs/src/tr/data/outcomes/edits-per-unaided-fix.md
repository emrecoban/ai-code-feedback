---
title: Yardımsız düzeltme başına düzenleme
items:
  - coding_sessions.silent_resolution_edits
  - metric.edits_per_unaided_fix
sample:
  - views/edits-per-unaided-fix.json#facts.featuredEpf = 1.9
  - views/edits-per-unaided-fix.json#facts.classEpf = 1.8
  - views/edits-per-unaided-fix.json#facts.classEdits = 2214
  - views/edits-per-unaided-fix.json#facts.classFixed = 1255
---

# Yardımsız düzeltme başına düzenleme

## Yardımsız düzeltme başına düzenleme nedir? {#what}

Sormadan düzeltilen her hata için eklenti, hata gösterilirken yapılan düzenlemeleri toplar. Bu tür düzeltmelerin sayısına bölündüğünde, yardımsız bir düzeltmenin ortalama maliyeti elde edilir.

## Bir öğrenciyle örnek {#example}

S07 tek başına düzelttiği bir hata için ortalama 1,9 düzenleme yaptı ve bir hatayı sormadan önce yaklaşık üç düzenleme yaptı. Sınıfta bu değerler 1,8 ve ikiden biraz fazla oldu.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="edits-per-unaided-fix" /></ClientOnly>
<template #takeaway>Yardımsız düzeltmeler yaklaşık iki düzenleme gerektiriyor. Soruyla biten hatalardan önce biraz daha fazla düzenleme var.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrencilerin tek başına düzelttiği hatalar kolay olanlar mı?
- **Araştırmacı:** Yardımsız düzeltmelerin çabası, yardım isteğinden önceki çabayla nasıl karşılaştırılır?

## Ham veri örneği {#raw}

S07’nin yardımsız düzeltmeler içeren iki oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/edits-per-unaided-fix.json

### Düzenlemeler nasıl sayılır {#coding-sessions-silent-resolution-edits}

Sormadan düzeltilen her hata için, ilk teklif ile kaybolma arasında dosyasındaki düzenleme olayları. Görünür teklifi olmayan bir hata 0 ekler.

<FormulaVersion ids="coding_sessions.silent_resolution_edits" />

### Yardımsız düzeltme başına düzenleme (panel) {#metric-edits-per-unaided-fix}

Dönemin oturumları üzerinden düzenlemelerin toplamı, sormadan düzeltilen hataların toplamına bölünür (örnekte 2214 ÷ 1255). Panel bunu tarayıcıda hesaplar.

<FormulaVersion ids="metric.edits_per_unaided_fix" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `edits_per_unaided_fix`, oturum oranlarının ortalaması olarak değil, iki toplamdan hesaplanır.
- **Örnek analiz:** Aynı öğrencinin sormadan önceki ortanca düzenlemeleriyle karşılaştırın (eşleştirilmiş Wilcoxon testi).

**Araştırma soruları**

<RqList ids="metric.edits_per_unaided_fix" />

**Örnek cümle (Yöntem):** "Yardımsız düzeltmelerin çabası, çözülen hata gösterilirken yapılan ortalama düzenleme sayısı olarak ifade edilmiştir."

## Bu verinin göstermedikleri {#limits}

Görünür bir teklif olmadan düzeltilen hatalar bir düzeltme ekler ama düzenleme eklemez. Bu da ortalamayı düşürür. Satır kaymaları sıfır düzenlemeli sahte düzeltmeler oluşturabilir. Bir düzenleme olayı bir denemeyle aynı şey değildir.

## Öğretmen için {#teacher}

::: tip Derste
Bu sayıyı yalnızca sorularla birlikte kullanın: az düzenlemeyle tek başına düzelten ve çok düzenlemeden sonra soran bir öğrenci doğru şeyleri soruyor olabilir.
:::
