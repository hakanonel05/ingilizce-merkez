/**
 * HİKAYE ÜRETECİ
 *
 * Kullanıcının hâlâ öğrenemediği kelimeleri tek bir hikayede toplar.
 * Kelimeler metinde kalın görünür, çünkü üretilen hikaye normal bir
 * okuma parçası (Passage) olarak kaydediliyor: parça görünümü zaten
 * sözlükteki kelimeleri vurguluyor, üzerine dokununca karta ekleme,
 * quiz, alıştırma ve ilerleme takibi hazır geliyor.
 *
 * İKİ AŞAMA: önce yalnızca hikaye üretilip açılıyor, sorular ve
 * alıştırmalar arkadan geliyor. Kullanıcı okumaya başlarken ikinci
 * çağrı sürüyor; beklemesi gereken tek şey hikayenin kendisi.
 */

import { useEffect, useState } from 'react';
import { Passage, UserProgress, CEFRLevel } from '../types';
import { collectStrugglingWords, StrugglingWord, MAX_STORY_WORDS } from '../lib/strugglingWords';
import { apiFetch } from '../../../../shared/vocab/userKeys';
import { Sparkles, Loader2, AlertTriangle, BookOpenCheck, RefreshCw, Cpu } from 'lucide-react';

interface Props {
  progress: UserProgress;
  passages: Passage[];
  /** Hikaye hazır olduğunda çağrılır; parça listeye eklenip açılır. */
  onStoryReady: (passage: Passage) => void;
  /** Arka planda gelen soru/alıştırmalar için. */
  onTasksReady: (passageId: number, questions: Passage['questions'], exercises: Passage['exercises']) => void;
}

const LEVELS: CEFRLevel[] = ['B1', 'B2', 'C1'];

/**
 * Hikayeyi yazacak model.
 *
 * "auto" Gemini ile baslar, kotasi dolarsa acik kaynak modellere duser.
 * Kullanici acik kaynak bir model secerse zincir YALNIZCA orada kalir:
 * "Llama istiyorum" deyip Gemini'den cevap almak secimi anlamsiz kilardi.
 *
 * Liste sunucudan geliyor (/api/ai/models) cunku Groq'un model kadrosu
 * sik degisiyor; kaldirilan bir modeli arayuzde gostermek istemiyoruz.
 */
interface OpenModel { id: string; label: string; note: string }

const MODEL_PREF_KEY = 'reading_story_model_v1';

/**
 * VARSAYILAN MODEL.
 *
 * Ayni kelimeler ve ayni seviyeyle yapilan karsilastirmada acik
 * agirlikli modeller arasinda B1 seviyesini en iyi tutturan buydu
 * (ortalama cumle uzunlugu ~11.6 kelime; Qwen 3.8 ~15 ile bandin
 * uzerine cikiyor, GPT-OSS 20B ~9.7 ile altinda kaliyor). Kelime
 * kapsamasi ve alistirma bicimi zaten butun modellerde kusursuzdu.
 *
 * Gemini'ye gore iki ek faydasi var: daha hizli ve AYRI KOTASI var,
 * yani Gemini'nin gunluk kotasi dolsa da hikaye uretilmeye devam
 * ediyor. Servis edilmiyorsa listeden dusuyor ve otomatige donuluyor.
 */
const DEFAULT_MODEL = 'openai/gpt-oss-120b';

/** Üretilen hikayelerin kimlikleri; hazır parçalarla çakışmasın. */
function nextStoryId(passages: Passage[]): number {
  const max = passages.reduce((acc, p) => (p && p.id > acc ? p.id : acc), 0);
  return Math.max(9000, max + 1);
}

export default function StoryComposer({ progress, passages, onStoryReady, onTasksReady }: Props) {
  const [words, setWords] = useState<StrugglingWord[]>([]);
  const [level, setLevel] = useState<CEFRLevel>('B1');
  const [topic, setTopic] = useState('');
  const [busy, setBusy] = useState(false);
  const [models, setModels] = useState<OpenModel[]>([]);
  const [model, setModel] = useState<string>(
    () => localStorage.getItem(MODEL_PREF_KEY) || DEFAULT_MODEL
  );
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const refreshWords = () => {
    collectStrugglingWords(progress, passages)
      .then(setWords)
      .catch((err) => console.warn('Kelimeler toplanamadı:', err));
  };

  useEffect(() => {
    refreshWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.wordStatus, passages.length]);

  // Acik kaynak model listesi. Alinamazsa liste bos kalir ve yalnizca
  // "Otomatik" gorunur; bu bir hata durumu degil.
  useEffect(() => {
    apiFetch('/api/ai/models')
      .then(r => r.json())
      .then(d => {
        const list: OpenModel[] = Array.isArray(d?.models) ? d.models : [];
        setModels(list);
        // Kayitli tercih artik servis edilmiyorsa otomatige don.
        // Kayitli/varsayilan tercih artik servis edilmiyorsa otomatige
        // don; olmayan bir modeli secili gostermek hataya goturuyordu.
        setModel(prev =>
          prev === 'auto' || list.some(m => m.id === prev) ? prev : 'auto'
        );
      })
      .catch(() => setModels([]));
  }, []);

  /** Model kimligini arayuzde gosterilecek ada cevirir. */
  const labelForModel = (id?: string): string => {
    if (!id) return 'Gemini';
    const known = models.find(m => m.id === id);
    if (known) return known.label;
    return id.startsWith('gemini') ? 'Gemini' : id;
  };

  const chooseModel = (id: string) => {
    setModel(id);
    localStorage.setItem(MODEL_PREF_KEY, id);
  };

  const selected = words.slice(0, MAX_STORY_WORDS);

  /**
   * Sunucuya kelimenin YALNIZCA yazilisini degil, kullanicinin hangi
   * anlamda calistigini da gonderiyoruz.
   *
   * Onceden yalnizca `term` gidiyordu ve model anlami kendi seciyordu:
   * "compelling" sifat olarak calisilmisken hikayede fiil olarak
   * geciyordu. Soz turu ve Turkce karsilik zaten kartta yazili, ikinci
   * bir yapay zeka cagrisina gerek yok.
   */
  const wordPayload = selected.map((w) => ({
    term: w.term,
    partOfSpeech: w.partOfSpeech,
    meaning: w.meaning,
  }));

  const handleGenerate = async () => {
    if (selected.length === 0) return;
    setBusy(true);
    setError(null);
    setNote(null);

    try {
      const res = await apiFetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ words: wordPayload, level, topic: topic.trim(), model }),
      });
      const raw = await res.text();
      let data: any;
      try {
        data = JSON.parse(raw);
      } catch {
        throw new Error('Sunucu beklenmeyen bir yanıt döndürdü.');
      }
      if (!res.ok) throw new Error(data.error || 'Hikaye üretilemedi.');

      const id = nextStoryId(passages);
      const story: Passage = {
        id,
        title: data.title,
        cefr: level,
        theme: data.theme,
        paragraphs: data.paragraphs,
        // Hedef kelimeler parçanın sözlüğü olarak veriliyor: metinde kalın
        // görünmelerini ve dokununca anlamlarının çıkmasını bu sağlıyor.
        // Anlamlar kullanıcının KENDİ kartlarından geliyor, yapay zekaya
        // ikinci kez sormaya gerek yok.
        vocabulary: selected.map((w) => ({
          term: w.term,
          meaning: w.meaning || '(anlamı kayıtlı değil)',
          partOfSpeech: w.partOfSpeech,
        })),
        questions: [],
        exercises: [],
        isGenerated: true,
        // Sunucu GERCEKTEN kullanilan modeli bildiriyor: tercih edilen
        // model kotasi dolu oldugu icin atlanmis olabilir.
        generatedBy: labelForModel(data.model),
      };

      onStoryReady(story);
      setNote('Hikaye hazır. Sorular ve alıştırmalar arka planda hazırlanıyor...');

      // İkinci aşama: kullanıcı okumaya başlarken arkadan gelir.
      void (async () => {
        try {
          const taskRes = await apiFetch('/api/generate-story-tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: data.paragraphs.join('\n\n'),
              level,
              words: wordPayload,
              model,
            }),
          });
          const taskData = await taskRes.json();
          if (!taskRes.ok) throw new Error(taskData.error || 'Alıştırmalar üretilemedi.');
          onTasksReady(id, taskData.questions || [], taskData.exercises || []);
          setNote('Sorular ve alıştırmalar da hazır.');
        } catch (err: any) {
          // Hikaye zaten okunabilir; ikinci aşama başarısız olursa
          // kullanıcıyı engellemiyoruz, yalnızca haber veriyoruz.
          setNote(
            'Hikaye hazır ama alıştırmalar üretilemedi: ' +
              (err?.message || 'bilinmeyen hata')
          );
        }
      })();
    } catch (err: any) {
      setError(err?.message || 'Hikaye üretilemedi.');
    } finally {
      setBusy(false);
    }
  };

  if (words.length === 0) {
    return (
      <div className="mb-8 border border-hairline/40 bg-white p-4 rounded-xl">
        <div className="flex items-start gap-2.5">
          <BookOpenCheck className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
          <p className="text-xs leading-relaxed text-ink/70">
            <strong className="font-bold">Hikaye üreteci</strong> — hâlâ
            öğrenemediğin kelimelerden sana özel bir hikaye yazar. Şu an öyle
            bir kelime yok: bir parçada kelimeleri <strong>ÇALIŞTIM</strong>{' '}
            olarak işaretledikçe ya da kart tekrarlarında unuttukça burası
            dolar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8 border border-accent/25 bg-white p-4 sm:p-5 space-y-4 rounded-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <Sparkles className="h-4 w-4 shrink-0 mt-0.5 text-accent" />
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink">Sana özel hikaye</p>
            <p className="text-xs text-ink/70 leading-relaxed mt-0.5">
              Hâlâ öğrenemediğin <strong>{selected.length}</strong> kelime tek
              bir hikayede geçecek ve metinde kalın görünecek.
              {words.length > MAX_STORY_WORDS && (
                <> Listede {words.length} kelime var; en çok takıldıkların seçildi.</>
              )}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={refreshWords}
          title="Kelime listesini tazele"
          className="shrink-0 border border-hairline/40 px-2.5 py-1.5 text-ink/60 hover:text-accent transition-colors cursor-pointer rounded-lg"
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Hikayeye girecek kelimeler */}
      <div className="flex flex-wrap gap-1.5">
        {selected.map((w) => (
          <span
            key={w.term}
            title={w.meaning || undefined}
            className="border border-hairline/40 bg-paper px-2 py-0.5 text-[11px] font-bold text-ink rounded-lg"
          >
            {w.term}
            {w.lapses > 0 && (
              <span className="ml-1 font-normal text-ink-3">×{w.lapses}</span>
            )}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="space-y-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-3">
            Seviye
          </label>
          <div className="flex">
            {LEVELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLevel(l)}
                className={`border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer rounded-lg ${
                  level === l
                    ? 'border-accent bg-accent text-white'
                    : 'border-hairline/40 bg-white text-ink/70 hover:border-accent/40'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1 flex-1 min-w-[180px]">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-3">
            Konu (isteğe bağlı)
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="boş bırakırsan güncel bir konu seçilir"
            className="w-full border border-hairline/40 bg-white px-3 py-1.5 text-xs text-ink focus:outline-none focus:border-accent rounded-lg"
          />
        </div>

        {/* Modeli yazan yapay zeka. Acik kaynak modeller Groq uzerinden
            calisiyor ve ayri bir kotasi var; Gemini kotasi dolunca da
            hikaye uretmeye devam edebiliyorsun. */}
        {models.length > 0 && (
          <div className="space-y-1">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-ink-3">
              Yazan model
            </label>
            <div className="flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-ink-3" />
              <select
                value={model}
                onChange={e => chooseModel(e.target.value)}
                className="border border-hairline/40 bg-white px-2 py-1.5 text-xs text-ink focus:outline-none focus:border-accent cursor-pointer rounded-lg"
              >
                <option value="auto">Otomatik (Gemini)</option>
                {models.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                    {m.id === DEFAULT_MODEL ? ' (önerilen)' : ''} — {m.note}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={handleGenerate}
          disabled={busy}
          className="flex items-center gap-2 border border-accent bg-accent px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-accent disabled:opacity-40 cursor-pointer rounded-lg"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
          {busy ? 'Yazılıyor...' : 'Hikayeyi Oluştur'}
        </button>
      </div>

      {note && <p className="text-[11px] text-ink/60">{note}</p>}

      {error && (
        <p className="flex items-start gap-1.5 border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-[11px] font-semibold text-rose-900 rounded-lg">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}
