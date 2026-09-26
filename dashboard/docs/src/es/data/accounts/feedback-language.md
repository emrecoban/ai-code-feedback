---
title: Idioma de las explicaciones
items:
  - profiles.feedback_language
  - event.feedback_language_changed
  - event.feedback_language_changed.from
  - event.feedback_language_changed.to
sample:
  - views/feedback-language.json#facts.featuredLanguage = en
  - views/feedback-language.json#facts.exampleStudent = S03
  - views/feedback-language.json#facts.exampleFrom = en
  - views/feedback-language.json#facts.exampleTo = tr
  - views/feedback-language.json#facts.exampleWeek = 2
  - views/feedback-language.json#facts.tr = 20
  - views/feedback-language.json#facts.en = 4
  - views/feedback-language.json#facts.es = 1
  - views/feedback-language.json#facts.changes = 3
---

# Idioma de las explicaciones

## ¿Qué es el idioma de las explicaciones? {#what}

El idioma de las explicaciones es el idioma en que el estudiante lee la extensión y las explicaciones de la IA: inglés, turco o español. Cada estudiante lo elige, así que quienes comparten un ordenador del laboratorio pueden usar idiomas distintos. Cada cambio se registra además como un evento.

## Ejemplo con un estudiante {#example}

S07 eligió inglés en el primer inicio de sesión y no lo cambió nunca. S03 empezó en inglés y pasó al turco en la semana 2. El perfil solo guarda el idioma actual, así que el cambio solo se ve en el registro de eventos.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="feedback-language" /></ClientOnly>
<template #takeaway>Al final de la muestra, 20 estudiantes usan turco, 4 inglés y 1 español. 3 estudiantes cambiaron de idioma una vez.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿En qué idioma lee cada estudiante las explicaciones?
- **Investigación:** ¿Se relaciona el idioma de las explicaciones, o el cambio a la lengua materna, con el uso de las pistas?

## Muestra de datos brutos {#raw}

El idioma actual está en el perfil. El cambio es un evento (aquí, el cambio del estudiante del ejemplo).

`profiles` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/feedback-language.profiles.json

`events`:

<<< @/../.vitepress/data/sample/snippets/feedback-language.event.json

## Uso en la investigación {#research}

- **Etapa:** diseño (agrupación) y análisis
- **Un valor por estudiante para SPSS:** `feedback_language` como variable nominal (1 = inglés, 2 = turco, 3 = español) y `language_changes` como número de eventos de cambio.
- **Análisis de ejemplo:** Compare la profundidad de las pistas entre grupos de idioma con una prueba de Kruskal–Wallis, porque los grupos son pequeños.

**Preguntas de investigación**

<RqList ids="profiles.feedback_language" />

**Frase de ejemplo (Método):** «Los estudiantes eligieron en la extensión el idioma de las explicaciones (inglés, turco o español) y cada cambio posterior quedó registrado.»

## Lo que estos datos no muestran {#limits}

El perfil solo guarda el idioma actual. El idioma de una pregunta antigua solo puede reconstruirse a partir de los eventos de cambio, y solo para cambios hechos con la sesión iniciada. Un cambio puede reflejar dificultades de comprensión, pero también curiosidad o un ordenador compartido.

## Para el profesorado {#teacher}

::: tip En clase
Si un estudiante pasa a su lengua materna después de una semana difícil, puede que la tarea le haya costado. Pregunte por la tarea, no por el idioma.
:::
