---
title: Aynı hatayı yeniden sordu
items:
  - interactions.error_signature_normalized
  - interactions.recurring_error_count
  - metric.repeat_errors
sample:
  - views/repeated-error.json#facts.pairWeek1 = 1
  - views/repeated-error.json#facts.pairMessage = "total" is not defined
  - views/repeated-error.json#facts.pairWeek2 = 2
  - views/repeated-error.json#facts.pairNormalized = "x" is not defined
  - views/repeated-error.json#facts.featuredRepeats = 10
  - views/repeated-error.json#facts.featuredQuestions = 37
---

# Aynı hatayı yeniden sordu

## Tekrarlanan hata nedir? {#what}

Sunucu her hata sorusu için aynı öğrencinin daha önceki kaç sorusunun aynı hatayı içerdiğini sayar. "Aynı", aynı normalleştirilmiş mesaj demektir: sayılar ve tırnak içindeki adlar değiştirilir. Böylece yalnızca satır numarası ya da değişken adı farklı olan hatalar eşleşir.

## Bir öğrenciyle örnek {#example}

S07, 1. haftada `"total" is not defined` hatasını sordu. 2. haftada aynı türden mesaj geri geldi ve sunucu önceki soru sayısı olarak 1 kaydetti. İki mesaj da normalleştirmeden sonra `"x" is not defined` olur. Toplamda S07’nin 37 sorusundan 10 tanesi daha önceki bir hatayı tekrarlıyordu.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="repeated-error" /></ClientOnly>
<template #takeaway>Sınıfta tekrarlanan hataların payı ilk haftalarda artıyor, sonra yarıya yakın kalıyor. S07’nin çizgisi sıçrıyor, çünkü S07 haftada az hata sorusu sordu.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Hangi öğrenciler aynı hatayla karşılaşmaya devam ediyor?
- **Araştırmacı:** Bir açıklama kalıcı bir anlamaya yol açıyor mu, yoksa aynı hata geri mi geliyor?

## Ham veri örneği {#raw}

S07’nin aynı normalleştirilmiş mesaja sahip iki sorusu.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/repeated-error.json

### Mesaj nasıl normalleştirilir {#interactions-error-signature-normalized}

Her rakam dizisi # olur, tırnak içindeki her metin "X" olur ve sonuç kırpılıp küçük harfe çevrilir. Açıklamaların önbellek anahtarı da aynı işlevle oluşturulur.

<FormulaVersion ids="interactions.error_signature_normalized" />

### Tekrarlar nasıl sayılır {#interactions-recurring-error-count}

Aynı öğrencinin aynı normalleştirilmiş mesaja sahip önceki sorularının sayısı, soru kaydedilirken sayılır. 0 "ilk kez" demektir. Seçim sorularında değer her zaman 0’dır.

<FormulaVersion ids="interactions.recurring_error_count" />

### Aynı hatayı yeniden sordu (panel) {#metric-repeat-errors}

Dönemdeki tekrar sayısı 0’dan büyük olan sorular.

<FormulaVersion ids="metric.repeat_errors" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `repeat_share` = tekrarlanan hata soruları ÷ hata soruları.
- **Örnek analiz:** Tekrar payını ön testten son teste öğrenme kazancıyla ilişkilendirin (Spearman).

**Araştırma soruları**

<RqList ids="interactions.recurring_error_count,metric.repeat_errors" />

**Örnek cümle (Yöntem):** "Aynı öğrenci aynı normalleştirilmiş hata mesajını daha önce sormuşsa hata tekrarlanan olarak sayılmıştır."

## Bu verinin göstermedikleri {#limits}

Normalleştirme farklı hataları da birleştirebilir: adı ne olursa olsun her "ad tanımlı değil" hatası tek bir hata olur. Sayım yalnızca soruları görür, öğrencinin sormadan karşılaştığı hataları değil. Yapısı gereği zamanla artar. Bu yüzden aynı uzunluktaki dönemleri karşılaştırın.

## Öğretmen için {#teacher}

::: tip Derste
Bir öğrenci aynı hatayı tekrar tekrar soruyorsa, iki dakika yanına oturun ve o hatanın kuralını size geri anlatmasını isteyin.
:::
