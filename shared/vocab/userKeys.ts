/**
 * KULLANICI API ANAHTARLARI
 *
 * Anahtarlar eskiden yalnizca sunucunun ortam degiskenlerindeydi; yani
 * siteyi kim kullanirsa kullansin butun yapay zeka maliyeti site sahibine
 * cikiyordu. Burada kullanici kendi anahtarlarini girebiliyor ve bunlar
 * her /api/* istegine baslik olarak ekleniyor.
 *
 * Anahtarlar YALNIZCA bu tarayicinin localStorage'inda durur; sunucuya
 * kaydedilmez, baska bir yere gonderilmez. Sunucu da istek suresince
 * kullanir, hicbir yere yazmaz.
 *
 * Kullanici anahtar girmezse sunucu kendi ortam degiskenine duser, yani
 * mevcut davranis degismez.
 */

const STORAGE_KEY = 'katmanli_user_api_keys_v1';

export interface UserApiKeys {
  /** Ana yapay zeka: ceviri, sozcuk, quiz, yazma, konusma, gramer kocu. */
  gemini: string;
  /** Gemini kotasi dolunca devreye giren yedek saglayici. */
  groq: string;
  /** youtube-transcript.io - YouTube altyazilarini ceker. */
  transcript: string;
  /** LibreTranslate - yapay zeka yerine kullanilabilen ceviri servisi. */
  libre: string;
}

export const EMPTY_KEYS: UserApiKeys = {
  gemini: '',
  groq: '',
  transcript: '',
  libre: '',
};

/** Anahtar alanlarinin gonderilecegi HTTP basliklari (sunucu ile birebir ayni). */
const KEY_HEADERS: Record<keyof UserApiKeys, string> = {
  gemini: 'x-user-gemini-key',
  groq: 'x-user-groq-key',
  transcript: 'x-user-transcript-token',
  libre: 'x-user-libretranslate-key',
};

export function loadUserKeys(): UserApiKeys {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...EMPTY_KEYS };
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object') return { ...EMPTY_KEYS };
    // Alan alan kopyala: eski/bozuk kayitlar beklenmedik anahtar sizdirmasin
    return {
      gemini: typeof parsed.gemini === 'string' ? parsed.gemini : '',
      groq: typeof parsed.groq === 'string' ? parsed.groq : '',
      transcript: typeof parsed.transcript === 'string' ? parsed.transcript : '',
      libre: typeof parsed.libre === 'string' ? parsed.libre : '',
    };
  } catch {
    return { ...EMPTY_KEYS };
  }
}

export function saveUserKeys(keys: UserApiKeys): void {
  try {
    const trimmed: UserApiKeys = {
      gemini: keys.gemini.trim(),
      groq: keys.groq.trim(),
      transcript: keys.transcript.trim(),
      libre: keys.libre.trim(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    console.error('API anahtarlari kaydedilemedi:', e);
  }
}

export function clearUserKeys(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('API anahtarlari silinemedi:', e);
  }
}

/** Dolu olan anahtarlari baslik nesnesine cevirir; bos olanlar gonderilmez. */
function buildKeyHeaders(): Record<string, string> {
  const keys = loadUserKeys();
  const headers: Record<string, string> = {};
  (Object.keys(KEY_HEADERS) as (keyof UserApiKeys)[]).forEach((field) => {
    const value = keys[field]?.trim();
    if (value) headers[KEY_HEADERS[field]] = value;
  });
  return headers;
}

/**
 * /api/* cagrilarinda dogrudan fetch yerine BUNU kullanin.
 * Imzasi fetch ile ayni oldugu icin cagri yerlerinde yalnizca isim degisir.
 */
export function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(path, {
    ...init,
    headers: {
      ...buildKeyHeaders(),
      ...(init.headers as Record<string, string> | undefined),
    },
  });
}

export interface ServerKeyStatus {
  gemini: boolean;
  groq: boolean;
  transcript: boolean;
  libre: boolean;
}

/**
 * Sunucunun hangi anahtarlara sahip oldugunu sorar; boylece ayarlar ekrani
 * "bunu girmen sart" ile "bu istege bagli" arasindaki farki gosterebilir.
 * Yanit yalnizca true/false icerir, anahtarin kendisi gelmez.
 */
export async function fetchServerKeyStatus(): Promise<ServerKeyStatus | null> {
  try {
    const res = await fetch('/api/settings/status');
    if (!res.ok) return null;
    const data = await res.json();
    const s = data?.server;
    if (!s || typeof s !== 'object') return null;
    return {
      gemini: !!s.gemini,
      groq: !!s.groq,
      transcript: !!s.transcript,
      libre: !!s.libre,
    };
  } catch {
    return null;
  }
}
