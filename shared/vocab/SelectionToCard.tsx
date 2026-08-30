import React, { useState, useEffect, useRef } from 'react';
import { buildCard, addCardsIfMissing, CardKind, CardLevel } from './vocabStore';
import { resolveCardMeta, LEVEL_SOURCE_LABELS, LevelSource } from './autoClassify';
import { PartOfSpeech, POS_ORDER, POS_LABELS_TR } from './pos';
import { CEFR_ORDER } from './cefr';
import { apiFetch } from './userKeys';
import { Plus, Loader2, Check, X, Layers, Wand2 } from 'lucide-react';

interface Props {
  /** Seçimin dinleneceği alan. */
  containerRef: React.RefObject<HTMLElement | null>;
  lessonId: string;
  lessonTitle: string;
  /** Kart eklendikten sonra üst bileşeni bilgilendirmek için. */
  onAdded?: () => void;
}

interface Draft {
  front: string;
  back: string;
  ipa?: string;
  kind: CardKind;
  level: CardLevel;
  /** Söz türü: isim / fiil / sıfat... Otomatik belirlenir. */
  pos: PartOfSpeech;
  /** Seviyenin nereden geldiği — kullanıcıya "neden bu seviye" diye göstermek için. */
  levelSource: LevelSource;
  exampleEn?: string;
  exampleTr?: string;
  contextEn?: string;
}

/**
 * Metinde bir kelime/ifade seçildiğinde yanında "Karta Ekle" düğmesi çıkarır.
 *
 * ORTAK BİLEŞEN: hem katmanlı (transkript) hem reading (okuma parçası)
 * kullanır. İki uygulama aynı origin altında aynı kart bankasını
 * paylaştığı için nereden eklenirse eklensin kart tek destede birikir.
 * Düğmeye basılınca yapay zeka o ifadeyi BAĞLAMINA göre tanımlar ve kart
 * taslağı açılır; onaylayınca kelime kartlarına eklenir.
 */
export const SelectionToCard: React.FC<Props> = ({
  containerRef,
  lessonId,
  lessonTitle,
  onAdded,
}) => {
  /**
   * Seçim balonu. Bağlam cümlesi BURADA saklanıyor, tıklama anında değil:
   * telefonda düğmeye dokunmak seçimi düşürebiliyor ve o anda okunmaya
   * çalışılan seçim çoktan yok oluyordu.
   */
  const [selection, setSelection] = useState<
    { text: string; context: string; x: number; y: number } | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const bubbleRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleSelection = (event?: Event) => {
      // Taslak paneli açıkken seçim balonunu güncelleme
      if (draft || isLoading) return;

      // Balonun kendisine dokunulduysa seçimi bozma: mobilde dokunuş
      // seçimi daraltıyor, balon anında kayboluyor ve tıklama hiç
      // gerçekleşmiyordu.
      const target = event?.target as Node | null;
      if (target && bubbleRef.current?.contains(target)) return;

      const sel = window.getSelection();
      if (!sel || sel.isCollapsed) {
        setSelection(null);
        return;
      }

      const text = sel.toString().trim();
      if (!text || text.length > 120) {
        setSelection(null);
        return;
      }

      // Yalnızca ilgili alandaki seçimleri dikkate al
      const container = containerRef.current;
      if (container && sel.anchorNode && !container.contains(sel.anchorNode)) {
        setSelection(null);
        return;
      }

      try {
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        setSelection({
          text,
          context: captureContext(),
          x: rect.left + rect.width / 2,
          y: rect.top,
        });
      } catch {
        setSelection(null);
      }
    };

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);
    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
    };
  }, [containerRef, draft, isLoading]);

  /** Seçimin geçtiği cümleyi bağlam olarak yakala. */
  const captureContext = (): string => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return '';
    const node = sel.anchorNode;
    const el = node?.nodeType === Node.TEXT_NODE ? node.parentElement : (node as HTMLElement | null);
    return (el?.textContent || '').slice(0, 400);
  };

  const handleLookup = async () => {
    if (!selection) return;
    const term = selection.text;
    const context = selection.context;

    setIsLoading(true);
    setError(null);

    try {
      const res = await apiFetch('/api/define-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: term, context }),
      });

      const raw = await res.text();
      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error('Sunucu beklenmeyen bir yanıt döndürdü.');
      }
      if (!res.ok) throw new Error(data.error || 'Kelime bilgisi alınamadı.');

      const front = data.front || term;
      // Seviye/tür/söz türü OTOMATİK: önce yerel CEFR listesi, o bilmiyorsa
      // yapay zekanın yanıtı, o da yoksa biçimsel tahmin. Eskiden burada
      // sabit 'B2' vardı ve her kart B2 olarak açılıyordu.
      const meta = resolveCardMeta(front, {
        level: data.level,
        kind: data.kind,
        pos: data.pos,
        context: context || data.exampleEn,
      });

      setDraft({
        front,
        back: data.back || '',
        ipa: data.ipa,
        kind: meta.kind,
        level: meta.level,
        pos: meta.pos,
        levelSource: meta.levelSource,
        exampleEn: data.exampleEn,
        exampleTr: data.exampleTr,
        contextEn: context,
      });
      setSelection(null);
    } catch (err: any) {
      setError(err?.message || 'Kelime bilgisi alınamadı.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    try {
      const card = buildCard({
        lessonId,
        lessonTitle,
        front: draft.front,
        back: draft.back,
        ipa: draft.ipa,
        kind: draft.kind,
        level: draft.level,
        pos: draft.pos,
        exampleEn: draft.exampleEn,
        exampleTr: draft.exampleTr,
        contextEn: draft.contextEn,
      });
      const added = await addCardsIfMissing([card]);
      setDraft(null);
      setSavedMsg(
        added > 0
          ? `"${card.front}" → ${lessonTitle} dersine eklendi`
          : `"${card.front}" zaten bu derste kayıtlı`
      );
      window.getSelection()?.removeAllRanges();
      onAdded?.();
      setTimeout(() => setSavedMsg(null), 3000);
    } catch (err: any) {
      setError(err?.message || 'Kart eklenemedi.');
    }
  };

  return (
    <>
      {/* Seçim balonu */}
      {selection && !draft && (
        <button
          type="button"
          ref={bubbleRef}
          onClick={handleLookup}
          disabled={isLoading}
          style={{
            position: 'fixed',
            left: Math.max(80, Math.min(window.innerWidth - 80, selection.x)),
            top: Math.max(8, selection.y - 44),
            transform: 'translateX(-50%)',
            zIndex: 60,
          }}
          className="flex items-center space-x-1.5 px-3 py-2 bg-accent hover:bg-accent-700 text-white text-xs font-bold rounded-lg shadow-lg transition cursor-pointer whitespace-nowrap"
        >
          {isLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Plus className="w-3.5 h-3.5" />
          )}
          <span>Karta Ekle</span>
        </button>
      )}

      {/* Taslak paneli */}
      {draft && (
        <div className="fixed inset-0 bg-slate-900/40 z-[70] flex items-center justify-center p-4">
          <div
            ref={panelRef}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 space-y-3 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                <Layers className="w-4 h-4 text-accent" />
                <span>Kelime Kartı Ekle</span>
              </h3>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="p-1 text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">İfade</label>
              <input
                type="text"
                value={draft.front}
                onChange={(e) => setDraft({ ...draft, front: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-bold text-slate-900 focus:outline-none focus:border-accent"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">Türkçe karşılık</label>
              <input
                type="text"
                value={draft.back}
                onChange={(e) => setDraft({ ...draft, back: e.target.value })}
                placeholder="Anlamı"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-accent"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Seviye</label>
                <select
                  value={draft.level}
                  onChange={(e) =>
                    setDraft({ ...draft, level: e.target.value as CardLevel, levelSource: 'ai' })
                  }
                  className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {CEFR_ORDER.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Söz türü</label>
                <select
                  value={draft.pos}
                  onChange={(e) => setDraft({ ...draft, pos: e.target.value as PartOfSpeech })}
                  className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  {POS_ORDER.map((p) => (
                    <option key={p} value={p}>{POS_LABELS_TR[p]}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-600">Tür</label>
                <select
                  value={draft.kind}
                  onChange={(e) => setDraft({ ...draft, kind: e.target.value as CardKind })}
                  className="w-full px-2 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  <option value="word">Kelime</option>
                  <option value="phrasal_verb">Phrasal Verb</option>
                  <option value="collocation">Kalıp</option>
                  <option value="idiom">Deyim</option>
                  <option value="expression">Konuşma Kalıbı</option>
                </select>
              </div>
            </div>

            {/* Alanların elle doldurulması gerekmediğini gösterir */}
            <p className="flex items-start space-x-1.5 text-[10px] text-accent bg-accent-soft border border-accent/20 rounded px-2 py-1.5">
              <Wand2 className="w-3 h-3 shrink-0 mt-0.5" />
              <span>
                Seviye, söz türü ve tür otomatik belirlendi
                {draft.levelSource !== 'ai' && ` (seviye: ${LEVEL_SOURCE_LABELS[draft.levelSource]})`}
                . Yanlışsa değiştirebilirsiniz.
              </span>
            </p>

            {draft.exampleEn && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 space-y-0.5">
                <p className="text-xs text-slate-900 font-medium">{draft.exampleEn}</p>
                {draft.exampleTr && <p className="text-[11px] text-slate-600">{draft.exampleTr}</p>}
              </div>
            )}

            <p className="text-[10px] text-slate-500">
              Kart <strong>{lessonTitle}</strong> dersine eklenecek. Kelime Kartları
              sekmesinde &quot;Bu Ders&quot; veya &quot;Tüm Kartlar&quot; altında görünür.
            </p>

            {error && (
              <p className="text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 rounded px-2.5 py-1.5">
                {error}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleSave}
                disabled={!draft.front.trim() || !draft.back.trim()}
                className="flex-1 flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-accent hover:bg-accent-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Kartlarıma Ekle</span>
              </button>
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hata bildirimi.

          Hata eskiden YALNIZCA taslak panelinin içinde gösteriliyordu;
          arama başarısız olunca panel hiç açılmadığı için (anahtar yok,
          kota dolu, ağ hatası) kullanıcı düğmeye basıyor ve hiçbir şey
          olmuyor sanıyordu. Panel yokken de görünür. */}
      {error && !draft && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] max-w-[92vw] flex items-start gap-2 px-4 py-2.5 bg-rose-50 border border-rose-200 text-rose-900 text-xs font-semibold rounded-xl shadow-lg">
          <span className="leading-relaxed">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="shrink-0 text-rose-700 hover:text-rose-900 cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Kaydedildi bildirimi */}
      {savedMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] flex items-center space-x-2 px-4 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl shadow-lg">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{savedMsg}</span>
        </div>
      )}
    </>
  );
};
