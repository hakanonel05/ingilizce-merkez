/**
 * apps/reading ve apps/katmanli arasında paylaşılan kelime bankası (IndexedDB)
 * ../../../../shared/vocab/vocabStore.ts içinde yaşar — bu dosya oraya
 * yönlendirir. İki uygulama da aynı origin'de çalıştığından (bkz.
 * AppSwitcher, netlify.toml) aynı veritabanını paylaşırlar: reading'de
 * eklenen bir kelime katmanlı'nın "Kelime Kartları" (FSRS) ekranında da
 * çıkar, ve tam tersi.
 */
export * from '../../../../shared/vocab/vocabStore';
