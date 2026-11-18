/* Retazo · datos de ejemplo, precios y estado compartido (cliente + artesano).
   Todo vive en localStorage: no hay servidor. Cambiar de rol lee el mismo estado. */
(function () {
  const R = (window.R = {});
  const KEY = "retazo-proto-v3";

  R.PRENDAS = [
    { id: "camisa", n: "Camisa", base: 90000 },
    { id: "vestido", n: "Vestido", base: 140000 },
    { id: "pantalon", n: "Pantalón", base: 110000 },
    { id: "chaqueta", n: "Chaqueta", base: 180000 },
    { id: "falda", n: "Falda", base: 85000 },
    { id: "buzo", n: "Buzo con capota", base: 105000 },
  ];
  R.TELAS = [
    { id: "algodon", n: "Algodón", extra: 0, d: "Suave y fresca" },
    { id: "lino", n: "Lino", extra: 20000, d: "Ligero, para clima cálido" },
    { id: "dril", n: "Dril", extra: 15000, d: "Firme y resistente" },
    { id: "reciclada", n: "Tela recuperada", extra: -10000, d: "Hecha con retazos" },
  ];
  R.COLORES = [
    ["Pizarra", "#36556E"],
    ["Óxido", "#A63A26"],
    ["Ocre", "#C79A32"],
    ["Musgo", "#4F6B3A"],
    ["Rosa polvo", "#C9A3A0"],
    ["Ciruela", "#5B3A5C"],
    ["Tinta", "#171717"],
    ["Crudo", "#DAD4C4"],
  ];
  R.DETALLES = [
    { id: "bolsillos", n: "Bolsillos", p: 6000 },
    { id: "botones", n: "Botones de contraste", p: 4000 },
    { id: "bordado", n: "Bordado a mano", p: 18000 },
    { id: "parche", n: "Parche de retazos", p: 8000 },
    { id: "cuello", n: "Cuello especial", p: 7000 },
  ];
  R.ESTADOS = [
    { id: "recibido", n: "Pedido recibido", d: "Esperando que el artesano lo acepte" },
    { id: "aceptado", n: "Aceptado", d: "El artesano confirmó precio y plazo" },
    { id: "confeccionando", n: "Confeccionando", d: "Tu prenda está en el taller" },
    { id: "camino", n: "En camino", d: "Salió con su guía de envío" },
    { id: "entregado", n: "Entregado", d: "Listo para estrenar" },
  ];
  R.ENVIO = 9900;
  R.DESC_RETAZOS = 8000;
  R.EMPRESAS = ["Servientrega", "Coordinadora", "Interrapidísimo", "Envía", "Entrega propia del taller"];
  R.CIUDADES = ["Bogotá", "Medellín", "Cali", "Barranquilla", "Bucaramanga", "Cartagena", "Pereira"];
  R.BANCOS = ["Bancolombia", "Davivienda", "Banco de Bogotá", "BBVA", "Banco Popular", "Nu"];

  R.cop = (n) => "$ " + Math.round(n).toLocaleString("es-CO");
  R.fecha = (ts) => new Date(ts).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
  R.fechaLarga = (ts) => new Date(ts).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
  const DAY = 864e5;

  R.defaultDraft = () => ({
    tipo: "camisa",
    tela: "lino",
    color: "#36556E",
    frase: "",
    medidas: { pecho: 98, cintura: 84, largo: 72 },
    detalles: ["bolsillos"],
    nota: "",
  });

  /* Precio de una prenda: base + tela + detalles, multiplicado por el factor del artesano. */
  R.precio = (d, art) => {
    const p = R.PRENDAS.find((x) => x.id === d.tipo);
    const t = R.TELAS.find((x) => x.id === d.tela);
    const det = d.detalles.reduce((s, id) => s + R.DETALLES.find((x) => x.id === id).p, 0);
    const f = art ? art.factor : 1;
    const fr = d.frase ? 10000 : 0;
    return Math.round(((p.base + t.extra + det + fr) * f) / 1000) * 1000;
  };
  R.detallesTxt = (d) => {
    const l = (d.detalles || []).map((id) => R.DETALLES.find((x) => x.id === id).n);
    if (d.frase) l.push("Estampa: «" + d.frase + "»");
    return l;
  };
  R.nombrePrenda = (d) => {
    const p = R.PRENDAS.find((x) => x.id === d.tipo).n;
    const t = R.TELAS.find((x) => x.id === d.tela).n.toLowerCase();
    const c = R.COLORES.find((x) => x[1] === d.color);
    return p + " de " + t + (c ? " " + c[0].toLowerCase() : "");
  };

  const mkOrder = (o) =>
    Object.assign(
      { review: null, guia: null, retazos: { on: false }, mine: false, plazo: null, aceptadoTs: null, hist: [] },
      o
    );

  function seed() {
    const now = Date.now();
    const artisans = [
      { id: "marta", nombre: "Marta Gómez", taller: "Taller de Marta", ciudad: "Bogotá", rating: 4.9, pedidos: 128, factor: 1.0, plazo: 7, color: "#D78D78", tags: ["Lino y algodón", "Usa retazos"], disponible: true, retazos: true },
      { id: "luis", nombre: "Luis Herrera", taller: "Sastrería de Luis", ciudad: "Medellín", rating: 4.7, pedidos: 96, factor: 1.12, plazo: 10, color: "#8FA8BC", tags: ["Chaquetas", "Sastrería a medida"], disponible: true, retazos: true },
      { id: "sofia", nombre: "Sofía Marín", taller: "Costura Sofi", ciudad: "Cali", rating: 4.8, pedidos: 74, factor: 0.92, plazo: 6, color: "#A3B38A", tags: ["Vestidos", "Entrega rápida"], disponible: true, retazos: false },
      { id: "andres", nombre: "Andrés Pardo", taller: "Hilos del Barrio", ciudad: "Bogotá", rating: 4.6, pedidos: 51, factor: 0.88, plazo: 5, color: "#D6B25C", tags: ["Dril y pantalones", "Precio justo"], disponible: true, retazos: true },
    ];
    const d = (tipo, tela, color, extra) => Object.assign(R.defaultDraft(), { tipo, tela, color }, extra || {});
    const marta = artisans[0];
    const orders = [
      mkOrder({ id: "R-1042", cliente: "Daniela Ortiz", ciudad: "Bogotá", barrio: "Chapinero", direccion: "Cra 13 # 54-20", diseno: d("camisa", "lino", "#36556E", { nota: "Manga larga, que no quede ajustada." }), artesanoId: "marta", envio: R.ENVIO, desc: 0, estado: "recibido", ts: now - 3 * 36e5, hist: [{ e: "recibido", t: now - 3 * 36e5 }] }),
      mkOrder({ id: "R-1041", cliente: "Juan Pablo Mejía", ciudad: "Bogotá", barrio: "Teusaquillo", direccion: "Cl 39 # 20-11", diseno: d("vestido", "algodon", "#C9A3A0", { detalles: ["botones", "bordado"], nota: "Para un matrimonio en diciembre." }), artesanoId: "marta", envio: R.ENVIO, desc: R.DESC_RETAZOS, retazos: { on: true, tipo: "Retazos de tela", kg: 2, programado: null }, estado: "recibido", ts: now - 20 * 36e5, hist: [{ e: "recibido", t: now - 20 * 36e5 }] }),
      mkOrder({ id: "R-1037", cliente: "Paula Vargas", ciudad: "Soacha", barrio: "San Mateo", direccion: "Mz 4 Casa 12", diseno: d("pantalon", "dril", "#171717", { detalles: ["bolsillos", "botones"] }), artesanoId: "marta", envio: R.ENVIO, desc: 0, estado: "confeccionando", plazo: 6, aceptadoTs: now - 2 * DAY, ts: now - 2.2 * DAY, hist: [{ e: "recibido", t: now - 2.2 * DAY }, { e: "aceptado", t: now - 2 * DAY }, { e: "confeccionando", t: now - 1 * DAY }] }),
      mkOrder({ id: "R-1035", cliente: "Mateo Ruiz", ciudad: "Bogotá", barrio: "Usaquén", direccion: "Cra 7 # 120-33", diseno: d("chaqueta", "algodon", "#4F6B3A", { detalles: ["botones", "cuello"], frase: "HECHO A MANO" }), artesanoId: "marta", envio: R.ENVIO, desc: 0, estado: "camino", plazo: 8, aceptadoTs: now - 6 * DAY, guia: { empresa: "Servientrega", numero: "2208841733", ts: now - 0.5 * DAY }, ts: now - 6.2 * DAY, hist: [{ e: "recibido", t: now - 6.2 * DAY }, { e: "aceptado", t: now - 6 * DAY }, { e: "confeccionando", t: now - 4 * DAY }, { e: "camino", t: now - 0.5 * DAY }] }),
      mkOrder({ id: "R-1030", cliente: "Camila Rojas", mine: true, ciudad: "Bogotá", barrio: "Cedritos", direccion: "Cl 147 # 12-40", diseno: d("falda", "algodon", "#C79A32", { detalles: ["bolsillos"] }), artesanoId: "marta", envio: R.ENVIO, desc: 0, estado: "entregado", plazo: 7, aceptadoTs: now - 16 * DAY, guia: { empresa: "Coordinadora", numero: "9931120054", ts: now - 10 * DAY }, ts: now - 16.3 * DAY, hist: [{ e: "recibido", t: now - 16.3 * DAY }, { e: "aceptado", t: now - 16 * DAY }, { e: "confeccionando", t: now - 14 * DAY }, { e: "camino", t: now - 10 * DAY }, { e: "entregado", t: now - 8 * DAY }] }),
      mkOrder({ id: "R-1028", cliente: "Laura Beltrán", ciudad: "Bogotá", barrio: "Suba", direccion: "Cl 145 # 91-20", diseno: d("buzo", "algodon", "#5B3A5C", {}), artesanoId: "marta", envio: R.ENVIO, desc: 0, estado: "entregado", plazo: 7, aceptadoTs: now - 25 * DAY, guia: { empresa: "Envía", numero: "4410928831", ts: now - 19 * DAY }, review: { stars: 5, texto: "Quedó exacto a lo que dibujé. El buzo es suavísimo y llegó antes de lo prometido.", tags: ["Calce perfecto", "Puntual"], ts: now - 15 * DAY, resp: "¡Gracias, Laura! Fue un gusto coserlo." }, ts: now - 25.3 * DAY, hist: [{ e: "recibido", t: now - 25.3 * DAY }, { e: "aceptado", t: now - 25 * DAY }, { e: "confeccionando", t: now - 23 * DAY }, { e: "camino", t: now - 19 * DAY }, { e: "entregado", t: now - 17 * DAY }] }),
      mkOrder({ id: "R-1019", cliente: "Sergio Naranjo", ciudad: "Chía", barrio: "La Lorena", direccion: "Cl 12 # 3-45", diseno: d("camisa", "lino", "#DAD4C4", { detalles: ["cuello"] }), artesanoId: "marta", envio: R.ENVIO, desc: 0, estado: "entregado", plazo: 7, aceptadoTs: now - 40 * DAY, guia: { empresa: "Servientrega", numero: "2208770120", ts: now - 34 * DAY }, review: { stars: 4, texto: "Muy buen trabajo. Pedí una talla de más en la manga y me ayudó a ajustarla.", tags: ["Buena comunicación"], ts: now - 30 * DAY, resp: "" }, ts: now - 40.2 * DAY, hist: [{ e: "recibido", t: now - 40.2 * DAY }, { e: "aceptado", t: now - 40 * DAY }, { e: "entregado", t: now - 32 * DAY }] }),
    ];
    orders.forEach((o) => {
      const a = artisans.find((x) => x.id === o.artesanoId);
      o.precio = R.precio(o.diseno, a);
      o.total = o.precio + o.envio - o.desc;
      o.pago = { metodo: "Tarjeta", ultimos: "4242" };
    });
    return {
      v: 3,
      role: "cliente",
      user: null,
      next: null,
      seq: 1043,
      draft: R.defaultDraft(),
      artisanId: null,
      address: { nombre: "", celular: "", ciudad: "Bogotá", barrio: "", direccion: "", indicaciones: "" },
      retazos: { on: false, tipo: "Retazos de tela", kg: 2 },
      terms: false,
      sort: "rating",
      lastOrderId: null,
      currentOrderId: null,
      aOrderId: null,
      afilter: "todos",
      me: "marta",
      artisans,
      orders,
    };
  }

  R.load = () => {
    try {
      const s = localStorage.getItem(KEY);
      if (s) {
        const j = JSON.parse(s);
        if (j && j.v === 3) return j;
      }
    } catch (e) {}
    return seed();
  };
  R.save = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(R.S));
    } catch (e) {}
  };
  R.reset = () => {
    R.S = seed();
    R.save();
  };
  R.S = R.load();

  R.artisan = (id) => R.S.artisans.find((a) => a.id === id);
  R.me = () => R.artisan(R.S.me);
  R.order = (id) => R.S.orders.find((o) => o.id === id);
  R.myOrders = () => R.S.orders.filter((o) => o.mine).sort((a, b) => b.ts - a.ts);
  R.artisanOrders = () => R.S.orders.filter((o) => o.artesanoId === R.S.me).sort((a, b) => b.ts - a.ts);
  R.entrega = (o) => {
    if (o.aceptadoTs && o.plazo) return o.aceptadoTs + o.plazo * DAY;
    const a = R.artisan(o.artesanoId);
    return o.ts + ((a ? a.plazo : 7) + 3) * DAY;
  };

  /* Cambia el estado de un pedido. Lo ve el cliente de inmediato en su seguimiento. */
  R.setEstado = (o, estado, extra) => {
    o.estado = estado;
    o.hist.push({ e: estado, t: Date.now() });
    if (extra) Object.assign(o, extra);
    R.save();
  };

  R.createOrder = (pay) => {
    const s = R.S;
    const art = R.artisan(s.artisanId);
    const precio = R.precio(s.draft, art);
    const desc = s.retazos.on ? R.DESC_RETAZOS : 0;
    const id = "R-" + s.seq++;
    const now = Date.now();
    const o = mkOrder({
      id,
      mine: true,
      cliente: s.user ? s.user.name : "Cliente",
      ciudad: s.address.ciudad,
      barrio: s.address.barrio,
      direccion: s.address.direccion,
      indicaciones: s.address.indicaciones,
      celular: s.address.celular,
      diseno: JSON.parse(JSON.stringify(s.draft)),
      artesanoId: art.id,
      precio,
      envio: R.ENVIO,
      desc,
      total: precio + R.ENVIO - desc,
      retazos: s.retazos.on ? { on: true, tipo: s.retazos.tipo, kg: s.retazos.kg, programado: null } : { on: false },
      estado: "recibido",
      ts: now,
      hist: [{ e: "recibido", t: now }],
      pago: pay,
    });
    s.orders.unshift(o);
    s.lastOrderId = id;
    s.currentOrderId = id;
    s.draft = R.defaultDraft();
    s.artisanId = null;
    s.retazos = { on: false, tipo: "Retazos de tela", kg: 2 };
    s.terms = false;
    R.save();
    return o;
  };
})();
