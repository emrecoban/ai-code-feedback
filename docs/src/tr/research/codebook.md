---
title: Kod kitabı ve indirmeler
---

# Kod kitabı ve indirmeler

Aşağıdaki tüm dosyalar `npm run docs:sample` tarafından envanterden ve sentetik örnekten oluşturulur. Aynı tohum her zaman aynı dosyaları verir. **Veri dosyaları sentetiktir ve gerçek öğrenci verisi içermez.**

<Downloads />

## Kod kitabı {#codebook}

Kod kitabında bu sitedeki her veri öğesi için bir satır vardır. Her öğe için değişken adını, İngilizce, Türkçe ve İspanyolca etiketi, kategoriyi, ham ya da türetilmiş olduğunu, veri türünü, izin verilen değerleri, değer etiketlerini, eksik değeri, kaynak tabloyu ve sütunu, formül sürümünü ve onu açıklayan sayfayı verir. XLSX dosyasının "wide" sayfası geniş dosyanın değişkenlerini ve her birinin geldiği öğeleri listeler.

## Eksik değerler {#missing}

- Uzun dosyalarda boş bir hücre, veritabanındaki değerin boş (NULL) olduğu anlamına gelir. Doğru ve yanlış 1 ve 0 olarak yazılır.
- Geniş dosyada -99 uygulanamaz, -98 ölçülmedi, -97 yanıtlanmadı anlamına gelir (C8 temizleme kuralı).

## SPSS’te kullanım {#spss}

1. `.sps` dosyasını `synthetic_students_wide.csv` ile aynı klasöre koyun ya da `GET DATA` komutundaki yolu değiştirin.
2. Hiçbir veri seti açık değilken `SET UNICODE=ON.` komutunu çalıştırın.
3. Etiketler için istediğiniz dildeki sözdizimi dosyasını çalıştırın.
