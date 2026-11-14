// ─────────────────────────────────────────────────────────────────────────────
// DEMO data layer. Same API as ./db.ts, but everything lives in the visitor's
// browser (localStorage). It never talks to Supabase or the restaurant.
// Enabled only when building with VITE_DEMO=true (see vite.config.ts).
// ─────────────────────────────────────────────────────────────────────────────
import { buildDemoDB, type DemoDB } from "@/lib/demoData";
import { startDemoTranslation } from "@/lib/demoI18n";

startDemoTranslation();
import type {
  EstadoPedido,
  Producto,
  Mesa,
  Pedido,
  NuevoDetalle,
  ProfileUser,
  ResumenDia,
  MeseroStats,
  ConsumoPersonalItem,
  ConsumoPersonalCategoria,
  ConsumoPersonalDetalle,
  UsuarioAdmin,
} from "./db";

export type {
  EstadoPedido,
  EstadoMesa,
  DestinoImpresion,
  Producto,
  Mesa,
  DetallePedido,
  Pedido,
  NuevoDetalle,
  ProfileUser,
  ResumenDia,
  MeseroStats,
  ConsumoPersonalItem,
  ConsumoPersonalCategoria,
  ConsumoPersonalDetalle,
  UsuarioAdmin,
} from "./db";

type Row = Record<string, any>;

const KEY = "sazon_demo_db_v2";
export const DEMO_CHANGE_EVENT = "sazon-demo-change";

function load(): DemoDB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  const fresh = buildDemoDB();
  save(fresh, false);
  return fresh;
}

function save(db: DemoDB, notify = true) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
  } catch {
    /* ignore */
  }
  if (notify) window.dispatchEvent(new Event(DEMO_CHANGE_EVENT));
}

export function resetDemo() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem("sazon_current_user");
  } catch {
    /* ignore */
  }
  location.reload();
}

const wait = (ms = 120) => new Promise((r) => setTimeout(r, ms));
const uuid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
const nowIso = () => new Date().toISOString();
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
const startOfDay = (desdeDias = 1) => {
  const d = new Date();
  d.setDate(d.getDate() - desdeDias + 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

function joinPedido(db: DemoDB, p: Row): Pedido {
  const mesa = db.mesas.find((m) => m.uuid === p.mesa_id);
  const mesero = db.profiles.find((u) => u.uuid === p.mesero_id);
  const detalles = db.detalles_pedido
    .filter((d) => d.pedido_id === p.uuid)
    .map((d) => {
      const prod = db.productos.find((x) => x.uuid === d.producto_id);
      return {
        ...d,
        productos: prod
          ? {
              uuid: prod.uuid,
              nombre: prod.nombre,
              precio: prod.precio,
              categoria: prod.categoria,
              disponible: prod.disponible,
              destino_impresion: prod.destino_impresion,
            }
          : undefined,
      };
    });
  return clone({
    ...p,
    mesas: mesa ? { numero: mesa.numero, estado_actual: mesa.estado_actual, es_personal: mesa.es_personal } : undefined,
    detalles_pedido: detalles,
    profiles: mesero ? { nombre: mesero.nombre, color: mesero.color } : undefined,
  }) as Pedido;
}

const esActivo = (p: Row) => !["entregado", "cancelado"].includes(p.estado) && !p.cerrado_at;
const esCobrado = (p: Row) => p.estado === "cancelado" && !!p.cerrado_at;

function recalcularTotal(db: DemoDB, pedidoUuid: string) {
  const p = db.pedidos.find((x) => x.uuid === pedidoUuid);
  if (!p) return;
  p.total = db.detalles_pedido
    .filter((d) => d.pedido_id === pedidoUuid)
    .reduce((s, d) => s + Number(d.precio_historico) * Number(d.cantidad), 0);
  p.updated_at = nowIso();
}

function setMesa(db: DemoDB, mesaUuid: string, estado: "libre" | "ocupada") {
  const m = db.mesas.find((x) => x.uuid === mesaUuid);
  if (m) m.estado_actual = estado;
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export async function loginWithPin(pin: string): Promise<ProfileUser | null> {
  await wait(250);
  const db = load();
  const u = db.profiles.find((p) => p.pin === pin && p.activo);
  if (!u) return null;
  return { id: u.uuid, name: u.nombre, role: u.rol };
}

export async function verifySession(_userId?: string, _sessionToken?: string): Promise<boolean> {
  return true;
}

// ── Usuarios ─────────────────────────────────────────────────────────────────

export async function getUsuarios(): Promise<UsuarioAdmin[]> {
  await wait();
  const db = load();
  return clone(db.profiles)
    .map(({ uuid, nombre, rol, pin, activo, color }) => ({ uuid, nombre, rol, pin, activo, color }))
    .sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export async function createUsuario(payload: Omit<UsuarioAdmin, "uuid">): Promise<void> {
  await wait();
  const db = load();
  if (db.profiles.some((p) => p.pin === payload.pin)) throw new Error("That PIN is already in use");
  db.profiles.push({ uuid: uuid(), color: "#a855f7", ...payload });
  save(db);
}

export async function updateUsuario(id: string, payload: Partial<Omit<UsuarioAdmin, "uuid">>): Promise<void> {
  await wait();
  const db = load();
  const u = db.profiles.find((p) => p.uuid === id);
  if (u) Object.assign(u, payload);
  save(db);
}

export async function deleteUsuario(id: string): Promise<void> {
  await wait();
  const db = load();
  db.profiles = db.profiles.filter((p) => p.uuid !== id);
  save(db);
}

// ── Productos ────────────────────────────────────────────────────────────────

export async function getProductos(soloDisponibles = true): Promise<Producto[]> {
  await wait();
  const db = load();
  return clone(db.productos)
    .filter((p) => !soloDisponibles || p.disponible)
    .sort((a, b) => a.categoria.localeCompare(b.categoria))
    .map(({ uuid, nombre, precio, categoria, disponible, destino_impresion }) => ({
      uuid,
      nombre,
      precio,
      categoria,
      disponible,
      destino_impresion,
    }));
}

export async function createProducto(payload: Omit<Producto, "uuid">): Promise<Producto> {
  await wait();
  const db = load();
  const p = { uuid: uuid(), ...payload, created_at: nowIso(), updated_at: nowIso() };
  db.productos.push(p);
  save(db);
  return clone(p) as Producto;
}

export async function updateProducto(id: string, payload: Partial<Omit<Producto, "uuid">>): Promise<void> {
  await wait();
  const db = load();
  const p = db.productos.find((x) => x.uuid === id);
  if (p) Object.assign(p, payload, { updated_at: nowIso() });
  save(db);
}

export async function deleteProducto(id: string): Promise<void> {
  await wait();
  const db = load();
  if (db.detalles_pedido.some((d) => d.producto_id === id)) {
    // Same behaviour as the real DB (foreign key): products with orders can't be deleted
    throw { code: "23503", message: "This product has recorded orders" };
  }
  db.productos = db.productos.filter((x) => x.uuid !== id);
  save(db);
}

// ── Mesas ────────────────────────────────────────────────────────────────────

export async function getMesas(): Promise<Mesa[]> {
  await wait();
  const db = load();
  return clone(db.mesas).sort((a, b) => a.numero - b.numero) as Mesa[];
}

export async function createMesa(numero: number, esPersonal = false): Promise<Mesa> {
  await wait();
  const db = load();
  let n = numero;
  while (db.mesas.some((m) => m.numero === n)) n++;
  const m = { uuid: uuid(), numero: n, estado_actual: "libre", es_personal: esPersonal };
  db.mesas.push(m);
  save(db);
  return clone(m) as Mesa;
}

export async function deleteMesa(id: string): Promise<void> {
  await wait();
  const db = load();
  db.mesas = db.mesas.filter((m) => m.uuid !== id);
  save(db);
}

// ── Resumen del día ──────────────────────────────────────────────────────────

export async function getResumenHoy(): Promise<ResumenDia> {
  await wait();
  const db = load();
  const desde = startOfDay(1);
  const todos = db.pedidos
    .filter((p) => p.estado === "cancelado" && p.cerrado_at && p.cerrado_at >= desde && p.motivo !== "anulado")
    .map((p) => joinPedido(db, p));
  const pedidos = todos.filter((p) => !p.mesas?.es_personal);
  const personal = todos.filter((p) => p.mesas?.es_personal);

  const totalRecaudado = pedidos.reduce((s, p) => s + Number(p.total), 0);
  const cantidadPedidos = pedidos.length;
  const conteo: Record<string, number> = {};
  pedidos.forEach((p) =>
    (p.detalles_pedido ?? []).forEach((d) => {
      const nombre = d.productos?.nombre ?? d.nombre_extra ?? "Extra";
      conteo[nombre] = (conteo[nombre] ?? 0) + d.cantidad;
    })
  );
  const top = Object.entries(conteo).sort((a, b) => b[1] - a[1])[0];

  return {
    totalRecaudado,
    cantidadPedidos,
    ticketPromedio: cantidadPedidos ? totalRecaudado / cantidadPedidos : 0,
    cantidadClientes: new Set(pedidos.map((p) => p.cliente_nombre).filter(Boolean)).size,
    productoEstrella: top ? { nombre: top[0], cantidad: top[1] } : null,
    consumoPersonal: {
      total: personal.reduce((s, p) => s + Number(p.total), 0),
      cantidadPedidos: personal.length,
    },
  };
}

// ── Reportes ─────────────────────────────────────────────────────────────────

export async function getReportesMeseros(desdeDias = 1): Promise<MeseroStats[]> {
  await wait();
  const db = load();
  const desde = startOfDay(desdeDias);
  const map: Record<string, MeseroStats> = {};
  db.pedidos
    .filter((p) => p.estado === "cancelado" && p.cerrado_at && p.cerrado_at >= desde)
    .map((p) => joinPedido(db, p))
    .filter((p) => !p.mesas?.es_personal)
    .forEach((p) => {
      const id = p.mesero_id;
      if (!map[id]) map[id] = { mesero_id: id, nombre: p.profiles?.nombre ?? "Desconocido", total: 0, pedidos: 0 };
      map[id].total += Number(p.total);
      map[id].pedidos += 1;
    });
  return Object.values(map).sort((a, b) => b.total - a.total);
}

export async function getConsumoPersonalDetallado(desdeDias = 1): Promise<ConsumoPersonalDetalle> {
  await wait();
  const db = load();
  const desde = startOfDay(desdeDias);
  const pedidos = db.pedidos
    .filter((p) => p.estado === "cancelado" && p.cerrado_at && p.cerrado_at >= desde)
    .map((p) => joinPedido(db, p))
    .filter((p) => p.mesas?.es_personal);

  const itemMap: Record<string, ConsumoPersonalItem> = {};
  pedidos.forEach((p) =>
    (p.detalles_pedido ?? []).forEach((d) => {
      const nombre = d.productos?.nombre ?? d.nombre_extra ?? "Extra";
      const categoria = d.productos?.categoria ?? "Sin categoría";
      const key = `${categoria}|${nombre}`;
      if (!itemMap[key]) itemMap[key] = { nombre, categoria, cantidad: 0, total: 0 };
      itemMap[key].cantidad += d.cantidad;
      itemMap[key].total += d.precio_historico * d.cantidad;
    })
  );
  const porCategoria: Record<string, ConsumoPersonalCategoria> = {};
  Object.values(itemMap).forEach((item) => {
    if (!porCategoria[item.categoria])
      porCategoria[item.categoria] = { categoria: item.categoria, total: 0, cantidad: 0, items: [] };
    porCategoria[item.categoria].total += item.total;
    porCategoria[item.categoria].cantidad += item.cantidad;
    porCategoria[item.categoria].items.push(item);
  });

  return {
    total: pedidos.reduce((s, p) => s + Number(p.total), 0),
    cantidadPedidos: pedidos.length,
    categorias: Object.values(porCategoria)
      .map((c) => ({ ...c, items: c.items.sort((a, b) => b.total - a.total) }))
      .sort((a, b) => b.total - a.total),
  };
}

// ── Pedidos por mesa / cobro ─────────────────────────────────────────────────

export async function getPedidosPorMesa(mesaUuid: string): Promise<Pedido[]> {
  await wait();
  const db = load();
  return db.pedidos
    .filter((p) => p.mesa_id === mesaUuid && esActivo(p))
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .map((p) => joinPedido(db, p));
}

export async function cerrarPedidoIndividual(pedidoUuid: string, mesaUuid: string, esElUltimo: boolean): Promise<void> {
  await wait();
  const db = load();
  const p = db.pedidos.find((x) => x.uuid === pedidoUuid);
  if (p) Object.assign(p, { estado: "cancelado", motivo: "cobrado", cerrado_at: nowIso(), updated_at: nowIso() });
  db.detalles_pedido.filter((d) => d.pedido_id === pedidoUuid).forEach((d) => (d.cobrado = true));
  if (esElUltimo) setMesa(db, mesaUuid, "libre");
  save(db);
}

export async function agregarDetallesAPedido(pedidoUuid: string, detalles: NuevoDetalle[]): Promise<void> {
  await wait();
  const db = load();
  detalles.forEach((d) => db.detalles_pedido.push({ uuid: uuid(), cobrado: false, ...d, pedido_id: pedidoUuid }));
  recalcularTotal(db, pedidoUuid);
  save(db);
}

export async function cancelarPedido(pedidoUuid: string, mesaUuid: string): Promise<void> {
  await wait();
  const db = load();
  const p = db.pedidos.find((x) => x.uuid === pedidoUuid);
  if (p) Object.assign(p, { estado: "cancelado", motivo: "anulado", cerrado_at: nowIso(), updated_at: nowIso() });
  if (!db.pedidos.some((x) => x.mesa_id === mesaUuid && x.estado !== "cancelado")) setMesa(db, mesaUuid, "libre");
  save(db);
}

export async function cobrarDetalles(
  detalleUuids: string[],
  pedidoUuid: string,
  mesaUuid: string,
  cerrarPedido: boolean,
  liberarMesa: boolean
): Promise<void> {
  await wait();
  const db = load();
  db.detalles_pedido.filter((d) => detalleUuids.includes(d.uuid)).forEach((d) => (d.cobrado = true));
  if (cerrarPedido) {
    const p = db.pedidos.find((x) => x.uuid === pedidoUuid);
    if (p) Object.assign(p, { estado: "cancelado", motivo: "cobrado", cerrado_at: nowIso(), updated_at: nowIso() });
  }
  if (liberarMesa) setMesa(db, mesaUuid, "libre");
  save(db);
}

// ── Pedidos ──────────────────────────────────────────────────────────────────

export async function getTodosPedidos(): Promise<Pedido[]> {
  await wait();
  const db = load();
  return [...db.pedidos]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 300)
    .map((p) => joinPedido(db, p));
}

export async function getPedidosCerrados(): Promise<Pedido[]> {
  await wait();
  const db = load();
  return db.pedidos
    .filter(esCobrado)
    .sort((a, b) => b.cerrado_at.localeCompare(a.cerrado_at))
    .map((p) => joinPedido(db, p));
}

export async function getPedidosActivos(): Promise<Pedido[]> {
  await wait();
  const db = load();
  return db.pedidos.filter(esActivo).map((p) => joinPedido(db, p));
}

export async function createPedido(
  mesaNumero: number,
  detalles: NuevoDetalle[],
  meseroId: string,
  clienteNombre?: string
): Promise<Pedido> {
  await wait();
  const db = load();
  const mesa = db.mesas.find((m) => m.numero === mesaNumero);
  if (!mesa) throw new Error(`Table ${mesaNumero} not found`);
  const now = nowIso();
  const pedido: Row = {
    uuid: uuid(),
    mesa_id: mesa.uuid,
    mesero_id: meseroId,
    cliente_nombre: clienteNombre ?? null,
    estado: "pendiente",
    total: detalles.reduce((s, d) => s + d.precio_historico * d.cantidad, 0),
    created_at: now,
    updated_at: now,
    cerrado_at: null,
    motivo: null,
  };
  db.pedidos.push(pedido);
  detalles.forEach((d) => db.detalles_pedido.push({ uuid: uuid(), cobrado: false, ...d, pedido_id: pedido.uuid }));
  mesa.estado_actual = "ocupada";
  save(db);
  return clone(pedido) as Pedido;
}

export async function updateEstadoPedido(pedidoUuid: string, estado: EstadoPedido, mesaId?: string): Promise<void> {
  await wait();
  const db = load();
  const p = db.pedidos.find((x) => x.uuid === pedidoUuid);
  if (p) {
    p.estado = estado;
    p.updated_at = nowIso();
    if (estado === "entregado" || estado === "cancelado") p.cerrado_at = nowIso();
  }
  if ((estado === "entregado" || estado === "cancelado") && mesaId) setMesa(db, mesaId, "libre");
  save(db);
}

export async function deletePedido(pedidoUuid: string, mesaId?: string): Promise<void> {
  await wait();
  const db = load();
  db.detalles_pedido = db.detalles_pedido.filter((d) => d.pedido_id !== pedidoUuid);
  db.pedidos = db.pedidos.filter((p) => p.uuid !== pedidoUuid);
  if (mesaId) setMesa(db, mesaId, "libre");
  save(db);
}

// ── Demo banner (plain DOM, no impact on the app's components) ──────────────

function mountBanner() {
  if (typeof document === "undefined" || document.getElementById("sazon-demo-banner")) return;
  const el = document.createElement("div");
  el.id = "sazon-demo-banner";
  el.style.cssText =
    "position:fixed;left:50%;top:6px;transform:translateX(-50%);z-index:2147483000;" +
    "background:rgba(26,22,14,.94);color:#f5e9d4;border:1px solid #f2a33a;border-radius:999px;" +
    "padding:3px 6px 3px 12px;font:11px/1.3 system-ui,sans-serif;display:flex;gap:10px;align-items:center;" +
    "box-shadow:0 6px 24px rgba(0,0,0,.35);max-width:calc(100vw - 24px);flex-wrap:wrap;justify-content:center";
  el.innerHTML =
    '<span><b style="color:#f2a33a">DEMO</b> · PIN admin <b>1234</b> · waiter <b>1111</b></span>' +
    '<button id="sazon-demo-reset" style="background:#f2a33a;color:#1a160e;border:0;border-radius:999px;padding:2px 8px;font-weight:600;cursor:pointer" title="Reset demo">↺</button>' +
    '<button id="sazon-demo-hide" aria-label="Hide" style="background:transparent;color:#f5e9d4;border:0;cursor:pointer;padding:0 4px">✕</button>';
  document.body.appendChild(el);
  el.querySelector("#sazon-demo-reset")?.addEventListener("click", () => {
    if (confirm("Reset the demo to the sample data?")) resetDemo();
  });
  el.querySelector("#sazon-demo-hide")?.addEventListener("click", () => el.remove());
}

if (typeof window !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mountBanner);
  else mountBanner();
}
