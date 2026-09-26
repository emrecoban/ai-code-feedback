---
title: Tendencia de autonomía
items:
  - metric.pct_offers_taken
  - metric.pct_hint_enough_weekly
  - metric.pct_sessions_without_help_weekly
  - metric.analytics_dependency_trend
sample:
  - views/independence-trend.json#featuredRows.0.help_offers = 7
  - views/independence-trend.json#featuredRows.0.from_errors = 5
  - views/independence-trend.json#featuredRows.0.questions = 6
  - views/independence-trend.json#featuredRows.7.help_offers = 17
  - views/independence-trend.json#featuredRows.7.from_errors = 1
  - views/independence-trend.json#featuredRows.7.sessions_without_help = 2
  - views/independence-trend.json#featuredRows.2.sessions_without_help = 1
  - views/independence-trend.json#analysis.early.mean = 47.5
  - views/independence-trend.json#analysis.late.mean = 24.1
  - views/independence-trend.json#analysis.pairedT.t = -5.39
  - views/independence-trend.json#analysis.gainCorrelation.r = 0.07
---

# Tendencia de autonomía

## ¿Qué es la tendencia de autonomía? {#what}

La tendencia de autonomía reúne tres porcentajes semanales. Juntos muestran si un estudiante pide ayuda con menos frecuencia y necesita menos pasos de la pista a medida que pasan las semanas. El panel de investigación la muestra para un estudiante y para toda la clase, durante las últimas 12 semanas.

## Ejemplo con un estudiante {#example}

S07 es un estudiante ficticio de la muestra. En la semana 1, la extensión ofreció ayuda en 7 errores y S07 preguntó por 5 de ellos. En 5 de sus 6 preguntas abrió la regla o la solución, así que la pista bastó una sola vez. En la semana 8 la situación era otra. La extensión ofreció ayuda en 17 errores y S07 solo preguntó por 1. En la semana 3, S07 abrió una segunda ventana de VS Code en la que no trabajó. Esa ventana creó una sesión vacía, por lo que la mitad de las sesiones de esa semana cuentan como sesiones sin ayuda.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><IndependenceTrend /></ClientOnly>
<template #takeaway>S07 empieza por encima de la clase en pedir ayuda y termina por debajo, mientras la primera pista basta cada vez más a menudo.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Empieza mi clase a resolver los errores por su cuenta con el paso de las semanas?
- **Investigación:** ¿Disminuye la búsqueda de ayuda y basta la primera pista más a menudo con el tiempo, en la clase y en cada estudiante?

## Muestra de datos brutos {#raw}

La tendencia usa dos tablas. Estas filas son de S07 en la semana 3. Solo se muestran las columnas que leen las fórmulas.

`coding_sessions` (la segunda fila es la sesión vacía de la segunda ventana):

<<< @/../.vitepress/data/sample/snippets/independence-trend.sessions.json

`interactions`:

<<< @/../.vitepress/data/sample/snippets/independence-trend.interactions.json

La función del panel `dashboard.weekly_trend` devuelve una fila por semana. Esta es la semana 3 de S07:

<<< @/../.vitepress/data/sample/snippets/independence-trend.week.json

Las semanas van de lunes a domingo en la zona horaria de quien consulta el panel. El panel muestra las 12 semanas que terminan con la última semana del periodo elegido.

### Pidió ayuda cuando se le ofreció {#offers-taken}

Preguntas sobre errores creadas en la semana, divididas entre las ofertas de ayuda contadas en las sesiones que empezaron esa semana, por 100. El valor máximo es 100%. Una semana sin ofertas no tiene valor.

<FormulaVersion ids="metric.pct_offers_taken" />

### Bastó con la pista {#hint-enough}

Preguntas de la semana en las que el estudiante no abrió ni la regla (L2) ni la solución (L3), divididas entre todas las preguntas de la semana, por 100. Una semana sin preguntas no tiene valor.

<FormulaVersion ids="metric.pct_hint_enough_weekly" />

### Sesiones sin ayuda {#sessions-without-help}

Sesiones que empezaron en la semana y no contienen ninguna pregunta, divididas entre todas las sesiones que empezaron esa semana, por 100. Una semana sin sesiones no tiene valor.

<FormulaVersion ids="metric.pct_sessions_without_help_weekly" />

### El informe SQL {#sql-report}

El archivo `supabase/analytics/dependency_trend.sql` crea una tabla semanal parecida, que se ejecuta a mano en el editor SQL. Coloca cada pregunta en la semana de su sesión, usa semanas en UTC y no limita el primer porcentaje a 100%. Por eso sus valores pueden diferir de los del panel.

<FormulaVersion ids="metric.analytics_dependency_trend" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención (seguimiento semanal) y en el análisis.
- **Un valor por estudiante para SPSS:** primero sume los recuentos y después divida. Por ejemplo, `offers_taken_early` = 100 × (preguntas sobre errores de las semanas 1 y 2) ÷ (ofertas de ayuda de las semanas 1 y 2), con un máximo de 100. Calcule `offers_taken_late` igual para las semanas 7 y 8 y use la diferencia como puntuación de cambio. No promedie los porcentajes semanales, porque una semana con una pregunta pesaría lo mismo que una semana con diez.
- **Análisis de ejemplo:** una prueba t para muestras relacionadas entre `offers_taken_early` y `offers_taken_late`, y una correlación entre la puntuación de cambio y la ganancia de aprendizaje del pretest al postest. En la muestra sintética, la media bajó del 47,5% al 24,1%, t(24) = −5,39, p < ,001, y la puntuación de cambio no se correlacionó con la ganancia, r(23) = ,07, p = ,744.

**Preguntas de investigación**

<RqList ids="metric.pct_offers_taken,metric.pct_hint_enough_weekly,metric.pct_sessions_without_help_weekly" />

**Frase de ejemplo (números sintéticos):** «La búsqueda de ayuda se midió como la proporción de errores con oferta de ayuda por los que el estudiante preguntó (fórmula del panel, versión 1.0), agregada en las semanas 1 y 2 y en las semanas 7 y 8. La proporción bajó del 47,5% (DT = 27,4) al 24,1% (DT = 22,5), t(24) = −5,39, p < ,001, dz = −1,08.»

## Lo que estos datos no muestran {#limits}

Los porcentajes describen lo que hizo el estudiante dentro de la extensión, no lo que aprendió. Que baje la búsqueda de ayuda puede indicar más autonomía, pero también tareas más fáciles, menos tiempo en el laboratorio o ayuda de compañeros o de herramientas de IA del navegador. Las ofertas de ayuda solo cuentan los errores marcados con un icono en el editor activo (como máximo tres por archivo), así que la base del primer porcentaje está incompleta. Las sesiones vacías de ventanas adicionales de VS Code aumentan la proporción de sesiones sin ayuda, y las semanas con una o dos preguntas dan porcentajes inestables.

## Para el profesorado {#teacher}

::: tip En clase
Si la línea de la clase en «Pidió ayuda cuando se le ofreció» sigue alta después de las primeras semanas, lean juntos dos o tres mensajes de error frecuentes y comenten a qué parte del código apunta cada uno. Si la línea de un estudiante vuelve a subir, pregúntele cómo le va con la tarea de esa semana. La tendencia muestra un cambio, no su causa.
:::
