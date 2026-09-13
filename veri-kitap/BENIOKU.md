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

## `guven` alanı

    "goruntuden-birebir"  100 parça. Sayfa görüntüsü okunup birebir yazıldı.

Önce 26 parça yerel OCR'dan (tesseract) yapısal olarak kurulmuştu
(`ocr-yapisal`); hepsi sonradan sayfa görüntüsünden gözle doğrulandı ve
düzeltildi. OCR ile gözle okunan metin arasındaki fark parça başına %1,4-18,2
çıktı. En büyük üç fark ve sebebi:

| parça | fark | sebep |
|---|---|---|
| 90 | %18,2 | OCR sorunun metnini gövdeye karıştırmıştı, çıkarıldı |
| 80 | %18,3 | OCR metnin bir bölümünü kaybetmişti, geri geldi |
| 75 | %14,5 | ilk paragrafın başı OCR'da hiç yoktu |

Kalan 23 parçada fark harf ve noktalama düzeyinde.

## Soruların ayrı bir turu oldu

Gövdeler temizlendikten sonra **soru kayıtları denetlenmemişti** ve orada ayrı
bir kirlilik vardı. 27 parçada 78 soru sayfadan yeniden okundu. Görülen tipler:

- **Kök yarıda başlıyor:** `"the text. 1. According to paragraph 1, ..."`
- **Filigran sızmış:** `"ve Yayıncılık Hizmetleri 3. According to paragraph 3, ..."`
- **EXERCISE 4 sözlük maddesi soru sanılmış:** kök `"rely on (phr.v)"` yazıyordu,
  şıklar ise gerçek anlama sorusuna aitti (69, 70, 73, 74).
- **Kökler birbirine kaymış:** 1. sorunun kökü 3. soruya aitti (83, 84, 85).
- **Şık listesine sayfa mobilyası karışmış** ya da şık tümden eksikti
  (71/2'de B şıkkı, 87/1'de D şıkkı yoktu).
- **Şık harfleri yer değiştirmiş:** 89/3'te B ile C ters sıradaydı.

Cevap harfleri kitabın anahtarından geldiği için düzeltme sırasında hiçbir
sorunun cevabı değişmedi (78/78). Bu, şıkların doğru okunduğunun bağımsız
göstergesi.

## Bilinen eksikler ve kitabın kendi kusurları

- **55. parça**: sayfada dört soru basılı ama kitabın cevap anahtarı üç cevap
  veriyor. Dördüncünün cevabı `null`. Düzeltilmedi.
- **66. parça**: bunun tersi — sayfada üç soru basılı, anahtar dört cevap
  veriyor. Dördüncü soru kitapta yok, uydurulmadı.
- **17, 43. parçalarda** bazı sorularda kitapta yalnızca iki şık basılı.
  (80/2 ve 86/2 de iki şıklı ama onlar True-False sorusu, kusur değil.)
- **81. parça**: `(3)` numarası iki boşluk için kullanılmış, sonrası `(4)`ten
  devam ediyor. Boşluklar numaraya göre değil sırayla eşleştirildi.
- **82. parça**: `(9)` boşluğunun seçenekleri `mentioned / were mentioned`
  ama anahtar `was mentioned` diyor. Anahtar esas alındı.
- **83. parça**: `"This is why how a false belief became so widely-held."`
  cümlesi sayfada aynen böyle basılı.
- **90. parça**: 2. sorunun A şıkkı sayfada Roma rakamı `I` değil, rakam `1`
  olarak basılı (B, C, D ise `II`, `III`, `IV`). Sayfadaki haliyle bırakıldı.
- **42 parçada** kitapta Türkçe sözlük bölümü yok (59-100 arası); orada
  uygulamanın eski listesi duruyor (`vocabularySource: "uygulama"`).

## Parçanın içindeki boşluklar kasıtlı

İki yerde parça metninin içinde işaret var ve **silinmemeli**:

- **89. parça**, 1. paragrafta `______`. Kitabın 1. sorusu "Which one of these
  sentences best fits the space in paragraph 1" diyor; cevabı metne yazmak
  soruyu cevaplanamaz hale getiriyor.
- **90. parça**, 2. paragrafta `(I) (II) (III) (IV)`. 2. soru bu konumlara
  atıf yapıyor.

## 59-90 arası parçalar hakkında

Bu parçalar kitapta düz metin değil, **EXERCISE 2 boşluk doldurma** alıştırması
içinde basılı: cümlenin ortasında `(4) most / many` gibi seçenekler var.
Okuma metni olarak kullanılabilmesi için boşluklar **kitabın kendi cevap
anahtarından** (ALIŞTIRMA 2) dolduruldu — tahminle değil.
