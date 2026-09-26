---
title: Tamaño de la selección
items:
  - interactions.selection_line_count
  - interactions.selection_char_count
sample:
  - views/selection-size.json#facts.featuredSelections = 15
  - views/selection-size.json#facts.featuredMedian = 18
  - views/selection-size.json#facts.classMedian = 5
  - views/selection-size.json#facts.missing = 22
---

# Tamaño de la selección

## ¿Qué es el tamaño de la selección? {#what}

El tamaño de la selección es la cantidad de código que el estudiante marcó antes de preguntar, en líneas y en caracteres. Está vacío en las preguntas sobre errores y en las preguntas hechas sin selección.

## Ejemplo con un estudiante {#example}

S07 hizo 15 preguntas sobre código seleccionado. La mediana de su selección fue de 18 líneas, mientras que la de la clase fue de 5. Una selección pequeña suele indicar una idea precisa de dónde está el problema, y una grande indica que el estudiante aún no lo sabe.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="selection-size" /></ClientOnly>
<template #takeaway>La mayoría de las selecciones son cortas. S07 suele seleccionar bloques enteros de código.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Señalan los estudiantes el lugar exacto del problema o un bloque grande?
- **Investigación:** ¿Cambia la precisión de la pregunta con las semanas y se relaciona con la profundidad de las pistas?

## Muestra de datos brutos {#raw}

Dos preguntas por selección de S07.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/selection-size.json

### Cómo se calcula el número de líneas {#interactions-selection-line-count}

Última línea de la selección menos la primera, más 1. Una selección vacía no da ningún valor, no 0.

<FormulaVersion ids="interactions.selection_line_count" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** `median_selection_lines` por estudiante, sobre las preguntas que tienen selección.
- **Análisis de ejemplo:** Compare la mediana del tamaño de la selección de las primeras y las últimas semanas con una prueba de rangos con signo de Wilcoxon.

**Preguntas de investigación**

<RqList ids="interactions.selection_line_count" />

**Frase de ejemplo (Método):** «El número de líneas seleccionadas se usó como indicador de la precisión con que el estudiante localizó el problema.»

## Lo que estos datos no muestran {#limits}

El tamaño depende de la tarea: una pregunta sobre una función entera necesita una selección grande. El botón de la barra lateral puede preguntar sin selección, lo que no da ningún valor (22 preguntas en la muestra). El número de líneas es un indicador aproximado de precisión, no una medida de comprensión.

## Para el profesorado {#teacher}

::: tip En clase
Si los estudiantes siempre seleccionan bloques grandes, muestre cómo acotar primero el problema, por ejemplo imprimiendo un valor o comentando líneas.
:::
