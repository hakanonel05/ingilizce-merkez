/**
 * ANA MENÜ PANELİ (~260px)
 *
 * Sol kenar iki parçadan oluşuyor: dar ikon şeridi (IconRail) ve bu
 * panel. Ayrım qurio.academy'den: şerit uygulamanın TAMAMINA ait
 * (arama, yeni içerik), panel ise içinde bulunulan bölümün gezinmesi.
 *
 * ÜÇ GRUP, ÜÇ FARKLI İLİŞKİ:
 *
 *   KATMANLI ÇALIŞMA    Sıralı yedi adım. Numara taşıyorlar çünkü sıra
 *                       metodun kendisi — 3'ü 1'den önce yapmak yanlış.
 *   KAYNAKLAR & ARAÇLAR Sırası olmayan, istendiğinde açılan ekranlar.
 *   METOT & AYARLAR     Ekran değil PENCERE açan üç şey; bu yüzden
 *                       hiçbiri "aktif" duruma girmiyor. Bkz. SUPPORT_ITEMS.
 *
 * EMOJİ NEDEN VAR: normalde başlığa süs emoji takmak bu depoda yasak
 * (.claude/skills/frontend-design). Buradaki kullanım süs değil, sistemli
 * ikonografi: her satırda var, hepsi aynı ölçüde ve satırı bir bakışta
 * ayırt etmeye yarıyor. Katmanın lucide ikonu da duruyor — onu katman
 * başlığı (LayerHeaderBar) daha büyük ölçekte kullanıyor.
 */

import React from 'react';
import {
  BookOpen, Ear, Volume2, EyeOff, Headphones, Edit3, Mic,
  Sparkles, Layers, Award, ListX, CalendarRange,
  Check, X, Home,
} from 'lucide-react';

export interface LayerItem {
  id: number;
  label: string;
  subLabel: string;
  /** Katman başlığında kullanılır (LayerHeaderBar). */
  icon: React.ReactNode;
  /** Menü satırında kullanılır. */
  emoji: string;
}

/** Akış ekranının kimliği. Bir "katman" değil, uygulamanın girişi. */
export const HOME_LAYER = 0;

/** Metodolojinin çekirdeği: sırayla çalışılan yedi katman. */
export const CORE_LAYERS: LayerItem[] = [
  { id: 1, label: 'Metin Okuma & Anlama',    subLabel: 'Anlam ağlarını oturtma',  emoji: '📖', icon: <BookOpen className="w-4 h-4" /> },
  { id: 2, label: 'Aktif Dinleme',           subLabel: 'Sesi yazıyla eşleştirme', emoji: '🎧', icon: <Ear className="w-4 h-4" /> },
  { id: 3, label: 'Sesli Okuma & Shadowing', subLabel: 'Gölgeleme',               emoji: '🗣️', icon: <Volume2 className="w-4 h-4" /> },
  { id: 4, label: 'Altyazısız İzleme',       subLabel: 'Anlama kontrolü',         emoji: '🎬', icon: <EyeOff className="w-4 h-4" /> },
  { id: 5, label: 'Sadece Dinleme',          subLabel: 'Görselsiz ses modu',      emoji: '👂', icon: <Headphones className="w-4 h-4" /> },
  { id: 6, label: 'Yazma & Cümle Kurma',     subLabel: 'Özet ve yorum',           emoji: '✍️', icon: <Edit3 className="w-4 h-4" /> },
  { id: 7, label: 'Sesli Anlatım',           subLabel: 'Konuşma simülasyonu',     emoji: '💡', icon: <Mic className="w-4 h-4" /> },
];

/** Sırası olmayan yardımcı çalışmalar. */
export const TOOL_LAYERS: LayerItem[] = [
  { id: 10, label: 'Kelime & Cümle Bankası', subLabel: 'FSRS aralıklı tekrar',   emoji: '🗂️', icon: <Layers className="w-4 h-4" /> },
  { id: 8,  label: 'Fonetik & Gramer',       subLabel: 'Genelden özele analiz',  emoji: '🔤', icon: <Sparkles className="w-4 h-4" /> },
  { id: 11, label: 'Çalışma Notları',        subLabel: 'Yanlışlar defteri',      emoji: '📝', icon: <ListX className="w-4 h-4" /> },
  { id: 9,  label: 'Süreç & Hedefler',       subLabel: 'İlerleme panosu',        emoji: '📊', icon: <Award className="w-4 h-4" /> },
  { id: 12, label: 'Karne',                  subLabel: 'Haftalık çalışma özeti', emoji: '🗓️', icon: <CalendarRange className="w-4 h-4" /> },
];

/**
 * ÜÇÜNCÜ GRUP — "TOPLULUK" DEĞİL.
 *
 * Burada önce Soru & Cevap / Haftalık Challenge / Çalışma Odası vardı:
 * referans aldığımız topluluk platformundan birebir kopyaydılar ve bu
 * uygulamada karşılıkları YOKTU (ortada ne kullanıcı tablosu, ne gönderi,
 * ne canlı seans var — Supabase yalnızca kendi ilerlemeni cihazlar arası
 * taşıyor). Üçü de kapalı satır olarak duruyordu.
 *
 * Yerlerini ZATEN ÇALIŞAN üç şey aldı. Üçü de bugüne kadar yalnızca üst
 * çubuktaki küçük, etiketsiz ikonlardan açılıyordu — yani vardılar ama
 * bulunmuyorlardı. Menüde adlarıyla durmaları hem kopyayı kaldırıyor hem
 * de gerçek bir keşfedilebilirlik sorununu çözüyor.
 */
export interface SupportItem {
  key: 'guide' | 'coach' | 'settings';
  label: string;
  emoji: string;
}

export const SUPPORT_ITEMS: SupportItem[] = [
  { key: 'guide',    label: 'Metot Rehberi',  emoji: '📘' },
  { key: 'coach',    label: 'Gramer Koçu',    emoji: '✨' },
  { key: 'settings', label: 'Ayarlar & Senkronizasyon', emoji: '⚙️' },
];

/** Geriye dönük uyum: App.tsx ve eski kod bu listeyi bekliyor. */
export const LAYER_TABS: LayerItem[] = [...CORE_LAYERS, ...TOOL_LAYERS];
export const CORE_LAYER_COUNT = 7;

/** Bir katmanın başlığını dışarıdan (üst çubuk vb.) okumak için. */
export function findLayer(id: number): LayerItem | undefined {
  return LAYER_TABS.find((l) => l.id === id);
}

interface Props {
  activeLayer: number;
  onSelectLayer: (id: number) => void;
  completedLayers: number[];
  /** Ders seçili değilken katmanlar çalışmaz; sebebi gösteriliyor. */
  hasLesson: boolean;
  /** Dar ekranda çekmece olarak açılır. */
  isOpen: boolean;
  onClose: () => void;
  /** Üçüncü gruptaki pencereler — bkz. SUPPORT_ITEMS notu. */
  onOpenGuide: () => void;
  onOpenGrammarCoach: () => void;
  onOpenSettings: () => void;
}

/** Grup başlığı — sakin, küçük, kapital. */
const GroupLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="eyebrow block px-3 pb-1.5 pt-1">{children}</span>
);

export const LayerSidebar: React.FC<Props> = ({
  activeLayer, onSelectLayer, completedLayers, hasLesson, isOpen, onClose,
  onOpenGuide, onOpenGrammarCoach, onOpenSettings,
}) => {
  const doneCount = CORE_LAYERS.filter((l) => completedLayers.includes(l.id)).length;

  const supportHandlers: Record<SupportItem['key'], () => void> = {
    guide: onOpenGuide,
    coach: onOpenGrammarCoach,
    settings: onOpenSettings,
  };

  /**
   * Tek bir menü satırı.
   *
   * Aktif satır dolu menekşe; geri kalan her şey nötr. Panelde ikinci bir
   * vurgu rengi YOK — turuncu yalnızca markaya ait (bkz. index.css).
   */
  const renderItem = (item: LayerItem, index: number | null) => {
    const isActive = activeLayer === item.id;
    const isDone = completedLayers.includes(item.id);
    // Araçlar (id >= 8) ders olmadan da anlamlı; katmanlar değil.
    const isDisabled = item.id < 8 && !hasLesson;

    return (
      <button
        key={item.id}
        type="button"
        disabled={isDisabled}
        onClick={() => { onSelectLayer(item.id); onClose(); }}
        aria-current={isActive ? 'step' : undefined}
        title={item.subLabel}
        className={`group flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left
          text-[13px] transition-colors duration-150
          ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          ${isActive
            ? 'bg-accent font-medium text-white'
            : 'text-ink hover:bg-paper-3'}`}
      >
        <span aria-hidden="true" className="w-5 shrink-0 text-center text-[15px] leading-none">
          {item.emoji}
        </span>

        <span className="min-w-0 flex-1 truncate">
          {index !== null && (
            <span className={isActive ? 'text-white/70' : 'text-ink-3'}>
              Katman {index}:{' '}
            </span>
          )}
          {item.label}
        </span>

        {isDone && !isActive && (
          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" strokeWidth={3} />
        )}
      </button>
    );
  };

  return (
    <>
      {/* Dar ekranda çekmecenin arkasındaki karartma */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Açılıp kapanmayı `layer-drawer` sınıfı yönetiyor (index.css);
          durumu tek bir data niteliği taşıyor.

          SOL `0` OLMAK ZORUNDA. Bir ara `left-16` yazılmıştı, "dar ekranda
          ikon şeridinin üstünü kapatmasın" diye — ama şerit zaten `lg`
          altında gizli, yani o kaydırma hiçbir işe yaramıyordu. Yaptığı
          tek şey kapalı çekmeceyi ekrana sokmaktı: kapalı hâl kendi
          genişliği kadar (-276px) ötelendiği için, 64px'ten başlayınca sağ
          kenarı ekranda kalıyor ve panel sürekli 64px görünüyordu. */}
      <aside
        aria-label="Bölümler"
        data-open={isOpen ? 'true' : 'false'}
        className="layer-drawer fixed left-0 top-0 z-50 h-full w-[var(--sidebar-w)] shrink-0
          border-r border-hairline bg-paper-2
          lg:sticky lg:top-16 lg:z-20 lg:h-[calc(100dvh-4rem)]"
      >
        <div className="flex h-full flex-col overflow-y-auto px-3 pb-6 pt-4">

          {/* Çekmece kapatma — yalnızca dar ekranda */}
          <div className="mb-1 flex items-center justify-between px-3 lg:hidden">
            <span className="text-sm font-semibold text-ink">Bölümler</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="rounded-lg p-1.5 text-ink-3 transition-colors hover:bg-paper-3 hover:text-ink cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* AKIŞ — panelin tek dolu düğmesi, en üstte */}
          <button
            type="button"
            onClick={() => { onSelectLayer(HOME_LAYER); onClose(); }}
            aria-current={activeLayer === HOME_LAYER ? 'page' : undefined}
            className={`mb-4 flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5
              text-[13px] font-medium transition-colors duration-150 cursor-pointer
              ${activeLayer === HOME_LAYER
                ? 'bg-accent text-white'
                : 'text-ink hover:bg-paper-3'}`}
          >
            <Home className="h-4 w-4 shrink-0" />
            Akış
          </button>

          {/* Çekirdek adımlar */}
          <div className="flex items-center justify-between px-3 pb-1.5">
            <span className="eyebrow">Katmanlı Çalışma</span>
            <span className="timecode text-ink-3">{doneCount}/{CORE_LAYERS.length}</span>
          </div>

          {/* İlerleme: yedi adımın kaçı bitti */}
          <div className="mx-3 mb-2 h-1 overflow-hidden rounded-full bg-paper-3">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${(doneCount / CORE_LAYERS.length) * 100}%` }}
            />
          </div>

          <div className="space-y-px">
            {CORE_LAYERS.map((item, i) => renderItem(item, i + 1))}
          </div>

          {/* Yardımcı araçlar */}
          <div className="mt-5">
            <GroupLabel>Kaynaklar &amp; Araçlar</GroupLabel>
            <div className="space-y-px">
              {TOOL_LAYERS.map((item) => renderItem(item, null))}
            </div>
          </div>

          {/* Metot & Ayarlar — yukarıdaki SUPPORT_ITEMS notuna bak.
              Bunlar bir katman değil, pencere açıyorlar; o yüzden hiçbiri
              "aktif" duruma girmiyor ve seçili satır gibi görünmüyor. */}
          <div className="mt-5">
            <GroupLabel>Metot &amp; Ayarlar</GroupLabel>
            <div className="space-y-px">
              {SUPPORT_ITEMS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => { supportHandlers[item.key](); onClose(); }}
                  className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left
                    text-[13px] text-ink transition-colors duration-150
                    hover:bg-paper-3 cursor-pointer"
                >
                  <span aria-hidden="true" className="w-5 shrink-0 text-center text-[15px] leading-none">
                    {item.emoji}
                  </span>
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {!hasLesson && (
            <p className="mt-auto px-3 pt-6 text-[11px] leading-relaxed text-ink-3">
              Katmanlar bir ders seçilince açılır. Üstteki
              {' '}<span className="text-ink-2">Dersler</span>{' '}
              menüsünden bir ders seç ya da yeni bir video ekle.
            </p>
          )}
        </div>
      </aside>
    </>
  );
};
