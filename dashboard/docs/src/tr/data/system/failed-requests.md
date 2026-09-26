---
title: Başarısız istekler
items:
  - event.request_failed
  - event.request_failed.kind
  - event.request_failed.code
  - event.request_failed.retryAfterSeconds
  - metric.failed_requests
  - metric.failure_rate
sample:
  - views/failed-requests.json#facts.failures = 30
  - views/failed-requests.json#facts.questions = 928
  - views/failed-requests.json#facts.ratePct = 3.1
---

# Başarısız istekler

## Başarısız istek nedir? {#what}

Bu olay, öğrenci yardım istediği halde yanıt gelmediğinde kaydedilir: 25 saniye içinde yanıt yok, sunucudan bir hata ya da başka bir hata. Öğrenci bir hata mesajı görür ve soru saklanmaz.

## Bir öğrenciyle örnek {#example}

Örnekte yanıtlanan 928 sorunun yanında 30 istek başarısız oldu. Başarısızlık oranı %3,1. Başarısızlıkların çoğu yapay zekâ hizmetinin hatalarıydı. İki istek kullanım sınırına takıldı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="failed-requests" /></ClientOnly>
<template #takeaway>Başarısızlıklar seyrek. Çoğu öğrencilerden değil, yapay zekâ hizmetinden kaynaklanıyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrencilerin ihtiyacı olduğunda araç başarısız oldu mu?
- **Araştırmacı:** Hizmet ne kadar güvenilirdi ve soru verisinde eksik istekler var mı?

## Ham veri örneği {#raw}

Örnekten bir olay.

`events`:

<<< @/../.vitepress/data/sample/snippets/failed-requests.json

### Tür ve kod {#event-request-failed-kind}

Tür `timeout` (25 saniye içinde yanıt yok), `backend` (sunucu bir hata döndürdü) ya da `unknown` olur. `backend` için sunucunun kodu saklanır, örneğin `provider_error` ya da `rate_limited`. `rate_limited` için olay sınırın sıfırlanmasına kalan saniyeleri de saklar.

<FormulaVersion ids="event.request_failed.kind" />

### Başarısız istekler (panel) {#metric-failed-requests}

Dönemin başarısızlık olayları, tür ve koda göre gruplanır.

<FormulaVersion ids="metric.failed_requests" />

### Hata oranı (panel) {#metric-failure-rate}

Başarısızlıklar, dönemdeki soruların ve başarısızlıkların toplamına bölünür.

<FormulaVersion ids="metric.failure_rate" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde (veri niteliği ve Yöntem bölümü)
- **SPSS için öğrenci başına tek değer:** Hiçbir öğrencinin diğerlerinden çok daha fazla etkilenmediğini kontrol etmek için öğrenci başına `failed_requests`.
- **Örnek analiz:** Başarısızlık oranını Yöntem bölümünde raporlayın. Yardım isteme girişimlerini sayarken başarısız istekleri sorulara ekleyin.

**Araştırma soruları**

<RqList ids="event.request_failed" />

**Örnek cümle (Yöntem):** "Başarısız yardım istekleri ayrıca kaydedilmiş ve yardım isteme girişimi olarak sayılmıştır."

## Bu verinin göstermedikleri {#limits}

Olayı eklenti gönderir, bu yüzden ağ bağlantısı olmadan yaşanan bir başarısızlık hiç ulaşmayabilir. İki kez deneyen bir öğrenci iki olay oluşturur. Olay, öğrencinin hangi hata ya da soru hakkında sorduğunu söylemez.

## Öğretmen için {#teacher}

::: tip Derste
Bir laboratuvar sırasında birçok istek başarısız oluyorsa öğrencilere bir dakika bekleyip yeniden denemelerini söyleyin. Hata mesajı kodlarının yanlış olduğu anlamına gelmez.
:::
