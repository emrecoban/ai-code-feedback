---
title: Notas privadas del estudiante
items:
  - learner_profiles.summary
  - learner_profiles.summary_generated_at
  - learner_profiles.interactions_since_update
  - metric.ext_summary_progress
  - metric.summary_cadence
sample:
  - views/private-notes.json#facts.rewrites = 8
  - views/private-notes.json#facts.featuredQuestions = 37
  - views/private-notes.json#facts.cacheHits = 3
  - views/private-notes.json#facts.current = 1
---

# Notas privadas del estudiante

## ¿Qué son las notas privadas del estudiante? {#what}

Las notas privadas del estudiante son un texto breve en inglés sobre el estudiante que el modelo escribe para sí mismo. Se envían con cada petición de explicación posterior para que el modelo adapte sus pistas. La barra lateral y el panel no las muestran.

## Ejemplo con un estudiante {#example}

Las notas de S07 se reescribieron 8 veces en ocho semanas, junto con el resumen de aprendizaje de IA. S07 hizo 37 preguntas, y 3 respuestas salieron de la caché y no contaron para la siguiente reescritura. Al final, 1 pregunta nueva esperaba la siguiente reescritura. La base de datos solo guarda la última versión. La lista de reescrituras de la sección siguiente procede del generador de la muestra y muestra cómo funciona la regla.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="private-notes" /></ClientOnly>
<template #takeaway>Las notas de S07 se reescribieron aproximadamente una vez por semana, cada vez tras tres a seis preguntas nuevas.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Qué «recuerda» el modelo sobre un estudiante?
- **Investigación:** ¿Cómo se personaliza la retroalimentación y con qué frecuencia cambia la personalización?

## Muestra de datos brutos {#raw}

Las notas de S07 al final de la muestra.

`learner_profiles` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/private-notes.json

### Cómo se escriben las notas {#learner-profiles-summary}

De dos a cuatro frases breves en inglés, en tercera persona, solo para el modelo. El modelo las escribe en la misma llamada que el resumen de aprendizaje de IA.

<FormulaVersion ids="learner_profiles.summary" />

### Cuándo se reescriben las notas {#metric-summary-cadence}

Se escribe una versión nueva cuando han pasado 24 horas desde la anterior y hay al menos 3 preguntas nuevas. Tras un cambio del idioma de las explicaciones se escribe enseguida. El modelo ve las 30 últimas preguntas con sus títulos y resultados.

<FormulaVersion ids="metric.summary_cadence" />

### Preguntas nuevas desde el resumen {#learner-profiles-interactions-since-update}

Sube 1 por cada respuesta que no salió de la caché, y vuelve a 0 cuando se reescriben las notas.

<FormulaVersion ids="learner_profiles.interactions_since_update" />

### Barra de progreso del resumen {#metric-ext-summary-progress}

La barra lateral muestra la menor de dos proporciones: horas desde el último resumen ÷ 24 y preguntas nuevas ÷ 3, con 1 como máximo. Al llegar a 1, la extensión pide un resumen nuevo.

<FormulaVersion ids="metric.ext_summary_progress" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis (para describir la personalización)
- **Un valor por estudiante para SPSS:** Ninguno. Solo se guardan el último texto y su hora, así que el número de reescrituras no puede contarse después.
- **Análisis de ejemplo:** Describa la regla en la sección de Método. Lea una muestra de notas finales para comprobar que no contienen datos personales.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «La retroalimentación se personalizó con un perfil breve del estudiante que el modelo reescribía como mucho una vez al día a partir de sus preguntas recientes.»

## Lo que estos datos no muestran {#limits}

Solo se guarda la última versión, así que se pierde el historial de las notas. Las respuestas de la caché no cuentan para la siguiente reescritura. Las notas son la visión del modelo sobre el estudiante y pueden ser erróneas.

## Para el profesorado {#teacher}

::: tip En clase
Los estudiantes pueden preguntar por qué cambian las pistas con el tiempo. Puede explicarles que la herramienta guarda notas breves sobre sus preguntas recientes para adaptar las pistas.
:::
