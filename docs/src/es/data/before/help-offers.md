---
title: Ofertas de ayuda
items:
  - coding_sessions.diagnostics_offered
sample:
  - views/help-offers.json#facts.featuredWeek1 = 7
  - views/help-offers.json#facts.featuredWeek8 = 17
  - views/help-offers.json#facts.featuredTotal = 67
---

# Ofertas de ayuda

## ¿Qué es una oferta de ayuda? {#what}

Una oferta de ayuda es un error o una advertencia junto al que la extensión mostró «¿Qué significa esto?». El contador sube en uno la primera vez que aparece el icono de la oferta para un diagnóstico en el editor abierto. Es la base de la pregunta «¿con qué frecuencia preguntó el estudiante cuando se le ofreció ayuda?».

## Ejemplo con un estudiante {#example}

La extensión ofreció ayuda a S07 7 veces en la semana 1 y 17 en la semana 8. En las ocho semanas, S07 vio 67 ofertas. Más ofertas no significan más preguntas: en la semana 8, S07 solo preguntó por una de ellas.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="help-offers" /></ClientOnly>
<template #takeaway>El número de ofertas sigue a los errores que encuentra el estudiante, así que sube y baja con la dificultad de la semana.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Con cuántos errores se encontraron mis estudiantes mientras trabajaban?
- **Investigación:** ¿Cuál es la base para la proporción de errores en los que los estudiantes pidieron ayuda?

## Muestra de datos brutos {#raw}

Dos sesiones de S07. El contador se suma a la sesión cada tres minutos.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/help-offers.json

### Cómo se cuenta una oferta {#coding-sessions-diagnostics-offered}

+1 la primera vez que se dibuja el icono de la oferta junto a un error o una advertencia en el editor activo, como máximo para tres diagnósticos por archivo. Si el diagnóstico desaparece y vuelve, cuenta de nuevo.

<FormulaVersion ids="coding_sessions.diagnostics_offered" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `help_offers_total` por estudiante, y por semana o bloque de semanas si estudia el cambio.
- **Análisis de ejemplo:** Úselo como denominador de la tasa «Pidió ayuda cuando se le ofreció» y como covariable de la dificultad de la tarea.

**Preguntas de investigación**

<RqList ids="coding_sessions.diagnostics_offered" />

**Frase de ejemplo (Método):** «Las ofertas de ayuda se contaron cada vez que la extensión mostró un enlace de ayuda junto a un error o una advertencia en el editor activo.»

## Lo que estos datos no muestran {#limits}

Solo los tres primeros diagnósticos de un archivo reciben una oferta, y solo en el editor activo. Por eso los errores que el estudiante corrigió sin preguntar se cuentan de forma más amplia que las ofertas, y los dos contadores no tienen la misma base. El contador sigue tanto a la dificultad de la tarea como al estudiante.

## Para el profesorado {#teacher}

::: tip En clase
Una semana con muchas ofertas para toda la clase apunta a una tarea difícil o a un tema nuevo. Prepare un breve repaso del error más frecuente al inicio del siguiente laboratorio.
:::
