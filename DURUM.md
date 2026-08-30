# Proje Durumu — Devir Notu

Bu dosya, projeye **başka bir bilgisayardan ya da sıfır bağlamla** devam
edecek biri için yazıldı. Kodun ne yaptığı zaten kaynaktaki yorumlarda
yazılı; burada olan şey, koda bakarak anlaşılmayan kararlar, tuzaklar ve
açık kalan işler.

Son güncelleme: 30 Ağustos 2026 · son commit `ea3a6af`

---

## 1. Proje nedir, nerede yayınlanır

Tek sitede iki uygulama:

| Yol | Uygulama | Ne yapar |
|-----|----------|----------|
| `/` | **Okuma & Kelime** (Lexis Trainer) | 100 okuma parçası, kelime kartları, sınav, hikaye üreteci |
| `/katmanli/` | **Katmanlı İngilizce** | Bir videonun transkriptiyle 7 katmanlı çalışma |

- Depo: `github.com/hakanonel05/ingilizce-merkez`
- Yayın: `https://ingilizcemerkez.netlify.app` — `main`'e push edilince otomatik
- API: `server.ts` → `netlify/functions/api` (serverless)

```bash
npm install
npm run dev:reading     # 5173
npm run dev:katmanli    # 5174
npm run dev:api         # 3000
npm run build           # ikisini de derler -> dist/
npm run lint            # tsc --noEmit
```

---

## 2. Koda bakarak anlaşılmayan yapısal kararlar

**İki uygulama AYNI ORIGIN'de.** Bu yüzden `localStorage` ve `IndexedDB`
ortak. Kelime kartları, API anahtarları ve çalışma takvimi iki tarafta da
aynı veriyi görüyor. Bir uygulamada veri bozarsan diğeri de etkilenir.

**Ortak kod `shared/` altında.** Bir modül iki uygulamada da gerekiyorsa
`shared/`'a taşınır ve eski yoluna **tek satırlık bir re-export bırakılır**
(örnek: `apps/katmanli/src/lib/userKeys.ts`). Böylece mevcut importlar
kırılmıyor. Bu depoda yerleşik desen budur, yeni ortaklaştırmada da uygula.

**İKİ AYRI SENKRON MEKANİZMASI VAR** — en çok karıştıran nokta:

| | Katmanlı | Reading |
|---|---|---|
| Yöntem | Senkron **kodu** | Supabase **hesap girişi** |
| Nereye | `/api/sync/*` → `sync_kv` | `user_progress`, `custom_passages` |
| Anahtar | service key (sunucuda) | anon key (tarayıcıda) |

Reading tarafında senkron kodu **yoktur**; oraya kod alanı arama.

**Tailwind v4** ve `@source "../../../shared"` şart. Tarama Vite kökünden
(`apps/<uygulama>`) başlıyor, `shared/` o ağacın dışında kalıyor. Bu satır
olmazsa ortak bileşenler sessizce yarı stilsiz kalıyor.

---

## 3. Zaman kaybettiren tuzaklar

**Katmansız CSS kuralı, Tailwind'i ezer.** `@layer` kullanan bir kurulumda
katmansız (unlayered) bir kural, ÖZGÜLLÜĞÜNE BAKILMAKSIZIN katmanlı olanı
ezer. `apps/katmanli/src/index.css`'te `h1..h6 { color }` yazmak, koyu
panellerdeki `text-slate-300` başlıkları slate-900'e çevirip görünmez
yapmıştı (kontrast oranı 1.0). Taban stilleri **`@layer base` içine yaz**.

**Netlify fonksiyonu 26 saniyede kesiliyor** (`netlify.toml`). Uzun yapay
zeka işleri parçalara bölünmeli. Seslendirme bu yüzden paragraf paragraf
üretiliyor; tek istekte bir hikayeyi seslendirmek bu sınırı aşıyordu.

**Tarayıcı önizleme paneli kare üretmiyor.** Sonuç: CSS geçişleri
ilerlemiyor (`CSSTransition` sonsuza kadar "running" kalıyor) ve
`AnimatePresence mode="wait"` panelleri hiç mount olmuyor. Bir şeyin
"çalışmadığını" görürsen önce bunu ele: geçişleri kapatıp ölç.

```js
document.head.insertAdjacentHTML('beforeend',
  '<style>*{transition:none !important}</style>');
```

**`tsc` bellek yiyor.** JSON kelime listeleri tip çıkarımını şişiriyor:

```bash
NODE_OPTIONS=--max-old-space-size=6144 npx tsc --noEmit
```

**Bash heredoc `\\`'yi `\` yapıyor.** Regex içeren betikleri heredoc ile
yazma; Write aracını kullan ya da ters bölüsüz bir yol seç.

**IndexedDB'yi sürüm belirtmeden açma.** Versiyonsuz açmak boş bir veritabanı
oluşturup mevcut depoları görünmez yapıyor. Dört açıcının hepsinde `onblocked`
da ele alınmış durumda (bu olay tetiklenince `onsuccess` hiç gelmiyor).

---

## 4. Yapay zeka sağlayıcıları

`server.ts` iki sağlayıcı zinciri kullanıyor: **Gemini** ve **Groq**.
Anahtarlar sunucunun ortam değişkenlerinde **zaten tanımlı** — kullanıcının
kendi anahtarını girmesi gerekmiyor, yalnızca kendi kotasını kullanmak
isterse. Kullanıcı anahtarları `x-user-*-key` başlıklarıyla geliyor ve
istek başına `AsyncLocalStorage`'da tutuluyor.

**Hikaye üreteci varsayılanı `openai/gpt-oss-120b`** (Groq). Ölçümle
seçildi: aynı kelimeler ve seviyeyle karşılaştırıldığında B1 hedefini en
iyi tutturan oydu (ortalama cümle uzunluğu ~11.6 kelime; Qwen 3.8 ~15 ile
bandın üstüne çıkıyor, GPT-OSS 20B ~9.7 ile altında kalıyor). Kelime
kapsaması ve alıştırma biçimi bütün modellerde kusursuzdu, ayrım orada
değil.

**Model listesi sabit değil.** `/api/ai/models`, Groq'un CANLI kadrosunu
okuyup tanınan açık ağırlıklı ailelere göre süzüyor. Sabit liste iki yönden
de yanlıştı: kaldırılan modeller 404 veriyor, yeni çıkanlar kod
değiştirilmeden görünmüyordu. Groq yarın Llama eklerse kendiliğinden çıkar.
(Bu hesapta şu an Llama ve Kimi servis EDİLMİYOR — sadece GPT-OSS ve Qwen.)

**Seslendirme** `gemini-2.5-flash-preview-tts` ile; ham PCM sunucuda WAV
başlığıyla sarılıyor. Başarısız olursa istemci tarayıcının kendi sesine
düşüyor ve bunu kullanıcıya söylüyor.

---

## 5. Son oturumda yapılanlar

- **Hikaye üreteci** (`StoryComposer`) — hâlâ öğrenilmemiş kelimelerden
  seviyeye uygun hikaye. İki aşamalı: önce hikaye, arkadan soru/alıştırma.
- **Hikayelerim sekmesi** (`StoryLibrary`) — üretilen hikayeler
  "Okuma Parçaları" listesinde HİÇ görünmüyordu (o liste sabit
  `PASSAGE_CATALOG`'dan kuruluyor), yani bir kez kapatılan hikaye bir daha
  açılamıyordu. Ayrı raf bunu çözdü.
- **Sesli okuma** (`narration.ts`, `NarrationBar`) — paragraf paragraf,
  okunan paragraf metinde vurgulanıyor.
- **Açık kaynak model seçimi** — yukarıda anlatıldı.
- **Reading'e ayarlar ekranı** — o tarafta hiç yoktu; anahtarlar yalnızca
  katmanlıdan girilebiliyordu, dolayısıyla reading tek başına
  kullanılamıyordu. `shared/vocab/SettingsModal.tsx` artık ortak.
- **Katmanlı arayüzü yeniden yapılandırıldı** — yatay katman şeridi yerine
  sol dikey adım navigasyonu, ders seçici modala taşındı, alta sabit
  "sonraki katman" barı. Bileşenler `apps/katmanli/src/components/shell/`.

---

## 6. Açık kalan işler

**1. Kelimeyi zorlama sorunu (kullanıcı biliyor, karar bekliyor).**
Üretilen hikayelerde modeller hedef kelimeyi bazen yanlış anlamda
kullanıyor — ölçümde `compelling` sıfat yerine fiil olarak geçti. Bu
GEMINI DAHİL bütün modellerde var. Çözüm istem metnini sıkılaştırmak:
her kelimenin en yaygın anlamında ve doğal eşdiziminde kullanılmasını
şart koşmak. Kullanıcı modelleri karşılaştırdığı için ortak değişkeni
değiştirmedim; onay bekliyor.

**2. İki uygulamanın tasarımı yeniden ayrıştı.** Bir ara ikisi de
"editoryal" dile (krem zemin, Playfair, keskin köşe) getirilmişti;
kullanıcı sonra katmanlı için modern SaaS görünümü istedi (slate/indigo,
yuvarlak köşe, Inter). Reading hâlâ editoryal. **Bu bilinçli**, hata değil
— ama reading de aynı dile taşınmak istenirse iş kalemi olarak durur.

**3. Ortak bileşenler iki paleti de görüyor.** `shared/` altındakiler
`--ink` / `--paper` değişkenlerini kullanıyor; iki uygulama bunları kendi
`index.css`'inde farklı değerlerle tanımlıyor. Yeni ortak bileşen yazarken
sabit renk yazma, değişken kullan.

---

## 7. Doğrulama alışkanlığı

Bu depoda değişiklikler **ölçülerek** doğrulanıyor, göz kararıyla değil.
Yerleşik yöntemler:

- Yayın sonrası derlenmiş paketi çekip `grep` ile işaret arama
- Tarayıcıda hesaplanan stil sondaları (kontrast, taşma, dokunma hedefi)
- `fetch`'i sahte sunucuyla değiştirip yapay zeka akışlarını uçtan uca deneme
- IndexedDB / localStorage'a test verisi ekleyip **sonra temizleme**

Kontrast ölçerken renkleri canvas ile gerçek RGB'ye çevir; `getComputedStyle`
modern tarayıcılarda `oklch()` döndürüyor ve elle ayrıştırmak yanlış sonuç
veriyor.
