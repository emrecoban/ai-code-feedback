---
title: Depuraciones y tareas ejecutadas
items:
  - coding_sessions.debug_session_count
  - coding_sessions.task_run_count
sample:
  - views/debug-and-task-runs.json#facts.featuredDebug = 24
  - views/debug-and-task-runs.json#facts.featuredTasks = 2
  - views/debug-and-task-runs.json#facts.classDebug = 768
  - views/debug-and-task-runs.json#facts.classTasks = 103
---

# Depuraciones y tareas ejecutadas

## ¿Qué son las depuraciones y las tareas ejecutadas? {#what}

Dos contadores. El primero sube cada vez que empieza una sesión de depuración en VS Code, lo que también ocurre con «Ejecutar sin depurar» del menú Ejecutar. El segundo sube cada vez que empieza una tarea de VS Code. Un programa escrito como orden en el terminal no es ninguna de las dos cosas.

## Ejemplo con un estudiante {#example}

S07 inició 24 depuraciones y 2 tareas en ocho semanas. La semana 4 tuvo más depuraciones. En la clase, las depuraciones (768) fueron mucho más frecuentes que las tareas (103).

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="debug-and-task-runs" /></ClientOnly>
<template #takeaway>El gráfico muestra las depuraciones. La clase inicia unas cuatro por semana. S07 tiene un pico claro en la semana 4.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Usan los estudiantes el depurador?
- **Investigación:** ¿Con qué frecuencia ejecutan los estudiantes sus programas desde VS Code, en la medida en que la extensión lo ve?

## Muestra de datos brutos {#raw}

Dos sesiones de S07.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/debug-and-task-runs.json

### Depuraciones {#coding-sessions-debug-session-count}

Cada sesión de depuración iniciada en VS Code suma 1. La extensión suma al contador mientras el estudiante trabaja y lo añade a la fila de la sesión cada 3 minutos.

<FormulaVersion ids="coding_sessions.debug_session_count" />

### Tareas ejecutadas {#coding-sessions-task-run-count}

Cada tarea de VS Code iniciada suma 1. El resultado de la tarea se registra en la página «Ejecutar el código».

<FormulaVersion ids="coding_sessions.task_run_count" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** `runs_per_hour` = (depuraciones + tareas) ÷ horas activas, por estudiante.
- **Análisis de ejemplo:** Descríbalo junto a los guardados. No lo use como recuento completo de ejecuciones.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Se contaron las ejecuciones iniciadas desde el editor (sesiones de depuración y tareas), mientras que las escritas en el terminal no eran observables.»

## Lo que estos datos no muestran {#limits}

El botón «Run Python File» de la extensión de Python ejecuta el programa en el terminal y no se cuenta. Por eso los números dependen de cómo ejecuta cada estudiante el código. Una depuración no significa que el estudiante usara puntos de interrupción.

## Para el profesorado {#teacher}

::: tip En clase
Si casi nadie usa el depurador, una breve demostración de puntos de interrupción en un laboratorio puede merecer la pena.
:::
