-- Opcional: coordenadas en entrega para asignación por distancia (Haversine).
-- Ejecute en Supabase SQL Editor si quiere que el cron use GPS en `direccion`.
-- Si no existen las columnas, el cron usa proximidad por ciudad (`idCiudad` en ASIGNACION_REPARTIDORES_HUBS).

alter table public.direccion
  add column if not exists latitud double precision;

alter table public.direccion
  add column if not exists longitud double precision;

comment on column public.direccion.latitud is 'Latitud WGS84 de la entrega (opcional; asignación repartidores)';
comment on column public.direccion.longitud is 'Longitud WGS84 de la entrega (opcional; asignación repartidores)';
