import { useState, useEffect, FormEvent } from 'react';
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
 *
 * GOOGLE İLE GİRİŞ, hesap bölümünün ilk seçeneği: şifre hatırlamayı
 * gerektirmediği için e-postadan kolay. Supabase'in OAuth akışı kullanılıyor;
 * Google'a gidip geri dönüyor, oturumu supabase-js URL'den kendi alıyor.
 *
 * SUNUCU TARAFINDA BİR KEZ YAPILMASI GEREKEN AYAR VAR — kod tek başına
 * yetmez. Supabase panelinde Authentication → Sign In / Providers → Google
 * açılmalı ve oraya Google Cloud'dan alınan OAuth istemci kimliği ile sırrı
 * girilmeli. Google Cloud tarafında da izin verilen yönlendirme adresi
 * `https://<proje>.supabase.co/auth/v1/callback` olmalı. Ayar yapılmadan
 * düğmeye basılırsa Supabase "provider is not enabled" döndürüyor; o hata
 * aşağıda Türkçeye çevriliyor, yoksa kullanıcı neyin eksik olduğunu
 * anlayamıyor.
 */

/** Google'ın çok renkli "G" işareti. Giriş düğmesinde markanın kendisi
 *  beklenir; lucide'daki tek renkli ikon burada yanlış olurdu. */
function GoogleIsareti() {
  return (
    <svg viewBox="0 0 48 48" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.2-.4-4.7H24v8.9h11.8c-.5 2.7-2.1 5-4.4 6.6v5.5h7.1c4.2-3.8 6.6-9.5 6.6-16.3z" />
      <path fill="#34A853" d="M24 46c6 0 11-2 14.6-5.4l-7.1-5.5c-2 1.3-4.5 2.1-7.5 2.1-5.8 0-10.7-3.9-12.4-9.1H4.3v5.7C7.9 41.1 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.6 28.1c-.4-1.3-.7-2.7-.7-4.1s.2-2.8.7-4.1v-5.7H4.3C2.8 17.1 2 20.4 2 24s.8 6.9 2.3 9.8l7.3-5.7z" />
      <path fill="#EA4335" d="M24 10.8c3.3 0 6.2 1.1 8.5 3.3l6.3-6.3C35 4.2 30 2 24 2 15.4 2 7.9 6.9 4.3 14.2l7.3 5.7c1.7-5.2 6.6-9.1 12.4-9.1z" />
    </svg>
  );
}

/**
 * Supabase'in OAuth hatalarını, ne yapılacağını söyleyen Türkçeye çevirir.
 *
 * Ham metinler kullanıcıya hiçbir şey anlatmıyor ("Unable to exchange
 * external code: 4/0A"). Üstelik bu hataların çoğu kullanıcının değil
 * kurulumun sorunu; mesaj nerede bakılacağını söylemezse kimse çözemiyor.
 * Tanınmayan hata olduğu gibi gösteriliyor — uydurma bir açıklama, yanlış
 * yere bakmaya yol açar.
 */
function oauthHatasiniCevir(ham: string): string | null {
  if (/provider is not enabled|Unsupported provider/i.test(ham)) {
    return 'Google girişi Supabase panelinde henüz açılmamış. Authentication → Providers → Google bölümünden açılması gerekiyor.';
  }
  /* Google, yetkilendirme kodunu jetona çevirmeyi reddetti. Kod ve
     yönlendirme adresi doğruysa geriye tek değişken kalıyor: istemci sırrı.
     Kurulum sırasında bu alana yanlışlıkla başka bir şey yazılması —
     tarayıcının kayıtlı şifresini otomatik doldurması dahil — sık görülüyor. */
  if (/Unable to exchange external code|invalid_client|unauthorized_client/i.test(ham)) {
    return 'Google ile bağlantı kurulamadı: Supabase\'deki Client Secret, Google Cloud\'daki istemcinin sırrıyla eşleşmiyor. Google Cloud → Clients → ilgili istemci → Add secret ile yeni bir sır üretip Supabase → Authentication → Providers → Google alanına yapıştırmak gerekiyor.';
  }
  if (/redirect_uri_mismatch/i.test(ham)) {
    return 'Yönlendirme adresi Google\'da tanımlı değil. Google Cloud\'daki istemcinin Authorized redirect URIs listesinde Supabase callback adresi birebir yazmalı.';
  }
  if (/access_denied/i.test(ham)) {
    return 'Google ile giriş yarıda kaldı. İstersen tekrar deneyebilirsin.';
  }
  return null;
}

export default function AuthScreen({ onContinueOffline }: { onContinueOffline: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  /**
   * OAuth hatası adres çubuğundan gelir, çağrıdan değil.
   *
   * signInWithOAuth bir söz döndürüp beklemiyor: tarayıcıyı Google'a
   * yönlendiriyor. Bu yüzden "sağlayıcı kapalı", "kullanıcı vazgeçti" gibi
   * durumlar aşağıdaki try/catch'e hiç düşmez — kullanıcı siteye geri
   * döner ve adreste `?error=...` ya da `#error=...` yazar. Bu okunmazsa
   * ekranda hiçbir şey olmamış gibi görünür: kullanıcı düğmeye basar,
   * Google'a gider, geri gelir ve yine aynı giriş ekranıyla karşılaşır.
   */
  useEffect(() => {
    const ara = new URLSearchParams(window.location.search);
    const kesme = new URLSearchParams(window.location.hash.replace(/^#/, ''));
    const kod = ara.get('error') || kesme.get('error');
    if (!kod) return;

    const aciklama = ara.get('error_description') || kesme.get('error_description') || '';
    setError(oauthHatasiniCevir(kod + ' ' + aciklama) || aciklama || 'Google ile giriş tamamlanamadı.');

    /* Adresi temizle ki sayfa yenilenince hata geri gelmesin. */
    window.history.replaceState({}, '', window.location.pathname);
  }, []);

  const googleIleGir = async () => {
    setGoogleLoading(true);
    setError(null);
    setNotice(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        /* Google'dan dönüş bu sayfaya olsun. Alan adı sabit yazılmıyor:
           yerelde localhost:5173, canlıda site adresi aynı kodla çalışsın. */
        options: { redirectTo: window.location.origin + '/' },
      });
      if (error) throw error;
      /* Buraya gelinirse tarayıcı Google'a yönleniyor demektir; düğme
         "Yönlendiriliyor..." halinde kalsın, sayfa zaten değişecek. */
    } catch (err: any) {
      const ham = err?.message || '';
      setError(oauthHatasiniCevir(ham) || ham || 'Google ile giriş yapılamadı.');
      setGoogleLoading(false);
    }
  };

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

        {/* Uyarılar formun dışında: Google yolu da buraya yazıyor. */}
        {error && (
          <div className="mt-4 rounded-lg border border-danger-line bg-danger-soft p-3 text-[12px] text-danger">
            {error}
          </div>
        )}
        {notice && (
          <div className="mt-4 rounded-lg border border-ok-line bg-ok-soft p-3 text-[12px] text-ok">
            {notice}
          </div>
        )}

        {/* Hesap bölümünün ilk seçeneği: şifre gerektirmiyor. */}
        <button
          type="button"
          onClick={googleIleGir}
          disabled={googleLoading || loading}
          className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-lg border
            border-hairline-2 bg-paper-2 py-2 text-sm font-semibold text-ink
            transition-colors duration-150 hover:bg-paper-3 disabled:opacity-50 cursor-pointer"
        >
          <GoogleIsareti />
          {googleLoading ? 'Yönlendiriliyor...' : 'Google ile devam et'}
        </button>

        <div className="my-4 flex items-center gap-3">
          <span className="h-px flex-1 bg-hairline" />
          <span className="text-[11px] text-ink-3">veya e-posta ile</span>
          <span className="h-px flex-1 bg-hairline" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
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
            disabled={loading || googleLoading}
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
