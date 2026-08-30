/**
 * KATMAN NAVİGASYONU — DİKEY ADIM LİSTESİ
 *
 * Eskiden 11 sekme sayfanın ortasına yatay bir şerit halinde
 * yayılıyordu. Üç ayrı sorunu vardı:
 *
 *   1. Her sekmeye ~130px düşüyordu; başlıklar kırpılıyor, alt
 *      açıklamalar okunmuyordu.
 *   2. Metot SIRALI yedi adımdan oluşuyor ama yatay şerit bunu
 *      göstermiyordu — 7 çekirdek katman ile yardımcı araçlar aynı
 *      görsel ağırlıktaydı.
 *   3. Şerit metnin üstünde yer kaplıyor, asıl çalışma alanını
 *      aşağı itiyordu.
 *
 * Dikey liste üçünü de çözüyor: adımlar alt alta olduğu için sıra
 * kendiliğinden okunuyor, her satırda başlık + açıklama + durum
 * rahatça sığıyor ve orta alan tamamen çalışmaya kalıyor.
 *
 * ARAÇLAR AYRI GRUPTA: Fonetik & Gramer, Kelime Kartları, İlerleme
 * Panosu ve Yanlışlar Defteri metodolojinin adımı değil; bir sıraları
 * yok, istendiğinde açılıyorlar. Ayrı başlık altında toplanmaları bu
 * farkı görünür kılıyor.
 */

import React from 'react';
import {
  BookOpen, Ear, Volume2, EyeOff, Headphones, Edit3, Mic,
  Sparkles, Layers, Award, ListX, Check, X,
} from 'lucide-react';

export interface LayerItem {
  id: number;
  label: string;
  subLabel: string;
  icon: React.ReactNode;
}

/** Metodolojinin çekirdeği: sırayla çalışılan yedi katman. */
export const CORE_LAYERS: LayerItem[] = [
  { id: 1, label: 'Çift Dilli Okuma',   subLabel: 'Anlam ağlarını oturtma',   icon: <BookOpen className="w-4 h-4" /> },
  { id: 2, label: 'Aktif Dinleme',      subLabel: 'Sesi yazıyla eşleştirme',  icon: <Ear className="w-4 h-4" /> },
  { id: 3, label: 'Sesli Okuma',        subLabel: 'Gölgeleme (shadowing)',    icon: <Volume2 className="w-4 h-4" /> },
  { id: 4, label: 'Altyazısız İzleme',  subLabel: 'Anlama kontrolü',          icon: <EyeOff className="w-4 h-4" /> },
  { id: 5, label: 'Sadece Dinleme',     subLabel: 'Görselsiz ses modu',       icon: <Headphones className="w-4 h-4" /> },
  { id: 6, label: 'Özet & Yorum',       subLabel: 'İngilizce yazma',          icon: <Edit3 className="w-4 h-4" /> },
  { id: 7, label: 'Sesli Anlatım',      subLabel: 'Konuşma simülasyonu',      icon: <Mic className="w-4 h-4" /> },
];

/** Sırası olmayan yardımcı çalışmalar. */
export const TOOL_LAYERS: LayerItem[] = [
  { id: 8,  label: 'Fonetik & Gramer',  subLabel: 'Genelden özele analiz',    icon: <Sparkles className="w-4 h-4" /> },
  { id: 10, label: 'Kelime Kartları',   subLabel: 'FSRS aralıklı tekrar',     icon: <Layers className="w-4 h-4" /> },
  { id: 9,  label: 'Süreç & Hedefler',  subLabel: 'İlerleme panosu',          icon: <Award className="w-4 h-4" /> },
  { id: 11, label: 'Yanlışlar Defteri', subLabel: 'Hatalı sorular',           icon: <ListX className="w-4 h-4" /> },
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
}

export const LayerSidebar: React.FC<Props> = ({
  activeLayer, onSelectLayer, completedLayers, hasLesson, isOpen, onClose,
}) => {
  const doneCount = CORE_LAYERS.filter((l) => completedLayers.includes(l.id)).length;

  /** Tek bir adım satırı. Çekirdek katmanlar numaralı, araçlar değil. */
  const renderItem = (item: LayerItem, index: number | null) => {
    const isActive = activeLayer === item.id;
    const isDone = completedLayers.includes(item.id);
    // Panolar ders olmadan da anlamlı; katmanlar değil.
    const needsLesson = item.id !== 9 && item.id !== 10 && item.id !== 11;
    const isDisabled = needsLesson && !hasLesson;

    return (
      <button
        key={item.id}
        type="button"
        disabled={isDisabled}
        onClick={() => { onSelectLayer(item.id); onClose(); }}
        aria-current={isActive ? 'step' : undefined}
        className={`group w-full flex items-start gap-3 rounded-xl px-3 py-2.5 text-left
          transition-all duration-200 ease-in-out
          ${isDisabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
          ${isActive
            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
            : 'text-slate-700 hover:bg-slate-100'}`}
      >
        {/* Adım göstergesi: numara, tamamlandıysa onay işareti */}
        <span
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold
            transition-colors duration-200
            ${isActive
              ? 'bg-white/20 text-white'
              : isDone
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-slate-100 text-slate-600 group-hover:bg-white'}`}
        >
          {isDone && !isActive
            ? <Check className="w-3.5 h-3.5" strokeWidth={3} />
            : index !== null
              ? index
              : <span className={isActive ? 'text-white' : 'text-slate-500'}>{item.icon}</span>}
        </span>

        <span className="min-w-0 flex-1">
          <span className={`flex items-center gap-1.5 text-[13px] font-medium leading-tight
            ${isActive ? 'text-white' : 'text-slate-900'}`}>
            <span className="truncate">{item.label}</span>
            {isDone && !isActive && (
              <Check className="w-3 h-3 shrink-0 text-emerald-600" strokeWidth={3} />
            )}
          </span>
          {/* slate-400 beyaz üzerinde 2.63 kontrast veriyor; bu satır
              okunması gereken bir açıklama, dekorasyon değil. */}
          <span className={`mt-0.5 block truncate text-[11px] leading-tight
            ${isActive ? 'text-indigo-100' : 'text-slate-500'}`}>
            {item.subLabel}
          </span>
        </span>
      </button>
    );
  };

  return (
    <>
      {/* Dar ekranda çekmecenin arkasındaki karartma */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Açılıp kapanmayı `layer-drawer` sınıfı yönetiyor (index.css);
          durumu tek bir data niteliği taşıyor. */}
      <aside
        aria-label="Katmanlar"
        data-open={isOpen ? 'true' : 'false'}
        className="layer-drawer fixed z-50 top-0 left-0 h-full w-[var(--sidebar-w)] shrink-0
          border-r border-slate-200 bg-white
          lg:sticky lg:top-16 lg:z-20 lg:h-[calc(100dvh-4rem)]"
      >
        <div className="flex h-full flex-col overflow-y-auto">

          {/* Çekmece başlığı — yalnızca dar ekranda */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 lg:hidden">
            <span className="text-sm font-semibold text-slate-900">Katmanlar</span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Çekirdek adımlar */}
          <div className="px-3 pt-4 pb-2">
            <div className="flex items-center justify-between px-3 pb-2">
              <span className="eyebrow">Çalışma Adımları</span>
              <span className="timecode text-slate-500">{doneCount}/{CORE_LAYERS.length}</span>
            </div>

            {/* İlerleme: yedi adımın kaçı bitti */}
            <div className="mx-3 mb-3 h-1 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
                style={{ width: `${(doneCount / CORE_LAYERS.length) * 100}%` }}
              />
            </div>

            <div className="space-y-0.5">
              {CORE_LAYERS.map((item, i) => renderItem(item, i + 1))}
            </div>
          </div>

          {/* Yardımcı araçlar */}
          <div className="mt-2 border-t border-slate-200 px-3 pt-4 pb-6">
            <span className="eyebrow block px-3 pb-2">Araçlar</span>
            <div className="space-y-0.5">
              {TOOL_LAYERS.map((item) => renderItem(item, null))}
            </div>
          </div>

          {!hasLesson && (
            <p className="mt-auto border-t border-slate-200 px-6 py-4 text-[11px] leading-relaxed text-slate-500">
              Katmanlar bir ders seçilince açılır. Üstteki ders seçiciden
              bir ders seç ya da yeni bir video ekle.
            </p>
          )}
        </div>
      </aside>
    </>
  );
};
