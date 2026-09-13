/* TELAFFUZ ALIŞTIRMA METİNLERİ
 *
 * KAYNAK: AI Studio'da ayrı bir uygulama olarak geliştirilen telaffuz
 * değerlendirme projesinden taşındı (pronunciation-assessment-ai).
 * Mantığı OLDUĞU GİBİ korundu — çalışan ve ölçülmüş bir ayrıştırıcıyı
 * yeniden yazmak, kazancı olmayan bir hata kaynağı olurdu. Değişen
 * yalnızca dosya adları ve import yolları.
 */

export interface TelaffuzMetni {
  id: string;
  category: 'Temel' | 'Fonem / Zor Sesler' | 'İş Dünyası' | 'Tekerleme' | 'Günlük';
  title: string;
  text: string;
  difficulty: 'Kolay' | 'Orta' | 'İleri';
  /** Bu cümlenin hangi sese/yapıya çalıştırdığı. */
  focus: string;
}

export const TELAFFUZ_METINLERI: TelaffuzMetni[] = [
  {
    id: "plausibility-explanation",
    category: "Fonem / Zor Sesler",
    title: "Plausibility & Explanation",
    text: "question the plausibility of one explanation.",
    difficulty: "Orta",
    focus: "Çok heceli kelime vurgusu ve duraksama",
  },
  {
    id: "th-sound",
    category: "Fonem / Zor Sesler",
    title: "TH Sesleri ve Duraklama",
    text: "I thought a thought, but the thought I thought wasn't the thought I thought I thought.",
    difficulty: "Orta",
    focus: "Voiced & Voiceless 'TH' /θ/ & /ð/",
  },
  {
    id: "r-l-clarity",
    category: "Fonem / Zor Sesler",
    title: "R ve L Ayrımı & Akıcılık",
    text: "Literally, the rural jury was rarely comfortable with the preliminary evaluation.",
    difficulty: "İleri",
    focus: "R and L liquids, syllabic consonants",
  },
  {
    id: "business-presentation",
    category: "İş Dünyası",
    title: "Stratejik Sunum ve Tonlama",
    text: "Our primary objective is to optimize operational efficiency while maintaining sustainable quarterly revenue growth.",
    difficulty: "Orta",
    focus: "Kelime vurgusu ve profesyonel prosodi",
  },
  {
    id: "daily-coffee",
    category: "Günlük",
    title: "Sipariş ve Doğal Akış",
    text: "Could I please get a large iced caramel latte with oat milk, and a warm chocolate croissant to go?",
    difficulty: "Kolay",
    focus: "Bağlantılı konuşma (connected speech) ve tonlama",
  },
  {
    id: "tongue-twister-1",
    category: "Tekerleme",
    title: "Peter Piper & Patlamalı Ünsüzler",
    text: "Peter Piper picked a peck of pickled peppers. A peck of pickled peppers Peter Piper picked.",
    difficulty: "İleri",
    focus: "Aspirasyonlu /p/ sesleri ve ritim",
  },
  {
    id: "tongue-twister-woodchuck",
    category: "Tekerleme",
    title: "Woodchuck Ritim Testi",
    text: "How much wood would a woodchuck chuck if a woodchuck could chuck wood?",
    difficulty: "Orta",
    focus: "Kısa /ʊ/ ünlüsü ve W/Ch geçişleri",
  },
  {
    id: "general-intro",
    category: "Temel",
    title: "Kendini Tanıtma",
    text: "Hello, my name is Alex and I am actively working on improving my English pronunciation and speaking fluency.",
    difficulty: "Kolay",
    focus: "Temel artikülasyon ve doğal cümle sonu düşüşü",
  },
  {
    id: "weather-science",
    category: "Günlük",
    title: "Hava Durumu ve Bilim",
    text: "Although the meteorological forecast predicted heavy thunderstorms, the afternoon remained surprisingly bright and sunny.",
    difficulty: "Orta",
    focus: "Çok heceli kelimeler ve zıtlık vurgusu",
  },
];

export const DEFAULT_PREVIEW_REPORT = `### Telaffuz Değerlendirme Raporu

**Genel Telaffuz Puanı:** 48 / 100

#### 1. İncelenen Cümle
question the **[plausibility]** [--] of one **[explanation]**.

#### 2. Hata Özeti
* **Hatalı Telaffuzlar:** 3 adet (Yanlış veya anlaşılmayan sesletimler)
* **Çıkarmalar (Atlanan):** 0 adet (Metinde olup okunmayan kelimeler)
* **Eklemeler:** 0 adet (Metinde olmayıp fazladan söylenen kelimeler)
* **Beklenmeyen Duraklama:** 1 adet (Doğal olmayan, akışı bozan duraklamalar)
* **Duraklama Eksik:** 0 adet (Noktalama veya nefes payı bırakılmayan yerler)
* **Monotonluk:** 0 (Düz ve vurgusuz konuşma uyarısı)

#### 3. Puan Dökümü
| Metrik | Puan | Değerlendirme (0-59: Düşük, 60-79: Orta, 80-100: İyi) |
| :--- | :--- | :--- |
| **Doğruluk Puanı (Accuracy)** | 73 / 100 | Orta |
| **Akıcılık Puanı (Fluency)** | 26 / 100 | Düşük |
| **Tamamlanma Puanı (Completeness)** | 50 / 100 | Düşük |
| **Prosodi/Tonlama Puanı (Prosody)** | 67 / 100 | Orta |

#### 4. Düzeltme Önerileri
* **plausibility /ˌplɔː.zəˈbɪl.ə.ti/**: 3. hecedeki birincil vurgu (/ˈbɪl/) belirginleştirilmeli, /plɔː/ sesi açık çıkarılmalıdır.
* **explanation /ˌek.spləˈneɪ.ʃən/**: /neɪ/ diftongu net duyurulmalı ve son hece (/ʃən/) zayıflatılmalıdır.
* **Beklenmeyen Duraklama [--]**: "plausibility" ile "of" arasındaki yapay duraksama kaldırılmalı ve bağlantılı konuşulmalıdır.

---
Hedef Metin: question the plausibility of one explanation.`;

