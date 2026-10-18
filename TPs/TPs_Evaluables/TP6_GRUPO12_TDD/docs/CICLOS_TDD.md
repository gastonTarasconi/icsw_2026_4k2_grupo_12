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

Pendiente de ejecución.

### Refactor

Pendiente de ejecución.
