---
title: Kaydetme
items:
  - coding_sessions.save_count
sample:
  - views/saves.json#facts.featured = 172
  - views/saves.json#facts.classMean = 178
---

# Kaydetme

## Kaydetmeler nedir? {#what}

Sayaç, VS Code’da bir dosya her kaydedildiğinde bir artar. Yeni başlayanlar çoğu zaman programı çalıştırmadan hemen önce kaydeder. Bu yüzden kaydetmeler "dene ve gör" döngüsünün kaba bir işaretidir.

## Bir öğrenciyle örnek {#example}

S07 sekiz haftada 172 kez dosya kaydetti, sınıf ortalaması 178 kez. S07 en sık 4. ve 8. haftalarda kaydetti.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="saves" /></ClientOnly>
<template #takeaway>Sınıf haftada yaklaşık 21 ile 23 kez kaydediyor. S07 aktif sürede olduğu gibi aynı tepeleri izliyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler değişikliklerini ne sıklıkla deniyor?
- **Araştırmacı:** Düzenle ve çalıştır döngüsü ne kadar kısa?

## Ham veri örneği {#raw}

S07’nin iki oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/saves.json

### Nasıl sayılır {#coding-sessions-save-count}

Bir belgenin her kaydetme olayı 1 ekler. Eklenti öğrenci çalışırken sayacı artırır ve her 3 dakikada bir oturum satırına ekler.

<FormulaVersion ids="coding_sessions.save_count" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `saves_per_hour` = kaydetmeler ÷ aktif saat.
- **Örnek analiz:** Betimleyin ve yorumlamadan önce laboratuvarda otomatik kaydetmenin kapalı olduğunu kontrol edin.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Kaydetme olayları, düzenle ve dene döngülerinin sıklığı için dolaylı bir ölçü olarak sayılmıştır."

## Bu verinin göstermedikleri {#limits}

Otomatik kaydetme açıkken VS Code kendiliğinden kaydeder ve sayı anlamını yitirir. Bazı öğrenciler alışkanlıkla her satırdan sonra kaydeder. Bir kaydetme, programın çalıştırıldığını göstermez.

## Öğretmen için {#teacher}

::: tip Derste
Çok seyrek kaydeden bir öğrenci büyük kod bloklarını bir seferde çalıştırıyor olabilir. Küçük adımları teşvik edin: değiştir, kaydet, çalıştır.
:::
