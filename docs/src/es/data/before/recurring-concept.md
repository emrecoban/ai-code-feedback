---
title: Concepto
items:
  - interactions.concept
  - interactions.recurring_concept_count
  - metric.concepts_top_student
sample:
  - views/recurring-concept.json#facts.featuredTop = lists
  - views/recurring-concept.json#facts.featuredTopCount = 5
  - views/recurring-concept.json#facts.maxRecurring = 4
  - views/recurring-concept.json#facts.typeConversionEn = 22
  - views/recurring-concept.json#facts.typeConversionTr = 92
  - views/recurring-concept.json#facts.typeConversionEs = 13
---

# Concepto

## ¿Qué es el concepto de una pregunta? {#what}

El concepto es un nombre breve para la idea general de programación detrás de una pregunta, por ejemplo «ámbito de variables». El modelo de IA lo escribe con cada respuesta, en el idioma de las explicaciones. El servidor cuenta además cuántas preguntas anteriores del estudiante tenían el mismo concepto.

## Ejemplo con un estudiante {#example}

El concepto más frecuente de S07 fue «lists», con 5 preguntas. El número de repeticiones más alto de un concepto para S07 fue 4. En la clase, una misma idea apareció con tres nombres, uno por idioma: «type conversion» 22 veces, «tür dönüşümü» 92 y «conversión de tipos» 13.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="recurring-concept" /></ClientOnly>
<template #takeaway>«lists» encabeza los conceptos de S07. Las etiquetas vienen del modelo, en el idioma del estudiante.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Con qué ideas tiene dificultades cada estudiante, más allá de mensajes de error concretos?
- **Investigación:** ¿Se repiten las ideas erróneas en errores de aspecto distinto?

## Muestra de datos brutos {#raw}

Una pregunta de S07 cuyo concepto ya había aparecido antes.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/recurring-concept.json

### Cómo se cuentan las repeticiones de un concepto {#interactions-recurring-concept-count}

Número de preguntas anteriores del mismo estudiante cuyo concepto coincide con este, sin distinguir mayúsculas y minúsculas. Se cuenta al guardar la pregunta.

<FormulaVersion ids="interactions.recurring_concept_count" />

### Conceptos recurrentes (panel) {#metric-concepts-top-student}

Los cinco conceptos más frecuentes de un estudiante en el periodo, agrupados por el texto recortado y en minúsculas.

<FormulaVersion ids="metric.concepts_top_student" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** Asigne primero los conceptos a una lista fija de temas en los tres idiomas. Después calcule `n_topic_<nombre>` por estudiante.
- **Análisis de ejemplo:** Describa los temas por semana y compare el número de temas repetidos entre estudiantes con ganancia alta y baja.

**Preguntas de investigación**

<RqList ids="interactions.concept,interactions.recurring_concept_count" />

**Frase de ejemplo (Método):** «Antes del análisis, los conceptos asignados por el modelo se asignaron a una lista común de temas en los tres idiomas.»

## Lo que estos datos no muestran {#limits}

El concepto lo escribe el modelo y no se compara con una lista fija. La misma idea puede recibir nombres distintos, también en idiomas distintos, y el panel los cuenta por separado. Trate el concepto como una pista para codificar, no como una categoría medida.

## Para el profesorado {#teacher}

::: tip En clase
Mire los conceptos recurrentes de un estudiante antes de una conversación individual. Elija uno y proponga un ejercicio breve y centrado en él.
:::
