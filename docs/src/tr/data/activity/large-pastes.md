---
title: Büyük yapıştırma
items:
  - coding_sessions.large_paste_count
  - coding_sessions.large_paste_lines
sample:
  - views/large-pastes.json#facts.featured = 2
  - views/large-pastes.json#facts.withAny = 17
  - views/large-pastes.json#facts.maxStudent = 10
  - views/large-pastes.json#facts.lines = 2538
---

# Büyük yapıştırma

## Büyük yapıştırma nedir? {#what}

Büyük yapıştırma, bir seferde 20 satırdan fazla ekleyen ve en fazla bir satır silen tek bir düzenlemedir. VS Code bir düzenlemenin yapıştırma olup olmadığını söylemez, bu yüzden bu bir tahmindir. Yapıştırılan metin gönderilmez.

## Bir öğrenciyle örnek {#example}

S07 sekiz haftada 2 büyük yapıştırma yaptı. Sınıfta 25 öğrencinin 17 tanesi en az bir tane yaptı ve bir öğrenci 10 tane yaptı. Sınıf bu yolla toplam 2538 satır yapıştırdı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="large-pastes" /></ClientOnly>
<template #takeaway>Öğrencilerin çoğu sekiz haftada yalnızca birkaç kez büyük bir blok yapıştırıyor. Bir öğrenci çok sayıda büyük yapıştırmayla öne çıkıyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Görevlere dışarıdan kod geliyor mu?
- **Araştırmacı:** Kodun ne kadarı yazılmadı ve bu diğer etkinlik ölçülerini etkileyebilir mi?

## Ham veri örneği {#raw}

Örnekten büyük bir yapıştırma içeren bir oturum.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/large-pastes.json

### Büyük yapıştırma nasıl belirlenir {#coding-sessions-large-paste-count}

Tam olarak bir değişiklik içeren, 20 satırdan fazla ekleyen ve en fazla 1 satır silen tek bir düzenleme olayı.

<FormulaVersion ids="coding_sessions.large_paste_count" />

### Büyük yapıştırma satırı {#coding-sessions-large-paste-lines}

Bu düzenlemelerin eklenen satırlarının toplamı.

<FormulaVersion ids="coding_sessions.large_paste_lines" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `large_pastes` ve `paste_share` = büyük yapıştırma satırları ÷ (eklenen satırlar + büyük yapıştırma satırları).
- **Örnek analiz:** Kontrol olarak ya da bir duyarlılık analizi için kullanın: ana analizi yapıştırma payı yüksek öğrenciler olmadan tekrarlayın.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "20 satırdan fazla ekleyen tek düzenlemeler büyük yapıştırma olarak sayılmış ve bir duyarlılık analizinde kullanılmıştır."

## Bu verinin göstermedikleri {#limits}

Yapıştırmanın kaynağı bilinmez: öğrencinin kendi eski kodu, öğretmenden bir şablon ya da internetten kod olabilir. Bir eklentiden gelen kod şablonu da aynı görünebilir. 20 satır ya da daha kısa yapıştırmalar burada sayılmaz.

## Öğretmen için {#teacher}

::: tip Derste
Büyük bir yapıştırmayı başkasından kopyalama olarak görmeyin. Başlangıç kodu veriyorsanız, laboratuvarın başındaki bir yapıştırma beklenen bir durumdur.
:::
