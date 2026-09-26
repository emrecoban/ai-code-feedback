---
title: Cerró el selector de preguntas
items:
  - event.question_picker_abandoned
  - event.question_picker_abandoned.stage
  - event.question_picker_abandoned.triggerSurface
  - event.question_picker_abandoned.selectionLineCount
  - event.question_picker_abandoned.selectionCharCount
  - metric.picker_abandoned
sample:
  - views/question-picker-abandoned.json#facts.featured = 5
  - views/question-picker-abandoned.json#facts.preset = 44
  - views/question-picker-abandoned.json#facts.freeText = 12
  - views/question-picker-abandoned.json#facts.selection = 271
---

# Cerró el selector de preguntas

## ¿Qué es un selector de preguntas cerrado? {#what}

El evento se registra cuando el estudiante abre la lista de preguntas para código seleccionado y la cierra sin preguntar, o cierra vacío el cuadro de la pregunta propia. No se crea ninguna pregunta, así que este evento es la única huella del intento.

## Ejemplo con un estudiante {#example}

S07 abrió la lista de preguntas 5 veces sin preguntar nada. Cada vez, el evento guardó dónde se cerró la lista y cuántas líneas había seleccionadas. En la tabla de preguntas estos momentos no existen.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="question-picker-abandoned" /></ClientOnly>
<template #takeaway>En la clase, la lista se cerró 44 veces y el cuadro de pregunta propia 12, frente a 271 preguntas por selección hechas.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Empiezan los estudiantes a preguntar y luego desisten?
- **Investigación:** ¿Con qué frecuencia aparece la duda antes de preguntar y en qué situaciones?

## Muestra de datos brutos {#raw}

Un evento de la muestra.

`events`:

<<< @/../.vitepress/data/sample/snippets/question-picker-abandoned.json

### Cerró la lista de preguntas sin preguntar (panel) {#metric-picker-abandoned}

Recuento de estos eventos en el periodo, separado según dónde se cerró el selector: la lista (preset) o el cuadro de pregunta propia (free_text).

<FormulaVersion ids="metric.picker_abandoned" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `picker_abandoned_rate` = selectores cerrados ÷ (selectores cerrados + preguntas por selección) por estudiante.
- **Análisis de ejemplo:** Correlacione la tasa con la puntuación TAM de utilidad percibida (Spearman).

**Preguntas de investigación**

<RqList ids="event.question_picker_abandoned" />

**Frase de ejemplo (Método):** «Los selectores de preguntas abiertos pero no usados se registraron como indicador de duda antes de pedir ayuda.»

## Lo que estos datos no muestran {#limits}

El evento muestra que el selector se cerró, no por qué. El estudiante pudo encontrar la respuesta, cambiar la selección o hacer clic por error. El evento solo se guarda si existe una sesión.

## Para el profesorado {#teacher}

::: tip En clase
Si se cierran muchos selectores sin preguntar, muestre que las cuatro preguntas preparadas se pueden probar sin problema y que ninguna pregunta es «demasiado simple».
:::
