/**
 * ALIŞTIRMA AKIŞI
 *
 * Dört adım, hepsi tek ekranda ve sırayla açılıyor:
 *   görsel seç  ->  anlat  ->  metni gözden geçir  ->  çözümleme
 *
 * SİHİRBAZ (adım adım ayrı sayfa) YAPILMADI: dört adımın üçünde görselin
 * ekranda kalması gerekiyor. Anlatırken görseli göremeyen kullanıcı
 * betimleyemez; metni düzeltirken göremeyen, "acaba gerçekten kırmızı
 * mıydı" diye takılır.
 *
 * METİN DÜZELTME ADIMI NEDEN VAR: Whisper kelime uyduruyor olabilir
 * ("their" / "there", isimler, aksanlı sesler). O metin doğrudan
 * çözümlemeye giderse yapmadığın bir hatanın açıklamasını okursun — bu,
 * özelliğin en zarar verici hatası olurdu. Düzeltme kutusunun üstünde
 * ne düzeltilip ne düzeltilmeyeceği açıkça yazıyor.
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader2, AlertTriangle, RotateCcw, Sparkles, ImagePlus } from 'lucide-react';
import { GorselSecici } from './GorselSecici';
import { KayitPaneli } from './KayitPaneli';
import { AnalizSonucu } from './AnalizSonucu';
import { GorselKunyesiSatiri } from './GorselKunyesiSatiri';
import { betimlemeCozumle, gorselGetir, kunyeCikar } from '../lib/api';
import { cozumlemeKopyasi, dosyayiOku, kucukKopya, veriUrlAyir } from '../lib/gorselIsleme';
import { kayitYaz, yeniKimlik } from '../lib/betimlemeDeposu';
import { kaydiYaziyaCevir } from '../../../../shared/ses/konusmaCozumleme';
import { logActivity } from '../../../../shared/analytics/activityLog';
import type { Akicilik } from '../../../../shared/ses/konusmaCozumleme';
import type { BetimlemeKaydi, Cefr, GorselKaynagi, GorselKunyesi } from '../types';

type Asama = 'secim' | 'anlat' | 'metin' | 'sonuc';

interface SecilenGorsel {
  /** Ekranda gösterilen ve çözümlemeye gönderilen kopya (1280px). */
  cozumleme: string;
  /** Geçmişte saklanan kopya (640px). */
  kucuk: string;
  kaynak: GorselKaynagi;
  baslik?: string;
  /** Fotoğrafsa lisans künyesi; gösterilmesi lisans gereği. */
  kunye?: GorselKunyesi;
}

interface Props {
  seviye: Cefr;
  onSeviyeDegis: (s: Cefr) => void;
  /** Yeni kayıt yazıldığında üst bileşen listeyi tazelesin. */
  onKaydedildi: () => void;
}

export const BetimlemeAkisi: React.FC<Props> = ({ seviye, onSeviyeDegis, onKaydedildi }) => {
  const [asama, setAsama] = useState<Asama>('secim');
  const [gorsel, setGorsel] = useState<SecilenGorsel | null>(null);
  const [metin, setMetin] = useState('');
  const [akicilik, setAkicilik] = useState<{ olcum: Akicilik; puan: number; kelime: number } | null>(null);
  const [kayit, setKayit] = useState<BetimlemeKaydi | null>(null);

  const [mesgul, setMesgul] = useState<string | null>(null);
  const [hata, setHata] = useState<string | null>(null);

  /* Bileşen kalktıysa artık durum yazma: kullanıcı çözümleme sürerken
     geçmişe geçebiliyor ve React sökülmüş bileşene yazmaktan şikâyet eder.

     MONTAJDA TRUE'YA GERİ ÇEKİLİYOR, ve bu satır şart. İlk sürümde yalnızca
     temizleme işlevi vardı; StrictMode geliştirmede her bileşeni bir kez
     takıp söküp yeniden taktığı için bayrak daha ilk açılışta false'a
     düşüyor ve BİR DAHA hiç true olmuyordu. Sonuç: 'Görsel üret' düğmesi
     sonsuza kadar dönüyordu - istek 200 dönüyor, ama yanıtı ekrana yazan
     her satır bayrağa takılıp sessizce atlanıyordu. */
  const canliRef = useRef(true);
  useEffect(() => {
    canliRef.current = true;
    return () => { canliRef.current = false; };
  }, []);

  const sifirla = useCallback(() => {
    setAsama('secim');
    setGorsel(null);
    setMetin('');
    setAkicilik(null);
    setKayit(null);
    setHata(null);
  }, []);

  const gorseliKur = useCallback(async (
    kaynakUrl: string,
    alan: Omit<SecilenGorsel, 'cozumleme' | 'kucuk'>
  ) => {
    const [cozum, kucuk] = await Promise.all([
      cozumlemeKopyasi(kaynakUrl),
      kucukKopya(kaynakUrl),
    ]);
    if (!canliRef.current) return;
    setGorsel({ cozumleme: cozum, kucuk, ...alan });
    setAsama('anlat');
  }, []);

  const getir = async () => {
    setHata(null);
    setMesgul('Fotoğraf aranıyor');
    try {
      const sonuc = await gorselGetir(seviye);
      await gorseliKur(sonuc.veriUrl, {
        kaynak: 'fotograf',
        baslik: sonuc.baslik,
        kunye: kunyeCikar(sonuc),
      });
    } catch (err: any) {
      if (canliRef.current) setHata(err?.message || 'Görsel getirilemedi.');
    } finally {
      if (canliRef.current) setMesgul(null);
    }
  };

  const yukle = async (dosya: File) => {
    setHata(null);
    setMesgul('Görsel hazırlanıyor');
    try {
      const veriUrl = await dosyayiOku(dosya);
      await gorseliKur(veriUrl, { kaynak: 'yukleme' });
    } catch (err: any) {
      if (canliRef.current) setHata(err?.message || 'Görsel okunamadı.');
    } finally {
      if (canliRef.current) setMesgul(null);
    }
  };

  /**
   * Kayıt bitti -> metin.
   *
   * `blob` bu işlevden sonra hiçbir yerde tutulmuyor: yerel değişken olarak
   * çözümlemeye giriyor, işlev bitince çöp toplayıcıya kalıyor. Depoya
   * yazan bir satır BİLEREK yok (bkz. lib/betimlemeDeposu.ts).
   */
  const kayitBitti = async (blob: Blob) => {
    setHata(null);
    setMesgul('Konuşman yazıya çevriliyor');
    try {
      const cozum = await kaydiYaziyaCevir(yeniKimlik(), blob);
      if (!canliRef.current) return;
      setMetin(cozum.metin);
      setAkicilik({ olcum: cozum.akicilik, puan: cozum.akicilikPuani, kelime: cozum.kelimeSayisi });
      setAsama('metin');
    } catch (err: any) {
      if (canliRef.current) setHata(err?.message || 'Kayıt çözümlenemedi.');
    } finally {
      if (canliRef.current) setMesgul(null);
    }
  };

  const cozumle = async () => {
    if (!gorsel || !akicilik) return;
    setHata(null);
    setMesgul('Betimlemen inceleniyor');
    try {
      const { tur, veri } = veriUrlAyir(gorsel.cozumleme);
      const analiz = await betimlemeCozumle({
        metin,
        gorselVeri: veri,
        gorselTuru: tur,
        hedefSeviye: seviye,
      });
      if (!canliRef.current) return;

      const yeni: BetimlemeKaydi = {
        id: yeniKimlik(),
        olusturuldu: Date.now(),
        gorselKucuk: gorsel.kucuk,
        gorselKaynagi: gorsel.kaynak,
        gorselBaslik: gorsel.baslik,
        gorselKunyesi: gorsel.kunye,
        metin,
        kelimeSayisi: akicilik.kelime,
        akicilik: akicilik.olcum,
        akicilikPuani: akicilik.puan,
        analiz,
      };

      await kayitYaz(yeni);
      /* Karnede görünsün. 'recording' türü gölgeleme kayıtlarıyla aynı
         sayacı besliyor; ikisi de "sesli çalıştım" demek. */
      void logActivity({ app: 'konusma', skill: 'speaking', kind: 'recording' });
      void logActivity({ app: 'konusma', skill: 'speaking', kind: 'complete' });

      setKayit(yeni);
      setAsama('sonuc');
      onKaydedildi();
    } catch (err: any) {
      if (canliRef.current) setHata(err?.message || 'Betimleme çözümlenemedi.');
    } finally {
      if (canliRef.current) setMesgul(null);
    }
  };

  /* ---------------------------------------------------------------- */

  if (asama === 'secim') {
    return (
      <GorselSecici
        seviye={seviye}
        onSeviyeDegis={onSeviyeDegis}
        onGetir={getir}
        onYukle={yukle}
        calisiyor={!!mesgul}
        hata={hata}
      />
    );
  }

  return (
    <div className="space-y-8">

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[22px] font-semibold tracking-tight text-ink">
            {asama === 'sonuc' ? 'Çözümleme' : 'Görseli anlat'}
          </h1>
          {gorsel?.baslik && (
            <p className="mt-0.5 text-[12px] text-ink-3">
              {gorsel.baslik}
              {gorsel.kaynak === 'fotograf' ? ' · hazır fotoğraf' : ' · senin yüklediğin'}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={sifirla}
          className="flex items-center gap-2 rounded-xl border border-hairline px-4 py-2
            text-[13px] font-medium text-ink-2 transition-colors hover:bg-paper-3
            hover:text-ink cursor-pointer"
        >
          <ImagePlus className="h-4 w-4" />
          Yeni görsel
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

        {/* GÖRSEL — çözümlemede de ekranda kalıyor. Sonuçları okurken
            "hangi ayrıntıyı kaçırmışım" sorusunun cevabı orada. */}
        <div className="lg:col-span-5">
          <div className="overflow-hidden rounded-xl border border-hairline bg-paper-2
            lg:sticky lg:top-24">
            <img
              src={gorsel?.cozumleme}
              alt="Betimlenecek görsel"
              className="block w-full"
            />
            <GorselKunyesiSatiri kunye={gorsel?.kunye} />
          </div>
        </div>

        <div className="space-y-8 lg:col-span-7">

          {asama === 'anlat' && (
            <>
              <p className="max-w-[60ch] text-[14px] leading-relaxed text-ink-2">
                Görseldeki her şeyi anlatmaya çalış: kimler var, ne yapıyorlar,
                nerede, hava nasıl, arkada ne görünüyor. Takılırsan dur ve devam
                et — duraksamalar da ölçülüyor ama ceza değil, bilgi.
              </p>
              <KayitPaneli onKayitBitti={kayitBitti} kilitli={!!mesgul} />
            </>
          )}

          {asama === 'metin' && (
            <div className="space-y-4">
              <div>
                <h2 className="text-[15px] font-semibold text-ink">
                  Söylediklerin doğru yazılmış mı?
                </h2>
                <p className="mt-1 max-w-[60ch] text-[13px] leading-relaxed text-ink-2">
                  Çözümleyicinin YANLIŞ DUYDUĞU kelimeleri düzelt. Gramerini
                  düzeltme — inceleme bu metin üzerinden yapılıyor, düzeltirsen
                  kendi hatalarını göremezsin.
                </p>
              </div>

              <textarea
                value={metin}
                onChange={(e) => setMetin(e.target.value)}
                rows={8}
                className="transcript-en w-full rounded-xl border border-hairline bg-paper-2
                  p-4 text-ink"
              />

              {akicilik && (
                <p className="text-[12px] text-ink-3">
                  <span className="timecode">{akicilik.kelime}</span> kelime ·{' '}
                  <span className="timecode">{akicilik.olcum.kelimeHizi}</span> kelime/dk ·{' '}
                  <span className="timecode">{akicilik.olcum.duraklamaSayisi}</span> uzun duraksama
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={cozumle}
                  disabled={!!mesgul || metin.trim().split(/\s+/).length < 5}
                  className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3
                    text-[14px] font-medium text-white transition-colors
                    hover:bg-accent-700 disabled:opacity-50 cursor-pointer"
                >
                  {mesgul ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Çözümle
                </button>
                <button
                  type="button"
                  onClick={() => { setAsama('anlat'); setMetin(''); setAkicilik(null); }}
                  disabled={!!mesgul}
                  className="flex items-center gap-2 rounded-xl border border-hairline
                    px-5 py-3 text-[14px] font-medium text-ink-2 transition-colors
                    hover:bg-paper-3 hover:text-ink disabled:opacity-50 cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  Yeniden anlat
                </button>
              </div>
            </div>
          )}

          {asama === 'sonuc' && kayit && (
            <div className="space-y-8">
              <AnalizSonucu kayit={kayit} />
              <div className="flex flex-wrap gap-3 border-t border-hairline pt-6">
                <button
                  type="button"
                  onClick={() => { setAsama('anlat'); setMetin(''); setAkicilik(null); setKayit(null); }}
                  className="flex items-center gap-2 rounded-xl border border-hairline
                    px-5 py-3 text-[14px] font-medium text-ink-2 transition-colors
                    hover:bg-paper-3 hover:text-ink cursor-pointer"
                >
                  <RotateCcw className="h-4 w-4" />
                  Aynı görseli tekrar anlat
                </button>
                <button
                  type="button"
                  onClick={sifirla}
                  className="flex items-center gap-2 rounded-xl bg-accent px-5 py-3
                    text-[14px] font-medium text-white transition-colors
                    hover:bg-accent-700 cursor-pointer"
                >
                  <ImagePlus className="h-4 w-4" />
                  Yeni görselle devam et
                </button>
              </div>
            </div>
          )}

          {mesgul && asama !== 'sonuc' && (
            <p className="flex items-center gap-2 text-[13px] text-ink-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {mesgul}…
            </p>
          )}

          {hata && (
            <p className="flex items-start gap-2 rounded-xl border border-danger-line
              bg-danger-soft p-3 text-[13px] leading-relaxed text-danger">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              {hata}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
