/**
 * Unduh potret yang masih hilang via file Wikimedia langsung.
 * Jalankan: node scripts/fetch-missing-portraits.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public/characters");
const USER_AGENT = "bacaalkitab-bersama/1.0 (educational; local-dev)";
const DELAY_MS = 3500;
const MIN_BYTES = 20_000;

/** slug → nama file Wikimedia Commons (terverifikasi / kurasi) */
const DIRECT_FILES = {
  elisa: "Giorgio Vasari - The Prophet Elisha - WGA24289.jpg",
  "yusuf-suami-maria":
    "Woytowicz Saint Joseph with the Infant Jesus and donor.jpg",
  "yohanes-pembaptis":
    "Leonardo da Vinci - Saint John the Baptist C2RMF retouched.jpg",
  petrus:
    "Christ giving the Keys of Heaven to St. Peter by Peter Paul Rubens - Gemäldegalerie - Berlin - Germany 2017.jpg",
  "yohanes-rasul": "El Greco - St John the Evangelist - WGA10584.jpg",
  paulus: "Rembrandt - St. Paul - WGA19081.jpg",
  "maria-magdalena":
    "Artemisia Gentileschi - The Penitent Mary Magdalen - WGA8567.jpg",
  timotius: "Timothy-and-Lois.jpg",
  lidia: "Acts 16 Conversion of Lydia.jpg",
  nuh: "Noah's Ark (1846 painting by Edward Hicks).jpg",
  adam: "Michelangelo - Creation of Adam (Sistine Chapel).jpg",
  hawa: "Michelangelo - Fall and Expulsion from Garden of Eden.jpg",
  hagar: "Hagar in the Wilderness (Camille Corot).jpg",
  lea: "Leah and Rachel by Paolo Veronese.jpg",
  rahel: "Jacob and Rachel at the Well.jpg",
  yehuda: "Judah and Tamar (School of Rembrandt).jpg",
  miryam: "Miriam the Prophetess (James Tissot).jpg",
  rahab: "The Harlot of Jericho and the Two Spies (James Tissot).jpg",
  naomi: "Ruth and Naomi (William Blake).jpg",
  boas: "Boaz and Ruth (Nicolas Poussin).jpg",
  yunus: "Jonah and the Whale (Pieter Lastman).jpg",
  ezra: "Ezra Reads the Law to the People (Gustave Doré).jpg",
  hizkia: "Hezekiah spread the letter before the Lord (Gustave Doré).jpg",
  andreas: "El Greco - Apostle St Andrew - WGA10610.jpg",
  yakobus: "Peter Paul Rubens - St James the Apostle - WGA20192.jpg",
  marta: "Christ in the House of Martha and Mary (Vermeer).jpg",
  "maria-betania": "Mary Magdalene anointing Christ's feet (Tintoretto).jpg",
  aquila: "Priscilla and Aquila (Acts 18).jpg",
};

function filePathUrl(filename) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=960`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadWithRetry(url, dest, attempts = 4) {
  for (let i = 1; i <= attempts; i++) {
    const res = await fetch(url, {
      redirect: "follow",
      headers: { "User-Agent": USER_AGENT },
    });
    if (res.status === 429) {
      await sleep(i * 4000);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 5000) throw new Error("File too small");
    await fs.writeFile(dest, buf);
    return buf.length;
  }
  throw new Error("Rate limited");
}

async function searchFallback(query) {
  await sleep(2000);
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: "6",
    gsrlimit: "5",
    prop: "imageinfo",
    iiprop: "url|mime|size",
    iiurlwidth: "960",
    format: "json",
    origin: "*",
  });
  const res = await fetch(
    `https://commons.wikimedia.org/w/api.php?${params}`,
    { headers: { "User-Agent": USER_AGENT } },
  );
  if (!res.ok) return null;
  const data = await res.json();
  const pages = Object.values(data.query?.pages ?? {});
  const info = pages
    .map((p) => p.imageinfo?.[0])
    .filter(Boolean)
    .filter((i) => i.mime?.startsWith("image/"))
    .filter((i) => (i.width ?? 0) >= 350)
    .sort(
      (a, b) =>
        (b.width ?? 0) * (b.height ?? 0) - (a.width ?? 0) * (a.height ?? 0),
    )[0];
  return info?.thumburl ?? info?.url ?? null;
}

const FALLBACK_SEARCH = {
  elisa: "Elisha prophet painting",
  "yusuf-suami-maria": "Saint Joseph infant Jesus painting",
  "yohanes-pembaptis": "Saint John the Baptist Leonardo",
  petrus: "Saint Peter Rubens keys heaven",
  "yohanes-rasul": "Saint John evangelist El Greco",
  paulus: "Saint Paul Rembrandt painting",
  "maria-magdalena": "Mary Magdalene Artemisia Gentileschi",
  timotius: "Timothy Lois biblical",
  lidia: "Lydia Philippi conversion painting",
  nuh: "Noah ark Edward Hicks",
  adam: "Creation of Adam Michelangelo",
  hawa: "Eve Adam Michelangelo painting",
  hagar: "Hagar Ishmael wilderness painting",
  lea: "Leah Rachel biblical painting",
  rahel: "Jacob Rachel well painting",
  yehuda: "Judah Tamar biblical",
  miryam: "Miriam prophetess painting",
  rahab: "Rahab Jericho spies painting",
  naomi: "Naomi Ruth William Blake",
  boas: "Boaz Ruth Poussin",
  yunus: "Jonah whale Lastman",
  ezra: "Ezra reads law Gustave Dore",
  hizkia: "Hezekiah prayer Gustave Dore",
  andreas: "Saint Andrew El Greco",
  yakobus: "Saint James apostle Rubens",
  marta: "Martha Mary Vermeer",
  "maria-betania": "Mary anointing Jesus feet painting",
  aquila: "Priscilla Aquila Acts painting",
};

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  let ok = 0;
  let fail = 0;
  const failed = [];

  for (const [slug, filename] of Object.entries(DIRECT_FILES)) {
    const dest = path.join(OUT_DIR, `${slug}.jpg`);
    const existing = await fs.stat(dest).catch(() => null);
    if (existing && existing.size > MIN_BYTES) {
      console.log(`skip ${slug}`);
      ok++;
      continue;
    }

    try {
      let size;
      try {
        size = await downloadWithRetry(filePathUrl(filename), dest);
        console.log(`ok   ${slug} direct (${Math.round(size / 1024)} KB)`);
      } catch {
        const fallbackUrl = await searchFallback(FALLBACK_SEARCH[slug] ?? slug);
        if (!fallbackUrl) throw new Error("direct + search failed");
        size = await downloadWithRetry(fallbackUrl, dest);
        console.log(`ok   ${slug} search (${Math.round(size / 1024)} KB)`);
      }
      ok++;
    } catch (error) {
      console.warn(`fail ${slug}: ${error.message}`);
      failed.push(slug);
      fail++;
    }
    await sleep(DELAY_MS);
  }

  console.log(`\nDone: ${ok} ok, ${fail} failed`);
  if (failed.length) console.log("Still missing:", failed.join(", "));
}

main();
