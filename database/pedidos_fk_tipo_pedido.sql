-- Supabase → SQL Editor.
-- La FK del tipo de pedido vive en **pedidos** (cada fila de pedido apunta a una fila de tipo_pedido).
-- Ejecute antes `database/tipo_pedido_despacho_recoleccion.sql` (o tenga creada `public.tipo_pedido`).

ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS fk_tipo_pedido uuid REFERENCES public.tipo_pedido (id_tipo_pedido);

COMMENT ON COLUMN public.pedidos.fk_tipo_pedido IS 'Catálogo: despacho, recolección, etc. (`tipo_pedido.id_tipo_pedido`).';
