---
title: Guardados
items:
  - coding_sessions.save_count
sample:
  - views/saves.json#facts.featured = 172
  - views/saves.json#facts.classMean = 178
---

# Guardados

## ¿Qué son los guardados? {#what}

El contador sube uno cada vez que se guarda un archivo en VS Code. Los principiantes suelen guardar justo antes de ejecutar el programa, así que los guardados son una señal aproximada del ciclo de «probar y ver».

## Ejemplo con un estudiante {#example}

S07 guardó archivos 172 veces en ocho semanas, y la clase 178 veces de media. S07 guardó con más frecuencia en las semanas 4 y 8.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="saves" /></ClientOnly>
<template #takeaway>La clase guarda unas 21 a 23 veces por semana. S07 sigue los mismos picos que en el tiempo activo.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Con qué frecuencia prueban los estudiantes sus cambios?
- **Investigación:** ¿Cómo de corto es el ciclo de editar y ejecutar?

## Muestra de datos brutos {#raw}

Dos sesiones de S07.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/saves.json

### Cómo se cuenta {#coding-sessions-save-count}

Cada evento de guardado de un documento suma 1. La extensión suma al contador mientras el estudiante trabaja y lo añade a la fila de la sesión cada 3 minutos.

<FormulaVersion ids="coding_sessions.save_count" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** `saves_per_hour` = guardados ÷ horas activas, por estudiante.
- **Análisis de ejemplo:** Descríbalo, y compruebe que el guardado automático estaba desactivado en el laboratorio antes de interpretarlo.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «Los eventos de guardado se contaron como aproximación a la frecuencia de los ciclos de editar y probar.»

## Lo que estos datos no muestran {#limits}

Con el guardado automático activado, VS Code guarda solo y el número pierde su sentido. Algunos estudiantes guardan por costumbre tras cada línea. Un guardado no muestra que se ejecutara el programa.

## Para el profesorado {#teacher}

::: tip En clase
Un estudiante que guarda muy poco puede ejecutar grandes bloques de código de una vez. Anime a dar pasos pequeños: cambiar, guardar, ejecutar.
:::
