---
title: Ediciones antes de preguntar
items:
  - interactions.edits_before_ask
  - metric.avg_edits_before_ask
sample:
  - views/edits-before-asking.json#facts.featuredAvg = 2.8
  - views/edits-before-asking.json#facts.classMedian = 2
  - views/edits-before-asking.json#facts.eightPlus = 4
---

# Ediciones antes de preguntar

## ¿Qué son las ediciones antes de preguntar? {#what}

Este número cuenta los cambios que hizo el estudiante en el archivo entre el momento en que apareció la oferta de ayuda y el clic. Muestra cuántos intentos hubo antes de la pregunta.

## Ejemplo con un estudiante {#example}

S07 hizo 2,8 ediciones de media antes de preguntar. La mediana de la clase fue 2. En toda la clase, solo 4 preguntas llegaron tras ocho o más ediciones.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="edits-before-asking" /></ClientOnly>
<template #takeaway>La mayoría de las preguntas llegan tras cero a cuatro intentos. Las series largas de intentos antes de preguntar son raras.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Prueban algo los estudiantes antes de preguntar?
- **Investigación:** ¿Cuánto esfuerzo hay antes de una petición de ayuda y cómo se compara con el de las correcciones sin ayuda?

## Muestra de datos brutos {#raw}

Dos preguntas de S07 sobre errores.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/edits-before-asking.json

### Cómo se cuentan las ediciones {#interactions-edits-before-ask}

Número de eventos de cambio en el documento entre la oferta y el clic. Un evento de cambio puede ser un carácter tecleado o un bloque pegado. Vacío si no hubo oferta visible.

<FormulaVersion ids="interactions.edits_before_ask" />

### Ediciones antes de preguntar (panel) {#metric-avg-edits-before-ask}

La vista del estudiante muestra la media de los valores no vacíos, con un decimal. La vista de clase del comportamiento de aprendizaje muestra en cambio la mediana.

<FormulaVersion ids="metric.avg_edits_before_ask" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `median_edits_before_ask` por estudiante. Prefiera la mediana, porque algunas sesiones largas de escritura inflan la media.
- **Análisis de ejemplo:** Compárelo con las ediciones por corrección sin ayuda del mismo estudiante (prueba de Wilcoxon para muestras relacionadas).

**Preguntas de investigación**

<RqList ids="interactions.edits_before_ask,metric.avg_edits_before_ask" />

**Frase de ejemplo (Método):** «La persistencia antes de pedir ayuda se operacionalizó como el número de ediciones entre la aparición del enlace de ayuda y la petición.»

## Lo que estos datos no muestran {#limits}

Un evento de edición no es un intento en el sentido del aprendizaje: escribir una palabra genera muchos eventos y pegar un bloque genera uno. Las ediciones en otros archivos no se cuentan. El valor está vacío en las preguntas por selección.

## Para el profesorado {#teacher}

::: tip En clase
Si un estudiante pregunta casi siempre sin editar nada, pídale que explique primero el mensaje de error con sus palabras. Si otro hace muchísimas ediciones antes de preguntar, sugerirle que pregunte antes puede ahorrarle frustración.
:::
