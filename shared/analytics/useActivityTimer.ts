/**
 * Bir ekranda geçirilen süreyi ölçüp olay günlüğüne yazan React kancası.
 *
 * Kullanım: ölçmek istediğin bileşenin en üstünde çağır.
 *   useActivityTimer('katmanli', 'listening', lesson.id, lesson.title);
 *
 * Bileşen ekrandan kalkınca (katman değişimi, ders değişimi, sekme
 * kapanması) biriken süre yazılır. `enabled` false verilirse ölçüm
 * yapılmaz — ders seçili değilken sayacı başlatmamak için.
 */

import { useEffect, useRef } from 'react';
import { ActivityTimer, Skill } from './activityLog';

export function useActivityTimer(
  app: 'katmanli' | 'reading',
  skill: Skill,
  refId?: string,
  refTitle?: string,
  enabled: boolean = true
): void {
  // Başlık değiştiğinde sayacı yeniden kurmamak için ref'te tutuluyor:
  // yalnızca beceri veya kaynak kimliği değişince yeni oturum başlamalı.
  const titleRef = useRef(refTitle);
  titleRef.current = refTitle;

  useEffect(() => {
    if (!enabled) return;

    const timer = new ActivityTimer({ app, skill, refId, refTitle: titleRef.current });

    // Sekme kapatılırken son parçayı da yazmayı dene. Bu aşamada
    // asenkron iş garanti değildir; yine de çoğu tarayıcıda yetişiyor
    // ve yetişmezse yalnızca son birkaç dakika kaybedilir.
    const onUnload = () => { void timer.flush(); };
    window.addEventListener('pagehide', onUnload);

    return () => {
      window.removeEventListener('pagehide', onUnload);
      void timer.stop();
    };
  }, [app, skill, refId, enabled]);
}
