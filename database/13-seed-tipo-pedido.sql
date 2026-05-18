-- Modalidad del pedido (`pedidos.fk_tipo_pedido`): plazo de servicio.
-- Despacho vs recolección va en `metodo_recepcion` (seed 08).
-- Ejecutar después de 01-schema-numeric-ids.sql

INSERT INTO public.tipo_pedido (nombre) VALUES
  ('Normal'),
  ('Express');

-- Total: 2
-- IDs si tabla vacía: 1=Normal, 2=Express
-- Verificar: SELECT id_tipo_pedido, nombre FROM public.tipo_pedido ORDER BY id_tipo_pedido;
