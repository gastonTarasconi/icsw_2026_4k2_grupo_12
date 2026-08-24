# Gestión de Configuración de Software
## Contexto
### Software
Es conocimiento representado en distintos niveles de abstracción.
De más abstracto a menos abstracto:
	- La idea
	- Cómo se hace
	- El código de verdad
	- Las herramientas: las bibliotecas y el sistema operativo que hacen que funcione
	- El idioma del chip: puro código binario
	- El hardware físico: el chip, la memoria y todo el silicio que corre la electricidad

#### PUD (Proceso Unificado de Desarrollo)
- Requerimientos
- Análisis
- Diseño
- Implementación
- Prueba
- Despliegue

Cada artefacto obtenido durante el PUD es software

#### Ingeniería de software
Compilado de muchas disciplinas para cumplir su propósito
La ingeniería es un enfoque sistemático y organizado para resolver problemas

La ingeniería de software comprende disciplinas técnicas (lo que permite obtener el producto de software), disciplinas de gestión y disciplinas de soporte. En ellos se incluyen los requerimientos, análisis y diseño, construcción, prueba U4 y despliegue U3; planificación de proyecto y monitoreo y control de proyectos; gestión de configuración de software U3, aseguramiento de calidad U4 y métricas

##### Las 4 P
La Ingeniería de Software se ocupa de las 4 P
- Proceso
- Proyecto: de esta se encargan las disciplinas de gestión
- Producto: de esta se encargan las disciplians técnicas
- Personas

###### Proyecto
Un proyecto es una unidad de gestión de recursos y de personas y su trabajo. Es un medio conveniente para obtener como resultado un software.
Se usa porque el resultado de la producción de software es intangible. 
Cada proyecto que se ejecute obtiene como resultado una versión diferente de software aunque se trate del mismo producto.
Resultado único, desarrollo gradual y actividades relacionadas.


SWEBOK: Software engineering body of knowledge - Compendio de todo lo que comprende la ingeniería de software

El agilismo no es una metodología. Es un pensamiento, filosofía, etc. Da un conjunto de principios y valores que definen la manera general en la que hacemos las cosas. Se espera que las personas que participan en un proyecto de software sean capacitadas, autogestionadas, motivadas. En ningún momento da un lineamiento operativo de cómo hacer las cosas. Eso lo hacen los métodos y los procesos. De aquí surgen muchos frameworks. Lo que hacen los frameworks es dar un conjunto de buenas prácticas.
Scrum no es una metodología, es un framework de gestión ágil. No dice nunca cómo debemos hacer software. Por la filosofía del agilismo, el scrum master no es un jefe, tiene un rol de coordinador, pero programa y realiza tareas como todos. El error más grave que se cometió fue decirle a los analistas funcionales que son product owner, ya que desde el lado del proceso de desarrollo no se pueden tomar desiciones que debe tomar el cliente.

La calidad de un producto está relacionada con las espectativas y necesidades que se deben satisfacer. 
Las necesidades son aquellas expresadas explícitamente y las espectativas son aquellas que se obvian o que no se comunican

## Software Configuration Management
Capítulo 8 del Swebok
Elements of Software Configuration - Paper
No silver bullets - Frederick Brooks
https://ieeexplore.ieee.org/document/5010202

Es la disciplina más tangible dentro de la IS. Es la única que trata los file systems. 
Todo el software desarrollado que se sube con una herramienta de versionado se llama Item de  Configuracion. El contenedor de todos los items de configuración se llama Repositorio.
Esta disciplina existe porque el software cambia con frecuencia.
Cada item de configuración tiene su versión
La configuración de software es un snapshot del respositorio con todos lo ítems de configuración y su versión en un momento determinado.
Atiende la problemática inherente al software que es que el mismo cambia constantemente.
La gestión de configuración de software es una disciplina de soporte, lo que significa que es trasversal a todas las disciplinas de software, por lo que se podría decir que contiene a todas las disciplinas, ya que se hace desde el momento 0 hasta el último
En todo momento se debe poder identificar la configuración en un momento dado, controlar sistemáticamente sus cambios y mantener su integridad y origen. Provee la trazabilidad de todo el proyecto desde su nacimiento.
Los problemas de manejo de componentes (PPT)
Conceptos claves de la gestión de configuración de software. (Ver PPT)
Se debe identificar si un item de configuaración dado es item de configuracion del producto o del proyecto, ya que tienen ciclos de vida distintos, porque el proyecto tiene un ciclo de vida más corto que el del producto.

# Resumen de Elements of Software Configuration Management
![[Pasted image 20260816152819.png]]

## Disciplinas de Calidad de Producto
### Gestión de Configuración
Es la disciplina que se ocupa de identificar la configuración de un sistema en un punto discreto del tiempo con el propósito de controlar sistemáticamente los cambios a la configuración manteniendo la integridad y trazabilidad de la misma durante el ciclo de vida del sistema. La **gestión de configuración de software** es simplemente gestión de configuración adaptada a los sistemas o porciones de los sistemas, compuesta principalmente por software.
### Quality Assurance
Es la disciplina que consiste en una serie de procedimientos, técnicas y herramientas aplicadas por los profesionales para asegurar que un producto alcanza o supera unos estándares preespecificados durante el ciclo de desarrollo del producto; y cuando no hay unos estándares preespecificados, QA conlleva asegurar que un producto alcanza o supera un mínimo de excelencia aceptable industrial y/o comercialmente
### Validación y Verificación
A diferencia de QA, que principalmente se ocupa de la adherencia de un producto a unos estándares preestablecidos, la validación y verificación se ocupa del problema de si el producto satisface los requerimientos funcionales y de performance y se asegura que requerimientos especificados se establezcan e interpreten correctamente
### Test y evaluación
Es la disciplina puesta por fuera de la organización del proyecto de desarrollo para indicar de forma independiente y objetiva si un producto cumple los objetivos para los que fue desarrollado.
## Los Elementos de la Gestión de Configuración de Software
### Identificación de Configuración de Software
Una gestión efectiva del desarrollo de un sistema requiera una cuidadosa definición de sus componentes base; cambios a estos componentes también necesitan definirse. Junto con la base conforman la evolución del sistema. La base de un sistema es como una foto del agregado de componentes del sistema tal como están en un momento determinado. Actualizaciones a esta base son como los frames de una película. **El rol de la identificación de configuración de software es proveer etiquetas para estas fotos y la cinta completa**
La base del sistema está caracterizada por dos etiquetas: un identifica la base propiamente dicha, mientras que la segundo identifica una actualización a una base en particular. Una actualización a la base representa la base más un set de cambios que fueron incorporados en ella.
**La entidad más elemental en el mecanismo de etiquetado de identificación de configuración de software es el Item de Configuración de Software (SCI)**. Una base de software aparece como un set de ítems de configuración de software. Los ítems de configuración de software en una base están relacionados unos con otros mediante una jerarquía de árbol. A medida que el sistema de software evoluciona durante su ciclo de vida, el número de ramas en esta jerarquía generalmente incrementa.
El mánager de configuración de software toma fotos de las SCI. Cada base y sus actualizaciones asociadas representan colectivamente la evolución del software durante cada una de sus etapas de ciclo de vida. Estas etapas están escalonadas una respecto a la otra y pueden ser visualizadas como un hilo cronológico.
La identificación de las bases y actualizaciones provee un hilo de documentación explícito que relaciona todas las etapas del ciclo de vida del software. Con la ayuda de este hilo de documentación, el desarrollador de software puede evaluar la integridad de su producto.
### Control de Configuración de Software
Además de los cambios que afectan explícitamente a las bases existentes, hay cambios que ocurren durante etapas tempranas del ciclo de vida del sistema que pueden afectar a bases que aun no existen. Un rol del del control de configuración de software es proveer el mecanismo adminsitrativo para precipitar, preparar, evaluar y aprobar o rechazar todas las propuestas de cambio durante el ciclo de vida del sistema.
En bases tempranas, los SCI son documentas de especificación (uno o más volúmenes de texto por cada base o actualización asociada); en bases posteriores, cada SCI puede manifestarse como cualquiera de las representaciones de software. El control de configuración de software se ocupa de gestionar los cambios a los SCI (existentes o a ser desarrollados) en todas sus representaciones.
Este proceso incluye tres ingredientes básicos:
- **Documentación** (tal como formularios administrativos y material de soporte técnico y administrativo) para precipitar formalmente y definir un cambio propuesto a un sistema de software
- **Un cuerpo organizado** para evaluar formalmente evaluar y aprobar o desaprobar un cambio propuesto a un sistema de software
- **Procedimiento para el control de cambios** a un sistema de software (La junta de control de configuración)
La propuesta de cambio de ingeniería (ECP) es un documento de control principal que contiene información como la descripción del cambio propuesto, la identificación de la organización, la identificación de las bases y los SCI afectados, la especificación de costo y calendario de impactos. Las ECPs son revisadas y coordinadas por la junta de control de configuaración, que es típicamente un cuerpo que representa todas las unidades organizacionales que tienen un interés establecido en los cambios propuestos
![[Pasted image 20260815171253.png]]
### Auditoría de Configuración de Software
La auditoría de configuración de software provee el mecanismo para determinar el grado en el que el estado actual del sistema de software refleja el sistema de software descripto en la documentación de requerimientos.
Sirve dos propósitos: verificación de configuración y vallidación de configuración. La **verificación** asegura que lo que está planeado en cada item de configuración de software en una base o actualización sea concretado en la base o actualización siguiente. La **validación** asegura que el SCI resuelva el problema correcto.
La auditoría de software le muestra al mánager el estado actual del software en el ciclo de vida del producto auditado. También revela si los requerimientos del proyecto están siendo satisfechos y si las intenciones de las bases anteriores fueron alcanzadas. Con esta visibilidad, el mánager del proyecto puede evaluar la integridad del producto de software que está siendo desarrollado, resolver problemas que puede haber revelado la auditoría y corregir defectos en el proceso de desarrollo
### Contabilidad del Estado de la Configuración de Software
Es el seguimiento y reporte administrativo de todos los ítems de software formalmente identificados y controlados. También incluye el mantenimiento de archivos para apoyar la auditoría de configuración de software. Como la contabilidad del estado de configuración de software registra la actividad asociada a las otras tres funciones del SCM, provee los medios por los cuales el historial del ciclo de vida del sistema de software puede ser trackeado.
Incluye el registro y reporte de:
1.  El tiempo en que cada representación de una base y actualización surgió
2.  El tiempo en que cada SCI surgió
3.  Información descriptiva de cada SCI
4.  El estado de la Propuesta de Cambio de Ingeniería (aprobada, desaprobada, esperando acción)
5.  Información descriptiva de cada Propuesta de Cambio de Ingeniería
6.  Estado del cambios
7.  Información descriptiva de cada cambio
8.  Estado de documentación técnica y administrativa asociada a una base o actualización
9.  Deficiencias en una base planeada para ser establecida a futuro reveladas durante el proceso de auditoría de configuración

