-- Variables para KPIs financieros (GET /admin/finanzas/*).
-- Ejecutar en Supabase SQL Editor después de 15-seed-variables.sql.

INSERT INTO public.variable (clave, valor, tipo, descripcion) VALUES
  (
    'FINANZAS_TARIFA_PAGO_REPARTIDOR_ENTREGA',
    '12000',
    'integer',
    'COP pagados por entrega exitosa (pedido Entregado) en KPI Pago personal.'
  ),
  (
    'FINANZAS_PAGO_PERSONAL_FIJO_MENSUAL',
    '0',
    'integer',
    'Nómina fija mensual COP (admin/supervisión); se prorratea en el periodo del KPI.'
  )
ON CONFLICT (clave) DO UPDATE SET
  valor = EXCLUDED.valor,
  tipo = EXCLUDED.tipo,
  descripcion = EXCLUDED.descripcion,
  actualizado_en = now();
