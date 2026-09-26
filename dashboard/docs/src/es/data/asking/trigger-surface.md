---
title: Desde dónde se pregunta
items:
  - interactions.trigger_surface
  - metric.surfaces
sample:
  - views/trigger-surface.json#facts.featuredTop = diagnostic_codelens
  - views/trigger-surface.json#facts.topPct = 44.9
---

# Desde dónde se pregunta

## ¿Qué es el punto de partida de una pregunta? {#what}

El punto de partida es el botón, enlace o atajo exacto que el estudiante usó para preguntar. Hay nueve valores, por ejemplo la línea CodeLens sobre un error, el menú de la bombilla, la barra de estado o el atajo de teclado.

## Ejemplo con un estudiante {#example}

S07 usó con más frecuencia «Error: CodeLens», igual que la clase en conjunto. Cada botón guarda su propio valor, así que los datos muestran qué formas de preguntar encontró y usó S07.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="trigger-surface" /></ClientOnly>
<template #takeaway>La CodeLens sobre un error es la forma más usada de preguntar (44,9% de todas las preguntas). El atajo de teclado es poco frecuente.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Qué botones encuentran y usan los estudiantes?
- **Investigación:** ¿Qué puntos de entrada usan los estudiantes y cambia la visibilidad de un punto de entrada la frecuencia con que preguntan?

## Muestra de datos brutos {#raw}

Dos preguntas de S07 con su punto de partida.

`interactions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/trigger-surface.json

### Desde dónde se pregunta (panel) {#metric-surfaces}

Las preguntas del periodo, agrupadas por punto de partida. Un valor que falta se muestra como «Sin registrar».

<FormulaVersion ids="metric.surfaces" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** Una proporción por grupo de puntos de entrada, por ejemplo `share_codelens` = preguntas por CodeLens ÷ todas las preguntas.
- **Análisis de ejemplo:** Describa la combinación de puntos de entrada por semana y compárela entre quienes preguntan a menudo y quienes preguntan poco.

**Preguntas de investigación**

<RqList ids="interactions.trigger_surface,metric.surfaces" />

**Frase de ejemplo (Método):** «Se registró el elemento de la interfaz usado en cada petición (CodeLens, bombilla, enlace del margen, barra de estado, atajo de teclado, botón de la barra lateral o paleta de comandos).»

## Lo que estos datos no muestran {#limits}

Un clic en el enlace del margen de una selección se guarda como «Selección: atajo», porque ese enlace no envía ningún valor. El botón de la barra lateral y la paleta de comandos hacen una pregunta fija sin mostrar la lista de preguntas. La combinación depende también de lo que estaba visible: el editor solo muestra la CodeLens para los tres primeros errores de un archivo.

## Para el profesorado {#teacher}

::: tip En clase
Si casi nadie usa las funciones de selección, muestre una vez en clase el atajo Ctrl+Alt+Espacio (Cmd+Alt+Espacio en macOS).
:::
