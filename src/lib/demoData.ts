// Demo data — 100% fictional, in English for the public demo. Used only when VITE_DEMO=true.
import { destinoPorCategoria } from "@/lib/destino";

type Row = Record<string, any>;

export interface DemoDB {
  profiles: Row[];
  productos: Row[];
  mesas: Row[];
  pedidos: Row[];
  detalles_pedido: Row[];
}

// Small deterministic PRNG so every visitor starts with the same data
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let counter = 0;
const id = (prefix: string) => `${prefix}-${(++counter).toString(36)}-demo`;

const PRODUCTOS: [string, number, string][] = [
  ["Beef empanada", 3.5, "Entrada"],
  ["Cheese empanada", 3.0, "Entrada"],
  ["Tequeños (6 pcs)", 6.5, "Entrada"],
  ["Fish ceviche", 9.5, "Entrada"],
  ["Guacamole & tortilla chips", 6.0, "Bocadillos"],
  ["Yuca fries", 4.5, "Bocadillos"],
  ["Lomo saltado", 16.5, "Plato fuerte"],
  ["Arepa reina pepiada", 9.0, "Plato fuerte"],
  ["Pabellón criollo", 14.5, "Plato fuerte"],
  ["Tacos al pastor (3 pcs)", 11.0, "Plato fuerte"],
  ["Ají de gallina", 13.5, "Plato fuerte"],
  ["Rotisserie chicken (1/4)", 12.0, "Plato fuerte"],
  ["Chilean hot dog", 7.5, "Plato fuerte"],
  ["Tres leches cake", 5.5, "Postre"],
  ["Alfajor", 3.0, "Postre"],
  ["Churros with chocolate", 5.0, "Postre"],
  ["Mint lemonade", 4.0, "Bebidas sin alcohol"],
  ["Inca Kola", 3.5, "Bebidas sin alcohol"],
  ["Sparkling water", 2.5, "Bebidas sin alcohol"],
  ["Passion fruit juice", 4.5, "Bebidas sin alcohol"],
  ["Pisco sour", 8.0, "Bebidas alcoholicas"],
  ["Michelada", 6.5, "Bebidas alcoholicas"],
  ["Cusqueña beer", 4.5, "Bebidas alcoholicas"],
  ["Caipirinha", 8.5, "Bebidas alcoholicas"],
  ["Tequila shot", 4.0, "Shots"],
  ["Espresso", 2.5, "Café"],
  ["Café latte", 3.0, "Café"],
  ["Extra avocado", 1.5, "Extras comidas"],
  ["Extra fries", 3.0, "Extras comidas"],
  ["Extra shot of rum", 2.5, "Extras bebidas"],
];

const CLIENTES = ["Andrea", "Jonas", "Sophie", "Lukas", "Valentina", "Felix", "Camila", "Leon", "Martina", "Paul", "Diego", "Emma", "Lucas", "Mia", "Tom", "Hannah"];
const NOTAS = ["no onion", "mild", "well done", "no ice", "to share", ""];

export function buildDemoDB(): DemoDB {
  counter = 0;
  const rand = rng(20261114);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const now = new Date();

  const profiles: Row[] = [
    { uuid: id("usr"), nombre: "Admin Demo", rol: "admin", pin: "1234", activo: true, color: "#f2a33a", session_token: null },
    { uuid: id("usr"), nombre: "Carlos", rol: "waiter", pin: "1111", activo: true, color: "#3b82f6", session_token: null },
    { uuid: id("usr"), nombre: "Maria", rol: "waiter", pin: "2222", activo: true, color: "#ec4899", session_token: null },
    { uuid: id("usr"), nombre: "Lucy", rol: "waiter", pin: "3333", activo: true, color: "#22c55e", session_token: null },
  ];
  const meseros = profiles.filter((p) => p.rol === "waiter");

  const productos: Row[] = PRODUCTOS.map(([nombre, precio, categoria]) => ({
    uuid: id("prd"),
    nombre,
    precio,
    categoria,
    disponible: true,
    destino_impresion: destinoPorCategoria(categoria),
    created_at: now.toISOString(),
    updated_at: now.toISOString(),
  }));
  const esBebida = (p: Row) => /^(Bebidas|Caf|Shots)/.test(p.categoria);
  const comida = productos.filter((p) => !esBebida(p) && !p.categoria.startsWith("Extras"));
  const bebida = productos.filter(esBebida);

  const mesas: Row[] = [];
  for (let n = 1; n <= 12; n++) mesas.push({ uuid: id("mes"), numero: n, estado_actual: "libre", es_personal: false });
  mesas.push({ uuid: id("mes"), numero: 901, estado_actual: "libre", es_personal: true });
  const mesasClientes = mesas.filter((m) => !m.es_personal);
  const mesaPersonal = mesas.find((m) => m.es_personal)!;

  const pedidos: Row[] = [];
  const detalles_pedido: Row[] = [];

  const crearPedido = (opts: { fecha: Date; mesa: Row; mesero: Row; estado: string; cerrado: boolean; personal?: boolean }) => {
    const pedidoId = id("ped");
    const items: Row[] = [];
    const nComida = opts.personal ? 1 : 1 + Math.floor(rand() * 3);
    const nBebida = 1 + Math.floor(rand() * 2);
    for (let i = 0; i < nComida; i++) items.push(pick(comida));
    for (let i = 0; i < nBebida; i++) items.push(pick(bebida));
    let total = 0;
    items.forEach((p) => {
      const cantidad = 1 + (rand() < 0.3 ? 1 : 0);
      total += p.precio * cantidad;
      detalles_pedido.push({
        uuid: id("det"),
        pedido_id: pedidoId,
        producto_id: p.uuid,
        cantidad,
        precio_historico: p.precio,
        notas: rand() < 0.2 ? pick(NOTAS) : "",
        nombre_extra: null,
        cobrado: opts.cerrado,
      });
    });
    const cierre = new Date(opts.fecha.getTime() + (35 + Math.floor(rand() * 60)) * 60000);
    pedidos.push({
      uuid: pedidoId,
      mesa_id: opts.mesa.uuid,
      mesero_id: opts.mesero.uuid,
      cliente_nombre: opts.personal ? opts.mesero.nombre : pick(CLIENTES),
      estado: opts.estado,
      total: Math.round(total * 100) / 100,
      created_at: opts.fecha.toISOString(),
      updated_at: (opts.cerrado ? cierre : opts.fecha).toISOString(),
      cerrado_at: opts.cerrado ? cierre.toISOString() : null,
      motivo: opts.cerrado ? "cobrado" : null,
    });
  };

  // ~35 days of closed orders so the reports have data
  for (let dia = 35; dia >= 0; dia--) {
    const base = new Date(now);
    base.setDate(base.getDate() - dia);
    const finDeSemana = [5, 6].includes(base.getDay());
    const cantidad = dia === 0 ? 6 : (finDeSemana ? 14 : 8) + Math.floor(rand() * 5);
    for (let i = 0; i < cantidad; i++) {
      const fecha = new Date(base);
      fecha.setHours(12 + Math.floor(rand() * 10), Math.floor(rand() * 60), 0, 0);
      if (fecha > now) fecha.setTime(now.getTime() - (i + 2) * 45 * 60000);
      crearPedido({ fecha, mesa: pick(mesasClientes), mesero: pick(meseros), estado: "cancelado", cerrado: true });
    }
    if (rand() < 0.5) {
      const fecha = new Date(base);
      fecha.setHours(16, 0, 0, 0);
      if (fecha > now) fecha.setTime(now.getTime() - 3 * 3600000);
      crearPedido({ fecha, mesa: mesaPersonal, mesero: pick(meseros), estado: "cancelado", cerrado: true, personal: true });
    }
  }

  // A few open orders right now
  const activos: [number, string, number][] = [
    [2, "pendiente", 6],
    [5, "en_preparacion", 18],
    [7, "listo", 32],
    [9, "pendiente", 3],
  ];
  activos.forEach(([numero, estado, minutos], i) => {
    const mesa = mesasClientes.find((m) => m.numero === numero)!;
    mesa.estado_actual = "ocupada";
    crearPedido({
      fecha: new Date(now.getTime() - minutos * 60000),
      mesa,
      mesero: meseros[i % meseros.length],
      estado,
      cerrado: false,
    });
  });

  return { profiles, productos, mesas, pedidos, detalles_pedido };
}
