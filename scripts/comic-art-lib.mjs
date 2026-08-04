/** Reusable SVG helpers for Bible story comic panels (320×280 art area). */

const STROKE = "#111827";
const SW = 2.5;

export function escapeXml(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function s(attrs) {
  return Object.entries(attrs)
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
}

/** @param {"neutral"|"happy"|"worried"|"angry"|"pray"} mood */
export function drawFace(cx, cy, r, mood = "neutral") {
  const eyeY = cy - r * 0.15;
  const eyeOff = r * 0.38;
  const eyeR = Math.max(1.8, r * 0.12);
  let brows = "";
  let mouth = "";
  if (mood === "happy") {
    brows = `<path d="M${cx - eyeOff - 4} ${eyeY - 8} Q${cx - eyeOff} ${eyeY - 14} ${cx - eyeOff + 4} ${eyeY - 8}" fill="none" stroke="${STROKE}" stroke-width="2"/>`;
    brows += `<path d="M${cx + eyeOff - 4} ${eyeY - 8} Q${cx + eyeOff} ${eyeY - 14} ${cx + eyeOff + 4} ${eyeY - 8}" fill="none" stroke="${STROKE}" stroke-width="2"/>`;
    mouth = `<path d="M${cx - r * 0.35} ${cy + r * 0.35} Q${cx} ${cy + r * 0.65} ${cx + r * 0.35} ${cy + r * 0.35}" fill="none" stroke="${STROKE}" stroke-width="2"/>`;
  } else if (mood === "worried") {
    brows = `<path d="M${cx - eyeOff - 5} ${eyeY - 6} L${cx - eyeOff + 2} ${eyeY - 10}" stroke="${STROKE}" stroke-width="2"/>`;
    brows += `<path d="M${cx + eyeOff + 5} ${eyeY - 6} L${cx + eyeOff - 2} ${eyeY - 10}" stroke="${STROKE}" stroke-width="2"/>`;
    mouth = `<path d="M${cx - r * 0.25} ${cy + r * 0.5} Q${cx} ${cy + r * 0.35} ${cx + r * 0.25} ${cy + r * 0.5}" fill="none" stroke="${STROKE}" stroke-width="2"/>`;
  } else if (mood === "angry") {
    brows = `<path d="M${cx - eyeOff - 6} ${eyeY - 4} L${cx - eyeOff + 4} ${eyeY - 12}" stroke="${STROKE}" stroke-width="2.5"/>`;
    brows += `<path d="M${cx + eyeOff + 6} ${eyeY - 4} L${cx + eyeOff - 4} ${eyeY - 12}" stroke="${STROKE}" stroke-width="2.5"/>`;
    mouth = `<path d="M${cx - r * 0.3} ${cy + r * 0.45} L${cx + r * 0.3} ${cy + r * 0.45}" stroke="${STROKE}" stroke-width="2.5"/>`;
  } else if (mood === "pray") {
    brows = `<path d="M${cx - eyeOff - 3} ${eyeY - 7} Q${cx - eyeOff} ${eyeY - 11} ${cx - eyeOff + 3} ${eyeY - 7}" fill="none" stroke="${STROKE}" stroke-width="1.8"/>`;
    brows += `<path d="M${cx + eyeOff - 3} ${eyeY - 7} Q${cx + eyeOff} ${eyeY - 11} ${cx + eyeOff + 3} ${eyeY - 7}" fill="none" stroke="${STROKE}" stroke-width="1.8"/>`;
    mouth = `<line x1="${cx - 3}" y1="${cy + r * 0.4}" x2="${cx + 3}" y2="${cy + r * 0.4}" stroke="${STROKE}" stroke-width="2"/>`;
  } else {
    brows = `<path d="M${cx - eyeOff - 4} ${eyeY - 7} L${cx - eyeOff + 4} ${eyeY - 7}" stroke="${STROKE}" stroke-width="2"/>`;
    brows += `<path d="M${cx + eyeOff - 4} ${eyeY - 7} L${cx + eyeOff + 4} ${eyeY - 7}" stroke="${STROKE}" stroke-width="2"/>`;
    mouth = `<path d="M${cx - r * 0.22} ${cy + r * 0.42} Q${cx} ${cy + r * 0.48} ${cx + r * 0.22} ${cy + r * 0.42}" fill="none" stroke="${STROKE}" stroke-width="2"/>`;
  }
  return `
    <circle cx="${cx - eyeOff}" cy="${eyeY}" r="${eyeR}" fill="${STROKE}"/>
    <circle cx="${cx + eyeOff}" cy="${eyeY}" r="${eyeR}" fill="${STROKE}"/>
    ${brows}
    ${mouth}
  `;
}

function drawHair(cx, cy, r, style, color = "#292524") {
  if (style === "long") {
    return `<path d="M${cx - r} ${cy} Q${cx - r * 1.1} ${cy + r * 1.6} ${cx - r * 0.5} ${cy + r * 2.2} L${cx + r * 0.5} ${cy + r * 2.2} Q${cx + r * 1.1} ${cy + r * 1.6} ${cx + r} ${cy} Z" fill="${color}" stroke="${STROKE}" stroke-width="${SW}"/>`;
  }
  if (style === "curly") {
    return `<path d="M${cx - r * 0.95} ${cy - r * 0.2} Q${cx} ${cy - r * 1.35} ${cx + r * 0.95} ${cy - r * 0.2} Q${cx + r * 0.7} ${cy + r * 0.5} ${cx} ${cy + r * 0.35} Q${cx - r * 0.7} ${cy + r * 0.5} ${cx - r * 0.95} ${cy - r * 0.2} Z" fill="${color}" stroke="${STROKE}" stroke-width="${SW}"/>`;
  }
  if (style === "bald") return "";
  return `<path d="M${cx - r * 0.92} ${cy + r * 0.15} Q${cx} ${cy - r * 1.05} ${cx + r * 0.92} ${cy + r * 0.15} Z" fill="${color}" stroke="${STROKE}" stroke-width="${SW}"/>`;
}

export function drawCrown(cx, cy, w = 36) {
  const h = w * 0.45;
  return `<polygon points="${cx - w / 2},${cy} ${cx - w / 4},${cy - h} ${cx},${cy - h * 0.55} ${cx + w / 4},${cy - h} ${cx + w / 2},${cy}" fill="#eab308" stroke="${STROKE}" stroke-width="${SW}"/>`;
}

export function drawTurban(cx, cy, r) {
  return `<ellipse cx="${cx}" cy="${cy - r * 0.35}" rx="${r * 1.05}" ry="${r * 0.55}" fill="#fff" stroke="${STROKE}" stroke-width="${SW}"/><circle cx="${cx + r * 0.55}" cy="${cy - r * 0.55}" r="${r * 0.22}" fill="#2563eb" stroke="${STROKE}" stroke-width="2"/>`;
}

/** @param {"stand"|"pray"|"point"|"armsUp"|"kneel"} pose */
function drawArms(cx, shoulderY, pose, skin, robe) {
  if (pose === "pray") {
    return `<path d="M${cx - 18} ${shoulderY + 8} L${cx - 8} ${shoulderY - 18} L${cx} ${shoulderY - 28} L${cx + 8} ${shoulderY - 18} L${cx + 18} ${shoulderY + 8}" fill="none" stroke="${skin}" stroke-width="8" stroke-linecap="round"/><path d="M${cx - 8} ${shoulderY - 18} L${cx} ${shoulderY - 28} L${cx + 8} ${shoulderY - 18}" fill="none" stroke="${STROKE}" stroke-width="2"/>`;
  }
  if (pose === "point") {
    return `<path d="M${cx - 22} ${shoulderY + 10} L${cx - 34} ${shoulderY + 34}" stroke="${skin}" stroke-width="7" stroke-linecap="round"/><path d="M${cx + 22} ${shoulderY + 6} L${cx + 48} ${shoulderY - 8}" stroke="${skin}" stroke-width="7" stroke-linecap="round"/><circle cx="${cx + 50}" cy="${shoulderY - 10}" r="4" fill="${skin}" stroke="${STROKE}" stroke-width="2"/>`;
  }
  if (pose === "armsUp") {
    return `<path d="M${cx - 20} ${shoulderY + 6} L${cx - 34} ${shoulderY - 28}" stroke="${skin}" stroke-width="7" stroke-linecap="round"/><path d="M${cx + 20} ${shoulderY + 6} L${cx + 34} ${shoulderY - 28}" stroke="${skin}" stroke-width="7" stroke-linecap="round"/>`;
  }
  if (pose === "kneel") {
    return `<path d="M${cx - 20} ${shoulderY + 8} L${cx - 30} ${shoulderY + 32}" stroke="${skin}" stroke-width="7" stroke-linecap="round"/><path d="M${cx + 20} ${shoulderY + 8} L${cx + 30} ${shoulderY + 32}" stroke="${skin}" stroke-width="7" stroke-linecap="round"/>`;
  }
  return `<path d="M${cx - 20} ${shoulderY + 6} L${cx - 28} ${shoulderY + 36}" stroke="${skin}" stroke-width="7" stroke-linecap="round"/><path d="M${cx + 20} ${shoulderY + 6} L${cx + 28} ${shoulderY + 36}" stroke="${skin}" stroke-width="7" stroke-linecap="round"/>`;
}

export function drawPerson(x, y, opts = {}) {
  const {
    skin = "#fdba74",
    robe = "#6366f1",
    hairStyle = "short",
    hairColor = "#292524",
    mood = "neutral",
    pose = "stand",
    crown = false,
    turban = false,
    scale = 1,
    flip = false,
    height = 110,
  } = opts;

  const h = height * scale;
  const headR = h * 0.13;
  const headCy = y - h + headR + 4;
  const shoulderY = headCy + headR + 6;
  const robeTop = shoulderY - 4;
  const robeBot = y - 6;
  const cx = x;

  const robePath = `<path d="M${cx - 26 * scale} ${robeTop} L${cx - 34 * scale} ${robeBot} L${cx + 34 * scale} ${robeBot} L${cx + 26 * scale} ${robeTop} Z" fill="${robe}" stroke="${STROKE}" stroke-width="${SW}"/>`;
  const legs = `<rect x="${cx - 10 * scale}" y="${robeBot - 2}" width="${8 * scale}" height="${14 * scale}" rx="3" fill="#44403c" stroke="${STROKE}" stroke-width="2"/><rect x="${cx + 2 * scale}" y="${robeBot - 2}" width="${8 * scale}" height="${14 * scale}" rx="3" fill="#44403c" stroke="${STROKE}" stroke-width="2"/>`;
  const head = `<circle cx="${cx}" cy="${headCy}" r="${headR}" fill="${skin}" stroke="${STROKE}" stroke-width="${SW}"/>`;
  const hair = drawHair(cx, headCy - headR * 0.5, headR, hairStyle, hairColor);
  const face = drawFace(cx, headCy, headR, mood);
  const arms = drawArms(cx, shoulderY, pose, skin, robe);
  const headwear = crown
    ? drawCrown(cx, headCy - headR - 2, headR * 2.2)
    : turban
      ? drawTurban(cx, headCy, headR)
      : "";

  const content = flip
    ? `<g transform="translate(${cx},0) scale(-1,1) translate(${-cx},0)">${robePath}${legs}${arms}${head}${hair}${face}${headwear}</g>`
    : `${robePath}${legs}${arms}${head}${hair}${face}${headwear}`;

  return content;
}

export function drawThrone(x, y, w = 90, h = 70) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="#92400e" stroke="${STROKE}" stroke-width="${SW}"/>
    <rect x="${x + 8}" y="${y - 18}" width="${w - 16}" height="22" rx="4" fill="#b45309" stroke="${STROKE}" stroke-width="${SW}"/>
    <circle cx="${x + 18}" cy="${y + 12}" r="5" fill="#fde047" stroke="${STROKE}" stroke-width="1.5"/>
    <circle cx="${x + w - 18}" cy="${y + 12}" r="5" fill="#fde047" stroke="${STROKE}" stroke-width="1.5"/>
  `;
}

export function drawScroll(x, y) {
  return `
    <rect x="${x}" y="${y}" width="36" height="48" rx="4" fill="#fef3c7" stroke="${STROKE}" stroke-width="${SW}"/>
    <path d="M${x + 6} ${y + 12} H${x + 30}" stroke="#78716c" stroke-width="2"/>
    <path d="M${x + 6} ${y + 22} H${x + 30}" stroke="#78716c" stroke-width="2"/>
    <path d="M${x + 6} ${y + 32} H${x + 24}" stroke="#78716c" stroke-width="2"/>
    <ellipse cx="${x - 4}" cy="${y + 24}" rx="6" ry="10" fill="#fef3c7" stroke="${STROKE}" stroke-width="2"/>
    <ellipse cx="${x + 40}" cy="${y + 24}" rx="6" ry="10" fill="#fef3c7" stroke="${STROKE}" stroke-width="2"/>
  `;
}

export function drawMountain(x, y, w = 200, h = 120) {
  return `<polygon points="${x + w / 2},${y} ${x},${y + h} ${x + w},${y + h}" fill="#78716c" stroke="${STROKE}" stroke-width="${SW}"/><polygon points="${x + w / 2},${y + 20} ${x + w * 0.35},${y + h * 0.55} ${x + w * 0.65},${y + h * 0.55}" fill="#fff" stroke="${STROKE}" stroke-width="2" opacity="0.85"/>`;
}

export function drawArk(x, y) {
  return `<path d="M${x} ${y + 40} Q${x + 60} ${y - 10} ${x + 120} ${y + 40} L${x + 120} ${y + 70} Q${x + 60} ${y + 85} ${x} ${y + 70} Z" fill="#92400e" stroke="${STROKE}" stroke-width="${SW}"/><rect x="${x + 52}" y="${y + 8}" width="16" height="32" fill="#78350f" stroke="${STROKE}" stroke-width="2"/>`;
}

export function drawCross(cx, cy, h = 90) {
  return `<line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + h}" stroke="#44403c" stroke-width="8" stroke-linecap="round"/><line x1="${cx - 28}" y1="${cy + 24}" x2="${cx + 28}" y2="${cy + 24}" stroke="#44403c" stroke-width="6" stroke-linecap="round"/>`;
}

export function drawFire(cx, cy, h = 70) {
  return `<polygon points="${cx},${cy + h} ${cx - 22},${cy + 20} ${cx},${cy} ${cx + 22},${cy + 20}" fill="#f97316" stroke="${STROKE}" stroke-width="${SW}"/><polygon points="${cx},${cy + h - 10} ${cx - 12},${cy + 30} ${cx},${cy + 12} ${cx + 12},${cy + 30}" fill="#fde047" stroke="${STROKE}" stroke-width="1.5"/>`;
}

export function drawRain() {
  let lines = "";
  for (let i = 0; i < 8; i++) {
    const x = 40 + i * 32;
    lines += `<line x1="${x}" y1="20" x2="${x - 8}" y2="70" stroke="#93c5fd" stroke-width="3"/>`;
  }
  return lines;
}

export function drawRainbow(cx, cy, w = 180) {
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6"];
  return colors
    .map((c, i) => `<path d="M${cx - w / 2 + i * 6} ${cy} Q${cx} ${cy - w * 0.55} ${cx + w / 2 - i * 6} ${cy}" fill="none" stroke="${c}" stroke-width="7"/>`)
    .join("");
}

export function drawStar(cx, cy, r = 22) {
  const pts = [];
  for (let i = 0; i  < 10; i++) {
    const ang = (Math.PI / 2) * -1 + (i * Math.PI) / 5;
    const rad = i % 2 === 0 ? r : r * 0.45;
    pts.push(`${cx + Math.cos(ang) * rad},${cy + Math.sin(ang) * rad}`);
  }
  return `<polygon points="${pts.join(" ")}" fill="#fde047" stroke="${STROKE}" stroke-width="${SW}"/>`;
}

export function drawComicBurst(x, y, text, color = "#dc2626") {
  return `
    <polygon points="${x},${y - 40} ${x + 34},${y - 18} ${x + 44},${y + 14} ${x + 16},${y + 36} ${x - 16},${y + 36} ${x - 44},${y + 14} ${x - 34},${y - 18}" fill="#fff" stroke="${STROKE}" stroke-width="${SW}"/>
    <text x="${x}" y="${y + 6}" text-anchor="middle" font-family="Comic Sans MS, cursive, system-ui" font-size="22" font-weight="900" fill="${color}">${escapeXml(text)}</text>
  `;
}

export function drawSpeechBubble(x, y, w, text, fontSize = 12) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="44" rx="10" fill="#fff" stroke="${STROKE}" stroke-width="${SW}"/>
    <polygon points="${x + 24},${y + 44} ${x + 34},${y + 56} ${x + 44},${y + 44}" fill="#fff" stroke="${STROKE}" stroke-width="${SW}"/>
    <text x="${x + w / 2}" y="${y + 28}" text-anchor="middle" font-family="Comic Sans MS, cursive, system-ui" font-size="${fontSize}" font-weight="700" fill="${STROKE}">${escapeXml(text)}</text>
  `;
}

export function drawPalaceFloor(y = 230) {
  return `<line x1="20" y1="${y}" x2="300" y2="${y}" stroke="${STROKE}" stroke-width="2"/><rect x="40" y="${y}" width="40" height="8" fill="#d6d3d1" stroke="${STROKE}" stroke-width="1"/><rect x="120" y="${y}" width="40" height="8" fill="#d6d3d1" stroke="${STROKE}" stroke-width="1"/><rect x="200" y="${y}" width="40" height="8" fill="#d6d3d1" stroke="${STROKE}" stroke-width="1"/>`;
}

export function drawLion(x, y, scale = 1) {
  const s = scale;
  return `
    <ellipse cx="${x}" cy="${y}" rx="${38 * s}" ry="${22 * s}" fill="#ca8a04" stroke="${STROKE}" stroke-width="${SW}"/>
    <circle cx="${x - 28 * s}" cy="${y - 8 * s}" r="${16 * s}" fill="#ca8a04" stroke="${STROKE}" stroke-width="${SW}"/>
    <path d="M${x - 38 * s} ${y - 14 * s} Q${x - 28 * s} ${y - 28 * s} ${x - 16 * s} ${y - 14 * s}" fill="#eab308" stroke="${STROKE}" stroke-width="2"/>
    <circle cx="${x - 32 * s}" cy="${y - 10 * s}" r="${3 * s}" fill="${STROKE}"/>
    <circle cx="${x - 22 * s}" cy="${y - 10 * s}" r="${3 * s}" fill="${STROKE}"/>
    <path d="M${x - 30 * s} ${y - 2 * s} Q${x - 26 * s} ${y + 4 * s} ${x - 22 * s} ${y - 2 * s}" fill="none" stroke="${STROKE}" stroke-width="2"/>
    <path d="M${x + 10 * s} ${y - 4 * s} L${x + 24 * s} ${y + 2 * s} L${x + 10 * s} ${y + 6 * s} Z" fill="#fef3c7" stroke="${STROKE}" stroke-width="2"/>
    <path d="M${x + 30 * s} ${y + 2 * s} L${x + 42 * s} ${y - 6 * s} L${x + 36 * s} ${y + 10 * s} Z" fill="#ca8a04" stroke="${STROKE}" stroke-width="2"/>
    <line x1="${x - 8 * s}" y1="${y + 18 * s}" x2="${x - 14 * s}" y2="${y + 32 * s}" stroke="${STROKE}" stroke-width="3"/>
    <line x1="${x + 8 * s}" y1="${y + 18 * s}" x2="${x + 14 * s}" y2="${y + 32 * s}" stroke="${STROKE}" stroke-width="3"/>
  `;
}

export function drawWhale(x, y) {
  return `
    <ellipse cx="${x}" cy="${y}" rx="95" ry="42" fill="#0891b2" stroke="${STROKE}" stroke-width="${SW}"/>
    <path d="M${x + 90} ${y - 10} L${x + 120} ${y} L${x + 90} ${y + 14} Z" fill="#0891b2" stroke="${STROKE}" stroke-width="${SW}"/>
    <circle cx="${x + 55}" cy="${y - 12}" r="7" fill="#fff" stroke="${STROKE}" stroke-width="2"/>
    <circle cx="${x + 57}" cy="${y - 12}" r="3" fill="${STROKE}"/>
    <path d="M${x - 70} ${y - 20} Q${x - 50} ${y - 40} ${x - 30} ${y - 18}" fill="none" stroke="#0891b2" stroke-width="4"/>
  `;
}

export function drawTablets(x, y) {
  return `<rect x="${x}" y="${y}" width="34" height="52" rx="4" fill="#d6d3d1" stroke="${STROKE}" stroke-width="${SW}"/><rect x="${x + 42}" y="${y}" width="34" height="52" rx="4" fill="#d6d3d1" stroke="${STROKE}" stroke-width="${SW}"/><line x1="${x + 6}" y1="${y + 14}" x2="${x + 28}" y2="${y + 14}" stroke="#57534e" stroke-width="2"/><line x1="${x + 48}" y1="${y + 14}" x2="${x + 70}" y2="${y + 14}" stroke="#57534e" stroke-width="2"/>`;
}

export function drawWall(x, y, w, h, broken = false) {
  if (!broken) {
    return `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#a8a29e" stroke="${STROKE}" stroke-width="${SW}"/>`;
  }
  return `<rect x="${x}" y="${y + 30}" width="50" height="50" fill="#a8a29e" stroke="${STROKE}" stroke-width="${SW}" transform="rotate(-12 ${x + 25} ${y + 55})"/><rect x="${x + 70}" y="${y + 40}" width="50" height="42" fill="#a8a29e" stroke="${STROKE}" stroke-width="${SW}" transform="rotate(15 ${x + 95} ${y + 61})"/>`;
}

export function drawManger(x, y) {
  return `<path d="M${x} ${y + 30} Q${x + 40} ${y - 10} ${x + 80} ${y + 30} L${x + 80} ${y + 50} L${x} ${y + 50} Z" fill="#92400e" stroke="${STROKE}" stroke-width="${SW}"/>`;
}

export function drawCrowd(y, count = 4, mood = "happy") {
  const spacing = 55;
  const start = 160 - ((count - 1) * spacing) / 2;
  let out = "";
  for (let i = 0; i < count; i++) {
    out += drawPerson(start + i * spacing, y, {
      robe: i % 2 ? "#6366f1" : "#059669",
      mood,
      pose: mood === "happy" ? "armsUp" : "stand",
      scale: 0.85,
      hairStyle: i % 3 === 0 ? "long" : "short",
    });
  }
  return out;
}
