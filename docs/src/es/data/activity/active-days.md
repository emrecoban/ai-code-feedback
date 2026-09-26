---
title: Días activos
items:
  - metric.active_days
sample:
  - views/active-days.json#facts.featured = 11
  - views/active-days.json#facts.classMedian = 12
  - views/active-days.json#facts.labs = 8
---

# Días activos

## ¿Qué son los días activos? {#what}

Los días activos son el número de fechas distintas en las que empezó al menos una sesión. Es una medida sencilla de la regularidad con la que el estudiante trabajó con la extensión.

## Ejemplo con un estudiante {#example}

S07 estuvo activo 11 días en ocho semanas. El panel del estudiante muestra el mismo número como «Días usando esto». La mediana de la clase fue de 12 días, así que la mayoría también trabajó algunos días fuera de los 8 laboratorios.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="active-days" /></ClientOnly>
<template #takeaway>Todos los estudiantes estuvieron activos al menos seis días. S07 está en el grupo de 9–11, cerca de la mediana de la clase.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Quién usa la extensión solo en el laboratorio y quién también en casa?
- **Investigación:** ¿Qué regularidad tiene el uso, como control de la exposición?

## Muestra de datos brutos {#raw}

Los días activos se cuentan a partir de las horas de inicio de las sesiones. Tres sesiones de S07 en tres días distintos:

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/active-days.json

### Días activos (panel) {#metric-active-days}

Fechas distintas de los inicios de sesión del periodo, en la zona horaria de quien ve el panel.

<FormulaVersion ids="metric.active_days" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis (como variable de control)
- **Un valor por estudiante para SPSS:** `active_days` por estudiante.
- **Análisis de ejemplo:** Inclúyalo como covariable al relacionar los patrones de uso con la ganancia de aprendizaje.

**Preguntas de investigación**

<RqList ids="metric.active_days" />

**Frase de ejemplo (Método):** «La regularidad de uso se midió como el número de días distintos con al menos una sesión de programación.»

## Lo que estos datos no muestran {#limits}

El número tiene tres versiones: el panel usa la zona horaria de quien lo ve, el panel del estudiante usa el ordenador del estudiante y el resumen de IA usa UTC. Un día con solo una sesión vacía también cuenta. No dice nada sobre cuánto trabajó el estudiante ese día.

## Para el profesorado {#teacher}

::: tip En clase
Un estudiante activo solo los días de laboratorio no hace nada mal. Use el número para planificar: tareas breves entre laboratorios pueden repartir la práctica.
:::
