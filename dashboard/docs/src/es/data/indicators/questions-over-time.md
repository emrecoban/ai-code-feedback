---
title: Preguntas a lo largo del tiempo
items:
  - metric.questions
  - metric.questions_total
sample:
  - views/questions-over-time.json#facts.featured = 37
  - views/questions-over-time.json#facts.featuredWeek1 = 6
  - views/questions-over-time.json#facts.featuredWeek8 = 2
  - views/questions-over-time.json#facts.total = 928
  - views/questions-over-time.json#facts.week1 = 130
  - views/questions-over-time.json#facts.week8 = 85
---

# Preguntas a lo largo del tiempo

## ¿Qué es el número de preguntas? {#what}

Cada petición de ayuda que recibió respuesta es una pregunta, es decir, una fila de la tabla `interactions`. El panel las cuenta por periodo y compara el recuento con el periodo anterior de la misma duración.

## Ejemplo con un estudiante {#example}

S07 hizo 37 preguntas en ocho semanas: 6 en la semana 1 y 2 en la semana 8. La clase hizo 928 preguntas, 130 en la semana 1 y 85 en la semana 8.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="questions-over-time" /></ClientOnly>
<template #takeaway>La clase pregunta más en la semana 3 y menos cada semana a partir de ahí.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Pregunta la clase más o menos que antes?
- **Investigación:** ¿Cómo cambia la búsqueda de ayuda con las semanas?

## Muestra de datos brutos {#raw}

Dos días de la serie de la clase en el panel.

Parte del JSON que devuelve `dashboard_overview`:

<<< @/../.vitepress/data/sample/snippets/questions-over-time.json

### Preguntas (panel) {#metric-questions}

Preguntas creadas en el periodo. El periodo anterior tiene la misma duración y termina donde empieza este.

<FormulaVersion ids="metric.questions" />

### Preguntas totales (panel) {#metric-questions-total}

Todas las preguntas del estudiante, sea cual sea el periodo.

<FormulaVersion ids="metric.questions_total" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `questions` por estudiante, y `questions_per_hour` = preguntas ÷ horas activas.
- **Análisis de ejemplo:** Modele el recuento semanal por estudiante con una regresión de Poisson mixta, con la semana como predictor.

**Preguntas de investigación**

<RqList ids="metric.questions" />

**Frase de ejemplo (Método):** «La búsqueda de ayuda se midió como el número de peticiones de ayuda por estudiante y semana.»

## Lo que estos datos no muestran {#limits}

Las peticiones fallidas no crean pregunta. Menos preguntas pueden significar más autonomía, tareas más difíciles que los estudiantes abandonan o simplemente menos errores. Las tareas cambian cada semana, así que las semanas no son del todo comparables.

## Para el profesorado {#teacher}

::: tip En clase
Una subida brusca en una semana suele señalar un tema nuevo. Prepare una explicación breve para el inicio del siguiente laboratorio.
:::
