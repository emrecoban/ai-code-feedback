---
title: Bastó con la pista
items:
  - metric.hint_enough_pct
sample:
  - views/hint-was-enough.json#facts.featuredQuestions = 37
  - views/hint-was-enough.json#facts.featuredSolvedAlone = 22
  - views/hint-was-enough.json#facts.featuredPct = 59.5
  - views/hint-was-enough.json#facts.classPct = 57.1
---

# Bastó con la pista

## ¿Qué significa «bastó con la pista»? {#what}

Es la proporción de preguntas en las que el estudiante no abrió la regla (L2) ni la corrección (L3). La primera pista, que explica el error con palabras sencillas y dónde está (L0–L1), bastó para seguir.

## Ejemplo con un estudiante {#example}

S07 hizo 37 preguntas y se detuvo tras la primera pista en 22, es decir, el 59,5%. El valor de la clase fue del 57,1%. La versión semanal de esta tasa está en la página [Tendencia de autonomía](./independence-trend#hint-enough).

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="hint-was-enough" /></ClientOnly>
<template #takeaway>La mayoría de los estudiantes se detuvieron tras la primera pista en más del 40% de sus preguntas. S07 está en el grupo del 40–60%.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Con qué frecuencia basta una pista pequeña para mis estudiantes?
- **Investigación:** ¿Cuánto apoyo necesitan los estudiantes por pregunta, como una medida de autonomía?

## Muestra de datos brutos {#raw}

El valor procede de la profundidad de cada pregunta. La fila de S07 en la lista de estudiantes del panel:

Parte del JSON que devuelve `dashboard_students`:

<<< @/../.vitepress/data/sample/snippets/hint-was-enough.json

### Bastó con la pista (panel) {#metric-hint-enough-pct}

Preguntas del periodo que terminaron en L0–L1 (profundidad 0 o 1) divididas entre todas las preguntas del periodo. Para un estudiante, el panel aplica la misma regla a sus preguntas.

<FormulaVersion ids="metric.hint_enough_pct" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `hint_enough_pct` por estudiante en todo el estudio, y por semana para los análisis de tendencia.
- **Análisis de ejemplo:** Compare las primeras y las últimas semanas con una prueba t para muestras relacionadas, y correlacione el valor global con la ganancia de aprendizaje.

**Preguntas de investigación**

<RqList ids="metric.hint_enough_pct" />

**Frase de ejemplo (Método):** «La proporción de peticiones de ayuda que terminaron tras el primer nivel de pista se usó como indicador de autonomía.»

## Lo que estos datos no muestran {#limits}

Un estudiante que se detuvo tras la primera pista pudo rendirse, preguntar a un compañero o resolver el problema. La tasa no dice nada de los errores corregidos sin preguntar. El nivel L1 nunca se guarda solo, así que L0 y L1 aparecen siempre juntos.

## Para el profesorado {#teacher}

::: tip En clase
Lea esta tasa junto a «Error resuelto tras explicar». Una tasa alta con errores que desaparecen es buena señal. Una tasa alta con errores que siguen puede indicar que los estudiantes se rinden pronto.
:::
