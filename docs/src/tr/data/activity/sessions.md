---
title: Oturumlar
items:
  - coding_sessions.started_at
  - coding_sessions.last_seen_at
  - metric.sessions
  - metric.session_length_avg
  - metric.analytics_session_rhythm
sample:
  - views/sessions.json#facts.featuredSessions = 12
  - views/sessions.json#facts.classMeanSessions = 12.8
  - views/sessions.json#facts.avgMinutes = 77.5
  - views/sessions.json#facts.emptySessions = 15
  - views/sessions.json#facts.allSessions = 321
---

# Oturumlar

## Oturum nedir? {#what}

Oturum, `coding_sessions` tablosundaki bir satırdır. Eklenti bu satırı öğrenci giriş yaptığında ya da VS Code, öğrenci zaten giriş yapmışken bir pencere açtığında oluşturur. Sonraki sayfalardaki tüm etkinlik sayaçları bir oturuma aittir.

## Bir öğrenciyle örnek {#example}

S07’nin sekiz haftada 12 oturumu oldu, sınıfın ortalaması 12,8. S07’nin çoğu hafta laboratuvarda bir oturumu vardı. 3. ve 4. haftalarda iki, sekizinci haftada üç oturum oldu. Sınıfta bir oturum ortalama 77,5 dakika sürdü.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="sessions" /></ClientOnly>
<template #takeaway>Öğrencilerin çoğunun haftada bir ya da iki oturumu var. S07’nin 3., 4. ve 8. haftalarda daha fazla oturumu var.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler eklentiyle laboratuvar dışında da çalışıyor mu?
- **Araştırmacı:** Etkinlik sayaçlarının birimi nedir ve her öğrenci ortamı ne kadar kullandı?

## Ham veri örneği {#raw}

S07’nin iki oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/sessions.json

### Oturumlar (panel) {#metric-sessions}

Dönemde başlayan oturum satırlarının sayısı.

<FormulaVersion ids="metric.sessions" />

### Oturum süresi (ortalama, panel) {#metric-session-length-avg}

Dönemin oturumları üzerinden son etkinlik güncellemesi eksi oturum başlangıcının ortalaması, dakika olarak.

<FormulaVersion ids="metric.session_length_avg" />

### Oturum ritmi raporu (SQL) {#metric-analytics-session-rhythm}

Depodaki salt okunur bir SQL raporu. Öğrenci ve hafta başına: oturumlar, ortalama oturum dakikası, ortalama aktif dakika, ortalama mola ve günün bölümüne göre oturumlar. Veritabanının saat dilimini kullanır.

<FormulaVersion ids="metric.analytics_session_rhythm" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde (kontrol değişkeni olarak)
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `n_sessions` ve `mean_session_min`. Boş oturumları (aktif süresi olmayanları) dışarıda bırakın.
- **Örnek analiz:** Öğrencileri ya da grupları karşılaştırırken oturum sayısını maruz kalma ölçüsü olarak kullanın.

**Araştırma soruları**

<RqList ids="metric.sessions" />

**Örnek cümle (Yöntem):** "Kullanım, öğrenci başına kodlama oturumlarının sayısı ve ortalama süresi olarak özetlenmiştir."

## Bu verinin göstermedikleri {#limits}

VS Code’un yeniden yüklenmesi ya da ikinci bir pencere yeni bir oturum başlatır. Bu yüzden oturum bir laboratuvarla aynı şey değildir. Oturumun sonu hiçbir zaman saklanmaz ve süre yalnızca bir alt sınırdır. Hiç etkinlik olmayan oturumlar vardır (örnekte 321 oturumun 15 tanesi).

## Öğretmen için {#teacher}

::: tip Derste
Laboratuvar saatleri dışındaki oturumlar kimin evde çalıştığını gösterir. Çalışma alışkanlıkları üzerine kısa bir konuşma için iyi bir başlangıçtır.
:::
