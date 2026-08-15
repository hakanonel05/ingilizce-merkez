/**
 * apps/katmanli ve apps/reading arasında paylaşılan kelime bankası (IndexedDB)
 * artık ../../../../shared/vocab/vocabStore.ts içinde yaşıyor — bu dosya
 * sadece mevcut import yollarını (`./lib/vocabStore`) bozmamak için oraya
 * yönlendirir. İki uygulama da aynı origin'de çalıştığından aynı veritabanını
 * paylaşırlar.
 */
export * from '../../../../shared/vocab/vocabStore';
