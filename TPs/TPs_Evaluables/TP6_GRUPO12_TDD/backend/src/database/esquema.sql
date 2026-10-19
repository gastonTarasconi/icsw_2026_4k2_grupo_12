CREATE TABLE IF NOT EXISTS actividades (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  edad_minima INTEGER NOT NULL CHECK (edad_minima >= 0),
  capacidad INTEGER NOT NULL CHECK (capacidad > 0),
  requiere_talla INTEGER NOT NULL CHECK (requiere_talla IN (0, 1)),
  terminos TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS inscripciones (
  codigo TEXT PRIMARY KEY,
  actividad_id TEXT NOT NULL REFERENCES actividades(id),
  fecha TEXT NOT NULL,
  horario TEXT NOT NULL,
  cantidad_personas INTEGER NOT NULL CHECK(cantidad_personas > 0),
  participantes TEXT NOT NULL,
  acepta_terminos INTEGER NOT NULL CHECK(acepta_terminos = 1),
  email TEXT NOT NULL,
  creado_en TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_inscripciones_turno ON inscripciones(actividad_id, fecha, horario);
