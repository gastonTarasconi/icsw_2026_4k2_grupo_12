Hay dos tipos de procesos: definidos y empíricos. PUD y RUD son procesos definidos. 
El agilismo surge cuando procesos definidos comienzan a fracasar alrededor del 2001.
En el contexto del agilismo la visión que se tiene de los requerimientos es diferentes a la visión que se tiene asociada a los requerimientos de los procesos definidos.
El agilismo asume personas autogestionadas (capaces de decir a que se compromenten y cumplir con ese compromiso), motivadas y preparadas (saben hacer software previamnente) y propone que la experiencia no es extrapolable, lo más importante para hacer software son las personas y cada experiencia que ellas tienen es algo único e irrepetible que sucede y por lo cual en los procesos empíricos se busca ganar experiencia en cada ciclo.
Para ello se proponen ciclos cortos
Los pilares del agilismo son:
	Inspección: puntos de control
	Adaptación: si se advierte un error, actuar en consecuencia con el fin de corregir y mejorar
	Transparencia: no fingir demencia, mentir o guardar información durante la inspección sobre todo. Esta es la base para que la inspección y la adaptación funcionen. De esta forma los problemas son visibles, se pueden resolver y se gana aprendizaje y experiencia en cada ciclo o iteración.
A estos pilares se adhieren scrum y lean
Los procesos definidos dicen que la experiencia si es extrapolable. Mediante la descripción detallada una persona puede basarse en estas descripciones hecha por otros para predecir resultados en un proyecto por empezar.
Cuando se tiene un equipo que trabaja junto, no hay recambio y el equipo trabaja bien, es una buena situación para usar un proceso definido.
En un marco de proceso definido, cuando el proyecto va a empezar, la organización establece una guía de adaptación a la cual el equipo debe atenerse. En cambio en un marco de proceso empírico, el equipo es el que decide y se hace responsable de las consecuencias

Valores de la filosofía ágil / manifiesto ágil
Valoramos más los individuos y la comunicación entre las personas que respetar procesos y herramientas. Valoramos más el software funcionando en el ámbito de producción del cliente que la documentación detallada. Valoramos más colaborar con el cliente que negociar contratos y pelear,etc. Valoramos más responder al cambio cada vez que aparece que seguir un plan que trazamos en un principio

Los 12 principios del manifiesto ágil
4. Técnicos y no técnicos trabajando juntos en todo el proyecto: los responsables de negocios, diseñadores y desarrolladores deben trabajar díá a día durante el proyecto. Al no técnico/responsable de negocio, scrum lo llama Product Owner. Por eso el PO debe estar del lado del negocio, debería ser una persona con rol de peso dentro de la empresa, con capacidad de tomar decisiones y conocimiento del producto, que esté disponible y forme parte del equipo.
5. a
6. El mejor medio de comunicación es cara a cara.
7. a
8. a
9. a
10. a
11. Las mejores arquitecturas, requisitos y diseños emergen de equipos auto-organizados. Se consulta a quien realmente va a hacer el trabajo, que conocen sus propias limitaciones

¿Qué es el agilismo?
Es un pensamiento, una forma de ver la realidad basada en los 3 pilares y cuyo mejor activo son las personas. Es un punto medio entre procesos super definidos y procesos code n'fix.

Requerimientos ágiles / Users stories
¿por qué son ágiles los requerimientos ágiles?
Lo primero es que la base del agilismo es software funcionando por soble documentación detallado: hay que satisfacer al cliente con entregas frecuentes y cercanas de software funcionando(incremento del producto potencialmente desplegable, si el PO quiere, el producto puede ponerse en producción, por lo tanto el producto debe estar en condiciones) (no prototipos ni documentos funcionales). Por esto se habla de ciclos de vida de tipo iterativos. El agilismo parte de una visión del producto traída por el PO (representante del negocio, sabe lo que quiere y necesita). Un elemento clave del agilismo es trabajar con el concepto de valor. El software que se hace debe servirle al negocio. Hay una diferencia entre salida y resultado. Salida es el software que desarrollamos y resultado es el valor que conseguimos generar en el negocio con el software desarrollado. Si el código compila pero al PO no le sirve en su negocio, el producto no sirve.
Se cumple el diagrama de paretto: el 80% del valor del software se concentra en el 20% de las funcionalidades. Esa idea se sustenta en el gráfico del "Costo del Tradicional BRUF": el 7% se usa siempre, el 13% se usa frecuentemente y el 45% no se usa nunca. Una labor del PO es que el equipo apunte al 7%.
Hay un artefacto principal dentro de la gestión ágil de requerimientos de software que es el Product Backlog: es un colector donde se depositan las cosas que se deben hacer del producto (ítems del product backlog). La forma más común sugerida es que esos ítems sean User Stories priorizadas por el PO, él puede subir y bajar la prioridad, retirar ítems del backlog porque no se necesitan.
Los requerimientos ágiles se sostienen sobre la idea de "Just in Time", tiene que ver con no destinar tiempo haciendo el 100% del product backlog para una entrega, sino con hacer una parte en el momento que se necesite. Existen requerimientos emergentes, incluso en proyectos con buenos analistas y PO se encuentran inicialmente solo el 50% de los requerimientos. El resto va apareciendo a medida que el PO ve algo de software.
La base de los requerimientos ágiles es empezar a trabajar con una visión de lo que queremos hacer con el producto. No se puede trabajar con el 100% de los requerimientos porque no es posible obtenerlos todos juntos desde el principio.

User stories
users stories - libro de Mike xd
La idea es una descripción corta de una funcionalidad que refleja una necesidad de un usuario. Las user stories existen en el dominio del problema a diferencia de los casos de uso. Hace énfasis en qué necesita el usuario que el software haga.
Una user storie tiene tres partes (las 3 c de las user stories): card, conversation, confirmation
La parte visible de la user storie es la tarjeta. La parte más importante es la conversación. En un principio el PO era el responsable de escribir las user stories. La confirmación es la expresión objetiva de cómo el PO verifica que se plasmó lo que dice la user storie en el software, casos de prueba basados en user stories.

La tarjeta tiene 3 partes principales: nombre del rol, actividad y el valor de negocio que se recibe:
	<Frase verbal (título)> - Como <nombre del rol (quien realiza la acción o quién recibe el valor de la actividad)> yo puedo <actividad> de forma tal que <valor de negocio que recibo (porque es necesaria la actividad)>
	<Criterios de aceptación o notas (pueden ser más detallados o menos detallados según se necesiten. Mientras más compleja sea la user storie, más criterios de aceptación va a tener. Los requerimientos no funcionales se llaman restricciones y algunos van en tarjetas aparte que tienen peso 0 porque no pueden entregarse solas, sino que son condicionantes del resto de las user stories. Los requerimientos no funcionales que son específicos de una sola user storie deben escribirse como criterio de aceptación)>
	<Pruebas de usuario(ejemplos de escenario de prueba que determinan si los criterios se cumplen o no)>

Es importante que el PO pertenezca al negocio para que esté en condiciones de priorizar las user stories.
El cómo se desarrollará la user storie se determina durante la conversación
El cómo técnico se va a llevar adelante el desarrollo de la user storie queda en el equipo de desarrollo. El equipo decide si la user storie escrita alcanza para desarrollar la user storie o si se necesitan diagrmas adicionales