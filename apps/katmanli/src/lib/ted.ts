/* TED LINKLERI (istemci tarafi)
 * ============================================================================
 * Burada YALNIZCA "bu bir TED konusma adresi mi" sorusu cevaplaniyor.
 * Adresin hangi videoya karsilik geldigini istemci bilemez: ted.com
 * adresinde YouTube kimligi gecmez, kimlik sayfanin icindeki veridedir.
 * Cozumu sunucu yapiyor (/api/video-coz).
 */

/**
 * Metinde bir TED konusma adresi var mi?
 *
 * Alan adi TAM OLARAK ted.com olmali - sinir kosulu olmadan
 * "notted.com/talks/x" de eslesirdi. Alt alan adina (www., embed.) izin var.
 * Sunucudaki tedSlugCikar ile ayni kurali uyguluyor.
 */
export function tedLinkiMi(urlOrText: string): boolean {
  if (!urlOrText) return false;
  return /(?:^|[^A-Za-z0-9.-])(?:[A-Za-z0-9-]+\.)*ted\.com\/talks\/[a-z0-9_]+/i.test(
    urlOrText
  );
}
