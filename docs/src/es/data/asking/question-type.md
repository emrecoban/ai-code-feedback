---
title: Tipo de pregunta
items:
  - interactions.question_type
  - metric.analytics_question_type_resolution
sample:
  - views/question-type.json#facts.featured_what_does_this_mean = 22
  - views/question-type.json#facts.featured_what_does_this_do = 10
  - views/question-type.json#facts.featuredSidebar = 4
  - views/question-type.json#facts.featured_why_works = 2
  - views/question-type.json#facts.featured_whats_wrong = 2
  - views/question-type.json#facts.whatsWrongHintPct = 75.4
---

# Tipo de pregunta

## ¿Qué es el tipo de pregunta? {#what}

El tipo de pregunta es la pregunta que hizo el estudiante. Toda pregunta sobre un error es «¿Qué significa esto?». Para código seleccionado, el estudiante elige una de cuatro preguntas preparadas o escribe una propia.

## Ejemplo con un estudiante {#example}

S07 preguntó «¿Qué significa esto?» 22 veces. Para código seleccionado se guardó «¿Qué hace esto?» 10 veces, pero 4 de ellas vinieron del botón de la barra lateral, que hace esta pregunta sin mostrar la lista. S07 eligió «¿Por qué funciona?» 2 veces y «¿Qué está mal aquí?» 2 veces.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="question-type" /></ClientOnly>
<template #takeaway>El informe SQL muestra que «¿Qué está mal aquí?» terminó en la pista en el 75,4% de las preguntas.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Qué quieren saber los estudiantes cuando seleccionan código?
- **Investigación:** ¿Se relaciona el tipo de pregunta con hasta dónde llega el estudiante en las pistas?

## Muestra de datos brutos {#raw}

Dos preguntas de S07, una sobre un error y otra sobre una selección.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/question-type.json

### El informe SQL {#metric-analytics-question-type-resolution}

`supabase/analytics/question_type_resolution.sql` cuenta las preguntas de cada tipo y cuántas terminaron en la pista (L0–L1), en la regla (L2) y en la solución (L3). La tabla de arriba es este informe ejecutado sobre la muestra.

<FormulaVersion ids="metric.analytics_question_type_resolution" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** Un recuento por tipo y estudiante, por ejemplo `n_whats_wrong`, y la proporción de cada tipo entre las preguntas por selección.
- **Análisis de ejemplo:** Cruce el tipo de pregunta con la profundidad de las pistas y contraste la asociación con una prueba de chi cuadrado solo en las preguntas por selección.

**Preguntas de investigación**

<RqList ids="interactions.question_type" />

**Frase de ejemplo (Método):** «Para el código seleccionado, los estudiantes eligieron una de cuatro preguntas preparadas o escribieron una propia, y el tipo elegido se guardó con cada petición.»

## Lo que estos datos no muestran {#limits}

«¿Qué hace esto?» es también la pregunta fija del botón de la barra lateral y de la paleta de comandos, así que mezcla una elección real con un valor por defecto. Use el punto de partida para separarlas. Las preguntas sobre errores tienen siempre el mismo tipo, así que el tipo no dice nada sobre ellas.

## Para el profesorado {#teacher}

::: tip En clase
Si los estudiantes casi no usan «¿Qué está mal aquí?», recuérdeles que pueden hacer esa pregunta aunque el editor no muestre ningún error, por ejemplo cuando la salida parece incorrecta.
:::
