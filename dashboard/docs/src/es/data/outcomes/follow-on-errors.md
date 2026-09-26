---
title: Errores nuevos justo después de corregir
items:
  - coding_sessions.follow_on_error_count
sample:
  - views/follow-on-errors.json#facts.featuredTotal = 8
  - views/follow-on-errors.json#facts.classTotal = 194
  - views/follow-on-errors.json#facts.classFixed = 1255
---

# Errores nuevos justo después de corregir

## ¿Qué es un error nuevo justo después de corregir? {#what}

Es un error o una advertencia que aparece en un archivo en el mismo momento en que se corrigió otro allí, o en los 60 segundos siguientes. Distingue un cambio que resolvió el problema de uno que solo lo trasladó.

## Ejemplo con un estudiante {#example}

S07 tuvo 8 errores nuevos justo después de una corrección en las ocho semanas, tres de ellos en la semana 8. En toda la clase se contaron 194 errores de este tipo frente a 1255 errores corregidos sin preguntar.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="follow-on-errors" /></ClientOnly>
<template #takeaway>Los errores encadenados son pocos por semana, alrededor de uno por estudiante. S07 tiene un pico en la semana 8.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Crean las correcciones problemas nuevos para mis estudiantes?
- **Investigación:** ¿Con qué frecuencia un cambio solo traslada el problema en lugar de resolverlo?

## Muestra de datos brutos {#raw}

Dos sesiones de S07 con errores encadenados.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/follow-on-errors.json

### Cómo se cuenta {#coding-sessions-follow-on-error-count}

Cada diagnóstico que aparece de nuevo en un archivo suma 1 cuando, en la misma comprobación, se resolvió otro allí, o cuando la última resolución en ese archivo fue como máximo 60 segundos antes.

<FormulaVersion ids="coding_sessions.follow_on_error_count" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** `follow_on_rate` = errores encadenados ÷ errores corregidos (con y sin pregunta), por estudiante.
- **Análisis de ejemplo:** Compare la tasa entre las primeras y las últimas semanas, como señal de cambios más precisos.

**Preguntas de investigación**

<RqList ids="coding_sessions.follow_on_error_count" />

**Frase de ejemplo (Método):** «Los diagnósticos que aparecieron en los 60 segundos siguientes a una resolución en el mismo archivo se contaron como errores encadenados.»

## Lo que estos datos no muestran {#limits}

Cuando una edición mueve un error a otra línea, el código ve una corrección y un error nuevo, así que el recuento puede ser demasiado alto. Un error nuevo puede no tener relación, por ejemplo una línea a medio escribir. La ventana de 60 segundos es una elección fija.

## Para el profesorado {#teacher}

::: tip En clase
Si un estudiante suele tener un error nuevo justo después de corregir, muéstrele cómo ejecutar el programa tras cada cambio pequeño en lugar de cambiar muchas líneas a la vez.
:::
