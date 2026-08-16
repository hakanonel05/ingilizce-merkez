import React, { useEffect, useState } from 'react';
import { KeyRound, Eye, EyeOff, ExternalLink, Save, Trash2, X, Check, ShieldCheck } from 'lucide-react';
import {
  UserApiKeys,
  EMPTY_KEYS,
  loadUserKeys,
  saveUserKeys,
  clearUserKeys,
  fetchServerKeyStatus,
  ServerKeyStatus,
} from '../lib/userKeys';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface KeyFieldSpec {
  field: keyof UserApiKeys;
  label: string;
  hint: string;
  url: string;
  urlLabel: string;
}

const KEY_FIELDS: KeyFieldSpec[] = [
  {
    field: 'gemini',
    label: 'Google Gemini',
    hint: 'Ana yapay zekâ: çeviri, sözcük çıkarma, quiz, yazma değerlendirmesi, konuşma simülasyonu ve gramer koçu.',
    url: 'https://aistudio.google.com/apikey',
    urlLabel: 'aistudio.google.com/apikey',
  },
  {
    field: 'groq',
    label: 'Groq',
    hint: 'Yedek sağlayıcı. Gemini kotası dolduğunda otomatik devreye girer.',
    url: 'https://console.groq.com/keys',
    urlLabel: 'console.groq.com/keys',
  },
  {
    field: 'transcript',
    label: 'youtube-transcript.io',
    hint: 'YouTube altyazılarını çeker. YouTube sunucu IP’lerini engellediği için canlı sitede bu şart.',
    url: 'https://www.youtube-transcript.io/',
    urlLabel: 'youtube-transcript.io',
  },
  {
    field: 'libre',
    label: 'LibreTranslate',
    hint: 'Yapay zekâ yerine kullanılabilen alternatif çeviri servisi. İsteğe bağlı.',
    url: 'https://portal.libretranslate.com/',
    urlLabel: 'portal.libretranslate.com',
  },
];

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [keys, setKeys] = useState<UserApiKeys>(EMPTY_KEYS);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [serverStatus, setServerStatus] = useState<ServerKeyStatus | null>(null);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setKeys(loadUserKeys());
    setSavedMsg('');
    setVisible({});
    fetchServerKeyStatus().then(setServerStatus);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    saveUserKeys(keys);
    setSavedMsg('Anahtarlar bu tarayıcıya kaydedildi.');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  const handleClear = () => {
    clearUserKeys();
    setKeys({ ...EMPTY_KEYS });
    setSavedMsg('Anahtarlar silindi. Artık sunucunun kendi anahtarları kullanılacak.');
    setTimeout(() => setSavedMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl my-8 rounded-[14px] border border-[var(--hairline-2)] bg-[var(--paper-2)] shadow-2xl overflow-hidden">
        {/* Başlık */}
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[var(--hairline)]">
          <div className="flex items-center gap-2.5 min-w-0">
            <KeyRound className="w-4 h-4 shrink-0 text-[var(--ink-2)]" />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-[var(--ink)]">API Anahtarları</h3>
              <p className="text-[11px] text-[var(--ink-3)] truncate">
                Kendi anahtarlarınızı girin — kullanım kendi hesabınıza işlenir
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-[8px] text-[var(--ink-3)] hover:text-[var(--ink)] hover:bg-[var(--paper-3)] transition-colors cursor-pointer shrink-0"
            aria-label="Kapat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gizlilik notu */}
        <div className="mx-6 mt-4 flex items-start gap-2.5 rounded-[10px] border border-[var(--hairline)] bg-[var(--paper-3)] p-3">
          <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[var(--ink-2)]" />
          <p className="text-[11px] leading-relaxed text-[var(--ink-2)]">
            Anahtarlar <strong>yalnızca bu tarayıcıda</strong> saklanır ve her istekte
            doğrudan ilgili servise iletilmek üzere gönderilir. Sunucuya kaydedilmez.
            Boş bıraktığınız alanlar için sitenin kendi anahtarı kullanılır.
          </p>
        </div>

        {/* Alanlar */}
        <div className="px-6 py-4 space-y-4 max-h-[55vh] overflow-y-auto">
          {KEY_FIELDS.map(({ field, label, hint, url, urlLabel }) => {
            const serverHas = serverStatus ? serverStatus[field] : null;
            const isVisible = !!visible[field];
            return (
              <div key={field} className="space-y-1.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-xs font-semibold text-[var(--ink)]">{label}</label>
                  {serverHas !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border ${
                        serverHas
                          ? 'border-[var(--hairline)] text-[var(--ink-3)]'
                          : 'border-[var(--marker)] bg-[var(--marker-bg)] text-[var(--marker-ink)]'
                      }`}
                    >
                      {serverHas ? 'sitede tanımlı — isteğe bağlı' : 'sitede yok — gerekli'}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type={isVisible ? 'text' : 'password'}
                    value={keys[field]}
                    onChange={(e) => setKeys((prev) => ({ ...prev, [field]: e.target.value }))}
                    placeholder="Anahtarı buraya yapıştırın"
                    autoComplete="off"
                    spellCheck={false}
                    className="flex-1 min-w-0 px-3 py-2 rounded-[8px] border border-[var(--hairline)] bg-[var(--paper)] text-[var(--ink)] text-xs font-mono focus:outline-none focus:border-[var(--ink-3)]"
                  />
                  <button
                    type="button"
                    onClick={() => setVisible((prev) => ({ ...prev, [field]: !prev[field] }))}
                    className="p-2 rounded-[8px] border border-[var(--hairline)] text-[var(--ink-3)] hover:text-[var(--ink)] transition-colors cursor-pointer shrink-0"
                    aria-label={isVisible ? 'Anahtarı gizle' : 'Anahtarı göster'}
                    title={isVisible ? 'Gizle' : 'Göster'}
                  >
                    {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <p className="text-[11px] leading-relaxed text-[var(--ink-3)]">
                  {hint}{' '}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-0.5 text-[var(--ink-2)] underline underline-offset-2 hover:text-[var(--ink)]"
                  >
                    {urlLabel}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </p>
              </div>
            );
          })}
        </div>

        {/* Alt bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-[var(--hairline)] bg-[var(--paper)]">
          <div className="min-h-[1rem] flex items-center gap-1.5 text-[11px] text-[var(--ink-2)]">
            {savedMsg && (
              <>
                <Check className="w-3.5 h-3.5 shrink-0" />
                <span>{savedMsg}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-[8px] border border-[var(--hairline)] text-[var(--ink-2)] text-xs font-medium hover:border-[var(--hairline-2)] hover:text-[var(--ink)] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Tümünü Sil</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-[8px] bg-[var(--ink)] text-[var(--paper-2)] text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Kaydet</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
