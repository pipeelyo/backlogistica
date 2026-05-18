-- Estados del flujo de pedido.
-- Ejecutar después de 01-schema-numeric-ids.sql
-- IDs asignados por secuencia (1=Creado, 2=Asignado, …) si la tabla está vacía.

INSERT INTO public.estado_pedido (nombre) VALUES
  ('Creado'),
  ('Asignado'),
  ('Recibido por el repartidor'),
  ('En curso'),
  ('Entregado'),
  ('Cancelado'),
  ('No entregado');

-- Total: 7 estados
-- Verificar: SELECT id_estado_pedido, nombre FROM public.estado_pedido ORDER BY id_estado_pedido;
