---
title: Apertura de los niveles de la pista
items:
  - event.level_reached
  - event.level_reached.level
  - event.level_reached.isEscalation
  - event.level_reached.msSinceCreated
  - metric.reading_to_rule_median
  - metric.reading_to_fix_median
sample:
  - views/level-timing.json#facts.title = Undefined variable total
  - views/level-timing.json#facts.toRuleSec = 38
  - views/level-timing.json#facts.toFixSec = 47
  - views/level-timing.json#facts.classToRuleSec = 22
  - views/level-timing.json#facts.classToFixSec = 44
---

# Apertura de los niveles de la pista

## ¿Qué muestra el momento en que se abren los niveles? {#what}

Cada vez que el estudiante abre la regla (L2) o la corrección (L3), el servidor guarda un evento con el tiempo transcurrido desde la pregunta. Los eventos muestran si el estudiante leyó primero los primeros pasos o pasó directamente a la corrección.

## Ejemplo con un estudiante {#example}

S07 preguntó por «Undefined variable total». Abrió la regla 38 segundos después de preguntar y la corrección 47 segundos después. Las medianas de la clase fueron 22 y 44 segundos. La línea de tiempo de abajo muestra qué más pasó después de esta pregunta.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="level-timing" /></ClientOnly>
<template #takeaway>Una sola pregunta, muchas huellas: los niveles, la vuelta al código, la primera edición y el momento en que el error desapareció.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Leen los estudiantes los primeros pasos o saltan a la respuesta?
- **Investigación:** ¿Cuánto tiempo pasan los estudiantes en cada paso antes de abrir el siguiente?

## Muestra de datos brutos {#raw}

Los dos eventos de nivel de la pregunta de la línea de tiempo.

`events`:

<<< @/../.vitepress/data/sample/snippets/level-timing.json

### Cómo se calcula el tiempo {#event-level-reached-mssincecreated}

Hora del servidor al abrir el paso menos el momento en que se guardó la pregunta, en milisegundos. El mismo paso se guarda una sola vez por pregunta.

<FormulaVersion ids="event.level_reached.msSinceCreated" />

### Abrió L2 tras (mediana, panel) {#metric-reading-to-rule-median}

Mediana de los tiempos hasta abrir L2 en los eventos de nivel de las preguntas del periodo.

<FormulaVersion ids="metric.reading_to_rule_median" />

### Abrió L3 tras (mediana, panel) {#metric-reading-to-fix-median}

La misma mediana para L3.

<FormulaVersion ids="metric.reading_to_fix_median" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `median_s_to_rule` y `median_s_to_fix` por estudiante, en las preguntas en que se abrió el paso.
- **Análisis de ejemplo:** Compare el tiempo hasta la corrección en las primeras y las últimas semanas, o úselo como predictor del parecido entre la siguiente edición y la corrección.

**Preguntas de investigación**

<RqList ids="metric.reading_to_rule_median,metric.reading_to_fix_median" />

**Frase de ejemplo (Método):** «El tiempo desde la petición hasta la apertura de cada nivel más profundo se registró en el servidor.»

## Lo que estos datos no muestran {#limits}

El tiempo se mide en el servidor, así que incluye el retraso de la red. Un tiempo largo puede indicar una lectura atenta, pero también que el panel estaba oculto. Si un estudiante abre un paso en una explicación reabierta días después, el tiempo es muy largo.

## Para el profesorado {#teacher}

::: tip En clase
Si los estudiantes abren la corrección en pocos segundos, muestre en clase cómo usar la pregunta de Ubicar (L1) para encontrar la línea por sí mismos.
:::
