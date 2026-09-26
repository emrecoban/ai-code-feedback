---
title: Veri akışı
---

# Veri akışı

Sistemin üç parçası vardır: öğrencinin bilgisayarındaki VS Code eklentisi, AB bölgesindeki bir Supabase projesi ve öğretmenler ile araştırmacılar için panel. Açıklamaları dış bir yapay zekâ sağlayıcısı yazar.

## Diyagram {#diagram}

<DataFlow part="diagram" />

- Eklenti öğrencinin kendi satırlarını doğrudan yazar: hesap, onay yanıtları ve etkinlik sayaçlarıyla birlikte kodlama oturumları.
- Yardım istekleri `explain` sunucu işlevine gider. Kod bilgisayardan çıkmadan önce eklenti anahtarlar, parolalar ve e-posta adresleri gibi olası gizli bilgileri maskeler. Sunucu ardından yapay zekâ sağlayıcısına sorar ve yanıtı saklar.
- Araştırma olayları `log-event` sunucu işlevine gider. Yalnızca süre, sayı ve oran gibi ölçümler taşır, hiçbir zaman kod ya da yazılan metin taşımaz.
- Panel veriyi yalnızca kendi oturum belirtecini denetleyen veritabanı işlevleri aracılığıyla okur. Veri değiştiğinde, tablo adını içeren kısa bir canlı sinyal paneli yeniden yüklemeye yönlendirir.

## Her kategori nerede {#table}

<DataFlow part="table" />
