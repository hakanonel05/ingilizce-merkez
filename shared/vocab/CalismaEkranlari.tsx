/* ÇALIŞMA EKRANLARI — yazma, çoktan seçmeli, eşleştirme
 * ============================================================================
 * DOSYA ADI BILEREK "CalismaModlari" DEGIL. Karar mantigi calismaModlari.ts'te
 * ve Windows dosya adlarinda buyuk/kucuk harf ayirmiyor: iki dosya ayni
 * dizinde yalnizca harf buyuklugu ile ayrilsaydi `./calismaModlari` importu
 * yanlis dosyayi cozuyordu (olculdu, tip hatasi verdi).
 * Flashcard'ın yanına gelen üç mod. Karar mantığı calismaModlari.ts'te (saf ve
 * sınanmış); burada yalnızca çizim ve etkileşim var.
 *
 * ÜÇÜ DE AYNI DESTEYİ BESLİYOR. Quizlet'te "Learn" ilerlemesi aralıklı
 * tekrardan ayrı çalışır ve iki ayrı "biliniyor" ölçüsü oluşur. Burada her
 * cevap calismaKaydi üzerinden FSRS'ye gidiyor: yazma modunda verdiğin doğru
 * cevap kartın bir sonraki tekrar tarihini de değiştiriyor.
 *
 * EŞLEŞTİRMEDE YALNIZCA HATA KAYDA GEÇİYOR. Doğru eşleşme zayıf kanıt —
 * cevap zaten ekranda duruyor ve eleme yoluyla da bulunabiliyor; onu "Good"
 * saymak kartı hak etmediği kadar ileri atardı. Yanlış eşleşme ise gerçek
 * kanıt, "Again" olarak işleniyor.
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check, X, Volume2, ArrowRight, RotateCcw, PartyPopper, Timer,
} from 'lucide-react';
import type { VocabCard } from './vocabStore';
import { Rating } from './fsrs';
import { kartiDerecelendir, type CalismaUygulamasi } from './calismaKaydi';
import {
  yazmayiDenetle, yazmaDerecesi, soruYonu, testSorusuUret, eslestirmeKur,
  karistir, type CalismaYonu, type TestSorusu, type YazmaDurumu,
} from './calismaModlari';

export type CalismaModu = 'yazma' | 'test' | 'eslestirme';

interface Props {
  mod: CalismaModu;
  cards: VocabCard[];
  yon: CalismaYonu;
  retention?: number;
  uygulama?: CalismaUygulamasi;
  onCardUpdated: () => void;
  onExit: () => void;
}

/** Tarayıcının kendi seslendirmesi; kısa ve ağ istemiyor. */
function seslendir(metin: string, ingilizce = true) {
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(metin);
    u.lang = ingilizce ? 'en-US' : 'tr-TR';
    window.speechSynthesis.speak(u);
  } catch {
    /* Seslendirme yoksa sessizce geç: çalışmanın özü bu değil. */
  }
}

const OturumSonu: React.FC<{
  dogru: number;
  toplam: number;
  onTekrar: () => void;
  onExit: () => void;
  ekBilgi?: React.ReactNode;
}> = ({ dogru, toplam, onTekrar, onExit, ekBilgi }) => (
  <div className="space-y-4 rounded-2xl border border-hairline bg-paper-2 p-6 text-center">
    <PartyPopper className="mx-auto h-8 w-8 text-ink-3" />
    <p className="text-[28px] font-semibold leading-none text-ink">
      {dogru}
      <span className="text-[15px] font-normal text-ink-3"> / {toplam}</span>
    </p>
    <p className="text-[13px] text-ink-2">Tur bitti.</p>
    {ekBilgi}
    <div className="flex justify-center gap-2 pt-1">
      <button
        type="button"
        onClick={onTekrar}
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-[13px]
          font-medium text-white transition-colors hover:bg-accent-700 cursor-pointer"
      >
        <RotateCcw className="h-4 w-4" /> Yeni tur
      </button>
      <button
        type="button"
        onClick={onExit}
        className="rounded-xl border border-hairline bg-paper-2 px-4 py-2.5 text-[13px]
          font-medium text-ink transition-colors hover:border-accent/40 cursor-pointer"
      >
        Bitir
      </button>
    </div>
  </div>
);

/* ---------------------------------------------------------------- YAZMA */

const YazmaModu: React.FC<Omit<Props, 'mod'>> = ({
  cards, yon, retention, uygulama, onCardUpdated, onExit,
}) => {
  /* KARTLAR BIR KEZ ALINIYOR. `cards` her derecelendirmeden sonra
     tazeleniyor (kart artik vadesi gelmis sayilmiyor) ve listeye bagli
     bir useMemo her cevapta yeniden karistirirdi: tur hic bitmezdi.
     Baslangic degeri olarak alinip oyle kaliyor. */
  const [sira] = useState<VocabCard[]>(() => karistir<VocabCard>(cards));
  const [i, setI] = useState(0);
  const [yazilan, setYazilan] = useState('');
  const [sonuc, setSonuc] = useState<{ durum: YazmaDurumu; beklenen: string } | null>(null);
  const [dogru, setDogru] = useState(0);
  const girdiRef = useRef<HTMLInputElement | null>(null);

  const kart = sira[i];
  /* Yön kart başına bir kez belirleniyor: her çizimde yeniden
     hesaplansaydı "karışık" modda soru her tuşta yön değiştirirdi. */
  const yonlu = useMemo(() => (kart ? soruYonu(kart, yon) : null), [kart, yon]);

  useEffect(() => { girdiRef.current?.focus(); }, [i]);

  if (!kart || !yonlu) {
    return <OturumSonu dogru={dogru} toplam={sira.length} onTekrar={() => { setI(0); setDogru(0); setSonuc(null); setYazilan(''); }} onExit={onExit} />;
  }

  const denetle = async () => {
    if (sonuc) return;
    const s = yazmayiDenetle(yonlu.cevap, yazilan);
    setSonuc(s);
    if (s.durum === 'dogru') setDogru((d) => d + 1);
    await kartiDerecelendir(kart, yazmaDerecesi(s.durum), { retention, uygulama, mod: 'yazma' });
    onCardUpdated();
  };

  const sonrakine = () => {
    setSonuc(null);
    setYazilan('');
    setI((x) => x + 1);
  };

  const renk =
    sonuc?.durum === 'dogru' ? 'border-ok' : sonuc?.durum === 'yakin' ? 'border-brand' : 'border-danger';

  return (
    <div className="space-y-4">
      <p className="text-[12px] text-ink-3">
        Yazma · <span className="font-semibold text-ink">{i + 1}</span> / {sira.length}
      </p>

      <div className="space-y-4 rounded-2xl border border-hairline bg-paper-2 p-6">
        <div className="flex items-center justify-center gap-2">
          <p
            className="text-center text-[22px] font-semibold text-ink"
            lang={yonlu.soruIngilizce ? 'en' : 'tr'}
          >
            {yonlu.soru}
          </p>
          {yonlu.soruIngilizce && (
            <button
              type="button"
              onClick={() => seslendir(yonlu.soru, true)}
              aria-label="Seslendir"
              className="rounded-lg p-1.5 text-ink-3 hover:text-ink cursor-pointer"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <input
          ref={girdiRef}
          type="text"
          value={yazilan}
          onChange={(e) => setYazilan(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            if (sonuc) sonrakine();
            else void denetle();
          }}
          readOnly={!!sonuc}
          lang={yonlu.soruIngilizce ? 'tr' : 'en'}
          placeholder={yonlu.soruIngilizce ? 'Türkçesini yaz…' : 'İngilizcesini yaz…'}
          className={`w-full rounded-xl border bg-paper px-3 py-2.5 text-center text-[16px]
            text-ink placeholder-ink-3 focus:outline-none ${
              sonuc ? renk : 'border-hairline focus:border-accent'
            }`}
        />

        {sonuc && (
          <div className="space-y-1 text-center">
            {sonuc.durum === 'dogru' ? (
              <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ok">
                <Check className="h-4 w-4" /> Doğru
              </p>
            ) : (
              <>
                <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-ink">
                  {sonuc.durum === 'yakin' ? 'Çok yakın' : <><X className="h-4 w-4" /> Yanlış</>}
                </p>
                <p className="text-[14px] text-ink" lang={yonlu.soruIngilizce ? 'tr' : 'en'}>
                  {yonlu.cevap}
                </p>
              </>
            )}
            {kart.exampleEn && (
              <p className="pt-1 text-[12px] italic leading-relaxed text-ink-3" lang="en">
                {kart.exampleEn}
              </p>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={sonuc ? sonrakine : denetle}
          disabled={!sonuc && !yazilan.trim()}
          className="w-full rounded-xl bg-accent px-4 py-3 text-[14px] font-medium text-white
            transition-colors hover:bg-accent-700 disabled:opacity-40 cursor-pointer"
        >
          {sonuc ? 'Sıradaki' : 'Kontrol et'}{' '}
          <span className="font-normal text-white/70">(Enter)</span>
        </button>
      </div>
    </div>
  );
};

/* ------------------------------------------------------- ÇOKTAN SEÇMELİ */

const TestModu: React.FC<Omit<Props, 'mod'>> = ({
  cards, yon, retention, uygulama, onCardUpdated, onExit,
}) => {
  const [tur, setTur] = useState(0);
  /* Sorular tur basina BIR KEZ kuruluyor; `cards` her cevaptan sonra
     degistigi icin ona bagli olsaydi sorular surekli yenilenirdi. */
  const [sorularTur, setSorularTur] = useState<TestSorusu[]>(() =>
    karistir<VocabCard>(cards).map((k) => testSorusuUret(k, cards, yon))
  );
  const sorular = sorularTur;
  const [i, setI] = useState(0);
  const [secilen, setSecilen] = useState<number | null>(null);
  const [dogru, setDogru] = useState(0);

  const soru = sorular[i];
  if (!soru) {
    return (
      <OturumSonu
        dogru={dogru}
        toplam={sorular.length}
        onTekrar={() => {
          setSorularTur(karistir<VocabCard>(cards).map((k) => testSorusuUret(k, cards, yon)));
          setTur((t) => t + 1);
          setI(0);
          setDogru(0);
          setSecilen(null);
        }}
        onExit={onExit}
      />
    );
  }

  const sec = async (indeks: number) => {
    if (secilen !== null) return;
    setSecilen(indeks);
    const doğruMu = indeks === soru.dogruIndeks;
    if (doğruMu) setDogru((d) => d + 1);
    await kartiDerecelendir(soru.kart, doğruMu ? Rating.Good : Rating.Again, {
      retention, uygulama, mod: 'test',
    });
    onCardUpdated();
  };

  return (
    <div className="space-y-4">
      <p className="text-[12px] text-ink-3">
        Test · <span className="font-semibold text-ink">{i + 1}</span> / {sorular.length}
      </p>

      <div className="space-y-4 rounded-2xl border border-hairline bg-paper-2 p-6">
        <div className="flex items-center justify-center gap-2">
          <p className="text-center text-[22px] font-semibold text-ink"
            lang={soru.soruIngilizce ? 'en' : 'tr'}>
            {soru.soru}
          </p>
          {soru.soruIngilizce && (
            <button
              type="button"
              onClick={() => seslendir(soru.soru, true)}
              aria-label="Seslendir"
              className="rounded-lg p-1.5 text-ink-3 hover:text-ink cursor-pointer"
            >
              <Volume2 className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="grid gap-2">
          {soru.secenekler.map((s, idx) => {
            const secildi = secilen === idx;
            const buDogru = idx === soru.dogruIndeks;
            /* Cevaptan SONRA doğru şık her hâlükârda işaretleniyor:
               yanlış seçende doğruyu görmek öğrenmenin kendisi. */
            const bicim =
              secilen === null
                ? 'border-hairline hover:border-accent/40'
                : buDogru
                  ? 'border-ok bg-ok/10'
                  : secildi
                    ? 'border-danger bg-danger/10'
                    : 'border-hairline opacity-60';
            return (
              <button
                key={idx}
                type="button"
                onClick={() => sec(idx)}
                disabled={secilen !== null}
                lang={soru.soruIngilizce ? 'tr' : 'en'}
                className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5
                  text-left text-[14px] text-ink transition-colors cursor-pointer ${bicim}`}
              >
                <span className="min-w-0">{s}</span>
                {secilen !== null && buDogru && <Check className="h-4 w-4 shrink-0 text-ok" />}
                {secilen !== null && secildi && !buDogru && (
                  <X className="h-4 w-4 shrink-0 text-danger" />
                )}
              </button>
            );
          })}
        </div>

        {secilen !== null && (
          <button
            type="button"
            onClick={() => { setSecilen(null); setI((x) => x + 1); }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent
              px-4 py-3 text-[14px] font-medium text-white transition-colors
              hover:bg-accent-700 cursor-pointer"
          >
            Sıradaki <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

/* ----------------------------------------------------------- EŞLEŞTİRME */

const EslestirmeModu: React.FC<Omit<Props, 'mod'>> = ({
  cards, retention, uygulama, onCardUpdated, onExit,
}) => {
  const [tur, setTur] = useState(0);
  /* Tur basina bir kez; `cards` cevaplar sonrasi degistigi icin ona
     bagli olsaydi oyun ortasinda tahta yenilenirdi. */
  const [oyun, setOyun] = useState(() => eslestirmeKur(cards));
  const [seciliSol, setSeciliSol] = useState<string | null>(null);
  const [eslesen, setEslesen] = useState<Set<string>>(new Set());
  const [yanlis, setYanlis] = useState<string | null>(null);
  /* Hata yapılan kartlar: tur sonunda Again olarak işleniyor. */
  const hataliRef = useRef<Set<string>>(new Set());
  const [sure, setSure] = useState(0);
  const basladiRef = useRef(Date.now());

  useEffect(() => {
    basladiRef.current = Date.now();
    const id = setInterval(() => setSure(Math.floor((Date.now() - basladiRef.current) / 1000)), 500);
    return () => clearInterval(id);
  }, [tur]);

  const bitti = eslesen.size === oyun.sol.length && oyun.sol.length > 0;

  useEffect(() => {
    if (!bitti) return;
    /* Tur bitince YALNIZCA hatalı kartlar işleniyor; gerekçesi dosya
       başındaki notta. */
    (async () => {
      for (const id of hataliRef.current) {
        const k = cards.find((c) => c.id === id);
        if (k) await kartiDerecelendir(k, Rating.Again, { retention, uygulama, mod: 'eslestirme' });
      }
      if (hataliRef.current.size > 0) onCardUpdated();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bitti]);

  if (bitti) {
    const hata = hataliRef.current.size;
    return (
      <OturumSonu
        dogru={oyun.sol.length - hata}
        toplam={oyun.sol.length}
        onTekrar={() => {
          hataliRef.current = new Set();
          setOyun(eslestirmeKur(cards));
          setEslesen(new Set());
          setSeciliSol(null);
          setSure(0);
          setTur((t) => t + 1);
        }}
        onExit={onExit}
        ekBilgi={
          <p className="text-[12px] text-ink-3">
            Süre: {sure} sn{hata > 0 && ` · ${hata} kart tekrara alındı`}
          </p>
        }
      />
    );
  }

  const sagaTikla = (kartId: string) => {
    if (!seciliSol) return;
    if (seciliSol === kartId) {
      setEslesen((o) => new Set([...o, kartId]));
      setSeciliSol(null);
      setYanlis(null);
    } else {
      hataliRef.current.add(seciliSol);
      setYanlis(kartId);
      setTimeout(() => setYanlis(null), 450);
      setSeciliSol(null);
    }
  };

  const kutu = (metin: string, secili: boolean, eslesti: boolean, hataliMi: boolean) =>
    `rounded-xl border px-3 py-2.5 text-left text-[13px] transition-all cursor-pointer ${
      eslesti
        ? 'border-ok/40 bg-ok/10 text-ink-3 line-through cursor-default'
        : hataliMi
          ? 'border-danger bg-danger/10 text-ink'
          : secili
            ? 'border-ink bg-paper-3 text-ink'
            : 'border-hairline text-ink hover:border-accent/40'
    }`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-[12px] text-ink-3">
          Eşleştirme · {eslesen.size} / {oyun.sol.length}
        </p>
        <p className="inline-flex items-center gap-1.5 text-[12px] text-ink-3">
          <Timer className="h-3.5 w-3.5" /> {sure} sn
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          {oyun.sol.map((s) => (
            <button
              key={s.kartId}
              type="button"
              lang="en"
              disabled={eslesen.has(s.kartId)}
              onClick={() => setSeciliSol(s.kartId)}
              className={`w-full ${kutu(s.metin, seciliSol === s.kartId, eslesen.has(s.kartId), false)}`}
            >
              {s.metin}
            </button>
          ))}
        </div>
        <div className="space-y-2">
          {oyun.sag.map((s) => (
            <button
              key={s.kartId}
              type="button"
              lang="tr"
              disabled={eslesen.has(s.kartId)}
              onClick={() => sagaTikla(s.kartId)}
              className={`w-full ${kutu(s.metin, false, eslesen.has(s.kartId), yanlis === s.kartId)}`}
            >
              {s.metin}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-[11px] text-ink-3">
        Soldan bir kelime seç, sağdan karşılığını işaretle.
      </p>
    </div>
  );
};

/* ------------------------------------------------------------------ KABUK */

export const CalismaEkranlariGorunumu: React.FC<Props> = (props) => {
  if (props.cards.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-hairline px-3 py-4 text-center
        text-[13px] text-ink-3">
        Bu modda çalışmak için kart gerekiyor.
      </p>
    );
  }
  if (props.mod === 'yazma') return <YazmaModu {...props} />;
  if (props.mod === 'test') return <TestModu {...props} />;
  return <EslestirmeModu {...props} />;
};
