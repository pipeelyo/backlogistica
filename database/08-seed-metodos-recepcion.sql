-- Cómo se recibe el paquete al crear el pedido (pedidos.fk_metodo_recepcion).
-- Ejecutar después de 01-schema-numeric-ids.sql

INSERT INTO public.metodo_recepcion (nombre) VALUES
  ('Recogida'),
  ('Entrega');

-- Recogida = el cliente lleva el paquete a un punto / se recolecta.
-- Entrega = domicilio / entrega en dirección del destinatario.
-- Total: 2 métodos
-- IDs si tabla vacía: 1=Recogida, 2=Entrega
-- Verificar: SELECT id_metodo_recepcion, nombre FROM public.metodo_recepcion ORDER BY id_metodo_recepcion;
