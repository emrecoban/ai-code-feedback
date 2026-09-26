---
title: Cambios entre archivos
items:
  - coding_sessions.editor_switch_count
  - coding_sessions.files_visited
sample:
  - views/file-switches.json#facts.featuredSwitches = 119
  - views/file-switches.json#facts.classMeanSwitches = 119
  - views/file-switches.json#facts.featuredFiles = 17
---

# Cambios entre archivos

## ¿Qué son los cambios entre archivos? {#what}

El primer contador sube cada vez que el editor activo cambia a otro archivo. El segundo número es cuántos archivos distintos estuvieron activos en la sesión. Aquí no se guardan los nombres de archivo.

## Ejemplo con un estudiante {#example}

S07 cambió de archivo 119 veces en ocho semanas, igual que la media de la clase (119). Sumando todas las sesiones, S07 abrió 17 archivos.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="file-switches" /></ClientOnly>
<template #takeaway>La clase cambia de archivo unas 13 a 17 veces por semana. S07 se mueve alrededor de la media de la clase de una semana a otra.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Miran los estudiantes otros archivos, como una solución anterior, mientras trabajan?
- **Investigación:** ¿Cuánto navegan los estudiantes entre archivos, como señal de reutilización de su propio código?

## Muestra de datos brutos {#raw}

Dos sesiones de S07.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/file-switches.json

### Cambios entre archivos {#coding-sessions-editor-switch-count}

Suma 1 cuando el editor activo cambia a otro archivo en disco. La extensión suma al contador mientras el estudiante trabaja y lo añade a la fila de la sesión cada 3 minutos.

<FormulaVersion ids="coding_sessions.editor_switch_count" />

### Archivos abiertos {#coding-sessions-files-visited}

Número de archivos distintos que fueron el editor activo en la ventana de VS Code. Se asigna, no se suma, en cada actualización.

<FormulaVersion ids="coding_sessions.files_visited" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** `switches_per_hour` = cambios ÷ horas activas, por estudiante.
- **Análisis de ejemplo:** Descríbalo. Puede ser una de las variables de un análisis de conglomerados de estilos de trabajo.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «La navegación se describió con el número de cambios entre archivos en el editor.»

## Lo que estos datos no muestran {#limits}

Los archivos abiertos en dos sesiones se cuentan dos veces al sumar las sesiones. Cambiar a una página de ajustes o a un panel de salida no cuenta. El contador no puede decir por qué el estudiante abrió un archivo.

## Para el profesorado {#teacher}

::: tip En clase
Consultar soluciones anteriores es un buen hábito. Puede fomentarlo guardando todas las tareas de un laboratorio en una carpeta.
:::
