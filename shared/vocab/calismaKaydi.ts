/* ÇALIŞMANIN KAYDA GEÇMESİ
 * ============================================================================
 * Dört mod da (flashcard, yazma, test, eşleştirme) kartı AYNI yoldan
 * derecelendiriyor: FSRS'ye ver, kartı yaz, günlük sayacı artır, karneye
 * olay düş.
 *
 * NİYE TEK YERDE: her mod kendi kaydını yazsaydı dört ayrı "biliniyor" ölçüsü
 * oluşurdu ve biri diğerini tutmazdı — Quizlet'in Learn ilerlemesinin aralıklı
 * tekrardan bağımsız çalışması gibi. Burada hepsi tek destenin tek takvimini
 * besliyor: yazma modunda verdiğin doğru cevap, kartın bir sonraki tekrar
 * tarihini de değiştiriyor.
 */

import { VocabCard, putCard, isNewCard } from './vocabStore';
import { FsrsScheduler, Rating } from './fsrs';
import { bumpDailyCounter } from './vocabSettings';
import { logActivity } from '../analytics/activityLog';

/** Hangi uygulamadan çalışıldığı; karne bunu ayırıyor. */
export type CalismaUygulamasi = 'katmanli' | 'reading' | 'konusma';

export interface DerecelendirmeSonucu {
  kart: VocabCard;
  /** Kart bu çalışmadan önce hiç çalışılmamış mıydı. */
  yeniydi: boolean;
}

/**
 * Kartı derecelendirir ve her yere işler.
 *
 * `retention` çağıran taraftan geliyor: kullanıcının ayarı tek yerde duruyor
 * ve planlayıcı onunla kurulmalı, yoksa ayarı değiştirmek hiçbir şeyi
 * değiştirmezdi.
 */
export async function kartiDerecelendir(
  kart: VocabCard,
  derece: Rating,
  secenekler: { retention?: number; uygulama?: CalismaUygulamasi; mod?: string } = {}
): Promise<DerecelendirmeSonucu> {
  const { retention = 0.9, uygulama = 'katmanli', mod = 'flashcard' } = secenekler;

  const planlayici = new FsrsScheduler({ desiredRetention: retention });
  const simdi = Date.now();
  const yeniydi = isNewCard(kart);
  const guncel = { ...kart, ...planlayici.reviewCard(kart, derece, simdi) };

  try {
    await putCard(guncel);
  } catch (err) {
    /* Kayıt yazılamazsa çalışma durmamalı: kullanıcı kartı gördü ve
       cevapladı; bir sonraki yazma denemesinde yine yazılacak. */
    console.warn('Kart kaydedilemedi:', err);
  }

  bumpDailyCounter(yeniydi ? 'new' : 'review');

  /* Karne için: günlük sayaç yalnızca BUGÜNÜ tutuyor ve gece sıfırlanıyor;
     takvimin geçmişi görebilmesi için ayrıca olay yazılıyor. */
  void logActivity({
    app: uygulama,
    skill: 'vocab',
    kind: 'review',
    count: 1,
    correct: derece === Rating.Again ? 0 : 1,
    total: 1,
    refId: kart.id,
    refTitle: `${kart.front} (${mod})`,
  });

  return { kart: guncel, yeniydi };
}
