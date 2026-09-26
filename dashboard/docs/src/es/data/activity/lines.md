---
title: Líneas añadidas y borradas
items:
  - coding_sessions.lines_written
  - coding_sessions.lines_deleted
sample:
  - views/lines.json#facts.featuredWritten = 791
  - views/lines.json#facts.featuredDeleted = 281
  - views/lines.json#facts.classMeanWritten = 712
---

# Líneas añadidas y borradas

## ¿Qué son las líneas añadidas y borradas? {#what}

La extensión cuenta las líneas nuevas y las líneas eliminadas en cada edición de un archivo. Se excluyen deshacer, rehacer y las ediciones muy grandes (más de 20 líneas a la vez). El código en sí no se envía.

## Ejemplo con un estudiante {#example}

S07 añadió 791 líneas y borró 281 en ocho semanas. La clase añadió 712 líneas por estudiante de media. S07 añadió más líneas en las semanas 4 y 8, las mismas semanas con más tiempo activo.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="lines" /></ClientOnly>
<template #takeaway>La clase añade unas 90 líneas por estudiante cada semana. S07 está cerca de la clase, con picos en las semanas 4 y 8.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Cuánto código escriben los estudiantes en un laboratorio?
- **Investigación:** ¿Cuánta producción hay y cuánta es reescritura?

## Muestra de datos brutos {#raw}

Dos sesiones de S07.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/lines.json

### Cómo se cuentan las líneas añadidas {#coding-sessions-lines-written}

Suma de los saltos de línea nuevos en las ediciones de archivos en disco. Se excluyen deshacer y rehacer, y se ignora una edición que añade o quita más de 20 líneas.

<FormulaVersion ids="coding_sessions.lines_written" />

### Cómo se cuentan las líneas borradas {#coding-sessions-lines-deleted}

Suma de los tramos de líneas eliminados en las mismas ediciones, con las mismas reglas.

<FormulaVersion ids="coding_sessions.lines_deleted" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis (como variable de control)
- **Un valor por estudiante para SPSS:** `lines_added` y `lines_deleted` por estudiante, y `rewrite_ratio` = borradas ÷ añadidas.
- **Análisis de ejemplo:** Use las líneas añadidas por hora activa como control aproximado de productividad.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «La producción de código se aproximó con el número de líneas añadidas y borradas, sin deshacer, rehacer ni ediciones de más de 20 líneas.»

## Lo que estos datos no muestran {#limits}

Una línea es un salto de línea, así que una línea larga y una vacía cuentan igual. El código pegado de hasta 20 líneas se cuenta como escrito. Los números no dicen nada sobre la calidad del código.

## Para el profesorado {#teacher}

::: tip En clase
Muchas líneas borradas no son una mala señal. A menudo muestran que el estudiante prueba, comprueba y reescribe.
:::
