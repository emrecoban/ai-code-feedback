---
title: Hatasız hale getirilen dosyalar
items:
  - event.file_cleared
  - event.file_cleared.fileName
  - event.file_cleared.msWithErrors
  - event.file_cleared.editsWhileErrors
  - event.file_cleared.diagnosticsSeen
  - event.file_cleared.diagnosticsAsked
  - metric.files_cleared_list
sample:
  - views/files-worked-through.json#facts.exFile = hw8.py
  - views/files-worked-through.json#facts.exMin = 26.1
  - views/files-worked-through.json#facts.exEdits = 14
  - views/files-worked-through.json#facts.exSeen = 3
  - views/files-worked-through.json#facts.exAsked = 1
  - views/files-worked-through.json#facts.featuredEpisodes = 26
  - views/files-worked-through.json#facts.medianMin = 6.6
---

# Hatasız hale getirilen dosyalar

## Hatasız hale getirilen dosya nedir? {#what}

Bu olay, hata ya da uyarısı olan bir dosyada hiçbiri kalmadığında kaydedilir. Tüm süreci özetler: dosyanın ne kadar süre sorunlu kaldığı, kaç düzenleme gerektiği, kaç sorunun ortaya çıktığı ve öğrencinin bunlardan kaçını sorduğu.

## Bir öğrenciyle örnek {#example}

S07’nin en son süreci hw8.py dosyasındaydı. Dosya 26,1 dakika boyunca hatalıydı. S07 14 düzenleme yaptı, 3 sorun gördü ve bunların 1 tanesini sordu. Sekiz haftada S07 26 kez bir dosyayı hatasız hale getirdi.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="files-worked-through" /></ClientOnly>
<template #takeaway>Burada küçük bir tablo en iyisi. Sınıfta bir dosyanın hatasız hale gelmesi ortanca 6,6 dakika sürdü.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrencilerimin bir dosyayı çalışır hale getirmesi ne kadar emek gerektiriyor?
- **Araştırmacı:** Bir dosyanın tüm onarımı neye mal oluyor ve sorunlarının ne kadarı yardım gerektirdi?

## Ham veri örneği {#raw}

S07’nin en son süreci.

`events`:

<<< @/../.vitepress/data/sample/snippets/files-worked-through.json

### Süreç nasıl ölçülür {#event-file-cleared-mswitherrors}

Süreç, bir dosyada ilk sorun ortaya çıktığında başlar ve sonuncusu gittiğinde biter. Hatalı geçen süre bu ikisi arasındaki farktır, milisaniye olarak. Düzenlemeler aradaki değişiklik olaylarıdır.

<FormulaVersion ids="event.file_cleared.msWithErrors" />

### Düzenleme {#event-file-cleared-editswhileerrors}

Süreç boyunca dosyadaki düzenleme olayları.

<FormulaVersion ids="event.file_cleared.editsWhileErrors" />

### Görülen hata {#event-file-cleared-diagnosticsseen}

Sürecin başında var olan sorunlar artı daha sonra ortaya çıkanlar.

<FormulaVersion ids="event.file_cleared.diagnosticsSeen" />

### Hatasız hale getirilen dosyalar (panel) {#metric-files-cleared-list}

Dönemin değerleriyle birlikte en son 25 süreci.

<FormulaVersion ids="metric.files_cleared_list" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Tüm süreçler üzerinden öğrenci başına `median_episode_min` ve `asked_share` = sorulan ÷ görülen.
- **Örnek analiz:** Artan akıcılığın bir ölçüsü olarak 1.–4. ve 5.–8. haftaların ortanca süreç süresini karşılaştırın (Wilcoxon).

**Araştırma soruları**

<RqList ids="event.file_cleared.msWithErrors" />

**Örnek cümle (Yöntem):** "Bir onarım süreci, bir dosyadaki ilk tanılamadan dosyada hiç tanılama kalmayana kadar geçen süre olarak tanımlanmıştır."

## Bu verinin göstermedikleri {#limits}

Dosya adı saklanır ve bir dosya adı kişisel bilgi içerebilir. Bir süreç, sorunlar kod silindiği için kaybolduğunda da biter. Hatasız hale gelmeden kapatılan dosyalar olay üretmez.

## Öğretmen için {#teacher}

::: tip Derste
Bir laboratuvarda dosyalar uzun süre hatalı kalıyorsa, sınıfı bir kez durdurun ve bir strateji gösterin: dosyanın en üstündeki ilk hatayı düzeltin, sonra yeniden çalıştırın.
:::
