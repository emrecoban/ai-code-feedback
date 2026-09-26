---
title: Práctica sugerida
items:
  - learner_profiles.suggested_practice
sample:
  - views/suggested-practice.json#facts.writtenDay = 2030-04-16
---

# Práctica sugerida

## ¿Qué es la práctica sugerida? {#what}

La práctica sugerida es un ejercicio breve de dos o tres frases. El modelo la escribe junto con el resumen de aprendizaje de IA, sobre el error o el tema que más se repite en las preguntas del estudiante.

## Ejemplo con un estudiante {#example}

La práctica de S07 se escribió el 2030-04-16 y trata sobre listas, uno de los dos temas por los que S07 preguntó más. El texto aparece en la sección siguiente.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="suggested-practice" /></ClientOnly>
<template #takeaway>La práctica es breve y nombra un solo tema. Termina con una pequeña tarea de predicción.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Qué práctica adicional sugiere la herramienta a cada estudiante?
- **Investigación:** ¿Coincide el tema sugerido con los puntos débiles del estudiante en los tests?

## Muestra de datos brutos {#raw}

La práctica de S07 al final de la muestra.

`learner_profiles` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/suggested-practice.json

### Cómo se escribe {#learner-profiles-suggested-practice}

Un problema breve de práctica de dos o tres frases, como máximo 400 caracteres, sobre el error o el tema que más se repite. Si nada se repite, el modelo usa la última pregunta.

<FormulaVersion ids="learner_profiles.suggested_practice" />

## Uso en la investigación {#research}

- **Etapa:** después de la intervención (cualitativo)
- **Un valor por estudiante para SPSS:** Ninguno. Es texto. Codifique el tema si necesita una variable.
- **Análisis de ejemplo:** Codifique el tema de cada práctica final y compárelo con los ítems del test que el estudiante falló.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Los temas de las prácticas sugeridas por la IA se codificaron y se compararon con los errores de los estudiantes en el postest.»

## Lo que estos datos no muestran {#limits}

La extensión no registra si el estudiante hizo la práctica. Solo se guarda la última versión. El texto lo escribe un modelo de IA y puede ser demasiado fácil, demasiado difícil o no venir al caso.

## Para el profesorado {#teacher}

::: tip En clase
Puede usar las prácticas sugeridas de la clase como fuente de tareas breves de calentamiento para el siguiente laboratorio.
:::
