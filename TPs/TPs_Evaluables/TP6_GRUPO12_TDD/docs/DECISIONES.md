# Decisiones de la base del sistema

## Alcance de esta entrega

Preparamos el entorno y las pantallas del catálogo para poder empezar la historia de inscripción con TDD sobre una base ejecutable, en esta etapa, por pedido del equipo, solamente dejamos el sistema base. No implementamos turnos, validaciones de participantes, reservas de cupos, aceptación persistida, QR ni correo.

Las pruebas de infraestructura se agregaron como verificación de esta base. Esta entrega demuestre ciclos Red, Green y Refactor ni inventamos un historial previo. Esa evidencia deberá surgir del desarrollo de la us.

## Tecnologías y organización

Usamos JavaScript con Express y React + Vite porque son las tecnologías con las que mas familiarizados estamos. Usamos npm workspaces para instalar todo desde la raíz, manteniendo backend y frontend separados. No incorporamos TypeScript, contenedores ni autenticación porque no hacen falta para esta etapa.

SQLite guarda las actividades y sus términos. Usamos el módulo incorporado `node:sqlite` de Node 22.13 o superior, que evita dependencias nativas adicionales. El acceso sincrónico resulta suficiente para este TP pequeño; no es una propuesta de arquitectura para un sistema de alta carga.

`crearAplicacion` recibe la conexión a la base y no abre puertos. Eso permite probar los endpoints con Supertest y SQLite en memoria. Las consultas están en un repositorio. Por ahora las rutas son cortas y no necesitan controladores que solo deleguen. Cuando exista lógica de inscripción, conviene ubicarla en servicios independientes de Express.


## Datos iniciales y persistencia

Solo creamos la tabla que usamos: actividades. Sus restricciones controlan capacidad positiva, edad mínima no negativa y el indicador de talla. La inicialización es transaccional y no modifica registros existentes: si cambia el contenido del JSON después de crear la base, hará falta una migración o recrear exclusivamente la base de desarrollo, perdiendo sus datos. No borrar una base con datos que se quieran conservar.

Los futuros turnos, participantes e inscripciones se modelarán al aparecer el primer caso que los necesite. Todavía no hay un esquema que garantice cupos ni superposición. Activamos claves foráneas para las futuras relaciones, pero deberán agregarse explícitamente con sus restricciones.

## Identidad visual y términos



## Cómo seguir con la US

1. Escribir una prueba pequeña para inscribir a una persona en Safari en un turno válido. Definir solo los datos y colaboradores necesarios para ese caso.
2. Ejecutarla y registrar el fallo por funcionalidad faltante (Red).
3. Agregar el mínimo servicio y persistencia para aprobarla (Green).
4. Refactorizar manteniendo la prueba aprobada. Conservar evidencia real del ciclo mediante commits.
5. Repetir con edades, DNI, talla, términos, turnos y límites temporales. Inyectar un reloj; usar explícitamente la zona America/Argentina/Buenos_Aires al interpretar fechas locales.
6. Agregar grupos, superposición por DNI y cupos. Validar y guardar el grupo completo en una transacción. Probar solicitudes concurrentes por el último cupo y que una operación rechazada no deje registros parciales.
7. Incorporar endpoints y pruebas Supertest.
8. Agregar tokens opacos, `qrcode` y correo simulado desacoplado cuando una prueba los necesite. No poner datos personales en el QR.

El archivo de pendientes orienta el trabajo, pero cada `test.todo` debe convertirse en una o más pruebas con datos, acción y resultado esperado. Conviene descomponer los casos agrupados y trabajar uno por vez. No alcanza con que Jest reporte pendientes para decir que se verificaron las reglas.


No agregamos esas reglas por nuestra cuenta. No incluimos compra de entradas, pagos ni panel administrativo.
