-- Supabase → SQL Editor.
-- Crea la tabla **catálogo** `tipo_pedido` (si no existe) y semillas Despacho / Recolección.
-- La clave foránea **no va aquí**: cada pedido guarda `pedidos.fk_tipo_pedido` → `tipo_pedido.id_tipo_pedido`
-- (ver `database/pedidos_fk_tipo_pedido.sql` si falta la columna en `pedidos`).

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
