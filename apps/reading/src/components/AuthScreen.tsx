import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen } from 'lucide-react';

/**
 * KARŞILAMA EKRANI
 *
 * BU BİR GİRİŞ DUVARI DEĞİL, olmamalı da: uygulamanın tamamı hesapsız
 * çalışıyor. Hesap yalnızca ilerlemeyi ikinci bir cihazda görmeye yarıyor.
 *
 * Bir süre öyle görünüyordu ve gerçek bir maliyeti oldu: ekran e-posta,
 * şifre ve dolu siyah bir "Giriş Yap" düğmesiyle açılıyordu; hesapsız
 * girmenin yolu ise en altta, en küçük puntoda, gri ve tek aralıklı
 * yazıyla duruyordu — üstelik adı "Çevrimdışı Devam Et (Senkronizasyon
 * Kapalı)" idi, yani kullanıcının değil sistemin diliyle. Siteyi ilk kez
 * açan biri duvarı görüp geri dönüyordu.
 *
 * Şimdi hiyerarşi işin gerçeğine uyuyor:
 *   - Ne olduğunu söyleyen bir cümle (eskiden yoktu: alt başlık ürünü
 *     değil hesabın bir özelliğini anlatıyordu).
 *   - Birincil eylem HESAPSIZ BAŞLAMAK, dolu mürekkep düğme.
 *   - Hesap ikincil: kenarlıklı düğme, ve ne işe yaradığı yazıyor.
 */
export default function AuthScreen({ onContinueOffline }: { onContinueOffline: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setNotice(null);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        /* Eskiden burada bir tarayıcı alert'i vardı. Sayfanın kendi
           diliyle konuşan bir bildirim, sistemin kutusundan iyi. */
        setNotice('Kayıt tamam. Şimdi aynı bilgilerle giriş yapabilirsin.');
        setIsLogin(true);
        setPassword('');
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md rounded-xl border border-hairline bg-paper-2 p-8">

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-accent">
            <BookOpen className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-display text-[26px] font-semibold tracking-tight text-ink">
            Lexis Trainer
          </h1>
          {/* Siteyi ilk kez açan biri ne olduğunu buradan anlamalı. */}
          <p className="mt-2 text-[13px] leading-relaxed text-ink-2">
            YDS ve YÖKDİL için 100 okuma parçası, 1226 kelimelik hazne ve
            süreli deneme sınavı. A1'den C1'e.
          </p>
        </div>

        {/* BİRİNCİL YOL: hesapsız başlamak. */}
        <button
          type="button"
          onClick={onContinueOffline}
          className="mt-7 w-full rounded-lg bg-accent py-2.5 text-sm font-semibold text-white
            transition-colors duration-150 hover:bg-accent-700 cursor-pointer"
        >
          Hemen başla
        </button>
        <p className="mt-2 text-center text-[12px] text-ink-3">
          Hesap gerekmiyor. İlerlemen bu cihazda saklanır.
        </p>

        <div className="my-7 flex items-center gap-3">
          <span className="h-px flex-1 bg-hairline" />
          <span className="text-[11px] uppercase tracking-[0.12em] text-ink-3">ya da</span>
          <span className="h-px flex-1 bg-hairline" />
        </div>

        {/* İKİNCİL YOL: hesap. Ne işe yaradığı yazıyor, çünkü tek işi bu. */}
        <h2 className="text-[13px] font-semibold text-ink">
          {isLogin ? 'Hesabınla giriş yap' : 'Yeni hesap aç'}
        </h2>
        <p className="mt-1 text-[12px] leading-relaxed text-ink-3">
          Yalnızca ilerlemeni başka bir cihazda da görmek istersen gerekir.
        </p>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {error && (
            <div className="rounded-lg border border-danger-line bg-danger-soft p-3 text-[12px] text-danger">
              {error}
            </div>
          )}
          {notice && (
            <div className="rounded-lg border border-ok-line bg-ok-soft p-3 text-[12px] text-ok">
              {notice}
            </div>
          )}

          <div>
            <label htmlFor="eposta" className="mb-1 block text-[12px] font-medium text-ink-2">
              E-posta
            </label>
            <input
              id="eposta"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-hairline bg-paper p-2 text-sm text-ink
                focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="sifre" className="mb-1 block text-[12px] font-medium text-ink-2">
              Şifre
            </label>
            <input
              id="sifre"
              type="password"
              required
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-hairline bg-paper p-2 text-sm text-ink
                focus:border-accent focus:outline-none"
            />
          </div>

          {/* Kenarlıklı: bu ekranın birincil eylemi yukarıdaki. */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg border border-hairline-2 bg-paper-2 py-2 text-sm
              font-semibold text-ink transition-colors duration-150
              hover:bg-paper-3 disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Bekleyiniz...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
          </button>
        </form>

        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(null); setNotice(null); }}
            className="text-[12px] text-brand hover:underline cursor-pointer"
          >
            {isLogin ? 'Hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}
          </button>
        </div>
      </div>
    </div>
  );
}
