/**
 * KONUŞMA — GÖRSEL BETİMLEME
 *
 * Sitenin üçüncü uygulaması. Okuma & Kelime okumayı, Katmanlı İngilizce
 * dinlemeyi çalıştırıyor; burada çalışılan şey ÜRETİM: bir görsele bakıp
 * İngilizce konuşmak ve konuşmanın nesini düzeltmen gerektiğini görmek.
 *
 * AKIŞ:  görsel seç -> anlat -> metni gözden geçir -> çözümleme -> kayıt
 *
 * NE SAKLANIYOR, NE SAKLANMIYOR — bu ayrım uygulamanın temel kuralı:
 *   SAKLANIYOR  konuşmanın metni, çözümlemenin tamamı, küçültülmüş görsel
 *   SAKLANMIYOR ses kaydının kendisi (bkz. lib/betimlemeDeposu.ts)
 *
 * Oturum açma YOK, çünkü saklanan her şey bu cihazda: kayıtlar IndexedDB'de,
 * API anahtarları localStorage'da. Diğer iki uygulamadaki Supabase
 * eşitlemesi buraya bilerek getirilmedi — kişinin kendi betimlemelerini
 * sunucuya taşımak, "sesin cihazdan çıkmıyor" sözünün ruhuna aykırı olurdu.
 */

import { useCallback, useEffect, useState } from 'react';
import AppSwitcher from './AppSwitcher';
import { KonusmaTopBar } from './components/shell/KonusmaTopBar';
import { KonusmaSidebar, type KonusmaSekmesi } from './components/shell/KonusmaSidebar';
import { BetimlemeAkisi } from './components/BetimlemeAkisi';
import { Gecmis } from './components/Gecmis';
import { Ilerleme } from './components/Ilerleme';
import { SettingsModal } from '../../../shared/vocab/SettingsModal';
import { useActivityTimer } from '../../../shared/analytics/useActivityTimer';
import { kayitlariOku, kayitSil, tumKayitlariSil } from './lib/betimlemeDeposu';
import { CEFR_SIRASI, type BetimlemeKaydi, type Cefr } from './types';

const SEVIYE_ANAHTARI = 'konusma_seviye_v1';

function seviyeOku(): Cefr {
  try {
    const kayitli = localStorage.getItem(SEVIYE_ANAHTARI);
    if (kayitli && (CEFR_SIRASI as string[]).includes(kayitli)) return kayitli as Cefr;
  } catch {
    /* depo kapalıysa varsayılan kullanılır */
  }
  return 'B1';
}

export default function App() {
  const [sekme, setSekme] = useState<KonusmaSekmesi>('alistirma');
  const [menuAcik, setMenuAcik] = useState(false);
  const [ayarlarAcik, setAyarlarAcik] = useState(false);
  const [kayitlar, setKayitlar] = useState<BetimlemeKaydi[]>([]);
  const [seviye, setSeviye] = useState<Cefr>(seviyeOku);

  /* Karnede "konuşma" olarak görünsün. Sayaç yalnızca alıştırma
     sekmesindeyken işliyor: geçmişe bakmak konuşma çalışması değil. */
  useActivityTimer('konusma', 'speaking', 'gorsel-betimleme', 'Görsel Betimleme', sekme === 'alistirma');

  const tazele = useCallback(() => {
    void kayitlariOku().then(setKayitlar);
  }, []);

  useEffect(() => { tazele(); }, [tazele]);

  const seviyeDegis = (s: Cefr) => {
    setSeviye(s);
    try {
      localStorage.setItem(SEVIYE_ANAHTARI, s);
    } catch {
      /* seçim yalnızca bu oturum boyunca geçerli olur */
    }
  };

  const sil = async (id: string) => {
    await kayitSil(id);
    tazele();
  };

  const hepsiniSil = async () => {
    await tumKayitlariSil();
    tazele();
  };

  return (
    <div className="flex min-h-screen flex-col bg-paper font-sans text-ink">

      <AppSwitcher active="konusma" />

      <KonusmaTopBar
        onOpenSidebar={() => setMenuAcik(true)}
        onGoHome={() => setSekme('alistirma')}
        betimlemeSayisi={kayitlar.length}
        sonSeviye={kayitlar[0]?.analiz.cefr ?? null}
        onOpenSettings={() => setAyarlarAcik(true)}
      />

      <div className="flex w-full flex-1">

        <KonusmaSidebar
          aktif={sekme}
          onSec={setSekme}
          kayitSayisi={kayitlar.length}
          acik={menuAcik}
          onKapat={() => setMenuAcik(false)}
        />

        <main className="min-w-0 flex-1">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-6 sm:px-6 sm:py-8
            lg:px-8 xl:max-w-[1440px]">

            {sekme === 'alistirma' && (
              <BetimlemeAkisi
                seviye={seviye}
                onSeviyeDegis={seviyeDegis}
                onKaydedildi={tazele}
              />
            )}

            {sekme === 'gecmis' && (
              <Gecmis
                kayitlar={kayitlar}
                onSil={sil}
                onHepsiniSil={hepsiniSil}
                onAlistirmayaGit={() => setSekme('alistirma')}
              />
            )}

            {sekme === 'ilerleme' && <Ilerleme kayitlar={kayitlar} />}
          </div>
        </main>
      </div>

      <SettingsModal
        isOpen={ayarlarAcik}
        onClose={() => setAyarlarAcik(false)}
        subtitle="API anahtarları — isteğe bağlı, site kendi anahtarlarıyla çalışır"
      />

      <footer className="border-t border-hairline py-6 text-center">
        <p className="text-[11px] text-ink-3">
          Görsel Betimleme · {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
