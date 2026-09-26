---
title: Salió de VS Code
items:
  - coding_sessions.focus_loss_count
  - coding_sessions.unfocused_seconds
  - metric.habits_totals
sample:
  - views/left-vscode.json#facts.featuredLosses = 55
  - views/left-vscode.json#facts.featuredAwayMin = 57
  - views/left-vscode.json#facts.classMeanLosses = 57
---

# Salió de VS Code

## ¿Qué significa «salió de VS Code»? {#what}

El contador sube cada vez que la ventana de VS Code pierde el foco, por ejemplo cuando el estudiante hace clic en el navegador. Un segundo número suma el tiempo hasta que vuelve, con un máximo de diez minutos por ausencia.

## Ejemplo con un estudiante {#example}

S07 salió de VS Code 55 veces en ocho semanas y estuvo fuera 57 minutos en total. La media de la clase fue de 57 veces. En la semana 8, S07 salió de VS Code con más frecuencia.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="left-vscode" /></ClientOnly>
<template #takeaway>La clase sale de VS Code unas siete veces por semana. S07 está cerca de la clase, con un pico en la semana 8.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Buscan los estudiantes ayuda fuera del editor, por ejemplo en el navegador?
- **Investigación:** ¿Con qué frecuencia pasan los estudiantes a otras fuentes, que la extensión no puede ver?

## Muestra de datos brutos {#raw}

Dos sesiones de S07.

`coding_sessions` (algunas columnas):

<<< @/../.vitepress/data/sample/snippets/left-vscode.json

### Cómo se mide el tiempo fuera {#coding-sessions-unfocused-seconds}

Duración de cada ausencia terminada (la ventana pierde el foco y luego lo recupera), con un máximo de diez minutos por ausencia. Una ausencia que nunca termina, por ejemplo porque se cierra VS Code, no se cuenta.

<FormulaVersion ids="coding_sessions.unfocused_seconds" />

### Hábitos de trabajo (panel) {#metric-habits-totals}

El panel suma este contador y los demás contadores de hábitos de las páginas siguientes en las sesiones del periodo.

<FormulaVersion ids="metric.habits_totals" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis
- **Un valor por estudiante para SPSS:** `focus_losses_per_hour` = salidas ÷ horas activas, y `away_min`, por estudiante.
- **Análisis de ejemplo:** Relacione las salidas de VS Code con el número de preguntas: quienes preguntan menos pueden buscar ayuda en otro sitio (Spearman).

**Preguntas de investigación**

<RqList ids="coding_sessions.focus_loss_count" />

**Frase de ejemplo (Método):** «Los cambios fuera de la ventana del editor se contaron como indicador indirecto de ayuda buscada fuera de la extensión.»

## Lo que estos datos no muestran {#limits}

La extensión no sabe adónde fue el estudiante: puede ser el enunciado, un buscador, otra herramienta de IA o un chat. Un clic en el panel del terminal dentro de VS Code no cuenta. El tiempo fuera tiene un límite, así que las pausas largas parecen cortas.

## Para el profesorado {#teacher}

::: tip En clase
Si da el enunciado en PDF, los estudiantes tienen que salir de VS Code para leerlo. Poner la tarea como comentario en el archivo de código los mantiene en un solo lugar.
:::
