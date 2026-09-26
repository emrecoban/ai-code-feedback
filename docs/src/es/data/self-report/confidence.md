---
title: Podría hacerlo solo
items:
  - interactions.post_confidence
  - metric.calibration
sample:
  - views/confidence.json#facts.featuredYes = 1
  - views/confidence.json#facts.featuredMaybe = 9
  - views/confidence.json#facts.featuredNo = 4
  - views/confidence.json#facts.yesAgainPct = 51.7
  - views/confidence.json#facts.noAgainPct = 80.6
---

# Podría hacerlo solo

## ¿Qué es la respuesta de confianza? {#what}

Bajo cada explicación, el estudiante puede responder a «¿Podrías hacerlo tú ahora?» con Sí, Quizás o Todavía no. Más tarde, el panel comprueba si volvió el mismo error o concepto.

## Ejemplo con un estudiante {#example}

S07 respondió Sí 1 vez, Quizás 9 veces y Todavía no 4 veces. En la clase, quienes dijeron Sí volvieron más tarde con el mismo error o concepto en el 51,7% de los casos, y quienes dijeron No en el 80,6%.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="confidence" /></ClientOnly>
<template #takeaway>Cuanto menos confiada era la respuesta, más a menudo volvió el mismo error o concepto. Las respuestas contienen información real.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Se sienten los estudiantes capaces de resolver solos problemas parecidos después de una explicación?
- **Investigación:** ¿Está calibrada la confianza de los estudiantes, es decir, predice si el problema vuelve?

## Muestra de datos brutos {#raw}

Dos preguntas respondidas de S07.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/confidence.json

### ¿Se sostiene la confianza? (panel) {#metric-calibration}

Para cada respuesta (Sí, Quizás, No) en las preguntas del periodo: el número de respuestas y cuántas fueron seguidas más tarde, en cualquier momento, por una pregunta del mismo estudiante con el mismo error normalizado o el mismo concepto.

<FormulaVersion ids="metric.calibration" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `conf_yes_share` = Sí ÷ respuestas por estudiante, y una variable de calibración = proporción de respuestas Sí no seguidas de una repetición.
- **Análisis de ejemplo:** Contraste si la respuesta predice una repetición posterior con una regresión logística mixta (estudiante como efecto aleatorio).

**Preguntas de investigación**

<RqList ids="interactions.post_confidence,metric.calibration" />

**Frase de ejemplo (Método):** «La calibración se evaluó como la proporción de respuestas seguras que no fueron seguidas de una petición posterior sobre el mismo error o concepto.»

## Lo que estos datos no muestran {#limits}

La comprobación no tiene límite de tiempo, así que las respuestas de las primeras semanas tienen más tiempo para una repetición que las últimas. Una repetición solo se ve si el estudiante vuelve a preguntar, no si encuentra el error y lo corrige solo. Los conceptos escritos de forma distinta no coinciden.

## Para el profesorado {#teacher}

::: tip En clase
Si un estudiante responde a menudo «Todavía no», proponga una práctica breve sobre la misma idea y pídale que la intente sin la extensión.
:::
