---
title: Lenguajes editados
items:
  - coding_sessions.language_counts
  - metric.languages_top
sample:
  - views/languages-edited.json#facts.languages = 3
  - views/languages-edited.json#facts.pythonPct = 98.3
---

# Lenguajes editados

## ¿Qué son los lenguajes editados? {#what}

Por cada edición contada, la extensión suma uno al lenguaje del archivo, con el nombre que le da VS Code (por ejemplo `python` o `markdown`). El resultado es una pequeña lista de lenguajes con un número cada uno.

## Ejemplo con un estudiante {#example}

S07 editó archivos en 3 lenguajes, y el 98,3% de las ediciones fueron en Python. Las demás fueron en archivos Markdown y de texto plano.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="languages-edited" /></ClientOnly>
<template #takeaway>Casi todas las ediciones de S07 son en Python, como se espera en una asignatura de Python.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Trabajan los estudiantes en el lenguaje de la asignatura?
- **Investigación:** ¿Qué parte de la actividad corresponde al lenguaje de la asignatura, como comprobación de los datos?

## Muestra de datos brutos {#raw}

Dos sesiones de S07.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/languages-edited.json

### Cómo se cuenta {#coding-sessions-language-counts}

Cada edición que cuenta para las líneas añadidas o borradas suma 1 al lenguaje de su archivo. Los números se combinan sumando por lenguaje.

<FormulaVersion ids="coding_sessions.language_counts" />

### Lenguajes editados (panel) {#metric-languages-top}

Los seis lenguajes con más ediciones en las sesiones del periodo.

<FormulaVersion ids="metric.languages_top" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** `course_language_share` = ediciones en el lenguaje de la asignatura ÷ todas las ediciones, por estudiante.
- **Análisis de ejemplo:** Úselo para la limpieza de datos: un estudiante con poca actividad en el lenguaje de la asignatura pudo usar otro editor para las tareas.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «La proporción de actividad de edición en el lenguaje de la asignatura se usó para comprobar que la actividad registrada reflejaba las tareas de programación.»

## Lo que estos datos no muestran {#limits}

Se cuentan ediciones, no líneas ni tiempo. El lenguaje viene de VS Code, así que un archivo Python guardado sin la extensión `.py` puede aparecer como texto plano. No muestra qué lenguaje conoce mejor el estudiante.

## Para el profesorado {#teacher}

::: tip En clase
Si muchas ediciones son en texto plano, recuerde a los estudiantes que guarden sus programas con la extensión correcta. Si no, VS Code no puede mostrarles los errores.
:::
