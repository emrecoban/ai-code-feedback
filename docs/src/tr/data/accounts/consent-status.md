---
title: Onay
items:
  - profiles.consent_status
  - profiles.consent_at
  - consent_log.status
  - consent_log.version
sample:
  - views/consent-status.json#facts.featuredTime = 10:07
  - views/consent-status.json#facts.version = 2026-08-v1
  - views/consent-status.json#facts.granted = 27
  - views/consent-status.json#facts.accounts = 28
  - views/consent-status.json#facts.declined = 1
---

# Onay

## Onay durumu nedir? {#what}

Onay durumu, öğrencinin eklentideki onay bildirimine verdiği yanıttır: bekliyor, verildi ya da reddedildi. Bildirim ilk girişte, ilk sorudan önce açılır. Her yanıt, bildirim metninin sürümüyle birlikte ayrıca bir günlüğe yazılır.

## Bir öğrenciyle örnek {#example}

S07 ilk laboratuvar dersinde saat 10:07’de ilk kez giriş yaptı. Onay bildirimi açıldı ve S07 "Kabul ediyorum" düğmesine tıkladı. Profilde artık "verildi" yazıyor ve günlükte 2026-08-v1 metin sürümüyle bir satır var. S07 bildirimi yanıt vermeden kapatsaydı, durum "bekliyor" olarak kalacak ve bildirim bir sonraki sorudan önce yeniden açılacaktı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="consent-status" /></ClientOnly>
<template #takeaway>Örnekte 28 hesabın 27 tanesi onay verdi, 1 tanesi reddetti.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Hangi öğrenciler onay bildirimini yanıtladı?
- **Araştırmacı:** Hangi hesaplar analize girebilir ve hangi onay metni sürümüyle?

## Ham veri örneği {#raw}

Durum iki tabloda saklanır. Bu satırlar S07’ye aittir.

`profiles` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/consent-status.profiles.json

`consent_log`:

<<< @/../.vitepress/data/sample/snippets/consent-status.consent_log.json

## Araştırmada kullanım {#research}

- **Aşama:** tasarım ve analiz (örneklemin belirlenmesi)
- **SPSS için öğrenci başına tek değer:** `consent` değişkeni 1 = verildi, 2 = reddedildi, 3 = bekliyor olarak kodlanır, `consent_version` metin olarak tutulur.
- **Örnek analiz:** Katılımcı akışında her durumdaki hesap sayısını raporlayın ve yalnızca onay veren hesapları tutun (temizleme kuralı C1).

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Analize yalnızca eklentide onay veren öğrenciler (onay metni sürümü 2026-08-v1) dahil edilmiştir."

## Bu verinin göstermedikleri {#limits}

Durum, bildirime verilen yanıtı kaydeder. Öğrencinin metni okuyup anlayıp anlamadığını göstermez. Çalışmanın imzalı onam formunun yerini de tutmaz. Analizden önce reddeden ve bekleyen hesaplar için hangi verilerin bulunduğunu kontrol edin ve bunları çıkarın (temizleme kuralı C1).

## Öğretmen için {#teacher}

::: tip Derste
Bazı öğrenciler hâlâ "bekliyor" durumundaysa, sınıfa bildirimin bir sonraki sorudan önce yeniden açılacağını ve iki yanıtın da kabul edilebilir olduğunu hatırlatın. Hiçbir öğrenciden seçimini açıklamasını istemeyin.
:::
