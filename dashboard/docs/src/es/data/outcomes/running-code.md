---
title: Ejecutar el código
items:
  - event.run_finished
  - event.run_finished.exitCode
  - event.run_finished.success
  - metric.runs
sample:
  - views/running-code.json#facts.featuredRuns = 2
  - views/running-code.json#facts.runs = 103
  - views/running-code.json#facts.debugRuns = 768
---

# Ejecutar el código

## ¿Qué se registra al ejecutar el código? {#what}

Cuando termina una tarea de VS Code, la extensión registra su código de salida y si terminó sin error. Un programa iniciado escribiendo una orden en el terminal, o con el botón habitual «Run Python File», no es una tarea y no se ve.

## Ejemplo con un estudiante {#example}

S07 ejecutó una tarea 2 veces en ocho semanas. Como la mayoría, ejecutaba los programas con el botón de ejecutar o con el depurador, que los eventos de tareas no recogen. En la clase se registraron 103 ejecuciones de tareas frente a 768 depuraciones.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="running-code" /></ClientOnly>
<template #takeaway>Las ejecuciones de tareas son poco frecuentes frente a las depuraciones. Unas seis de cada diez terminan sin error.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Prueban los estudiantes sus programas después de un cambio?
- **Investigación:** ¿Termina sin error con más frecuencia una ejecución posterior a una explicación?

## Muestra de datos brutos {#raw}

Un evento de la muestra.

`events`:

<<< @/../.vitepress/data/sample/snippets/running-code.json

### Terminaron sin error {#event-run-finished-success}

Verdadero cuando el código de salida de la tarea es 0.

<FormulaVersion ids="event.run_finished.success" />

### Ejecutar el código (panel) {#metric-runs}

Ejecuciones del periodo, ejecuciones sin error, ejecuciones en los 15 minutos siguientes a una pregunta en la misma sesión y cuántas de ellas terminaron sin error.

<FormulaVersion ids="metric.runs" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis (solo si la asignatura usa tareas de VS Code)
- **Un valor por estudiante para SPSS:** `task_runs` y `task_success_share` por estudiante.
- **Análisis de ejemplo:** Solo de forma descriptiva. La medida es demasiado incompleta para hacer inferencias, salvo que la asignatura ejecute todos los programas como tareas.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Las ejecuciones de programas solo eran observables cuando se iniciaban como tareas de VS Code, por lo que se informaron de forma descriptiva.»

## Lo que estos datos no muestran {#limits}

La mayoría de los programas de principiantes no se inician como tareas, así que estos datos no recogen la mayoría de las ejecuciones. El subtítulo del panel «Ejecuciones en el terminal» exagera lo que se observa. Un código de salida 0 solo significa que el programa no falló, no que su salida fuera correcta.

## Para el profesorado {#teacher}

::: tip En clase
No interprete un número bajo de ejecuciones como falta de pruebas. Pregunte directamente a los estudiantes cómo ejecutan sus programas.
:::
