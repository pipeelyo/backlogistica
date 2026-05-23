-- Catálogo estado_factura (requerido antes de insertar facturas).
-- Para instalación completa use: database/factura-install.sql

CREATE TABLE IF NOT EXISTS public.estado_factura (
  id_estado_factura integer PRIMARY KEY,
  nombre varchar(80) NOT NULL UNIQUE
);

INSERT INTO public.estado_factura (id_estado_factura, nombre) VALUES
  (1, 'Creada'),
  (2, 'Pagada'),
  (3, 'Por cobrar'),
  (4, 'Saldo a favor')
ON CONFLICT (id_estado_factura) DO UPDATE SET nombre = EXCLUDED.nombre;
