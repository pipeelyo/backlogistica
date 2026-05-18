-- Departamentos de Colombia (código DANE departamento, 2 dígitos).
-- Fuente: https://github.com/jor3l/departamentos-municipios-colombia
-- Ejecutar después de 02-seed-pais.sql

INSERT INTO public.departamento (nombre, codigo_dane) VALUES
  ('Antioquia', '05'),
  ('Atlantico', '08'),
  ('Bogota', '11'),
  ('Bolivar', '13'),
  ('Boyaca', '15'),
  ('Caldas', '17'),
  ('Caqueta', '18'),
  ('Cauca', '19'),
  ('Cesar', '20'),
  ('Cordoba', '23'),
  ('Cundinamarca', '25'),
  ('Choco', '27'),
  ('Huila', '41'),
  ('La Guajira', '44'),
  ('Magdalena', '47'),
  ('Meta', '50'),
  ('Nariño', '52'),
  ('N. De Santander', '54'),
  ('Quindio', '63'),
  ('Risaralda', '66'),
  ('Santander', '68'),
  ('Sucre', '70'),
  ('Tolima', '73'),
  ('Valle Del Cauca', '76'),
  ('Arauca', '81'),
  ('Casanare', '85'),
  ('Putumayo', '86'),
  ('San Andres', '88'),
  ('Amazonas', '91'),
  ('Guainia', '94'),
  ('Guaviare', '95'),
  ('Vaupes', '97'),
  ('Vichada', '99');

-- Total: 33 departamentos