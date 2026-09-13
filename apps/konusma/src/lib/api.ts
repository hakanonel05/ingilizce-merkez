/* SUNUCU ÇAĞRILARI
 *
 * apiFetch kullanılıyor (düz fetch değil): kullanıcının ayarlar
 * penceresinden girdiği API anahtarları başlık olarak ekleniyor. Anahtar
 * girmediyse sunucu kendi ortam değişkenine düşüyor.
 */

import { apiFetch } from '../../../../shared/vocab/userKeys';
import type { BetimlemeAnalizi, Cefr, GorselKunyesi } from '../types';

/** Sunucu hatalarını tek biçimde çıkarır; JSON değilse metne düşer. */
async function hataMetni(yanit: Response, varsayilan: string): Promise<string> {
  try {
    const govde = await yanit.json();
    if (govde?.error) return String(govde.error);
  } catch {
    /* JSON değilse aşağıdaki varsayılan kullanılır */
  }
  return `${varsayilan} (${yanit.status})`;
}

export interface GetirilenGorsel {
  veriUrl: string;
  baslik: string;
  /** Arama terimi; ne aradığımızı ekranda göstermek için. */
  arama: string;
  /** Lisans ve fotoğrafçı — ekranda gösterilmek ZORUNDA (CC atıf şartı). */
  lisans: string;
  atif: string;
  kaynakSayfa: string;
}

export function kunyeCikar(g: GetirilenGorsel): GorselKunyesi | undefined {
  if (!g.lisans) return undefined;
  return { lisans: g.lisans, atif: g.atif || 'bilinmiyor', kaynakSayfa: g.kaynakSayfa || '' };
}

export async function gorselGetir(seviye: Cefr): Promise<GetirilenGorsel> {
  const yanit = await apiFetch('/api/gorsel-uret', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seviye }),
  });
  if (!yanit.ok) throw new Error(await hataMetni(yanit, 'Görsel getirilemedi'));
  return yanit.json();
}

export interface AnalizIstegi {
  metin: string;
  /** base64, ön ek olmadan. Boşsa çözümleme metin üzerinden yapılır. */
  gorselVeri: string;
  gorselTuru: string;
  gorselIstemi?: string;
  /** Örnek betimlemenin hangi seviyede yazılacağını belirler (bir üstü). */
  hedefSeviye: Cefr;
}

export async function betimlemeCozumle(istek: AnalizIstegi): Promise<BetimlemeAnalizi> {
  const yanit = await apiFetch('/api/betimleme-analizi', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(istek),
  });
  if (!yanit.ok) throw new Error(await hataMetni(yanit, 'Betimleme çözümlenemedi'));
  return yanit.json();
}
