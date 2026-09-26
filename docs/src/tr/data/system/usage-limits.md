---
title: Kullanım sınırları
items:
  - usage_counters.requests
  - usage_counters.total_tokens
  - rate_limits.hourly
  - rate_limits.daily
  - metric.quota_today
sample:
  - views/usage-limits.json#facts.defaultHourly = 40
  - views/usage-limits.json#facts.defaultDaily = 200
  - views/usage-limits.json#facts.maxPerHour = 9
  - views/usage-limits.json#facts.hours = 368
---

# Kullanım sınırları

## Kullanım sınırları nedir? {#what}

Her öğrenci saatte ve günde sınırlı sayıda soru sorabilir. Sunucu her öğrencinin üretilen yanıtlarını saat başına sayar. Bir yönetici iki sınırı panelde değiştirebilir.

## Bir öğrenciyle örnek {#example}

Örnekte sınırlar varsayılan değerlerdeydi: saatte 40, günde 200 istek. Hiçbir öğrenci bunlara yaklaşmadı: bir saatteki en yüksek değer 9 istekti. Sayaçların 368 satırı var, en az bir yanıtın olduğu her öğrenci ve saat için bir satır.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="usage-limits" /></ClientOnly>
<template #takeaway>Öğrenci-saatlerin çoğunda yalnızca bir ya da iki yanıt var, sınırın çok altında.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Sınır bir laboratuvar için yeterince yüksek mi ve çok sık soran biri var mı?
- **Araştırmacı:** Sınırlar çalışma sırasında yardım istemeyi kısıtladı mı?

## Ham veri örneği {#raw}

S07’nin iki saati.

`usage_counters`:

<<< @/../.vitepress/data/sample/snippets/usage-limits.json

### İstekler nasıl sayılır {#usage-counters-requests}

UTC saatindeki her üretilen yanıt için bir artar. Önbellekten gelen yanıtlar sayılmaz.

<FormulaVersion ids="usage_counters.requests" />

### Sınırlar {#rate-limits-daily}

Bir yönetici saatlik ve günlük sınırı panelde belirler. O zamana kadar sunucu kendi varsayılan değerlerini (40 ve 200) kullanır. Gün 00.00 UTC’de başlar.

<FormulaVersion ids="rate_limits.daily" />

### Bugünkü kullanım sınırları (panel) {#metric-quota-today}

En aktif on öğrenci için: o anki UTC saatindeki istekler ve 00.00 UTC’den bu yana istekler ve tokenler.

<FormulaVersion ids="metric.quota_today" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde (veri niteliği ve Yöntem bölümü)
- **SPSS için öğrenci başına tek değer:** Hiç kimsenin sık engellenmediğini göstermek için öğrenci başına `max_requests_hour`.
- **Örnek analiz:** Sınırları Yöntem bölümünde `rate_limited` başarısızlıklarının sayısıyla birlikte raporlayın.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Her öğrenci saatte ve günde belirli sayıda yapay zekâ yanıtı isteyebilmiş ve sınırlara nadiren ulaşılmıştır."

## Bu verinin göstermedikleri {#limits}

Sayaçlar UTC saatlerini ve günlerini kullanır. Bunlar yerel laboratuvar saatleriyle örtüşmez. Yalnızca üretilen yanıtlar sayılır, bu yüzden başarısız istekler ve önbellekten gelen yanıtlar sayaçlarda yoktur. Tablo yalnızca güncel sınırları tutar. Önceki değerler panelin denetim kaydındadır.

## Öğretmen için {#teacher}

::: tip Derste
Bir öğrenci bir laboratuvarda sınıra ulaşırsa onunla konuşun. Çok sık sorular, ipuçlarını okumadan deneme yanılma yapıldığının bir işareti olabilir.
:::
