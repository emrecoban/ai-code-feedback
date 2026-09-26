---
title: Tiempo en pantalla
items:
  - event.explanation_visibility
  - event.explanation_visibility.visibleMs
  - event.explanation_visibility.visibleAtDelivery
  - metric.reading_on_screen_pct
  - metric.reading_visible_median
sample:
  - views/time-on-screen.json#facts.featuredMedianSec = 52
  - views/time-on-screen.json#facts.classMedianSec = 44
  - views/time-on-screen.json#facts.onScreenPct = 84.9
  - views/time-on-screen.json#facts.measured = 837
  - views/time-on-screen.json#facts.explanations = 928
---

# Tiempo en pantalla

## ¿Qué es el tiempo en pantalla? {#what}

El tiempo en pantalla es cuánto tiempo estuvo visible el panel de la extensión mientras una explicación era la actual. El evento indica además si el panel estaba visible cuando llegó la explicación.

## Ejemplo con un estudiante {#example}

Para S07, la mediana del tiempo en pantalla fue de 52 segundos, y para la clase de 44. El tiempo termina cuando la siguiente explicación sustituye a la actual o cuando se cierra VS Code.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="time-on-screen" /></ClientOnly>
<template #takeaway>La mayoría de las explicaciones quedan en pantalla entre 10 segundos y 2 minutos. S07 está en el grupo de 30–60 s.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Miran realmente los estudiantes las explicaciones?
- **Investigación:** ¿Se puede confiar en las demás medidas de lectura, es decir, estaba visible el panel?

## Muestra de datos brutos {#raw}

Un evento de S07.

`events`:

<<< @/../.vitepress/data/sample/snippets/time-on-screen.json

### Cómo se mide el tiempo {#event-explanation-visibility-visiblems}

La suma de los periodos en que la vista del panel estuvo visible mientras esta explicación era la actual, en milisegundos.

<FormulaVersion ids="event.explanation_visibility.visibleMs" />

### En pantalla al llegar (panel) {#metric-reading-on-screen-pct}

Preguntas con un evento en que el panel estaba visible al llegar, divididas entre las preguntas con algún evento de este tipo. En la muestra: 84,9%.

<FormulaVersion ids="metric.reading_on_screen_pct" />

### Tiempo en pantalla (mediana, panel) {#metric-reading-visible-median}

Mediana del tiempo en pantalla en los eventos de las preguntas del periodo.

<FormulaVersion ids="metric.reading_visible_median" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `median_visible_s` por estudiante, y `on_screen_share` como proporción de explicaciones visibles al llegar.
- **Análisis de ejemplo:** Úselo para filtrar o ponderar las demás medidas de lectura y correlacione la mediana con la profundidad de las pistas.

**Preguntas de investigación**

<RqList ids="event.explanation_visibility.visibleMs,metric.reading_visible_median" />

**Frase de ejemplo (Método):** «Se registró el tiempo que el panel de retroalimentación estuvo visible en cada explicación como límite superior del tiempo de lectura.»

## Lo que estos datos no muestran {#limits}

Visible no significa leído: el estudiante puede mirar el código con el panel abierto. El evento de la última explicación antes de cerrar VS Code se pierde a menudo, así que en la muestra 837 de 928 explicaciones tienen valor. El tiempo es un límite superior de la lectura.

## Para el profesorado {#teacher}

::: tip En clase
Si las explicaciones desaparecen de la pantalla a los pocos segundos, muestre a los estudiantes dónde está el panel y que puede quedarse abierto junto al código.
:::
