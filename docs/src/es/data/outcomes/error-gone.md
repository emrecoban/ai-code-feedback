---
title: Error resuelto tras explicar
items:
  - event.diagnostic_resolved
  - event.diagnostic_resolved.msToResolution
  - event.diagnostic_resolved.msPresent
  - event.diagnostic_resolved.editsWhilePresent
  - metric.error_gone_pct
  - metric.error_gone_by_level
sample:
  - views/error-gone.json#facts.featuredQuestions = 22
  - views/error-gone.json#facts.featuredResolved = 19
  - views/error-gone.json#facts.classPct = 72.9
  - views/error-gone.json#facts.classMedianSec = 86
---

# Error resuelto tras explicar

## ¿Qué significa «error resuelto tras explicar»? {#what}

Después de que el estudiante pregunta por un error, la extensión observa ese error en el archivo abierto. Cuando desaparece, un evento guarda cuánto tardó desde la pregunta. Es la señal más directa de que a la explicación le siguió una corrección.

## Ejemplo con un estudiante {#example}

S07 preguntó por 22 errores y 19 desaparecieron después. En la clase la proporción fue del 72,9%, con una mediana de 86 segundos desde la pregunta hasta que el error desapareció.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="error-gone" /></ClientOnly>
<template #takeaway>El error desapareció en unas tres de cada cuatro preguntas en todas las profundidades. S07 está por encima de la clase.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Ayudaron las explicaciones a los estudiantes a eliminar sus errores?
- **Investigación:** ¿Se relaciona un nivel de pista más profundo con una resolución más frecuente o más rápida del error?

## Muestra de datos brutos {#raw}

Un evento de S07.

`events`:

<<< @/../.vitepress/data/sample/snippets/error-gone.json

### Cómo se mide el tiempo {#event-diagnostic-resolved-mstoresolution}

Tiempo desde el clic en el enlace de ayuda hasta que el error ya no estaba en el archivo, en milisegundos. Un error se identifica por archivo, línea y mensaje.

<FormulaVersion ids="event.diagnostic_resolved.msToResolution" />

### Tiempo que el error estuvo presente {#event-diagnostic-resolved-mspresent}

Tiempo desde la primera aparición de la oferta de ayuda hasta la desaparición. Falta si no hubo oferta visible.

<FormulaVersion ids="event.diagnostic_resolved.msPresent" />

### Ediciones mientras el error estaba presente {#event-diagnostic-resolved-editswhilepresent}

Eventos de edición en el archivo entre la oferta y la desaparición. Falta si no hubo oferta visible.

<FormulaVersion ids="event.diagnostic_resolved.editsWhilePresent" />

### Error resuelto tras explicar (panel) {#metric-error-gone-pct}

Preguntas sobre errores del periodo con al menos un evento de este tipo, divididas entre todas las preguntas sobre errores del periodo. La mediana usa el primer evento de cada pregunta.

<FormulaVersion ids="metric.error_gone_pct" />

### ¿Desapareció el error? Por profundidad (panel) {#metric-error-gone-by-level}

La misma proporción y mediana, separadas en preguntas que terminaron en L0–L1, en L2 y en L3.

<FormulaVersion ids="metric.error_gone_by_level" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis (resultado próximo)
- **Un valor por estudiante para SPSS:** `resolved_share` = preguntas sobre errores con el evento ÷ preguntas sobre errores, y `median_resolution_s`, por estudiante.
- **Análisis de ejemplo:** Modele la resolución por pregunta con una regresión logística mixta, con la profundidad como predictor y el estudiante como efecto aleatorio.

**Preguntas de investigación**

<RqList ids="metric.error_gone_pct,event.diagnostic_resolved.msToResolution" />

**Frase de ejemplo (Método):** «Un error se consideró resuelto cuando el diagnóstico por el que había preguntado el estudiante desapareció del archivo abierto.»

## Lo que estos datos no muestran {#limits}

Un error se identifica por archivo, línea y mensaje, así que una edición que mueve el error a otra línea parece una resolución. Un error también puede desaparecer porque se borró código, no porque se corrigiera. Los errores de archivos cerrados no se observan.

## Para el profesorado {#teacher}

::: tip En clase
Si en una tarea muchos errores siguen ahí después de la explicación, repase ese error con la clase. Si desaparecen rápido, las explicaciones están cumpliendo su función en ese tema.
:::
