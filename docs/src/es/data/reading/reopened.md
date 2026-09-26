---
title: La volvió a abrir
items:
  - event.explanation_reopened
  - metric.reopened
sample:
  - views/reopened.json#facts.featured = 1
  - views/reopened.json#facts.reopened = 60
  - views/reopened.json#facts.explanations = 928
---

# La volvió a abrir

## ¿Qué es una explicación reabierta? {#what}

El panel de progreso de la extensión muestra las diez últimas preguntas. Un clic en una tarjeta muestra otra vez la explicación guardada, y el evento lo registra.

## Ejemplo con un estudiante {#example}

S07 reabrió 1 explicación desde el historial. En la clase, 60 de 928 explicaciones se volvieron a abrir más tarde.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="reopened" /></ClientOnly>
<template #takeaway>La mayoría de las explicaciones se reabren entre cuatro y siete días después, cerca del siguiente laboratorio.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿A qué explicaciones merece la pena volver?
- **Investigación:** ¿Usan los estudiantes la retroalimentación anterior para repasar?

## Muestra de datos brutos {#raw}

Un evento de la muestra. No tiene datos adicionales.

`events`:

<<< @/../.vitepress/data/sample/snippets/reopened.json

### La volvió a abrir (panel) {#metric-reopened}

Preguntas distintas del periodo con al menos una reapertura, sea cuando sea.

<FormulaVersion ids="metric.reopened" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y después (repaso)
- **Un valor por estudiante para SPSS:** `reopen_count` por estudiante.
- **Análisis de ejemplo:** Correlacione el número de reaperturas de la última semana con la puntuación del postest (Spearman).

**Preguntas de investigación**

<RqList ids="metric.reopened" />

**Frase de ejemplo (Método):** «La reapertura de una explicación anterior desde el historial se registró como una acción de repaso.»

## Lo que estos datos no muestran {#limits}

En la lista solo aparecen las diez últimas preguntas, así que las explicaciones más antiguas no pueden reabrirse ahí. Un clic puede ser curiosidad más que estudio. El evento no dice nada sobre cuánto leyó el estudiante.

## Para el profesorado {#teacher}

::: tip En clase
Antes de un examen, recuerde a los estudiantes que sus explicaciones anteriores están en el panel de progreso y se pueden volver a leer.
:::
