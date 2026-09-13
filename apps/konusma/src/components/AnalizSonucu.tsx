/**
 * ÇÖZÜMLEME EKRANI
 *
 * Bir betimlemenin bütün çıktısı burada. Hem alıştırma bittiğinde hem
 * geçmişten bir kayda bakıldığında aynı bileşen çiziliyor — iki ayrı
 * görünüm yazmak, ikisinin zamanla ayrışması demekti.
 *
 * DÜZEN KARARLARI:
 *
 * 1. TEK YÜZEY. Her bölüm için bir kart açmak (SaaS panosu refleksi) sekiz
 *    kutu üretirdi. Bölümler yatay çizgilerle ayrılıyor, hepsi aynı
 *    düzlemde. Yükseklik farkı yok, çünkü hiçbiri diğerinin üstünde değil.
 *
 * 2. SEVİYE EN ÜSTTE VE BÜYÜK. Kullanıcının ilk baktığı şey o; puntosu
 *    bunu söylüyor, rengi değil. Renk burada yalnızca doğru/yanlış
 *    ayrımında iş görüyor (hatalı ifade / düzeltilmiş hali).
 *
 * 3. HATALAR ÖNCE, ÖVGÜ SONRA DEĞİL. Güçlü yanlar üstte duruyor ama kısa;
 *    uzun bir motivasyon paragrafı, altındaki asıl bilgiyi katlamanın
 *    altına iter.
 */

import React from 'react';
import { ArrowRight, Eye, EyeOff, Gauge } from 'lucide-react';
import type { BetimlemeKaydi } from '../types';

const Bolum: React.FC<{ baslik: string; children: React.ReactNode; not?: string }> = ({
  baslik, children, not,
}) => (
  <section className="border-t border-hairline pt-6">
    <h3 className="eyebrow mb-1">{baslik}</h3>
    {not && <p className="mb-3 text-[12px] leading-relaxed text-ink-3">{not}</p>}
    <div className={not ? '' : 'mt-3'}>{children}</div>
  </section>
);

/** Hatalı → doğru satırı. İki hâli yan yana görmek, açıklamadan önce geliyor. */
const DuzeltmeSatiri: React.FC<{
  yanlis: string;
  dogru: string;
  etiket?: string;
  aciklama: string;
}> = ({ yanlis, dogru, etiket, aciklama }) => (
  <li className="py-3">
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px]">
      <span className="rounded bg-danger-soft px-1.5 py-0.5 text-danger line-through
        decoration-danger/50">
        {yanlis}
      </span>
      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-ink-3" />
      <span className="rounded bg-ok-soft px-1.5 py-0.5 font-medium text-ok-strong">
        {dogru}
      </span>
      {etiket && (
        <span className="timecode rounded bg-paper-3 px-1.5 py-0.5 text-ink-2">
          {etiket}
        </span>
      )}
    </p>
    <p className="mt-1.5 max-w-[68ch] text-[13px] leading-relaxed text-ink-2">
      {aciklama}
    </p>
  </li>
);

export const AnalizSonucu: React.FC<{ kayit: BetimlemeKaydi }> = ({ kayit }) => {
  const a = kayit.analiz;

  return (
    <div className="space-y-6">

      {/* SEVİYE */}
      <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
        <div>
          <span className="eyebrow block">Bu betimleme</span>
          <span className="mt-1 block text-[52px] font-semibold leading-none tracking-tight text-ink">
            {a.cefr}
          </span>
        </div>
        <div className="min-w-[240px] flex-1">
          <p className="max-w-[62ch] text-[14px] leading-relaxed text-ink-2">
            {a.seviyeGerekcesiTr}
          </p>
        </div>
      </div>

      {/* AKICILIK — ölçülen sayılar. Puanlardan çok, sayıların kendisi
          işe yarıyor: "dakikada 74 kelime" bir hedef verir. */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl
        border border-hairline bg-paper-2 px-4 py-3">
        <span className="flex items-center gap-2 text-[12px] text-ink-3">
          <Gauge className="h-3.5 w-3.5" />
          Akıcılık
        </span>
        <span className="text-[13px] text-ink-2">
          <span className="timecode text-[14px] font-semibold text-ink">
            {kayit.akicilik.kelimeHizi}
          </span>{' '}
          kelime/dk
        </span>
        <span className="text-[13px] text-ink-2">
          <span className="timecode text-[14px] font-semibold text-ink">
            {kayit.akicilik.konusmaSuresi.toFixed(0)}
          </span>{' '}
          saniye
        </span>
        <span className="text-[13px] text-ink-2">
          <span className="timecode text-[14px] font-semibold text-ink">
            {kayit.kelimeSayisi}
          </span>{' '}
          kelime
        </span>
        <span className="text-[13px] text-ink-2">
          <span className="timecode text-[14px] font-semibold text-ink">
            {kayit.akicilik.duraklamaSayisi}
          </span>{' '}
          uzun duraksama
        </span>
      </div>

      {a.gucluYanlarTr?.length > 0 && (
        <Bolum baslik="İyi yaptığın">
          <ul className="max-w-[68ch] space-y-1.5 text-[14px] leading-relaxed text-ink-2">
            {a.gucluYanlarTr.map((g, i) => (
              <li key={i} className="flex gap-2">
                <span aria-hidden="true" className="text-ok">·</span>
                {g}
              </li>
            ))}
          </ul>
        </Bolum>
      )}

      <Bolum
        baslik="Gramer"
        not={
          a.gramerHatalari?.length
            ? 'Noktalama ve büyük harf değerlendirmeye alınmıyor: onları konuşma çözümleyicisi kendisi ekliyor, senin tercihin değil.'
            : undefined
        }
      >
        {a.gramerHatalari?.length ? (
          <ul className="divide-y divide-hairline">
            {a.gramerHatalari.map((h, i) => (
              <DuzeltmeSatiri
                key={i}
                yanlis={h.hatali}
                dogru={h.dogrusu}
                etiket={h.kuralTr}
                aciklama={h.aciklamaTr}
              />
            ))}
          </ul>
        ) : (
          <p className="text-[14px] text-ink-2">
            Bu betimlemede düzeltilecek bir gramer hatası bulunmadı.
          </p>
        )}
      </Bolum>

      <Bolum
        baslik="Kelime seçimi"
        not={a.kelimeSecimi?.length
          ? 'Bir kısmı yanlış, bir kısmı yalnızca zayıf. İkisi de listede, çünkü "very big" yanlış değil ama "enormous" demeyi bilmek seviye farkı.'
          : undefined}
      >
        {a.kelimeSecimi?.length ? (
          <ul className="divide-y divide-hairline">
            {a.kelimeSecimi.map((k, i) => (
              <DuzeltmeSatiri
                key={i}
                yanlis={k.kullanilan}
                dogru={k.oneri}
                aciklama={k.nedenTr}
              />
            ))}
          </ul>
        ) : (
          <p className="text-[14px] text-ink-2">
            Kelime seçimlerinde düzeltilecek bir şey bulunmadı.
          </p>
        )}
      </Bolum>

      {/* GÖRSELE BAĞLI BÖLÜM. Model görseli görmediyse hiç çizilmiyor:
          "şunu kaçırdın" demek için görseli görmüş olmak gerekir. */}
      {a.gorselGorulduMu ? (
        a.kacirilanlarTr?.length > 0 && (
          <Bolum
            baslik="Görselde olup söylemediklerin"
            not="Betimlemeyi uzatan ve seviyeyi yükselten şey çoğu zaman bunlar."
          >
            <ul className="max-w-[68ch] space-y-1.5 text-[14px] leading-relaxed text-ink-2">
              {a.kacirilanlarTr.map((k, i) => (
                <li key={i} className="flex gap-2">
                  <Eye className="mt-1 h-3.5 w-3.5 shrink-0 text-ink-3" />
                  {k}
                </li>
              ))}
            </ul>
          </Bolum>
        )
      ) : (
        <p className="flex items-start gap-2 rounded-xl border border-hairline
          bg-paper-3 p-3 text-[12px] leading-relaxed text-ink-2">
          <EyeOff className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-3" />
          Bu çözümlemede görsel modele ulaştırılamadı; değerlendirme yalnızca
          metin üzerinden yapıldı. Gramer ve seviye geçerli, ama "görselde
          olup söylemediklerin" ölçülemedi.
        </p>
      )}

      <Bolum
        baslik={`${a.hedefSeviye} seviyesinde nasıl anlatılırdı`}
        not={a.ustSeviyeNotuTr}
      >
        <p className="transcript-en max-w-[62ch] rounded-xl border border-hairline
          bg-paper-2 p-4 text-ink">
          {a.ustSeviyeOrnek}
        </p>
      </Bolum>

      {a.iseYararKelimeler?.length > 0 && (
        <Bolum baslik="Bu görsel için işine yarar">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {a.iseYararKelimeler.map((k, i) => (
              <li key={i} className="text-[14px]">
                <span className="font-medium text-ink">{k.ifade}</span>
                <span className="text-ink-3"> — {k.anlamTr}</span>
              </li>
            ))}
          </ul>
        </Bolum>
      )}

      <Bolum
        baslik="Senin anlattığın"
        not="Konuşmanın tarayıcıda yazıya çevrilmiş hali. Ses kaydı saklanmadı."
      >
        <p className="transcript-en max-w-[62ch] text-ink-2">{kayit.metin}</p>
      </Bolum>
    </div>
  );
};
