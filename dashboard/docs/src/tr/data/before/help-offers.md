---
title: Yardım teklifi
items:
  - coding_sessions.diagnostics_offered
sample:
  - views/help-offers.json#facts.featuredWeek1 = 7
  - views/help-offers.json#facts.featuredWeek8 = 17
  - views/help-offers.json#facts.featuredTotal = 67
---

# Yardım teklifi

## Yardım teklifi nedir? {#what}

Yardım teklifi, eklentinin yanında "Bu ne anlama geliyor?" gösterdiği bir hata ya da uyarıdır. Sayaç, açık editörde bir tanılama için teklif simgesi ilk kez göründüğünde bir artar. "Öğrenci yardım teklif edildiğinde ne sıklıkla sordu?" sorusunun paydası budur.

## Bir öğrenciyle örnek {#example}

Eklenti birinci haftada S07’ye 7, sekizinci haftada 17 kez yardım teklif etti. Sekiz haftada S07 toplam 67 teklif gördü. Daha fazla teklif daha fazla soru demek değildir: sekizinci haftada S07 bunlardan yalnızca birini sordu.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="help-offers" /></ClientOnly>
<template #takeaway>Teklif sayısı öğrencinin karşılaştığı hataları izler. Bu yüzden haftanın zorluğuyla birlikte artar ve azalır.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrencilerim çalışırken kaç hatayla karşılaştı?
- **Araştırmacı:** Öğrencilerin yardım istediği hataların payı için payda nedir?

## Ham veri örneği {#raw}

S07’nin iki oturumu. Sayaç her üç dakikada bir oturuma eklenir.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/help-offers.json

### Bir teklif nasıl sayılır {#coding-sessions-diagnostics-offered}

Etkin editörde bir hata ya da uyarının yanında teklif simgesi ilk kez çizildiğinde +1, dosya başına en fazla üç tanılama için. Tanılama kaybolup geri gelirse yeniden sayılır.

<FormulaVersion ids="coding_sessions.diagnostics_offered" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `help_offers_total`, değişimi inceliyorsanız hafta ya da hafta bloğu başına da.
- **Örnek analiz:** "Teklif edilince yardım istedi" oranının paydası ve görev zorluğu için bir ortak değişken olarak kullanın.

**Araştırma soruları**

<RqList ids="coding_sessions.diagnostics_offered" />

**Örnek cümle (Yöntem):** "Yardım teklifleri, eklentinin etkin editörde bir hata ya da uyarının yanında yardım bağlantısı gösterdiği her seferde sayılmıştır."

## Bu verinin göstermedikleri {#limits}

Bir dosyanın yalnızca ilk üç tanılaması ve yalnızca etkin editörde teklif alır. Bu yüzden öğrencinin sormadan düzelttiği hatalar tekliflerden daha geniş sayılır ve iki sayaç aynı temele dayanmaz. Sayaç öğrenci kadar görevin zorluğunu da izler.

## Öğretmen için {#teacher}

::: tip Derste
Tüm sınıf için teklif sayısının yüksek olduğu bir hafta, zor bir görevi ya da yeni bir konuyu gösterir. Bir sonraki laboratuvarın başında en sık görülen hatanın kısa bir tekrarını planlayın.
:::
