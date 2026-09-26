---
title: La explicación
items:
  - interactions.title
  - interactions.ladder_payload
sample:
  - views/explanation.json#facts.title = Undefined variable total
  - views/explanation.json#facts.degraded = 10
---

# La explicación

## ¿Qué se guarda de la explicación? {#what}

Para cada pregunta, el sistema guarda la respuesta completa del modelo de IA: un título breve, el concepto, los cuatro pasos y dos indicadores (confianza y «necesita más contexto»). El estudiante puede volver a leerla desde el historial.

## Ejemplo con un estudiante {#example}

La pregunta de S07 recibió el título «Undefined variable total». La respuesta de abajo es el texto sintético que se usa en todas las filas de la muestra. En los datos reales cada respuesta es distinta y está escrita en el idioma de las explicaciones.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="explanation" /></ClientOnly>
<template #takeaway>Los cuatro pasos van de entender el mensaje al cambio concreto.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Qué leyó exactamente el estudiante?
- **Investigación:** ¿Cuál fue la calidad y el contenido de la retroalimentación que recibió el estudiante?

## Muestra de datos brutos {#raw}

El título, el concepto y la respuesta guardada de la pregunta de arriba.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/explanation.json

## Uso en la investigación {#research}

- **Etapa:** en el análisis (calidad de la retroalimentación)
- **Un valor por estudiante para SPSS:** El texto en sí no va a SPSS. Valore una muestra aleatoria de respuestas con una rúbrica y añada las puntuaciones por pregunta.
- **Análisis de ejemplo:** Compruebe la exactitud de las respuestas con dos evaluadores e informe del acuerdo (kappa de Cohen).

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Dos investigadores valoraron una muestra aleatoria de las explicaciones generadas según su exactitud y su ajuste al formato de cuatro pasos.»

## Lo que estos datos no muestran {#limits}

El texto puede citar partes del código del estudiante. Cuando dos comprobaciones estrictas fallan dos veces (idioma incorrecto o filtración de las notas privadas), L2 y L3 se guardan vacíos (10 respuestas en la muestra). Las respuestas de la caché se escribieron para una pregunta idéntica de otro estudiante.

## Para el profesorado {#teacher}

::: tip En clase
Cuando un estudiante diga que una explicación fue confusa, abra la pregunta en el panel y lean juntos los cuatro pasos. Es una forma rápida de ver dónde empezó el malentendido.
:::
