Un proceso se ejecuta cuando se ejecuta un proyecto de desarrollo de software
Las 4 P del desarrollo de software: - Proceso (se instancia y se adapta) - Proyecto - Producto y Personas, automatizado con herramientas 
El proceso es solo una definición, solo se ejecuta a través de un proyecto

# Procesos definidos
Buscamos definir las tareas de forma que mediante la repetición, obtengamos los mismos resultados. Se busca estructurar la creación de software. En algunos casos había dificultados, como por ejemplo:

# Proceso Empírico
Aprender a partir de la experiencia, no de forma caótica, sino que a partir de una cuestión sistematizada de ejecutar, ver cómo nos fue, aprender y comenzar de nuevo.
En lugar de definir distintas cuestiones previamente, realizar estas definiciones a partir de la experiencia. Son menos preescriptivos a la hora de su definición, y en cambio son mas adaptativos. Se establece un marco al partir del cual el equipo experimenta y aprende.
Los entornos son cambiantes y las variables que intervienen son difíciles de predecir.
Partimos de una hipótesis y ejecutamos, con la retroalimentación (identificar los valores obtenidos en el sprint) y revisión nos adaptamos, comenzando nuevamente el ciclo.

## Ciclo de vida
(Capítulo 7 de rapid development (desarrollos de procesos informáticos))
Puede ser del proyecto o del producto
### Del proyecto
El proyecto es único y tiene una duración limitada. Su objetivo es medible, tiene un inicio y tiene un fin. El proyecto ejecuta las actividades definidas en el proceso.
Es la instancia del proceso
Es la representación del proceso, establece cómo se van a ejecutar las actividades definidas.
#### Clasificación
No pueden ejecutarse con cualquier tipo de proceso
Secuencial: *en general* se trabaja con proceso definido, pero también pueden ser empíricos
Iterativo: se trabajan con procesos empíricos. Luego de cada iteración debe haber un entregable de producto capaz de desplegarse en producción
Recursivo: el proyecto vuelve sobre sí mismo. Se usa generalmente cuando los riesgos es una variable de gran peso
### Del producto
El ciclo de vida está relacionado con el producto de software en sí. Su ciclo de vida termina cuando el producto deja de ser usado o es remplazado. En un ciclo de vida de un producto intervienen muchos ciclos de vida del proyecto

# Que es un proyecto
## Características
- Son únicos, no hay un proyecto igual a otro, aunque dos proyectos tengan el mismo objetivo. Sus variables, clientes, presupuestos, etc serán distintos
- Tiene que tener una duración limitada. Debo poder definir un objetivo y medir cuando ese objetivo se cumpla
- Tiene que tener un objetivo, medible, no ambiguo y poder determinar cuando se cumplio
- Tienen tareas interrelacionadas entre si, ejecutadas por recursos (personas), cuya interralación aumenta la complejidad debido a la comunicación
El proceso de planificación es lo más importante

Es necesario tener un plan por la complejidad de las variables.
Lo que todas las herramientas resuelven son los accidentes a la hora de crear software (restricciones de hardware, de despliegue, por ejemplo). Lo que es incurable es la dificultad de interpretar las necesidades de las personas, la complejidad del software inherente que lo hace único, la presión por cambiar, ya sea por entornos tecnológicos, y la invisibilidad, no hay representación física concreta. Sin personas capacitadas para resolver estos problemas, por mas tecnologías que se desarrollen, los problemas no se resuelven

The mithical man-month

Agregar personas a un proyecto atrasado lo va a atrasar aun más

La integridad conceptual es la meta suprema del diseño. Es preferible que el software resuelve un problema en específico a que sea una colección de features

El ecosistema de un software exitoso tiene personas autogestionadas, es conceptualmente íntegro, iterativo e incremental

**La triple restricción**: los proyectos tienen un alcance, un tiempo y un costo. Tenemos una fecha comprometida y un presupuesto comprometido. Si los requerimientos cambian y ninguna de estas variables se modifica, lo que se ve afectado es la calidad.
Cuando tengo definida la triple restriccion y alguna de las variable cambia, generalmente debemos cubrirla modificando las otras dos, para que no se afecte la calidad, lo cual nunca deberia ser negociable

Gestion tradicional de proyecto
Roles del lider de proyecto: se comunica con el equipo de proyecto y con todos los stakeholders
Crea y mantiene el plan de proyecto, donde dice de donde partimos, a donde vamos a llegar, cuanto tiempo lleva, cuanto sale, quienes estan involucrados, etc. Ese plan es algo vivo, porque esta sujeto a cambios inesperados en su desarrollo.

Que es un equipo de proyecto
Personas comprometidas a alcanzar un conjunto de objetivos, relacionados al objetivo del proyecto. Debemos tener un conjunto de habilidades, trabajar en conjunto, tener sentido de responsabilidad. Usualmente es un grupo pequeño, para reducir los problemas de comunicacion principalmente

Estimaciones
Riesgos
Gestión de riesgos: tiene dos variables, probabilidad de ocurrencia e impacto. Se generan un top de 5 riesgos y, dependiendo del proyecto, mitigamos la probabilidad de ocurrencia, el impacto o ambas. Mitigar los riesgos es costoso, por lo que no podemos mitigar todos. La lista de riesgos se va actualizando, porque estos cambian, desaparecen o surgen unos nuevos.

Métricas de software
Es una medida observable de la realidad.
Son importantes porque sirven para el monitoreo de control. En la gestión de proyecto tradicional se dividen en de proceso, de proyecto y de producto. Las métricas de producto apuntan a medir el producto de software que creamos, útiles incluso terminado el proyecto. Las métricas de proyecto y de proceso están vinculado. Las métricas de proyecto miden las cosas que nos interesan de nuestro proyecto para saber cómo vamos en las acciones que tenemos que hacer y si necesitamos hacer algunos cambios correctivos y analizar que pasó. Las métricas de proceso miden muchos proyectos del mismo proceso. Las métricas de proyecto y de proceso son las mismas, enunciadas de distinta manera, debido a que tienen un alcance distinto pero relacionado

Las métricas nunca tiene como objetivo medir a las personas y su productividad
No se trabaja para las métricas, deben ser sencillas de obtener
Debemos tomar métricas en tiempos coherentes
Tiene que aportar utilidad, si estan mal formuladas o dibujadas, no sirven.
Si se establecen como objetivos, pueden dar valores mejores, pero esa medicion estaria sesgada

Monitoreo de control: Comparar lo planificado y lo real

Prox clase: 