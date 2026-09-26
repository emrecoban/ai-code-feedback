---
title: Sesiones
items:
  - coding_sessions.started_at
  - coding_sessions.last_seen_at
  - metric.sessions
  - metric.session_length_avg
  - metric.analytics_session_rhythm
sample:
  - views/sessions.json#facts.featuredSessions = 12
  - views/sessions.json#facts.classMeanSessions = 12.8
  - views/sessions.json#facts.avgMinutes = 77.5
  - views/sessions.json#facts.emptySessions = 15
  - views/sessions.json#facts.allSessions = 321
---

# Sesiones

## ¿Qué es una sesión? {#what}

Una sesión es una fila de la tabla `coding_sessions`. La extensión la crea cuando el estudiante inicia sesión o cuando VS Code abre una ventana con el estudiante ya conectado. Todos los contadores de actividad de las páginas siguientes pertenecen a una sesión.

## Ejemplo con un estudiante {#example}

S07 tuvo 12 sesiones en las ocho semanas, y la clase 12,8 de media. Casi todas las semanas S07 tuvo una sesión en el laboratorio. En las semanas 3 y 4 hubo dos, y en la semana 8, tres. En la clase, una sesión duró 77,5 minutos de media.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="sessions" /></ClientOnly>
<template #takeaway>La mayoría de los estudiantes tienen una o dos sesiones por semana. S07 tiene más sesiones en las semanas 3, 4 y 8.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Trabajan los estudiantes con la extensión fuera del laboratorio?
- **Investigación:** ¿Cuál es la unidad de los contadores de actividad y cuánto usó cada estudiante el entorno?

## Muestra de datos brutos {#raw}

Dos sesiones de S07.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/sessions.json

### Sesiones (panel) {#metric-sessions}

Número de filas de sesión que empezaron en el periodo.

<FormulaVersion ids="metric.sessions" />

### Duración de la sesión (media, panel) {#metric-session-length-avg}

Media de la última actualización de actividad menos el inicio de la sesión, en minutos, en las sesiones del periodo.

<FormulaVersion ids="metric.session_length_avg" />

### Informe de ritmo de sesiones (SQL) {#metric-analytics-session-rhythm}

Un informe SQL de solo lectura del repositorio. Por estudiante y semana: sesiones, minutos medios por sesión, minutos activos medios, pausas medias y sesiones por franja del día. Usa la zona horaria de la base de datos.

<FormulaVersion ids="metric.analytics_session_rhythm" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis (como variable de control)
- **Un valor por estudiante para SPSS:** `n_sessions` y `mean_session_min` por estudiante. Excluya las sesiones vacías (sin tiempo activo).
- **Análisis de ejemplo:** Use el número de sesiones como medida de exposición al comparar estudiantes o grupos.

**Preguntas de investigación**

<RqList ids="metric.sessions" />

**Frase de ejemplo (Método):** «El uso se resumió por estudiante como el número de sesiones de programación y su duración media.»

## Lo que estos datos no muestran {#limits}

Recargar VS Code o abrir una segunda ventana inicia una sesión nueva, así que una sesión no es lo mismo que un laboratorio. El fin de la sesión nunca se guarda, y la duración es solo un límite inferior. Existen sesiones sin actividad (15 de 321 en la muestra).

## Para el profesorado {#teacher}

::: tip En clase
Las sesiones fuera del horario de laboratorio muestran quién practica en casa. Son un buen punto de partida para una charla breve sobre hábitos de estudio.
:::
