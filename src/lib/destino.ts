import type { DestinoImpresion } from "@/services/db";

/**
 * Fuente única de verdad: qué impresora recibe cada categoría.
 * - Barra: todas las bebidas (alcohólicas, sin alcohol, café, shots, extras bebidas)
 * - Cocina: todo lo que preparan los chefs (entradas, platos, bocadillos, postres, extras comidas)
 */
const normalizar = (s?: string | null) =>
  (s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();

const CATEGORIAS_BARRA = new Set([
  "bebidas alcoholicas",
  "bebidas sin alcohol",
  "bebidas",
  "bebida",
  "cafe",
  "cafes",
  "shots",
  "shot",
  "extras bebidas",
  "extra bebidas",
  "extras bebida",
]);

export const esCategoriaBebida = (categoria?: string | null) => {
  const c = normalizar(categoria);
  return CATEGORIAS_BARRA.has(c) || c.startsWith("bebida");
};

export const destinoPorCategoria = (categoria?: string | null): DestinoImpresion =>
  esCategoriaBebida(categoria) ? "barra" : "cocina";

export const esCategoriaExtras = (categoria?: string | null) => normalizar(categoria).startsWith("extra");
