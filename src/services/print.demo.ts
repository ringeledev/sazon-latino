// DEMO printing: simulates the thermal printers. Nothing leaves the browser.
import type { Pedido } from "@/services/db";
import { toast } from "sonner";

export const PRINT_URL = "https://impresora-demo.invalid";

export interface PrintResult {
  success: boolean;
  error?: string;
}

export interface ItemParaComanda {
  cantidad: number;
  nombre: string;
  notas?: string;
  destino: "cocina" | "barra" | "ninguno" | string;
}

const wait = (ms = 300) => new Promise((r) => setTimeout(r, ms));

function aviso(msg: string) {
  try {
    toast.info(`🖨️ Demo: ${msg}`, { description: "Impresión simulada — en el restaurante sale por la impresora térmica." });
  } catch {
    /* ignore */
  }
}

export async function imprimirComandasDeItems(
  items: ItemParaComanda[],
  mesaNumero: number,
  _lider?: string,
  _mesero?: string
): Promise<PrintResult[]> {
  await wait();
  const destinos = Array.from(new Set(items.map((i) => i.destino).filter((d) => d && d !== "ninguno")));
  if (destinos.length) aviso(`comanda de Mesa ${mesaNumero} enviada a ${destinos.join(" y ")}`);
  return destinos.map(() => ({ success: true }));
}

export async function imprimirComandas(pedido: Pedido, mesaNumero: number): Promise<PrintResult[]> {
  const items: ItemParaComanda[] = (pedido.detalles_pedido ?? []).map((d) => ({
    cantidad: d.cantidad,
    nombre: d.productos?.nombre ?? d.nombre_extra ?? "Extra",
    notas: d.notas,
    destino: d.productos?.destino_impresion ?? "cocina",
  }));
  return imprimirComandasDeItems(items, mesaNumero);
}

export async function imprimirBoletaYAbrirGaveta(
  mesaNumero: number,
  _items: unknown[],
  total: number,
  _lider?: string,
  _mesero?: string
): Promise<PrintResult> {
  await wait();
  aviso(`boleta de Mesa ${mesaNumero} ($${Number(total).toFixed(2)}) y apertura de caja`);
  return { success: true };
}

export async function chequearImpresoras(): Promise<{ id: string; nombre: string; online: boolean }[]> {
  await wait(400);
  return [
    { id: "cocina", nombre: "Cocina (demo)", online: true },
    { id: "barra", nombre: "Barra (demo)", online: true },
    { id: "caja", nombre: "Caja (demo)", online: true },
  ];
}

// The printer test panel calls fetch(`${PRINT_URL}/api/print/...`) directly → answer it locally.
if (typeof window !== "undefined" && !(window as any).__sazonDemoFetch) {
  (window as any).__sazonDemoFetch = true;
  const original = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
    if (url.startsWith(PRINT_URL)) {
      aviso("ticket de prueba impreso");
      return Promise.resolve(
        new Response(JSON.stringify({ success: true }), { headers: { "Content-Type": "application/json" } })
      );
    }
    return original(input as any, init);
  };
}
