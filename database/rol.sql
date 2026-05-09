-- Tabla de roles (alineada a UUID como el resto del esquema logístico)
create table if not exists public.rol (
  id_rol uuid primary key default gen_random_uuid(),
  nombre varchar(160) not null
);
