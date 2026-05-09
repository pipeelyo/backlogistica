-- Supabase → SQL Editor. Perfil comercial del usuario solicitante (empresa + enlace a `usuarios`).

CREATE TABLE IF NOT EXISTS public.cliente (
  id_cliente uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  nombre_empresa varchar(240) NOT NULL,
  fk_usuario uuid NOT NULL UNIQUE REFERENCES public.usuarios (id_usuario) ON DELETE CASCADE,
  creado_en timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.cliente IS 'Datos de facturación / empresa del cliente; el documento y tipo están en `usuarios`.';

ALTER TABLE public.pedidos
  ADD COLUMN IF NOT EXISTS fk_cliente uuid REFERENCES public.cliente (id_cliente) ON DELETE SET NULL;

COMMENT ON COLUMN public.pedidos.fk_cliente IS 'Cliente (empresa) que crea el pedido; el solicitante sigue en fk_usuario_solicitud.';

-- Ejemplo: dar de alta un cliente para un usuario ya existente
-- INSERT INTO public.cliente (nombre_empresa, fk_usuario)
-- SELECT 'ACME SAS', u.id_usuario FROM public.usuarios u WHERE u.documento = '9001234567' LIMIT 1;
