---
title: Yardımsız oturumlar
items:
  - metric.sessions_without_help_pct
  - metric.analytics_sessions_without_help
sample:
  - views/sessions-without-help.json#facts.featuredPct = 25
  - views/sessions-without-help.json#facts.featuredPctNoEmpty = 18.2
  - views/sessions-without-help.json#facts.classPct = 22.1
  - views/sessions-without-help.json#facts.classPctNoEmpty = 18.3
---

# Yardımsız oturumlar

## Yardımsız oturum nedir? {#what}

Öğrencinin hiç soru sormadığı bir oturumdur. Panel bu tür oturumların dönemin tüm oturumları içindeki payını gösterir.

## Bir öğrenciyle örnek {#example}

S07’nin oturumlarının %25 kadarında hiç soru yoktu. Bunlardan biri boş bir oturumdu: VS Code hiçbir etkinlik olmadan açılıp yeniden kapandı. Boş oturumlar olmadan S07’nin değeri %18,2 düzeyine, sınıfın değeri ise %22,1 düzeyinden %18,3 düzeyine iner.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="sessions-without-help" /></ClientOnly>
<template #takeaway>Boş oturumlar oranı yükseltiyor. Onları dışarıda bırakmak yardımsız gerçek çalışmanın daha adil bir resmini veriyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler araca sormadan da çalışıyor mu?
- **Araştırmacı:** Yardımsız oturumların payı haftalar içinde artıyor mu?

## Ham veri örneği {#raw}

S07’nin boş bir oturumu ve normal bir oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/sessions-without-help.json

### Yardımsız oturumlar (panel) {#metric-sessions-without-help-pct}

Dönemin kendisine bağlı hiç soru olmayan oturumları, dönemin tüm oturumlarına bölünür. Boş oturumlar da dahildir.

<FormulaVersion ids="metric.sessions_without_help_pct" />

### Yardımsız oturumlar raporu (SQL) {#metric-analytics-sessions-without-help}

Depodaki salt okunur bir SQL raporu. Öğrenci başına: oturumlar, sorusuz oturumlar, bunların payı, sormadan düzeltilen hatalar ve yardım teklifleri.

<FormulaVersion ids="metric.analytics_sessions_without_help" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `no_help_share`, boş oturumlar (aktif süre 0) olmadan hesaplanır.
- **Örnek analiz:** Dersin ilk yarısından ikinci yarısına değişimi sınayın (eşleştirilmiş Wilcoxon testi).

**Araştırma soruları**

<RqList ids="metric.sessions_without_help_pct" />

**Örnek cümle (Yöntem):** "Hiç yardım isteği olmayan kodlama oturumlarının oranı, editör etkinliği olmayan oturumlar çıkarıldıktan sonra hesaplanmıştır."

## Bu verinin göstermedikleri {#limits}

Panel boş oturumları da sayar ve VS Code’un yeniden yüklenmesi bir tane oluşturur. Yardımsız bir oturum, öğrencinin yalnızca kod okuduğu kısa bir oturum da olabilir. Öğrencinin bir güçlükle karşılaşıp onu tek başına çözdüğünü göstermez.

## Öğretmen için {#teacher}

::: tip Derste
Düşük bir oranı laboratuvarda bir sorun olarak okumayın: çoğu laboratuvar görevi en az bir soruya yol açar. Bunun yerine haftalar içindeki eğilime bakın.
:::
