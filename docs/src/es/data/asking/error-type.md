---
title: Tipo de error
items:
  - interactions.error_signature
  - interactions.error_source
  - interactions.error_code
  - interactions.error_severity
  - metric.severity_mix
sample:
  - views/error-type.json#facts.featuredMessage = "total" is not defined
  - views/error-type.json#facts.featuredCode = reportUndefinedVariable
  - views/error-type.json#facts.featuredSeverity = error
  - views/error-type.json#facts.top = Pylance
  - views/error-type.json#facts.topQuestions = 203
  - views/error-type.json#facts.errors = 568
  - views/error-type.json#facts.warnings = 89
---

# Tipo de error

## ¿Qué es el tipo de error? {#what}

En una pregunta sobre un error, el sistema guarda el mensaje de error tal como lo mostró el editor, la herramienta que lo informó (por ejemplo Pylance), su código de regla y su gravedad (error o advertencia). Las preguntas por selección no tienen tipo de error.

## Ejemplo con un estudiante {#example}

La primera pregunta de S07 sobre un error fue por el mensaje `"total" is not defined`. Pylance lo informó con el código `reportUndefinedVariable` y la gravedad «Error». El código de regla es una categoría precisa, mientras que el mensaje cambia con cada nombre de variable.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="error-type" /></ClientOnly>
<template #takeaway>La barra más grande, «Pylance», reúne 203 preguntas: errores de sintaxis sin código de regla, que el panel agrupa juntos.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Con qué errores necesitan más ayuda mis estudiantes?
- **Investigación:** ¿Qué clases de error llevan a preguntar y cuáles necesitan la solución completa?

## Muestra de datos brutos {#raw}

Una pregunta de S07 sobre un error, con su clasificación.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/error-type.json

### Preguntas sobre errores por gravedad (panel) {#metric-severity-mix}

Las preguntas sobre errores del periodo agrupadas por gravedad. En la muestra: 568 errores y 89 advertencias.

<FormulaVersion ids="metric.severity_mix" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** Recuentos por categoría de error y estudiante, por ejemplo `n_err_undefined`. Construya las categorías a partir del código de regla, y del mensaje cuando no hay código.
- **Análisis de ejemplo:** Describa las diez categorías más frecuentes y compare entre categorías la proporción de preguntas que llegaron a la solución.

**Preguntas de investigación**

<RqList ids="interactions.error_code,metric.severity_mix" />

**Frase de ejemplo (Método):** «Los errores se clasificaron según el código de regla del servidor de lenguaje (Pylance) y, en los errores sin código, según el mensaje normalizado.»

## Lo que estos datos no muestran {#limits}

El panel agrupa los errores por «herramienta + código», y un error sin código queda solo bajo el nombre de la herramienta. Por eso todos los errores de sintaxis aparecen en una única fila llamada «Pylance». El mensaje puede contener nombres y valores del código del estudiante. De cada petición solo se guarda el primer diagnóstico.

## Para el profesorado {#teacher}

::: tip En clase
Si un tipo de error domina una semana, muéstrelo una vez al inicio del siguiente laboratorio y deje que los estudiantes adivinen qué significa el mensaje antes de explicarlo.
:::
