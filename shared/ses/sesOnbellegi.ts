/* SES ÖNBELLEĞİ — üretilen konuşma tarayıcıda kalır
 * ============================================================================
 * Neden kalıcı olması gerekiyor:
 *
 * Reading tarafında önbellek `new Map()` idi, yani yalnızca bellekte. Sayfayı
 * yenilemek ya da bir parçayı ertesi gün tekrar açmak her paragrafı SIFIRDAN
 * ürettiriyordu. Oradaki yorumda bunun kasıtlı olduğu, kalıcı saklamanın
 * "birkaç megabaytlık yük" getireceği ve buna değmeyeceği yazıyordu.
 *
 * O karar maliyet bilinmeden verilmiş. Ölçtük: ses çıktısı saniyede 32 token
 * ve 100 okuma parçasının tamamı ~183 dakika. Yani her yeniden üretim para ve
 * kota harcıyor — ücretsiz katmanda dakikada yalnızca ~3 istek hakkı var.
 * Birkaç megabaytlık tarayıcı deposu bunun yanında çok ucuz.
 *
 * NEDEN SUNUCU DEĞİL DE TARAYICI: sesi Supabase'e koyup herkese servis etmek
 * de mümkün ama tek kişi çalışırken kazancı yok, buna karşılık depolama ve
 * dağıtım maliyeti getiriyor. Kullanıcı sayısı artarsa o adım ayrıca atılır;
 * bu dosya o zaman da ilk basamak olarak kalır.
 *
 * SINIR: önbellek sınırsız büyümesin. Hepsini dinlerseniz 500 MB'ı aşabilir;
 * kimsenin diskini habersiz doldurmamak için üst sınır var ve dolunca EN ESKİ
 * KULLANILAN kayıtlar siliniyor.
 */

const DB_ADI = 'ingilizce-ses';
const DEPO = 'sesler';
const SURUM = 1;

/** Üst sınır. Aşılınca en eski kullanılanlar silinir. */
const UST_SINIR_BAYT = 200 * 1024 * 1024;

type Kayit = {
  blob: Blob;
  boyut: number;
  /** Son kullanım zamanı — eleme bu sıraya göre. */
  sonKullanim: number;
};

let dbSozu: Promise<IDBDatabase | null> | null = null;

function db(): Promise<IDBDatabase | null> {
  if (dbSozu) return dbSozu;
  dbSozu = new Promise((coz) => {
    try {
      const istek = indexedDB.open(DB_ADI, SURUM);
      istek.onupgradeneeded = () => {
        const d = istek.result;
        if (!d.objectStoreNames.contains(DEPO)) d.createObjectStore(DEPO);
      };
      istek.onsuccess = () => coz(istek.result);
      istek.onerror = () => coz(null);
      /* Gizli sekmede indexedDB.open bazen hiç yanıt vermiyor. */
      setTimeout(() => coz(null), 3000);
    } catch {
      coz(null);
    }
  });
  return dbSozu;
}

function islem<T>(
  mod: IDBTransactionMode,
  is: (depo: IDBObjectStore) => IDBRequest<T>
): Promise<T | null> {
  return db().then(
    (d) =>
      new Promise<T | null>((coz) => {
        if (!d) return coz(null);
        try {
          const istek = is(d.transaction(DEPO, mod).objectStore(DEPO));
          istek.onsuccess = () => coz(istek.result as T);
          istek.onerror = () => coz(null);
        } catch {
          coz(null);
        }
      })
  );
}

/** Bellek içi adres tablosu: aynı sekmede ikinci kez blob URL üretilmesin. */
const adresler = new Map<string, string>();

/**
 * Önbellekten ses adresi. Yoksa null.
 *
 * Bulunduğunda son kullanım zamanı güncelleniyor; eleme buna bakıyor.
 */
export async function onbellektenAl(anahtar: string): Promise<string | null> {
  const hazir = adresler.get(anahtar);
  if (hazir) return hazir;

  const kayit = (await islem<Kayit>('readonly', (d) => d.get(anahtar))) as Kayit | null;
  if (!kayit?.blob) return null;

  void islem('readwrite', (d) =>
    d.put({ ...kayit, sonKullanim: Date.now() }, anahtar)
  );

  const adres = URL.createObjectURL(kayit.blob);
  adresler.set(anahtar, adres);
  return adres;
}

/** Sesi önbelleğe yazar ve çalınabilir adresini döndürür. */
export async function onbellegeYaz(anahtar: string, blob: Blob): Promise<string> {
  const adres = URL.createObjectURL(blob);
  adresler.set(anahtar, adres);

  await islem('readwrite', (d) =>
    d.put({ blob, boyut: blob.size, sonKullanim: Date.now() } as Kayit, anahtar)
  );
  void ele();

  return adres;
}

/**
 * Üst sınır aşıldıysa en eski kullanılanları siler.
 *
 * Sessizce çalışıyor: başarısız olursa önbellek biraz şişer, uygulama
 * etkilenmez. Depolama dolduğunda tarayıcının kendi hatası zaten yazma
 * anında yakalanıyor.
 */
async function ele(): Promise<void> {
  const d = await db();
  if (!d) return;
  try {
    const depo = d.transaction(DEPO, 'readonly').objectStore(DEPO);
    const anahtarlar = await new Promise<IDBValidKey[]>((coz) => {
      const i = depo.getAllKeys();
      i.onsuccess = () => coz(i.result || []);
      i.onerror = () => coz([]);
    });
    const kayitlar = await new Promise<Kayit[]>((coz) => {
      const i = depo.getAll();
      i.onsuccess = () => coz((i.result || []) as Kayit[]);
      i.onerror = () => coz([]);
    });

    let toplam = kayitlar.reduce((a, k) => a + (k?.boyut || 0), 0);
    if (toplam <= UST_SINIR_BAYT) return;

    const sirali = kayitlar
      .map((k, i) => ({ anahtar: anahtarlar[i], ...k }))
      .sort((a, b) => (a.sonKullanim || 0) - (b.sonKullanim || 0));

    const yazma = d.transaction(DEPO, 'readwrite').objectStore(DEPO);
    for (const k of sirali) {
      if (toplam <= UST_SINIR_BAYT) break;
      yazma.delete(k.anahtar);
      adresler.delete(String(k.anahtar));
      toplam -= k.boyut || 0;
    }
  } catch {
    /* Eleme başarısız olursa önbellek biraz şişer; kullanıcıya yansımaz. */
  }
}

/** Tanılama ve ayarlar ekranı için: önbellekte ne kadar yer tutuluyor. */
export async function onbellekBoyutu(): Promise<{ adet: number; bayt: number }> {
  const kayitlar = (await islem<Kayit[]>('readonly', (d) => d.getAll())) || [];
  return {
    adet: kayitlar.length,
    bayt: kayitlar.reduce((a, k) => a + (k?.boyut || 0), 0),
  };
}

/** Ayarlardan "sesleri temizle" için. */
export async function onbellegiTemizle(): Promise<void> {
  for (const adres of adresler.values()) URL.revokeObjectURL(adres);
  adresler.clear();
  await islem('readwrite', (d) => d.clear());
}
