/* DERSİN KELİMELERİNİ DESTEYE AL
 * ============================================================================
 * Bir dersin içinde, yapay zekânın o metinden çıkardığı kelime listesi durur
 * (Katman 2'deki IPA'lı liste). Kart destesinin aksine bu liste DERSİN
 * İÇİNDEDİR: ders silinince onunla birlikte giderdi.
 *
 * Kartlar zaten dersten bağımsız duruyor; burası o listedeki, henüz kartı
 * olmayan kelimeleri silmeden önce desteye taşıyor. Böylece "dersi sildim,
 * kelimeleri gitti" durumu hiç oluşmuyor.
 *
 * İKİ ELEME var, ikisi de kullanıcının kendi işaretine dayanıyor:
 *
 *   BİLİNEN KELİMELER atlanıyor. "Biliyorum" demiş birine o kelimeden
 *     flashcard açmak desteyi gürültüyle doldurur.
 *
 *   ZATEN KARTI OLANLAR'a dokunulmuyor — bunu addCardsIfMissing yapıyor:
 *     kart varsa tekrar geçmişi korunur, yalnızca kelimeyi nerede gördüğün
 *     listesine bu ders eklenir.
 */

import { buildCard, type VocabCard } from '../../../../shared/vocab/vocabStore';
import { getKnownWords } from './knownWords';
import type { VideoLesson } from '../types';

/** Dersin kelime listesinden desteye girecek kartlar. */
export function dersKelimelerindenKartlar(
  lesson: Pick<VideoLesson, 'id' | 'title' | 'vocabulary'>,
  bilinenler: Set<string> = getKnownWords()
): VocabCard[] {
  const kartlar: VocabCard[] = [];
  const gorulenler = new Set<string>();

  for (const k of lesson.vocabulary || []) {
    const on = String(k?.word || '').trim();
    const arka = String(k?.meaningTr || '').trim();

    /* Türkçe karşılığı olmayan kart çalışılamaz; listede böyle
       satırlar olabiliyor (model alanı boş bırakabiliyor). */
    if (!on || !arka) continue;

    const anahtar = on.toLowerCase().replace(/\s+/g, ' ');
    if (bilinenler.has(anahtar)) continue;
    if (gorulenler.has(anahtar)) continue;
    gorulenler.add(anahtar);

    kartlar.push(
      buildCard({
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        front: on,
        back: arka,
        ipa: k.ipa,
        /* Söz türü serbest metin ("noun", "isim", "kalıp"...);
           tanınmazsa buildCard kendi tahminine düşüyor. */
        pos: k.type,
        exampleEn: k.exampleSentence,
        contextEn: k.exampleSentence,
      })
    );
  }

  return kartlar;
}
