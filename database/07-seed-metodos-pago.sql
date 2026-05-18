-- Métodos de pago al cobrar en destino (confirmar entrega → pedidos.fk_metodo_pago).
-- Ejecutar después de 01-schema-numeric-ids.sql
-- La API usa el campo codigo (mayúsculas) o id numérico vía GET /catalogo/metodos-pago.

INSERT INTO public.metodo_pago (nombre, codigo) VALUES
  ('Efectivo', 'EFECTIVO'),
  ('Transferencia', 'TRANSFERENCIA'),
  ('Bre-B', 'BRE_B'),
  ('Datafono', 'DATAFONO'),
  ('Nequi', 'NEQUI'),
  ('Daviplata', 'DAVIPLATA'),
  ('QR / Link de pago', 'QR');

-- Transferencia = transferencia bancaria clásica (cuenta, sin llave Bre-B).
-- Bre-B = pago con llaves del sistema interoperable Bre-B.
-- Total: 7 métodos
-- IDs si tabla vacía: 1=Efectivo, 2=Transferencia, 3=Bre-B, 4=Datafono, 5=Nequi, 6=Daviplata, 7=QR
-- Verificar: SELECT id_metodo_pago, nombre, codigo FROM public.metodo_pago ORDER BY id_metodo_pago;
