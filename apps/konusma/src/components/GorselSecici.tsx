/**
 * GÖRSEL SEÇİMİ — alıştırmanın başlangıcı.
 *
 * İKİ YOL VAR VE EŞİT AĞIRLIKTA DEĞİLLER. Yükleme dolu düğme ve önce
 * geliyor: normal kullanım bu — kendi bulduğun bir fotoğrafı anlatmak,
 * hem daha ilgi çekici hem tamamen senin kontrolünde. "Hazır görsel
 * getir" ikincil, elinde bir şey yokken bir tık uzakta dursun diye.
 *
 * YAPAY ZEKÂ İLE GÖRSEL ÜRETİMİ KALDIRILDI. Ölçüldü ve üç yönden de
 * kaybediyordu: Gemini'nin görsel üretimi ücretsiz katmanda hiç yok
 * (limit: 0), anahtarsız yedek olan servis üst üste isteklerde çöküyordu
 * (on istekte üç 429, üç zaman aşımı, başarılı olanlar 44 saniye) ve
 * ürettiği kareler filigranlıydı. Gerçek fotoğraflar aynı ölçümde beş kat
 * hızlı geldi ve betimlenecek ayrıntısı daha fazlaydı.
 *
 * SEVİYE SEÇİMİ BURADA, çünkü iki şeyi birden belirliyor: hazır görselin
 * hangi zorlukta bir sahne olacağını ve çözümlemede örnek betimlemenin
 * hangi seviyede yazılacağını (bir üstü). Sonra sorulsaydı geç kalırdı.
 */

import React, { useRef, useState } from 'react';
import { Upload, Loader2, AlertTriangle, Image as ImageIcon } from 'lucide-react';
import { CEFR_SIRASI, type Cefr } from '../types';

interface Props {
  seviye: Cefr;
  onSeviyeDegis: (s: Cefr) => void;
  /** Seviyeye uygun hazır bir fotoğraf getirir. */
  onGetir: () => void;
  onYukle: (dosya: File) => void;
  calisiyor: boolean;
  hata: string | null;
}

export const GorselSecici: React.FC<Props> = ({
  seviye, onSeviyeDegis, onGetir, onYukle, calisiyor, hata,
}) => {
  const dosyaRef = useRef<HTMLInputElement>(null);
  const [surukleniyor, setSurukleniyor] = useState(false);

  const dosyayiAl = (dosya?: File | null) => {
    if (!dosya) return;
    if (!dosya.type.startsWith('image/')) return;
    onYukle(dosya);
  };

  return (
    <div className="max-w-[720px] space-y-8">

      <div className="space-y-2">
        <h1 className="text-[26px] font-semibold tracking-tight text-ink">
          Bir görseli İngilizce anlat
        </h1>
        <p className="max-w-[58ch] text-[14px] leading-relaxed text-ink-2">
          Görseli gör, mikrofona bas ve aklına geldiği gibi anlat. Bittiğinde
          konuşman yazıya dökülüp incelenir: hangi gramer hatalarını yaptın,
          hangi kelime yerine ne demeliydin, bu betimleme hangi CEFR
          seviyesinde ve bir üst seviyede nasıl anlatılırdı.
        </p>
      </div>

      {/* Seviye. Etiket ve seçici tek satırda — ayrı bir form kutusu
          kurmayı hak edecek kadar büyük bir karar değil. */}
      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="seviye" className="text-[13px] text-ink-2">
          Şu anki seviyen
        </label>
        <select
          id="seviye"
          value={seviye}
          onChange={(e) => onSeviyeDegis(e.target.value as Cefr)}
          className="rounded-xl border border-hairline bg-paper-2 px-3 py-1.5 text-[13px]
            text-ink cursor-pointer"
        >
          {CEFR_SIRASI.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <span className="text-[12px] text-ink-3">
          Örnek betimlemenin seviyesini ve hazır görselin zorluğunu belirler.
        </span>
      </div>

      {/* BIRAKMA ALANI. İnternetten bulduğun bir görseli sürükleyip
          bırakmak, indirip dosya seçiciden bulmaktan kısa; yapıştırma da
          çalışıyor (aşağıdaki onPaste). Kenarlık kesikli, çünkü bu bir
          kart değil bir hedef. */}
      <div>
        <input
          ref={dosyaRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            dosyayiAl(e.target.files?.[0]);
            /* Aynı dosya ikinci kez seçilebilsin: değer temizlenmezse
               tarayıcı change olayını hiç tetiklemiyor. */
            e.target.value = '';
          }}
        />

        <div
          onDragOver={(e) => { e.preventDefault(); setSurukleniyor(true); }}
          onDragLeave={() => setSurukleniyor(false)}
          onDrop={(e) => {
            e.preventDefault();
            setSurukleniyor(false);
            dosyayiAl(e.dataTransfer.files?.[0]);
          }}
          onPaste={(e) => {
            /* DataTransferItemList dizi değil; Array.from onu `unknown[]`
               olarak tipliyor. Elle dolaşmak hem tip güvenli hem daha açık. */
            const ogeler = e.clipboardData.items;
            for (let i = 0; i < ogeler.length; i++) {
              if (ogeler[i].type.startsWith('image/')) {
                dosyayiAl(ogeler[i].getAsFile());
                return;
              }
            }
          }}
          className={`rounded-xl border border-dashed p-8 text-center transition-colors
            ${surukleniyor ? 'border-accent bg-accent-soft' : 'border-hairline-2 bg-paper-2'}`}
        >
          <button
            type="button"
            onClick={() => dosyaRef.current?.click()}
            disabled={calisiyor}
            className="mx-auto flex items-center justify-center gap-2 rounded-xl bg-accent
              px-5 py-3 text-[14px] font-medium text-white transition-colors
              hover:bg-accent-700 disabled:opacity-50 cursor-pointer"
          >
            {calisiyor ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            Görsel yükle
          </button>
          <p className="mt-3 text-[12px] leading-relaxed text-ink-3">
            Sürükleyip bırakabilir ya da kopyaladığın bir görseli buraya
            yapıştırabilirsin.
          </p>
        </div>

        {/* MAHREMİYET VE İŞLEYİŞ TEK CÜMLEDE. Kullanıcının bilmesi gereken
            şey, yüklediği görselin çözümlemeye GİTTİĞİ — yoksa "resmi
            gördü mü acaba" sorusu havada kalıyor. */}
        <p className="mt-3 max-w-[62ch] text-[12px] leading-relaxed text-ink-3">
          Görsel bu bilgisayarda küçültülür, sonra çözümleme için betimleme
          metninle birlikte yapay zekâya gider — çözümleyen model görseli
          gerçekten görüyor, böylece neyi atladığını da söyleyebiliyor.
          Hiçbir yere kaydedilmiyor; yalnızca senin cihazında, geçmiş
          listesinde küçük bir kopyası kalıyor.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-hairline" />
        <span className="text-[12px] text-ink-3">elinde görsel yoksa</span>
        <span className="h-px flex-1 bg-hairline" />
      </div>

      <div>
        <button
          type="button"
          onClick={onGetir}
          disabled={calisiyor}
          className="flex w-full items-center justify-center gap-2 rounded-xl border
            border-hairline bg-paper-2 px-5 py-3 text-[14px] font-medium text-ink
            transition-colors hover:bg-paper-3 disabled:opacity-50 cursor-pointer sm:w-auto"
        >
          {calisiyor
            ? <Loader2 className="h-4 w-4 animate-spin" />
            : <ImageIcon className="h-4 w-4 text-ink-3" />}
          Hazır bir görsel getir
        </button>
        <p className="mt-2 max-w-[62ch] text-[12px] leading-relaxed text-ink-3">
          Seviyene uygun bir sahne seçilip gerçek bir fotoğraf bulunur
          (Openverse). Yapay zekâ ile üretim yok — ücretsiz, saniyede geliyor
          ve fotoğrafçının künyesi karenin altında görünür.
        </p>
      </div>

      {hata && (
        <p className="flex items-start gap-2 rounded-xl border border-danger-line
          bg-danger-soft p-3 text-[13px] leading-relaxed text-danger">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          {hata}
        </p>
      )}
    </div>
  );
};
