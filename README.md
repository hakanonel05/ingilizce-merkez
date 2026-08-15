# İngilizce Merkez — Birleşik Proje

İki uygulama tek sitede:

| Yol | Uygulama |
|-----|----------|
| `/`          | **Okuma & Kelime** (Lexis Trainer) — 100 okuma parçası, 554 kelime, Workbook |
| `/katmanli/` | **Katmanlı İngilizce** — video ile 7 katmanlı çalışma |

Üstteki çubuktan iki uygulama arasında geçiş yapılır. Aynı alan adında
oldukları için oturum ve tarayıcı kayıtları ortaktır.

## Klasör yapısı
```
apps/reading/     -> Lexis Trainer (olduğu gibi, değiştirilmedi)
apps/katmanli/    -> Katmanlı İngilizce (olduğu gibi, değiştirilmedi)
netlify/functions -> /api/* uçlarını saran serverless fonksiyon
server.ts         -> Katmanlı'nın API sunucusu (Gemini/Groq)
```

## Komutlar
```
npm install
npm run build          # ikisini birden derler -> dist/
npm run dev:reading    # yerel geliştirme (port 5173)
npm run dev:katmanli   # yerel geliştirme (port 5174)
npm run dev:api        # API sunucusu (Katmanlı'nın YZ uçları)
```

## Ortam değişkenleri
`.env.example` dosyasını `.env` olarak kopyalayıp doldurun.
`VITE_` ile başlayanlar tarayıcıya gömülür; diğerleri yalnızca sunucuda kalır.

**`.env` dosyasını GitHub'a YÜKLEMEYİN** (`.gitignore` ile engellendi).
Netlify'da bunları *Site configuration → Environment variables* altına girin.
