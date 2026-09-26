---
title: Primera edición tras la corrección
items:
  - event.post_feedback_edit
  - event.post_feedback_edit.overlapRatio
  - event.post_feedback_edit.editedLineDistance
  - metric.after_edited
  - metric.after_on_line_pct
  - metric.after_overlap_avg
sample:
  - views/edit-after-fix.json#facts.featuredEdited = 9
  - views/edit-after-fix.json#facts.featuredOverlapPct = 60
  - views/edit-after-fix.json#facts.overlapPct = 53
  - views/edit-after-fix.json#facts.onLinePct = 84.5
---

# Primera edición tras la corrección

## ¿Qué es la primera edición tras la corrección? {#what}

Cuando el estudiante abre la corrección (L3), la extensión observa la siguiente edición en el mismo archivo durante cinco minutos. Guarda dos números: cuánto se parece el texto nuevo a la corrección sugerida y a qué distancia de la línea señalada cayó la edición. El texto en sí no se envía.

## Ejemplo con un estudiante {#example}

S07 editó el código después de 9 correcciones. El parecido medio del texto nuevo con la corrección sugerida fue del 60%. En la clase la media fue del 53%, y el 84,5% de las ediciones cayó a dos líneas o menos de la línea señalada.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="edit-after-fix" /></ClientOnly>
<template #takeaway>La mayoría de las primeras ediciones tienen un parecido de entre 0,4 y 0,8 con la corrección sugerida. S07 está en el grupo 0,6–0,8.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Copian los estudiantes la corrección tal cual o escriben su propio cambio?
- **Investigación:** ¿Hasta qué punto sigue la acción del estudiante a la retroalimentación?

## Muestra de datos brutos {#raw}

Un evento de S07.

`events`:

<<< @/../.vitepress/data/sample/snippets/edit-after-fix.json

### Cómo se calcula el parecido {#event-post-feedback-edit-overlapratio}

Solapamiento de Jaccard de los tokens de palabras en minúsculas (letras, dígitos, guion bajo) del texto insertado y del cambio sugerido: tokens compartidos divididos entre todos los tokens distintos. 0 significa nada en común y 1, los mismos tokens.

<FormulaVersion ids="event.post_feedback_edit.overlapRatio" />

### Cómo se calcula la distancia {#event-post-feedback-edit-editedlinedistance}

Líneas desde la línea de la explicación hasta el borde más cercano del rango cambiado. 0 significa una edición en la línea señalada.

<FormulaVersion ids="event.post_feedback_edit.editedLineDistance" />

### Editó el código (panel) {#metric-after-edited}

Preguntas distintas del periodo con este evento.

<FormulaVersion ids="metric.after_edited" />

### A 2 líneas o menos de la señalada (panel) {#metric-after-on-line-pct}

Preguntas cuya edición cayó como máximo a 2 líneas, divididas entre las preguntas con este evento.

<FormulaVersion ids="metric.after_on_line_pct" />

### Parecido a la corrección sugerida (media, panel) {#metric-after-overlap-avg}

100 por la media del parecido, redondeado a un número entero.

<FormulaVersion ids="metric.after_overlap_avg" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `mean_overlap` y `on_line_share` por estudiante, en las preguntas que llegaron a la corrección.
- **Análisis de ejemplo:** Correlacione el parecido medio con la ganancia de aprendizaje: mucha copia con poca ganancia puede indicar un uso pasivo de la corrección.

**Preguntas de investigación**

<RqList ids="event.post_feedback_edit.overlapRatio,metric.after_overlap_avg" />

**Frase de ejemplo (Método):** «Tras mostrar la corrección, el parecido entre la siguiente edición del estudiante y el cambio sugerido se calculó como un índice de Jaccard basado en tokens.»

## Lo que estos datos no muestran {#limits}

Solo se mide la primera edición válida, así que una corrección escrita en varios pasos parece menos parecida de lo que es. Una corrección pegada en otro archivo no se ve. El parecido de las palabras no muestra comprensión: un estudiante puede escribir la corrección sin saber por qué funciona.

## Para el profesorado {#teacher}

::: tip En clase
Si las ediciones de un estudiante coinciden casi siempre palabra por palabra con la corrección, pídale que explique el cambio con sus palabras antes de la siguiente tarea.
:::
