---
title: Sorular nereden başlıyor
items:
  - interactions.trigger_surface
  - metric.surfaces
sample:
  - views/trigger-surface.json#facts.featuredTop = diagnostic_codelens
  - views/trigger-surface.json#facts.topPct = 44.9
---

# Sorular nereden başlıyor

## Sorunun başlangıç noktası nedir? {#what}

Başlangıç noktası, öğrencinin soru sormak için kullandığı düğme, bağlantı ya da kısayoldur. Dokuz değer vardır. Örneğin hatanın üstündeki CodeLens satırı, ampul menüsü, durum çubuğu ya da klavye kısayolu.

## Bir öğrenciyle örnek {#example}

S07 en sık "Hata: CodeLens" yolunu kullandı. Sınıfın geneli de böyle. Her düğme kendi değerini kaydeder. Böylece veri, S07’nin hangi soru sorma yollarını bulup kullandığını gösterir.

## Örnek veride {#visual}

<Figure>
<ClientOnly><SampleVisual view="trigger-surface" /></ClientOnly>
<template #takeaway>Hatanın üstündeki CodeLens en çok kullanılan soru sorma yolu (tüm soruların %44,9 kadarı). Klavye kısayolu nadiren kullanılıyor.</template>
</Figure>

## Ne işe yarar? {#purpose}

- **Öğretmen:** Öğrenciler hangi düğmeleri buluyor ve kullanıyor?
- **Araştırmacı:** Öğrenciler hangi giriş noktalarını kullanıyor ve bir giriş noktasının görünür olması soru sıklığını değiştiriyor mu?

## Ham veri örneği {#raw}

S07’nin başlangıç noktasıyla birlikte iki sorusu.

`interactions` (bazı sütunlar):

<<< @/../.vitepress/data/sample/snippets/trigger-surface.json

### Sorular nereden başlıyor (panel) {#metric-surfaces}

Dönemdeki sorular başlangıç noktasına göre gruplanır. Eksik değer "Kayıtlı değil" olarak gösterilir.

<FormulaVersion ids="metric.surfaces" />

## Araştırmada kullanım {#research}

- **Aşama:** müdahale sırasında ve analizde
- **SPSS için öğrenci başına tek değer:** Her giriş noktası grubu için bir pay, örneğin `share_codelens` = CodeLens soruları ÷ tüm sorular.
- **Örnek analiz:** Giriş noktalarının haftalık dağılımını betimleyin ve sık soran öğrencilerle seyrek soranlar arasında karşılaştırın.

**Araştırma soruları**

<RqList ids="interactions.trigger_surface,metric.surfaces" />

**Örnek cümle (Yöntem):** "Her istek için kullanılan arayüz öğesi (CodeLens, ampul, kenar bağlantısı, durum çubuğu, klavye kısayolu, kenar paneli düğmesi ya da komut paleti) kaydedilmiştir."

## Bu verinin göstermedikleri {#limits}

Bir seçimin kenar bağlantısına yapılan tıklama "Seçim: kısayol" olarak kaydedilir, çünkü bu bağlantı değer göndermez. Kenar paneli düğmesi ve komut paleti soru listesini göstermeden sabit bir soru sorar. Dağılım neyin görünür olduğuna da bağlıdır: editör CodeLens’i bir dosyadaki yalnızca ilk üç hata için gösterir.

## Öğretmen için {#teacher}

::: tip Derste
Seçim özelliklerini neredeyse kimse kullanmıyorsa, Ctrl+Alt+Space kısayolunu (macOS’ta Cmd+Alt+Space) derste bir kez gösterin.
:::
