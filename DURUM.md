# Proje Durumu — Devir Notu

Bu dosya, projeye **başka bir bilgisayardan ya da sıfır bağlamla** devam
edecek biri için yazıldı. Kodun ne yaptığı zaten kaynaktaki yorumlarda
yazılı; burada olan şey, koda bakarak anlaşılmayan kararlar, tuzaklar ve
açık kalan işler.

Son güncelleme: 30 Ağustos 2026 · `main` yayında

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

**TASARIM SİSTEMİ TEK YERDE, KURALLARI YAZILI.** Renk, tipografi ve
yüzeyler `apps/*/src/index.css` içindeki `@theme` + `:root` bloklarında
tanımlı; iki uygulamada **aynı adlarla** duruyor. JSX'te sabit renk
yazılmaz — depoda tek bir `slate-*`, `indigo-*` ya da palet dışı
Tailwind rengi kalmadı (ölçüldü: 0).

Üç kural en çok karıştırılan yerler:

| token | ne işe yarar | ne DEĞİLDİR |
|---|---|---|
| `--accent` (menekşe) | aktif ve tıklanabilir olan her şey | süs |
| `--brand` (turuncu) | marka, bölüm başlığı, bir cümledeki tek anahtar kelime | düğme zemini |
| `--marker` (kehribar) | **yalnızca** şu an konuşulan cümle | tema, uyarı, sekme rengi |

Kehribar bir zamanlar senkron şeridinde, boş durum kutularında ve
alakasız hover'larda da vardı; aktif cümle de kehribar olduğu için
işaret işaret olmaktan çıkmıştı. Aynı şekilde her katman ekranı kendi
rozet rengini seçmişti (2 yeşil, 4 turuncu, 3 ve 5 menekşe). Yeni bir
ekran yazarken bu ikisini tekrarlama.

**Kabuk iki uygulamada ortak biçimdedir:** 64px ikon şeridi + 260px menü
paneli + üst çubuk. Bölüm başlığını **çağıran taraf** verir, bileşen
kendi başlığını çizmez — katmanlıda `LayerHeaderBar`, reading'de
`App.tsx`. Bu kural `VocabHub` ve karne gibi İKİ uygulamada birden
görünen bileşenler yüzünden var; içlerine başlık koyulursa katmanlıda
çift başlık çıkar.

**Yerleşik biçimler:** liste > ızgara (uzun başlıklar kırpılmasın),
kenarlık > gölge, kutu içinde kutu yok, aktif segment = açık gri hap,
birincil eylem = dolu menekşe. Ayrıntılı gerekçeler ve "AI üretimi gibi
durmasın" kuralları `.claude/skills/frontend-design/SKILL.md` içinde —
UI'ye dokunmadan önce oku.


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

**TEK RENK SÖZLÜĞÜ: `paper` / `ink` / `hairline` / `accent`.** İki
uygulamanın `index.css`'inde AYNI adlarla ve AYNI değerlerle tanımlı; hem
`@theme` bloğunda (Tailwind sınıfı üretsin diye: `bg-paper`, `text-ink`,
`border-hairline`, `bg-accent`) hem `:root`'ta (ortak bileşenler
`var(--ink)` yazabilsin diye).

Bunun pratik kuralı: **`shared/` altında vurgu rengini SABİT yazma.**
Slate ölçeği serbest — iki uygulamanın paleti de o ölçeğe oturuyor ve
katmanlının `index.css`'inde anlatıldığı gibi hepsini değişkene çevirmek
görsel hiyerarşiyi düzleştiriyor. Ama vurgu ve durum renkleri uygulamaya
göre değişebilecek şeyler; `accent` ailesini kullan.

Tuzağa dikkat: Tailwind yalnızca kaynakta GEÇEN sınıfı üretir. `bg-accent`
kaynakta yoksa `bg-accent` diye bir kural da yoktur — tarayıcıda çıplak
sınıfı deneyip "üretilmemiş" diye karar verme, kod `hover:bg-accent-700`
yazıyorsa üretilen `.hover\:bg-accent-700:hover` olur.

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
  '<style>*{transition:none !important;animation:none !important}</style>');
```

Bu yalnızca görüntüyü değil ÖLÇÜMÜ de bozuyor, en sinsi tarafı bu:
`getComputedStyle` geçişin BAŞLANGIÇ değerini döndürüyor. Aktif sekme
kutucuğu `transition-all` ile beyazdan indigoya geçiyor; kontrast
ölçümü zemini beyaz okuyup "beyaz üstüne beyaz yazı, kontrast 1.0"
diye gerçek olmayan bir hata raporladı. Stil ölçmeden ÖNCE yukarıdaki
satırı çalıştır.

**`tsc` bellek yiyor.** JSON kelime listeleri tip çıkarımını şişiriyor:

```bash
NODE_OPTIONS=--max-old-space-size=10240 npx tsc --noEmit
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

**Aynı ders Gemini tarafında ÖĞRENİLMEMİŞTİ; `GEMINI_MODELS` hâlâ elle
yazılmış sabit bir liste.** 30 Ağustos 2026'da yeni açılan bir anahtarla
listedeki üç modelin ÜÇÜ DE 404 verdi ("no longer available to new users").
Sonuç SESSİZ bir arızaydı: zincir Gemini'yi atlayıp Groq'a düşüyor ve
arayüzde hiçbir şey bozuk görünmüyor — çünkü sağlayıcı atlamak zincirin
normal davranışı. Ancak Groq'un günlük kotası da dolunca ortaya çıktı.

Liste artık `gemini-3.6-flash` ile başlıyor (Google'ın 404 gövdesinde
önerdiği model), arkasında `gemini-flash-latest` takma adı var. Takma ad
listede duruyor çünkü 3.6 da kapatılırsa kendini günceller.

**503 GEÇİCİDİR, 404 KALICI — ikisi aynı kefeye konmuştu.** Gemini
yoğunlukta `503 UNAVAILABLE / "high demand"` dönüyor. Eski kod bunu
kalıcı hata sayıp modeli DENEMEDEN atlıyordu; sonuç, bir anlık
yoğunlukta zincirin bütün Gemini modellerini tek turda tüketmesi ve
Gemini hiç devrede değilmiş gibi görünmesiydi. Artık 503 kısa bir
geri çekilmeyle aynı modelde yeniden deneniyor (`isTransientError`).
Ölçüm: geçersiz bir Groq anahtarıyla istek, düzeltmeden önce hata
veriyordu, sonrasında `gemini-3.6-flash` ile BAŞARILI dönüyor.

**Zincir çökerse hata artık HER SAĞLAYICIYI adlandırıyor.** Önceden
`lastError` fırlatılıyordu; o da en son denenen modelin hatası, yani
genelde listenin dibindeki en eski modelin. Groq anahtarı geçersizken
kullanıcı "gemini-2.0-flash artık yok" görüyordu — yanlış teşhis.
Şimdi mesaj `groq: ... | gemini: ...` biçiminde, ve zincirde
bulunmayan sağlayıcı varsa "DENENMEDİ (anahtarı tanımlı değil)" diye
yazılıyor. "Gemini neden devreye girmedi" sorusunun cevabı artık hata
metninde.

**BİR SAĞLAYICININ ÇALIŞTIĞINI ARAYÜZDEN ANLAYAMAZSIN.** Yanıttaki
`model` alanına bak; GERÇEKTEN kullanılan modeli bildiriyor. "Hikaye
geldi, demek ki Gemini çalışıyor" akıl yürütmesi bu oturumda bir kez
yanılttı — gelen hikayeyi Gemini değil Groq yazmıştı.

```bash
curl -s -X POST localhost:3000/api/generate-story \
  -H "Content-Type: application/json" \
  -d '{"words":["record"],"level":"B1","model":"auto"}' | grep -o '"model":"[^"]*"'
```

**Seslendirme** `gemini-2.5-flash-preview-tts` ile; ham PCM sunucuda WAV
başlığıyla sarılıyor. Başarısız olursa istemci tarayıcının kendi sesine
düşüyor ve bunu kullanıcıya söylüyor.

---

## 5. Son oturumda yapılanlar

**Arayüz baştan kuruldu.** İki uygulama tek kabuk ve tek palet altında
birleşti: ikon şeridi + menü paneli + üst çubuk, katmanlıda yeni bir
**Akış** giriş ekranı. Uygulama artık Katman 1 yerine Akış'ta açılıyor —
dün 4. katmanda bırakan biri her seferinde başa dönüyordu.

Ölçülebilir kısmı: 25 dosyada **1046 sabit renk sınıfı** token'a çevrildi,
palet dışı 13 renk (turuncu, mor, gök mavisi, kırmızı, yeşil) tekilleşti,
"AI izi" sayacı katmanlıda 235→0, reading'de 397→3 indi. Kalan eşleşmeler
tek tek doğrulandı, hepsi yanlış pozitif.

**Tasarımdan bağımsız BEŞ GERÇEK HATA çıktı:**

1. **Uydurma çalışma verisi.** Süreç panosundaki haftalık grafik
   `progress.weeklyStudyMinutes` okuyordu; o alan depoda **hiçbir yerde
   yazılmıyor**. Yani grafik herkeste, her zaman koddaki sabit
   `[25, 40, 30, 55, 35, 60, 45]` dizisini gösteriyordu — üstüne
   "Haftalık Toplam: 290 dk" ve "en yüksek performans" cümleleri de
   ondan hesaplanıyordu. Gerçek kaynağa bağlandı: `getAllDayStats()`.
2. **Gösterge çubuğunda iki aynı renk.** "Bugün" ve "Geçmiş günler"
   noktalarının ikisi de `bg-accent` idi; gösterge, grafiğin çizmediği
   bir ayrımı açıklıyordu.
3. **Çalışmayan 3B kart çevirme.** Kelime kartı `rotate-y-180` yazıyordu
   ama ne `preserve-3d` ne `backface-visibility` tanımlıydı — kart hiç
   dönmüyor, yalnızca opaklık değişiyordu. Sahte dönüş kaldırıldı.
4. **Dokunmatikte erişilemeyen düğmeler.** Satır eylemleri (düzenle, sil,
   telaffuz) hover'a bağlıydı; telefonda hover yok. `pointer: coarse`
   kuralıyla orada sürekli açık.
5. **Kontrast.** Kelime kartındaki klavye ipucu `bg-ink` üstünde
   `text-ink-3` idi — 2.6:1.

Ayrıca mobilde 41px yatay taşma (üst çubuktaki serif kelime işareti
`shrink-0` idi) ve kapalı menü çekmecesinin ekranda kalan 64px'i düzeldi.

**Genişlik.** İçerik sütunu 1180px'de sabitti; 1900px'lik bir ekranda iki
yanda ~350'şer piksel boşa gidiyordu. 1440 (xl) ve 1760 (2xl) kademeleri
eklendi, Katman 1'in sütun oranı 5/7→4/8 oldu, Katman 4'ün videosu
`max-w-3xl`→`max-w-5xl`. Ölçüm: Katman 1'in İngilizce transkript sütunu
210→460px, Katman 4'ün videosu 768→998px.

Metin ağırlıklı yerler bilerek dar bırakıldı: okuma parçası gövdesi 48ch,
Katman 5 (görüntü kasıtlı kapalı), sınav kurulum formu.

**CRLF TUZAĞI.** Bu depoda bazı dosyalar CRLF satır sonu kullanıyor. Çok
satırlı bir arama/değiştirme dizesini LF ile yazarsan **sessizce**
eşleşmez — hata vermez, sadece bulunamadı der. Bu oturumda üç düzenleme
buna takıldı. Betiklerinde dosyanın kendi satır sonuna uyarlan.

## 6. Açık kalan işler

**1. Hikaye istemi ÖLÇÜLDÜ, düzeltme tuttu — ama ölçüt seçimi kritik.**
Gerçek anahtarlarla, aynı kelimelerle, eski/yeni istek biçimi yan yana
(kelimenin geçtiği cümledeki söz türünü ayrı bir model etiketledi):

| model | eski biçim | yeni biçim |
|---|---|---|
| GPT-OSS 120B (Groq) | 14/50 doğru | 49/50 |
| Gemini 3.6 Flash | 5/20 doğru | 15/15 |

**KELİME SEÇİMİ ÖLÇÜMÜ BELİRLİYOR.** İlk denemede `compelling`,
`decision`, `apparent`, `consequence`, `reluctant` kullanıldı ve İKİ
BİÇİM DE 50/50 çıktı — bu kelimelerin baskın bir söz türü var, model
zaten doğru yapıyor, açıklamanın düzeltecek bir şeyi yok. Kusur ancak
GERÇEKTEN belirsiz kelimelerde görünüyor: `record`, `conduct`, `object`,
`increase` (isim) ve `present` (sıfat) — hepsinin fiil hâli de yaygın.
Bunu tekrar ölçecek olan aynı tuzağa düşmesin.

Ölçüt de iki kez yanlış kuruldu: metnin herhangi bir yerinde türetilmiş
biçim aramak hem normal İngilizceyi hata sayıyor ("kararı" ve "karar
verdi" aynı hikayede olabilir) hem de asıl hatayı kaçırıyor —
`compelling` fiil olarak da "compelling" yazılır. Bakılması gereken tek
şey kelimenin GEÇTİĞİ CUMLEDEKİ işlevi.

**2. `.env` ve `.claude/launch.json` yerel, ikisi de `.gitignore`'da.**
Gerçek anahtarlar Netlify'ın ortam değişkenlerinde; depoda hiçbir
kopyası yok, `.env.example` yalnızca değişken adlarını listeliyor.
`launch.json` node'un tam yolunu yazıyor çünkü bir makinede PATH'te
değildi.

`.claude/skills/` ise **istisna** ve depoya dahil: tasarım kuralları
projeye ait bilgi, makineye değil. Yok sayılsaydı başka bir bilgisayarda
açılan oturumda kurallar yüklenmez ve tasarım ortalamaya geri kayardı.

**3. Açıklama sızıntısı düzeltmesi YETERİNCE ÖLÇÜLMEDİ.** Ölçüm
sırasında model bir kez yönergeyi hikayenin içine yazdı:

```
The AI then presents (adjective) "mevcut, şimdiki" data on the streets.
```

İsteme "bu işaretler sana verilen bilgidir, metne asla yazma" satırı
eklendi. Ama düzeltmeden SONRA yalnızca 5 temiz hikaye üretilebildi;
kusurun ilk görülme sıklığı 10 hikayede 1 idi, yani 5 hikaye hiçbir şey
kanıtlamaz. Kota (hem Gemini hem Groq günlük limit) dolduğu için koşu
tamamlanamadı.

Yapılacak: `scratchpad`'deki gibi 20+ hikaye üretip metinde
`(adjective)` / `(noun)` gibi parantezli söz türü ya da Türkçe karşılık
aramak. Hakem çağrısı gerekmiyor, düz metin araması yetiyor — kota da
yanmıyor.

**4. Kelime kartı silinen kod yok ama bir süs kaldırıldı.** Gösterge
panelindeki dev "L" filigranı silindi: Playfair'in serif harf biçimi
köşe süsü olarak çalışıyordu, Inter'e geçince `overflow-hidden`
tarafından kesilen anlamsız bir dikdörtgene döndü. Geri istenirse
`Dashboard.tsx`'te yerinde bir yorum duruyor.

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
veriyor. Canvas'a çizerken **önce `clearRect`, sonra doğrudan `fillRect`**:
rengi siyah bir zemine çizip okursan saydam zeminler opak siyah görünür ve
her şey "kontrast 1.18" çıkar. Yarı saydam metni de zemine kendin bindir
(`fg*a + bg*(1-a)`); zemin için ata zincirinde ilk OPAK arka planı bul.

Bir ölçüm inanılmaz bir sonuç veriyorsa (slate-900 beyaz üzerinde 1.18)
kodda değil ÖLÇÜMDE hata ara. Bu oturumda ölçüm iki kez yanlış alarm
verdi: biri yukarıdaki canvas hatası, diğeri geçiş tuzağı (bölüm 3).
