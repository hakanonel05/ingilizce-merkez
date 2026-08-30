/**
 * Ayarlar penceresi artik ../../../../shared/vocab/SettingsModal.tsx
 * icinde yasiyor: reading uygulamasi da ayni API anahtarlarini
 * kullaniyor ve kendi ayar ekrani yoktu.
 *
 * Bu dosya katmanliya OZEL bolumleri (senkron paneli ve seviye
 * onbellegi) ekleyerek ortak pencereyi sarmaliyor.
 */

import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { SettingsModal as SharedSettingsModal } from '../../../../shared/vocab/SettingsModal';
import { SyncPanel } from './vocab/SyncPanel';
import { cachedWordCount, clearCefrCache } from '../lib/cefrCache';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [cefrCount, setCefrCount] = useState(0);

  useEffect(() => {
    if (isOpen) setCefrCount(cachedWordCount());
  }, [isOpen]);

  return (
    <SharedSettingsModal
      isOpen={isOpen}
      onClose={onClose}
      subtitle="API anahtarları ve cihazlar arası senkron"
    >
      <div className="pt-2 border-t border-[var(--hairline)]">
        <SyncPanel />
      </div>

      {/* Yapay zekaya sorulmus kelime seviyeleri.
          Silmek yalnizca onbellegi bosaltir; kelimeler gerektiginde
          yeniden sorulur, yani veri kaybi degil kota harcamasidir. */}
      {cefrCount > 0 && (
        <div className="pt-2 border-t border-[var(--hairline)] flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-xs font-semibold text-[var(--ink)]">Seviye Önbelleği</div>
            <p className="text-[11px] text-[var(--ink-3)]">
              {cefrCount} kelimenin seviyesi yapay zekâya bir kez soruldu ve saklandı
            </p>
          </div>
          <button
            type="button"
            onClick={() => { clearCefrCache(); setCefrCount(0); }}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[8px] border border-[var(--hairline)] text-[var(--ink-2)] text-[11px] font-medium hover:border-[var(--hairline-2)] hover:text-[var(--ink)] transition-colors cursor-pointer shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Önbelleği Temizle</span>
          </button>
        </div>
      )}
    </SharedSettingsModal>
  );
};
