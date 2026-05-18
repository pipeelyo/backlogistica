-- Añade `pedidos.fecha_entrega` en una BD que ya existía sin la columna.
-- No ejecutar si recreaste con `01-schema-numeric-ids.sql` (ahí ya viene en CREATE TABLE).
-- En instalación nueva: solo 00-drop + 01-schema + seeds.

ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS fecha_entrega date;

UPDATE public.pedidos
SET fecha_entrega = COALESCE((creado_en AT TIME ZONE 'UTC')::date, CURRENT_DATE)
WHERE fecha_entrega IS NULL;

ALTER TABLE public.pedidos
  ALTER COLUMN fecha_entrega SET NOT NULL;

-- Verificar:
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public' AND table_name = 'pedidos' AND column_name = 'fecha_entrega';
