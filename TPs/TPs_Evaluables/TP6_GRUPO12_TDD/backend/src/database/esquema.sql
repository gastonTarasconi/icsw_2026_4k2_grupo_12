CREATE TABLE IF NOT EXISTS actividades (
  id TEXT PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  edad_minima INTEGER NOT NULL CHECK (edad_minima >= 0),
  capacidad INTEGER NOT NULL CHECK (capacidad > 0),
  requiere_talla INTEGER NOT NULL CHECK (requiere_talla IN (0, 1)),
  terminos TEXT NOT NULL
);
