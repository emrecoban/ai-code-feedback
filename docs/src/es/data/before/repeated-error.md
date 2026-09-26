---
title: Preguntó otra vez por el mismo error
items:
  - interactions.error_signature_normalized
  - interactions.recurring_error_count
  - metric.repeat_errors
sample:
  - views/repeated-error.json#facts.pairWeek1 = 1
  - views/repeated-error.json#facts.pairMessage = "total" is not defined
  - views/repeated-error.json#facts.pairWeek2 = 2
  - views/repeated-error.json#facts.pairNormalized = "x" is not defined
  - views/repeated-error.json#facts.featuredRepeats = 10
  - views/repeated-error.json#facts.featuredQuestions = 37
---

# Preguntó otra vez por el mismo error

## ¿Qué es un error repetido? {#what}

Para cada pregunta sobre un error, el servidor cuenta cuántas preguntas anteriores del mismo estudiante tenían el mismo error. «El mismo» significa el mismo mensaje normalizado: los números y los nombres entre comillas se sustituyen, así que coinciden los errores que solo difieren en el número de línea o en el nombre de una variable.

## Ejemplo con un estudiante {#example}

En la semana 1, S07 preguntó por `"total" is not defined`. En la semana 2 volvió el mismo tipo de mensaje y el servidor guardó 1 como número de preguntas anteriores. Los dos mensajes quedan como `"x" is not defined` tras la normalización. En total, 10 de las 37 preguntas de S07 repetían un error anterior.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="repeated-error" /></ClientOnly>
<template #takeaway>En la clase, la proporción de errores repetidos sube en las primeras semanas y luego se queda cerca de la mitad. La línea de S07 da saltos, porque S07 hizo pocas preguntas sobre errores por semana.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Qué estudiantes se siguen encontrando con el mismo error?
- **Investigación:** ¿Lleva una explicación a una comprensión duradera o vuelve el mismo error?

## Muestra de datos brutos {#raw}

Dos preguntas de S07 con el mismo mensaje normalizado.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/repeated-error.json

### Cómo se normaliza el mensaje {#interactions-error-signature-normalized}

Cada serie de dígitos pasa a ser #, cada texto entre comillas pasa a ser "X", y el resultado se recorta y se pasa a minúsculas. La misma función construye la clave de caché de las explicaciones.

<FormulaVersion ids="interactions.error_signature_normalized" />

### Cómo se cuentan las repeticiones {#interactions-recurring-error-count}

Número de preguntas anteriores del mismo estudiante con el mismo mensaje normalizado, contado al guardar la pregunta. 0 significa «primera vez». Las preguntas por selección tienen siempre 0.

<FormulaVersion ids="interactions.recurring_error_count" />

### Preguntó otra vez por el mismo error (panel) {#metric-repeat-errors}

Preguntas del periodo con un número de repeticiones mayor que 0.

<FormulaVersion ids="metric.repeat_errors" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `repeat_share` = preguntas sobre errores repetidos ÷ preguntas sobre errores, por estudiante.
- **Análisis de ejemplo:** Correlacione la proporción de repeticiones con la ganancia de aprendizaje del pretest al postest (Spearman).

**Preguntas de investigación**

<RqList ids="interactions.recurring_error_count,metric.repeat_errors" />

**Frase de ejemplo (Método):** «Un error se contó como repetido cuando el mismo estudiante ya había preguntado antes por el mismo mensaje de error normalizado.»

## Lo que estos datos no muestran {#limits}

La normalización también puede juntar errores distintos: todo «nombre no definido» se convierte en un solo error, sea cual sea el nombre. El recuento solo ve preguntas, no los errores que el estudiante encontró sin preguntar. Por construcción crece con el tiempo, así que compare periodos de la misma duración.

## Para el profesorado {#teacher}

::: tip En clase
Si un estudiante pregunta una y otra vez por el mismo error, siéntese dos minutos con él y pídale que le explique la regla de ese error.
:::
