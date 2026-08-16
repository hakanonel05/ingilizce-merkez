import React, { useState, useEffect } from 'react';
import {
  getSyncCode, setSyncCode, getLastSync, isSyncAvailable, resetSyncState,
  syncNow, onSynced, hasSyncCode,
} from '../../lib/syncClient';
import { RefreshCw, Cloud, CloudOff, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';

/**
 * Cihazlar arası senkron paneli.
 *
 * Giriş ekranı yok; tek bir "senkron kodu" ile çalışır. Aynı kodu girdiğiniz
 * her cihaz aynı veriyi görür. Kod sunucuda hash'lenip veri alanına çevrilir,
 * düz metin olarak saklanmaz.
 *
 * Senkron artık otomatik: kod bir kez kaydedilince açılışta veri çekilir,
 * değişiklikler durulunca kendiliğinden gönderilir. Buradaki düğme yalnızca
 * "hemen şimdi" demek isteyenler için.
 */
export const SyncPanel: React.FC = () => {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [code, setCode] = useState(getSyncCode());
  const [showCode, setShowCode] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [lastSync, setLastSyncState] = useState(getLastSync());
  const [codeSaved, setCodeSaved] = useState(hasSyncCode());

  useEffect(() => {
    isSyncAvailable().then(setAvailable);
    // Otomatik senkron da bittiginde "son senkron" bilgisini tazele
    return onSynced((r) => setLastSyncState(r.at));
  }, []);

  const handleSaveCode = () => {
    const trimmed = code.trim();
    setSyncCode(trimmed);
    resetSyncState();
    setLastSyncState(null);
    setCodeSaved(trimmed.length >= 6);
    setError(null);
    setResult(
      trimmed.length >= 6
        ? 'Kod kaydedildi. Verileriniz bundan sonra kendiliğinden yedeklenecek.'
        : 'Kod silindi. Veriler yalnızca bu tarayıcıda tutulacak.'
    );
  };

  const handleSync = async () => {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const r = await syncNow(setProgress);
      setLastSyncState(r.at);
      setResult(
        `${r.pushed} kayıt gönderildi, ${r.pulled} kayıt alındı` +
          (r.audioUp || r.audioDown
            ? `, ${r.audioUp} ses yüklendi, ${r.audioDown} ses indirildi.`
            : '.')
      );
    } catch (err: any) {
      setError(err?.message || 'Senkronizasyon başarısız.');
    } finally {
      setBusy(false);
      setProgress('');
    }
  };

  if (available === false) {
    return (
      <div className="flex items-start gap-2.5 rounded-[10px] border border-[var(--hairline)] bg-[var(--paper-3)] p-3">
        <CloudOff className="w-4 h-4 shrink-0 mt-0.5 text-[var(--ink-3)]" />
        <p className="text-[11px] leading-relaxed text-[var(--ink-2)]">
          Senkronizasyon kapalı. Sunucuda{' '}
          <code className="font-mono">SUPABASE_URL</code> ve{' '}
          <code className="font-mono">SUPABASE_SERVICE_ROLE_KEY</code> tanımlı değil.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Cloud className="w-3.5 h-3.5 shrink-0 text-[var(--ink-2)]" />
          <span className="text-xs font-semibold text-[var(--ink)]">Cihazlar Arası Senkron</span>
        </div>
        <span
          className={`text-[10px] px-1.5 py-0.5 rounded border ${
            codeSaved
              ? 'border-[var(--hairline)] text-[var(--ink-3)]'
              : 'border-[var(--marker)] bg-[var(--marker-bg)] text-[var(--marker-ink)]'
          }`}
        >
          {codeSaved ? 'açık — otomatik' : 'kapalı — yalnızca bu tarayıcı'}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <input
          type={showCode ? 'text' : 'password'}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="en az 6 karakter"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 min-w-0 px-3 py-2 rounded-[8px] border border-[var(--hairline)] bg-[var(--paper)] text-[var(--ink)] text-xs font-mono focus:outline-none focus:border-[var(--ink-3)]"
        />
        <button
          type="button"
          onClick={() => setShowCode((v) => !v)}
          className="p-2 rounded-[8px] border border-[var(--hairline)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors cursor-pointer shrink-0"
          aria-label={showCode ? 'Kodu gizle' : 'Kodu göster'}
        >
          {showCode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
        <button
          type="button"
          onClick={handleSaveCode}
          className="h-9 px-3 rounded-[8px] border border-[var(--hairline)] text-[var(--ink-2)] text-xs font-medium hover:border-[var(--hairline-2)] hover:text-[var(--ink)] transition-colors cursor-pointer shrink-0"
        >
          Kaydet
        </button>
      </div>

      <p className="text-[11px] leading-relaxed text-[var(--ink-3)]">
        Bu kodu diğer cihazlarınıza da girin; aynı kodu kullanan her cihaz aynı dersleri,
        ilerlemeyi, kelime kartlarını ve ses kayıtlarını görür.{' '}
        <strong className="text-[var(--ink-2)]">Kod bir şifre gibidir</strong> — tahmin
        edilmesi zor bir şey seçin ve kimseyle paylaşmayın. API anahtarlarınız güvenlik
        için senkronlanmaz, her cihazda ayrı girilir.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[10px] text-[var(--ink-3)]">
          {lastSync
            ? `Son senkron: ${new Date(lastSync).toLocaleString('tr-TR')}`
            : 'Henüz senkronlanmadı'}
        </span>
        <button
          type="button"
          onClick={handleSync}
          disabled={busy || !codeSaved}
          className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] bg-[var(--ink)] text-[var(--paper-2)] text-xs font-medium hover:opacity-90 disabled:opacity-40 transition-opacity cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${busy ? 'animate-spin' : ''}`} />
          <span>{busy ? progress || 'Senkronize ediliyor...' : 'Şimdi Senkronize Et'}</span>
        </button>
      </div>

      {result && (
        <p className="flex items-start gap-1.5 text-[11px] text-[var(--ink-2)]">
          <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{result}</span>
        </p>
      )}

      {error && (
        <p className="flex items-start gap-1.5 text-[11px] text-[var(--danger)] bg-[var(--danger-bg)] border border-[var(--danger)]/20 rounded-[8px] px-2.5 py-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span>{error}</span>
        </p>
      )}

      <p className="text-[10px] leading-relaxed text-[var(--ink-3)]">
        Çakışmalarda en son değiştirilen kayıt geçerli olur. Çevrimdışıyken değişiklikler
        cihazda bekler ve bağlantı gelince kendiliğinden gönderilir.
      </p>
    </div>
  );
};
