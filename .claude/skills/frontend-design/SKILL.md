---
name: frontend-design
description: Bu projede herhangi bir arayüz, sayfa, bileşen veya CSS yazarken kullan. Tasarımın "AI üretimi" gibi görünmesini engelleyen kurallar ve bu projenin görsel dili. UI/JSX/Tailwind dokunulan her görevden ÖNCE oku.
---

# Frontend tasarım

Stack: React 19 + Tailwind 4 + lucide-react + motion. Tailwind 4 CSS-first, tema
her uygulamanın `index.css` dosyasındaki `@theme` + `:root` bloğunda tanımlı.
Yeni renk/spacing oraya eklenir, JSX'e hardcode edilmez.

## Yasak listesi (AI tasarımının parmak izleri)

Bunlar tek tek "kötü" değil; hepsi birden aynı sayfada olduğu için AI belli oluyor.

1. **Mor/indigo gradient.** `from-purple-500 to-indigo-600`, gradient başlık
   yazısı, mor glow. Bu projede gradient yok; düz renk var.
2. **Her şey `rounded-2xl shadow-lg border`.** Bir sayfada en fazla bir yükseklik
   seviyesi olsun. Kart içinde kart, gölge içinde gölge yok.
3. **Simetrik 3'lü kart grid'i.** İçerik 3 tane olduğu için değil, "3 kart iyi
   durur" diye kurulan grid. İçerik kaç taneyse o kadar; gerekiyorsa asimetrik.
4. **Emoji + başlık.** `🚀 Hızlı Başla` gibi süs emoji. (İstisna için aşağıdaki
   Qurio notuna bak: sistemli ikonografi başka şey.)
5. **Ortalanmış hero + alt başlık + iki buton.** Bu bir öğrenme uygulaması,
   landing page değil. Ekranın işi ne ise doğrudan o görünsün.
6. **Anlamsız animasyon.** motion yalnızca durum değişimini açıklamak için
   (giren/çıkan panel, sıralanan liste). Scroll-reveal, hover'da büyüyen kart,
   "fade in up" yok.
7. **Sahte hassasiyet.** `opacity-90`, `text-[15px]`, `p-[13px]` gibi rastgele
   ara değerler. Ölçek dışına çıkacaksan sebebi olsun.
8. **Placeholder metin.** "Lorem ipsum", "Feature One", "Your journey starts
   here". Gerçek Türkçe içerik yaz; bilmiyorsan sor.

## Bunun yerine

- **Hiyerarşi renkle değil boyutla kurulur.** 2-3 boyut, 2 ağırlık, o kadar.
  Vurgu için renk değil ağırlık.
- **Boşluk tutarlı ve bol.** İlişkili şeyler yakın, ilişkisiz şeyler uzak.
  Her yere eşit `gap-4` vermek hiyerarşi kurmaz.
- **Kenarlıklar gölgeden iyidir.** 1px nötr border, `shadow-xl`den net durur.
- **Hizalama.** Sol kenarlar aynı hatta. Ortalanmış metin bloğu paragraf değildir.
- Ekranı bitirince sor: *"bunu bir tasarımcı mı yaptı, yoksa bileşen
  kataloğundan mı toplandı?"* Cevap ikincisiyse yeniden bak.

## Bu projenin görsel dili

İki referans, iki ayrı iş yapıyor. Karıştırma:

**qurio.academy — KABUK ve PALET.** Ne yapılacağının kaynağı.
- Zemin nötr açık gri (**krem değil**), kartlar saf beyaz. Kart ile zemin
  arasındaki fark gölgeyle değil bu iki tonun farkıyla kuruluyor.
- Kartlarda gölge yok; 1px açık gri kenarlık ve ~16px köşe var.
- İki renk var ve işleri ayrı:
  `--accent` (menekşe-mavi) yalnızca **aktif/etkileşimli** durum — seçili menü
  öğesi, birincil düğme. `--brand` (turuncu) yalnızca **marka ve vurgu** —
  logo, bölüm başlığı, bir cümledeki tek anahtar kelime ("Social **Space**",
  "New **post**"). Turuncu asla düğme zemini olmaz, menekşe asla süs olmaz.
- Sol kenarda dikey gezinme, üstte sade sekmeler. Aktif üst sekme = açık gri
  hap; aktif kenar öğesi = dolu menekşe. İki farklı aktif dili olması sorun
  değil, çünkü iki farklı gezinme seviyesi.
- Kenar çubuğunda öğe başına emoji var ve **bu doğru**. Yasak listesindeki emoji
  kuralı başlığa süs olarak takılan emojiyi hedefler; burada emoji tutarlı bir
  liste ikonografisi — her satırda var, hepsi aynı boyutta. Kural: dekoratifse
  hayır, sistemliyse evet.

**apple.com — TİPOGRAFİ ve BOŞLUK DİSİPLİNİ.** Ne kadar az yapılacağının kaynağı.
- Bir ekranda tek bir şey birinci derecede önemlidir ve punto farkı bunu
  tereddütsüz söyler. Küçük başlıkları büyütmekten korkma.
- Boşluk elemandan çok yer kaplar. Sıkıştırma.
- Renk neredeyse hiç yok: siyah, beyaz ve içerik. Renk bir şey *ifade* ettiğinde
  ortaya çıkar.
- Kenarlık ve ayraç minimumda — hizalama zaten grubu belli ediyorsa çizgi
  gereksizdir.

**Kaçınılacak his:** "SaaS kontrol paneli". Kutu içinde kutu, her metrik için bir
kart, her kartta bir ikon rozeti, her yerde eşit gri. Bu bir *çalışma*
uygulaması: ekranda metin ve alıştırma başroldedir, arayüz kenarda durur.

## İş akışı

- Renk yazarken token kullan (`bg-paper`, `text-ink-2`, `border-hairline`,
  `bg-accent`, `text-brand`). Depoda sabit `slate-*` / `indigo-*` sınıfı
  KALMADI (0 adet); yenisini ekleme, o ölçekler artık paletin dışında.
- UI değişikliğinden sonra dev server'ı açıp ekran görüntüsü al, kıyasla.
- Sunmadan önce yasak listesini tek tek geç.
