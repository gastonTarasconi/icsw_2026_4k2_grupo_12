
# Eco Harmony Park — TP6 TDD

**Materia:** Ingeniería y Calidad de Software  
**Grupo:** 12  
**Historia de usuario:** Inscribirme a actividad  
**Tecnologías:** JavaScript, React, Vite, Express, SQLite, Jest y Supertest.

## 1. Descripción del proyecto

Aplicación web desarrollada para Eco Harmony Park como parte del Trabajo Práctico 6.

El proyecto implementa la historia de usuario **«Inscribirme a actividad»**, que permite a un visitante consultar las actividades disponibles, seleccionar una fecha y un horario, registrar participantes y obtener una confirmación de su inscripción.

El desarrollo incluye pruebas automatizadas y evidencia de ciclos TDD (RED, GREEN y REFACTOR).

## 2. Funcionalidades implementadas

### Consulta de actividades

El sistema presenta cuatro actividades:

| Actividad | Edad mínima | Cupos por turno | Requiere talle |
| --- | --- | --- | --- |
| Safari | Sin mínimo | 8 | No |
| Palestra | 12 años | 12 | Sí |
| Jardinería | Sin mínimo | 12 | No |
| Tirolesa | 8 años | 10 | Sí |

Se pueden consultar las condiciones generales y particulares de cada actividad.

### Inscripción individual y grupal

El visitante puede:

- Seleccionar una actividad.
- Elegir una fecha y consultar los turnos disponibles.
- Consultar los cupos restantes.
- Indicar la cantidad de participantes.
- Ingresar el DNI y la edad de cada participante.
- Indicar el talle cuando la actividad lo requiere.
- Ingresar un nombre opcional.
- Proporcionar un correo electrónico obligatorio.
- Aceptar los términos y condiciones.
- Confirmar la inscripción.

### Validaciones

El backend comprueba:

- Existencia de la actividad.
- Cantidad válida de participantes.
- DNI numérico y sin duplicados dentro de una inscripción.
- Edad mínima requerida.
- Talle válido cuando corresponde.
- Aceptación de términos y condiciones.
- Correo electrónico obligatorio y con formato válido.
- Fecha válida y día de apertura del parque.
- Horarios permitidos de 09:00 a 17:00.
- Anticipación de reserva entre 24 horas y 15 minutos.
- Disponibilidad de cupos.
- Ausencia de superposición horaria para un mismo DNI.

El parque permanece cerrado los lunes, el 1 de enero y el 25 de diciembre.

### Persistencia

Las inscripciones se almacenan en una base de datos SQLite.

El repositorio utiliza una transacción al guardar la inscripción y vuelve a comprobar los cupos disponibles. Esta protección está implementada, aunque las pruebas específicas de concurrencia todavía forman parte de la revisión pendiente.

### Confirmación y códigos QR

Al registrar una inscripción válida se genera:

- Código único de confirmación.
- Resumen de la actividad, fecha y horario.
- Cantidad y datos de participantes.
- Un identificador QR por participante.
- Vista previa del correo de confirmación.

La interfaz genera las imágenes QR a partir de los identificadores recibidos.

La aplicación genera los QR, pero no implementa todavía un sistema de lectura o validación de accesos en la entrada del parque.

## 3. Tecnologías utilizadas

**Frontend**
- React
- Vite
- JavaScript
- CSS
- Librería `qrcode`

**Backend**
- Node.js
- Express
- SQLite mediante `node:sqlite`
- Nodemailer para envío opcional de correos

**Pruebas**
- Jest
- Supertest
- SQLite en memoria para las pruebas de integración

## 4. Requisitos

- Node.js 22.13.0 o superior.
- npm.
- Visual Studio Code u otro editor compatible.

En algunas versiones de Node.js 22 puede aparecer una advertencia sobre la API experimental de SQLite.

## 5. Instalación y ejecución

Los comandos deben ejecutarse desde la carpeta `TP6_GRUPO12_TDD` del repositorio del Grupo 12.

### Instalar dependencias

```powershell
npm.cmd install
```

### Inicializar la base de datos

```powershell
npm.cmd run inicializar
```

La base se crea normalmente en `backend/datos/parque.sqlite`.

El servidor también inicializa la base cuando se inicia. La inicialización no duplica las actividades existentes.

### Iniciar el backend

En una terminal:

```powershell
npm.cmd run dev:backend
```

La API estará disponible en:

http://localhost:3001

### Iniciar el frontend

En otra terminal:

```powershell
npm.cmd run dev:frontend
```

Abrir la aplicación en:

http://localhost:5173

Durante el desarrollo, Vite redirige las solicitudes `/api` al servidor Express.

## 6. Configuración del correo

El sistema admite dos modos:

### Correo simulado

Es el modo predeterminado cuando no se configura otro modo.

```dotenv
CORREO_MODO=simulado
```

El mensaje se registra en una bandeja en memoria durante la sesión del servidor. La interfaz muestra su vista previa.

**En este modo no se envía ningún correo real.**

### Correo real mediante Gmail

Para habilitar el envío real, crear localmente `backend/.env` a partir de `backend/.env.example` y configurar:

```dotenv
CORREO_MODO=smtp
SMTP_USUARIO=correo@example.com
SMTP_CLAVE=CLAVE_DE_APLICACION
```

Los valores anteriores son ejemplos, no credenciales reales.

La clave debe ser una contraseña de aplicación válida y mantenerse exclusivamente en el archivo privado `.env`.

**Nunca subir credenciales reales a GitHub ni colocarlas en `.env.example`.**

El envío SMTP genera un adjunto PNG por participante. Un estado de correo aceptado por el servidor no garantiza que el mensaje haya llegado a la bandeja del destinatario.

Si falla el envío, la inscripción permanece registrada. No existe reintento automático ni función de reenvío desde la interfaz.

La entrega real debe comprobarse manualmente con credenciales válidas y autorizadas.

## 7. Pruebas automatizadas

Para ejecutar todas las pruebas:

```powershell
npm.cmd test
```

Para ejecutar una prueba específica:

```powershell
npm.cmd test --workspace backend -- --runTestsByPath tests/correoObligatorio.test.js
```

Para comprobar la compilación:

```powershell
npm.cmd run build
```

### Último resultado registrado — 19/10/2026

```text
Test Suites: 10 passed, 10 total
Tests:       18 todo, 64 passed, 82 total
```

El frontend también compiló correctamente.

Las 64 pruebas aprobadas incluyen pruebas unitarias y de integración.

Los 18 casos `test.todo` son recordatorios pendientes: Jest no los ejecuta y no se contabilizan como pruebas aprobadas.

Estos resultados corresponden a la última ejecución registrada. Deben actualizarse si se modifica posteriormente el código o las pruebas.

## 8. Desarrollo mediante TDD

Se trabajó siguiendo el ciclo:

**RED:** escribir una prueba y comprobar que falla por una funcionalidad todavía no implementada.

**GREEN:** incorporar la implementación mínima necesaria para superar la prueba.

**REFACTOR:** mejorar la organización del código conservando el comportamiento y las pruebas aprobadas.

### Evidencias en Git

| Ciclo | RED | GREEN | REFACTOR |
| --- | --- | --- | --- |
| Confirmación con resumen y QR | `d4c5ce3` | `d82bf95` | `f8e7d9d` |
| Correo con formato inválido | `64e9547` | `8a858d3` | `d449989` |
| Correo electrónico obligatorio | `1ef0745` | `1f13159` | `4d64ae5` |

También se registró un ciclo de validación de cupos. Su evidencia está documentada, aunque no tiene tres commits independientes.

La descripción detallada de las pruebas, resultados y decisiones se encuentra en `docs/CICLOS_TDD.md`.

## 9. API disponible

| Método | Ruta | Función |
| --- | --- | --- |
| GET | `/api/salud` | Verificar estado del servidor |
| GET | `/api/actividades` | Consultar las cuatro actividades |
| GET | `/api/actividades/:id/terminos` | Consultar términos de una actividad |
| GET | `/api/inscripciones/turnos` | Consultar horarios y cupos |
| POST | `/api/inscripciones` | Registrar una inscripción |
| GET | `/api/inscripciones/:codigo` | Consultar una inscripción registrada |

**Observación de seguridad:** la consulta por código actualmente devuelve información de la inscripción, incluidos datos personales. Su alcance y protección deben revisarse antes de utilizar la aplicación en un entorno público.

## 10. Prueba manual de la aplicación

Para verificar el funcionamiento:

1. Iniciar backend y frontend.
2. Abrir el catálogo de actividades.
3. Seleccionar una de las cuatro actividades.
4. Consultar sus términos y condiciones.
5. Elegir una fecha y un turno disponible.
6. Completar los datos de uno o más participantes.
7. Ingresar el correo electrónico.
8. Aceptar los términos y confirmar.
9. Verificar el código de inscripción y los QR.
10. Revisar el estado del correo y su vista previa.
11. Repetir con casos inválidos y comprobar los mensajes.

La selección de turnos depende de la fecha y hora del sistema, porque solamente se permiten inscripciones entre 24 horas y 15 minutos antes del inicio.

Para pruebas locales controladas, el backend dispone de la variable `RELOJ_PRUEBA`. No debe utilizarse para reservas reales.

## 11. Estructura principal

```text
TP6_GRUPO12_TDD/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── servidor.js
│   │   ├── database/
│   │   ├── repositorios/
│   │   ├── rutas/
│   │   └── servicios/
│   └── tests/
├── frontend/
│   ├── public/
│   └── src/
│       ├── componentes/
│       ├── estilos/
│       └── servicios/
├── docs/
│   ├── CICLOS_TDD.md
│   ├── DECISIONES.md
│   ├── HISTORIAL.md
│   └── MATRIZ_TRAZABILIDAD.md
├── package.json
└── README.md
```

## 12. Limitaciones y verificaciones pendientes

Antes de considerar la aplicación lista para un entorno real, deben revisarse:

- La exposición de datos personales al consultar una inscripción.
- Las pruebas de concurrencia con SQLite.
- La comprobación manual de los cuatro recorridos de inscripción.
- La recepción efectiva de correo mediante Gmail.
- La lectura y validación de códigos QR, si se exige como parte del alcance.
- La revisión de los 18 casos `test.todo`.
- La aprobación de los términos particulares todavía propuestos para validación.
- Las definiciones pendientes sobre importes y totales en la confirmación.
- La revisión de dependencias y sus avisos de seguridad.

La aplicación es una implementación académica. No se considera validada para producción.

## 13. Documentación

- `docs/CICLOS_TDD.md`: evidencia de los ciclos RED, GREEN y REFACTOR.
- `docs/MATRIZ_TRAZABILIDAD.md`: relación entre criterios, pruebas y funcionalidades.
- `docs/DECISIONES.md`: decisiones técnicas y de alcance.
- `docs/HISTORIAL.md`: registro de avances.

## 14. Repositorio grupal

El proyecto se desarrolla dentro del repositorio compartido del Grupo 12.

La rama utilizada para este desarrollo es:

```text
feature/tp6-inscripciones-tdd
```

Los cambios se guardan mediante commits y se publican en esa rama.

La integración a `main` debe coordinarse con el equipo. No corresponde reinicializar Git ni crear otro repositorio para este proyecto.
