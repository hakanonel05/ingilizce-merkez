/* DERS RAPORU — YAZDIRILABİLİR GÖRÜNÜM
 * ============================================================================
 * NİYE PDF KÜTÜPHANESİ YOK: tarayıcının kendi "PDF olarak kaydet"i kullanılıyor.
 * jsPDF'in gömülü yazı tipleri Latin-1 ve Türkçede ı, ğ, ş yok; düzgün çıktı
 * için ~300 KB'lık bir TTF'yi uygulamaya gömmek gerekirdi. Tarayıcının
 * yazdırma motoru ise Türkçeyi, iki sütunlu düzeni ve sayfa bölmelerini zaten
 * doğru yapıyor — bedeli sıfır.
 *
 * YAZDIRMADA SAYFA DÜZENİ (kurallar index.css'teki @media print bloğunda):
 *   - transkript tablosunun başlığı her sayfada tekrar ediyor (thead)
 *   - satırlar sayfa ortasından bölünmüyor
 *   - her ana bölüm yeni sayfada başlıyor
 */

import React, { useEffect, useState } from 'react';
import { X, Printer, Loader2, FileText } from 'lucide-react';
import type { VideoLesson, MistakeEntry } from '../types';
import {
  dersRaporunuTopla,
  raporTarihi,
  raporDosyaAdi,
  type DersRaporu as Rapor,
} from '../lib/dersRaporu';
import { CORE_LAYERS } from './shell/LayerSidebar';
import { useCardMatcher, cardRanges } from '../lib/cardTerms';
import { turkceKarsilikAraliklari } from '../lib/turkceKarsilik';

interface Props {
  lesson: VideoLesson;
  mistakes: MistakeEntry[];
  onClose: () => void;
}

/** Bölüm başlığı — yazdırmada yeni sayfa açar. */
const Bolum: React.FC<{
  no: number;
  baslik: string;
  aciklama?: string;
  children: React.ReactNode;
}> = ({ no, baslik, aciklama, children }) => (
  <section className="rapor-bolum">
    <h2 className="rapor-bolum-baslik">
      <span className="rapor-bolum-no">{no}</span>
      {baslik}
    </h2>
    {aciklama && <p className="rapor-bolum-aciklama">{aciklama}</p>}
    {children}
  </section>
);

/* KART KELİMELERİ SARI VURGULU.
 *
 * AYNI DİZİN, AYNI KURAL: ekranda moru çizen eşleştiricinin ta kendisi
 * (lib/cardTerms). Rapora ayrı bir eşleştirme yazılsaydı iki liste
 * zamanla birbirinden kopardı — kâğıtta vurgulu olan kelime ekranda
 * işaretsiz kalırdı. Çekimler de aynı yerden geliyor: kart "cultivate"
 * ise metindeki "cultivated" da vurgulanıyor.
 *
 * "BİLİYORUM" DENENLER VURGULANMIYOR, ekrandaki kuralla aynı. Kart
 * duruyor ve raporun kelime listesinde görünüyor; vurgu ise "hâlâ
 * öğreniyorsun" demek.
 *
 * Renk MOR DEĞİL SARI: mor ekranda bir bağlantı/etkileşim işareti,
 * kâğıtta tıklanacak bir şey yok. Sarı fosforlu kalem, basılı metinde
 * "bu kelimeye dikkat" demenin alışılmış yolu.
 */
const Boyali: React.FC<{ metin: string; araliklar: { start: number; end: number }[] }> = ({
  metin,
  araliklar,
}) => {
  if (araliklar.length === 0) return <>{metin}</>;

  const parcalar: React.ReactNode[] = [];
  let imlec = 0;
  araliklar.forEach((r, i) => {
    if (r.start > imlec) parcalar.push(metin.slice(imlec, r.start));
    parcalar.push(
      <mark key={i} className="kart-vurgu">
        {metin.slice(r.start, r.end)}
      </mark>
    );
    imlec = r.end;
  });
  if (imlec < metin.length) parcalar.push(metin.slice(imlec));

  return <>{parcalar}</>;
};

/** İngilizce metinde kart kelimelerini sarıya boyar. */
const KartVurgulu: React.FC<{ metin: string; matcher: ReturnType<typeof useCardMatcher> }> = ({
  metin,
  matcher,
}) => <Boyali metin={metin} araliklar={cardRanges(metin, matcher)} />;

/* TÜRKÇE SÜTUNDA KARŞILIĞI DA SARI.
 *
 * Hangi kelimelerin aranacağı İNGİLİZCE TARAFTAN geliyor: o cümlede
 * hangi kartlar vurgulandıysa yalnızca onların Türkçe karşılıkları
 * aranıyor. Bütün destede arama yapılsaydı, İngilizcesi o cümlede
 * geçmeyen bir kartın karşılığı da boyanır ve iki sütun birbirini
 * tutmazdı.
 *
 * Eşleştirmenin kendisi ve eşikleri lib/turkceKarsilik içinde. */
const TurkceVurgulu: React.FC<{
  turkce: string;
  ingilizce: string;
  matcher: ReturnType<typeof useCardMatcher>;
  karsiliklar: Map<string, string>;
}> = ({ turkce, ingilizce, matcher, karsiliklar }) => {
  const hedefler = cardRanges(ingilizce, matcher)
    .map((r) => karsiliklar.get(r.front))
    .filter((x): x is string => !!x);

  return <Boyali metin={turkce} araliklar={turkceKarsilikAraliklari(turkce, hedefler)} />;
};

/** Kayıt bulunmayan bölümler için; sessizce gizlemek yerine söylüyoruz. */
const KayitYok: React.FC<{ metin: string }> = ({ metin }) => (
  <p className="rapor-bos">{metin}</p>
);

export const DersRaporuGorunumu: React.FC<Props> = ({ lesson, mistakes, onClose }) => {
  const [rapor, setRapor] = useState<Rapor | null>(null);
  const [hata, setHata] = useState('');
  const matcher = useCardMatcher();

  useEffect(() => {
    let iptal = false;
    dersRaporunuTopla(lesson, mistakes)
      .then((r) => {
        if (!iptal) setRapor(r);
      })
      .catch((e) => {
        if (!iptal) setHata(e?.message || 'Rapor hazırlanamadı.');
      });
    return () => {
      iptal = true;
    };
  }, [lesson, mistakes]);

  /* Esc ile kapanma ve arkadaki sayfanın kaymaması — depodaki diğer
     pencerelerle aynı davranış. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const onceki = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = onceki;
    };
  }, [onClose]);

  const yazdir = () => {
    /* Tarayıcı, PDF'in dosya adını SAYFA BAŞLIĞINDAN alıyor. Yazdırma
       boyunca geçici olarak değiştirilip sonra geri konuyor; yoksa dosya
       "Katmanlı İngilizce.pdf" diye kaydedilirdi. */
    const eskiBaslik = document.title;
    document.title = rapor ? raporDosyaAdi(lesson, rapor.olusturulma) : eskiBaslik;
    const geriAl = () => {
      document.title = eskiBaslik;
    };
    window.addEventListener('afterprint', geriAl, { once: true });
    window.print();
    /* afterprint her tarayıcıda gelmiyor; emniyet kemeri. */
    setTimeout(geriAl, 60000);
  };

  /* DIZIN HAZIR MI. Kart dizini IndexedDB'den asenkron kuruluyor; bu
     ders kartlari olmasina ragmen dizin henuz bossa yazdirma VURGUSUZ
     bir PDF uretirdi ve kullanici bunu ancak dosyayi acinca gorurdu. */
  const vurguBekleniyor = !!rapor && rapor.kelimeler.length > 0 && matcher.size === 0;

  const tamamlanan = CORE_LAYERS.filter((k) =>
    (lesson.completedLayers || []).includes(k.id)
  );
  const d = lesson;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto
        bg-ink/40 p-4 backdrop-blur-sm sm:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Ders raporu"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="rapor-pencere my-8 w-full max-w-4xl overflow-hidden rounded-2xl
          border border-hairline bg-paper-2"
      >
        {/* Üst çubuk — yazdırmada görünmüyor */}
        <div className="rapor-araclar flex items-center justify-between gap-4
          border-b border-hairline px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-tight text-ink">Ders Raporu</h2>
            <p className="mt-0.5 truncate text-[12px] text-ink-3">{d.title}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={yazdir}
              disabled={!rapor || vurguBekleniyor}
              className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2
                text-[13px] font-medium text-white transition-colors hover:bg-accent-700
                disabled:opacity-40 cursor-pointer"
            >
              {vurguBekleniyor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Printer className="h-4 w-4" />}
              {vurguBekleniyor ? 'Kelimeler yükleniyor…' : 'PDF olarak kaydet'}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="rounded-lg p-1.5 text-ink-3 transition-colors
                hover:bg-paper-3 hover:text-ink cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="rapor-kaydirma max-h-[78vh] overflow-y-auto">
          {hata ? (
            <p className="p-6 text-[13px] text-[var(--danger)]">{hata}</p>
          ) : !rapor ? (
            <p className="flex items-center gap-2 p-6 text-[13px] text-ink-2">
              <Loader2 className="h-4 w-4 animate-spin" /> Rapor hazırlanıyor…
            </p>
          ) : (
            <div id="ders-raporu" className="rapor">
              {/* ---------- KÜNYE ---------- */}
              <header className="rapor-kunye">
                <p className="rapor-ust">KATMANLI İNGİLİZCE · DERS RAPORU</p>
                <h1 className="rapor-baslik">{d.title}</h1>
                {d.speaker && <p className="rapor-konusmaci">{d.speaker}</p>}

                <dl className="rapor-kunye-tablo">
                  <div>
                    <dt>Rapor tarihi</dt>
                    <dd>{raporTarihi(rapor.olusturulma)}</dd>
                  </div>
                  <div>
                    <dt>Seviye</dt>
                    <dd>{d.level}</dd>
                  </div>
                  <div>
                    <dt>Cümle sayısı</dt>
                    <dd>{rapor.cumleler.length}</dd>
                  </div>
                  <div>
                    <dt>Kelime kartı</dt>
                    <dd>{rapor.kelimeler.length}</dd>
                  </div>
                  <div>
                    <dt>Tamamlanan katman</dt>
                    <dd>
                      {tamamlanan.length} / {CORE_LAYERS.length}
                    </dd>
                  </div>
                  {d.youtubeUrl && (
                    <div>
                      <dt>Kaynak</dt>
                      <dd className="rapor-link">{d.youtubeUrl}</dd>
                    </div>
                  )}
                </dl>

                <ol className="rapor-katmanlar">
                  {CORE_LAYERS.map((k) => {
                    const bitti = (d.completedLayers || []).includes(k.id);
                    return (
                      <li key={k.id} className={bitti ? 'bitti' : ''}>
                        <span className="isaret">{bitti ? '✓' : '·'}</span>
                        {k.id}. {k.label}
                      </li>
                    );
                  })}
                </ol>
              </header>

              {/* ---------- 1. İKİ DİLLİ TRANSKRİPT ---------- */}
              <Bolum
                no={1}
                baslik="Transkript — İngilizce ve Türkçe"
                aciklama={
                  `${rapor.cumleler.length} cümle, ${rapor.cevrilenCumle} tanesi çevirili.` +
                  (matcher.size > 0
                    ? ' Kelime kartına eklediklerin iki sütunda da sarı ile işaretli.'
                    : '')
                }
              >
                {rapor.cumleler.length === 0 ? (
                  <KayitYok metin="Bu derste transkript yok." />
                ) : (
                  <table className="rapor-transkript">
                    <thead>
                      <tr>
                        <th className="sutun-no">#</th>
                        <th>İngilizce</th>
                        <th>Türkçe</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rapor.cumleler.map((c, i) => (
                        <tr key={c.id}>
                          <td className="sutun-no">{c.timestamp || i + 1}</td>
                          <td lang="en">
                            <KartVurgulu metin={c.en} matcher={matcher} />
                          </td>
                          <td lang="tr">
                            {c.tr ? (
                              <TurkceVurgulu
                                turkce={c.tr}
                                ingilizce={c.en}
                                matcher={matcher}
                                karsiliklar={rapor.karsiliklar}
                              />
                            ) : (
                              '—'
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Bolum>

              {/* ---------- 2. YALNIZCA İNGİLİZCE ---------- */}
              <Bolum
                no={2}
                baslik="Transkript — Yalnızca İngilizce"
                aciklama={
                  'Çeviriye bakmadan okumak için; aynı metnin desteksiz hâli.' +
                  (matcher.size > 0 ? ' Kelime kartların yine sarı ile işaretli.' : '')
                }
              >
                {rapor.cumleler.length === 0 ? (
                  <KayitYok metin="Bu derste transkript yok." />
                ) : (
                  <div className="rapor-duzmetin" lang="en">
                    {rapor.cumleler.map((c) => (
                      <p key={c.id}>
                        <KartVurgulu metin={c.en} matcher={matcher} />
                      </p>
                    ))}
                  </div>
                )}
              </Bolum>

              {/* ---------- 3. KELİME KARTLARI ---------- */}
              <Bolum
                no={3}
                baslik="Kelime Kartların"
                aciklama="Bu derste karta çevirdiğin kelimeler, geçtikleri cümleyle birlikte."
              >
                {rapor.kelimeler.length === 0 ? (
                  <KayitYok metin="Bu dersten kelime kartı eklenmemiş." />
                ) : (
                  <table className="rapor-kelimeler">
                    <thead>
                      <tr>
                        <th>Kelime</th>
                        <th>Türkçesi</th>
                        <th>Geçtiği bağlam</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rapor.kelimeler.map((k) => (
                        <tr key={k.on}>
                          <td>
                            <span className="kelime" lang="en">
                              {k.on}
                            </span>
                            <span className="rozet">{k.seviye}</span>
                            {k.ipa && <span className="ipa">{k.ipa}</span>}
                          </td>
                          <td lang="tr">{k.arka}</td>
                          <td lang="en" className="baglam">
                            {k.baglam || k.ornek || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Bolum>

              {/* ---------- 4. ÖZET VE YORUM ---------- */}
              <Bolum
                no={4}
                baslik="Özetin ve Yorumun"
                aciklama="Katman 6'da kendi cümlelerinle yazdıkların."
              >
                <h3 className="rapor-alt-baslik">Özet</h3>
                {d.userSummary?.trim() ? (
                  <div className="rapor-yazi" lang="en">
                    {d.userSummary}
                  </div>
                ) : (
                  <KayitYok metin="Özet yazılmamış." />
                )}

                <h3 className="rapor-alt-baslik">Yorum</h3>
                {d.userComment?.trim() ? (
                  <div className="rapor-yazi" lang="en">
                    {d.userComment}
                  </div>
                ) : (
                  <KayitYok metin="Yorum yazılmamış." />
                )}
              </Bolum>

              {/* ---------- 5. YAPAY ZEKÂ DEĞERLENDİRMELERİ ---------- */}
              <Bolum
                no={5}
                baslik="Yapay Zekâ Değerlendirmeleri"
                aciklama="Katmanlar boyunca aldığın bütün geri bildirimler."
              >
                {/* 5a — Yazma değerlendirmesi */}
                <h3 className="rapor-alt-baslik">Yazma değerlendirmesi (Katman 6)</h3>
                {d.writingEvaluation ? (
                  <div className="rapor-kutu">
                    {d.writingEvaluation.generalFeedback && (
                      <p className="rapor-genel">{d.writingEvaluation.generalFeedback}</p>
                    )}

                    {d.writingEvaluation.grammarCorrections?.length > 0 && (
                      <>
                        <h4 className="rapor-dort">Gramer düzeltmeleri</h4>
                        <ul className="rapor-duzeltme">
                          {d.writingEvaluation.grammarCorrections.map((g, i) => (
                            <li key={i}>
                              <span className="yanlis" lang="en">
                                {g.original}
                              </span>
                              <span className="ok">→</span>
                              <span className="dogru" lang="en">
                                {g.corrected}
                              </span>
                              <span className="aciklama" lang="tr">
                                {g.explanationTr}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {d.writingEvaluation.naturalPhrasing?.length > 0 && (
                      <>
                        <h4 className="rapor-dort">Daha doğal söyleyişler</h4>
                        <ul className="rapor-duzeltme">
                          {d.writingEvaluation.naturalPhrasing.map((n, i) => (
                            <li key={i}>
                              <span className="yanlis" lang="en">
                                {n.original}
                              </span>
                              <span className="ok">→</span>
                              <span className="dogru" lang="en">
                                {n.nativeSuggestion}
                              </span>
                              <span className="aciklama" lang="tr">
                                {n.whyBetterTr}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                ) : (
                  <KayitYok metin="Bu ders için kayıtlı yazma değerlendirmesi yok." />
                )}

                {/* 5b — Anlama testi */}
                <h3 className="rapor-alt-baslik">Anlama testi (Katman 4)</h3>
                {d.quizResult ? (
                  <div className="rapor-kutu">
                    <p className="rapor-skor">
                      {d.quizResult.dogru} / {d.quizResult.toplam} doğru
                      <span className="tarih">
                        {' '}
                        · {raporTarihi(d.quizResult.completedAt)}
                      </span>
                    </p>
                    <ol className="rapor-sorular">
                      {d.quizResult.cevaplar.map((c) => (
                        <li key={c.soruId} className={c.dogruMu ? 'dogru' : 'yanlis'}>
                          <p className="soru" lang="en">
                            {c.soru}
                          </p>
                          <p className="cevap">
                            <span className="etiket">Senin cevabın:</span>{' '}
                            <span lang="en">{c.verilen}</span>
                          </p>
                          {!c.dogruMu && c.dogruCevap && (
                            <p className="cevap">
                              <span className="etiket">Doğrusu:</span>{' '}
                              <span lang="en">{c.dogruCevap}</span>
                            </p>
                          )}
                          {c.aciklamaTr && (
                            <p className="aciklama" lang="tr">
                              {c.aciklamaTr}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <KayitYok metin="Bu ders için kayıtlı test sonucu yok." />
                )}

                {/* 5c — Konuşma simülasyonu */}
                <h3 className="rapor-alt-baslik">Konuşma simülasyonu (Katman 7)</h3>
                {d.speakingSession?.turlar?.length ? (
                  <div className="rapor-kutu">
                    <ol className="rapor-konusma">
                      {d.speakingSession.turlar.map((t, i) => (
                        <li key={i}>
                          <p className="koc" lang="en">
                            <span className="etiket">Koç:</span> {t.coachQuestion}
                          </p>
                          {t.coachQuestionTr && (
                            <p className="koc-tr" lang="tr">
                              {t.coachQuestionTr}
                            </p>
                          )}
                          {t.userResponse && (
                            <p className="sen" lang="en">
                              <span className="etiket">Sen:</span> {t.userResponse}
                            </p>
                          )}
                          {t.coachFeedback && (
                            <p className="geri" lang="tr">
                              {t.coachFeedback}
                            </p>
                          )}
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <KayitYok metin="Bu ders için kayıtlı konuşma dökümü yok." />
                )}

                {/* 5d — Dersin kelime listesi */}
                <h3 className="rapor-alt-baslik">Kelime çözümlemesi</h3>
                {d.vocabulary?.length ? (
                  <table className="rapor-kelimeler">
                    <thead>
                      <tr>
                        <th>Kelime</th>
                        <th>Türkçesi</th>
                        <th>Örnek cümle</th>
                      </tr>
                    </thead>
                    <tbody>
                      {d.vocabulary.map((v, i) => (
                        <tr key={i}>
                          <td>
                            <span className="kelime" lang="en">
                              {v.word}
                            </span>
                            {v.ipa && <span className="ipa">{v.ipa}</span>}
                          </td>
                          <td lang="tr">{v.meaningTr}</td>
                          <td lang="en" className="baglam">
                            {v.exampleSentence || '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <KayitYok metin="Bu ders için kelime çözümlemesi üretilmemiş." />
                )}

                {/* 5e — Gramer çözümlemesi */}
                <h3 className="rapor-alt-baslik">Gramer çözümlemesi</h3>
                {d.grammarRules?.length ? (
                  <div className="rapor-gramer">
                    {d.grammarRules.map((g, i) => (
                      <div key={i} className="kural">
                        <h4 className="rapor-dort">{g.topic}</h4>
                        <p className="aciklama" lang="tr">
                          {g.explanationTr}
                        </p>
                        {g.examples?.length > 0 && (
                          <ul>
                            {g.examples.map((o, j) => (
                              <li key={j}>
                                <span lang="en">{o.en}</span>
                                <span className="tr" lang="tr">
                                  {o.tr}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <KayitYok metin="Bu ders için gramer çözümlemesi üretilmemiş." />
                )}

                {/* 5f — Yanlışlar defteri */}
                <h3 className="rapor-alt-baslik">Yanlışlar defterine düşenler</h3>
                {rapor.yanlislar.length > 0 ? (
                  <ol className="rapor-sorular">
                    {rapor.yanlislar.map((y) => (
                      <li key={y.id} className="yanlis">
                        <p className="soru" lang="en">
                          {y.question}
                        </p>
                        <p className="cevap">
                          <span className="etiket">Senin cevabın:</span>{' '}
                          <span lang="en">{y.userAnswer}</span>
                        </p>
                        <p className="cevap">
                          <span className="etiket">Doğrusu:</span>{' '}
                          <span lang="en">{y.correctAnswer}</span>
                        </p>
                        {y.explanationTr && (
                          <p className="aciklama" lang="tr">
                            {y.explanationTr}
                          </p>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <KayitYok metin="Bu dersten yanlışlar defterine kayıt düşmemiş." />
                )}
              </Bolum>

              <footer className="rapor-dipnot">
                <FileText className="h-3.5 w-3.5" />
                Katmanlı İngilizce · {d.title} · {raporTarihi(rapor.olusturulma)}
              </footer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
