/* Retazo · vistas, rutas y acciones del prototipo funcional.
   Rutas por hash (#inicio, #disenar, ...). Cliente y artesano comparten el mismo estado (R.S). */
(function () {
  "use strict";
  const S = () => R.S;
  const root = document.getElementById("app");
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  const ICON = {
    home: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    truck: '<path d="M2 6h12v10H2zM14 10h4l3 3v3h-7z"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>',
    star: '<path d="M12 3l2.7 5.6 6.1.8-4.5 4.3 1.1 6.1L12 17l-5.4 2.8 1.1-6.1L3.2 9.4l6.1-.8z"/>',
    needle: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M8.5 8L20 19M8.5 16L20 5"/>',
    check: '<path d="M5 12l5 5 9-10"/>',
    back: '<path d="M15 5l-7 7 7 7"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16zM14 6l4 4"/>',
    copy: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
    lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    leaf: '<path d="M5 19C5 9 11 4 20 4c0 9-5 15-15 15zM5 19l8-8"/>',
  };
  const ico = (n, sz) => `<svg width="${sz || 20}" height="${sz || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[n] || ""}</svg>`;
  const stars = (n) => '<span class="stars" aria-label="' + n + ' de 5">' + "★".repeat(Math.round(n)) + "☆".repeat(5 - Math.round(n)) + "</span>";

  /* ---------- Estado de interfaz (no se guarda) ---------- */
  const UI = {
    loginTab: "in",
    heroColor: "#A63A26",
    errors: {},
    pay: { metodo: "Tarjeta", status: "idle", msg: "", v: { num: "", nombre: "", exp: "", cvv: "", tel: "", banco: "" } },
    stars: 0,
    rtags: [],
    reco: { tipo: "Retazos de tela", kg: 2, modo: "Recogida en casa", dia: 0, franja: "Mañana (8–12)" },
    confettiFor: null,
    lf: { nombre: "", email: "" },
  };

  const toast = (msg) => {
    let t = document.getElementById("toasts");
    if (!t) return;
    const d = document.createElement("div");
    d.className = "toast";
    d.textContent = msg;
    t.appendChild(d);
    setTimeout(() => d.remove(), 3200);
  };
  const go = (r) => {
    if (location.hash === "#" + r) render(true);
    else location.hash = r;
  };
  const route = () => (location.hash || "#inicio").slice(1) || "inicio";
  const badge = (e) => `<span class="badge ${e}">${e === "rechazado" ? "Rechazado" : R.ESTADOS.find((x) => x.id === e).n}</span>`;
  const mini = (o) => `<div class="mini" aria-hidden="true">${R.garment(o.diseno || o, { label: false })}</div>`;
  const initial = (s) => esc((s || "?").trim().charAt(0).toUpperCase());

  /* ---------- Piezas comunes ---------- */
  const STEPS = ["Diseño", "Artesano", "Envío", "Resumen", "Pago"];
  const STEPIDX = { disenar: 0, artesanos: 1, envio: 2, resumen: 3, pago: 4 };
  function thread(i) {
    return (
      '<div class="thread" role="list" aria-label="Pasos del pedido">' +
      STEPS.map((n, k) => (k ? `<div class="ln ${k <= i ? "done" : ""}"></div>` : "") + `<div class="st ${k < i ? "done" : k === i ? "now" : ""}" role="listitem"${k === i ? ' aria-current="step"' : ""}><div class="dot">${k < i ? ico("check", 14) : k + 1}</div><div class="lb">${n}</div></div>`).join("") +
      "</div>"
    );
  }
  const back = (to, txt) => `<a class="back" href="#${to}">${ico("back", 18)} ${txt || "Volver"}</a>`;
  const head = (t, p) => `<div class="pagehead"><h2>${t}</h2>${p ? `<p>${p}</p>` : ""}</div>`;

  function header(name) {
    const s = S();
    const art = s.role === "artesano";
    const me = R.me();
    const user = art
      ? `<span class="userchip"><span class="avatar" style="background:${me.color}">${initial(me.taller)}</span><span class="nm">${esc(me.taller)}</span></span>`
      : s.user
      ? `<button class="userchip" data-a="logout" title="Cerrar sesión"><span class="avatar" style="background:var(--sun)">${initial(s.user.name)}</span><span class="nm">${esc(s.user.name.split(" ")[0])} · Salir</span></button>`
      : `<a class="btn sm" href="#login">Ingresar</a>`;
    const nav = art
      ? ""
      : `<nav class="nav" aria-label="Principal"><a href="#inicio"${name === "inicio" ? ' aria-current="page"' : ""}>Inicio</a><a href="#disenar"${STEPIDX[name] !== undefined ? ' aria-current="page"' : ""}>Diseñar</a><a href="#pedidos"${name === "pedidos" || name === "seguimiento" ? ' aria-current="page"' : ""}>Mis pedidos</a></nav>`;
    return `<header class="hdr"><div class="wrap"><a class="brand" href="${art ? "#a-panel" : "#inicio"}"><span class="logo" aria-hidden="true"><i></i><i></i><i></i><i></i></span>Retazo</a>${nav}
      <div class="seg" role="group" aria-label="Ver como"><button data-a="role" data-v="cliente" aria-pressed="${!art}">Cliente</button><button data-a="role" data-v="artesano" aria-pressed="${art}">Artesano</button></div>${user}</div></header>`;
  }
  function footer() {
    return `<footer class="foot"><div class="wrap"><span>Retazo · prototipo funcional. Los datos son de ejemplo y quedan guardados en este navegador.</span><button class="link" data-a="reset">Reiniciar demo</button></div></footer>`;
  }

  /* ---------- Cliente: Inicio ---------- */
  function vInicio() {
    const d = Object.assign(R.defaultDraft(), { tipo: "camisa", tela: "lino", color: UI.heroColor, detalles: ["bolsillos", "botones", "parche"] });
    const sw = R.COLORES.slice(0, 6).map((c) => c[1]);
    return `<section class="hero">
      <div>
        <span class="stamp">Sin stock · solo bajo pedido</span>
        <h1 style="margin-top:20px">Tu ropa.<br>Tus reglas.<br><span class="hl">Manos reales.</span></h1>
        <p class="lead">Dibuja la prenda que ya tienes en la cabeza. Un artesano de tu ciudad la cose a tu medida, fija su propio precio y tus retazos viejos vuelven a ser tela.</p>
        <div class="row"><button class="btn primary" data-a="start">Diseña tu prenda</button><a class="btn" href="#a-panel">Soy artesano</a></div>
      </div>
      <div class="stage"><div class="bg b1"></div><div class="bg b2"></div><div class="bg b3"></div>
        <div class="paper tape" id="heroG">${R.garment(d, { label: false })}</div>
        <span class="stamp note">prueba un color</span>
        <div class="sw" role="group" aria-label="Probar un color">${sw.map((c) => `<button data-a="heroColor" data-v="${c}" style="background:${c}" aria-label="Color ${c}" aria-pressed="${c === UI.heroColor}"></button>`).join("")}</div>
      </div>
    </section>
    <h2 class="sectionhead">Así se hace una prenda en Retazo</h2>
    <div class="how">
      <div class="patch coral"><span class="n">Paso 1</span><b>Dibujas lo que imaginas</b><span>Tipo, tela, color, medidas y detalles.</span></div>
      <div class="patch sun"><span class="n">Paso 2</span><b>Eliges quién la cose</b><span>Compara calificación, precio y plazo.</span></div>
      <div class="patch mint"><span class="n">Paso 3</span><b>Sigues el pedido</b><span>Del taller a tu puerta, con guía de envío.</span></div>
      <div class="patch pink"><span class="n">Paso 4</span><b>Devuelves tus retazos</b><span>La tela sobrante se reutiliza.</span></div>
    </div>
    <div class="band two">
      <div class="card stitched"><h3>Para artesanos y sastres</h3><p class="muted">Recibes pedidos con medidas claras, fijas tu plazo y tu precio y cobras por tu oficio. Despacha con guía y recibe calificaciones.</p><p style="margin-top:14px"><a class="btn sm" href="#a-panel">Ver el panel del taller</a></p></div>
      <div class="card stitched"><h3>Producción bajo pedido</h3><p class="muted">Se confecciona solo lo que alguien pidió. Sin inventario sobrante, sin compras por impulso y con la opción de entregar tela que ya no usas.</p></div>
    </div>`;
  }

  /* ---------- Cliente: Login ---------- */
  function vLogin() {
    const e = UI.errors;
    const reg = UI.loginTab === "up";
    return `${back("inicio", "Inicio")}
    <div class="two"><div class="stack">
      ${head("Entra para diseñar tu prenda", "Con tu cuenta guardamos tus pedidos y puedes seguirlos desde cualquier celular.")}
      <div class="chips" role="tablist"><button class="chip" role="tab" aria-pressed="${!reg}" data-a="loginTab" data-v="in">Iniciar sesión</button><button class="chip" role="tab" aria-pressed="${reg}" data-a="loginTab" data-v="up">Crear cuenta</button></div>
      <form class="card stack" data-f="${reg ? "registro" : "login"}" novalidate>
        ${reg ? `<div class="field"><label for="f-nombre">Nombre completo</label><input class="input ${e.nombre ? "bad" : ""}" id="f-nombre" autocomplete="name" value="${esc(UI.lf.nombre)}"><div class="err">${e.nombre || ""}</div></div>` : ""}
        <div class="field"><label for="f-email">Correo electrónico</label><input class="input ${e.email ? "bad" : ""}" id="f-email" type="email" inputmode="email" autocomplete="email" placeholder="nombre@correo.com" value="${esc(UI.lf.email)}"><div class="err">${e.email || ""}</div></div>
        <div class="field"><label for="f-pass">Contraseña</label><input class="input ${e.pass ? "bad" : ""}" id="f-pass" type="password" autocomplete="${reg ? "new-password" : "current-password"}" placeholder="Mínimo 6 caracteres"><div class="err">${e.pass || ""}</div></div>
        <button class="btn primary block" type="submit">${reg ? "Crear cuenta y diseñar" : "Entrar y diseñar"}</button>
        <button class="btn block" type="button" data-a="google">Continuar con Google</button>
        <p class="small muted">Es una demo: cualquier correo con formato válido funciona. No se cobra nada hasta el paso de pago.</p>
      </form></div>
      <div class="side stack"><div class="patch sun"><h3>¿Eres artesano o sastre?</h3><p style="margin:6px 0 14px">Entra a tu panel para recibir pedidos, fijar tu precio y plazo y despachar con guía.</p><button class="btn sm" data-a="asArtisan">Entrar como Taller de Marta</button></div></div></div>`;
  }

  /* ---------- Cliente: Diseñador ---------- */
  const minPrecio = (d) => Math.min(...S().artisans.filter((a) => a.disponible).map((a) => R.precio(d, a)));
  function previewBox() {
    const d = S().draft;
    return `<div class="canvas" id="pvCanvas">${R.garment(d)}</div>
      <div class="meta"><div><b id="pvName">${esc(R.nombrePrenda(d))}</b><div class="small muted" id="pvDims">Pecho ${d.medidas.pecho} cm · Cintura ${d.medidas.cintura} cm · Largo ${d.medidas.largo} cm</div></div><div class="right"><div class="small muted">Desde</div><div class="price tnum" id="pvPrice">${R.cop(minPrecio(d))}</div></div></div>`;
  }
  function range(k, lb, min, max) {
    const v = S().draft.medidas[k];
    return `<div class="range"><div class="rt"><label for="m-${k}">${lb}</label><span id="mv-${k}" class="tnum">${v} cm</span></div><input type="range" id="m-${k}" min="${min}" max="${max}" value="${v}" data-in="med" data-k="${k}"></div>`;
  }
  function vDisenar() {
    const d = S().draft;
    return `${back("inicio", "Inicio")}${thread(0)}
    ${head("Diseña tu prenda", "Cambia cualquier opción y mira cómo queda. Después eliges quién la cose.")}
    <div class="designer">
      <div class="preview" id="pvBox">${previewBox()}</div>
      <div class="stack">
        <section class="opt"><h3>Prenda</h3><div class="cards">${R.PRENDAS.map((p) => `<button class="pick" data-a="pickTipo" data-v="${p.id}" aria-pressed="${d.tipo === p.id}"><b>${p.n}</b></button>`).join("")}</div></section>
        <section class="opt"><h3>Tela</h3><div class="cards">${R.TELAS.map((t) => `<button class="pick" data-a="pickTela" data-v="${t.id}" aria-pressed="${d.tela === t.id}"><b>${t.n}</b><span>${t.d}</span></button>`).join("")}</div></section>
        <section class="opt"><h3>Color</h3><div class="swatches">${R.COLORES.map((c) => `<button data-a="pickColor" data-v="${c[1]}" style="background:${c[1]}" aria-label="${c[0]}" title="${c[0]}" aria-pressed="${d.color === c[1]}"></button>`).join("")}</div></section>
        <section class="opt"><h3>Tus medidas</h3>${range("pecho", "Pecho", 80, 130)}${range("cintura", "Cintura", 60, 120)}${range("largo", "Largo", 50, 110)}</section>
        <section class="opt"><h3>Detalles</h3><div class="chips">${R.DETALLES.map((x) => `<button class="chip" data-a="toggleDet" data-v="${x.id}" aria-pressed="${d.detalles.includes(x.id)}">${x.n} <span class="muted small">+${R.cop(x.p)}</span></button>`).join("")}</div></section>
        <section class="opt field"><label for="frase">Tu frase estampada (opcional) <span class="muted small">+${R.cop(10000)}</span></label><input class="input" id="frase" maxlength="18" data-in="frase" value="${esc(d.frase)}" placeholder="Ej.: HECHO EN MI BARRIO" autocomplete="off"></section>
        <section class="opt field"><label for="nota">Notas para el artesano</label><textarea class="input" id="nota" data-in="nota" placeholder="Ej.: manga larga, que no quede ajustada.">${esc(d.nota)}</textarea></section>
      </div>
    </div>
    <div class="sticky-cta"><a class="btn primary block" href="#artesanos">Elegir quién la cose</a></div>`;
  }

  /* ---------- Cliente: Artesanos ---------- */
  function vArtesanos() {
    const s = S();
    const sorts = { rating: "Mejor calificados", precio: "Menor precio", plazo: "Más rápido" };
    const list = s.artisans.slice().sort((a, b) => (s.sort === "precio" ? R.precio(s.draft, a) - R.precio(s.draft, b) : s.sort === "plazo" ? a.plazo - b.plazo : b.rating - a.rating));
    return `${back("disenar", "Editar diseño")}${thread(1)}
    ${head("Elige quién la cose", "Cada artesano fija su precio y su plazo. Compáralos y escoge el que más te guste.")}
    <div class="minirow" style="margin-bottom:16px">${mini(s.draft)}<div style="flex:1"><b>${esc(R.nombrePrenda(s.draft))}</b><div class="small muted">Tu diseño se conserva al editarlo.</div></div><a class="btn sm" href="#disenar">${ico("edit", 16)} Editar</a></div>
    <div class="chips" style="margin-bottom:16px" role="group" aria-label="Ordenar">${Object.keys(sorts).map((k) => `<button class="chip" data-a="sort" data-v="${k}" aria-pressed="${s.sort === k}">${sorts[k]}</button>`).join("")}</div>
    <div class="artlist">${list
      .map((a) => {
        const sel = s.artisanId === a.id;
        return `<article class="card art ${sel ? "sel" : ""} ${a.disponible ? "" : "off"}">
        <div class="top"><div class="avatar" style="background:${a.color}">${initial(a.taller)}</div><div style="flex:1;min-width:0"><h3>${esc(a.taller)}</h3><div class="small muted">${esc(a.nombre)} · ${esc(a.ciudad)}</div><div class="small">${stars(a.rating)} <b>${a.rating.toFixed(1)}</b> <span class="muted">(${a.pedidos} pedidos)</span></div></div></div>
        <div class="chips">${a.tags.map((t) => `<span class="badge">${esc(t)}</span>`).join("")}${a.retazos ? '<span class="badge entregado">Recibe retazos</span>' : ""}</div>
        <div class="row sp"><div><div class="price tnum">${R.cop(R.precio(s.draft, a))}</div><div class="small muted">Plazo: ${a.plazo} días + envío</div></div>
        ${a.disponible ? `<button class="btn ${sel ? "" : "primary"}" data-a="pickArt" data-id="${a.id}">${sel ? "Elegido · continuar" : "Elegir"}</button>` : '<span class="badge">Sin cupo ahora</span>'}</div></article>`;
      })
      .join("")}</div>`;
  }

  /* ---------- Cliente: Envío ---------- */
  function vEnvio() {
    const a = S().address;
    const e = UI.errors;
    const f = (id, lb, ph, extra) => `<div class="field"><label for="e-${id}">${lb}</label><input class="input ${e[id] ? "bad" : ""}" id="e-${id}" value="${esc(a[id])}" placeholder="${ph || ""}" ${extra || ""}><div class="err">${e[id] || ""}</div></div>`;
    return `${back("artesanos", "Cambiar artesano")}${thread(2)}
    ${head("¿Dónde la recibes?", "Solo pedimos lo necesario para que llegue a tu puerta.")}
    <form class="card stack" data-f="envio" novalidate style="max-width:640px">
      ${f("nombre", "Nombre de quien recibe", "Como aparece en tu documento", 'autocomplete="name"')}
      ${f("celular", "Celular", "3001234567", 'inputmode="numeric" maxlength="10" autocomplete="tel"')}
      <div class="grid2 stack"><div class="field"><label for="e-ciudad">Ciudad</label><select class="input" id="e-ciudad">${R.CIUDADES.map((c) => `<option${a.ciudad === c ? " selected" : ""}>${c}</option>`).join("")}</select></div>${f("barrio", "Barrio", "Ej.: Chapinero")}</div>
      ${f("direccion", "Dirección", "Cra 13 # 54-20, apto 301", 'autocomplete="street-address"')}
      <div class="field"><label for="e-indicaciones">Indicaciones (opcional)</label><input class="input" id="e-indicaciones" value="${esc(a.indicaciones)}" placeholder="Portería, torre, referencia"></div>
      <button class="btn primary block" type="submit">Revisar mi pedido</button>
    </form>`;
  }

  /* ---------- Cliente: Resumen ---------- */
  function vResumen() {
    const s = S();
    const art = R.artisan(s.artisanId);
    const precio = R.precio(s.draft, art);
    const desc = s.retazos.on ? R.DESC_RETAZOS : 0;
    const total = precio + R.ENVIO - desc;
    const a = s.address;
    return `${back("envio", "Editar dirección")}${thread(3)}
    ${head("Revisa tu pedido", "Todavía no se cobra nada. El pago es el siguiente paso.")}
    <div class="two"><div class="stack">
      <section class="card"><div class="row sp"><h3>Tu prenda</h3><a class="btn sm" href="#disenar">${ico("edit", 16)} Editar diseño</a></div>
        <div class="minirow" style="margin-top:12px">${mini(s.draft)}<div style="flex:1;min-width:0"><b>${esc(R.nombrePrenda(s.draft))}</b><div class="small muted">Pecho ${s.draft.medidas.pecho} · Cintura ${s.draft.medidas.cintura} · Largo ${s.draft.medidas.largo} cm</div><div class="small muted">${R.detallesTxt(s.draft).join(", ") || "Sin detalles extra"}</div></div></div>
        ${s.draft.nota ? `<p class="small" style="margin-top:10px"><b>Nota:</b> ${esc(s.draft.nota)}</p>` : ""}</section>
      <section class="card"><div class="row sp"><h3>Artesano</h3><a class="btn sm" href="#artesanos">Cambiar</a></div>
        <div class="row" style="margin-top:12px"><div class="avatar" style="background:${art.color};width:44px;height:44px;border-radius:14px">${initial(art.taller)}</div><div><b>${esc(art.taller)}</b><div class="small muted">${stars(art.rating)} ${art.rating.toFixed(1)} · plazo ${art.plazo} días</div></div></div></section>
      <section class="card"><div class="row sp"><h3>Dirección</h3><a class="btn sm" href="#envio">${ico("edit", 16)} Editar dirección</a></div>
        <p style="margin-top:10px">${esc(a.nombre)} · ${esc(a.celular)}<br>${esc(a.direccion)}, ${esc(a.barrio)}, ${esc(a.ciudad)}${a.indicaciones ? `<br><span class="muted small">${esc(a.indicaciones)}</span>` : ""}</p></section>
      <section class="card stitched"><label class="switch"><input type="checkbox" id="retOn" data-ch="retazos" ${s.retazos.on ? "checked" : ""}><span><b>Quiero entregar retazos o ropa vieja</b><br><span class="muted small">Recibes ${R.cop(R.DESC_RETAZOS)} de descuento y la tela se reutiliza. Es opcional y puedes programar la entrega después, desde tu seguimiento.</span></span></label>
        ${s.retazos.on ? `<div class="grid2 stack" style="margin-top:14px"><div class="field"><label for="retTipo">¿Qué entregarás?</label><select class="input" id="retTipo" data-ch="retTipo">${["Retazos de tela", "Ropa vieja", "Ambos"].map((t) => `<option${s.retazos.tipo === t ? " selected" : ""}>${t}</option>`).join("")}</select></div><div class="field"><span class="lbl">Cantidad aproximada</span><div class="stepper"><button type="button" data-a="retKg" data-v="-1" aria-label="Menos">−</button><output>${s.retazos.kg} kg</output><button type="button" data-a="retKg" data-v="1" aria-label="Más">+</button></div></div></div>` : ""}</section>
    </div>
    <aside class="side card pop stack"><h3>Resumen</h3>
      <div><div class="line"><span>${esc(R.nombrePrenda(s.draft))}</span><span class="tnum">${R.cop(precio)}</span></div><div class="line"><span>Envío</span><span class="tnum">${R.cop(R.ENVIO)}</span></div>${desc ? `<div class="line disc"><span>Descuento por retazos</span><span class="tnum">− ${R.cop(desc)}</span></div>` : ""}<div class="line total"><span>Total</span><span class="tnum">${R.cop(total)}</span></div></div>
      <label class="check"><input type="checkbox" id="terms" data-ch="terms" ${s.terms ? "checked" : ""}><span class="small">Entiendo que el artesano debe aceptar el pedido. Si lo rechaza, me devuelven el pago completo.</span></label>
      <div class="err">${UI.errors.terms || ""}</div>
      <button class="btn primary block" data-a="confirm">Confirmar pedido</button><p class="small muted" style="text-align:center">Todavía no se cobra nada</p></aside></div>`;
  }

  /* ---------- Cliente: Pago ---------- */
  function vPago() {
    const s = S();
    const art = R.artisan(s.artisanId);
    const total = R.precio(s.draft, art) + R.ENVIO - (s.retazos.on ? R.DESC_RETAZOS : 0);
    const p = UI.pay;
    const e = UI.errors;
    const v = p.v;
    const loading = p.status === "loading";
    const fld = (id, lb, ph, val, extra) => `<div class="field"><label for="p-${id}">${lb}</label><input class="input ${e[id] ? "bad" : ""}" id="p-${id}" data-in="pf" data-k="${id}" value="${esc(val)}" placeholder="${ph}" ${extra || ""}><div class="err">${e[id] || ""}</div></div>`;
    let form = "";
    if (p.metodo === "Tarjeta") {
      form = `<div class="cardviz" aria-hidden="true"><div class="cr"><span>Retazo Pay</span><span>Débito / crédito</span></div><div class="cn" id="cvN">${esc(v.num || "•••• •••• •••• ••••")}</div><div class="cr"><span id="cvName">${esc(v.nombre || "Nombre en la tarjeta")}</span><span id="cvExp">${esc(v.exp || "MM/AA")}</span></div></div>
        ${fld("num", "Número de tarjeta", "4242 4242 4242 4242", v.num, 'inputmode="numeric" autocomplete="cc-number" maxlength="19"')}
        ${fld("nombre", "Nombre en la tarjeta", "Como aparece en la tarjeta", v.nombre, 'autocomplete="cc-name"')}
        <div class="grid2">${fld("exp", "Vence", "MM/AA", v.exp, 'inputmode="numeric" autocomplete="cc-exp" maxlength="5"')}${fld("cvv", "Código (CVV)", "123", v.cvv, 'inputmode="numeric" autocomplete="cc-csc" maxlength="4"')}</div>
        <p class="small muted row" style="gap:6px">${ico("lock", 16)} Pago seguro. Retazo no guarda el código CVV.</p>`;
    } else if (p.metodo === "PSE") {
      form = `<div class="field"><label for="p-banco">Banco</label><select class="input ${e.banco ? "bad" : ""}" id="p-banco" data-in="pf" data-k="banco"><option value="">Elige tu banco</option>${R.BANCOS.map((b) => `<option${v.banco === b ? " selected" : ""}>${b}</option>`).join("")}</select><div class="err">${e.banco || ""}</div></div>`;
    } else {
      form = fld("tel", "Celular con Nequi", "3001234567", v.tel, 'inputmode="numeric" maxlength="10"');
    }
    const bad =
      p.status === "error"
        ? `<div class="alert bad" role="alert"><b>No pudimos procesar el pago</b><span>${esc(p.msg)}</span><div class="row"><button class="btn primary sm" type="button" data-a="payRetry">Intentar de nuevo</button><button class="btn sm" type="button" data-a="payChange">Usar otro método</button><a class="btn sm flat" href="#resumen">Volver al resumen</a></div></div>`
        : "";
    return `${back("resumen", "Volver al resumen")}${thread(4)}
    ${head("Pago", "Inscribe tu método de pago. El dinero queda retenido hasta que el artesano acepte tu pedido.")}
    <div class="two"><form class="card stack" data-f="pago" novalidate>
      <div class="methods" role="group" aria-label="Método de pago">${["Tarjeta", "PSE", "Nequi"].map((m) => `<button type="button" class="pick" data-a="payMethod" data-v="${m}" aria-pressed="${p.metodo === m}" style="text-align:center"><b>${m}</b></button>`).join("")}</div>
      ${form}${bad}
      ${p.metodo === "Tarjeta" ? '<div class="alert info small">Demo: usa <b>4242 4242 4242 4242</b> para aprobar o un número que empiece por <b>0000</b> para ver un pago rechazado.</div>' : ""}
      <button class="btn primary block" type="submit" ${loading ? "disabled" : ""}>${loading ? '<span class="spinner"></span> Procesando…' : "Pagar " + R.cop(total)}</button>
    </form>
    <aside class="side card stack"><h3>Total a pagar</h3><div class="price tnum">${R.cop(total)}</div><p class="small muted">${esc(R.nombrePrenda(s.draft))} · ${esc(art.taller)}</p></aside></div>`;
  }

  /* ---------- Cliente: Recibo ---------- */
  function vRecibo() {
    const o = R.order(S().lastOrderId);
    if (!o) return empty("Aún no tienes un recibo", "Cuando pagues un pedido aparecerá aquí.", "Diseñar una prenda", "disenar");
    const art = R.artisan(o.artesanoId);
    return `<div class="stack" style="max-width:560px;margin-inline:auto"><div style="text-align:center;display:grid;gap:10px"><div class="okmark"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></div><h2>¡Pedido confirmado!</h2><p class="muted">Te enviamos este recibo a tu correo.</p></div>
    <div class="receipt"><span class="stamp paid">PAGADO</span><div class="line"><span class="muted">Pedido</span><b>#${o.id}</b></div><div class="line"><span class="muted">Fecha</span><span>${R.fechaLarga(o.ts)}</span></div><hr>
      <div class="line"><span>${esc(R.nombrePrenda(o.diseno))}</span><span class="tnum">${R.cop(o.precio)}</span></div><div class="small muted">Confecciona: ${esc(art.taller)}${o.retazos.on ? " · retazos por entregar" : ""}</div>
      <div class="line"><span>Envío</span><span class="tnum">${R.cop(o.envio)}</span></div>${o.desc ? `<div class="line disc"><span>Descuento por retazos</span><span class="tnum">− ${R.cop(o.desc)}</span></div>` : ""}
      <div class="line total"><span>Total pagado</span><span class="tnum">${R.cop(o.total)}</span></div><hr>
      <div class="small"><span class="muted">Pagado con:</span> ${o.pago.metodo} ${o.pago.ultimos ? "•••• " + o.pago.ultimos : ""}</div>
      <div class="small"><span class="muted">Entrega en:</span> ${esc(o.direccion)}, ${esc(o.barrio)}, ${esc(o.ciudad)}</div>
      <div class="small"><span class="muted">Entrega estimada:</span> ${R.fecha(R.entrega(o))}</div></div>
    <a class="btn primary block" href="#seguimiento" data-a="openC" data-id="${o.id}" data-nav>Ver mi pedido</a>
    <button class="btn block" data-a="copy" data-v="${o.id}">${ico("copy", 18)} Copiar número de pedido</button></div>`;
  }

  /* ---------- Cliente: Seguimiento ---------- */
  function guideEvents(o) {
    const g = o.guia;
    const ev = [`Guía generada · ${R.fecha(g.ts)}`];
    if (o.estado === "camino" || o.estado === "entregado") ev.push("Recogido en el taller", "En ruta hacia " + o.ciudad);
    if (o.estado === "entregado") ev.push("Entregado al cliente");
    return ev;
  }
  function vSeguimiento() {
    const s = S();
    const o = R.order(s.currentOrderId) || R.myOrders()[0];
    if (!o) return empty("Aún no tienes pedidos", "Diseña tu primera prenda y aquí verás cómo avanza.", "Diseñar una prenda", "disenar");
    const art = R.artisan(o.artesanoId);
    const idx = o.estado === "rechazado" ? -1 : R.ESTADOS.findIndex((x) => x.id === o.estado);
    const when = (id) => {
      const h = o.hist.find((x) => x.e === id);
      return h ? R.fecha(h.t) : "";
    };
    const tl = R.ESTADOS.map((e, k) => `<li class="${k < idx || (k === idx && e.id === "entregado") ? "done" : k === idx ? "now" : ""}"><div class="pt">${k < idx || (k === idx && e.id === "entregado") ? ico("check", 16) : k + 1}</div><div><div class="tt">${e.n} ${when(e.id) ? `<span class="muted small">· ${when(e.id)}</span>` : ""}</div><div class="small muted">${e.d}</div></div></li>`).join("");
    const rev = o.review
      ? `<div class="card"><h3>Tu calificación</h3><p>${stars(o.review.stars)}</p><p class="muted">${esc(o.review.texto)}</p>${o.review.resp ? `<p class="small" style="margin-top:8px"><b>${esc(art.taller)}:</b> ${esc(o.review.resp)}</p>` : ""}</div>`
      : o.estado === "entregado"
      ? `<form class="card stack" data-f="review" novalidate><h3>¿Cómo te quedó?</h3><div class="starpick" role="radiogroup" aria-label="Calificación">${[1, 2, 3, 4, 5].map((n) => `<button type="button" role="radio" aria-checked="${UI.stars === n}" class="${UI.stars >= n ? "on" : ""}" data-a="star" data-v="${n}" aria-label="${n} estrellas">★</button>`).join("")}</div>
        <div class="chips">${["Calce perfecto", "Buen acabado", "Puntual", "Buena comunicación"].map((t) => `<button type="button" class="chip" data-a="rtag" data-v="${t}" aria-pressed="${UI.rtags.includes(t)}">${t}</button>`).join("")}</div>
        <div class="field"><label for="rv-texto">Cuéntale al artesano</label><textarea class="input" id="rv-texto" placeholder="Qué te gustó y qué mejorarías"></textarea></div><div class="err">${UI.errors.review || ""}</div>
        <button class="btn primary" type="submit">Enviar calificación</button></form>`
      : "";
    const ret =
      o.retazos && o.retazos.on
        ? o.retazos.programado
          ? `<div class="card stitched"><h3>Retazos programados</h3><p class="muted">${esc(o.retazos.programado.tipo)} · ${o.retazos.programado.kg} kg · ${esc(o.retazos.programado.modo)}<br>${R.fechaLarga(o.retazos.programado.ts)} · ${esc(o.retazos.programado.franja)}</p></div>`
          : `<div class="card stitched"><h3>Tienes retazos por entregar</h3><p class="muted">Elegiste entregar ${esc(o.retazos.tipo.toLowerCase())}. Programa cuándo, cuando te quede bien. No es obligatorio hacerlo ahora.</p><p style="margin-top:12px"><a class="btn sm" href="#recoleccion" data-a="openC" data-id="${o.id}" data-nav>Programar entrega</a></p></div>`
        : "";
    const g = o.guia
      ? `<div class="card guide"><h3>Guía de envío</h3><div class="muted small">${esc(o.guia.empresa)}</div><div class="no tnum">${esc(o.guia.numero)}</div><ul class="small" style="margin:0;padding-left:18px">${guideEvents(o).map((x) => `<li>${esc(x)}</li>`).join("")}</ul><div><button class="btn sm" data-a="copy" data-v="${esc(o.guia.numero)}">${ico("copy", 16)} Copiar guía</button></div></div>`
      : o.estado === "rechazado"
      ? ""
      : `<div class="card stitched"><h3>Guía de envío</h3><p class="muted">Aparecerá aquí cuando el artesano despache tu prenda.</p></div>`;
    return `${back("pedidos", "Mis pedidos")}
    <div class="row sp" style="margin-bottom:18px"><div><h2>Pedido ${o.id}</h2><p class="muted">${esc(R.nombrePrenda(o.diseno))} · ${esc(art.taller)}</p></div>${badge(o.estado)}</div>
    <div class="two"><div class="stack">
      <section class="card"><h3 style="margin-bottom:16px">Dónde va tu pedido</h3>${o.estado === "rechazado" ? '<p>El artesano no pudo tomar este pedido. Te devolvimos el pago completo.</p>' : `<ol class="tl">${tl}</ol>`}<p class="small muted" style="margin-top:16px">Entrega estimada: <b>${R.fechaLarga(R.entrega(o))}</b></p></section>
      ${rev}${ret}</div>
      <aside class="side stack">${g}
        <div class="card"><div class="row"><div class="avatar" style="background:${art.color};width:44px;height:44px;border-radius:14px">${initial(art.taller)}</div><div><b>${esc(art.taller)}</b><div class="small muted">${stars(art.rating)} ${art.rating.toFixed(1)} · ${esc(art.ciudad)}</div></div></div><div class="line total" style="font-size:1.1rem"><span>Total pagado</span><span class="tnum">${R.cop(o.total)}</span></div></div>
        ${o.estado !== "entregado" && o.estado !== "rechazado" ? `<div class="alert info small"><b>Prueba el otro lado</b>Cambia a modo artesano para aceptar el pedido y ver cómo se actualiza aquí.<div><button class="btn sm" data-a="demoArtisan" data-id="${o.id}">Abrir este pedido como artesano</button></div></div>` : ""}</aside></div>`;
  }

  /* ---------- Cliente: Recolección ---------- */
  function vRecoleccion() {
    const s = S();
    const o = R.order(s.currentOrderId) || R.myOrders()[0];
    const r = UI.reco;
    const days = [1, 2, 3, 4, 5].map((n) => {
      const t = new Date();
      t.setDate(t.getDate() + n);
      t.setHours(12, 0, 0, 0);
      return t.getTime();
    });
    return `${back("seguimiento", "Volver al seguimiento")}
    ${head("Entrega tus retazos", "Opcional. La tela que ya no usas vuelve al taller para convertirse en prendas nuevas.")}
    <form class="card stack" data-f="reco" style="max-width:640px" novalidate>
      <div class="field"><label for="rc-tipo">¿Qué entregas?</label><select class="input" id="rc-tipo" data-ch="rcTipo">${["Retazos de tela", "Ropa vieja", "Ambos"].map((t) => `<option${r.tipo === t ? " selected" : ""}>${t}</option>`).join("")}</select></div>
      <div class="field"><span class="lbl">Cantidad aproximada</span><div class="stepper"><button type="button" data-a="rcKg" data-v="-1" aria-label="Menos">−</button><output>${r.kg} kg</output><button type="button" data-a="rcKg" data-v="1" aria-label="Más">+</button></div></div>
      <div class="field"><span class="lbl">¿Cómo la entregas?</span><div class="chips">${["Recogida en casa", "La llevo a un punto"].map((m) => `<button type="button" class="chip" data-a="rcModo" data-v="${m}" aria-pressed="${r.modo === m}">${m}</button>`).join("")}</div></div>
      <div class="field"><span class="lbl">Día</span><div class="chips">${days.map((t, i) => `<button type="button" class="chip" data-a="rcDia" data-v="${i}" aria-pressed="${r.dia === i}">${new Date(t).toLocaleDateString("es-CO", { weekday: "short", day: "numeric" })}</button>`).join("")}</div></div>
      <div class="field"><label for="rc-fr">Franja</label><select class="input" id="rc-fr" data-ch="rcFr">${["Mañana (8–12)", "Tarde (2–6)"].map((t) => `<option${r.franja === t ? " selected" : ""}>${t}</option>`).join("")}</select></div>
      <div class="row"><button class="btn primary" type="submit">Programar entrega</button><a class="btn flat" href="#seguimiento">Ahora no</a></div>
    </form>`;
  }

  /* ---------- Cliente: Mis pedidos ---------- */
  function orderRow(o, kind) {
    const href = kind === "a" ? "#a-pedido" : "#seguimiento";
    const who = kind === "a" ? esc(o.cliente) : esc(R.artisan(o.artesanoId).taller);
    return `<a class="ord" href="${href}" data-a="${kind === "a" ? "openA" : "openC"}" data-id="${o.id}" data-nav>${mini(o)}<div><div class="t">${esc(R.nombrePrenda(o.diseno))}</div><div class="small muted">#${o.id} · ${R.fecha(o.ts)} · ${who}</div></div><div style="text-align:right">${badge(o.estado)}<div class="small tnum" style="margin-top:4px;font-weight:700">${R.cop(kind === "a" ? o.precio : o.total)}</div></div></a>`;
  }
  function empty(t, p, btn, to) {
    return `<div class="empty"><h3>${t}</h3><p class="muted">${p}</p>${btn ? `<a class="btn primary" href="#${to}">${btn}</a>` : ""}</div>`;
  }
  function vPedidos() {
    const l = R.myOrders();
    return `${head("Mis pedidos", "Toca un pedido para ver su seguimiento y su guía de envío.")}<div class="stack">${l.length ? l.map((o) => orderRow(o, "c")).join("") : empty("Aún no tienes pedidos", "Diseña tu primera prenda y aparecerá aquí.", "Diseñar una prenda", "disenar")}</div>`;
  }

  /* ---------- Artesano ---------- */
  const ANAV = [
    ["a-panel", "Panel", "home"],
    ["a-pedidos", "Pedidos", "list"],
    ["a-guias", "Guías", "truck"],
    ["a-resenas", "Reseñas", "star"],
    ["a-taller", "Mi taller", "needle"],
  ];
  function ashell(name, inner) {
    const links = (cls) => ANAV.map(([r, n, i]) => `<a href="#${r}"${name === r || (name === "a-pedido" && r === "a-pedidos") ? ' aria-current="page"' : ""}>${ico(i, cls ? 22 : 20)}<span>${n}</span></a>`).join("");
    return `<div class="ashell"><nav class="anav" aria-label="Taller">${links(0)}</nav><div class="view-a">${inner}</div></div><nav class="atabs" aria-label="Taller">${links(1)}</nav>`;
  }
  const DAY = 864e5;
  function vAPanel() {
    const me = R.me();
    const os = R.artisanOrders();
    const nuevos = os.filter((o) => o.estado === "recibido");
    const proceso = os.filter((o) => ["aceptado", "confeccionando", "camino"].includes(o.estado));
    const rev = os.filter((o) => o.review);
    const ingresos = os.filter((o) => o.estado === "entregado" && Date.now() - o.hist[o.hist.length - 1].t < 30 * DAY).reduce((s, o) => s + o.precio, 0);
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const days = [...Array(7)].map((_, i) => new Date(start.getTime() + i * DAY));
    const due = proceso.map((o) => R.entrega(o));
    return `<div class="stack">
      ${head("Hola, " + esc(me.nombre.split(" ")[0]), "Esto es lo que pasa hoy en " + esc(me.taller) + ".")}
      <div class="tiles"><div class="tile" style="background:var(--sun)"><b>${nuevos.length}</b><span>Pedidos nuevos</span></div><div class="tile" style="background:var(--coral)"><b>${proceso.length}</b><span>En proceso</span></div><div class="tile" style="background:var(--mint)"><b class="tnum" style="font-size:1.4rem">${R.cop(ingresos).replace("$ ", "$")}</b><span>Ingresos del mes</span></div><div class="tile" style="background:var(--pink)"><b>${me.rating.toFixed(1)}</b><span>${rev.length} reseñas nuevas</span></div></div>
      <section class="stack"><h3>Pedidos nuevos</h3>${nuevos.length ? nuevos.map(newOrderCard).join("") : empty("No tienes pedidos nuevos", "Cuando un cliente te elija, aparecerá aquí.")}</section>
      <section class="card"><h3 style="margin-bottom:12px">Entregas de esta semana</h3><div class="week">${days.map((d, i) => `<div class="${due.some((t) => new Date(t).toDateString() === d.toDateString()) ? "hasd" : ""} ${i === 0 ? "today" : ""}"><span>${d.toLocaleDateString("es-CO", { weekday: "short" }).replace(".", "")}</span><b>${d.getDate()}</b></div>`).join("")}</div></section>
    </div>`;
  }
  function newOrderCard(o) {
    const me = R.me();
    return `<article class="card pop neworder"><div class="pv">${R.garment(o.diseno, { label: false })}</div><div class="stack" style="gap:10px"><div class="row sp"><div><b>${esc(R.nombrePrenda(o.diseno))}</b><div class="small muted">#${o.id} · ${esc(o.cliente)} · ${esc(o.ciudad)}</div></div><span class="price tnum">${R.cop(o.precio)}</span></div>
      <div class="small">Pecho ${o.diseno.medidas.pecho} · Cintura ${o.diseno.medidas.cintura} · Largo ${o.diseno.medidas.largo} cm${R.detallesTxt(o.diseno).length ? " · " + R.detallesTxt(o.diseno).join(", ") : ""}</div>
      ${o.diseno.nota ? `<div class="small"><b>Nota:</b> ${esc(o.diseno.nota)}</div>` : ""}${o.retazos.on ? `<div class="badge entregado">Entregará ${esc(o.retazos.tipo.toLowerCase())} (${o.retazos.kg} kg)</div>` : ""}
      <div class="row"><div class="field" style="width:130px"><label for="pz-${o.id}">Tu plazo (días)</label><input class="input" id="pz-${o.id}" type="number" min="1" max="30" value="${me.plazo}"></div><div class="row" style="margin-top:22px"><button class="btn primary" data-a="aceptar" data-id="${o.id}">Aceptar pedido</button><button class="btn danger sm" data-a="rechazar" data-id="${o.id}">Rechazar</button></div></div></div></article>`;
  }
  function vAPedidos() {
    const s = S();
    const f = s.afilter;
    const all = R.artisanOrders();
    const tabs = [["todos", "Todos"], ...R.ESTADOS.map((e) => [e.id, e.n])];
    const list = all.filter((o) => f === "todos" || o.estado === f);
    return `${head("Pedidos", "Todos los pedidos de tu taller, del más reciente al más antiguo.")}
    <div class="tabs" role="group" aria-label="Filtrar" style="margin-bottom:16px">${tabs.map(([id, n]) => `<button class="chip" data-a="afilter" data-v="${id}" aria-pressed="${f === id}">${n} <span class="small">${id === "todos" ? all.length : all.filter((o) => o.estado === id).length}</span></button>`).join("")}</div>
    <div class="stack">${list.length ? list.map((o) => orderRow(o, "a")).join("") : empty("No hay pedidos en este estado", "Cuando avances un pedido aparecerá aquí.")}</div>`;
  }
  function vAPedido() {
    const s = S();
    const o = R.order(s.aOrderId) || R.artisanOrders()[0];
    if (!o) return empty("No hay un pedido abierto", "", "Ir a pedidos", "a-pedidos");
    const e = UI.errors;
    let action = "";
    if (o.estado === "recibido") action = `<div class="row"><div class="field" style="width:130px"><label for="pz-${o.id}">Tu plazo (días)</label><input class="input" id="pz-${o.id}" type="number" min="1" max="30" value="${R.me().plazo}"></div><div class="row" style="margin-top:22px"><button class="btn primary" data-a="aceptar" data-id="${o.id}">Aceptar pedido</button><button class="btn danger sm" data-a="rechazar" data-id="${o.id}">Rechazar</button></div></div>`;
    else if (o.estado === "aceptado") action = `<button class="btn primary" data-a="avanzar" data-id="${o.id}" data-v="confeccionando">Empezar a confeccionar</button>`;
    else if (o.estado === "confeccionando")
      action = `<form class="stack" data-f="guia" data-id="${o.id}" novalidate><p class="muted small">Cuando la prenda esté lista, despáchala con una guía para que el cliente la rastree.</p><div class="field"><label for="g-emp">Transportadora</label><select class="input" id="g-emp">${R.EMPRESAS.map((x) => `<option>${x}</option>`).join("")}</select></div><div class="field"><label for="g-num">Número de guía</label><div class="row" style="flex-wrap:nowrap"><input class="input ${e.guia ? "bad" : ""}" id="g-num" inputmode="numeric" maxlength="12" placeholder="Ej.: 2208841733"><button class="btn sm" type="button" data-a="genGuia">Generar</button></div><div class="err">${e.guia || ""}</div></div><button class="btn primary" type="submit">Despachar con guía</button></form>`;
    else if (o.estado === "camino") action = `<button class="btn primary" data-a="avanzar" data-id="${o.id}" data-v="entregado">Marcar como entregado</button>`;
    const g = o.guia ? `<div class="card guide"><h3>Guía de envío</h3><div class="muted small">${esc(o.guia.empresa)}</div><div class="no tnum">${esc(o.guia.numero)}</div><ul class="small" style="margin:0;padding-left:18px">${guideEvents(o).map((x) => `<li>${esc(x)}</li>`).join("")}</ul></div>` : "";
    return `${back("a-pedidos", "Pedidos")}
    <div class="row sp" style="margin-bottom:16px"><div><h2>Pedido ${o.id}</h2><p class="muted">${esc(o.cliente)} · ${esc(o.ciudad)}</p></div>${badge(o.estado)}</div>
    <div class="two"><div class="stack">
      <section class="card neworder"><div class="pv">${R.garment(o.diseno, { label: false })}</div><div class="stack" style="gap:8px"><b>${esc(R.nombrePrenda(o.diseno))}</b><div class="small">Pecho ${o.diseno.medidas.pecho} · Cintura ${o.diseno.medidas.cintura} · Largo ${o.diseno.medidas.largo} cm</div><div class="small">${R.detallesTxt(o.diseno).join(", ") || "Sin detalles extra"}</div>${o.diseno.nota ? `<div class="small"><b>Nota:</b> ${esc(o.diseno.nota)}</div>` : ""}${o.retazos.on ? `<span class="badge entregado">Retazos: ${esc(o.retazos.tipo)} · ${o.retazos.kg} kg${o.retazos.programado ? " · programado" : ""}</span>` : ""}<div class="small muted">Entrega en ${esc(o.direccion)}, ${esc(o.barrio)}, ${esc(o.ciudad)}</div><div class="price tnum">${R.cop(o.precio)}</div></div></section>
      ${action ? `<section class="card pop stack"><h3>Siguiente paso</h3>${action}</section>` : ""}
      ${o.review ? `<section class="card"><h3>Calificación del cliente</h3><p>${stars(o.review.stars)}</p><p class="muted">${esc(o.review.texto)}</p></section>` : ""}</div>
      <aside class="side stack">${g}<div class="card"><h3 style="margin-bottom:12px">Historial</h3><ol class="tl">${o.hist.map((h) => `<li class="done"><div class="pt">${ico("check", 14)}</div><div><div class="tt">${R.ESTADOS.find((x) => x.id === h.e) ? R.ESTADOS.find((x) => x.id === h.e).n : "Rechazado"}</div><div class="small muted">${R.fecha(h.t)}</div></div></li>`).join("")}</ol></div>
      <div class="alert info small">El cliente ve estos cambios al instante en su seguimiento.</div></aside></div>`;
  }
  function vAGuias() {
    const os = R.artisanOrders().filter((o) => o.estado !== "recibido" && o.estado !== "rechazado");
    const pend = os.filter((o) => !o.guia);
    const con = os.filter((o) => o.guia);
    return `${head("Guías de envío", "Despacha con guía y sigue cada envío.")}<div class="stack">
      <section class="stack"><h3>Por despachar</h3>${pend.length ? pend.map((o) => `<div class="card gline"><div><b>${esc(R.nombrePrenda(o.diseno))}</b><div class="small muted">#${o.id} · ${esc(o.cliente)} · ${esc(o.ciudad)}</div></div><a class="btn sm primary" href="#a-pedido" data-a="openA" data-id="${o.id}" data-nav>${o.estado === "confeccionando" ? "Crear guía" : "Ver pedido"}</a></div>`).join("") : '<p class="muted">Todo está despachado.</p>'}</section>
      <section class="stack"><h3>Con guía</h3>${con.length ? con.map((o) => `<div class="card gline"><div><b class="tnum">${esc(o.guia.numero)}</b><div class="small muted">${esc(o.guia.empresa)} · #${o.id} · ${esc(o.ciudad)}</div></div><div class="row">${badge(o.estado)}<button class="btn sm" data-a="copy" data-v="${esc(o.guia.numero)}" aria-label="Copiar guía">${ico("copy", 16)}</button></div></div>`).join("") : '<p class="muted">Aún no hay guías.</p>'}</section></div>`;
  }
  function vAResenas() {
    const os = R.artisanOrders().filter((o) => o.review);
    const me = R.me();
    const cnt = [5, 4, 3, 2, 1].map((n) => os.filter((o) => Math.round(o.review.stars) === n).length);
    const max = Math.max(1, ...cnt);
    return `${head("Reseñas", "Lo que dicen tus clientes. Puedes responder a cada una.")}
    <div class="two"><div class="stack">${os.length ? os.sort((a, b) => b.review.ts - a.review.ts).map((o) => `<article class="card stack" style="gap:8px"><div class="row sp"><div>${stars(o.review.stars)}<div class="small muted">${esc(o.cliente)} · ${esc(R.nombrePrenda(o.diseno))} · ${R.fecha(o.review.ts)}</div></div></div><p>${esc(o.review.texto)}</p>${o.review.tags && o.review.tags.length ? `<div class="chips">${o.review.tags.map((t) => `<span class="badge">${esc(t)}</span>`).join("")}</div>` : ""}
      ${o.review.resp ? `<div class="minirow"><div><b class="small">Tu respuesta</b><div class="small">${esc(o.review.resp)}</div></div></div>` : `<div class="row" style="flex-wrap:nowrap"><input class="input" id="rp-${o.id}" placeholder="Escribe una respuesta" aria-label="Responder a ${esc(o.cliente)}"><button class="btn sm primary" data-a="reply" data-id="${o.id}">Responder</button></div>`}</article>`).join("") : empty("Aún no tienes reseñas", "Cuando entregues un pedido, tu cliente podrá calificarlo.")}</div>
    <aside class="side card stack"><div class="big-rate tnum">${me.rating.toFixed(1)}</div>${stars(me.rating)}<div class="small muted">${me.pedidos} pedidos completados</div><div class="bars">${[5, 4, 3, 2, 1].map((n, i) => `<div class="br"><span>${n}★</span><div class="bar"><i style="width:${(cnt[i] / max) * 100}%"></i></div><span class="tnum">${cnt[i]}</span></div>`).join("")}</div></aside></div>`;
  }
  function vATaller() {
    const me = R.me();
    const demo = { tipo: "camisa", tela: "lino", detalles: ["bolsillos"] };
    const pct = Math.round(me.factor * 100 - 100);
    return `${head("Mi taller", "Tú decides cuándo recibes pedidos, cuánto cobras y en cuántos días entregas. Los clientes ven estos cambios al instante.")}
    <div class="stack" style="max-width:680px">
      <section class="card stack"><label class="switch"><input type="checkbox" data-ch="disp" ${me.disponible ? "checked" : ""}><span><b>Recibiendo pedidos</b><br><span class="muted small">Si lo apagas, tu taller aparece como "Sin cupo" para los clientes.</span></span></label>
      <label class="switch"><input type="checkbox" data-ch="retTaller" ${me.retazos ? "checked" : ""}><span><b>Recibo retazos y ropa vieja</b><br><span class="muted small">Se muestra una etiqueta en tu tarjeta.</span></span></label></section>
      <section class="card stack"><div class="field"><label for="t-nom">Nombre del taller</label><input class="input" id="t-nom" value="${esc(me.taller)}" data-in="tName" maxlength="40"></div>
        <div class="field"><label for="t-ciu">Ciudad</label><select class="input" id="t-ciu" data-ch="tCiudad">${R.CIUDADES.map((c) => `<option${me.ciudad === c ? " selected" : ""}>${c}</option>`).join("")}</select></div>
        <div class="field"><span class="lbl">Plazo habitual</span><div class="stepper"><button type="button" data-a="plazo" data-v="-1" aria-label="Menos días">−</button><output>${me.plazo} días</output><button type="button" data-a="plazo" data-v="1" aria-label="Más días">+</button></div></div></section>
      <section class="card stack"><div class="range"><div class="rt"><label for="t-fac">Mis precios frente a la base</label><span id="tf-v" class="tnum">${pct > 0 ? "+" : ""}${pct}%</span></div><input type="range" id="t-fac" min="-15" max="30" value="${pct}" data-in="factor"></div>
        <div class="minirow"><div style="flex:1"><b class="small">Ejemplo: camisa de lino con bolsillos</b><div class="small muted">Así la verá un cliente</div></div><span class="price tnum" id="tf-ex">${R.cop(R.precio(demo, me))}</span></div></section></div>`;
  }

  /* ---------- Rutas ---------- */
  const ROUTES = {
    inicio: { v: vInicio, role: "cliente" },
    login: { v: vLogin, role: "cliente" },
    disenar: { v: vDisenar, role: "cliente", auth: 1 },
    artesanos: { v: vArtesanos, role: "cliente", auth: 1 },
    envio: { v: vEnvio, role: "cliente", auth: 1, needs: "art" },
    resumen: { v: vResumen, role: "cliente", auth: 1, needs: "addr" },
    pago: { v: vPago, role: "cliente", auth: 1, needs: "addr" },
    recibo: { v: vRecibo, role: "cliente", auth: 1 },
    seguimiento: { v: vSeguimiento, role: "cliente", auth: 1 },
    recoleccion: { v: vRecoleccion, role: "cliente", auth: 1 },
    pedidos: { v: vPedidos, role: "cliente", auth: 1 },
    "a-panel": { v: vAPanel, role: "artesano" },
    "a-pedidos": { v: vAPedidos, role: "artesano" },
    "a-pedido": { v: vAPedido, role: "artesano" },
    "a-guias": { v: vAGuias, role: "artesano" },
    "a-resenas": { v: vAResenas, role: "artesano" },
    "a-taller": { v: vATaller, role: "artesano" },
  };

  function ticker() {
    const L = ["Hecho a mano", "Sin stock", "Solo bajo pedido", "El artesano fija su precio", "Los retazos vuelven a ser tela"];
    const half = [...L, ...L].map((t) => `<span>${t}</span>`).join("");
    return `<div class="ticker" aria-hidden="true"><div class="tk">${half}${half}</div></div>`;
  }
  let lastRoute = null;
  function render(anim) {
    const s = S();
    let name = route();
    let r = ROUTES[name];
    if (!r) { name = "inicio"; r = ROUTES.inicio; }
    if (r.role !== s.role) { s.role = r.role; R.save(); }
    if (r.auth && !s.user) { s.next = name; history.replaceState(null, "", "#login"); return render(true); }
    if (r.needs === "art" && !s.artisanId) { history.replaceState(null, "", "#artesanos"); return render(true); }
    if (r.needs === "addr" && !s.artisanId) { history.replaceState(null, "", "#artesanos"); return render(true); }
    if (r.needs === "addr" && !s.address.direccion) { history.replaceState(null, "", "#envio"); return render(true); }
    const y = window.scrollY;
    const isA = r.role === "artesano";
    const inner = r.v();
    const body = isA ? ashell(name, inner) : inner;
    const fresh = anim !== false && lastRoute !== name;
    root.innerHTML = `${header(name)}${name === "inicio" ? ticker() : ""}<div class="wrap"><main id="main"><div class="view" ${fresh ? "" : 'style="animation:none"'}>${body}</div></main></div>${isA ? "" : footer()}<div class="toasts" id="toasts" role="status" aria-live="polite"></div>`;
    document.body.classList.toggle("has-tabs", isA);
    document.title = "Retazo · " + ({ inicio: "Moda a la medida", login: "Ingresar", disenar: "Diseñar", artesanos: "Artesanos", envio: "Envío", resumen: "Resumen", pago: "Pago", recibo: "Recibo", seguimiento: "Seguimiento", recoleccion: "Retazos", pedidos: "Mis pedidos" }[name] || "Taller");
    if (fresh) window.scrollTo(0, 0); else window.scrollTo(0, y);
    lastRoute = name;
    if (name === "recibo" && S().lastOrderId && UI.confettiFor !== S().lastOrderId) { UI.confettiFor = S().lastOrderId; confetti(); }
  }
  function confetti() {
    if (reduced) return;
    const c = document.createElement("div");
    c.className = "confetti";
    const cols = ["#A63A26", "#C79A32", "#4F6B3A", "#36556E", "#C9A3A0", "#5B3A5C"];
    for (let i = 0; i < 46; i++) {
      const p = document.createElement("i");
      p.style.left = Math.random() * 100 + "%";
      p.style.background = cols[i % cols.length];
      p.style.animationDuration = 2.4 + Math.random() * 2.2 + "s";
      p.style.animationDelay = Math.random() * 0.5 + "s";
      p.style.transform = "rotate(" + Math.random() * 360 + "deg)";
      c.appendChild(p);
    }
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5500);
  }

  /* ---------- Acciones (clics) ---------- */
  const rerender = () => render(false);
  const A = {
    start: () => go(S().user ? "disenar" : "login"),
    heroColor: (el) => { UI.heroColor = el.dataset.v; rerender(); },
    logout: () => { S().user = null; R.save(); toast("Sesión cerrada"); go("inicio"); },
    role: (el) => { const v = el.dataset.v; S().role = v; R.save(); go(v === "artesano" ? "a-panel" : "inicio"); },
    loginTab: (el) => { UI.loginTab = el.dataset.v; UI.errors = {}; rerender(); },
    google: () => { S().user = { name: "Camila Rojas", email: "camila@correo.com" }; fillName(); R.save(); toast("Bienvenida, Camila"); go(S().next || "disenar"); },
    asArtisan: () => { S().role = "artesano"; R.save(); go("a-panel"); },
    pickTipo: (el) => { S().draft.tipo = el.dataset.v; R.save(); rerender(); },
    pickTela: (el) => { S().draft.tela = el.dataset.v; R.save(); rerender(); },
    pickColor: (el) => { S().draft.color = el.dataset.v; R.save(); rerender(); },
    toggleDet: (el) => { const d = S().draft.detalles, i = d.indexOf(el.dataset.v); i < 0 ? d.push(el.dataset.v) : d.splice(i, 1); R.save(); rerender(); },
    sort: (el) => { S().sort = el.dataset.v; R.save(); rerender(); },
    pickArt: (el) => { S().artisanId = el.dataset.id; R.save(); go("envio"); },
    retKg: (el) => { const r = S().retazos; r.kg = Math.min(20, Math.max(1, r.kg + +el.dataset.v)); R.save(); rerender(); },
    confirm: () => {
      if (!S().terms) { UI.errors = { terms: "Marca la casilla para continuar." }; rerender(); return; }
      UI.errors = {}; go("pago");
    },
    payMethod: (el) => { UI.pay.metodo = el.dataset.v; UI.pay.status = "idle"; UI.errors = {}; rerender(); },
    payRetry: () => { UI.pay.status = "idle"; UI.errors = {}; rerender(); const f = document.getElementById("p-num"); if (f) f.focus(); },
    payChange: () => { UI.pay.metodo = "Nequi"; UI.pay.status = "idle"; rerender(); },
    copy: (el) => {
      const v = el.dataset.v;
      const done = () => toast("Copiado: " + v);
      try { navigator.clipboard.writeText(v).then(done, () => toast("Selecciona y copia: " + v)); } catch (e) { toast("Selecciona y copia: " + v); }
    },
    openC: (el) => { S().currentOrderId = el.dataset.id; R.save(); return true; },
    openA: (el) => { S().aOrderId = el.dataset.id; R.save(); return true; },
    demoArtisan: (el) => { S().aOrderId = el.dataset.id; S().role = "artesano"; R.save(); go("a-pedido"); },
    star: (el) => { UI.stars = +el.dataset.v; rerender(); },
    rtag: (el) => { const t = el.dataset.v, i = UI.rtags.indexOf(t); i < 0 ? UI.rtags.push(t) : UI.rtags.splice(i, 1); const keep = document.getElementById("rv-texto"); UI.rtxt = keep ? keep.value : ""; rerender(); const k2 = document.getElementById("rv-texto"); if (k2) k2.value = UI.rtxt; },
    rcKg: (el) => { UI.reco.kg = Math.min(20, Math.max(1, UI.reco.kg + +el.dataset.v)); rerender(); },
    rcModo: (el) => { UI.reco.modo = el.dataset.v; rerender(); },
    rcDia: (el) => { UI.reco.dia = +el.dataset.v; rerender(); },
    afilter: (el) => { S().afilter = el.dataset.v; R.save(); rerender(); },
    aceptar: (el) => {
      const o = R.order(el.dataset.id);
      const inp = document.getElementById("pz-" + o.id);
      const plazo = Math.min(30, Math.max(1, parseInt(inp && inp.value, 10) || R.me().plazo));
      R.setEstado(o, "aceptado", { plazo, aceptadoTs: Date.now() });
      toast("Pedido " + o.id + " aceptado. Tu cliente ya lo ve en su seguimiento.");
      rerender();
    },
    rechazar: (el) => { const o = R.order(el.dataset.id); R.setEstado(o, "rechazado"); toast("Pedido " + o.id + " rechazado. Se devuelve el pago al cliente."); rerender(); },
    avanzar: (el) => { const o = R.order(el.dataset.id); R.setEstado(o, el.dataset.v); toast(el.dataset.v === "entregado" ? "Pedido entregado. El cliente puede calificarte." : "Estado actualizado: " + R.ESTADOS.find((x) => x.id === el.dataset.v).n); rerender(); },
    genGuia: () => { const f = document.getElementById("g-num"); if (f) f.value = String(Math.floor(1e9 + Math.random() * 9e9)); },
    reply: (el) => { const o = R.order(el.dataset.id); const v = (document.getElementById("rp-" + o.id).value || "").trim(); if (!v) { toast("Escribe una respuesta antes de enviar."); return; } o.review.resp = v; R.save(); toast("Respuesta publicada"); rerender(); },
    plazo: (el) => { const m = R.me(); m.plazo = Math.min(30, Math.max(1, m.plazo + +el.dataset.v)); R.save(); rerender(); },
    reset: () => { R.reset(); UI.pay = { metodo: "Tarjeta", status: "idle", msg: "", v: { num: "", nombre: "", exp: "", cvv: "", tel: "", banco: "" } }; UI.stars = 0; UI.rtags = []; toast("Demo reiniciada"); go("inicio"); },
  };
  function fillName() { const s = S(); if (s.user && !s.address.nombre) s.address.nombre = s.user.name; }

  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-a]");
    if (!el || !A[el.dataset.a]) return;
    const r = A[el.dataset.a](el, e);
    if (r !== true) e.preventDefault();
  });

  /* ---------- Entradas en vivo (sin volver a dibujar) ---------- */
  const I = {
    med: (el) => {
      const d = S().draft;
      d.medidas[el.dataset.k] = +el.value;
      document.getElementById("mv-" + el.dataset.k).textContent = el.value + " cm";
      const v = document.getElementById("pvCanvas");
      if (v) v.innerHTML = R.garment(d);
      const dm = document.getElementById("pvDims");
      if (dm) dm.textContent = `Pecho ${d.medidas.pecho} cm · Cintura ${d.medidas.cintura} cm · Largo ${d.medidas.largo} cm`;
      R.save();
    },
    nota: (el) => { S().draft.nota = el.value; R.save(); },
    frase: (el) => {
      S().draft.frase = el.value.toUpperCase().replace(/[<>&"']/g, "");
      const b = document.getElementById("pvBox");
      if (b) b.innerHTML = previewBox();
      R.save();
    },
    pf: (el) => {
      const k = el.dataset.k;
      let v = el.value;
      if (k === "num") { v = v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim(); el.value = v; const c = document.getElementById("cvN"); if (c) c.textContent = v || "•••• •••• •••• ••••"; }
      if (k === "exp") { v = v.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); el.value = v; const c = document.getElementById("cvExp"); if (c) c.textContent = v || "MM/AA"; }
      if (k === "cvv" || k === "tel") { v = v.replace(/\D/g, ""); el.value = v; }
      if (k === "nombre") { const c = document.getElementById("cvName"); if (c) c.textContent = v || "Nombre en la tarjeta"; }
      UI.pay.v[k] = v;
    },
    tName: (el) => { R.me().taller = el.value || "Mi taller"; R.save(); },
    factor: (el) => {
      const m = R.me();
      m.factor = 1 + +el.value / 100;
      const p = +el.value;
      document.getElementById("tf-v").textContent = (p > 0 ? "+" : "") + p + "%";
      document.getElementById("tf-ex").textContent = R.cop(R.precio({ tipo: "camisa", tela: "lino", detalles: ["bolsillos"] }, m));
      R.save();
    },
  };
  document.addEventListener("input", (e) => { const k = e.target.dataset && e.target.dataset.in; if (k && I[k]) I[k](e.target); });

  const C = {
    retazos: (el) => { S().retazos.on = el.checked; R.save(); rerender(); },
    retTipo: (el) => { S().retazos.tipo = el.value; R.save(); },
    terms: (el) => { S().terms = el.checked; if (el.checked) UI.errors = {}; R.save(); const er = document.querySelector(".side .err"); if (er) er.textContent = ""; },
    rcTipo: (el) => { UI.reco.tipo = el.value; },
    rcFr: (el) => { UI.reco.franja = el.value; },
    disp: (el) => { R.me().disponible = el.checked; R.save(); toast(el.checked ? "Ahora recibes pedidos" : "Marcaste tu taller sin cupo"); },
    retTaller: (el) => { R.me().retazos = el.checked; R.save(); },
    tCiudad: (el) => { R.me().ciudad = el.value; R.save(); },
    pf: (el) => { I.pf(el); },
  };
  document.addEventListener("change", (e) => { const k = e.target.dataset && e.target.dataset.ch; if (k && C[k]) C[k](e.target); });

  /* ---------- Formularios ---------- */
  const val = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ""; };
  const mailOk = (m) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m);
  const F = {
    login: () => {
      const email = val("f-email"), pass = val("f-pass");
      UI.lf.email = email;
      const er = {};
      if (!mailOk(email)) er.email = "Escribe un correo válido, por ejemplo nombre@correo.com.";
      if (pass.length < 6) er.pass = "La contraseña debe tener mínimo 6 caracteres.";
      UI.errors = er;
      if (Object.keys(er).length) { rerender(); const f = document.getElementById("f-email"); if (f) f.value = email; return; }
      const nm = email.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      S().user = { name: email === "camila@correo.com" ? "Camila Rojas" : nm, email };
      fillName(); R.save(); toast("Listo, ya puedes diseñar"); go(S().next || "disenar");
    },
    registro: () => {
      const nombre = val("f-nombre"), email = val("f-email"), pass = val("f-pass");
      UI.lf = { nombre, email };
      const er = {};
      if (nombre.length < 3) er.nombre = "Escribe tu nombre completo.";
      if (!mailOk(email)) er.email = "Escribe un correo válido, por ejemplo nombre@correo.com.";
      if (pass.length < 6) er.pass = "La contraseña debe tener mínimo 6 caracteres.";
      UI.errors = er;
      if (Object.keys(er).length) { rerender(); return; }
      S().user = { name: nombre, email };
      fillName(); R.save(); toast("Cuenta creada"); go(S().next || "disenar");
    },
    envio: () => {
      const a = S().address;
      a.nombre = val("e-nombre"); a.celular = val("e-celular"); a.ciudad = val("e-ciudad") || a.ciudad; a.barrio = val("e-barrio"); a.direccion = val("e-direccion"); a.indicaciones = val("e-indicaciones");
      const er = {};
      if (a.nombre.length < 3) er.nombre = "Escribe el nombre de quien recibe.";
      if (!/^3\d{9}$/.test(a.celular)) er.celular = "El celular tiene 10 dígitos y empieza por 3.";
      if (a.barrio.length < 2) er.barrio = "Escribe tu barrio.";
      if (a.direccion.length < 5) er.direccion = "Escribe la dirección completa.";
      UI.errors = er; R.save();
      if (Object.keys(er).length) { rerender(); return; }
      go("resumen");
    },
    pago: () => {
      const p = UI.pay;
      if (p.status === "loading") return;
      const v = p.v, er = {};
      if (p.metodo === "Tarjeta") {
        if (v.num.replace(/\s/g, "").length !== 16) er.num = "El número tiene 16 dígitos.";
        if (v.nombre.trim().length < 3) er.nombre = "Escribe el nombre como aparece en la tarjeta.";
        const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(v.exp);
        if (!m) er.exp = "Usa el formato MM/AA.";
        else if (new Date(2000 + +m[2], +m[1], 0, 23, 59) < new Date()) er.exp = "La tarjeta está vencida.";
        if (!/^\d{3,4}$/.test(v.cvv)) er.cvv = "3 o 4 dígitos.";
      } else if (p.metodo === "PSE") { if (!v.banco) er.banco = "Elige tu banco."; }
      else if (!/^3\d{9}$/.test(v.tel)) er.tel = "El celular tiene 10 dígitos y empieza por 3.";
      UI.errors = er;
      if (Object.keys(er).length) { rerender(); return; }
      p.status = "loading"; rerender();
      setTimeout(() => {
        const rej = p.metodo === "Tarjeta" && v.num.replace(/\s/g, "").startsWith("0000");
        if (rej) { p.status = "error"; p.msg = "Tu banco rechazó la tarjeta por fondos insuficientes. No se hizo ningún cobro."; rerender(); return; }
        const last = p.metodo === "Tarjeta" ? v.num.replace(/\s/g, "").slice(-4) : "";
        R.createOrder({ metodo: p.metodo === "PSE" ? "PSE · " + v.banco : p.metodo, ultimos: last });
        p.status = "idle"; p.v = { num: "", nombre: "", exp: "", cvv: "", tel: "", banco: "" };
        go("recibo");
      }, 1400);
    },
    reco: () => {
      const o = R.order(S().currentOrderId) || R.myOrders()[0];
      const t = new Date(); t.setDate(t.getDate() + 1 + UI.reco.dia); t.setHours(12, 0, 0, 0);
      o.retazos = { on: true, tipo: UI.reco.tipo, kg: UI.reco.kg, programado: { tipo: UI.reco.tipo, kg: UI.reco.kg, modo: UI.reco.modo, ts: t.getTime(), franja: UI.reco.franja } };
      R.save(); toast("Entrega de retazos programada"); go("seguimiento");
    },
    review: () => {
      const o = R.order(S().currentOrderId) || R.myOrders()[0];
      const txt = val("rv-texto");
      if (!UI.stars) { UI.errors = { review: "Elige de 1 a 5 estrellas." }; rerender(); const t = document.getElementById("rv-texto"); if (t) t.value = txt; return; }
      UI.errors = {};
      o.review = { stars: UI.stars, texto: txt || "Sin comentario.", tags: UI.rtags.slice(), ts: Date.now(), resp: "" };
      const a = R.artisan(o.artesanoId);
      a.rating = Math.round(((a.rating * a.pedidos + UI.stars) / (a.pedidos + 1)) * 100) / 100; a.pedidos += 1;
      UI.stars = 0; UI.rtags = []; R.save(); toast("Gracias por calificar"); rerender();
    },
    guia: (f) => {
      const o = R.order(f.dataset.id);
      const num = val("g-num"), emp = val("g-emp");
      if (!/^\d{8,12}$/.test(num)) { UI.errors = { guia: "Escribe entre 8 y 12 dígitos o toca Generar." }; rerender(); return; }
      UI.errors = {};
      R.setEstado(o, "camino", { guia: { empresa: emp, numero: num, ts: Date.now() } });
      toast("Pedido despachado con guía " + num); rerender();
    },
  };
  document.addEventListener("submit", (e) => {
    const f = e.target.closest("form[data-f]");
    if (!f) return;
    e.preventDefault();
    if (F[f.dataset.f]) F[f.dataset.f](f);
  });

  window.addEventListener("hashchange", () => { UI.errors = {}; render(true); });
  window.addEventListener("storage", (e) => { if (e.key === "retazo-proto-v2") { R.S = R.load(); rerender(); } });
  render(true);
})();
