---
title: Tek başına yapabilir
items:
  - interactions.post_confidence
  - metric.calibration
sample:
  - views/confidence.json#facts.featuredYes = 1
  - views/confidence.json#facts.featuredMaybe = 9
  - views/confidence.json#facts.featuredNo = 4
  - views/confidence.json#facts.yesAgainPct = 51.7
  - views/confidence.json#facts.noAgainPct = 80.6
---

# Tek başına yapabilir

## Özgüven yanıtı nedir? {#what}

Öğrenci her açıklamanın altındaki "Bunu şimdi kendin yapabilir misin?" sorusunu Evet, Belki ya da Henüz değil diye yanıtlayabilir. Panel daha sonra aynı hatanın ya da kavramın geri gelip gelmediğini kontrol eder.

## Bir öğrenciyle örnek {#example}

S07 1 kez Evet, 9 kez Belki ve 4 kez Henüz değil yanıtını verdi. Sınıfta Evet diyen öğrenciler vakaların %51,7 kadarında, Hayır diyenler ise %80,6 kadarında daha sonra aynı hata ya da kavramla geri geldi.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="confidence" /></ClientOnly>
<template #takeaway>Yanıt ne kadar az güvenliyse, aynı hata ya da kavram o kadar sık geri geldi. Yanıtlar gerçek bir bilgi taşıyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler bir açıklamadan sonra benzer sorunları tek başına çözebilecek gibi hissediyor mu?
- **Araştırmacı:** Öğrencilerin özgüveni ayarlı mı, yani sorunun geri gelip gelmeyeceğini yordayabiliyor mu?

## Ham veri örneği {#raw}

S07’nin yanıtlanmış iki sorusu.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/confidence.json

### Özgüven gerçekle örtüşüyor mu? (panel) {#metric-calibration}

Dönemin sorularındaki her yanıt (Evet, Belki, Hayır) için: yanıt sayısı ve bunlardan kaçının ardından, herhangi bir zamanda, aynı öğrencinin aynı normalleştirilmiş hataya ya da aynı kavrama sahip bir sorusunun geldiği.

<FormulaVersion ids="metric.calibration" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `conf_yes_share` = Evet ÷ yanıtlar ve bir ayar değişkeni = ardından tekrar gelmeyen Evet yanıtlarının payı.
- **Örnek analiz:** Yanıtın sonraki bir tekrarı yordayıp yordamadığını karma lojistik regresyonla sınayın (öğrenci rastgele etki olarak).

**Araştırma soruları**

<RqList ids="interactions.post_confidence,metric.calibration" />

**Örnek cümle (Yöntem):** "Ayar, ardından aynı hata ya da kavram hakkında sonraki bir istek gelmeyen güvenli yanıtların oranı olarak değerlendirilmiştir."

## Bu verinin göstermedikleri {#limits}

Kontrolün süre sınırı yoktur. Bu yüzden erken haftaların yanıtlarının bir tekrar için geç haftalarınkinden daha fazla zamanı vardır. Bir tekrar yalnızca öğrenci yeniden sorduğunda görünür, hatayla karşılaşıp tek başına düzelttiğinde görünmez. Farklı yazılan kavramlar eşleşmez.

## Öğretmen için {#teacher}

::: tip Derste
Bir öğrenci sık sık "Henüz değil" diyorsa, aynı fikir üzerine kısa bir alıştırma verin ve eklentiyi kullanmadan denemesini isteyin.
:::
