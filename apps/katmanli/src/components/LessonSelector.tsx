/**
 * DERS LİSTESİ VE İÇE AKTARMA
 *
 * KENDİ KARTI VE BAŞLIĞI YOK. Bu bileşen yalnızca LessonPickerModal'ın
 * içinde kullanılıyor; pencere zaten kenarlıklı beyaz bir yüzey ve
 * "Çalışma İçeriği" başlığı taşıyor. Burada bir kart ve "Çalışma İçeriği
 * Seçimi" başlığı daha vardı: kutu içinde kutu, üst üste iki başlık.
 *
 * LİSTE, IZGARA DEĞİL. Kartlar iki sütunlu bir ızgaradaydı ve ders
 * başlıkları uzun olduğu için hepsi iki satırda kırpılıyordu. Alt alta
 * satırlarda başlık tam genişliği kullanıyor, göz de tek bir sol kenarı
 * takip ediyor.
 *
 * SEVİYE ROZETİ RENKSİZ. Önce C1/C2 mor, B2 kehribar, gerisi yeşildi —
 * paletin dışından üç renk. Seviye zaten HARFİN KENDİSİNDE yazıyor;
 * renk bunun üstüne bilgi eklemiyor, yalnızca listeyi alacalı yapıyordu.
 */

import React, { useState } from 'react';
import { VideoLesson } from '../types';
import { lessonComputedLevel } from '../lib/lessonInsight';
import {
  Youtube, Sparkles, Plus, Loader2, Check, Trash2, FileText, Edit3, RefreshCw, X,
} from 'lucide-react';

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
  const [youtubeInput, setYoutubeInput] = useState('');
  const [manualYoutubeUrl, setManualYoutubeUrl] = useState('');
  const [textInput, setTextInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [progressMsg, setProgressMsg] = useState('');
  const [showImportForm, setShowImportForm] = useState(false);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);

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
            <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3">
              <p className="text-[12px] font-medium text-rose-800">İşlem başarısız</p>
              <p className="mt-0.5 text-[12px] leading-relaxed text-rose-700">{errorMsg}</p>
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
        <ul className="divide-y divide-hairline border-t border-hairline">
          {lessons.map((lesson) => {
            const isSelected = activeLesson ? lesson.id === activeLesson.id : false;
            // Metinden olculen seviye, elle girilenden once gelir: biri
            // olcum, digeri beyan. Olculemezse (metin yoksa) beyana duselim.
            const measuredLevel = lessonComputedLevel(lesson);
            const shownLevel = measuredLevel || lesson.level;

            return (
              <li key={lesson.id}>
                <div
                  onClick={() => onSelectLesson(lesson)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectLesson(lesson);
                    }
                  }}
                  className={`group flex cursor-pointer items-start gap-3 px-3 py-3.5
                    transition-colors duration-150 ${
                      isSelected ? 'bg-accent-soft' : 'hover:bg-paper-3'
                    }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-2">
                      <h3 className={`min-w-0 flex-1 truncate text-[14px] font-medium ${
                        isSelected ? 'text-brand' : 'text-ink'
                      }`}>
                        {lesson.title}
                      </h3>
                      {isSelected && (
                        <span className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-brand">
                          <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          aktif
                        </span>
                      )}
                    </div>

                    <p className="mt-0.5 line-clamp-1 text-[12px] leading-relaxed text-ink-3">
                      {lesson.description}
                    </p>

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
                        className="rounded bg-paper-3 px-1.5 py-0.5 font-medium text-ink-2
                          group-hover:bg-paper-2"
                      >
                        {shownLevel}
                      </span>
                      <span>·</span>
                      <span className="timecode">{lesson.sentences.length} cümle</span>
                      <span>·</span>
                      <span className="timecode">~{lesson.durationMinutes} dk</span>
                    </p>
                  </div>

                  {/* Satir eylemleri. Fare ustundeyken, klavyeyle
                      odaklanildiginda ya da silme onayi acikken gorunur;
                      her satirda surekli durunca liste icerik degil dugme
                      listesi gibi okunuyordu.

                      `row-actions` sinifi DOKUNMATIK icin: telefonda hover
                      diye bir sey yok, yani gizli kalsalar duzenle ve sil
                      dugmelerine hic ulasilamazdi. index.css'teki
                      `pointer: coarse` kurali onlari orada surekli acik
                      tutuyor. */}
                  <div
                    className={`row-actions flex shrink-0 items-center gap-0.5 transition-opacity ${
                      confirmingDeleteId === lesson.id
                        ? 'opacity-100'
                        : 'opacity-0 focus-within:opacity-100 group-hover:opacity-100'
                    }`}
                  >
                    {onDeleteLesson && confirmingDeleteId === lesson.id ? (
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-ink-2">Silinsin mi?</span>
                        <button
                          type="button"
                          onClick={(e) => handleConfirmDelete(e, lesson.id)}
                          className="rounded-lg bg-rose-600 px-2 py-1 font-medium text-white
                            transition-colors hover:bg-rose-700 cursor-pointer"
                        >
                          Evet
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
                              hover:bg-paper-2 hover:text-ink cursor-pointer"
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
                              hover:bg-paper-2 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </>
                    )}
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
