/**
 * AÇIK UÇLU SORU CEVABI EŞLEŞTİRME
 * ============================================================================
 * Kitaptaki bazı sorular şıksız: "The underlined pronoun 'it' refers to ----".
 * Cevap anahtarı da tek bir kelime vermiyor, birden çok kabul edilebilir yazımı
 * tek satırda topluyor:
 *
 *   "Egypt"                                  tek cevap
 *   "Kermanshah (or Iran)"                   iki cevap da doğru
 *   "(the) project"                          "the project" de "project" de olur
 *   "(running) clothes"                      "running clothes" de "clothes" de
 *   "lip-reading (or being able to lip-read well)"
 *
 * Öğrenci "Iran", "iran.", "the project" yazdığında doğru saymak gerekiyor;
 * yoksa doğru cevap yanlış görünüyor. Bu yüzden anahtar önce kabul edilebilir
 * yazımlara açılıyor, sonra iki taraf da sadeleştirilip karşılaştırılıyor.
 */

/** Karşılaştırma için sadeleştir: küçük harf, noktalama yok, tek boşluk. */
function sadelestir(metin: string): string {
  return metin
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[^a-z0-9'\- ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(the|a|an)\s+/, '');
}

/**
 * Anahtarı kabul edilebilir yazımlara aç.
 *
 * "(or X)"  → ayrı bir cevap
 * "(X) Y"   → hem "X Y" hem "Y"
 */
export function kabulEdilenler(anahtar: string): string[] {
  const cikti = new Set<string>();
  let temel = String(anahtar ?? '').trim();
  if (!temel) return [];

  // "... (or ...)" — parantezin içi ayrı bir cevap
  const veya = temel.match(/^(.*?)\s*\(\s*or\s+(.+?)\s*\)\s*(.*)$/i);
  if (veya) {
    const [, sol, alternatif, sag] = veya;
    cikti.add(sadelestir(sol + ' ' + sag));
    cikti.add(sadelestir(alternatif));
    temel = (sol + ' ' + sag).trim();
  }

  // "(the) project" — parantezli kısım isteğe bağlı
  const istege = temel.match(/\(([^)]+)\)/);
  if (istege) {
    cikti.add(sadelestir(temel.replace(/\(([^)]+)\)/, '$1')));
    cikti.add(sadelestir(temel.replace(/\(([^)]+)\)/, '')));
  }

  cikti.add(sadelestir(temel));
  cikti.delete('');
  return [...cikti];
}

/**
 * Öğrencinin yazdığı cevap kitabın anahtarıyla uyuşuyor mu?
 *
 * Bilerek hoşgörülü: büyük/küçük harf, noktalama, baştaki "the/a/an" ve
 * kabul edilen alternatifler göz ardı ediliyor. Ama serbest metin araması
 * yapılmıyor — cevabın kendisi yazılmalı.
 */
export function acikUcluDogruMu(verilen: string, anahtar: string): boolean {
  const v = sadelestir(String(verilen ?? ''));
  if (!v) return false;
  return kabulEdilenler(anahtar).some((k) => k === v);
}
