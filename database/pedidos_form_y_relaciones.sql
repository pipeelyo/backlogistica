-- Ejecutar en Supabase (SQL Editor). Ajuste nombres si su esquema ya difiere.
-- Relaciones para resolver ciudad → departamento → país al crear direcciones desde el nombre de ciudad.

ALTER TABLE public.departamento
  ADD COLUMN IF NOT EXISTS fk_pais uuid REFERENCES public.pais (id_pais);

ALTER TABLE public.ciudad
  ADD COLUMN IF NOT EXISTS fk_departamento uuid REFERENCES public.departamento (id_departamento);

-- Campos del manifiesto / app móvil en pedidos (el destinatario va en tabla `destinatario`; ver database/destinatario.sql)
ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS fragil boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS observaciones_manifiesto text,
  ADD COLUMN IF NOT EXISTS fotos_paquete_urls jsonb;

COMMENT ON COLUMN public.pedidos.fragil IS 'Indicador frágil (manifiesto).';
COMMENT ON COLUMN public.pedidos.observaciones_manifiesto IS 'Observaciones generales del manifiesto.';
COMMENT ON COLUMN public.pedidos.fotos_paquete_urls IS 'URLs de fotos del paquete (opcional).';
