-- Localidades de Bogotá D.C. (`zona_bogota`).
-- Referencia: `direccion.fk_zona` (opcional) cuando la entrega es en Bogotá.
-- Ejecutar después de 01-schema-numeric-ids.sql

INSERT INTO public.zona_bogota (nombre) VALUES
  ('Usaquén'),
  ('Chapinero'),
  ('Santa Fe'),
  ('San Cristóbal'),
  ('Usme'),
  ('Tunjuelito'),
  ('Bosa'),
  ('Kennedy'),
  ('Fontibón'),
  ('Engativá'),
  ('Suba'),
  ('Barrios Unidos'),
  ('Teusaquillo'),
  ('Los Mártires'),
  ('Antonio Nariño'),
  ('Puente Aranda'),
  ('La Candelaria'),
  ('Rafael Uribe Uribe'),
  ('Ciudad Bolívar'),
  ('Sumapaz');

-- Total: 20 localidades
-- IDs si tabla vacía: 1=Usaquén … 20=Sumapaz
-- Verificar: SELECT id_zona, nombre FROM public.zona_bogota ORDER BY id_zona;
