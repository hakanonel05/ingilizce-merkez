/**
 * ÇALIŞMA ALANI ÜST BİLGİSİ
 *
 * "Şu an neredeyim" sorusunun tek cevabı. Dikey adım listesi solda
 * kalıyor ve dar ekranda gizleniyor; aktif katmanın adı çalışma
 * alanının kendi başında da yazmalı.
 *
 * Sağ taraf boş bırakılmadı: her katmanın kendi görünüm denetimleri
 * (iki sütun / tek sütun, çeviriyi gizle) actions olarak buraya
 * verilebiliyor. Şimdilik katmanlar bu denetimleri kendi içlerinde
 * çiziyor; ortak bir yer açık dursun diye yapı hazır.
 */

import React from 'react';
import { Check } from 'lucide-react';

interface Props {
  /** Numaralı çekirdek katmanlarda adım sırası, araçlarda null. */
  step: number | null;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isCompleted: boolean;
  actions?: React.ReactNode;
}

export const LayerHeaderBar: React.FC<Props> = ({
  step, title, subtitle, icon, isCompleted, actions,
}) => (
  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-3">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
          border border-accent/20 bg-accent-soft text-accent"
      >
        {icon}
      </span>

      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {step !== null && (
            <span className="eyebrow">Katman {step}</span>
          )}
          {isCompleted && (
            <span
              className="inline-flex items-center gap-1 rounded-md bg-ok-soft px-1.5 py-0.5
                text-[10px] font-semibold text-ok"
            >
              <Check className="h-3 w-3" strokeWidth={3} />
              Tamamlandı
            </span>
          )}
        </div>
        <h1 className="truncate text-[19px] font-semibold tracking-tight text-ink">
          {title}
        </h1>
        <p className="truncate text-[12px] text-ink-3">{subtitle}</p>
      </div>
    </div>

    {actions && <div className="flex items-center gap-2">{actions}</div>}
  </div>
);
