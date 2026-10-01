-- Trigger: calcula destino_impresion automáticamente según la categoría
-- cada vez que se inserta o actualiza un producto. Así nunca más se desincroniza,
-- sin importar qué código (Menu.tsx, NewOrderDialog, etc.) haya creado el producto.

CREATE OR REPLACE FUNCTION calcular_destino_impresion()
RETURNS TRIGGER AS $$
BEGIN
  IF TRIM(LOWER(NEW.categoria)) IN ('bebidas alcoholicas', 'bebidas alcohólicas', 'bebidas sin alcohol', 'café', 'cafe', 'shots', 'shot', 'bebidas', 'extras bebidas', 'bebida', 'extra bebidas', 'extras bebida') THEN
    NEW.destino_impresion := 'barra';
  ELSIF TRIM(LOWER(NEW.categoria)) IN ('entrada', 'entradas', 'plato fuerte', 'platos fuertes', 'bocadillos', 'postre', 'postres', 'comida', 'comidas', 'extras comidas', 'extra comidas', 'extras comida') THEN
    NEW.destino_impresion := 'cocina';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_destino_impresion ON productos;

CREATE TRIGGER trg_destino_impresion
  BEFORE INSERT OR UPDATE ON productos
  FOR EACH ROW
  EXECUTE FUNCTION calcular_destino_impresion();
