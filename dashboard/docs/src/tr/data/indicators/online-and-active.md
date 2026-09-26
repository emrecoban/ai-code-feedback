---
title: Çevrimiçi ve aktif öğrenciler
items:
  - metric.online_now
  - metric.active_students
  - metric.new_students
  - metric.last_active
sample:
  - views/online-and-active.json#facts.active = 25
  - views/online-and-active.json#facts.total = 25
  - views/online-and-active.json#facts.week1 = 24
  - views/online-and-active.json#facts.week8 = 24
---

# Çevrimiçi ve aktif öğrenciler

## "Çevrimiçi" ve "aktif" ne demek? {#what}

Panel dört basit sayı gösterir. Şu an çevrimiçi: son 10 dakikada herhangi bir izi olan öğrenciler. Aktif öğrenciler: dönemde herhangi bir izi olan öğrenciler. Yeni öğrenciler: dönemde oluşturulan hesaplar. Son etkinlik: her öğrencinin en son izi.

## Bir öğrenciyle örnek {#example}

Örnekte 25 öğrencinin 25 tanesi sekiz hafta boyunca aktifti, birinci haftada 24, sekizinci haftada 24. S07 bir laboratuvarda çalışırken eklenti her 3 dakikada bir etkinlik gönderir. Bu yüzden S07 panelde "çevrimiçi" kalır.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="online-and-active" /></ClientOnly>
<template #takeaway>Neredeyse her öğrenci dersin her haftasında aktifti.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Şu anda kim çalışıyor ve kim bir süredir görünmüyor?
- **Araştırmacı:** Kayıp ve eksik veri için bir temel olarak her haftaya kaç öğrenci katıldı?

## Ham veri örneği {#raw}

Paneldeki öğrenci listesinde S07’nin satırı.

`dashboard_students` işlevinin döndürdüğü JSON’un bir parçası:

<<< @/../.vitepress/data/sample/snippets/online-and-active.json

### Şu an çevrimiçi (panel) {#metric-online-now}

Son 10 dakikada bir oturum başlangıcı, bir etkinlik güncellemesi, bir soru ya da bir olayı olan öğrenciler. Dönemi dikkate almaz. 10 dakika, eklentinin 3 dakikalık güncellemesinden uzun kalmalıdır.

<FormulaVersion ids="metric.online_now" />

### Aktif öğrenci (panel) {#metric-active-students}

Dönemde herhangi bir izi olan öğrenciler: bir oturum başlangıcı, bir etkinlik güncellemesi, bir soru ya da bir olay.

<FormulaVersion ids="metric.active_students" />

### Yeni öğrenci (panel) {#metric-new-students}

Dönemde oluşturulan hesaplar.

<FormulaVersion ids="metric.new_students" />

### Son etkinlik (panel) {#metric-last-active}

Öğrencinin oturum başlangıcı, etkinlik güncellemesi, soru zamanı ve olay zamanından en sonuncusu, tüm zamanlar üzerinden.

<FormulaVersion ids="metric.last_active" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde (katılım)
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `weeks_active` (herhangi bir izi olan hafta sayısı).
- **Örnek analiz:** Yöntem bölümünde hafta başına katılımı raporlayın ve ana analizden önce en az aktif hafta sayısına karar verin.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Katılım, müdahalenin her haftasında kaydedilmiş herhangi bir etkinliği olan öğrenci sayısı olarak betimlenmiştir."

## Bu verinin göstermedikleri {#limits}

Boş bir oturum ya da tek bir olay aktif sayılmak için yeterlidir. Panel araştırma olaylarını etkinlik olarak sayar, ama dışa aktarımının günlük sayfası saymaz. Bu yüzden iki sayı farklı olabilir. Aktif olmak çalışmanın miktarı hakkında bir şey söylemez.

## Öğretmen için {#teacher}

::: tip Derste
Bir laboratuvarın başında "Şu an çevrimiçi" kimin giriş yaptığını gösterir. Görünmeyen bir öğrencinin eklentiyle ilgili bir sorunu olabilir.
:::
