---
title: Requieren atención
items:
  - metric.needs_attention
sample:
  - views/needs-attention.json#facts.flagged = 25
  - views/needs-attention.json#facts.cohort = 25
  - views/needs-attention.json#facts.stillStuck = 23
  - views/needs-attention.json#facts.lastWeekFlagged = 16
  - views/needs-attention.json#facts.featuredLastWeek = 0
---

# Requieren atención

## ¿Qué significa «requieren atención»? {#what}

El panel muestra a los estudiantes que cumplen al menos una de seis reglas en el periodo elegido, con los motivos. La lista ayuda al profesorado a decidir a quién atender primero en un laboratorio.

## Ejemplo con un estudiante {#example}

En las ocho semanas completas, 25 de 25 estudiantes están en la lista, S07 entre ellos. Por ejemplo, 23 estudiantes respondieron «Sigo atascado/a» al menos una vez. Solo en la semana 8 hay 16 estudiantes en la lista, y S07 no está.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="needs-attention" /></ClientOnly>
<template #takeaway>En un periodo largo casi todos los estudiantes cumplen alguna regla. La lista es útil para un periodo corto, como una semana de laboratorio.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Quién necesita mi ayuda ahora?
- **Investigación:** ¿Pueden unas reglas sencillas sobre los registros detectar estudiantes en riesgo, y coinciden con los resultados de los tests?

## Muestra de datos brutos {#raw}

Una entrada de la lista en todo el rango.

Parte del JSON que devuelve `dashboard_overview`:

<<< @/../.vitepress/data/sample/snippets/needs-attention.json

### Las seis reglas {#metric-needs-attention}

Mismo error 3+ veces (el mismo error normalizado preguntado tres o más veces). Dijo «sigo atascado» (al menos una respuesta así). Necesitó la solución en el 70%+ de 5+ preguntas. 8+ ediciones de media antes de preguntar (al menos dos preguntas medidas). 2+ valoraciones «no útil». Sin actividad en 7+ días (esta regla ignora el periodo). Los estudiantes se ordenan por número de motivos.

<FormulaVersion ids="metric.needs_attention" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención (para seguir a la clase)
- **Un valor por estudiante para SPSS:** No es necesario como tal. Si quiere una variable indicadora, calcule cada regla por semana a partir de los datos brutos.
- **Análisis de ejemplo:** Compruebe si el número de semanas en que un estudiante aparece en la lista se relaciona con una puntuación baja en el postest (Spearman).

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «El panel señalaba estudiantes al profesorado con seis indicadores basados en reglas calculados para el periodo elegido.»

## Lo que estos datos no muestran {#limits}

Las reglas cuentan eventos y no se vuelven más estrictas con la duración del periodo, así que en muchas semanas casi todos aparecen. Un estudiante que no pregunta nada solo aparece por la regla de inactividad. La lista es un aviso para el profesorado, no un diagnóstico.

## Para el profesorado {#teacher}

::: tip En clase
Ajuste el periodo al laboratorio o a la semana actual antes de leer la lista. Empiece por los estudiantes con dos o más motivos.
:::
