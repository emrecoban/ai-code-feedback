---
title: Corregidos sin preguntar
items:
  - coding_sessions.errors_resolved_without_asking
  - metric.fixed_unaided
sample:
  - views/fixed-without-asking.json#facts.featuredWeek1 = 5
  - views/fixed-without-asking.json#facts.featuredWeek8 = 15
  - views/fixed-without-asking.json#facts.featuredTotal = 52
  - views/fixed-without-asking.json#facts.workedOut = 22
---

# Corregidos sin preguntar

## ¿Qué es un error corregido sin preguntar? {#what}

Es un error o una advertencia que desapareció de un archivo abierto sin que el estudiante preguntara por él. Es la única señal directa de trabajo sin ayuda que la extensión puede ver.

## Ejemplo con un estudiante {#example}

S07 corrigió 5 errores sin preguntar en la semana 1 y 15 en la semana 8, 52 en total. El panel del estudiante muestra el mismo total como «Errores que arreglaste sin preguntar». El número «Errores que resolviste tú mismo/a» (22) es otra cosa: cuenta las preguntas en las que S07 no abrió la regla ni la corrección.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="fixed-without-asking" /></ClientOnly>
<template #takeaway>S07 corrige más errores por su cuenta en las últimas semanas que al principio.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Resuelven los estudiantes más errores por su cuenta a medida que avanza el curso?
- **Investigación:** ¿Crece la resolución de errores sin ayuda con las semanas, junto a la búsqueda de ayuda?

## Muestra de datos brutos {#raw}

Dos sesiones de S07 con sus contadores.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/fixed-without-asking.json

### Cómo se cuenta {#coding-sessions-errors-resolved-without-asking}

La extensión compara la lista de errores y advertencias de un archivo abierto antes y después de que se asiente cada cambio (unos 1,2 segundos). Cada diagnóstico que ha desaparecido y nunca se preguntó suma 1.

<FormulaVersion ids="coding_sessions.errors_resolved_without_asking" />

### Corregidos sin preguntar (panel) {#metric-fixed-unaided}

Suma del contador en las sesiones que empezaron en el periodo.

<FormulaVersion ids="metric.fixed_unaided" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `fixed_unaided` por estudiante y por semana o bloque de semanas. Divida entre las horas activas si los estudiantes trabajan cantidades muy distintas.
- **Análisis de ejemplo:** Contraste el cambio de las primeras a las últimas semanas con una prueba t para muestras relacionadas sobre errores corregidos por hora activa.

**Preguntas de investigación**

<RqList ids="coding_sessions.errors_resolved_without_asking,metric.fixed_unaided" />

**Frase de ejemplo (Método):** «Los errores y advertencias que desaparecieron sin una petición de ayuda se contaron como resueltos sin asistencia.»

## Lo que estos datos no muestran {#limits}

Un error se identifica por archivo, línea y mensaje, así que una edición que solo mueve un error a otra línea cuenta como corrección. También se cuentan errores que nunca se mostraron como oferta, así que este contador y las ofertas de ayuda no tienen la misma base. Encontrar más errores también significa corregir más.

## Para el profesorado {#teacher}

::: tip En clase
Una línea que sube es un buen momento para un comentario positivo: dígale al estudiante que ahora corrige solo la mayoría de los errores pequeños.
:::
