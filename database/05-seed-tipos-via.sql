-- Tipos de vía para nomenclatura urbana en Colombia.
-- Nombres completos (sin Cra/Kr/Cl); la API compara sin distinguir mayúsculas.
-- Ejecutar después de 01-schema-numeric-ids.sql

INSERT INTO public.tipo_via (nombre) VALUES
  ('Calle'),
  ('Carrera'),
  ('Avenida'),
  ('Diagonal'),
  ('Transversal'),
  ('Avenida Calle'),
  ('Avenida Carrera'),
  ('Avenida Transversal'),
  ('Avenida Diagonal'),
  ('Anillo'),
  ('Autopista'),
  ('Bulevar'),
  ('Camino'),
  ('Carretera'),
  ('Callejón'),
  ('Circular'),
  ('Cuesta'),
  ('Kilómetro'),
  ('Manzana'),
  ('Pasaje'),
  ('Paseo'),
  ('Plaza'),
  ('Sector'),
  ('Troncal'),
  ('Variante'),
  ('Vereda'),
  ('Vía');

-- Total: 27 tipos
