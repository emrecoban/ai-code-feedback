---
title: Conceptos y errores
items:
  - metric.concepts_top_class
  - metric.errors_top_class
sample:
  - views/concepts-and-errors.json#facts.top = tür dönüşümü
  - views/concepts-and-errors.json#facts.topQuestions = 92
  - views/concepts-and-errors.json#facts.topStudents = 17
  - views/concepts-and-errors.json#facts.trStudents = 20
  - views/concepts-and-errors.json#facts.topError = Pylance
  - views/concepts-and-errors.json#facts.topErrorQuestions = 203
  - views/concepts-and-errors.json#facts.topErrorStudents = 24
---

# Conceptos y errores

## ¿Qué son los conceptos y errores más frecuentes? {#what}

Dos listas del panel. La primera cuenta los conceptos de programación que el modelo nombró en sus respuestas. La segunda cuenta los errores por los que preguntaron los estudiantes. Para cada fila, el panel muestra las preguntas, los estudiantes y las preguntas que llegaron a la corrección.

## Ejemplo con un estudiante {#example}

El concepto más frecuente de la muestra es «tür dönüşümü» (conversión de tipos), con 92 preguntas de 17 estudiantes. Aparece en turco porque el concepto se escribe en el idioma de las explicaciones, y 20 de 25 estudiantes usan el turco. La fila de error más frecuente es «Pylance», con 203 preguntas de 24 estudiantes. Esta fila mezcla muchos errores de sintaxis distintos (véase más abajo).

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="concepts-and-errors" /></ClientOnly>
<template #takeaway>El gráfico muestra los conceptos. El mismo concepto puede aparecer hasta en tres filas, una por idioma de las explicaciones.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Qué temas y errores debo volver a explicar en clase?
- **Investigación:** ¿Qué conceptos generan más peticiones de ayuda en la asignatura?

## Muestra de datos brutos {#raw}

Las dos primeras filas de la lista de conceptos.

Parte del JSON que devuelve `dashboard_insights`:

<<< @/../.vitepress/data/sample/snippets/concepts-and-errors.json

### Conceptos más preguntados (panel) {#metric-concepts-top-class}

Los 12 conceptos más frecuentes del periodo. Mayúsculas y minúsculas se tratan igual.

<FormulaVersion ids="metric.concepts_top_class" />

### Errores más frecuentes (panel) {#metric-errors-top-class}

Los 12 errores más frecuentes del periodo. Un error se agrupa por su fuente y su código de regla (por ejemplo `Pylance reportUndefinedVariable`). Si falta el código, el SQL conserva solo la fuente, así que todos los errores de sintaxis de Pylance acaban en una fila llamada «Pylance».

<FormulaVersion ids="metric.errors_top_class" />

## Uso en la investigación {#research}

- **Etapa:** después de la intervención (diseño de la asignatura)
- **Un valor por estudiante para SPSS:** Ninguno. Recodifique primero los conceptos en una lista de temas en un solo idioma y luego cuente las preguntas por tema y estudiante.
- **Análisis de ejemplo:** Relacione los temas con más preguntas con los ítems del test con las puntuaciones más bajas en el postest.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Los conceptos nombrados en la retroalimentación se recodificaron en una lista común de temas para los tres idiomas.»

## Lo que estos datos no muestran {#limits}

El concepto lo elige el modelo, así que la misma idea puede tener varios nombres. La fila «Pylance» de la lista de errores mezcla errores de sintaxis distintos y no debe leerse como un solo error. Las listas muestran la frecuencia de las preguntas, no la de los errores en el código.

## Para el profesorado {#teacher}

::: tip En clase
Use la lista de conceptos para elegir el tema de un repaso breve al inicio del siguiente laboratorio. Abra el detalle de un estudiante para ver los mensajes de error reales.
:::
