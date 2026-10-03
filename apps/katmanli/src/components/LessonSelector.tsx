/**
 * DERS LİSTESİ VE İÇE AKTARMA
 *
 * KENDİ KARTI VE BAŞLIĞI YOK. Bu bileşen yalnızca LessonPickerModal'ın
 * içinde kullanılıyor; pencere zaten kenarlıklı beyaz bir yüzey ve
 * "Çalışma İçeriği" başlığı taşıyor. Burada bir kart ve "Çalışma İçeriği
 * Seçimi" başlığı daha vardı: kutu içinde kutu, üst üste iki başlık.
 *
 * VİDEO KAPAKLI IZGARA. Bir süre metin satırlarından oluşan bir listeydi;
 * dersler videoya dayandığı halde hiçbiri görsel olarak tanınmıyordu ve
 * satırda yalnızca açık olan ders için "aktif" yazıyordu — hangi dersin
 * ne kadarı bitti, sırada ne var, hiçbiri görünmüyordu. Şimdi her ders
 * YouTube kapağıyla (izlenen kısım şeridi gibi alt kenarda bir ilerleme
 * çubuğu) ve "3/7 katman tamamlandı · Sıradaki: …" satırıyla duruyor.
 * Başlıklar iki satıra kadar açılıyor, kırpılma sorunu geri gelmesin.
 *
 * SEVİYE ROZETİ RENKSİZ. Önce C1/C2 mor, B2 kehribar, gerisi yeşildi —
 * paletin dışından üç renk. Seviye zaten HARFİN KENDİSİNDE yazıyor;
 * renk bunun üstüne bilgi eklemiyor, yalnızca listeyi alacalı yapıyordu.
 */

import React, { useMemo, useState } from 'react';
import { VideoLesson } from '../types';
import { lessonComputedLevel } from '../lib/lessonInsight';
import { useCardMatcher, lessonCardTerms } from '../lib/cardTerms';
import { extractYouTubeId } from '../lib/youtube';
import { CORE_LAYERS, CORE_LAYER_COUNT } from './shell/LayerSidebar';
import {
  Youtube, Sparkles, Plus, Loader2, Check, Trash2, FileText, Edit3, RefreshCw, X, Play,
} from 'lucide-react';

/**
 * Dersin nerede kaldigini cumleye cevirir.
 * Eskiden satirda yalnizca secili ders icin "aktif" yaziyordu: hangi
 * dersin ne kadarinin bittigi, siradaki adimin ne oldugu hicbir yerde
 * gorunmuyordu. "Aktif" de "su an acik olan" demekti, "devam eden"
 * degil — iki anlam karisiyordu.
 */
function lessonStatus(lesson: VideoLesson): {
  done: number;
  finished: boolean;
  label: string;
  next: string | null;
} {
  const completed = new Set(lesson.completedLayers || []);
  const done = CORE_LAYERS.filter((l) => completed.has(l.id)).length;
  const finished = done >= CORE_LAYER_COUNT;
  const nextLayer = CORE_LAYERS.find((l) => !completed.has(l.id));
  const next = nextLayer ? `${nextLayer.id}. ${nextLayer.label}` : null;

  if (finished) return { done, finished, label: '7 katmanın hepsi tamamlandı', next: null };
  if (done === 0) return { done, finished, label: 'Henüz başlanmadı', next };
  return { done, finished, label: `${done}/${CORE_LAYER_COUNT} katman tamamlandı`, next };
}

interface LessonSelectorProps {
  lessons: VideoLesson[];
  activeLesson?: VideoLesson | null;
  onSelectLesson: (lesson: VideoLesson) => void;
  onImportCustomLesson: (
    input: string,
    youtubeUrl?: string,
    onProgress?: (message: string) => void
  ) => Promise<void>;
  onDeleteLesson?: (lessonId: string) => void;
  onEditLesson?: (lesson: VideoLesson) => void;
  onRestorePresetLessons?: () => void;
}

/** Birincil eylem düğmesi — dolu menekşe, gölgesiz. */
const primaryButton =
  `inline-flex items-center justify-center gap-1.5 rounded-xl bg-accent px-4 py-2
   text-[13px] font-medium text-white transition-colors duration-150
   hover:bg-accent-700 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer`;

/** Metin girişleri: tek bir tanım, dört yerde tekrarlanmasın diye. */
const inputClass =
  `w-full rounded-xl border border-hairline bg-paper-2 px-3.5 py-2.5 text-[13px]
   text-ink placeholder-ink-3 transition-colors
   focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15`;

export const LessonSelector: React.FC<LessonSelectorProps> = ({
  lessons,
  activeLesson,
  onSelectLesson,
  onImportCustomLesson,
  onDeleteLesson,
  onEditLesson,
  onRestorePresetLessons,
}) => {
  const [inputMode, setInputMode] = useState<'youtube' | 'text'>('youtube');

  // Her dersin transkripti ve test soruları kart kelimeleri için taranıyor;
  // kartlar değişince (useCardMatcher) liste kendiliğinden tazeleniyor.
  const cardMatcher = useCardMatcher();
  const cardTermsByLesson = useMemo(() => {
    const out = new Map<string, string[]>();
    for (const l of lessons) out.set(l.id, lessonCardTerms(l, cardMatcher));
    return out;
  }, [lessons, cardMatcher]);
  const [youtubeInput, setYoutubeInput] = useState('');
  const [manualYoutubeUrl, setManualYoutubeUrl] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [progressMsg, setProgressMsg] = useState('');
  const [showImportForm, setShowImportForm] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  // Kapagi yuklenemeyen videolar (silinmis, gizli, cevrimdisi): kirik resim yerine yedek
  const [brokenThumbs, setBrokenThumbs] = useState<Set<string>>(() => new Set());

  const summary = useMemo(() => {
    let inProgress = 0;
    let finished = 0;
    for (const l of lessons) {
      const st = lessonStatus(l);
      if (st.finished) finished++;
      else if (st.done > 0) inProgress++;
    }
    return { inProgress, finished };
  }, [lessons]);

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMode === 'youtube') {
      if (!youtubeInput.trim()) return;
      setIsLoading(true);
      setErrorMsg('');
      setProgressMsg('Başlatılıyor...');
      try {
        await onImportCustomLesson(youtubeInput.trim(), undefined, setProgressMsg);
        setYoutubeInput('');
        setShowImportForm(false);
      } catch (err: any) {
        setErrorMsg(err.message || 'Video işlenirken hata oluştu.');
      } finally {
        setIsLoading(false);
        setProgressMsg('');
      }
    } else {
      if (!textInput.trim()) return;
      setIsLoading(true);
      setErrorMsg('');
      setProgressMsg('Başlatılıyor...');
      try {
        await onImportCustomLesson(
          textInput.trim(),
          manualYoutubeUrl.trim() || youtubeInput.trim(),
          setProgressMsg
        );
        setTextInput('');
        setManualYoutubeUrl('');
        setYoutubeInput('');
        setShowImportForm(false);
      } catch (err: any) {
        setErrorMsg(err.message || 'Metin işlenirken hata oluştu.');
      } finally {
        setIsLoading(false);
        setProgressMsg('');
      }
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, lessonId: string) => {
    e.stopPropagation();
    setConfirmingDeleteId(lessonId);
  };

  const handleConfirmDelete = (e: React.MouseEvent, lessonId: string) => {
    e.stopPropagation();
    if (onDeleteLesson) onDeleteLesson(lessonId);
    setConfirmingDeleteId(null);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmingDeleteId(null);
  };

  /** İçe aktarma biçimi sekmesi — sade metin, dolu düğme değil. */
  const modeTab = (mode: 'youtube' | 'text', label: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => { setInputMode(mode); setErrorMsg(''); }}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px]
        transition-colors duration-150 cursor-pointer ${
          inputMode === mode
            ? 'bg-paper-2 font-medium text-ink'
            : 'text-ink-2 hover:text-ink'
        }`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div className="space-y-5">

      {/* ---------- ÜST SATIR ---------- */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[12px] text-ink-3">
          <span className="timecode font-semibold text-ink">{lessons.length}</span> ders
          {summary.inProgress > 0 && <> · <span className="timecode font-semibold text-ink">{summary.inProgress}</span> devam ediyor</>}
          {summary.finished > 0 && <> · <span className="timecode font-semibold text-ink">{summary.finished}</span> tamamlandı</>}
        </p>

        <button
          type="button"
          onClick={() => setShowImportForm(!showImportForm)}
          className={showImportForm
            ? `inline-flex items-center gap-1.5 rounded-xl border border-hairline px-4 py-2
               text-[13px] font-medium text-ink-2 transition-colors duration-150
               hover:bg-paper-3 hover:text-ink cursor-pointer`
            : primaryButton}
        >
          {showImportForm
            ? <><X className="h-4 w-4" /> Formu kapat</>
            : <><Plus className="h-4 w-4" /> Yeni ders ekle</>}
        </button>
      </div>

      {/* ---------- İÇE AKTARMA FORMU ---------- */}
      {showImportForm && (
        <form onSubmit={handleImport} className="rounded-2xl bg-paper-3 p-4">
          <div className="mb-3 flex flex-wrap items-center gap-1">
            {modeTab('youtube', 'YouTube linki', <Youtube className="h-3.5 w-3.5" />)}
            {modeTab('text', 'Metin yapıştır', <FileText className="h-3.5 w-3.5" />)}
          </div>

          {inputMode === 'youtube' ? (
            <div className="space-y-3">
              <p className="max-w-[62ch] text-[12px] leading-relaxed text-ink-2">
                Videonun İngilizce altyazısı (CC) çekilir, cümlelere bölünür ve
                Gemini ile çevrilerek katmanlı çalışma biçimine getirilir.
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="text"
                  value={youtubeInput}
                  onChange={(e) => setYoutubeInput(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=…"
                  className={`${inputClass} min-w-0 flex-1`}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !youtubeInput.trim()}
                  className={`${primaryButton} shrink-0`}
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />
                      {progressMsg || 'Altyazı çekiliyor…'}</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> Transkript çıkar</>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="max-w-[62ch] text-[12px] leading-relaxed text-ink-2">
                Altyazısı çekilemeyen videolar için metni doğrudan yapıştır.
                Videoyu derse gömmek istersen linkini de ekleyebilirsin.
              </p>

              <div>
                <label className="mb-1 block text-[12px] font-medium text-ink-2">
                  YouTube linki <span className="font-normal text-ink-3">(isteğe bağlı)</span>
                </label>
                <input
                  type="text"
                  value={manualYoutubeUrl}
                  onChange={(e) => setManualYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=…"
                  className={inputClass}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="mb-1 block text-[12px] font-medium text-ink-2">
                  İngilizce metin
                </label>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Transkripti ya da konuşma metnini buraya yapıştır…"
                  rows={5}
                  className={inputClass}
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !textInput.trim()}
                  className={primaryButton}
                >
                  {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" />
                      {progressMsg || 'Metin işleniyor…'}</>
                  ) : (
                    <><Sparkles className="h-4 w-4" /> Ders oluştur</>
                  )}
                </button>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="mt-3 rounded-xl border border-danger-line bg-danger-soft p-3">
              <p className="text-[12px] font-medium text-danger">İşlem başarısız</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-danger">{errorMsg}</p>
            </div>
          )}
        </form>
      )}

      {/* ---------- DERS LİSTESİ ---------- */}
      {lessons.length === 0 ? (
        <div className="rounded-2xl border border-hairline p-8 text-center">
          <p className="text-[13px] text-ink-2">Henüz eklenmiş bir ders yok.</p>
          {onRestorePresetLessons && (
            <button
              type="button"
              onClick={onRestorePresetLessons}
              className={`${primaryButton} mt-4`}
            >
              <RefreshCw className="h-4 w-4" />
              Örnek dersleri yükle
            </button>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.map((lesson) => {
            const isSelected = activeLesson ? lesson.id === activeLesson.id : false;
            // Metinden olculen seviye, elle girilenden once gelir: biri
            // olcum, digeri beyan. Olculemezse (metin yoksa) beyana duselim.
            const measuredLevel = lessonComputedLevel(lesson);
            const shownLevel = measuredLevel || lesson.level;
            const status = lessonStatus(lesson);
            const videoId = lesson.youtubeId || extractYouTubeId(lesson.youtubeUrl || '');
            const ytId = videoId && !brokenThumbs.has(videoId) ? videoId : '';

            return (
              <li key={lesson.id} className="min-w-0">
                <div
                  onClick={() => onSelectLesson(lesson)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${lesson.title} — ${status.label}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectLesson(lesson);
                    }
                  }}
                  className="group block cursor-pointer rounded-xl focus-visible:outline-2"
                >
                  {/* KAPAK. Ilerleme cubugu kapagin alt kenarinda: YouTube'un
                      "izlenen kisim" seridiyle ayni dil, ayrica aciklama
                      gerektirmiyor. */}
                  <div className={`relative aspect-video overflow-hidden rounded-xl border bg-paper-3 ${
                    isSelected ? 'border-ink' : 'border-hairline'
                  }`}>
                    {ytId ? (
                      <img
                        src={`https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`}
                        alt=""
                        loading="lazy"
                        onError={() => setBrokenThumbs((prev) => new Set(prev).add(videoId))}
                        // Olmayan video icin YouTube 120x90'lik gri bir yer tutucu donduruyor
                        onLoad={(e) => {
                          if (e.currentTarget.naturalWidth <= 120) {
                            setBrokenThumbs((prev) => new Set(prev).add(videoId));
                          }
                        }}
                        className="h-full w-full object-cover transition-opacity duration-150 group-hover:opacity-90"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 text-ink-3">
                        {videoId ? <Youtube className="h-6 w-6" /> : <FileText className="h-6 w-6" />}
                        <span className="text-[11px]">{videoId ? 'Video dersi' : 'Metin dersi'}</span>
                      </div>
                    )}

                    {ytId && (
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink/80 text-white">
                          <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
                        </span>
                      </span>
                    )}

                    {isSelected && (
                      <span className="absolute left-2 top-2 rounded-md bg-ink px-2 py-0.5 text-[11px] font-medium text-white">
                        Şu an açık
                      </span>
                    )}

                    <span className="timecode absolute bottom-2.5 right-2 rounded bg-ink/80 px-1.5 py-0.5 text-[11px] text-white">
                      ~{lesson.durationMinutes} dk
                    </span>

                    {status.done > 0 && (
                      <span className="absolute inset-x-0 bottom-0 h-1 bg-ink/20">
                        <span
                          className={`block h-full ${status.finished ? 'bg-ok' : 'bg-brand'}`}
                          style={{ width: `${(status.done / CORE_LAYER_COUNT) * 100}%` }}
                        />
                      </span>
                    )}
                  </div>

                  {/* BASLIK ve DURUM */}
                  <div className="mt-2.5 flex items-start gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 text-[14px] font-medium leading-snug text-ink">
                        {lesson.title}
                      </h3>

                      <p className={`mt-1 flex items-center gap-1 text-[12px] ${
                        status.finished ? 'text-ok' : status.done > 0 ? 'text-ink' : 'text-ink-3'
                      }`}>
                        {status.finished && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />}
                        <span className="truncate">{status.label}</span>
                      </p>
                      {status.next && (
                        <p className="mt-0.5 truncate text-[12px] text-ink-3">
                          Sıradaki: {status.next}
                        </p>
                      )}

                      {/* Kunye: renk yok, yalnizca ayrac. */}
                      <p className="mt-1.5 flex flex-wrap items-center gap-x-2 text-[11px] text-ink-3">
                        <span
                          title={
                            measuredLevel
                              ? `Metindeki kelimelerin %90'ını kapsayan seviye.${
                                  lesson.level && lesson.level !== measuredLevel
                                    ? ` Derse elle girilen seviye: ${lesson.level}.`
                                    : ''
                                }`
                              : 'Elle girilen seviye (metin çözümlenemedi).'
                          }
                          className="rounded bg-paper-3 px-1.5 py-0.5 font-medium text-ink-2"
                        >
                          {shownLevel}
                        </span>
                        <span className="timecode">{lesson.sentences.length} cümle</span>
                        {(cardTermsByLesson.get(lesson.id)?.length ?? 0) > 0 && (
                          <span
                            className="font-medium text-cardword"
                            title={`Bu derste geçen kart kelimelerin: ${cardTermsByLesson.get(lesson.id)!.join(', ')}`}
                          >
                            {cardTermsByLesson.get(lesson.id)!.length} kart kelimesi
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Satir eylemleri. Fare ustundeyken, klavyeyle
                        odaklanildiginda ya da silme onayi acikken gorunur.
                        `row-actions` sinifi DOKUNMATIK icin: index.css'teki
                        `pointer: coarse` kurali onlari telefonda surekli
                        acik tutuyor. */}
                    <div
                      className={`row-actions flex shrink-0 items-center gap-0.5 transition-opacity ${
                        confirmingDeleteId === lesson.id
                          ? 'opacity-100'
                          : 'opacity-0 focus-within:opacity-100 group-hover:opacity-100'
                      }`}
                    >
                      {onDeleteLesson && confirmingDeleteId === lesson.id ? (
                        <span className="flex items-center gap-1 text-[11px]">
                          <button
                            type="button"
                            onClick={(e) => handleConfirmDelete(e, lesson.id)}
                            className="rounded-lg bg-danger px-2 py-1 font-medium text-white
                              transition-colors hover:bg-danger-strong cursor-pointer"
                          >
                            Sil
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelDelete}
                            className="rounded-lg px-2 py-1 text-ink-2 transition-colors
                              hover:bg-hairline hover:text-ink cursor-pointer"
                          >
                            İptal
                          </button>
                        </span>
                      ) : (
                        <>
                          {onEditLesson && (
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); onEditLesson(lesson); }}
                              title="Bu dersi düzenle"
                              aria-label="Bu dersi düzenle"
                              className="rounded-lg p-1.5 text-ink-3 transition-colors
                                hover:bg-paper-3 hover:text-ink cursor-pointer"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {onDeleteLesson && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteClick(e, lesson.id)}
                              title="Bu dersi sil"
                              aria-label="Bu dersi sil"
                              className="rounded-lg p-1.5 text-ink-3 transition-colors
                                hover:bg-paper-3 hover:text-danger cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
