-- Roles de usuario (`usuario_rol` → `rol`).
-- Ejecutar después de 01-schema-numeric-ids.sql
-- La tabla `rol` no tiene columna `codigo`; los códigos lógicos de la API son:
--   CLIENTE, REPARTIDOR, ADMINISTRADOR, SUPERVISOR (ver `logistica-rol.constants.ts`).

INSERT INTO public.rol (nombre) VALUES
  ('Cliente'),
  ('Repartidor'),
  ('Administrador'),
  ('Supervisor');

-- Total: 4 roles
-- IDs si tabla vacía: 1=Cliente (CLIENTE), 2=Repartidor (REPARTIDOR), 3=Administrador (ADMINISTRADOR), 4=Supervisor (SUPERVISOR)
-- Verificar: SELECT id_rol, nombre FROM public.rol ORDER BY id_rol;
