---
title: Dikkat gerektirenler
items:
  - metric.needs_attention
sample:
  - views/needs-attention.json#facts.flagged = 25
  - views/needs-attention.json#facts.cohort = 25
  - views/needs-attention.json#facts.stillStuck = 23
  - views/needs-attention.json#facts.lastWeekFlagged = 16
  - views/needs-attention.json#facts.featuredLastWeek = 0
---

# Dikkat gerektirenler

## "Dikkat gerektirenler" ne demek? {#what}

Panel, seçilen dönemde altı kuraldan en az birini karşılayan öğrencileri nedenleriyle birlikte listeler. Liste, öğretmenin bir laboratuvarda önce kimin yanına gideceğine karar vermesine yardım eder.

## Bir öğrenciyle örnek {#example}

Sekiz haftanın tamamında 25 öğrencinin 25 tanesi listede, S07 de dahil. Örneğin 23 öğrenci en az bir kez "Hâlâ takıldım" yanıtını verdi. Yalnızca sekizinci haftada listede 16 öğrenci var ve S07 bunların arasında değil.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="needs-attention" /></ClientOnly>
<template #takeaway>Uzun bir dönemde neredeyse her öğrenci bir kuralı karşılıyor. Liste bir laboratuvar haftası gibi kısa bir dönem için yararlı.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Şu anda kimin yardımıma ihtiyacı var?
- **Araştırmacı:** Kayıt verisi üzerindeki basit kurallar risk altındaki öğrencileri bulabilir mi ve bunlar test sonuçlarıyla örtüşüyor mu?

## Ham veri örneği {#raw}

Tüm aralık için listeden bir kayıt.

`dashboard_overview` işlevinin döndürdüğü JSON’un bir parçası:

<<< @/../.vitepress/data/sample/snippets/needs-attention.json

### Altı kural {#metric-needs-attention}

Aynı hata 3+ kez (aynı normalleştirilmiş hata hakkında üç ya da daha fazla soru). "Hâlâ takıldım" dedi (en az bir böyle yanıt). 5+ sorunun %70+ kadarında çözümü açtı. Sormadan önce ortalama 8+ düzenleme (en az iki ölçülmüş soru). 2+ "faydalı değil" değerlendirmesi. 7+ gündür etkinlik yok (bu kural dönemi dikkate almaz). Öğrenciler neden sayısına göre sıralanır.

<FormulaVersion ids="metric.needs_attention" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında (sınıfı izlemek için)
- **SPSS için öğrenci başına tek değer:** Olduğu gibi gerekmez. Bir işaret değişkeni istiyorsanız her kuralı ham veriden hafta başına hesaplayın.
- **Örnek analiz:** Bir öğrencinin işaretlendiği hafta sayısının düşük son test puanıyla ilişkili olup olmadığını kontrol edin (Spearman).

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Panel, öğrencileri öğretmen için seçilen dönem üzerinden hesaplanan altı kurala dayalı göstergeyle işaretlemiştir."

## Bu verinin göstermedikleri {#limits}

Kurallar olayları sayar ve dönemin uzunluğuyla birlikte sıkılaşmaz. Bu yüzden birçok hafta boyunca neredeyse herkes işaretlenir. Hiç soru sormayan bir öğrenci yalnızca etkinlik yokluğu kuralıyla işaretlenir. Liste öğretmen için bir hatırlatmadır, bir tanı değildir.

## Öğretmen için {#teacher}

::: tip Derste
Listeyi okumadan önce dönemi o anki laboratuvara ya da haftaya ayarlayın. İki ya da daha fazla nedeni olan öğrencilerle başlayın.
:::
