-- Parche: alinear tabla factura con la API (columnas nuevas + estado_factura).
-- Ejecutar en Supabase SQL Editor si POST /pedidos falla con:
--   column "monto_cobrado" of relation "factura" does not exist

BEGIN;

-- 1) Catálogo estado_factura
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

-- 2) Columnas nuevas en factura (esquema antiguo solo tenía esta_paga)
-- monto_cobrado: acumulado recaudado (DEFAULT 0); no implica cobro al crear el pedido.
-- pagado_al_crear: true solo si hubo prepago explícito (pagadoPorRemitente en POST /pedidos).
ALTER TABLE public.factura ADD COLUMN IF NOT EXISTS fk_estado_factura integer;
ALTER TABLE public.factura ADD COLUMN IF NOT EXISTS monto_cobrado numeric(14, 4) NOT NULL DEFAULT 0;
ALTER TABLE public.factura ADD COLUMN IF NOT EXISTS pagado_al_crear boolean NOT NULL DEFAULT false;
ALTER TABLE public.factura ADD COLUMN IF NOT EXISTS fecha_cierre timestamptz;
ALTER TABLE public.factura ADD COLUMN IF NOT EXISTS actualizado_en timestamptz NOT NULL DEFAULT now();

-- Migrar esta_paga → fk_estado_factura + monto_cobrado
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'factura' AND column_name = 'esta_paga'
  ) THEN
    UPDATE public.factura
    SET fk_estado_factura = CASE WHEN esta_paga THEN 2 ELSE 1 END,
        monto_cobrado = CASE WHEN esta_paga THEN monto ELSE 0 END,
        pagado_al_crear = esta_paga
    WHERE fk_estado_factura IS NULL;

    ALTER TABLE public.factura DROP COLUMN IF EXISTS esta_paga;
  END IF;
END $$;

UPDATE public.factura SET fk_estado_factura = 1 WHERE fk_estado_factura IS NULL;
UPDATE public.factura SET monto_cobrado = 0 WHERE monto_cobrado IS NULL;
UPDATE public.factura SET pagado_al_crear = false WHERE pagado_al_crear IS NULL;

ALTER TABLE public.factura ALTER COLUMN fk_estado_factura SET NOT NULL;

-- 3) FK factura → estado_factura
ALTER TABLE public.factura DROP CONSTRAINT IF EXISTS factura_fk_estado_factura_fkey;
ALTER TABLE public.factura
  ADD CONSTRAINT factura_fk_estado_factura_fkey
  FOREIGN KEY (fk_estado_factura)
  REFERENCES public.estado_factura (id_estado_factura);

CREATE INDEX IF NOT EXISTS idx_factura_fk_estado ON public.factura (fk_estado_factura);

COMMIT;

-- Verificar columnas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'factura'
ORDER BY ordinal_position;
