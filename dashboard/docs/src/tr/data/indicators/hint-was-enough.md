---
title: İpucu yeterli oldu
items:
  - metric.hint_enough_pct
sample:
  - views/hint-was-enough.json#facts.featuredQuestions = 37
  - views/hint-was-enough.json#facts.featuredSolvedAlone = 22
  - views/hint-was-enough.json#facts.featuredPct = 59.5
  - views/hint-was-enough.json#facts.classPct = 57.1
---

# İpucu yeterli oldu

## "İpucu yeterli oldu" ne demek? {#what}

Öğrencinin kuralı (L2) ya da düzeltmeyi (L3) açmadığı soruların payıdır. Hatayı sade sözcüklerle ve yerini gösteren ilk ipucu (L0–L1) devam etmek için yeterli oldu.

## Bir öğrenciyle örnek {#example}

S07 37 soru sordu ve bunların 22 tanesinde ilk ipucundan sonra durdu. Bu %59,5 demektir. Sınıfın değeri %57,1 oldu. Bu oranın haftalık sürümü [Bağımsızlık eğilimi](./independence-trend#hint-enough) sayfasındadır.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="hint-was-enough" /></ClientOnly>
<template #takeaway>Öğrencilerin çoğu sorularının %40’tan fazlasında ilk ipucundan sonra durdu. S07 %40–60 grubunda.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrencilerim için küçük bir ipucu ne sıklıkla yeterli oluyor?
- **Araştırmacı:** Bağımsızlığın bir ölçüsü olarak öğrenciler soru başına ne kadar desteğe ihtiyaç duyuyor?

## Ham veri örneği {#raw}

Değer her sorunun ipucu derinliğinden gelir. Paneldeki öğrenci listesinde S07’nin satırı:

`dashboard_students` işlevinin döndürdüğü JSON’un bir parçası:

<<< @/../.vitepress/data/sample/snippets/hint-was-enough.json

### İpucu yeterli oldu (panel) {#metric-hint-enough-pct}

Dönemin L0–L1’de (ipucu derinliği 0 ya da 1) biten soruları, dönemin tüm sorularına bölünür. Tek bir öğrenci için panel aynı kuralı o öğrencinin sorularına uygular.

<FormulaVersion ids="metric.hint_enough_pct" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Tüm çalışma boyunca öğrenci başına `hint_enough_pct` ve eğilim analizleri için hafta başına.
- **Örnek analiz:** Erken ve geç haftaları eşleştirilmiş t-testiyle karşılaştırın ve genel değeri öğrenme kazancıyla ilişkilendirin.

**Araştırma soruları**

<RqList ids="metric.hint_enough_pct" />

**Örnek cümle (Yöntem):** "İlk ipucu düzeyinden sonra biten yardım isteklerinin oranı bağımsızlığın bir göstergesi olarak kullanılmıştır."

## Bu verinin göstermedikleri {#limits}

İlk ipucundan sonra duran bir öğrenci vazgeçmiş, bir arkadaşına sormuş ya da sorunu çözmüş olabilir. Oran sormadan düzeltilen hatalar hakkında bir şey söylemez. L1 düzeyi hiçbir zaman tek başına saklanmaz, bu yüzden L0 ve L1 hep birlikte görünür.

## Öğretmen için {#teacher}

::: tip Derste
Bu oranı "Açıklamadan sonra hata gitti" ile birlikte okuyun. Hataların gittiği yüksek bir oran iyi bir işarettir. Hataların kaldığı yüksek bir oran öğrencilerin erken vazgeçtiği anlamına gelebilir.
:::
