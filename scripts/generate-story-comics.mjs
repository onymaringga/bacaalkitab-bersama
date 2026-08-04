/**
 * Generate comic-panel SVG illustrations for Bible stories.
 * Run: node scripts/generate-story-comics.mjs
 */
import fs from "node:fs/promises";
import path from "node:path";
import {
  drawArk,
  drawComicBurst,
  drawCross,
  drawCrowd,
  drawFire,
  drawLion,
  drawManger,
  drawMountain,
  drawPalaceFloor,
  drawPerson,
  drawRain,
  drawRainbow,
  drawScroll,
  drawSpeechBubble,
  drawStar,
  drawTablets,
  drawThrone,
  drawWall,
  drawWhale,
  escapeXml,
} from "./comic-art-lib.mjs";

const OUT = path.join(process.cwd(), "public/stories");

/** @type {Record<string, { title: string; panels: { bg: string; caption: string; art: string }[] }>} */
const STORIES = {
  penciptaan: {
    title: "Penciptaan dunia",
    panels: [
      {
        bg: "#0f172a",
        caption: "Allah menciptakan cahaya",
        art: `${drawStar(160, 110, 28)}${drawStar(80, 50, 8)}${drawStar(240, 60, 6)}<line x1="160" y1="82" x2="160" y2="40" stroke="#fde047" stroke-width="4"/><line x1="132" y1="110" x2="100" y2="110" stroke="#fde047" stroke-width="4"/><line x1="188" y1="110" x2="220" y2="110" stroke="#fde047" stroke-width="4"/>`,
      },
      {
        bg: "#14532d",
        caption: "Bumi & laut",
        art: `<rect x="30" y="170" width="260" height="50" fill="#166534" stroke="#111827" stroke-width="2.5"/><path d="M30 170 Q160 90 290 170" fill="#0284c7" stroke="#111827" stroke-width="2.5"/>${drawPerson(120, 230, { robe: "#059669", pose: "point", mood: "happy" })}`,
      },
      {
        bg: "#fef3c7",
        caption: "Adam & Hawa",
        art: `${drawPerson(110, 240, { robe: "#2563eb", hairStyle: "short", mood: "happy" })}${drawPerson(210, 240, { robe: "#db2777", hairStyle: "long", hairColor: "#78350f", mood: "happy" })}<path d="M130 180 Q160 150 190 180" fill="none" stroke="#16a34a" stroke-width="3"/>`,
      },
    ],
  },
  "air-bah": {
    title: "Air bah & Nuh",
    panels: [
      { bg: "#475569", caption: "Hujan turun", art: drawRain() + drawPerson(160, 240, { robe: "#78350f", mood: "worried", pose: "pray" }) },
      { bg: "#0369a1", caption: "Bahtera Nuh", art: drawArk(100, 150) + drawPerson(160, 210, { robe: "#92400e", pose: "point", scale: 0.9 }) },
      { bg: "#e0f2fe", caption: "Pelangi perjanjian", art: drawRainbow(160, 210) + drawPerson(160, 240, { robe: "#6366f1", mood: "happy", pose: "armsUp" }) },
    ],
  },
  "panggilan-abraham": {
    title: "Panggilan Abraham",
    panels: [
      { bg: "#1e1b4b", caption: "Bintang di langit", art: `${drawStar(160, 70, 16)}<circle cx="80" cy="50" r="2" fill="#fff"/><circle cx="220" cy="40" r="2" fill="#fff"/>` },
      { bg: "#fef9c3", caption: "Berangkat dari Ur", art: `${drawPerson(110, 240, { robe: "#78350f", pose: "point" })}<rect x="180" y="170" width="60" height="36" fill="#d97706" stroke="#111827" stroke-width="2.5"/>` },
      { bg: "#dcfce7", caption: "Janji Allah", art: drawSpeechBubble(70, 90, 180, "Keturunanmu akan diberkati") + drawPerson(160, 240, { robe: "#2563eb", mood: "happy", pose: "pray" }) },
    ],
  },
  "yusuf-mesir": {
    title: "Yusuf di Mesir",
    panels: [
      { bg: "#fef08a", caption: "Mantel berwarna", art: drawPerson(160, 240, { robe: "#dc2626", hairStyle: "curly", mood: "happy", pose: "armsUp" }) },
      { bg: "#44403c", caption: "Di penjara", art: `<rect x="70" y="70" width="180" height="140" fill="none" stroke="#78716c" stroke-width="6"/>${drawPerson(160, 230, { robe: "#57534e", mood: "worried", pose: "kneel" })}` },
      { bg: "#fef3c7", caption: "Pembesar Mesir", art: `${drawPerson(160, 240, { robe: "#ca8a04", turban: true, mood: "happy", pose: "point" })}${drawScroll(210, 130)}` },
    ],
  },
  "keluaran-mesir": {
    title: "Keluaran dari Mesir",
    panels: [
      { bg: "#450a0a", caption: "Paskah — darah di ambang pintu", art: `<rect x="110" y="110" width="100" height="100" fill="#fef3c7" stroke="#111827" stroke-width="2.5"/><line x1="110" y1="110" x2="210" y2="110" stroke="#dc2626" stroke-width="6"/>${drawPerson(160, 240, { robe: "#6366f1", pose: "pray" })}` },
      { bg: "#0c4a6e", caption: "Laut terbelah", art: `<rect x="0" y="150" width="120" height="80" fill="#0284c7" stroke="#111827" stroke-width="2"/><rect x="200" y="150" width="120" height="80" fill="#0284c7" stroke="#111827" stroke-width="2"/><path d="M120 150 L160 100 L200 150 L200 230 L120 230 Z" fill="#fef9c3" stroke="#111827" stroke-width="2.5"/>${drawCrowd(240, 3, "happy")}` },
      { bg: "#fef9c3", caption: "Menuju Tanah Perjanjian", art: `${drawPerson(160, 240, { robe: "#059669", pose: "point", mood: "happy" })}<ellipse cx="160" cy="200" rx="70" ry="18" fill="#d97706" opacity="0.35"/>` },
    ],
  },
  "sepuluh-firman": {
    title: "Sepuluh Firman",
    panels: [
      { bg: "#57534e", caption: "Gunung Sinai", art: drawMountain(60, 80, 200, 120) },
      { bg: "#fef9c3", caption: "Dua loh batu", art: drawTablets(113, 90) + drawPerson(160, 240, { robe: "#78350f", mood: "neutral", scale: 0.9 }) },
      { bg: "#ecfccb", caption: "Umat mendengar", art: drawCrowd(240, 5, "neutral") },
    ],
  },
  yerikho: {
    title: "Yosua & Yerikho",
    panels: [
      { bg: "#fef9c3", caption: "Berputar mengelilingi", art: `<ellipse cx="160" cy="170" rx="70" ry="22" fill="none" stroke="#111827" stroke-width="3" stroke-dasharray="6 4"/>${drawPerson(160, 240, { robe: "#6366f1", pose: "point" })}` },
      { bg: "#78716c", caption: "Tembok Yerikho", art: drawWall(50, 90, 220, 100) },
      { bg: "#fef08a", caption: "Tembok runtuh!", art: drawWall(60, 120, 180, 80, true) + drawComicBurst(230, 110, "BOOM!") },
    ],
  },
  "rut-boas": {
    title: "Rut & Boas",
    panels: [
      { bg: "#ecfccb", caption: "Rut memungut jelai", art: `<line x1="60" y1="200" x2="260" y2="200" stroke="#ca8a04" stroke-width="4"/>${drawPerson(120, 240, { robe: "#db2777", hairStyle: "long", mood: "neutral", pose: "kneel" })}` },
      { bg: "#fef3c7", caption: "Boas melindungi", art: `${drawPerson(100, 240, { robe: "#78350f", pose: "point" })}${drawPerson(210, 240, { robe: "#db2777", hairStyle: "long", mood: "happy" })}` },
      { bg: "#fce7f3", caption: "Kasih setia (hesed)", art: drawSpeechBubble(80, 100, 160, "HESED — setia & baik") + drawCrowd(240, 2, "happy") },
    ],
  },
  "daud-goliat": {
    title: "Daud & Goliat",
    panels: [
      { bg: "#fef9c3", caption: "Goliat raksasa", art: drawPerson(160, 250, { skin: "#78716c", robe: "#57534e", scale: 1.35, mood: "angry", hairStyle: "bald" }) + `<rect x="220" y="100" width="12" height="100" fill="#444" stroke="#111827" stroke-width="2"/>` },
      { bg: "#ecfccb", caption: "Daud & ketapel", art: drawPerson(160, 240, { robe: "#2563eb", hairStyle: "curly", mood: "neutral", pose: "point" }) + `<line x1="180" y1="150" x2="240" y2="130" stroke="#92400e" stroke-width="5"/><circle cx="244" cy="128" r="6" fill="#57534e" stroke="#111827" stroke-width="2"/>` },
      { bg: "#fef08a", caption: "Kemenangan!", art: drawComicBurst(160, 120, "WHAM!") + drawPerson(160, 240, { robe: "#2563eb", mood: "happy", pose: "armsUp" }) },
    ],
  },
  "elia-karmel": {
    title: "Elia di Karmel",
    panels: [
      { bg: "#fef9c3", caption: "450 nabi Baal", art: drawCrowd(240, 5, "neutral") },
      { bg: "#44403c", caption: "Mezbah basah", art: `<rect x="100" y="150" width="120" height="50" fill="#78716c" stroke="#111827" stroke-width="2.5"/>${drawPerson(160, 240, { robe: "#78350f", pose: "pray", mood: "pray" })}` },
      { bg: "#7f1d1d", caption: "Api dari langit!", art: drawFire(160, 120) + drawSpeechBubble(90, 60, 140, "TUHAN jawab!") },
    ],
  },
  "daniel-singa": {
    title: "Daniel di liang singa",
    panels: [
      { bg: "#fef9c3", caption: "Daniel berdoa", art: drawPerson(160, 240, { robe: "#6366f1", pose: "pray", mood: "pray" }) },
      { bg: "#44403c", caption: "Dilempar ke liang", art: `<ellipse cx="160" cy="210" rx="100" ry="28" fill="#292524" stroke="#111827" stroke-width="2.5"/>${drawPerson(160, 190, { robe: "#6366f1", pose: "armsUp", mood: "worried", scale: 0.85 })}` },
      { bg: "#78716c", caption: "Singa menutup mulut", art: drawLion(110, 180) + drawPerson(210, 240, { robe: "#6366f1", mood: "happy", pose: "pray" }) },
    ],
  },
  ester: {
    title: "Ester menyelamatkan bangsanya",
    panels: [
      {
        bg: "#fef3c7",
        caption: "Haman merencanakan jahat",
        art: `${drawPalaceFloor()}${drawPerson(130, 240, { robe: "#1e293b", mood: "angry", pose: "point", hairStyle: "short" })}${drawScroll(200, 120)}`,
      },
      {
        bg: "#fce7f3",
        caption: "Ester menghadap raja",
        art: `${drawPalaceFloor()}${drawThrone(190, 140)}${drawPerson(220, 170, { robe: "#ca8a04", crown: true, mood: "neutral", scale: 0.9 })}${drawPerson(110, 240, { robe: "#db2777", hairStyle: "long", crown: true, mood: "worried", pose: "kneel" })}`,
      },
      {
        bg: "#dcfce7",
        caption: "Bangsa selamat!",
        art: `${drawSpeechBubble(60, 80, 200, "Untuk saat ini...")}${drawCrowd(240, 4, "happy")}`,
      },
    ],
  },
  yunus: {
    title: "Yunus & ikan besar",
    panels: [
      { bg: "#0ea5e9", caption: "Melarikan diri ke Tarsis", art: `<path d="M60 180 L260 160 L240 220 L80 230 Z" fill="#92400e" stroke="#111827" stroke-width="2.5"/>${drawPerson(140, 210, { robe: "#6366f1", pose: "point" })}` },
      { bg: "#0369a1", caption: "Dibuang ke laut", art: `${drawPerson(160, 170, { robe: "#6366f1", pose: "armsUp", mood: "worried", scale: 0.9 })}<path d="M160 190 Q160 230 160 260" stroke="#111827" stroke-width="2" stroke-dasharray="4 3" fill="none"/>` },
      { bg: "#164e63", caption: "Ditelan ikan besar", art: `${drawWhale(160, 150)}${drawPerson(160, 155, { robe: "#6366f1", mood: "worried", scale: 0.75 })}` },
    ],
  },
  "kelahiran-yesus": {
    title: "Kelahiran Yesus",
    panels: [
      { bg: "#1e1b4b", caption: "Bintang Betlehem", art: drawStar(160, 90, 24) },
      { bg: "#44403c", caption: "Tidak ada tempat di penginapan", art: drawSpeechBubble(80, 100, 160, "PENUH") + drawPerson(160, 240, { robe: "#78350f", mood: "worried" }) },
      { bg: "#fef3c7", caption: "Bayi di palungan", art: `${drawManger(110, 150)}${drawPerson(145, 175, { skin: "#fecdd3", robe: "#fff", scale: 0.45, mood: "happy" })}${drawPerson(90, 240, { robe: "#2563eb", pose: "kneel" })}${drawPerson(220, 240, { robe: "#db2777", hairStyle: "long", pose: "kneel" })}` },
    ],
  },
  "khotbah-bukit": {
    title: "Khotbah di Bukit",
    panels: [
      { bg: "#86efac", caption: "Yesus di bukit", art: `${drawMountain(40, 120, 240, 100)}${drawPerson(160, 210, { skin: "#fef3c7", robe: "#fff", mood: "happy", pose: "point" })}` },
      { bg: "#fef9c3", caption: "Berbahagialah...", art: drawSpeechBubble(50, 90, 220, "Berbahagialah yang miskin di hadapan Allah", 11) },
      { bg: "#ecfccb", caption: "Garam & terang", art: `<circle cx="110" cy="150" r="24" fill="#fef08a" stroke="#111827" stroke-width="2.5"/>${drawStar(210, 140, 26)}` },
    ],
  },
  "anak-hilang": {
    title: "Anak yang hilang",
    panels: [
      { bg: "#fef08a", caption: "Anak pergi jauh", art: `${drawPerson(120, 240, { robe: "#78350f", mood: "happy", pose: "point" })}${drawComicBurst(220, 120, "UANG")}` },
      { bg: "#44403c", caption: "Babi & kelaparan", art: `${drawPerson(160, 240, { robe: "#78350f", mood: "worried" })}<ellipse cx="90" cy="200" rx="28" ry="14" fill="#fca5a5" stroke="#111827" stroke-width="2"/><ellipse cx="230" cy="205" rx="24" ry="12" fill="#fca5a5" stroke="#111827" stroke-width="2"/>` },
      { bg: "#fef3c7", caption: "Bapa menyambut pulang", art: `${drawPerson(110, 240, { robe: "#78350f", mood: "happy", pose: "armsUp" })}${drawPerson(200, 240, { robe: "#6366f1", mood: "happy", pose: "point", scale: 0.9 })}` },
    ],
  },
  "salib-kebangkitan": {
    title: "Salib & kebangkitan",
    panels: [
      { bg: "#57534e", caption: "Golgota", art: drawCross(160, 90) },
      { bg: "#1c1917", caption: "Sudahlah!", art: `<rect x="0" y="0" width="320" height="280" fill="#292524"/><text x="160" y="140" text-anchor="middle" font-size="24" font-weight="900" fill="#fef08a">SUDAHLAH!</text>` },
      { bg: "#fef9c3", caption: "Kubur kosong — Ia bangkit!", art: `<ellipse cx="160" cy="220" rx="80" ry="22" fill="#78716c" stroke="#111827" stroke-width="2.5"/><rect x="120" y="140" width="80" height="55" fill="#44403c" stroke="#111827" stroke-width="2.5"/>${drawPerson(160, 210, { skin: "#fef3c7", robe: "#fff", mood: "happy", pose: "armsUp", crown: true })}` },
    ],
  },
  pentakosta: {
    title: "Pentakosta",
    panels: [
      { bg: "#fef9c3", caption: "Murid berkumpul", art: drawCrowd(240, 5, "neutral") },
      { bg: "#7f1d1d", caption: "Lidah api", art: `${drawFire(120, 150, 50)}${drawFire(160, 130, 70)}${drawFire(200, 150, 50)}` },
      { bg: "#dbeafe", caption: "3.000 orang percaya", art: `<text x="160" y="110" text-anchor="middle" font-size="32" font-weight="900" fill="#1d4ed8">3.000+</text>${drawCrowd(240, 4, "happy")}` },
    ],
  },
  "paulus-damaskus": {
    title: "Paulus di Damaskus",
    panels: [
      { bg: "#fef9c3", caption: "Saulus mengejar jemaat", art: `${drawPerson(160, 240, { robe: "#57534e", mood: "angry", pose: "point" })}${drawScroll(210, 130)}` },
      { bg: "#fef08a", caption: "Cahaya dari langit!", art: `<polygon points="160,260 90,50 230,50" fill="#fde047" opacity="0.75" stroke="#111827" stroke-width="2"/>${drawPerson(160, 240, { robe: "#57534e", mood: "worried", pose: "kneel" })}` },
      { bg: "#ecfccb", caption: "Paulus memberitakan Yesus", art: `${drawPerson(160, 240, { robe: "#6366f1", mood: "happy", pose: "point" })}${drawSpeechBubble(80, 90, 160, "YESUS HIDUP!")}` },
    ],
  },
};

function comicSvg(config) {
  const panelHtml = config.panels
    .map((panel, i) => {
      const ox = 20 + i * 310;
      return `
    <g>
      <rect x="${ox}" y="20" width="300" height="360" fill="${panel.bg}" stroke="#000" stroke-width="5" rx="4"/>
      <g transform="translate(${ox}, 20)">
        ${panel.art}
      </g>
      <rect x="${ox + 10}" y="300" width="280" height="70" rx="8" fill="#fff" stroke="#000" stroke-width="3"/>
      <text x="${ox + 150}" y="342" text-anchor="middle" font-family="Comic Sans MS, cursive, system-ui" font-size="15" font-weight="700" fill="#000">${escapeXml(panel.caption)}</text>
    </g>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 420" role="img" aria-label="${escapeXml(config.title)}">
  <rect width="960" height="420" fill="#fff7ed"/>
  <rect x="8" y="8" width="944" height="404" fill="#fff" stroke="#000" stroke-width="4" rx="8"/>
  ${panelHtml}
  <rect x="20" y="390" width="920" height="28" fill="#000"/>
  <text x="480" y="410" text-anchor="middle" font-family="Comic Sans MS, cursive, system-ui" font-size="16" font-weight="700" fill="#fff">${escapeXml(config.title.toUpperCase())}</text>
</svg>`;
}

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  for (const [slug, config] of Object.entries(STORIES)) {
    await fs.writeFile(path.join(OUT, `${slug}.svg`), comicSvg(config));
    console.log(`ok ${slug}`);
  }
  console.log(`\nGenerated ${Object.keys(STORIES).length} comic illustrations`);
}

main();
