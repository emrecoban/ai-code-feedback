---
title: Pausas
items:
  - coding_sessions.idle_gap_count
  - metric.breaks_avg
sample:
  - views/breaks.json#facts.featuredAvg = 1.7
  - views/breaks.json#facts.classAvg = 1.9
  - views/breaks.json#facts.sessions = 306
---

# Pausas

## ¿Qué es una pausa? {#what}

Una pausa es un periodo de más de dos minutos sin ninguna actividad en VS Code. Es la misma regla que decide qué cuenta como tiempo activo.

## Ejemplo con un estudiante {#example}

S07 tuvo 1,7 pausas por sesión de media, y la clase 1,9. Una pausa puede ser una conversación con el profesorado, una mirada al enunciado o un rato largo leyendo una explicación.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="breaks" /></ClientOnly>
<template #takeaway>La mayoría de las 306 sesiones tienen entre cero y tres pausas. El grupo con dos pausas por sesión es el más grande.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Se atascan los estudiantes y se detienen durante mucho tiempo?
- **Investigación:** ¿Cómo de continuo es el trabajo dentro de una sesión?

## Muestra de datos brutos {#raw}

Dos sesiones de S07.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/breaks.json

### Cómo se cuentan las pausas {#coding-sessions-idle-gap-count}

Suma 1 cuando el intervalo entre dos latidos (edición, movimiento del cursor, cambio de archivo o guardado) supera los dos minutos.

<FormulaVersion ids="coding_sessions.idle_gap_count" />

### Pausas por sesión (media, panel) {#metric-breaks-avg}

Número medio de pausas en las sesiones del periodo.

<FormulaVersion ids="metric.breaks_avg" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** `breaks_per_hour` = pausas ÷ horas activas, por estudiante.
- **Análisis de ejemplo:** Descríbalo y relaciónelo con el número de respuestas «Sigo atascado/a» (Spearman).

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Las pausas de más de dos minutos sin actividad en el editor se contaron como pausas.»

## Lo que estos datos no muestran {#limits}

Una pausa no significa que el estudiante dejara de pensar en la tarea: leer, planificar en papel y escuchar al profesorado se ven igual. El tiempo fuera de VS Code no es un latido, así que una visita al navegador también puede acabar como pausa.

## Para el profesorado {#teacher}

::: tip En clase
Muchas pausas en un laboratorio pueden indicar una tarea que necesita más explicación al principio. Compare las pausas de la clase entre laboratorios.
:::
