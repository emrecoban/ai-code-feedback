---
title: Sormadan düzeltilen
items:
  - coding_sessions.errors_resolved_without_asking
  - metric.fixed_unaided
sample:
  - views/fixed-without-asking.json#facts.featuredWeek1 = 5
  - views/fixed-without-asking.json#facts.featuredWeek8 = 15
  - views/fixed-without-asking.json#facts.featuredTotal = 52
  - views/fixed-without-asking.json#facts.workedOut = 22
---

# Sormadan düzeltilen

## Sormadan düzeltilen hata nedir? {#what}

Öğrencinin hiç sormadığı halde açık bir dosyadan kaybolan bir hata ya da uyarıdır. Eklentinin görebildiği yardımsız çalışmanın tek doğrudan işaretidir.

## Bir öğrenciyle örnek {#example}

S07 birinci haftada 5, sekizinci haftada 15 hatayı sormadan düzeltti. Toplam 52 hata. Öğrenci paneli aynı toplamı "Sormadan düzelttiğin hatalar" olarak gösteriyor. Paneldeki "Kendin çözdüğün hatalar" sayısı (22) başka bir şeydir: S07’nin kuralı ya da düzeltmeyi açmadığı soruları sayar.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="fixed-without-asking" /></ClientOnly>
<template #takeaway>S07 son haftalarda başlangıca göre daha fazla hatayı tek başına düzeltiyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler ders ilerledikçe daha fazla hatayı kendi başına mı çözüyor?
- **Araştırmacı:** Yardımsız hata çözme, yardım istemeyle birlikte haftalar içinde artıyor mu?

## Ham veri örneği {#raw}

S07’nin sayaçlarıyla birlikte iki oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/fixed-without-asking.json

### Nasıl sayılır {#coding-sessions-errors-resolved-without-asking}

Eklenti açık bir dosyanın hata ve uyarı listesini her değişiklik oturduktan sonra (yaklaşık 1,2 saniye) öncesi ve sonrasıyla karşılaştırır. Kaybolan ve hiç sorulmamış her tanılama 1 ekler.

<FormulaVersion ids="coding_sessions.errors_resolved_without_asking" />

### Sormadan düzeltilen (panel) {#metric-fixed-unaided}

Dönemde başlayan oturumlar üzerinden sayacın toplamı.

<FormulaVersion ids="metric.fixed_unaided" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına ve hafta ya da hafta bloğu başına `fixed_unaided`. Öğrencilerin çalışma süreleri çok farklıysa aktif saatlere bölün.
- **Örnek analiz:** Erken haftalardan geç haftalara değişimi, aktif saat başına düzeltilen hatalar üzerinde eşleştirilmiş t-testiyle sınayın.

**Araştırma soruları**

<RqList ids="coding_sessions.errors_resolved_without_asking,metric.fixed_unaided" />

**Örnek cümle (Yöntem):** "Yardım isteği olmadan kaybolan hata ve uyarılar yardımsız çözülmüş olarak sayılmıştır."

## Bu verinin göstermedikleri {#limits}

Bir hata dosya, satır ve mesajla tanımlanır. Bu yüzden bir hatayı yalnızca başka bir satıra kaydıran düzenleme de düzeltme sayılır. Hiç teklif olarak gösterilmemiş hatalar da sayılır, bu yüzden bu sayaç ile yardım teklifleri aynı temele dayanmaz. Daha fazla hatayla karşılaşmak daha fazla düzeltilen hata da demektir.

## Öğretmen için {#teacher}

::: tip Derste
Yükselen bir çizgi olumlu geri bildirim için iyi bir andır: öğrenciye artık küçük hataların çoğunu tek başına düzelttiğini söyleyin.
:::
