---
title: Eklenen ve silinen satırlar
items:
  - coding_sessions.lines_written
  - coding_sessions.lines_deleted
sample:
  - views/lines.json#facts.featuredWritten = 791
  - views/lines.json#facts.featuredDeleted = 281
  - views/lines.json#facts.classMeanWritten = 712
---

# Eklenen ve silinen satırlar

## Eklenen ve silinen satırlar nedir? {#what}

Eklenti bir dosyadaki her düzenlemede yeni satırları ve silinen satırları sayar. Geri alma, yineleme ve çok büyük düzenlemeler (bir seferde 20 satırdan fazla) dışarıda kalır. Kodun kendisi gönderilmez.

## Bir öğrenciyle örnek {#example}

S07 sekiz haftada 791 satır ekledi ve 281 satır sildi. Sınıf öğrenci başına ortalama 712 satır ekledi. S07 en çok satırı 4. ve 8. haftalarda ekledi. Bunlar aktif sürenin en uzun olduğu haftalar.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="lines" /></ClientOnly>
<template #takeaway>Sınıf her hafta öğrenci başına yaklaşık 90 satır ekliyor. S07 sınıfa yakın, 4. ve 8. haftalarda tepeleri var.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler bir laboratuvarda ne kadar kod yazıyor?
- **Araştırmacı:** Ne kadar üretim var ve bunun ne kadarı yeniden yazma?

## Ham veri örneği {#raw}

S07’nin iki oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/lines.json

### Eklenen satırlar nasıl sayılır {#coding-sessions-lines-written}

Diskteki dosyaların düzenlemelerindeki yeni satır sonlarının toplamı. Geri alma ve yineleme dışarıda kalır ve 20 satırdan fazlasını ekleyen ya da silen bir düzenleme yok sayılır.

<FormulaVersion ids="coding_sessions.lines_written" />

### Silinen satırlar nasıl sayılır {#coding-sessions-lines-deleted}

Aynı kurallarla, aynı düzenlemelerdeki silinen satır aralıklarının toplamı.

<FormulaVersion ids="coding_sessions.lines_deleted" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde (kontrol değişkeni olarak)
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `lines_added` ve `lines_deleted` ile `rewrite_ratio` = silinen ÷ eklenen.
- **Örnek analiz:** Aktif saat başına eklenen satırları kaba bir üretkenlik kontrolü olarak kullanın.

**Araştırma soruları**

Henüz hiçbir taslak araştırma sorusu bu veriyi değişken olarak kullanmıyor.

**Örnek cümle (Yöntem):** "Kod üretimi, geri alma, yineleme ve 20 satırdan büyük düzenlemeler hariç, eklenen ve silinen satır sayısıyla yaklaşık olarak ölçülmüştür."

## Bu verinin göstermedikleri {#limits}

Bir satır bir satır sonudur, bu yüzden uzun bir satır ile boş bir satır aynı sayılır. 20 satıra kadar yapıştırılan kod yazılmış sayılır. Sayılar kodun niteliği hakkında bir şey söylemez.

## Öğretmen için {#teacher}

::: tip Derste
Çok sayıda silinen satır kötü bir işaret değildir. Çoğu zaman öğrencinin denediğini, kontrol ettiğini ve yeniden yazdığını gösterir.
:::
