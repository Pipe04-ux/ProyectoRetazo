/* Retazo · dibujo SVG de la prenda a partir del diseño (tipo, tela, color, medidas, detalles). */
(function () {
  const PATHS = {
    camisa: "M64 26 L86 18 Q100 34 114 18 L136 26 L182 60 L162 92 L144 78 L144 220 L56 220 L56 78 L38 92 L18 60 Z",
    chaqueta: "M60 24 L84 16 L100 40 L116 16 L140 24 L186 62 L166 96 L146 82 L146 222 L54 222 L54 82 L34 96 L14 62 Z",
    buzo: "M62 34 L84 28 Q100 40 116 28 L138 34 L184 66 L164 98 L146 84 L146 220 L54 220 L54 84 L36 98 L16 66 Z",
    vestido: "M72 22 L88 16 Q100 30 112 16 L128 22 L140 72 L126 84 L158 222 L42 222 L74 84 L60 72 Z",
    pantalon: "M60 18 L140 18 L150 222 L108 222 L100 96 L92 222 L50 222 Z",
    falda: "M60 40 L140 40 L176 222 L24 222 Z",
  };
  const TOPS = ["camisa", "chaqueta", "buzo"];

  function lum(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  }

  let uid = 0;
  R.garment = function (d, o) {
    o = o || {};
    const id = "g" + ++uid;
    const t = d.tipo;
    const path = PATHS[t] || PATHS.camisa;
    const top = TOPS.includes(t);
    const m = d.medidas || { pecho: 98, cintura: 84, largo: 72 };
    const sx = (0.86 + ((m.pecho - 80) / 50) * 0.28).toFixed(3);
    const sy = (0.86 + ((m.largo - 50) / 60) * 0.28).toFixed(3);
    const fg = lum(d.color) > 0.6 ? "#0F0F0E" : "#FFFFFF";
    const has = (x) => (d.detalles || []).includes(x);

    let defs = `<clipPath id="${id}c"><path d="${path}"/></clipPath>`;
    let tex = "";
    if (d.tela === "lino") {
      defs += `<pattern id="${id}p" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="#000" stroke-opacity=".16" stroke-width="1.3"/></pattern>`;
      tex = `<rect x="0" y="0" width="200" height="240" fill="url(#${id}p)"/>`;
    } else if (d.tela === "dril") {
      defs += `<pattern id="${id}p" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 0 L4 4 M4 0 L0 4" stroke="#000" stroke-opacity=".14" stroke-width="1"/></pattern>`;
      tex = `<rect x="0" y="0" width="200" height="240" fill="url(#${id}p)"/>`;
    } else if (d.tela === "reciclada") {
      const cols = ["#A63A26", "#C79A32", "#4F6B3A", "#36556E", "#C9A3A0", "#5B3A5C"];
      let k = 0;
      for (let y = 10; y < 240; y += 40) {
        for (let x = 10; x < 200; x += 40) {
          tex += `<rect x="${x + ((y / 40) % 2) * 8}" y="${y}" width="36" height="36" rx="3" fill="${cols[k++ % cols.length]}" fill-opacity=".38"/>`;
        }
      }
    }

    let det = "";
    if (t === "falda" || t === "pantalon") {
      det += `<rect x="${t === "falda" ? 60 : 60}" y="${t === "falda" ? 30 : 18}" width="80" height="${t === "falda" ? 14 : 16}" fill="${d.color}" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>`;
    }
    if (t === "buzo") {
      det += `<path d="M76 142 L124 142 L130 186 L70 186 Z" fill="none" stroke="${fg}" stroke-opacity=".7" stroke-width="2" stroke-dasharray="4 3"/>`;
      det += `<path d="M92 36 L92 70 M108 36 L108 70" stroke="${fg}" stroke-width="2.5" stroke-linecap="round"/>`;
    }
    if (has("cuello") && top) {
      det += `<path d="M84 18 L100 46 L116 18 Z" fill="${fg}" fill-opacity=".92" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    }
    if (has("bolsillos")) {
      const y = t === "pantalon" ? 40 : t === "falda" ? 62 : t === "vestido" ? 140 : 118;
      const x1 = t === "vestido" ? 66 : 64, x2 = t === "vestido" ? 112 : 114;
      det += `<path d="M${x1} ${y} h24 v26 h-24 Z M${x2} ${y} h24 v26 h-24 Z" fill="${fg}" fill-opacity=".16" stroke="${fg}" stroke-width="2" stroke-dasharray="4 3"/>`;
    }
    if (has("botones")) {
      const bc = lum(d.color) > 0.6 ? "#A63A26" : "#D6B25C";
      let b = "";
      const ys = top ? [54, 84, 114, 144, 174] : t === "vestido" ? [34, 56, 78] : [30];
      ys.forEach((yy) => (b += `<circle cx="100" cy="${yy}" r="4.5" fill="${bc}" stroke="currentColor" stroke-width="2"/>`));
      if (top) b += `<path d="M100 48 V190" stroke="${fg}" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="3 3"/>`;
      det += b;
    }
    if (has("bordado")) {
      const cx = top ? 76 : t === "vestido" ? 114 : 130;
      const cy = top ? 74 : t === "vestido" ? 164 : 150;
      det += `<g stroke="${fg}" stroke-width="2" stroke-linecap="round" fill="none"><circle cx="${cx}" cy="${cy}" r="3" fill="#D6B25C" stroke="none"/><path d="M${cx} ${cy - 6} v-7 M${cx} ${cy + 6} v7 M${cx - 6} ${cy} h-7 M${cx + 6} ${cy} h7 M${cx - 4} ${cy - 4} l-5 -5 M${cx + 4} ${cy + 4} l5 5 M${cx + 4} ${cy - 4} l5 -5 M${cx - 4} ${cy + 4} l-5 5"/></g>`;
    }
    if (has("parche")) {
      const px = top ? 66 : 70, py = top ? 156 : t === "pantalon" ? 130 : 150;
      det += `<g transform="rotate(-6 ${px + 13} ${py + 13})"><rect x="${px}" y="${py}" width="28" height="28" rx="3" fill="#A63A26" stroke="#0F0F0E" stroke-width="1.5" stroke-dasharray="3 2"/><rect x="${px + 7}" y="${py + 7}" width="14" height="14" rx="2" fill="#D6B25C"/></g>`;
    }

    let frase = "";
    if (d.frase) {
      const txt = String(d.frase).toUpperCase().replace(/[&<>"']/g, "");
      const fs = Math.max(8, Math.min(17, 150 / Math.max(6, txt.length)));
      const pos = t === "pantalon" ? 'x="76" y="150" transform="rotate(-90 76 150)"' : t === "falda" ? 'x="100" y="132"' : t === "vestido" ? 'x="100" y="112"' : 'x="100" y="100"';
      frase = `<text ${pos} text-anchor="middle" font-family="Archivo, Impact, sans-serif" font-weight="900" font-size="${fs.toFixed(1)}" letter-spacing=".5" fill="${fg}">${txt}</text>`;
    }
    const hood = t === "buzo" ? `<ellipse cx="100" cy="30" rx="28" ry="20" fill="${d.color}" stroke="currentColor" stroke-width="3"/>` : "";
    const neck = top || t === "vestido" ? `<path d="M86 18 Q100 36 114 18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>` : "";
    const label = o.label === false ? "" : ` role="img" aria-label="Vista previa: ${R.nombrePrenda(d)}"`;
    return (
      `<svg viewBox="0 0 200 240" class="garment"${label} xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>` +
      `<g transform="translate(100 120) scale(${sx} ${sy}) translate(-100 -120)">${hood}` +
      `<path d="${path}" fill="${d.color}" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>` +
      `<g clip-path="url(#${id}c)">${tex}</g>${det}${frase}${t === "buzo" ? "" : neck}</g></svg>`
    );
  };
})();
