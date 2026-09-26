---
title: Archivos que quedaron sin errores
items:
  - event.file_cleared
  - event.file_cleared.fileName
  - event.file_cleared.msWithErrors
  - event.file_cleared.editsWhileErrors
  - event.file_cleared.diagnosticsSeen
  - event.file_cleared.diagnosticsAsked
  - metric.files_cleared_list
sample:
  - views/files-worked-through.json#facts.exFile = hw8.py
  - views/files-worked-through.json#facts.exMin = 26.1
  - views/files-worked-through.json#facts.exEdits = 14
  - views/files-worked-through.json#facts.exSeen = 3
  - views/files-worked-through.json#facts.exAsked = 1
  - views/files-worked-through.json#facts.featuredEpisodes = 26
  - views/files-worked-through.json#facts.medianMin = 6.6
---

# Archivos que quedaron sin errores

## ¿Qué es un archivo que quedó sin errores? {#what}

El evento se registra cuando un archivo que tenía errores o advertencias se queda sin ninguno. Resume todo el episodio: cuánto tiempo tuvo problemas el archivo, cuántas ediciones hicieron falta, cuántos problemas aparecieron y por cuántos preguntó el estudiante.

## Ejemplo con un estudiante {#example}

El último episodio de S07 fue en hw8.py. El archivo tuvo errores durante 26,1 minutos. S07 hizo 14 ediciones, vio 3 problemas y preguntó por 1. En las ocho semanas, S07 dejó archivos sin errores 26 veces.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="files-worked-through" /></ClientOnly>
<template #takeaway>Aquí funciona mejor una tabla pequeña. En la clase, un archivo tardó una mediana de 6,6 minutos en quedar sin errores.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Cuánto trabajo les cuesta a mis estudiantes que un archivo funcione?
- **Investigación:** ¿Cuánto cuesta la reparación completa de un archivo y qué parte de sus problemas necesitó ayuda?

## Muestra de datos brutos {#raw}

El último episodio de S07.

`events`:

<<< @/../.vitepress/data/sample/snippets/files-worked-through.json

### Cómo se mide el episodio {#event-file-cleared-mswitherrors}

El episodio empieza cuando aparece el primer problema en un archivo y termina cuando desaparece el último. El tiempo con errores es la diferencia en milisegundos. Las ediciones son los eventos de cambio entre ambos momentos.

<FormulaVersion ids="event.file_cleared.msWithErrors" />

### Ediciones {#event-file-cleared-editswhileerrors}

Eventos de edición en el archivo durante el episodio.

<FormulaVersion ids="event.file_cleared.editsWhileErrors" />

### Errores vistos {#event-file-cleared-diagnosticsseen}

Problemas presentes al inicio del episodio más los que aparecieron después.

<FormulaVersion ids="event.file_cleared.diagnosticsSeen" />

### Archivos que quedaron sin errores (panel) {#metric-files-cleared-list}

Los 25 últimos episodios del periodo con sus valores.

<FormulaVersion ids="metric.files_cleared_list" />

## Uso en la investigación {#research}

- **Etapa:** en el análisis
- **Un valor por estudiante para SPSS:** `median_episode_min` y `asked_share` = preguntados ÷ vistos, por estudiante en todos los episodios.
- **Análisis de ejemplo:** Compare la mediana de la duración de los episodios de las semanas 1–4 y 5–8 (Wilcoxon), como medida de una mayor soltura.

**Preguntas de investigación**

<RqList ids="event.file_cleared.msWithErrors" />

**Frase de ejemplo (Método):** «Un episodio de reparación se definió como el periodo desde el primer diagnóstico en un archivo hasta que el archivo quedó sin diagnósticos.»

## Lo que estos datos no muestran {#limits}

Se guarda el nombre del archivo, y un nombre de archivo puede contener información personal. Un episodio también termina cuando los problemas desaparecen porque se borró código. Los archivos cerrados antes de quedar sin errores no generan evento.

## Para el profesorado {#teacher}

::: tip En clase
Si en un laboratorio los archivos siguen rotos mucho tiempo, detenga una vez la clase y muestre una estrategia: corregir el primer error de arriba del archivo y volver a ejecutar.
:::
