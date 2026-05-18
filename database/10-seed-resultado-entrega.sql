-- Resultado del formulario de cierre de ruta (descripcion_seguimiento.fk_resultado_entrega).
-- Ejecutar después de 01-schema-numeric-ids.sql
-- Códigos usados por la API: EXITO y NOVEDADES → pedido pasa a «Entregado»; NO_ENTREGADO y RECHAZADO → sigue en ruta.

INSERT INTO public.resultado_entrega (nombre, codigo) VALUES
  ('Exitoso', 'EXITO'),
  ('Exitoso con comentarios', 'NOVEDADES'),
  ('No entregado', 'NO_ENTREGADO'),
  ('Rechazado por el destinatario', 'RECHAZADO');

-- Total: 4
-- IDs si tabla vacía: 1=Exitoso, 2=Exitoso con comentarios, 3=No entregado, 4=Rechazado
