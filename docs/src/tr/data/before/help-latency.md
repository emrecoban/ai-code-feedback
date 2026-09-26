---
title: Tekliften sonra bekleme
items:
  - interactions.help_latency_ms
  - metric.median_help_latency
sample:
  - views/help-latency.json#facts.featuredMedianSec = 27
  - views/help-latency.json#facts.classMedianSec = 30
  - views/help-latency.json#facts.withLatency = 653
  - views/help-latency.json#facts.questions = 928
---

# Tekliften sonra bekleme

## Tekliften sonraki bekleme nedir? {#what}

Bekleme, bir hatanın yanında yardım teklifinin göründüğü an ile öğrencinin ona tıkladığı an arasındaki süredir. Öğrencinin sormadan önce hata üzerinde tek başına ne kadar çalıştığını gösterir.

## Bir öğrenciyle örnek {#example}

S07’nin ortanca bekleme süresi 27 saniyeydi. Bu, sınıfın 30 saniyelik ortancasına yakın. S07 çoğu zaman hatayı okudu, bir şey denedi ve yarım dakika sonra sordu.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="help-latency" /></ClientOnly>
<template #takeaway>S07’nin haftalık ortancası sınıf ortancasının çevresinde dolaşıyor. Az sorulu haftalarda büyük sıçramalar görülüyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler sormadan önce kendileri deniyor mu, yoksa hemen mi tıklıyor?
- **Araştırmacı:** Öğrenciler yardım istemeden önce ne kadar direniyor ve bu süre haftalar içinde uzuyor mu?

## Ham veri örneği {#raw}

S07’nin görünür bir tekliften başlayan iki hata sorusu.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/help-latency.json

### Bekleme nasıl ölçülür {#interactions-help-latency-ms}

Tıklama zamanı eksi bu tanılama için teklif simgesinin ilk göründüğü zaman, milisaniye olarak. Görünür bir teklif yoksa boştur (tüm seçim soruları ve bir dosyada üçüncüden sonraki hatalar). Negatif bir değer boş olarak saklanır.

<FormulaVersion ids="interactions.help_latency_ms" />

### Tekliften sonra bekleme (medyan, panel) {#metric-median-help-latency}

Dönemde sorulan soruların boş olmayan bekleme sürelerinin ortancası.

<FormulaVersion ids="metric.median_help_latency" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına saniye cinsinden `median_wait_s`. Ortancayı kullanın, çünkü birkaç çok uzun bekleme (bir mola) ortalamayı bozar.
- **Örnek analiz:** 1.–2. haftalar ile 7.–8. haftaların ortanca beklemesini Wilcoxon işaretli sıralar testiyle karşılaştırın ve değişimi öğrenme kazancıyla ilişkilendirin.

**Araştırma soruları**

<RqList ids="interactions.help_latency_ms,metric.median_help_latency" />

**Örnek cümle (Yöntem):** "Yardım gecikmesi, yardım bağlantısının görünmesi ile öğrencinin isteği arasındaki süre olarak tanımlanmış ve öğrenci başına ortanca ile özetlenmiştir."

## Bu verinin göstermedikleri {#limits}

Uzun bir bekleme çaba anlamına gelebilir, ama bir mola ya da başka bir dosyada çalışma da olabilir. Yalnızca görünür bir tekliften başlayan soruların değeri vardır (örnekte 928 sorunun 653 tanesi). Bu yüzden ölçü yalnızca hata sorularını betimler. Saat eklentide çalıştığı için uyku moduna geçen bir dizüstü bilgisayar süreyi uzatabilir.

## Öğretmen için {#teacher}

::: tip Derste
Bir öğrenci neredeyse her zaman birkaç saniye içinde soruyorsa, basit bir alışkanlık önerin: mesajı iki kez okumak ve tıklamadan önce bir değişiklik denemek.
:::
