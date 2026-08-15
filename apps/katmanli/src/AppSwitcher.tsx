/**
 * İki uygulama arasında geçiş çubuğu.
 * Reading  -> /          Katmanlı -> /katmanli/
 * Aynı alan adında oldukları için oturum ve yerel kayıtlar paylaşılır.
 */
type Props = { active: 'reading' | 'katmanli' };

export default function AppSwitcher({ active }: Props) {
  const tabs = [
    { id: 'reading', label: 'Okuma & Kelime', sub: 'LEXIS TRAINER', href: '/' },
    { id: 'katmanli', label: 'Katmanlı İngilizce', sub: 'VİDEO İLE ÖĞRENME', href: '/katmanli/' },
  ] as const;

  return (
    <div style={{ borderBottom: '1px solid rgba(0,0,0,.12)', background: '#fff' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', gap: 4, padding: '0 16px' }}>
        {tabs.map((t) => {
          const on = t.id === active;
          return (
            <a
              key={t.id}
              href={t.href}
              style={{
                display: 'block', padding: '10px 16px', textDecoration: 'none',
                borderBottom: on ? '2px solid #111' : '2px solid transparent',
                color: on ? '#111' : 'rgba(0,0,0,.55)',
                fontWeight: on ? 700 : 500, fontSize: 13, lineHeight: 1.25,
              }}
            >
              {t.label}
              <span style={{ display: 'block', fontSize: 9, letterSpacing: '.12em', opacity: .6 }}>
                {t.sub}
              </span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
