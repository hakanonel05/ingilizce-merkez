import { useState, FormEvent } from 'react';
import { supabase } from '../lib/supabase';
import { BookOpen } from 'lucide-react';

export default function AuthScreen({ onContinueOffline }: { onContinueOffline: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('Kayıt başarılı! Lütfen giriş yapın.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-paper flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-paper-2 p-8 border border-hairline/40 rounded-xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-accent flex items-center justify-center mb-4">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-display font-semibold text-ink tracking-tight text-center">
            Lexis Trainer
          </h1>
          <p className="text-sm text-ink/60 mt-2 text-center font-display">
            Cihazlar arası bulut senkronizasyonu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-rose-50 text-rose-700 text-sm border border-rose-200 rounded-lg">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-ink mb-1">E-posta</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-hairline/40 focus:outline-none focus:border-accent bg-paper rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Şifre</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-hairline/40 focus:outline-none focus:border-accent bg-paper rounded-lg"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-accent text-white py-2 font-semibold hover:bg-accent/90 transition-colors disabled:opacity-50 rounded-lg"
          >
            {loading ? 'Bekleyiniz...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-accent hover:underline"
          >
            {isLogin ? 'Hesabınız yok mu? Kayıt Olun' : 'Zaten hesabınız var mı? Giriş Yapın'}
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-hairline/20 text-center">
          <button
            onClick={onContinueOffline}
            className="text-xs text-ink-3 hover:text-ink underline font-mono tracking-wide"
          >
            Çevrimdışı Devam Et (Senkronizasyon Kapalı)
          </button>
        </div>
      </div>
    </div>
  );
}
