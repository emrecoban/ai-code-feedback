---
title: Palabras del estudiante
items:
  - interactions.free_text
sample:
  - views/own-question.json#facts.exampleStudent = S22
  - views/own-question.json#facts.exampleText = why does this loop stop too early?
  - views/own-question.json#facts.exampleLength = 34
  - views/own-question.json#facts.freeText = 22
  - views/own-question.json#facts.selection = 271
  - views/own-question.json#facts.pctOfSelection = 8.1
---

# Palabras del estudiante

## ¿Qué es la pregunta propia del estudiante? {#what}

Cuando el estudiante elige «Otra cosa…» para el código seleccionado, escribe una pregunta de hasta 300 caracteres. El texto se guarda tal como se escribió. Es el único texto escrito por los estudiantes que el sistema conserva.

## Ejemplo con un estudiante {#example}

S07 nunca escribió una pregunta propia. S22 sí lo hizo: seleccionó un bucle y escribió «why does this loop stop too early?» (34 caracteres). La explicación respondió a esa pregunta con los cuatro pasos de siempre.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="own-question" /></ClientOnly>
<template #takeaway>Las preguntas propias son poco frecuentes: 22 de 271 preguntas por selección (8,1%).</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Qué quieren saber los estudiantes con sus propias palabras?
- **Investigación:** ¿Qué ideas erróneas y qué formas de pregunta aparecen cuando los estudiantes preguntan libremente?

## Muestra de datos brutos {#raw}

Una pregunta propia de la muestra.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/own-question.json

## Uso en la investigación {#research}

- **Etapa:** en el análisis (codificación cualitativa)
- **Un valor por estudiante para SPSS:** `n_own_questions` por estudiante. Codifique los textos fuera de SPSS, por ejemplo por forma de la pregunta y por tema.
- **Análisis de ejemplo:** Análisis de contenido con dos codificadores y el kappa de Cohen para el acuerdo.

**Preguntas de investigación**

<RqList ids="interactions.free_text" />

**Frase de ejemplo (Método):** «Las preguntas de texto libre (como máximo 300 caracteres) fueron codificadas por dos investigadores según su forma y su tema.»

## Lo que estos datos no muestran {#limits}

Los textos son pocos y breves, así que ofrecen ejemplos, no una imagen representativa. Un estudiante puede escribir datos personales en el cuadro, así que lea y seudonimice los textos antes de compartirlos.

## Para el profesorado {#teacher}

::: tip En clase
Lea las preguntas propias de la semana antes del siguiente laboratorio. Preguntas parecidas de varios estudiantes pueden ser un buen punto de partida para un debate breve en clase.
:::
