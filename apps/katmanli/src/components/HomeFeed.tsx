/**
 * AKIŞ — uygulamanın giriş ekranı
 *
 * Üç sütun: sol menü (kabuk), orta içerik, sağ yan panel.
 *
 * NE GERÇEK, NE DEĞİL — bu ekranın tamamı GERÇEK VERİYLE besleniyor;
 * hiçbir kutuda örnek/temsili içerik yok. Tasarım isteğindeki bazı
 * başlıklar uygulamada karşılığı olan en yakın gerçek şeye bağlandı:
 *
 *   "Duyuru"                -> Bugünün Notu. Sıradaki katmanın metottaki
 *                              işini anlatıyor; metnin kaynağı metot
 *                              rehberinin kendisi.
 *   "Paylaşım Yap"          -> Yeni ders ekleme kutusu. Ortada paylaşacak
 *                              bir topluluk yok; aynı yerdeki aynı hareket
 *                              (yaz / ekle) burada içerik eklemeye gidiyor.
 *   "Yaklaşan Canlı Seanslar"-> Yaklaşan Tekrarlar. Canlı seans kaydı yok;
 *                              buna karşılık FSRS kartlarının tekrar
 *                              tarihleri var ve tam olarak aynı görsel
 *                              işi görüyor (tarih rozeti + liste).
 *
 * Bunları uydurma gönderiyle doldurmak ekranı "bitmiş" gösterirdi; asıl
 * maliyeti, sonradan neden çalışmadığının sorulmasıdır.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Plus, CalendarClock, Sparkles } from 'lucide-react';
import { VideoLesson, UserProgress } from '../types';
import { CORE_LAYERS } from './shell/LayerSidebar';
import { getAllCards, VocabCard } from '../lib/vocabStore';

const AY_KISA = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
                 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

/** YYYY-MM-DD — yerel saate göre; UTC'ye çevirmek günü kaydırır. */
function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Her katmanın metotta ne işe yaradığı — "Bugünün Notu" bu metinleri
 * kullanıyor. Katman listesindeki `subLabel` bir etiket (menüde tek
 * satıra sığmak zorunda); buradakiler ise sebebi anlatıyor.
 */
const LAYER_NOTES: Record<number, string> = {
  1: 'Metni önce Türkçesiyle birlikte oku. Amaç çeviri yapmak değil; kelimenin hangi bağlamda hangi anlama kaydığını görmek.',
  2: 'Sesi yazıyla eşleştir. Gözün takip ettiği cümleyi kulağın da yakalaması, sesle yazı arasındaki bağı kuruyor.',
  3: 'Konuşmacıyla aynı anda, aynı tonlamayla oku. Telaffuzu tek tek seslerden değil, cümlenin müziğinden öğreniyorsun.',
  4: 'Altyazıyı kapat. Burada hedef her kelimeyi anlamak değil, anlamadığın yerde panik yapmadan akışta kalmak.',
  5: 'Görüntüyü de kapat. Görsel ipuçları gidince anlamayı taşıyan tek şey ses kalıyor — asıl sınav bu.',
  6: 'İzlediğini İngilizce yaz. Tanıdığın kelime ile kullanabildiğin kelime arasındaki farkı ilk burada görürsün.',
  7: 'Şimdi konuş. Yazarken düşünmek için vaktin vardı; konuşurken yok, ve akıcılık tam olarak o farkta kuruluyor.',
};

interface Props {
  activeLesson: VideoLesson | null;
  lessons: VideoLesson[];
  progress: UserProgress;
  completedLayers: number[];
  onSelectLayer: (id: number) => void;
  onOpenLessonPicker: () => void;
  onOpenGuide: () => void;
}

/** Kart yüzeyi — tek yerde: gölge yok, 1px çizgi, yumuşak köşe. */
const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className = '', children,
}) => (
  <section className={`rounded-2xl border border-hairline bg-paper-2 ${className}`}>
    {children}
  </section>
);

export const HomeFeed: React.FC<Props> = ({
  activeLesson, lessons, progress, completedLayers,
  onSelectLayer, onOpenLessonPicker, onOpenGuide,
}) => {
  const [cards, setCards] = useState<VocabCard[]>([]);

  useEffect(() => {
    let cancelled = false;
    getAllCards()
      .then((c) => { if (!cancelled) setCards(c); })
      // Kart deposu IndexedDB'de; acilmadiysa ekranin geri kalani
      // calismaya devam etmeli, bu panel bos gorunur.
      .catch(() => { if (!cancelled) setCards([]); });
    return () => { cancelled = true; };
  }, []);

  /** Sıradaki katman: tamamlanmamış ilk çekirdek adım. */
  const nextLayer = useMemo(
    () => CORE_LAYERS.find((l) => !completedLayers.includes(l.id)) ?? CORE_LAYERS[0],
    [completedLayers]
  );

  const doneCount = CORE_LAYERS.filter((l) => completedLayers.includes(l.id)).length;

  /**
   * Yaklaşan tekrarlar: kartlar tekrar gününe göre gruplanıyor.
   * Geçmiş tarihli olanlar tek bir "Bugün" satırında toplanıyor — dünden
   * kalan bir kart ayrı bir gün olarak listelenirse takvim geriye doğru
   * uzar ve panel okunmaz hale gelir.
   */
  const upcoming = useMemo(() => {
    const now = Date.now();
    const groups = new Map<string, { date: Date; count: number; overdue: boolean }>();

    for (const c of cards) {
      if (c.suspended) continue;
      const due = new Date(c.due);
      const isOverdue = c.due <= now;
      const bucket = isOverdue ? new Date() : due;
      const key = dayKey(bucket);
      const g = groups.get(key);
      if (g) g.count += 1;
      else groups.set(key, { date: bucket, count: 1, overdue: isOverdue });
    }

    return [...groups.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(0, 5)
      .map(([key, g]) => ({ key, ...g }));
  }, [cards]);

  /** Son 14 günün çalışma şeridi. */
  const streakStrip = useMemo(() => {
    const studied = new Set(progress.studyDates ?? []);
    return Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return { key: dayKey(d), day: d.getDate(), active: studied.has(dayKey(d)) };
    });
  }, [progress.studyDates]);

  const todayKey = dayKey(new Date());

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8">

      {/* ================= HERO ŞERİDİ =================
          Sıcak krem YALNIZCA burada. Sayfa zemini nötr gri kalıyor;
          kremi tüm sayfaya yaymak beyaz kartları sarımsı bir zemine
          oturtup kirli gösteriyor.

          Yapı qurio.academy'nin afişinden: büyük serif slogan, altında
          metodu üç sütunda açan kısa metin. Fotoğraf yerine tipografi —
          depoda kullanılabilecek bir görsel yok ve yer tutucu bir
          fotoğraf koymak sahte içerik olurdu. */}
      <div className="mb-6 overflow-hidden rounded-2xl border border-hairline bg-paper-warm">
        <div className="px-6 py-8 sm:px-10 sm:py-12">
          <p className="wordmark text-[26px] leading-tight text-ink sm:text-[34px]">
            Tek içerik, yedi katman,{' '}
            <span className="text-brand">kalıcı akıcılık</span>.
          </p>
          <p className="mt-3 max-w-[52ch] text-[13px] leading-relaxed text-ink-2">
            Aynı videoyu yedi kez, her seferinde başka bir duyuyla çalışırsın.
            Yeni içeriğe geçmek değil, aynı içeriği tüketmek akıcılığı kuruyor.
          </p>

          <div className="mt-8 grid gap-6 border-t border-ink/10 pt-6 sm:grid-cols-3">
            {[
              ['Oku', 'Anlam ağını Türkçe desteğiyle kur.'],
              ['Duy', 'Sesi yazıdan ayır, sonra görüntüden.'],
              ['Üret', 'Yaz ve konuş — tanımak yetmez.'],
            ].map(([title, body]) => (
              <div key={title}>
                <p className="wordmark text-[15px] text-ink">{title}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-2">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bölüm başlığı — Qurio'da bölüm adı marka renginde */}
      <div className="mb-4 flex items-baseline justify-between">
        <h1 className="text-[22px] font-semibold tracking-tight text-brand">Akış</h1>
        <span className="text-[12px] text-ink-3">
          {lessons.length} ders · {doneCount}/{CORE_LAYERS.length} katman
        </span>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">

        {/* ================= ORTA SÜTUN ================= */}
        <div className="space-y-5">

          {/* AKTİF ÇALIŞMA */}
          <Card className="p-5 sm:p-6">
            <span className="eyebrow">Aktif Çalışma</span>

            {activeLesson ? (
              <>
                <h2 className="mt-2 text-[19px] font-semibold leading-snug text-ink">
                  {activeLesson.title}
                </h2>
                <p className="mt-1 text-[12px] text-ink-3">
                  {[activeLesson.cefrLevel, `${activeLesson.sentences.length} cümle`]
                    .filter(Boolean).join(' · ')}
                </p>

                {/* Yedi adımın durumu — tek şerit */}
                <div className="mt-5 flex gap-1">
                  {CORE_LAYERS.map((l) => (
                    <span
                      key={l.id}
                      title={`Katman ${l.id}: ${l.label}`}
                      className={`h-1.5 flex-1 rounded-full ${
                        completedLayers.includes(l.id) ? 'bg-emerald-500' : 'bg-paper-3'
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => onSelectLayer(nextLayer.id)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5
                    text-[13px] font-medium text-white transition-colors duration-150
                    hover:bg-accent-700 cursor-pointer"
                >
                  Katman {CORE_LAYERS.indexOf(nextLayer) + 1}: {nextLayer.label}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <>
                <h2 className="mt-2 text-[19px] font-semibold leading-snug text-ink">
                  Henüz bir ders seçmedin
                </h2>
                <p className="mt-1 max-w-[46ch] text-[13px] leading-relaxed text-ink-2">
                  Katmanlar bir içerik üzerinde çalışıyor. Bir YouTube videosu ekle
                  ya da hazır derslerden birini seç.
                </p>
                <button
                  type="button"
                  onClick={onOpenLessonPicker}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5
                    text-[13px] font-medium text-white transition-colors duration-150
                    hover:bg-accent-700 cursor-pointer"
                >
                  Ders seç
                  <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </Card>

          {/* BUGÜNÜN NOTU (istekteki "Duyuru" kutusu) */}
          <Card className="p-5 sm:p-6">
            <span className="eyebrow">Bugünün Notu</span>
            <h2 className="mt-2 flex items-center gap-2 text-[16px] font-semibold text-ink">
              <span aria-hidden="true" className="text-[17px] leading-none">{nextLayer.emoji}</span>
              Katman {CORE_LAYERS.indexOf(nextLayer) + 1}: {nextLayer.label}
            </h2>
            <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-ink-2">
              {LAYER_NOTES[nextLayer.id]}
            </p>
            <button
              type="button"
              onClick={onOpenGuide}
              className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium
                text-brand transition-opacity hover:opacity-70 cursor-pointer"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Metodun tamamını oku
            </button>
          </Card>

          {/* YENİ İÇERİK (istekteki "Paylaşım Yap" kutusu) */}
          <Card className="flex items-center gap-3 p-4">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full
                bg-brand-soft text-[13px] font-semibold text-brand-strong"
            >
              K
            </span>
            <button
              type="button"
              onClick={onOpenLessonPicker}
              className="min-w-0 flex-1 rounded-xl bg-paper-3 px-4 py-2.5 text-left
                text-[13px] text-ink-3 transition-colors hover:bg-hairline cursor-pointer"
            >
              Yeni bir video ya da metin ekle…
            </button>
            <button
              type="button"
              onClick={onOpenLessonPicker}
              aria-label="Yeni ders ekle"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl
                text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink cursor-pointer"
            >
              <Plus className="h-4 w-4" />
            </button>
          </Card>
        </div>

        {/* ================= SAĞ PANEL ================= */}
        <aside className="space-y-5">

          {/* YAKLAŞAN TEKRARLAR — gerçek FSRS tarihleri */}
          <Card className="p-5">
            <span className="eyebrow">Yaklaşan Tekrarlar</span>

            {upcoming.length > 0 ? (
              <ul className="mt-3 space-y-3">
                {upcoming.map((g) => (
                  <li key={g.key} className="flex items-center gap-3">
                    {/* Tarih rozeti */}
                    <span
                      className={`flex h-11 w-11 shrink-0 flex-col items-center justify-center
                        rounded-xl border text-center leading-none
                        ${g.overdue
                          ? 'border-accent/25 bg-accent-soft text-accent'
                          : 'border-hairline text-ink-2'}`}
                    >
                      <span className="timecode text-[14px] font-semibold">
                        {g.date.getDate()}
                      </span>
                      <span className="mt-0.5 text-[9px] uppercase tracking-wide">
                        {AY_KISA[g.date.getMonth()]}
                      </span>
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium leading-tight text-ink">
                        {g.count} kart
                      </span>
                      <span className="block text-[11px] leading-tight text-ink-3">
                        {g.overdue
                          ? 'bugün tekrar edilmeli'
                          : g.key === todayKey ? 'bugün' : 'planlandı'}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
                Henüz kart yok. Katmanlarda bir kelimeyi seçip karta çevirdiğinde
                tekrar takvimi burada oluşmaya başlar.
              </p>
            )}

            <button
              type="button"
              onClick={() => onSelectLayer(10)}
              className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium
                text-brand transition-opacity hover:opacity-70 cursor-pointer"
            >
              <CalendarClock className="h-3.5 w-3.5" />
              Kelime bankasını aç
            </button>
          </Card>

          {/* ÇALIŞMA TAKVİMİ — son 14 gün */}
          <Card className="p-5">
            <span className="eyebrow">Çalışma Takvimi</span>
            <p className="mt-2 text-[13px] text-ink-2">
              <span className="timecode font-semibold text-ink">
                {progress.studyStreakDays}
              </span>{' '}
              günlük seri
            </p>

            <div className="mt-3 flex gap-1">
              {streakStrip.map((d) => (
                <span
                  key={d.key}
                  title={d.key}
                  className={`flex h-7 flex-1 items-center justify-center rounded-md
                    text-[9px] ${d.active
                      ? 'bg-emerald-500 font-semibold text-white'
                      : 'bg-paper-3 text-ink-3'}`}
                >
                  {d.day}
                </span>
              ))}
            </div>
          </Card>
        </aside>
      </div>
    </div>
  );
};
