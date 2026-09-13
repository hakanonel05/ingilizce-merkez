# Kitaptan çıkarılan okuma verisi

`apps/reading/src/data/passages.ts` bu klasörden üretiliyor. Oradaki dosya
elle düzenlenmemeli; düzeltme gerekiyorsa buradaki `pNNN.json` düzeltilip
dosya yeniden üretilmeli.

Kaynak: **100 Reading** (Akın Dil Eğitim). Metin, sorular, cevaplar ve —
kitapta bulunan parçalarda — Türkçe sözlük kitabın kendisinden alındı.

## Dosyalar

| dosya | ne |
|---|---|
| `pNNN.json` | parçanın metni, soruları, cevapları, sözlüğü |
| `cevap-anahtari.json` | kitabın cevap anahtarı (sayfa görüntüleri okunarak) |
| `alistirma2.json` | 59-90 arası parçaların boşluk doldurma cevapları |

## `guven` alanı — her parçada aynı kalite yok

    "goruntuden-birebir"  74 parça. Sayfa görüntüsü okunup birebir yazıldı.
    "ocr-yapisal"         26 parça. Sayfa görüntüsü yerel OCR (tesseract) ile
                          okundu; sütunlar ayrı kırpıldı, metin sayfanın
                          YAPISINA göre ayıklandı. GÖZLE DOĞRULANMADI.

İkinci gruptaki metinlerde OCR kaynaklı harf hataları kalmış olabilir.
Yapısal kirlilik (filigran, sayfa numarası, soru/şık sızıntısı, dolmamış
boşluk) `denetim2.mjs` ile taranıyor ve sıfırlandı.

## Bilinen eksikler

- **55. parça**: sayfada dört soru basılı ama kitabın cevap anahtarı üç cevap
  veriyor. Dördüncünün cevabı `null`. Kitabın kendi kusuru, düzeltilmedi.
- **66. parça**: bunun tersi — sayfada üç soru basılı, anahtar dört cevap
  veriyor. Dördüncü soru kitapta yok, uydurulmadı.
- **42 parçada** kitapta Türkçe sözlük bölümü yok (59-100 arası); orada
  uygulamanın eski listesi duruyor (`vocabularySource: "uygulama"`).
- 17, 43 ve 86. parçalarda bazı sorularda kitapta yalnızca iki şık basılı.

## 59-90 arası parçalar hakkında

Bu parçalar kitapta düz metin değil, **EXERCISE 2 boşluk doldurma** alıştırması
içinde basılı: cümlenin ortasında `(4) most / many` gibi seçenekler var.
Okuma metni olarak kullanılabilmesi için boşluklar **kitabın kendi cevap
anahtarından** (ALIŞTIRMA 2) dolduruldu — tahminle değil.

Yanlış seçeneğin nerede bittiğini bulmak kolay değil: "(1) if / that when it
comes to" ifadesinde "that" doğru cevapsa, "when it comes to" cümlenin devamıdır
ve silinmemelidir. Sınır, anahtarın hangi seçeneğe denk geldiğine bakılarak
hesaplanıyor (`bosluk.mjs`); kelime sayısı tahminiyle kesmek metni bozuyordu.
