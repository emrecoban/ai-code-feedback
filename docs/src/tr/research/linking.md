---
title: Dış ölçme araçlarıyla eşleştirme
---

# Dış ölçme araçlarıyla eşleştirme

Ön test, son test ve TAM anketi eklentinin dışında toplanır. Bu sayfa, analiz dosyasında hiçbir ad bulunmayacak şekilde bunların eklenti verileriyle nasıl birleştirileceğini açıklar.

## Tek anahtar: kullanıcı adı {#key}

Eklenti bir öğrenciyi yalnızca ilk girişte yazılan kullanıcı adıyla tanır. Sistemde öğrenci numarası, ders kodu ya da başka bir giriş yolu yoktur. Yeni ya da yanlış yazılmış bir kullanıcı adı sessizce ikinci bir hesap oluşturur.

- Öğrencilere kullanıcı adı olarak ne kullanmalarının söylendiği: <Todo>henüz belgelenmedi</Todo>
- Anahtar tablo her kullanıcı adını testlere yazılan öğrenci numarasıyla eşleştirir. Supabase’in ve deponun dışında tutulur. <Todo kind="confirm">nerede tutulduğu ve kimin görebildiği</Todo>

## Birleştirme adımları {#steps}

1. Uzun tabloları dışa aktarın: sorular, olaylar ve oturumlar.
2. [Temizleme kurallarını](./cleaning) uygulayın.
3. Öğrenci başına tek satıra indirin (geniş biçim). Her veri sayfası kuralı "SPSS için öğrenci başına tek değer" satırında verir.
4. Anahtar tabloyla her kullanıcı adını öğrenci numarasına eşleyin.
5. Ön test, son test ve TAM puanlarını öğrenci numarasıyla birleştirin.
6. Her öğrenciye bir katılımcı kodu verin (S01, S02 …) ve kullanıcı adını ve öğrenci numarasını analiz dosyasından silin.

## Sentetik grupla çözülmüş örnek {#example}

S07 kullanıcı adı olarak `s07` yazdı. Anahtar tablo `SYN-2030-007` öğrenci numarasını verir. S12 bir kez yanlış bir kullanıcı adı (`s12x`) yazdı. Bu yüzden anahtar tabloda aynı numaralı iki satır var ve C3 kuralı iki hesabı birleştirir.

<LinkingExample part="key" />

Birleştirmeden sonra S07’nin geniş dosyada tek bir satırı olur. Bir bölümü şöyledir:

<LinkingExample part="wide" />

Dosyanın tamamı [indirmeler](./codebook) sayfasındadır.

## Ölçme aracı maddeleri {#instrument-items}

Ön test ve son testin her birinde 0 ya da 1 puanlanan 28 madde vardır (PreQ1–PreQ28 ve PostQ1–PostQ28). TAM anketinde beş yapıda 19 madde vardır (Item1–Item19): algılanan fayda, öznel norm, davranışsal niyet, tutum ve gerçek kullanım.

- Testin içerik alanları: <Todo>henüz belgelenmedi</Todo>
- TAM yapısı başına madde sayısı ve Likert ölçeği: <Todo>henüz belgelenmedi</Todo> Sentetik veri, yer tutucu olarak 5’li ölçeği ve 1–5, 6–8, 9–12, 13–16 ve 17–19 gruplamasını kullanır.

## Ölçme aracı puanları {#instrument-scores}

Test puanı 28 maddenin toplamıdır. Öğrenme kazancı son test puanı eksi ön test puanıdır. Her TAM yapısı maddelerinin ortalamasıdır.

<FormulaVersion ids="external.pre_total,external.post_total,external.gain,external.tam_pu,external.tam_sn,external.tam_bi,external.tam_att,external.tam_au" />
