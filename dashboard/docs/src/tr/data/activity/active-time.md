---
title: Aktif kodlama süresi
items:
  - coding_sessions.active_seconds
  - metric.active_coding_time
sample:
  - views/active-time.json#facts.featuredHours = 11.7
  - views/active-time.json#facts.classMeanHours = 11.4
---

# Aktif kodlama süresi

## Aktif kodlama süresi nedir? {#what}

Aktif kodlama süresi, öğrencinin VS Code’da bir şey yaptığı süredir: yazmak, imleci hareket ettirmek, dosya değiştirmek ya da kaydetmek. İki dakikadan uzun duraklamalar sayılmaz.

## Bir öğrenciyle örnek {#example}

S07’nin sekiz haftada 11,7 saat aktif kodlama süresi oldu, sınıfın ortalaması 11,4 saat. Öğrenci paneli aynı toplamı "Toplam aktif kullanım süresi" olarak gösteriyor. S07 4. ve 8. haftalarda her zamankinden çok daha uzun çalıştı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="active-time" /></ClientOnly>
<template #takeaway>Sınıf ortalaması haftada 80 ile 92 dakika arasında kalıyor. S07’nin 4. ve 8. haftalarda iki tepesi var.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler görevlere ne kadar zaman ayırıyor?
- **Araştırmacı:** Saat başına oranlar için bir temel olarak her öğrenci ortama ne kadar süre maruz kaldı?

## Ham veri örneği {#raw}

S07’nin iki oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/active-time.json

### Süre nasıl ölçülür {#coding-sessions-active-seconds}

Pencere odaktayken her düzenleme, imleç hareketi, dosya değişikliği ya da kaydetme bir kalp atışıdır. Önceki kalp atışına olan aralık iki dakika ya da daha kısaysa eklenir.

<FormulaVersion ids="coding_sessions.active_seconds" />

### Aktif kodlama süresi (panel) {#metric-active-coding-time}

Dönemde başlayan oturumlar üzerinden aktif sürenin toplamı.

<FormulaVersion ids="metric.active_coding_time" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde (kontrol değişkeni olarak)
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `active_hours`. Saat başına soru gibi oranlar için payda olarak kullanın.
- **Örnek analiz:** Öğrencileri karşılaştırmadan önce sayıları aktif saatlere göre normalleştirin ve grup başına aktif saatlerin ortalamasını ve standart sapmasını raporlayın.

**Araştırma soruları**

<RqList ids="coding_sessions.active_seconds,metric.active_coding_time" />

**Örnek cümle (Yöntem):** "Aktif kodlama süresi editör etkinliğinden, olaylar arasındaki en fazla iki dakikalık aralıklar sayılarak tahmin edilmiştir."

## Bu verinin göstermedikleri {#limits}

İmleci iki dakikadan uzun süre oynatmadan kod ya da açıklama okumak sayılmaz. Tarayıcıda ya da kâğıt üzerinde geçen süre görülmez. Boş bir pencerede imleci hareket ettiren bir öğrenci süre ekler, ama bu pek olası değildir.

## Öğretmen için {#teacher}

::: tip Derste
Aktif süreyi laboratuvarın süresiyle karşılaştırın. Büyük bir fark uzun okuma, arkadaşlarla konuşma ya da VS Code dışında çalışma anlamına gelebilir.
:::
