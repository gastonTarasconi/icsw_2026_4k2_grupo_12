function crearRepositorioActividades(baseDeDatos) {
  function convertirActividad(fila) {
    return {
      id: fila.id, nombre: fila.nombre, descripcion: fila.descripcion,
      edadMinima: fila.edad_minima, capacidad: fila.capacidad,
      requiereTalla: Boolean(fila.requiere_talla)
    };
  }

  return {
    listarActividades() {
      return baseDeDatos.prepare('SELECT * FROM actividades ORDER BY rowid').all().map(convertirActividad);
    },
    buscarTerminos(id) {
      const fila = baseDeDatos.prepare('SELECT terminos FROM actividades WHERE id = ?').get(id);
      return fila ? JSON.parse(fila.terminos) : null;
    }
  };
}

module.exports = { crearRepositorioActividades };
