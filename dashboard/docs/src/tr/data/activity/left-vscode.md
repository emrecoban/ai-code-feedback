---
title: VS Code’dan ayrıldı
items:
  - coding_sessions.focus_loss_count
  - coding_sessions.unfocused_seconds
  - metric.habits_totals
sample:
  - views/left-vscode.json#facts.featuredLosses = 55
  - views/left-vscode.json#facts.featuredAwayMin = 57
  - views/left-vscode.json#facts.classMeanLosses = 57
---

# VS Code’dan ayrıldı

## "VS Code’dan ayrıldı" ne demek? {#what}

Sayaç, VS Code penceresi her odağı kaybettiğinde artar, örneğin öğrenci tarayıcıya tıkladığında. İkinci bir sayı, öğrenci geri dönene kadar geçen süreyi toplar. Her ayrılık için en fazla on dakika sayılır.

## Bir öğrenciyle örnek {#example}

S07 sekiz haftada 55 kez VS Code’dan ayrıldı ve toplam 57 dakika dışarıda kaldı. Sınıf ortalaması 57 kezdi. S07 en sık sekizinci haftada VS Code’dan ayrıldı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="left-vscode" /></ClientOnly>
<template #takeaway>Sınıf haftada yaklaşık yedi kez VS Code’dan ayrılıyor. S07 sınıfa yakın, sekizinci haftada bir tepesi var.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler editörün dışında, örneğin tarayıcıda yardım arıyor mu?
- **Araştırmacı:** Öğrenciler eklentinin göremediği başka kaynaklara ne sıklıkla geçiyor?

## Ham veri örneği {#raw}

S07’nin iki oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/left-vscode.json

### Dışarıda geçen süre nasıl ölçülür {#coding-sessions-unfocused-seconds}

Tamamlanan her ayrılığın süresi (pencere odağı kaybeder, sonra geri alır), her ayrılık için en fazla on dakika. Hiç bitmeyen bir ayrılık, örneğin VS Code kapandığı için, sayılmaz.

<FormulaVersion ids="coding_sessions.unfocused_seconds" />

### Çalışma alışkanlıkları (panel) {#metric-habits-totals}

Panel bu sayacı ve sonraki sayfalardaki diğer alışkanlık sayaçlarını dönemin oturumları üzerinden toplar.

<FormulaVersion ids="metric.habits_totals" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `focus_losses_per_hour` = ayrılma sayısı ÷ aktif saat ve `away_min`.
- **Örnek analiz:** VS Code’dan ayrılmayı soru sayısıyla ilişkilendirin: daha az soran öğrenciler başka yerde yardım arıyor olabilir (Spearman).

**Araştırma soruları**

<RqList ids="coding_sessions.focus_loss_count" />

**Örnek cümle (Yöntem):** "Editör penceresinden başka yere geçişler, eklenti dışında aranan yardımın dolaylı bir göstergesi olarak sayılmıştır."

## Bu verinin göstermedikleri {#limits}

Eklenti öğrencinin nereye gittiğini bilmez: görev kâğıdı, bir arama motoru, başka bir yapay zekâ aracı ya da bir sohbet olabilir. VS Code içindeki terminal paneline tıklamak sayılmaz. Dışarıda geçen süre sınırlıdır, bu yüzden uzun molalar kısa görünür.

## Öğretmen için {#teacher}

::: tip Derste
Görev kâğıdını PDF olarak veriyorsanız öğrenciler onu okumak için VS Code’dan ayrılmak zorundadır. Görevi kod dosyasına yorum olarak koymak onları tek bir yerde tutar.
:::
