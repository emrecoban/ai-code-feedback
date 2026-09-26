---
title: Resumen de aprendizaje de IA
items:
  - learner_profiles.student_summary
sample:
  - views/ai-learning-summary.json#facts.writtenDay = 2030-04-16
  - views/ai-learning-summary.json#facts.withSummary = 25
---

# Resumen de aprendizaje de IA

## ¿Qué es el resumen de aprendizaje de IA? {#what}

El resumen de aprendizaje de IA es un texto breve de tres a cinco frases que el modelo de IA escribe para el estudiante. Se basa en las 30 últimas preguntas. Se escribe en el idioma de las explicaciones y se muestra en la barra lateral y en el panel.

## Ejemplo con un estudiante {#example}

El último resumen de S07 se escribió el 2030-04-16 en inglés. El texto aparece en la sección siguiente. En la muestra, 25 de 25 estudiantes tenían un resumen al final del curso.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="ai-learning-summary" /></ClientOnly>
<template #takeaway>El resumen se dirige al estudiante y termina con un tema que merece repasar. El texto de muestra es un ejemplo sintético en inglés.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Qué le dice la herramienta a cada estudiante sobre su propio trabajo?
- **Investigación:** ¿Qué retroalimentación reflexiva recibieron los estudiantes, además de las pistas?

## Muestra de datos brutos {#raw}

El resumen de S07 al final de la muestra.

`learner_profiles` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/ai-learning-summary.json

### Cómo se escribe {#learner-profiles-student-summary}

El modelo recibe las 30 últimas preguntas con sus títulos y resultados y algunos recuentos sobre el estudiante. Debe escribir al estudiante de tres a cinco frases, como máximo 700 caracteres. Debe describir lo que ocurrió, nunca juzgar la capacidad del estudiante, y puede terminar con una frase que empiece por «Vale la pena repasar:». Se reescribe junto con las notas privadas.

<FormulaVersion ids="learner_profiles.student_summary" />

## Uso en la investigación {#research}

- **Etapa:** después de la intervención (cualitativo)
- **Un valor por estudiante para SPSS:** Ninguno. Es texto. Codifíquelo primero si necesita una variable, por ejemplo el tema nombrado en la última frase.
- **Análisis de ejemplo:** Análisis cualitativo de contenido de los resúmenes finales: ¿qué temas nombra el modelo y coinciden con los ítems del pretest y del postest que el estudiante falló?

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Los resúmenes de aprendizaje generados por IA que se mostraron a los estudiantes se analizaron cualitativamente según los temas que recomendaban repasar.»

## Lo que estos datos no muestran {#limits}

El texto lo escribe un modelo de IA y puede ser erróneo. Solo se guarda la última versión, así que los resúmenes anteriores se pierden. El resumen dice lo que el modelo vio en las preguntas, no lo que aprendió el estudiante.

## Para el profesorado {#teacher}

::: tip En clase
Lea los resúmenes de algunos estudiantes antes de una tutoría. Contraste lo que dicen con las preguntas del panel antes de repetirlo.
:::
