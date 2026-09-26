---
title: Origen de la pregunta
items:
  - interactions.trigger_source
sample:
  - views/trigger-source.json#facts.featuredQuestions = 37
  - views/trigger-source.json#facts.featuredDiagnostic = 22
  - views/trigger-source.json#facts.featuredSelection = 15
  - views/trigger-source.json#facts.classDiagnosticPct = 70.8
---

# Origen de la pregunta

## ¿Qué es el origen de una pregunta? {#what}

El origen indica cómo empezó una petición de ayuda: desde un error o una advertencia del código (diagnostic) o desde código que el estudiante seleccionó (selection). La base de datos también admite runtime, stuck, paste y success, pero la extensión nunca envía esos valores.

## Ejemplo con un estudiante {#example}

S07 hizo 37 preguntas en las ocho semanas. 22 empezaron desde un mensaje de error y 15 desde código seleccionado. La clase hizo el 70,8% de sus preguntas sobre errores, así que S07 usó las selecciones más que la mayoría.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="trigger-source" /></ClientOnly>
<template #takeaway>La mayoría de las preguntas de la clase empiezan en un error. S07 pregunta por código seleccionado más que la mayoría.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Preguntan los estudiantes sobre todo por errores, o también por código que funciona?
- **Investigación:** ¿Por qué vía entran los estudiantes al sistema de ayuda y llevan las dos vías a profundidades distintas?

## Muestra de datos brutos {#raw}

Dos preguntas de S07, una de cada tipo.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/trigger-source.json

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `share_selection` = preguntas por selección ÷ todas las preguntas del estudiante.
- **Análisis de ejemplo:** Describa la proporción semanal de cada origen y compare la profundidad de las pistas entre preguntas sobre errores y sobre selecciones con una prueba de chi cuadrado.

**Preguntas de investigación**

<RqList ids="interactions.trigger_source" />

**Frase de ejemplo (Método):** «Cada petición de ayuda se codificó según su origen: un error o una advertencia mostrados por el editor, o código seleccionado por el estudiante.»

## Lo que estos datos no muestran {#limits}

El origen muestra dónde empezó la petición, no la intención del estudiante. Quien selecciona la línea con un error y pregunta por ella cuenta como selección. Los errores que el editor no detecta, como los errores de lógica, solo pueden aparecer como preguntas por selección.

## Para el profesorado {#teacher}

::: tip En clase
Si un estudiante casi nunca pregunta por código seleccionado, muestre a la clase que también se puede preguntar por código que funciona, por ejemplo con «¿Por qué funciona esto?».
:::
