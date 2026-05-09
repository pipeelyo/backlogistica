-- Supabase → SQL Editor.
-- Crea la tabla `tipo_pedido` (si no existe) y deja dos filas para `POST /pedidos` con `tipoOperacion` DESPACHO | RECOLECCION.

CREATE TABLE IF NOT EXISTS public.tipo_pedido (
  id_tipo_pedido uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  nombre varchar(160) NOT NULL
);

COMMENT ON TABLE public.tipo_pedido IS 'Catálogo de tipo de pedido (despacho, recolección, etc.); referenciado por pedidos.fk_tipo_pedido.';

INSERT INTO public.tipo_pedido (id_tipo_pedido, nombre)
SELECT gen_random_uuid(), 'Despacho'
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      public.tipo_pedido
    WHERE
      nombre ILIKE 'despacho'
  );

INSERT INTO public.tipo_pedido (id_tipo_pedido, nombre)
SELECT gen_random_uuid(), 'Recolección'
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      public.tipo_pedido
    WHERE
      nombre ILIKE 'recolección'
      OR nombre ILIKE 'recoleccion'
  );
