---
title: Se fue sin actuar
items:
  - event.feedback_abandoned
  - event.feedback_abandoned.level
  - event.feedback_abandoned.reason
  - metric.abandoned
sample:
  - views/left-without-acting.json#facts.featuredAbandoned = 3
  - views/left-without-acting.json#facts.abandonedPct = 12.2
---

# Se fue sin actuar

## ¿Qué significa «se fue sin actuar»? {#what}

El evento se registra cuando el estudiante no hace nada en el editor durante 10 minutos después de que apareciera una explicación o un paso, o cuando VS Code se cierra antes. Es lo contrario de «Volvió al código».

## Ejemplo con un estudiante {#example}

S07 se fue sin actuar después de 3 explicaciones. En cada caso pasaron diez minutos sin actividad en el editor.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="left-without-acting" /></ClientOnly>
<template #takeaway>En la clase, el 12,2% de las explicaciones se quedó sin acción, sobre todo tras 10 minutos sin actividad.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Después de qué explicaciones dejaron de trabajar los estudiantes?
- **Investigación:** ¿Con qué frecuencia se lee la retroalimentación y luego se abandona, y se relaciona con la profundidad o con la valoración?

## Muestra de datos brutos {#raw}

Un evento de la muestra.

`events`:

<<< @/../.vitepress/data/sample/snippets/left-without-acting.json

### Se fue sin actuar (panel) {#metric-abandoned}

Preguntas distintas del periodo con al menos un evento de este tipo.

<FormulaVersion ids="metric.abandoned" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `abandon_share` = preguntas abandonadas ÷ todas las preguntas, por estudiante.
- **Análisis de ejemplo:** Compare la tasa entre explicaciones valoradas como útiles y no útiles (prueba de chi cuadrado).

**Preguntas de investigación**

<RqList ids="metric.abandoned" />

**Frase de ejemplo (Método):** «Las explicaciones seguidas de diez minutos sin actividad en el editor, o del fin de la sesión, se codificaron como abandonadas.»

## Lo que estos datos no muestran {#limits}

Un estudiante puede leer la explicación y pensar en ella más de diez minutos, o trabajar en papel. «VS Code se cerró» se envía durante el cierre y a menudo se pierde. El evento no dice nada sobre por qué el estudiante se detuvo.

## Para el profesorado {#teacher}

::: tip En clase
Mire las preguntas abandonadas cerca del final del laboratorio. Pueden señalar una tarea que los estudiantes dejaron por imposible.
:::
