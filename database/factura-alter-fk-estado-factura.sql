-- Relación factura ↔ estado_factura
-- Ejecutar en Supabase SQL Editor DESPUÉS de:
--   1) CREATE TABLE estado_factura (+ semilla en 16-seed-estados-factura.sql)
--   2) Tener la tabla factura (factura-install.sql o esquema previo)

BEGIN;

-- 1) Columna FK en factura (si aún no existe)
ALTER TABLE public.factura
  ADD COLUMN IF NOT EXISTS fk_estado_factura integer;

-- 2) Valor por defecto para filas existentes → estado "Creada" (id = 1)
UPDATE public.factura
SET fk_estado_factura = 1
WHERE fk_estado_factura IS NULL;

-- 3) Obligatorio en adelante
ALTER TABLE public.factura
  ALTER COLUMN fk_estado_factura SET NOT NULL;

-- 4) Quitar FK anterior si existía con otro nombre (re-ejecución segura)
ALTER TABLE public.factura
  DROP CONSTRAINT IF EXISTS factura_fk_estado_factura_fkey;

ALTER TABLE public.factura
  DROP CONSTRAINT IF EXISTS factura_fk_estado_fkey;

-- 5) Crear la relación factura.fk_estado_factura → estado_factura.id_estado_factura
ALTER TABLE public.factura
  ADD CONSTRAINT factura_fk_estado_factura_fkey
  FOREIGN KEY (fk_estado_factura)
  REFERENCES public.estado_factura (id_estado_factura);

-- 6) Índice para listados por estado
CREATE INDEX IF NOT EXISTS idx_factura_fk_estado
  ON public.factura (fk_estado_factura);

COMMENT ON COLUMN public.factura.fk_estado_factura IS
  'Estado de la factura → public.estado_factura.id_estado_factura (1=Creada, 2=Pagada, 3=Por cobrar, 4=Saldo a favor).';

COMMIT;

-- Verificar relación
SELECT
  tc.constraint_name,
  kcu.column_name,
  ccu.table_name AS references_table,
  ccu.column_name AS references_column
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.table_name = 'factura'
  AND tc.constraint_type = 'FOREIGN KEY'
  AND kcu.column_name = 'fk_estado_factura';
