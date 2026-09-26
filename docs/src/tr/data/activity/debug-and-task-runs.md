---
title: Hata ayıklama ve görev çalıştırmaları
items:
  - coding_sessions.debug_session_count
  - coding_sessions.task_run_count
sample:
  - views/debug-and-task-runs.json#facts.featuredDebug = 24
  - views/debug-and-task-runs.json#facts.featuredTasks = 2
  - views/debug-and-task-runs.json#facts.classDebug = 768
  - views/debug-and-task-runs.json#facts.classTasks = 103
---

# Hata ayıklama ve görev çalıştırmaları

## Hata ayıklama ve görev çalıştırmaları nedir? {#what}

İki sayaç. İlki VS Code’da her hata ayıklama oturumu başladığında artar. Bu, Çalıştır menüsündeki "Hata Ayıklamadan Çalıştır" ile de olur. İkincisi her VS Code görevi başladığında artar. Terminale komut olarak yazılan bir program ikisi de değildir.

## Bir öğrenciyle örnek {#example}

S07 sekiz haftada 24 hata ayıklama çalıştırması ve 2 görev çalıştırması başlattı. En çok hata ayıklama çalıştırması 4. haftadaydı. Sınıfta hata ayıklama çalıştırmaları (768) görev çalıştırmalarından (103) çok daha yaygındı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="debug-and-task-runs" /></ClientOnly>
<template #takeaway>Grafik hata ayıklama çalıştırmalarını gösteriyor. Sınıf haftada yaklaşık dört tane başlatıyor. S07’nin 4. haftada belirgin bir tepesi var.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler hata ayıklayıcıyı kullanıyor mu?
- **Araştırmacı:** Öğrenciler programlarını, eklentinin görebildiği kadarıyla, VS Code’dan ne sıklıkla çalıştırıyor?

## Ham veri örneği {#raw}

S07’nin iki oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/debug-and-task-runs.json

### Hata ayıklama çalıştırması {#coding-sessions-debug-session-count}

VS Code’da başlatılan her hata ayıklama oturumu 1 ekler. Eklenti öğrenci çalışırken sayacı artırır ve her 3 dakikada bir oturum satırına ekler.

<FormulaVersion ids="coding_sessions.debug_session_count" />

### Görev çalıştırması {#coding-sessions-task-run-count}

Başlatılan her VS Code görevi 1 ekler. Görevin sonucu "Kodu çalıştırma" sayfasında kaydedilir.

<FormulaVersion ids="coding_sessions.task_run_count" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `runs_per_hour` = (hata ayıklama + görev çalıştırmaları) ÷ aktif saat.
- **Örnek analiz:** Kaydetmelerin yanında betimleyin. Program çalıştırmalarının tam sayısı olarak kullanmayın.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Editörden başlatılan çalıştırmalar (hata ayıklama oturumları ve görevler) sayılmış, terminale yazılan çalıştırmalar ise gözlenememiştir."

## Bu verinin göstermedikleri {#limits}

Python eklentisinin "Run Python File" düğmesi programı terminalde çalıştırır ve sayılmaz. Bu yüzden sayılar her öğrencinin kodu nasıl çalıştırdığına bağlıdır. Bir hata ayıklama çalıştırması öğrencinin kesme noktası kullandığı anlamına gelmez.

## Öğretmen için {#teacher}

::: tip Derste
Neredeyse hiç kimse hata ayıklayıcıyı kullanmıyorsa, bir laboratuvarda kesme noktalarının kısa bir gösterimi zamana değer olabilir.
:::
