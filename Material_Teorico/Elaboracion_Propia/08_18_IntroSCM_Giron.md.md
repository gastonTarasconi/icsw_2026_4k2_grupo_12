
# Gestion de configuracion de sw

# Actividades fundamentales 
## 1. identificar items de configuracion 

> no cuaquier es un **item de configruiacin**, mail de aprobacion de entrega/ de plan si es IC

dentro de esta identifcacion defino una **regla de nombrado** (tp4)

> codigo fuente es IC, en esta materia vamos a generar codigo fuente, etnonces definimos reglas


**reglas** como NombreClase.java
- por ej que todas las clases prefijo, nombre del producto

### Listado de reglas de configuracion

| nombre                 | regla              | ubicacion                                                     |
| ---------------------- | ------------------ | ------------------------------------------------------------- |
| Clase de codigo fuente | AVNombreClase.java | >aca hablamos de repositorios ../AV/codigoFuente/SubsitemaNN/ |
|                        |                    |                                                               |
|                        |                    |                                                               |


>**Repositorio** tiene una estructura fisica, adentro agrupando los IC en contenedores mas pequenos


en ubicacion va generlamente una direccion IP, pq repo esta subido ala nube


**Glosario**
- AV: Aulavirtual
- NN:

tengo que armar un **plan de SCM (plan de gestion de cofiguracion)** se define quien esta invlucrados, para que in es, estructura del repo, todo lo que esta alrededro del plan de gestion de configuracion

**SCM** es IC? si, entonces a la vez tene que tener definido reposiotiro, regla de nombrado, etc

**SCM** en un proyecto va haber 1 solo


## 2. control de cambios

aca aparece un rol en particular

existen procesos definidos y 


PD aparece un rol de **CCC comite de contrl carga**, controla que caundo se haga un cambio se mantegna integridad del producto


> **linea base:** version estable de prodcuto pq ya paso por un CCC, diciendo que ya esta integro y no hay inconssitencia, paso todas las pruebas definidas en el plan de gesiton de proyecto
> Es decir, una configuracion que tiene la caracteristica a su vez de ser estable, en una version particular en un momento dado, version actual, una foto



segun el ciclo de vidad usado los porecesos van a ser distinitos, y los IC y la linea base va ser distinta 

existen cascada, iterativo, definir la linea base y en SCM es parte del tp4

TP5 evalua uso del repositorio, a fin de ano, fijan memento de defincion de linea base, actulizacion de ic nuevos, commits periodicos

### 3. reporte de Estados


evaluan usarios que commitean, trabajo en equipo sobre el repositorio

concepto de version, saberlo, en un ic.

el concepto de ramas cuando tengo ic o conjunto de ic que se abren de manera paralela


> en ambientes agiles, aparece esta necsitdad de que se ejecuten pruebas unitarias d emanera automatica, lo vemos en tp de despliegue 


practicas continuas: permiten hacer SCM en ambientes agiles, nace con la necesiada de procesos agiles, velocidad para el desarrollo (proceso de itengracion continua)

## 4. Auditorias de configuracion


una auditoria es (tema de la materia) procesos de evaluacion que busca ser objetivo, apra estp tiene que ser externo, entocnes depende que estoy auditando

es decir alguien que no sean mimebro del equipo de proyecto ,alguien fuera de la organizacion


hay 2 

- fisica
- funcional


lo que dice el SCM este con le nombre correcto en la ubi coreecta



va mas alla del item este, busca mas asegurar la itengridad del porcuto, valida que hya atrazabilidad entre los IC


> [!NOTE] concepto de examen
> Matriz de rastreabilidad/Trazabilidad:
> matriz que marca esta trazabilaida, este requ gener este archivo de codigo guentem asociado a este archivo de codigo de preubas
esta usada para auditorais funcionales



> [!NOTE] pregunta de parcial(desarrolada en undiad de auditorias
> conjunto de preguntas, checkbox? y despues genero un informe de auditoriao que infromo que halaszgos hay, estos pueden tener severidades, en base a esto puedo decidir si lo corrgio o no, se pueden refutar estso hallazgos y decir lohago asi por tal manera


carpeta de TP. no puedo dejarla vacia, averiguar esto


---


| nombre | regla de nombrado | ubicacion | tipo |
| ------ | ----------------- | --------- | ---- |
|        |                   |           |      |
|        |                   |           |      |
fecha final entrega martes 25, ver consigna tp4, respetar la consigna

