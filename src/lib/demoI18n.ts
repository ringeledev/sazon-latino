// @ts-nocheck
// DEMO ONLY: translates the (Spanish) UI to English at runtime for the public demo.
// The real app keeps its Spanish UI; this file is only loaded in the VITE_DEMO build.

const EXACT = {
  // Navigation / layout
  "Mesas": "Tables", "Pedidos": "Orders", "Reportes": "Reports", "Menú": "Menu", "Usuarios": "Users",
  "Impresoras": "Printers", "Cocina": "Kitchen", "Cerrar Sesión": "Log out", "¿Cerrar sesión?": "Log out?",
  "¿Estás seguro que querés salir?": "Are you sure you want to log out?", "Sí, salir": "Yes, log out",
  "Admin": "Admin", "Mesero": "Waiter", "Administrador": "Administrator",
  "Ingresa tu PIN para continuar": "Enter your PIN to continue", "PIN incorrecto": "Wrong PIN",
  "Sesión cerrada": "Session closed", "Entendido": "Got it",
  "Tu sesión fue cerrada porque el usuario inició sesión en otro dispositivo.": "Your session was closed because this user logged in on another device.",
  // Statuses
  "Pendiente": "Pending", "En preparación": "Preparing", "Listo": "Ready", "Entregado": "Delivered",
  "Cobrado": "Paid", "Cobrados": "Paid", "Anulado": "Voided", "Anulados": "Voided", "Activos": "Active",
  "Disponible": "Available", "Ocupada": "Occupied", "Libre": "Free", "Activo": "Active", "Inactivo": "Inactive",
  "En línea": "Online", "Sin conexión": "Offline",
  // Dashboard / summary
  "Resumen de hoy": "Today's summary", "Recaudado": "Revenue", "Pedidos cobrados": "Paid orders",
  "Ticket promedio": "Average ticket", "Clientes": "Customers", "Producto estrella": "Top product",
  "Consumo Personal": "Staff consumption", "(no es venta a clientes)": "(not customer sales)",
  "Total consumido": "Total consumed", "Bebidas + Extras": "Drinks + extras", "% del total": "% of total",
  "Desglose por categoría": "Breakdown by category", "Sin consumo de personal en este período.": "No staff consumption in this period.",
  "Hoy": "Today", "7 días": "7 days", "30 días": "30 days", "Personal": "Staff",
  "Mesa Personal": "Staff table", "Agregar Mesa": "Add table", "Nueva Mesa": "New table",
  "Nueva Mesa Personal": "New staff table", "Número de mesa": "Table number", "Número de personal": "Staff number",
  "Crear": "Create", "Ya existe una mesa con ese número.": "A table with that number already exists.",
  "No se pudo agregar la mesa": "Could not add the table", "No se pudo cargar el resumen.": "Could not load the summary.",
  "sin nombre registrado": "no name recorded", "Eliminar Mesa": "Delete table",
  // Orders / dialogs
  "Nuevo Pedido": "New order", "Crear Pedido": "Create order", "Nombre del líder de grupo *": "Group leader name *",
  "El nombre del líder es obligatorio.": "The group leader name is required.",
  "Ítem extra": "Extra item", "Ítem extra (precio manual)": "Extra item (manual price)", "Nombre del ítem": "Item name",
  "Agregar": "Add", "Cancelar": "Cancel", "A agregar": "To add", "Total": "Total", "TOTAL": "TOTAL",
  "Ej: sin hielo, sin sal, bien cocido…": "e.g. no ice, no salt, well done…",
  "Agregar nota (sin hielo, sin sal…)": "Add a note (no ice, no salt…)",
  "No se pudo imprimir la comanda": "Could not print the kitchen ticket",
  "No hay pedidos activos en esta mesa.": "No active orders at this table.",
  "Seleccioná los ítems a cobrar:": "Select the items to charge:", "Ya cobrado:": "Already paid:",
  "Total pendiente": "Pending total", "+ Agregar pedido": "+ Add order", "¿Cancelar pedido?": "Cancel order?",
  ". Los ítems no serán cobrados.": ". The items will not be charged.", "Volver": "Back", "Sí, cancelar": "Yes, cancel",
  "No se pudo cobrar": "Could not charge", "Pedido cancelado": "Order cancelled", "Error al cancelar": "Error while cancelling",
  "Sin nombre": "No name", "Seleccioná ítems": "Select items", "Cobrar": "Charge", "Cobrar todo": "Charge all",
  "Sin detalles cargados.": "No details loaded.", "Ver boleta": "View receipt", "Anular": "Void",
  "¿Anular pedido?": "Void order?", "Sí, anular": "Yes, void", "en el historial.": "in the history.",
  "¿El cliente quiere una copia de su boleta?": "Does the customer want a copy of the receipt?",
  "Mesa:": "Table:", "¡Gracias por su visita!": "Thank you for your visit!", "Boleta": "Receipt",
  "Boleta impresa correctamente": "Receipt printed successfully", "No se pudo imprimir la boleta.": "Could not print the receipt.",
  "No se pudo conectar con el servicio de impresión.": "Could not connect to the printing service.",
  "Imprimir": "Print", "Imprimir boleta": "Print receipt", "No": "No", "Sí": "Yes", "Cerrar": "Close",
  "Buscar por mesa, cliente o mesero…": "Search by table, customer or waiter…",
  "No hay pedidos cobrados en este período": "No paid orders in this period", "Sin pedidos": "No orders",
  "Detalle del pedido": "Order details", "Cliente": "Customer", "Fecha": "Date", "Hora": "Time", "Estado": "Status",
  // Kitchen
  "Vista de Cocina": "Kitchen view", "Sin pedidos pendientes": "No pending orders",
  "Los pedidos nuevos aparecen aquí en tiempo real": "New orders show up here in real time",
  "Guardando…": "Saving…", "✓ Listo para entregar": "✓ Ready to serve", "Listo para entregar": "Ready to serve",
  "Empezar": "Start", "Marcar listo": "Mark ready", "Entregar": "Serve",
  // Printers
  "Verificar": "Check", "Verificando conexión...": "Checking connection...",
  "Servidor de impresión conectado": "Print server connected", "Servidor de impresión no disponible": "Print server unavailable",
  "— ¿Está encendida la PC con el middleware?": "— Is the PC running the middleware switched on?",
  "Imprimido": "Printed", "Error": "Error", "Probar": "Test", "*** PRUEBA DE IMPRESORA ***": "*** PRINTER TEST ***",
  "Verificá el estado y probá las impresoras": "Check the status and test the printers",
  // Menu
  "No se pudo cargar el menú": "Could not load the menu", "— Categoría —": "— Category —",
  "Nuevo Producto": "New product", "Editar Producto": "Edit product", "Nombre": "Name", "Precio": "Price",
  "Categoría": "Category", "Guardar": "Save", "Eliminar": "Delete", "Editar": "Edit",
  "El nombre es obligatorio.": "The name is required.", "El precio debe ser mayor a 0.": "The price must be greater than 0.",
  "Error al guardar. Revisá la consola.": "Error while saving. Check the console.",
  "Error al eliminar el producto.": "Error while deleting the product.", "No disponible": "Unavailable",
  "Destino de impresión": "Print destination", "Barra": "Bar", "Ninguno": "None",
  // Categories (data stays Spanish internally, shown in English)
  "Entrada": "Starters", "Plato fuerte": "Main courses", "Postre": "Desserts", "Bocadillos": "Snacks",
  "Bebidas sin alcohol": "Soft drinks", "bebidas sin alcohol": "soft drinks", "Bebidas alcoholicas": "Alcoholic drinks",
  "Shots": "Shots", "Extras bebidas": "Drink extras", "Extras comidas": "Food extras", "Café": "Coffee",
  "Sin categoría": "Uncategorized", "Platos": "Food", "Bebidas": "Drinks", "Comidas": "Food",
  // Reports
  "Exportar Excel": "Export Excel", "General": "Overview", "Por Mesero": "By waiter", "Historial": "History",
  "Diario": "Daily", "Semanal": "Weekly", "Mensual": "Monthly", "Ingresos": "Revenue", "Ticket prom.": "Avg. ticket",
  "Ítems vendidos": "Items sold", "Mesas atendidas": "Tables served", "Ventas por Categoría": "Sales by category",
  "Sin datos": "No data", "Comparativa de Categorías": "Category comparison",
  "No incluido en \"Ingresos\" — es consumo interno, no ventas a clientes.": "Not included in \"Revenue\" — internal consumption, not customer sales.",
  "Ventas por Producto": "Sales by product", "Detalle de Productos": "Product details",
  "Recaudación por Mesero": "Revenue by waiter", "Últimos 30 días": "Last 30 days",
  "Bebidas más vendidas": "Best-selling drinks", "Comidas más vendidas": "Best-selling food",
  "Historial de Transacciones": "Transaction history", "Sin historial": "No history", "Día": "Day",
  "Cargando...": "Loading...", "Producto": "Product", "Cantidad": "Quantity", "Mesa": "Table", "Pedido": "Order",
  "Cant.": "Qty.", "Unidades": "Units", "Vendidos": "Sold", "Monto": "Amount",
  // Users
  "Nuevo usuario": "New user", "Editar usuario": "Edit user", "Sin registros": "No records", "PIN": "PIN", "Rol": "Role",
  "Color identificador": "Identifier color", "Usuario activo": "Active user", "¿Eliminar a": "Delete",
  "Esta acción no se puede deshacer.": "This action cannot be undone.",
  "No se pudieron cargar los usuarios": "Could not load the users", "El nombre es obligatorio": "The name is required",
  "El PIN debe tener al menos 4 dígitos": "The PIN must have at least 4 digits",
  "El PIN solo puede contener números": "The PIN can only contain numbers", "Error al guardar": "Error while saving",
  "No podés eliminar tu propio usuario": "You can't delete your own user", "Error al eliminar": "Error while deleting",
  "No podés desactivarte a vos mismo": "You can't deactivate yourself", "Ej: Juan García": "e.g. John Smith",
  "Mínimo 4 dígitos": "At least 4 digits",
  // 404
  "Oops! Page not found": "Oops! Page not found", "Return to Home": "Return to Home",
  // More UI fragments
  "Todo": "All", "pedidos": "orders", "pedido": "order", "unidades": "units", "unidades ·": "units ·",
  "es bebida": "are drinks", "Solo disponibles": "Available only", "usuarios registrados": "registered users",
  "Administradores": "Administrators", "Desactivar": "Deactivate", "Activar": "Activate", "Meseros": "Waiters",
  "Consumo Personal: $": "Staff consumption: $", "Ganancias por": "Revenue by", "vendidos": "sold", "vendido": "sold",
  "cobrado": "paid", "prom. $": "avg. $", "pedidos cobrados en total": "paid orders in total",
  "ítems ·": "items ·", "ítems": "items", "ítem": "item", "PIN:": "PIN:",
  // Category labels split over two lines in charts
  "Bebidas sin": "Soft", "alcohol": "drinks", "alcoholicas": "(alcoholic)", "alcohólicas": "(alcoholic)",
  "Plato": "Main", "fuerte": "courses", "Extras": "Extras", "comidas": "(food)", "bebidas": "(drinks)",
  "Bebidas alcohólicas": "Alcoholic drinks", "Extras bebidas ": "Drink extras",
};

// Phrase-level rules for mixed / dynamic text (applied in order)
const RULES = [
  [/¿Eliminar Mesa (\d+)\?/g, "Delete table $1?"],
  [/¿Estás seguro de que deseas eliminar la Mesa (\d+)\?/g, "Are you sure you want to delete table $1?"],
  [/¿Eliminar "(.+)"\?/g, 'Delete "$1"?'],
  [/Nuevo Pedido/g, "New order"],
  [/Agregar ítems/gi, "Add items"],
  [/Mesa Personal/g, "Staff table"],
  [/\bMesa\b/g, "Table"],
  [/\bmesa\b/g, "table"],
  [/\bPersonal (\d+)/g, "Staff $1"],
  [/(\d+) vendidos?/g, "$1 sold"],
  [/(\d+) pedidos?/g, "$1 orders"],
  [/(\d+) ítems?/g, "$1 items"],
  [/(\d+) min\b/g, "$1 min"],
  [/hace (\d+)/g, "$1 ago"],
  [/Resumen de hoy/g, "Today's summary"],
  [/Pedidos cobrados/g, "Paid orders"],
  [/Error al ([^:]+):/g, "Error:"],
  [/generado/g, "generated"],
  [/Diario/g, "Daily"], [/Semanal/g, "Weekly"], [/Mensual/g, "Monthly"],
  [/\bLíder\b/g, "Leader"], [/\blíder\b/g, "leader"],
  [/\bMesero\b/g, "Waiter"], [/\bmesero\b/g, "waiter"],
  [/ya tiene un pedido/g, "already has an order"],
  [/tiene pedidos registrados/g, "has recorded orders"],
  [/Demo: comanda de Table (\d+) enviada a/g, "Demo: Table $1 ticket sent to"],
];

const SPANISH_DAYS = { lunes: "Monday", martes: "Tuesday", "miércoles": "Wednesday", jueves: "Thursday", viernes: "Friday", "sábado": "Saturday", domingo: "Sunday" };

function translateString(s) {
  if (!s || !/[A-Za-zÁÉÍÓÚáéíóúñÑ¿¡]/.test(s)) return s;
  const key = s.trim();
  if (Object.prototype.hasOwnProperty.call(EXACT, key)) {
    const lead = s.match(/^\s*/)[0];
    const trail = s.match(/\s*$/)[0];
    return lead + EXACT[key] + trail;
  }
  const bullet = s.match(/^(\s*[·•]\s*)(.+?)(\s*)$/);
  if (bullet && Object.prototype.hasOwnProperty.call(EXACT, bullet[2])) return bullet[1] + EXACT[bullet[2]] + bullet[3];
  let out = s;
  for (const [re, rep] of RULES) out = out.replace(re, rep);
  return out;
}

const ATTRS = ["placeholder", "title", "aria-label"];
const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA", "CODE"]);

function translateNode(node) {
  if (node.nodeType === 3) {
    const p = node.parentNode;
    if (p && (SKIP.has(p.nodeName) || p.isContentEditable)) return;
    const v = node.nodeValue;
    const t = translateString(v);
    if (t !== v) node.nodeValue = t;
    return;
  }
  if (node.nodeType !== 1 || SKIP.has(node.nodeName)) return;
  for (const a of ATTRS) {
    const v = node.getAttribute(a);
    if (v) {
      const t = translateString(v);
      if (t !== v) node.setAttribute(a, t);
    }
  }
  if (node.nodeName === "OPTION") {
    const t = translateString(node.text);
    if (t !== node.text) node.text = t;
  }
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  let n = walker.nextNode();
  while (n) {
    if (n.nodeType === 3) translateNode(n);
    else if (!SKIP.has(n.nodeName)) {
      for (const a of ATTRS) {
        const v = n.getAttribute(a);
        if (v) {
          const t = translateString(v);
          if (t !== v) n.setAttribute(a, t);
        }
      }
    }
    n = walker.nextNode();
  }
}

export function startDemoTranslation() {
  if (typeof window === "undefined" || window.__sazonI18n) return;
  window.__sazonI18n = true;
  document.documentElement.lang = "en";
  document.title = "Sazón Latino — Restaurant POS (live demo)";

  // Dates: show them in English
  const toEn = (loc) => (typeof loc === "string" && loc.startsWith("es") ? "en-US" : loc);
  const D = Date.prototype;
  const ls = D.toLocaleString, lds = D.toLocaleDateString, lts = D.toLocaleTimeString;
  D.toLocaleString = function (l, o) { return ls.call(this, toEn(l), o); };
  D.toLocaleDateString = function (l, o) { return lds.call(this, toEn(l), o); };
  D.toLocaleTimeString = function (l, o) { return lts.call(this, toEn(l), o); };
  const NF = Number.prototype.toLocaleString;
  Number.prototype.toLocaleString = function (l, o) { return NF.call(this, toEn(l), o); };

  // Native dialogs
  const c = window.confirm.bind(window), a = window.alert.bind(window);
  window.confirm = (m) => c(translateString(String(m ?? "")));
  window.alert = (m) => a(translateString(String(m ?? "")));

  const run = () => {
    translateNode(document.body);
    new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === "characterData") translateNode(m.target);
        else if (m.type === "attributes") translateNode(m.target);
        else m.addedNodes.forEach(translateNode);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  };
  if (document.body) run();
  else document.addEventListener("DOMContentLoaded", run);
}

export { translateString, SPANISH_DAYS };
