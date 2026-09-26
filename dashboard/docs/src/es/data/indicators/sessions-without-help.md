---
title: Sesiones sin ayuda
items:
  - metric.sessions_without_help_pct
  - metric.analytics_sessions_without_help
sample:
  - views/sessions-without-help.json#facts.featuredPct = 25
  - views/sessions-without-help.json#facts.featuredPctNoEmpty = 18.2
  - views/sessions-without-help.json#facts.classPct = 22.1
  - views/sessions-without-help.json#facts.classPctNoEmpty = 18.3
---

# Sesiones sin ayuda

## ¿Qué es una sesión sin ayuda? {#what}

Es una sesión en la que el estudiante no hizo ninguna pregunta. El panel muestra la proporción de estas sesiones entre todas las del periodo.

## Ejemplo con un estudiante {#example}

El 25% de las sesiones de S07 no tuvo ninguna pregunta. Una de ellas era una sesión vacía: se abrió VS Code y se cerró sin actividad. Sin sesiones vacías, el valor de S07 baja al 18,2%, y el de la clase del 22,1% al 18,3%.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="sessions-without-help" /></ClientOnly>
<template #takeaway>Las sesiones vacías elevan la tasa. Excluirlas da una imagen más justa del trabajo real sin ayuda.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Trabajan también los estudiantes sin preguntar a la herramienta?
- **Investigación:** ¿Crece la proporción de sesiones sin ayuda con las semanas?

## Muestra de datos brutos {#raw}

Una sesión vacía y una sesión normal de S07.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/sessions-without-help.json

### Sesiones sin ayuda (panel) {#metric-sessions-without-help-pct}

Sesiones del periodo sin ninguna pregunta vinculada, divididas entre todas las sesiones del periodo. Se incluyen las sesiones vacías.

<FormulaVersion ids="metric.sessions_without_help_pct" />

### Informe de sesiones sin ayuda (SQL) {#metric-analytics-sessions-without-help}

Un informe SQL de solo lectura del repositorio. Por estudiante: sesiones, sesiones sin preguntas, su proporción, errores corregidos sin preguntar y ofertas de ayuda.

<FormulaVersion ids="metric.analytics_sessions_without_help" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `no_help_share` por estudiante, calculado sin las sesiones vacías (tiempo activo 0).
- **Análisis de ejemplo:** Contraste el cambio de la primera a la segunda mitad del curso (prueba de Wilcoxon para muestras relacionadas).

**Preguntas de investigación**

<RqList ids="metric.sessions_without_help_pct" />

**Frase de ejemplo (Método):** «La proporción de sesiones de programación sin ninguna petición de ayuda se calculó tras excluir las sesiones sin actividad en el editor.»

## Lo que estos datos no muestran {#limits}

El panel cuenta las sesiones vacías, y recargar VS Code crea una. Una sesión sin ayuda también puede ser una sesión corta en la que el estudiante solo leyó código. No muestra que el estudiante encontrara una dificultad y la resolviera solo.

## Para el profesorado {#teacher}

::: tip En clase
No interprete una tasa baja como un problema en el laboratorio: la mayoría de las tareas llevan al menos a una pregunta. Mire mejor la tendencia a lo largo de las semanas.
:::
