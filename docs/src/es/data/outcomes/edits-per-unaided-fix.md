---
title: Ediciones por corrección sin ayuda
items:
  - coding_sessions.silent_resolution_edits
  - metric.edits_per_unaided_fix
sample:
  - views/edits-per-unaided-fix.json#facts.featuredEpf = 1.9
  - views/edits-per-unaided-fix.json#facts.classEpf = 1.8
  - views/edits-per-unaided-fix.json#facts.classEdits = 2214
  - views/edits-per-unaided-fix.json#facts.classFixed = 1255
---

# Ediciones por corrección sin ayuda

## ¿Qué son las ediciones por corrección sin ayuda? {#what}

Para cada error corregido sin preguntar, la extensión suma las ediciones hechas mientras se mostraba el error. Dividido entre el número de esas correcciones, da el coste medio de una corrección sin ayuda.

## Ejemplo con un estudiante {#example}

S07 necesitó 1,9 ediciones de media para un error corregido por su cuenta, y hacía unas tres ediciones antes de preguntar por un error. En la clase los valores fueron 1,8 y algo más de dos.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="edits-per-unaided-fix" /></ClientOnly>
<template #takeaway>Las correcciones sin ayuda requieren unas dos ediciones. Los errores que terminan en una pregunta tienen algunas ediciones más antes.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Son fáciles los errores que los estudiantes corrigen por su cuenta?
- **Investigación:** ¿Cómo se compara el esfuerzo de las correcciones sin ayuda con el esfuerzo previo a una petición de ayuda?

## Muestra de datos brutos {#raw}

Dos sesiones de S07 con correcciones sin ayuda.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/edits-per-unaided-fix.json

### Cómo se cuentan las ediciones {#coding-sessions-silent-resolution-edits}

Para cada error corregido sin preguntar, los eventos de edición en su archivo entre la primera oferta y la desaparición. Un error sin oferta visible suma 0.

<FormulaVersion ids="coding_sessions.silent_resolution_edits" />

### Ediciones por corrección sin ayuda (panel) {#metric-edits-per-unaided-fix}

Suma de las ediciones dividida entre la suma de errores corregidos sin preguntar, en las sesiones del periodo (2214 ÷ 1255 en la muestra). El panel lo calcula en el navegador.

<FormulaVersion ids="metric.edits_per_unaided_fix" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** `edits_per_unaided_fix` por estudiante, calculado a partir de las dos sumas, no como media de razones por sesión.
- **Análisis de ejemplo:** Compárelo con la mediana de ediciones antes de preguntar del mismo estudiante (prueba de Wilcoxon para muestras relacionadas).

**Preguntas de investigación**

<RqList ids="metric.edits_per_unaided_fix" />

**Frase de ejemplo (Método):** «El esfuerzo de las correcciones sin ayuda se expresó como el número medio de ediciones hechas mientras se mostraba el error resuelto.»

## Lo que estos datos no muestran {#limits}

Los errores corregidos sin oferta visible suman una corrección pero ninguna edición, lo que baja la media. Los desplazamientos de líneas pueden crear correcciones falsas con cero ediciones. Un evento de edición no es lo mismo que un intento.

## Para el profesorado {#teacher}

::: tip En clase
Use este número solo junto con las preguntas: quien corrige solo con pocas ediciones y pregunta tras muchas puede estar preguntando por lo que de verdad le cuesta.
:::
