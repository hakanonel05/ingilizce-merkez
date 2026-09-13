# Kitaptan çıkarılan okuma verisi

`apps/reading/src/data/passages.ts` bu klasörden üretiliyor. Oradaki dosya
elle düzenlenmemeli; düzeltme gerekiyorsa buradaki `pNNN.json` düzeltilip
dosya yeniden üretilmeli.

Kaynak: **100 Reading** (Akın Dil Eğitim). Metin, sorular, cevaplar ve —
elde olan parçalarda — Türkçe sözlük kitabın kendisinden alındı; üretilmedi.

## Dosyalar

| dosya | ne |
|---|---|
| `pNNN.json` | parçanın metni, soruları, cevapları, sözlüğü |
| `cevap-anahtari.json` | kitabın cevap anahtarı (sayfa görüntüleri okunarak) |
| `alistirma2.json` | 59-90 arası parçaların boşluk doldurma cevapları |

## `guven` alanı — her parçada aynı kalite yok

    "goruntuden-birebir"   59 parça. Sayfa görüntüsü okunup birebir yazıldı.
    "ocr-uzlastirma"       41 parça. İki bağımsız OCR çıkarımı (PDF metin
                           katmanı + Word dökümü) kelime kelime hizalanıp
                           uzlaştırıldı. GÖZLE DOĞRULANMADI.

İkinci gruptaki metinlerde OCR kaynaklı harf hataları kalmış olabilir.
`_incele` alanı taşıyan 20 parçada OCR, boşluk doldurma seçeneklerini
tamamen düşürmüş; o noktalara kitabın kendi cevap anahtarındaki karşılık
yazıldı ve parça gözden geçirilmek üzere işaretlendi.

## Bilinen eksikler

- **55. parça**: sayfada dört soru basılı ama kitabın cevap anahtarı üç cevap
  veriyor. Dördüncünün cevabı `null`. Kitabın kendi kusuru, düzeltilmedi.
- **98 ve 99**: çıkarılan soru sayısı anahtarla tutmuyor (5/4 ve 5/6).
- **16 parçada** bazı soruların şıkları OCR'da kaybolmuş.
- **61 parçada** kitabın Türkçe sözlüğü henüz alınmadı; uygulamadaki eski
  liste duruyor (`vocabularySource: "uygulama"`).

Bunların hepsi sayfa görüntüsü okunarak kapatılabilir; yapılmadı.

## 59-90 arası parçalar hakkında

Bu parçalar kitapta düz metin değil, **EXERCISE 2 boşluk doldurma** alıştırması
içinde basılı: cümlenin ortasında `(4) most / many` gibi seçenekler var.
Okuma metni olarak kullanılabilmesi için boşluklar **kitabın kendi cevap
anahtarından** (ALIŞTIRMA 2) dolduruldu — tahminle değil. Her parçanın
`_not` alanında bu yazıyor.
