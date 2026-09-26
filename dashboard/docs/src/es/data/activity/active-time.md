---
title: Tiempo activo programando
items:
  - coding_sessions.active_seconds
  - metric.active_coding_time
sample:
  - views/active-time.json#facts.featuredHours = 11.7
  - views/active-time.json#facts.classMeanHours = 11.4
---

# Tiempo activo programando

## ¿Qué es el tiempo activo programando? {#what}

El tiempo activo programando es el tiempo en que el estudiante hacía algo en VS Code: escribir, mover el cursor, cambiar de archivo o guardar. Las pausas de más de dos minutos no se cuentan.

## Ejemplo con un estudiante {#example}

S07 tuvo 11,7 horas de tiempo activo en ocho semanas, y la clase 11,4 horas de media. El panel del estudiante muestra el mismo total como «Tiempo activo total». S07 trabajó bastante más de lo habitual en las semanas 4 y 8.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="active-time" /></ClientOnly>
<template #takeaway>La media de la clase se mantiene entre 80 y 92 minutos por semana. S07 tiene dos picos, en las semanas 4 y 8.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Cuánto tiempo dedican los estudiantes a las tareas?
- **Investigación:** ¿Cuánto tiempo estuvo expuesto cada estudiante al entorno, como base para tasas por hora?

## Muestra de datos brutos {#raw}

Dos sesiones de S07.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/active-time.json

### Cómo se mide el tiempo {#coding-sessions-active-seconds}

Cada edición, movimiento del cursor, cambio de archivo o guardado con la ventana enfocada es un latido. El intervalo desde el latido anterior se suma cuando es de dos minutos o menos.

<FormulaVersion ids="coding_sessions.active_seconds" />

### Tiempo activo programando (panel) {#metric-active-coding-time}

Suma del tiempo activo en las sesiones que empezaron en el periodo.

<FormulaVersion ids="metric.active_coding_time" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis (como variable de control)
- **Un valor por estudiante para SPSS:** `active_hours` por estudiante. Úselo como denominador de tasas como preguntas por hora.
- **Análisis de ejemplo:** Normalice los recuentos por horas activas antes de comparar estudiantes, e informe de la media y la DT de las horas activas por grupo.

**Preguntas de investigación**

<RqList ids="coding_sessions.active_seconds,metric.active_coding_time" />

**Frase de ejemplo (Método):** «El tiempo activo se estimó a partir de la actividad del editor, contando los intervalos entre eventos de hasta dos minutos.»

## Lo que estos datos no muestran {#limits}

Leer código o una explicación sin mover el cursor durante más de dos minutos no se cuenta. El tiempo en el navegador o en papel no se ve. Un estudiante que moviera el cursor en una ventana sin uso añadiría tiempo, pero es poco probable.

## Para el profesorado {#teacher}

::: tip En clase
Compare el tiempo activo con la duración del laboratorio. Una gran diferencia puede indicar lectura larga, conversación con compañeros o trabajo fuera de VS Code.
:::
