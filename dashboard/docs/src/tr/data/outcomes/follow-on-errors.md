---
title: Düzeltmenin hemen ardından yeni hata
items:
  - coding_sessions.follow_on_error_count
sample:
  - views/follow-on-errors.json#facts.featuredTotal = 8
  - views/follow-on-errors.json#facts.classTotal = 194
  - views/follow-on-errors.json#facts.classFixed = 1255
---

# Düzeltmenin hemen ardından yeni hata

## Düzeltmenin hemen ardından gelen yeni hata nedir? {#what}

Bir dosyada başka bir hata düzeltildiği anda ya da ondan sonraki 60 saniye içinde ortaya çıkan bir hata ya da uyarıdır. Sorunu çözen bir değişikliği, sorunu yalnızca başka yere taşıyan değişiklikten ayırır.

## Bir öğrenciyle örnek {#example}

S07 sekiz haftada 8 kez bir düzeltmenin hemen ardından yeni bir hatayla karşılaştı. Bunların üçü sekizinci haftadaydı. Tüm sınıfta sormadan düzeltilen 1255 hatanın yanında 194 ardışık hata sayıldı.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="follow-on-errors" /></ClientOnly>
<template #takeaway>Ardışık hatalar haftada az, öğrenci başına yaklaşık bir tane. S07’de sekizinci haftada bir tepe var.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Düzeltmeler öğrencilerim için yeni sorunlar yaratıyor mu?
- **Araştırmacı:** Bir değişiklik ne sıklıkla sorunu çözmek yerine yalnızca taşıyor?

## Ham veri örneği {#raw}

S07’nin ardışık hatalar içeren iki oturumu.

`coding_sessions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/follow-on-errors.json

### Nasıl sayılır {#coding-sessions-follow-on-error-count}

Bir dosyada yeni ortaya çıkan her tanılama, aynı denetimde orada başka bir tanılama çözüldüyse ya da o dosyadaki son çözülme en fazla 60 saniye önceyse 1 ekler.

<FormulaVersion ids="coding_sessions.follow_on_error_count" />

## Araştırmada kullanım {#research}

- **Aşama:** analizde
- **SPSS için öğrenci başına tek değer:** Öğrenci başına `follow_on_rate` = ardışık hatalar ÷ düzeltilen hatalar (sorarak ve sormadan).
- **Örnek analiz:** Daha kesin değişikliklerin bir işareti olarak oranı erken ve geç haftalar arasında karşılaştırın.

**Araştırma soruları**

<RqList ids="coding_sessions.follow_on_error_count" />

**Örnek cümle (Yöntem):** "Aynı dosyada bir çözülmeden sonraki 60 saniye içinde ortaya çıkan tanılamalar ardışık hata olarak sayılmıştır."

## Bu verinin göstermedikleri {#limits}

Bir düzenleme bir hatayı başka bir satıra kaydırdığında kod bir düzeltme ve yeni bir hata görür. Bu yüzden sayı olması gerekenden yüksek olabilir. Yeni bir hata ilgisiz de olabilir, örneğin yarım yazılmış bir satır. 60 saniyelik pencere sabit bir seçimdir.

## Öğretmen için {#teacher}

::: tip Derste
Bir öğrenci bir düzeltmenin hemen ardından sık sık yeni bir hata alıyorsa, birçok satırı birden değiştirmek yerine her küçük değişiklikten sonra programı çalıştırmayı gösterin.
:::
