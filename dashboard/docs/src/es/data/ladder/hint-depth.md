---
title: Profundidad de la pista
items:
  - interactions.max_level_reached
  - metric.hint_depth_distribution
sample:
  - views/hint-depth.json#facts.featuredQuestions = 37
  - views/hint-depth.json#facts.featuredHint = 22
  - views/hint-depth.json#facts.featuredRule = 5
  - views/hint-depth.json#facts.featuredFix = 10
  - views/hint-depth.json#facts.classFixPct = 28.8
  - views/hint-depth.json#facts.levelOne = 0
---

# Profundidad de la pista

## ¿Qué es la profundidad de la pista? {#what}

Cada respuesta es una escalera de cuatro pasos. Descifrar (L0) y Ubicar (L1) aparecen juntos. La regla (L2) y la corrección (L3) solo se abren si el estudiante hace clic. La profundidad es el paso más alto que abrió el estudiante: 0 para L0–L1, 2 para la regla y 3 para la corrección.

## Ejemplo con un estudiante {#example}

S07 hizo 37 preguntas. 22 terminaron tras L0–L1, 5 en la regla y 10 en la corrección. En las primeras semanas, S07 abría a menudo la corrección. Más tarde se detuvo con más frecuencia tras los dos primeros pasos.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="hint-depth" /></ClientOnly>
<template #takeaway>En la clase, el 28,8% de las preguntas llegó a la corrección. S07 se parece a la clase en conjunto.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Con qué frecuencia necesitan los estudiantes la corrección completa y con qué frecuencia basta una pista?
- **Investigación:** ¿Hasta dónde bajan los estudiantes por la escalera y cambia la profundidad con las semanas?

## Muestra de datos brutos {#raw}

Dos preguntas de S07: una terminó tras L0–L1 y otra llegó a la corrección.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/hint-depth.json

### Hasta dónde llegaron en las pistas (panel) {#metric-hint-depth-distribution}

Las preguntas del periodo en tres grupos: solo la pista (profundidad 0 o 1), regla (2) y corrección (3).

<FormulaVersion ids="metric.hint_depth_distribution" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `fix_share` = preguntas con profundidad 3 ÷ todas las preguntas, por estudiante. Conserve también los recuentos por nivel.
- **Análisis de ejemplo:** Contraste el cambio de la proporción de correcciones entre las semanas 1–4 y 5–8 con una prueba t para muestras relacionadas, o modele la profundidad por pregunta con una regresión ordinal mixta (estudiante como efecto aleatorio).

**Preguntas de investigación**

<RqList ids="interactions.max_level_reached,metric.hint_depth_distribution" />

**Frase de ejemplo (Método):** «La profundidad de la pista se codificó como el nivel más alto de la escalera de cuatro pasos que el estudiante abrió en cada petición (L0–L1, L2 o L3).»

## Lo que estos datos no muestran {#limits}

El valor 1 no se guarda nunca (0 filas en la muestra), porque L0 y L1 aparecen siempre juntos. Abrir un paso no significa leerlo, y no abrir la corrección no significa que el estudiante resolviera el problema. Un estudiante puede abrir pasos más tarde, al reabrir la explicación desde el historial.

## Para el profesorado {#teacher}

::: tip En clase
Si un estudiante abre la corrección en casi todas las preguntas, hable con él sobre usar primero los dos primeros pasos. Si toda la clase necesita la corrección en una tarea, puede que esa tarea necesite más apoyo en clase.
:::
