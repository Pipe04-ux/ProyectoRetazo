/* Retazo · dibujo SVG de la prenda a partir del diseño (tipo, tela, color, medidas, detalles, frase).
   v0.4: siluetas con cuellos, mangas, costuras, pliegues, sombra y texturas de tela más realistas. */
(function () {
  const PATHS = {
    camisa:
      "M86 16 Q100 30 114 16 L138 24 Q160 34 184 58 L166 94 L146 80 Q149 150 147 222 Q100 230 53 222 Q51 150 54 80 L34 94 L16 58 Q40 34 62 24 Z",
    chaqueta:
      "M84 14 Q100 26 116 14 L140 22 Q166 32 188 70 L176 150 L152 146 L146 92 L146 224 Q100 231 54 224 L54 92 L48 146 L24 150 L12 70 Q34 32 60 22 Z",
    buzo:
      "M68 28 Q100 46 132 28 L152 34 Q180 46 188 84 L182 172 L156 168 L150 110 L150 222 Q100 230 50 222 L50 110 L44 168 L18 172 L12 84 Q20 46 48 34 Z",
    vestido:
      "M72 16 L86 14 Q100 44 114 14 L128 16 L134 68 Q126 84 130 100 L160 222 Q100 233 40 222 L70 100 Q74 84 66 68 Z",
    pantalon:
      "M58 16 L142 16 L148 44 L154 224 L106 224 L101 118 Q100 106 99 118 L94 224 L46 224 L52 44 Z",
    falda: "M62 36 L138 36 L176 224 Q100 233 24 224 Z",
  };
  const TOPS = ["camisa", "chaqueta", "buzo"];

  /* Pliegues suaves: oscuros (sombra) y claros (luz). Se dibujan recortados dentro de la prenda. */
  const FOLDS = {
    camisa: {
      d: ["M58 96 Q70 120 66 150 Q62 186 60 214", "M142 96 Q130 120 134 150 Q138 186 140 214", "M50 84 Q58 92 60 104", "M150 84 Q142 92 140 104", "M172 66 Q164 76 160 88", "M28 66 Q36 76 40 88"],
      l: ["M82 70 Q88 140 84 210", "M120 76 Q116 140 122 208", "M150 44 Q164 52 174 62", "M50 44 Q36 52 26 62"],
    },
    chaqueta: {
      d: ["M58 100 Q66 140 60 220", "M142 100 Q134 140 140 220", "M162 118 Q170 128 168 144", "M38 118 Q30 128 32 144", "M180 80 Q176 110 170 140", "M20 80 Q24 110 30 140"],
      l: ["M80 90 Q86 150 82 216", "M120 90 Q114 150 118 216", "M168 56 Q178 66 182 78", "M32 56 Q22 66 18 78"],
    },
    buzo: {
      d: ["M54 112 Q60 160 56 206", "M146 112 Q140 160 144 206", "M158 120 Q166 140 162 158", "M42 120 Q34 140 38 158", "M82 112 Q100 120 118 112"],
      l: ["M76 100 Q82 130 78 146", "M124 100 Q118 130 122 146", "M176 90 Q178 120 176 150", "M24 90 Q22 120 24 150"],
    },
    vestido: {
      d: ["M88 104 Q82 160 62 220", "M100 106 Q100 160 100 226", "M112 104 Q118 160 138 220", "M76 112 Q62 170 46 218", "M124 112 Q138 170 154 218"],
      l: ["M94 106 Q92 160 80 224", "M106 106 Q108 160 120 224", "M70 140 Q60 180 54 222"],
    },
    pantalon: {
      d: ["M54 130 Q72 138 94 128", "M104 128 Q126 138 150 130", "M56 188 Q74 194 92 186", "M104 186 Q126 194 148 186"],
      l: ["M72 40 Q70 130 66 220", "M130 40 Q132 130 136 220", "M88 60 Q86 130 84 220"],
    },
    falda: {
      d: ["M76 52 L52 228", "M100 52 L100 232", "M124 52 L148 228"],
      l: ["M88 52 L76 230", "M112 52 L124 230", "M64 52 L38 226", "M136 52 L162 226"],
    },
  };

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
    const light = lum(d.color) > 0.6;
    const fg = light ? "#0F0F0E" : "#FFFFFF";
    const cc = light ? "#2B2B28" : "#DAD4C4"; // tela de contraste
    const has = (x) => (d.detalles || []).includes(x);
    const C = d.color;

    /* ---------- definiciones ---------- */
    let defs =
      `<clipPath id="${id}c"><path d="${path}"/></clipPath>` +
      `<linearGradient id="${id}h" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".30"/><stop offset=".2" stop-color="#000" stop-opacity="0"/><stop offset=".6" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>` +
      `<linearGradient id="${id}v" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>` +
      `<filter id="${id}s" x="-20%" y="-10%" width="140%" height="130%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#000" flood-opacity=".3"/></filter>` +
      `<filter id="${id}b" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="1.3"/></filter>`;

    /* ---------- tela ---------- */
    let tex = "";
    if (d.tela === "algodon") {
      defs += `<pattern id="${id}p" width="3.2" height="3.2" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.6" r=".55" fill="#000" fill-opacity=".1"/><circle cx="0" cy="0" r=".4" fill="#fff" fill-opacity=".12"/></pattern>`;
      tex = `<rect x="0" y="0" width="200" height="240" fill="url(#${id}p)"/>`;
    } else if (d.tela === "lino") {
      defs +=
        `<pattern id="${id}p" width="14" height="11" patternUnits="userSpaceOnUse">` +
        `<path d="M0 2 H14" stroke="#000" stroke-opacity=".10" stroke-width=".8"/><path d="M0 6.5 H9" stroke="#fff" stroke-opacity=".16" stroke-width="1"/><path d="M2 0 V11" stroke="#000" stroke-opacity=".09" stroke-width=".8"/><path d="M9 0 V7" stroke="#fff" stroke-opacity=".14" stroke-width="1.1"/><path d="M5 8.5 H14" stroke="#000" stroke-opacity=".13" stroke-width="1.2"/></pattern>`;
      tex = `<rect x="0" y="0" width="200" height="240" fill="url(#${id}p)"/>`;
    } else if (d.tela === "dril") {
      defs += `<pattern id="${id}p" width="3.6" height="3.6" patternUnits="userSpaceOnUse" patternTransform="rotate(52)"><path d="M0 0 V3.6" stroke="#000" stroke-opacity=".17" stroke-width="1.3"/><path d="M1.8 0 V3.6" stroke="#fff" stroke-opacity=".08" stroke-width=".8"/></pattern>`;
      tex = `<rect x="0" y="0" width="200" height="240" fill="url(#${id}p)"/>`;
    } else if (d.tela === "reciclada") {
      const cols = ["#A63A26", "#C79A32", "#4F6B3A", "#36556E", "#C9A3A0", "#5B3A5C", "#DAD4C4"];
      const wid = [46, 38, 52, 40], hei = [34, 44, 38, 48];
      let k = 0;
      for (let y = 0, r = 0; y < 240; r++) {
        const h = hei[r % 4];
        for (let x = -((r * 17) % 40), c = 0; x < 200; c++) {
          const w = wid[(r + c) % 4];
          tex += `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${cols[k++ % cols.length]}" fill-opacity=".5"/>`;
          tex += `<rect x="${x + 2.5}" y="${y + 2.5}" width="${w - 5}" height="${h - 5}" fill="none" stroke="${fg}" stroke-opacity=".38" stroke-width="1" stroke-dasharray="2.5 2"/>`;
          x += w;
        }
        y += h;
      }
    }

    /* ---------- utilidades ---------- */
    const stitch = (dd) => `<path d="${dd}" fill="none" stroke="${fg}" stroke-opacity=".4" stroke-width="1" stroke-dasharray="2.5 2" stroke-linecap="round"/>`;
    const line = (dd, op, w) => `<path d="${dd}" fill="none" stroke="${fg}" stroke-opacity="${op || 0.4}" stroke-width="${w || 1.2}" stroke-linecap="round"/>`;
    const bc = light ? "#A63A26" : "#D6B25C";
    const btn = (x, y, r) => {
      const fill = has("botones") ? bc : C;
      return (
        `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="currentColor" stroke-width="1.4"/>` +
        (has("botones") ? "" : `<circle cx="${x}" cy="${y}" r="${r}" fill="#000" fill-opacity=".22"/>`) +
        `<circle cx="${x - r * 0.28}" cy="${y}" r=".7" fill="#000" fill-opacity=".6"/><circle cx="${x + r * 0.28}" cy="${y}" r=".7" fill="#000" fill-opacity=".6"/>`
      );
    };
    const darken = (dd, op) => `<path d="${dd}" fill="#000" fill-opacity="${op}"/>`;
    const outline = (dd, w) => `<path d="${dd}" fill="none" stroke="currentColor" stroke-width="${w || 1.6}" stroke-linejoin="round" stroke-linecap="round"/>`;

    /* ---------- partes propias de cada prenda ---------- */
    let back = ""; // detrás del cuerpo
    let det = "";  // sobre el cuerpo

    if (t === "camisa") {
      const cf = has("cuello") ? cc : C;
      det += darken("M84 14 Q100 32 116 14 L100 42 Z", 0.4);
      det += line("M96 44 V224 M104 44 V224", 0.32, 1);
      [62, 90, 118, 146, 174, 200].forEach((y) => (det += btn(100, y, 3.3)));
      det += `<path d="M84 14 Q74 20 64 26 L84 54 L100 40 Z" fill="${cf}" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`;
      det += `<path d="M116 14 Q126 20 136 26 L116 54 L100 40 Z" fill="${cf}" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`;
      if (!has("cuello")) det += darken("M84 14 Q74 20 64 26 L84 54 L100 40 Z M116 14 Q126 20 136 26 L116 54 L100 40 Z", 0.1);
      det += stitch("M146 80 Q134 50 138 27 M54 80 Q66 50 62 27");
      det += stitch("M166 94 L146 80 M34 94 L54 80");
      det += stitch("M57 214 Q100 221 143 214");
      det += stitch("M173 68 L158 87 M27 68 L42 87");
    }

    if (t === "chaqueta") {
      const lf = has("cuello") ? cc : C;
      det += darken("M84 14 Q100 26 116 14 L100 70 Z", 0.4);
      det += line("M100 70 V224", 0.45, 1.3);
      [98, 126, 154, 182].forEach((y) => (det += btn(104, y, 3.6)));
      det += line("M96 74 V224", 0.18, 1);
      det += `<path d="M60 22 L84 14 L100 68 L86 76 L66 50 Z" fill="${lf}" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`;
      det += `<path d="M140 22 L116 14 L100 68 L114 76 L134 50 Z" fill="${lf}" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`;
      if (!has("cuello")) det += darken("M60 22 L84 14 L100 68 L86 76 L66 50 Z M140 22 L116 14 L100 68 L114 76 L134 50 Z", 0.12);
      if (!has("bolsillos")) det += line("M62 164 H88 M112 164 H138", 0.42, 1.4);
      det += stitch("M146 92 Q134 56 140 26 M54 92 Q66 56 60 26");
      det += stitch("M152 146 L176 150 M48 146 L24 150");
      det += stitch("M58 214 Q100 222 142 214");
    }

    if (t === "buzo") {
      back += `<path d="M64 36 Q60 4 100 4 Q140 4 136 36 Q100 62 64 36 Z" fill="${C}" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>`;
      back += `<path d="M64 36 Q60 4 100 4 Q140 4 136 36 Q100 62 64 36 Z" fill="#000" fill-opacity=".1"/>`;
      back += `<path d="M76 34 Q100 52 124 34 Q118 14 100 14 Q82 14 76 34 Z" fill="#000" fill-opacity=".42" stroke="currentColor" stroke-width="1.2"/>`;
      const eyelet = has("botones") ? bc : fg;
      det += `<path d="M93 52 Q90 72 92 92 M107 52 Q110 72 108 92" fill="none" stroke="${has("cuello") ? cc : fg}" stroke-width="2.2" stroke-linecap="round" stroke-opacity=".9"/>`;
      det += `<rect x="90.4" y="90" width="3.2" height="7" rx="1.4" fill="${eyelet}" stroke="currentColor" stroke-width=".9"/><rect x="106.4" y="90" width="3.2" height="7" rx="1.4" fill="${eyelet}" stroke="currentColor" stroke-width=".9"/>`;
      det += `<circle cx="93" cy="52" r="2" fill="${eyelet}" stroke="currentColor" stroke-width=".9"/><circle cx="107" cy="52" r="2" fill="${eyelet}" stroke="currentColor" stroke-width=".9"/>`;
      det += outline("M68 28 Q100 46 132 28", 1.8);
      if (has("cuello")) det += `<path d="M68 28 Q100 46 132 28" fill="none" stroke="${cc}" stroke-width="3.4" stroke-linecap="round"/>`;
      // pretina y puños acanalados
      det += darken("M50 208 Q100 214 150 208 L150 222 Q100 230 50 222 Z", 0.1);
      for (let x = 56; x < 150; x += 6) det += line(`M${x} 210 V226`, 0.16, 1);
      det += outline("M50 208 Q100 214 150 208", 1.2);
      det += darken("M183 156 L155 152 L156 168 L182 172 Z M17 156 L45 152 L44 168 L18 172 Z", 0.1);
      [0.25, 0.5, 0.75].forEach((f) => {
        det += line(`M${(183 - 28 * f).toFixed(1)} ${(156 - 4 * f).toFixed(1)} L${(182 - 26 * f).toFixed(1)} ${(172 - 4 * f).toFixed(1)}`, 0.16, 1);
        det += line(`M${(17 + 28 * f).toFixed(1)} ${(156 - 4 * f).toFixed(1)} L${(18 + 26 * f).toFixed(1)} ${(172 - 4 * f).toFixed(1)}`, 0.16, 1);
      });
      det += outline("M183 156 L155 152 M182 172 L156 168 M17 156 L45 152 M18 172 L44 168", 1.2);
      // bolsillo canguro
      det += `<path d="M66 146 H134 L142 196 H58 Z" fill="#000" fill-opacity=".07" stroke="${fg}" stroke-opacity=".45" stroke-width="1.4" stroke-linejoin="round"/>`;
      det += stitch("M69 150 H131 L138 192 H62 Z");
      det += line(has("bolsillos") ? "M64 150 Q56 170 60 192 M136 150 Q144 170 140 192" : "M66 150 Q62 170 63 190 M134 150 Q138 170 137 190", has("bolsillos") ? 0.7 : 0.3, has("bolsillos") ? 2.2 : 1.2);
      det += stitch("M50 110 Q58 118 60 126 M150 110 Q142 118 140 126");
    }

    if (t === "vestido") {
      det += darken("M86 14 Q100 46 114 14 Z", 0.4);
      det += outline("M86 14 Q100 46 114 14", 1.8);
      if (has("cuello")) det += `<path d="M86 14 Q100 46 114 14" fill="none" stroke="${cc}" stroke-width="3.4" stroke-linecap="round"/>`;
      det += stitch("M68 70 Q76 86 70 100 M132 70 Q124 86 130 100");
      det += `<path d="M70 100 Q100 107 130 100 L131 104 Q100 111 69 104 Z" fill="${has("cuello") ? cc : "#000"}" fill-opacity="${has("cuello") ? 1 : 0.14}" stroke="currentColor" stroke-width="1.2"/>`;
      det += line("M82 70 L88 98 M118 70 L112 98", 0.3, 1.2);
      if (has("botones")) [46, 64, 82].forEach((y) => (det += btn(100, y, 3.4)));
      det += stitch("M63 218 Q100 228 137 218");
    }

    if (t === "pantalon") {
      const wf = has("cuello") ? cc : "#000";
      det += `<path d="M55 16 H145 L146 31 H54 Z" fill="${wf}" fill-opacity="${has("cuello") ? 1 : 0.16}" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`;
      [66, 134].forEach((x) => (det += `<rect x="${x - 2}" y="13" width="4" height="13" rx="1.2" fill="${C}" stroke="currentColor" stroke-width="1.2"/>`));
      det += stitch("M100 32 V82 Q100 98 88 100");
      det += btn(100, 23, 4);
      if (!has("bolsillos")) det += line("M60 34 Q80 40 86 64 M140 34 Q120 40 114 64", 0.42, 1.4);
      det += stitch("M101 118 L106 224 M99 118 L94 224");
      det += stitch("M49 214 H92 M108 214 H151");
    }

    if (t === "falda") {
      const wf = has("cuello") ? cc : "#000";
      det += `<path d="M61 36 H139 L141 52 H59 Z" fill="${wf}" fill-opacity="${has("cuello") ? 1 : 0.16}" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>`;
      det += btn(100, 44, 4);
      det += stitch("M32 216 Q100 226 168 216");
    }

    /* ---------- detalles opcionales ---------- */
    if (has("bolsillos") && t !== "buzo") {
      const y = t === "pantalon" ? 40 : t === "falda" ? 62 : t === "vestido" ? 140 : 118;
      const x1 = t === "vestido" ? 66 : 64, x2 = t === "vestido" ? 112 : 114;
      const pk = (x) => `M${x} ${y} h24 v22 l-12 6 l-12 -6 Z`;
      det += `<path d="${pk(x1)} ${pk(x2)}" fill="#000" fill-opacity=".1" stroke="${fg}" stroke-opacity=".6" stroke-width="1.4" stroke-linejoin="round"/>`;
      det += `<path d="M${x1 + 3} ${y + 3} h18 v16 l-9 4 l-9 -4 Z M${x2 + 3} ${y + 3} h18 v16 l-9 4 l-9 -4 Z" fill="none" stroke="${fg}" stroke-opacity=".4" stroke-width="1" stroke-dasharray="2.5 2"/>`;
    }
    if (has("cuello") && t !== "camisa" && t !== "chaqueta" && t !== "buzo" && t !== "vestido" && t !== "pantalon" && t !== "falda") {
      /* sin efecto: se resuelve en cada prenda */
    }
    if (has("botones") && (t === "pantalon" || t === "falda")) {
      /* el botón de contraste ya se dibuja con la pretina */
    }
    if (has("bordado")) {
      const cx = top ? 76 : t === "vestido" ? 114 : 130;
      const cy = top ? 74 : t === "vestido" ? 164 : 150;
      det += `<g stroke="${fg}" stroke-width="2" stroke-linecap="round" fill="none"><circle cx="${cx}" cy="${cy}" r="3" fill="#D6B25C" stroke="none"/><path d="M${cx} ${cy - 6} v-7 M${cx} ${cy + 6} v7 M${cx - 6} ${cy} h-7 M${cx + 6} ${cy} h7 M${cx - 4} ${cy - 4} l-5 -5 M${cx + 4} ${cy + 4} l5 5 M${cx + 4} ${cy - 4} l5 -5 M${cx - 4} ${cy + 4} l-5 5"/></g>`;
    }
    if (has("parche")) {
      const px = top ? 66 : 70, py = top ? 156 : t === "pantalon" ? 130 : 150;
      det += `<g transform="rotate(-6 ${px + 13} ${py + 13})"><rect x="${px}" y="${py}" width="28" height="28" rx="2" fill="#A63A26" stroke="#0F0F0E" stroke-width="1.2"/><rect x="${px + 2.5}" y="${py + 2.5}" width="23" height="23" fill="none" stroke="#F3F3EE" stroke-opacity=".7" stroke-width="1" stroke-dasharray="2.5 2"/><rect x="${px + 8}" y="${py + 8}" width="12" height="12" rx="1.5" fill="#D6B25C"/></g>`;
    }

    /* ---------- frase estampada ---------- */
    let frase = "";
    if (d.frase) {
      const txt = String(d.frase).toUpperCase().replace(/[&<>"']/g, "");
      const fs = Math.max(8, Math.min(17, 150 / Math.max(6, txt.length)));
      const pos =
        t === "pantalon" ? 'x="76" y="150" transform="rotate(-90 76 150)"'
        : t === "falda" ? 'x="100" y="132"'
        : t === "vestido" ? 'x="100" y="138"'
        : t === "buzo" ? 'x="100" y="124"'
        : t === "chaqueta" ? 'x="100" y="112"'
        : 'x="100" y="108"';
      frase = `<text ${pos} text-anchor="middle" font-family="Archivo, Impact, sans-serif" font-weight="900" font-size="${fs.toFixed(1)}" letter-spacing=".5" fill="${fg}" fill-opacity=".95">${txt}</text>`;
    }

    /* ---------- pliegues ---------- */
    const F = FOLDS[t] || FOLDS.camisa;
    const folds =
      `<g filter="url(#${id}b)">` +
      F.d.map((p) => `<path d="${p}" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="3" stroke-linecap="round"/>`).join("") +
      F.l.map((p) => `<path d="${p}" fill="none" stroke="#fff" stroke-opacity=".17" stroke-width="3.4" stroke-linecap="round"/>`).join("") +
      `</g>`;

    const label = o.label === false ? "" : ` role="img" aria-label="Vista previa: ${R.nombrePrenda(d)}"`;
    return (
      `<svg viewBox="0 0 200 240" class="garment"${label} xmlns="http://www.w3.org/2000/svg"><defs>${defs}</defs>` +
      `<g transform="translate(100 120) scale(${sx} ${sy}) translate(-100 -120)">` +
      back +
      `<path d="${path}" fill="${C}" filter="url(#${id}s)"/>` +
      `<g clip-path="url(#${id}c)">${tex}` +
      `<rect x="0" y="0" width="200" height="240" fill="url(#${id}h)"/><rect x="0" y="0" width="200" height="240" fill="url(#${id}v)"/>` +
      folds +
      `<path d="${path}" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="7"/></g>` +
      `<path d="${path}" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>` +
      `${det}${frase}</g></svg>`
    );
  };
})();
