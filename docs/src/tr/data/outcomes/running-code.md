---
title: Kodu çalıştırma
items:
  - event.run_finished
  - event.run_finished.exitCode
  - event.run_finished.success
  - metric.runs
sample:
  - views/running-code.json#facts.featuredRuns = 2
  - views/running-code.json#facts.runs = 103
  - views/running-code.json#facts.debugRuns = 768
---

# Kodu çalıştırma

## Kodu çalıştırma hakkında ne kaydedilir? {#what}

Bir VS Code görevi bittiğinde eklenti çıkış kodunu ve hatasız bitip bitmediğini kaydeder. Terminale komut yazılarak ya da alışılmış "Run Python File" düğmesiyle başlatılan bir program görev değildir ve görülmez.

## Bir öğrenciyle örnek {#example}

S07 sekiz haftada 2 kez görev çalıştırdı. Çoğu öğrenci gibi S07 de programları görev olaylarının yakalamadığı Çalıştır düğmesiyle ya da hata ayıklayıcıyla çalıştırdı. Sınıfta 768 hata ayıklama çalıştırmasının yanında 103 görev çalıştırması kaydedildi.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="running-code" /></ClientOnly>
<template #takeaway>Görev çalıştırmaları hata ayıklama çalıştırmalarının yanında seyrek. Görev çalıştırmalarının yaklaşık onda altısı hatasız bitiyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler bir değişiklikten sonra programlarını deniyor mu?
- **Araştırmacı:** Bir açıklamadan sonraki çalıştırma daha sık mı hatasız bitiyor?

## Ham veri örneği {#raw}

Örnekten bir olay.

`events`:

<<< @/../.vitepress/data/sample/snippets/running-code.json

### Hatasız bitti {#event-run-finished-success}

Görevin çıkış kodu 0 olduğunda doğru.

<FormulaVersion ids="event.run_finished.success" />

### Kodu çalıştırma (panel) {#metric-runs}

Dönemin çalıştırmaları, hatasız çalıştırmalar, aynı oturumda bir sorudan sonraki 15 dakika içindeki çalıştırmalar ve bunlardan kaçının hatasız bittiği.

<FormulaVersion ids="metric.runs" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde (yalnızca ders VS Code görevlerini kullanıyorsa)
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `task_runs` ve `task_success_share`.
- **Örnek analiz:** Yalnızca betimleyin. Ders bütün programları görev olarak çalıştırmıyorsa ölçü çıkarım için fazla eksiktir.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Program çalıştırmaları yalnızca VS Code görevi olarak başlatıldığında gözlenebildiği için betimsel olarak raporlanmıştır."

## Bu verinin göstermedikleri {#limits}

Yeni başlayanların programlarının çoğu görev olarak başlatılmaz. Bu yüzden bu veri çalıştırmaların çoğunu kaçırır. Paneldeki "Terminaldeki çalıştırmalar" alt başlığı gözlenenden fazlasını söyler. 0 çıkış kodu yalnızca programın çökmediği anlamına gelir, çıktısının doğru olduğu anlamına gelmez.

## Öğretmen için {#teacher}

::: tip Derste
Az sayıda çalıştırmayı deneme eksikliği olarak okumayın. Öğrencilere programlarını nasıl çalıştırdıklarını doğrudan sorun.
:::
