-- Ejecutar en Supabase → SQL Editor (no hay MCP Supabase en este repo).
-- Destinatario normalizado: un registro por pedido; el pedido apunta con fk_destinatario.

CREATE TABLE IF NOT EXISTS public.destinatario (
  id_destinatario uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  nombre varchar(200) NOT NULL,
  telefono varchar(32) NOT NULL,
  creado_en timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.destinatario IS 'Persona que recibe el envío; vinculada 1:1 al pedido.';

-- FK desde pedidos (nullable al migrar; luego puede volverse NOT NULL si todos los pedidos tienen destinatario)
ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS fk_destinatario uuid REFERENCES public.destinatario (id_destinatario) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_pedidos_fk_destinatario ON public.pedidos (fk_destinatario)
WHERE
  fk_destinatario IS NOT NULL;

-- Migración desde columnas legado en pedidos (si existían)
DO $$
DECLARE
  r RECORD;
  nid uuid;
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE
      table_schema = 'public'
      AND table_name = 'pedidos'
      AND column_name = 'destinatario_nombre'
  ) THEN
    FOR r IN
    SELECT
      id_pedido,
      destinatario_nombre,
      destinatario_telefono,
      creado_en
    FROM
      public.pedidos
    WHERE
      fk_destinatario IS NULL
      AND destinatario_nombre IS NOT NULL
      LOOP
        nid := gen_random_uuid();
        INSERT INTO public.destinatario (id_destinatario, nombre, telefono, creado_en)
        VALUES (
          nid,
          r.destinatario_nombre,
          COALESCE(NULLIF(TRIM(r.destinatario_telefono), ''), '0'),
          r.creado_en
        );
        UPDATE public.pedidos
        SET
          fk_destinatario = nid
        WHERE
          id_pedido = r.id_pedido;
      END LOOP;
    ALTER TABLE public.pedidos DROP COLUMN IF EXISTS destinatario_nombre;
    ALTER TABLE public.pedidos DROP COLUMN IF EXISTS destinatario_telefono;
  END IF;
END
$$;
