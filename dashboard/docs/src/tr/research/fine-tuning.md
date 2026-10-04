---
title: İnce ayar verisi
---

# İnce ayar verisi

0025 numaralı geçişten beri modelin yazdığı her yanıt eğitim verisi olarak da tutulur. Bu sayfa neyin tutulduğunu, bir sorunun nasıl eğitim örneklerine dönüştüğünü ve bunların nasıl dışa aktarıldığını açıklar. Bu veri hiçbir zaman herkese açık değildir. Yalnızca panel yöneticileri görebilir ya da dışa aktarabilir.

## Neler tutulur {#kept}

explain sunucu işlevi, yeni üretilen her yanıt için [training_samples](../reference/training-samples) tablosuna bir satır yazar:

- sistem mesajı ve kullanıcı mesajı, modelin aldığı haliyle,
- aynı istek ayrı alanlar olarak: redakte edilmiş kod, odak satırı, tüm tanılar, diller, soru ve gizli öğrenci notları,
- modelin ham yanıtı ve geçtiği denetimler,
- model, örnekleme ayarları ve bir istem sürümü.

Önbellekten gelen yanıtlar tutulmaz, çünkü başka bir istek için yazılmışlardır. Etiketler de saklanmaz. Veri her okunduğunda öğrencinin sonrasında yaptıklarından çıkarılır.

## Üç tür soru {#capture}

| Tür | Nedir | Ne öğretebilir |
|---|---|---|
| `full` | İstek kaydedildi | Yanıtın tamamı ve her ipucu seviyesi |
| `reduced` | İstek kaydedilmeden önce sorulmuş bir hata sorusu | Yalnızca L0 ve L2, hata mesajından |
| `none` | Önbellekten gelen bir yanıt ya da istek kaydedilmeden önce bir seçim hakkında sorulmuş bir soru | Hiçbir şey |

L0 ve L2 hiçbir zaman öğrencinin koduna bağlı değildir, bu yüzden yalnızca hata mesajından yeniden kurulabilir. L1 ve L3 koda işaret eder, bu yüzden isteğin tamamına ihtiyaç duyar.

## Eğitim görünümleri {#views}

- **Yanıtın tamamı** (`sft`): üretimdeki mesajlar ve hedef olarak yanıtın tamamı, çıktı şemasının sırasıyla.
- **Seviye seviye** (`levels`): L0, L1, L2 ve L3 için birer örnek. Kullanıcı mesajı yazılacak seviyeyi belirtir ve öğrencinin o ana kadar gördüğü seviyeleri listeler.
- **İyi ya da kötü örnek** (`kto`): aynı istem ve yanıt bir etiketle birlikte, tercih eğitimi için.

Dışa aktarılan dosyanın her satırı bir JSON nesnesidir (JSONL). Metadata açıksa satırda bir `metadata` alanı da bulunur: soru kimliği, öğrenci takma adı (`group`), öğrenciye göre sabit bir `split` (train, validation ya da test), istem sürümü, model ve tüm etiketler.

## Etiketler {#labels}

| Etiket | Kural |
|---|---|
| Cevabı okudu | En az 5 saniye ekranda kaldı ya da öğrenci koda geri döndü |
| Hata gitti | Eklenti hatanın dosyadan kalktığını bildirdi. "Hayır" ancak bir gün geçtikten sonra |
| 10 dk içinde aynı hata yeniden | Aynı hata 10 dakika içinde yeniden soruldu |
| 7 gün içinde aynı kavram yeniden | Aynı kavram hakkında 7 gün içinde başka bir soru |
| Yeterli olan en düşük seviye | Hata ondan sonra gitti, hızlı bir tekrar ya da geri alma olmadı |
| Örnek: iyi ya da kötü | Faydasız bulunduysa, hâlâ takıldıysa, 10 dakika içinde yeniden sorulduysa ya da düzeltme geri alındıysa kötü. Aksi halde faydalı bulunduysa, çözüldüyse ya da okunan bir yanıttan sonra hata gittiyse iyi |

Etiketler sorudan sonraki 7 gün boyunca değişebilir. Dışa aktarma henüz kesinleşmemiş etiketleri atlayabilir.

## Neler dışarıda kalır {#excluded}

- onay vermemiş öğrencilerin soruları,
- önbellekten gelen yanıtlar,
- modelin bağlamın yetmediğini söylediği yanıtlar,
- L2 ve L3'ü başarısız denetimlerden sonra kaldırılan yanıtlar. Bunların L0 ve L1'i seviye seviye görünümde kalır,
- işe yaramadığı bilinen yanıtlar. İyi ya da kötü görünümünde kötü örnek olarak kalırlar, ama hiçbir zaman taklit edilecek örnek olarak kullanılmazlar.

## Nasıl dışa aktarılır {#export}

Panelde Genel bakış sekmesini açın, ardından Dışa aktar ve "İnce ayar verisi (.jsonl)" seçeneğini seçin. Görünümü seçin ve seçili dönem için dosyayı indirin. Her dışa aktarma etkinlik kaydına yazılır. Önce tek bir soruyu incelemek için soruyu açın ve en alttaki "İnce ayar verisi" bölümünü genişletin.

## Gizlilik {#privacy}

Mesajlar, eklentinin anahtarları, belirteçleri ve e-posta adreslerini kaldırdığı haliyle öğrencinin kodunu içerir. Yorumlardaki ya da metinlerdeki adlar kaldırılmaz. Gizli öğrenci notları kullanıcı mesajının bir parçasıdır. Bir dosya araştırma ekibinin dışına çıkmadan önce metadata alanını kaldırın ve herhangi bir paylaşımdan önce içindeki kodu gözden geçirin.
