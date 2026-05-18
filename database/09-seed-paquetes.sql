-- Catálogo de tipos de paquete (peso máx. referencial en kg y precio base del envío).
-- Al crear un pedido hoy se inserta un `paquete` por envío; estos registros sirven de plantilla / catálogo.
-- Ejecutar después de 01-schema-numeric-ids.sql

INSERT INTO public.paquete (nombre, peso, precio) VALUES
  ('Pequeño (0-10 kg)', 10, 100000),
  ('Mediano (10-20 kg)', 20, 200000),
  ('Grande (30-40 kg)', 40, 300000);

-- peso = tope referencial del rango en kg
-- precio en COP (ajuste si aplica)
-- Si «pequeño» debía ser 1.000.000 y no 100.000, corrija la fila 1.
-- Total: 3 | IDs: 1=Pequeño, 2=Mediano, 3=Grande
