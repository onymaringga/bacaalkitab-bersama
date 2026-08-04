/**
 * Unduh potret tokoh Alkitab via pencarian Wikimedia Commons.
 * Jalankan: node scripts/fetch-character-portraits.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public/characters");
const USER_AGENT = "bacaalkitab-bersama/1.0 (educational; local-dev)";
const DELAY_MS = 2200;

const SEARCHES = {
  abraham: "Abraham biblical painting",
  sara: "Sarah Abraham biblical",
  ishak: "Isaac sacrifice painting",
  yakub: "Jacob biblical painting",
  yusuf: "Joseph Egypt biblical painting",
  musa: "Moses biblical painting",
  aaron: "Aaron priest biblical",
  yosua: "Joshua biblical painting",
  debora: "Deborah judge biblical",
  gideon: "Gideon biblical",
  rut: "Ruth Naomi biblical painting",
  samuel: "Samuel anoints David painting",
  "saul-raja": "King Saul David painting",
  daud: "David Goliath painting Caravaggio",
  salomo: "King Solomon temple painting",
  elias: "Elijah prophet painting",
  elisa: "Elisha prophet painting",
  yesaya: "Isaiah prophet Michelangelo",
  yeremia: "Jeremiah prophet painting",
  daniel: "Daniel lions den painting",
  ester: "Esther queen painting",
  nehemia: "Nehemiah Jerusalem painting",
  maria: "Madonna Virgin Mary painting",
  "yusuf-suami-maria": "Saint Joseph Mary painting",
  "yohanes-pembaptis": "John the Baptist painting",
  petrus: "Saint Peter apostle painting",
  "yohanes-rasul": "Saint John apostle painting",
  paulus: "Saint Paul apostle Rembrandt",
  barnabas: "Saint Barnabas painting",
  "maria-magdalena": "Mary Magdalene painting",
  stefanus: "Saint Stephen martyr Rembrandt",
  timotius: "Timothy biblical",
  lidia: "Lydia Philippi conversion",
  nuh: "Noah ark painting",
  adam: "Adam creation Michelangelo",
  hawa: "Eve biblical painting",
  hagar: "Hagar Ishmael painting",
  lea: "Leah biblical",
  rahel: "Rachel biblical well",
  yehuda: "Judah biblical",
  miryam: "Miriam Moses sister",
  rahab: "Rahab Jericho spies",
  simson: "Samson Delilah Rubens",
  naomi: "Naomi Ruth painting",
  boas: "Boaz Ruth painting",
  yonatan: "David Jonathan painting",
  ayub: "Job suffering painting",
  yunus: "Jonah whale painting",
  ezra: "Ezra scribe law painting",
  hizkia: "Hezekiah king painting",
  andreas: "Saint Andrew apostle",
  yakobus: "Saint James apostle",
  tomas: "Doubting Thomas Caravaggio",
  marta: "Martha Mary Jesus painting",
  "maria-betania": "Mary anointing Jesus feet",
  nikodemus: "Nicodemus Jesus painting",
  zakheus: "Zacchaeus sycamore tree",
  priskila: "Priscilla Aquila Acts",
  silas: "Paul Silas prison",
  "yohanes-markus": "Saint Mark evangelist",
  aquila: "Aquila tentmaker Acts",
};

async function searchImage(query) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: "6",
    gsrlimit: "6",
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
  if (!res.ok) throw new Error(`API ${res.status}`);
  const data = await res.json();
  const pages = Object.values(data.query?.pages ?? {});
  const candidates = pages
    .map((page) => page.imageinfo?.[0])
    .filter(Boolean)
    .filter((info) => info.mime?.startsWith("image/"))
    .filter((info) => (info.width ?? 0) >= 350)
    .sort((a, b) => (b.width ?? 0) * (b.height ?? 0) - (a.width ?? 0) * (a.height ?? 0));

  return candidates[0]?.thumburl ?? candidates[0]?.url ?? null;
}

async function downloadImage(url, dest) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error("File too small");
  await fs.writeFile(dest, buf);
  return buf.length;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  let ok = 0;
  let fail = 0;

  for (const [slug, query] of Object.entries(SEARCHES)) {
    const dest = path.join(OUT_DIR, `${slug}.jpg`);
    try {
      const existing = await fs.stat(dest).catch(() => null);
      if (existing && existing.size > 20_000) {
        console.log(`skip ${slug}`);
        ok++;
        continue;
      }

      const url = await searchImage(query);
      if (!url) {
        console.warn(`fail ${slug}: no result`);
        fail++;
        await sleep(DELAY_MS);
        continue;
      }

      const size = await downloadImage(url, dest);
      console.log(`ok   ${slug} (${Math.round(size / 1024)} KB)`);
      ok++;
    } catch (error) {
      console.warn(`fail ${slug}: ${error.message}`);
      fail++;
    }
    await sleep(DELAY_MS);
  }

  console.log(`\nDone: ${ok} ok, ${fail} failed`);
}

main();
