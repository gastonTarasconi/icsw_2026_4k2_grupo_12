# Registro de ciclos TDD

Registramos las pruebas ejecutadas y los cambios realizados en cada fase. Las fases pendientes se completan después de realizarlas.

## Ciclo 1 — Inscripción válida en Tirolesa

### Red

Prueba: `test_InscribirmeActividad_ActividadConCupo_Pasa`.

```sh
npm test --workspace backend -- --runTestsByPath tests/inscribirmeActividad.test.js
```

Salida:

```text
FAIL tests/inscribirmeActividad.test.js
Cannot find module '../src/servicios/inscripciones' from 'tests/inscribirmeActividad.test.js'
Tests: 1 failed, 1 total
```

Falla porque el servicio de inscripciones todavía no existe.

### Green

Se creó `backend/src/servicios/inscripciones.js`: consulta la actividad, genera un código opaco con `randomUUID`, guarda la inscripción y devuelve su confirmación. Las aserciones del test se mantuvieron.

Verificación ejecutada el 18/10/2026:

```sh
node --preserve-symlinks --preserve-symlinks-main node_modules/jest/bin/jest.js --config backend/package.json --runInBand
```

```text
Test Suites: 3 passed, 3 total
Tests:       18 todo, 5 passed, 23 total
```

Se ejecutó Jest directamente con estas opciones para evitar un error EPERM en la resolución de rutas del entorno al usar npm.

Este incremento cubre solo el caso individual válido en memoria. Las validaciones, cupos, SQLite, QR y correo quedan pendientes para nuevos ciclos TDD.

### Refactor

Pendiente de ejecución.


