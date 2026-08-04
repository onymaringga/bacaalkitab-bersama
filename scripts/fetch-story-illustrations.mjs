/**
 * Unduh ilustrasi kisah Alkitab dari Wikimedia Commons.
 * Jalankan: node scripts/fetch-story-illustrations.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public/stories");
const USER_AGENT = "bacaalkitab-bersama/1.0 (educational; local-dev)";
const DELAY_MS = 2200;

/** @type {Record<string, string>} */
const SEARCHES = {
  penciptaan: "Creation of Adam Michelangelo Sistine",
  "air-bah": "Noah's Ark Deluge painting",
  "panggilan-abraham": "Sacrifice of Isaac Caravaggio",
  "yusuf-mesir": "Joseph recognized by his brothers Rembrandt",
  "keluaran-mesir": "Crossing of the Red Sea painting",
  "sepuluh-firman": "Moses receives Ten Commandments painting",
  yerikho: "Battle of Jericho trumpets painting",
  "rut-boas": "Ruth and Boaz biblical painting",
  "daud-goliat": "David and Goliath Caravaggio",
  "elia-karmel": "Elijah sacrifice Mount Carmel painting",
  "daniel-singa": "Daniel in the lions den Rubens",
  ester: "Esther before Ahasuerus painting",
  yunus: "Jonah and the whale painting",
  "kelahiran-yesus": "Adoration of the Shepherds Nativity painting",
  "khotbah-bukit": "Sermon on the Mount painting",
  "anak-hilang": "Return of the Prodigal Son Rembrandt",
  "salib-kebangkitan": "Crucifixion Resurrection Jesus painting",
  pentakosta: "Pentecost disciples painting",
  "paulus-damaskus": "Conversion of Saint Paul Caravaggio",
};

async function searchImage(query) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: `filetype:bitmap ${query}`,
    gsrnamespace: "6",
    gsrlimit: "8",
    prop: "imageinfo",
    iiprop: "url|mime|size",
    iiurlwidth: "1200",
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
    .filter((info) => (info.width ?? 0) >= 400)
    .sort(
      (a, b) =>
        (b.width ?? 0) * (b.height ?? 0) - (a.width ?? 0) * (a.height ?? 0),
    );

  return candidates[0]?.thumburl ?? candidates[0]?.url ?? null;
}

async function downloadImage(url, dest) {
  const res = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": USER_AGENT },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error("File too small");
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
      if (existing && existing.size > 25_000) {
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
