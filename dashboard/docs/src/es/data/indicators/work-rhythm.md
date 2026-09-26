---
title: Cuándo trabajan los estudiantes
items:
  - metric.work_rhythm
sample:
  - views/work-rhythm.json#facts.peakDay = 2
  - views/work-rhythm.json#facts.peakHour = 10
  - views/work-rhythm.json#facts.labPct = 78
---

# Cuándo trabajan los estudiantes

## ¿Qué es el ritmo de trabajo? {#what}

El panel cuenta las preguntas y los inicios de sesión por día de la semana y hora del día. El resultado es una cuadrícula de 7 días y 24 horas.

## Ejemplo con un estudiante {#example}

La celda con más actividad de la clase es el día 2 de la semana (martes) a las 10:00, en horario de laboratorio. El 78% de todas las preguntas se hizo el martes entre las 10:00 y las 12:00. El resto se repartió por las tardes de los demás días.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="work-rhythm" /></ClientOnly>
<template #takeaway>La mayoría de las preguntas se hacen en el laboratorio. El trabajo en casa se hace por la tarde.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Piden ayuda los estudiantes también fuera del horario de laboratorio?
- **Investigación:** ¿Qué parte del uso ocurre en clase y qué parte en el estudio autónomo?

## Muestra de datos brutos {#raw}

Tres celdas de la cuadrícula: día de la semana (1 = lunes), hora y número de preguntas.

Parte del JSON que devuelve `dashboard_insights`:

<<< @/../.vitepress/data/sample/snippets/work-rhythm.json

### Cuándo trabajan los estudiantes (panel) {#metric-work-rhythm}

Recuentos por día ISO de la semana (1 a 7) y hora (0 a 23) en la zona horaria de quien mira: preguntas por su hora y sesiones por su inicio.

<FormulaVersion ids="metric.work_rhythm" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** `lab_share` = preguntas en horario de laboratorio ÷ todas las preguntas, por estudiante.
- **Análisis de ejemplo:** Compare la ganancia de aprendizaje de quienes también trabajan en casa con la de quienes solo trabajan en el laboratorio (U de Mann–Whitney).

**Preguntas de investigación**

<RqList ids="metric.work_rhythm" />

**Frase de ejemplo (Método):** «Las peticiones de ayuda se clasificaron según se hicieran dentro o fuera del horario de laboratorio.»

## Lo que estos datos no muestran {#limits}

Las horas se muestran en la zona horaria de quien ve el panel, no en la del estudiante. La cuadrícula no conoce el horario de laboratorio, así que el «horario de laboratorio» debe definirlo quien investiga. Cuenta eventos, no el tiempo de trabajo.

## Para el profesorado {#teacher}

::: tip En clase
Si llegan muchas preguntas tarde la noche antes de una entrega, piense en un plazo más temprano o en una breve tutoría en línea.
:::
