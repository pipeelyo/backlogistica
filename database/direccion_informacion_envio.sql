-- Supabase → SQL Editor. Amplía `direccion` para alinear con el formulario "Información de envío"
-- (nombre/No. vía y observaciones largas sin depender solo de `zona` varchar(160)).

ALTER TABLE public.direccion
  ADD COLUMN IF NOT EXISTS nombre_via varchar(120) NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS observaciones_entrega text;

COMMENT ON COLUMN public.direccion.nombre_via IS 'Nombre o número de la vía (ej. 72).';
COMMENT ON COLUMN public.direccion.observaciones_entrega IS 'Apartamento, oficina, instrucciones al transportador.';

-- Opcional: rellenar nombre_via en filas antiguas si quedó vacío (ajuste manual si aplica)
-- UPDATE public.direccion SET nombre_via = '' WHERE nombre_via IS NULL;
