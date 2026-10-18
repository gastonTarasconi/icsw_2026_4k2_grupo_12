# Eco Harmony Park

Base del TP 6 de Ingeniería y Calidad de Software. Incluye catálogo, términos por actividad, logo, API Express y SQLite. La US-01 de inscripción está pendiente para desarrollarla después aplicando TDD.

## Requisitos

Node.js 22.13 o superior y npm. Usamos `node:sqlite`, incluido en Node, para evitar instalar un motor externo. En Node 22 puede aparecer una advertencia de API experimental de SQLite.

## Instalación y ejecución

Desde la carpeta raíz del proyecto:

```sh
npm install
npm run inicializar
npm run dev:backend
```

En otra terminal, desde la misma carpeta:

```sh
npm run dev:frontend
```

Abrir [http://localhost:5173](http://localhost:5173). La API se ejecuta en [http://localhost:3001](http://localhost:3001). Vite redirige `/api` al backend durante el desarrollo.

La base se crea en `backend/datos/parque.sqlite`. El servidor también la inicializa al arrancar. Repetir la inicialización no duplica ni sobrescribe actividades existentes. No se necesitan credenciales. No se generan turnos ni inscripciones.

Opcional: copiar `backend/.env.example` a `backend/.env` para configurar puerto, origen permitido y ubicación de SQLite. Si cambiás el puerto del backend, actualizá el proxy en `frontend/vite.config.js`. Si cambiás el puerto del frontend, actualizá también CORS.

## Pruebas y compilación

```sh
npm test
npm run test:watch
npm run build
```

Jest y Supertest verifican la infraestructura con una base SQLite en memoria, aislada por prueba. Los `test.todo` de inscripciones son una lista de trabajo, no pruebas aprobadas. La compilación genera `frontend/dist`; no es necesario subirla a Git. El proxy es de desarrollo: para desplegar habrá que servir el frontend y enrutar `/api` al servidor Express.

## Qué se puede probar ahora

1. Abrir el inicio y consultar las cuatro actividades desde la API real.
2. Entrar en “Ver condiciones” para cada actividad.
3. Leer las condiciones generales y específicas y abrir el PDF original.
4. Volver al catálogo y probar el diseño en una pantalla angosta.
5. Detener el backend, recargar y comprobar el mensaje de error y “Reintentar”.

El botón de turno está deshabilitado porque todavía falta desarrollar la inscripción. No hay un flujo completo de inscripción en esta entrega.

## API disponible

| Método | Ruta | Resultado |
| --- | --- | --- |
| GET | `/api/salud` | Estado de la API |
| GET | `/api/actividades` | Las cuatro actividades y sus requisitos |
| GET | `/api/actividades/:id/terminos` | Condiciones generales, específicas y estado de validación |

Los identificadores son `safari`, `palestra`, `jardineria` y `tirolesa`. Las consultas devuelven 200; un recurso inexistente devuelve 404 y un error inesperado, 500, sin traza interna.

```sh
curl http://localhost:3001/api/actividades
curl http://localhost:3001/api/actividades/palestra/terminos
```

Ejemplo del primer elemento del catálogo:

```json
{
  "id": "safari",
  "nombre": "Safari",
  "descripcion": "Un recorrido para descubrir la fauna y el entorno natural del parque.",
  "edadMinima": 0,
  "capacidad": 8,
  "requiereTalla": false
}
```

## Estructura

```text
backend/src/app.js                 Configura Express sin abrir un puerto
backend/src/servidor.js            Arranca el servidor y la base
backend/src/database/              Esquema e inicialización del catálogo
backend/src/repositorios/          Consultas SQLite
backend/src/rutas/                 Endpoints del catálogo
backend/tests/                     Pruebas de base y pendientes de US-01
frontend/src/componentes/          Vista de términos
frontend/src/servicios/            Acceso a la API
frontend/src/estilos/              Paleta y diseño adaptable
frontend/public/                  Logo y PDF original
docs/DECISIONES.md                 Decisiones y pendientes
```

## Continuar con TDD y subir a Git

Primero subir esta base como un commit inicial. Después elegir un caso de `backend/tests/inscripciones.pendientes.test.js`, escribir una prueba concreta que falle, implementar lo mínimo y refactorizar. Ver la propuesta de trabajo en `docs/DECISIONES.md`.

```sh
git init
git add .
git commit -m "Agregar base de Eco Harmony Park"
```

Crear un repositorio vacío en el servicio elegido, agregar su URL con `git remote add origin URL_DEL_REPOSITORIO` y subir la rama actual. No se inicializó ni publicó un repositorio automáticamente. `.gitignore` excluye dependencias, bases locales, compilados y variables privadas; `package-lock.json` sí se versiona. Los documentos originales de la raíz quedan como referencia del TP.



para probar tests 


npm test --workspace backend -- --runTestsByPath tests/inscribirmeActividad.test.js