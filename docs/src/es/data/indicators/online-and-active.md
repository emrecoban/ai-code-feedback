---
title: Estudiantes en línea y activos
items:
  - metric.online_now
  - metric.active_students
  - metric.new_students
  - metric.last_active
sample:
  - views/online-and-active.json#facts.active = 25
  - views/online-and-active.json#facts.total = 25
  - views/online-and-active.json#facts.week1 = 24
  - views/online-and-active.json#facts.week8 = 24
---

# Estudiantes en línea y activos

## ¿Qué significan «en línea» y «activo»? {#what}

El panel muestra cuatro recuentos sencillos. En línea ahora: estudiantes con alguna huella en los últimos 10 minutos. Estudiantes activos: estudiantes con alguna huella en el periodo. Estudiantes nuevos: cuentas creadas en el periodo. Última actividad: la huella más reciente de cada estudiante.

## Ejemplo con un estudiante {#example}

En la muestra, 25 de 25 estudiantes estuvieron activos en las ocho semanas, 24 en la semana 1 y 24 en la semana 8. Mientras S07 trabaja en un laboratorio, la extensión envía actividad cada 3 minutos, así que S07 sigue «en línea» en el panel.

## En los datos de muestra {#visual}

<Figure>
<ClientOnly><SampleVisual view="online-and-active" /></ClientOnly>
<template #takeaway>Casi todos los estudiantes estuvieron activos todas las semanas del curso.</template>
</Figure>

## Para qué sirve {#purpose}

- **Profesorado:** ¿Quién está trabajando ahora y a quién hace tiempo que no se ve?
- **Investigación:** ¿Cuántos estudiantes participaron cada semana, como base para el abandono y los datos perdidos?

## Muestra de datos brutos {#raw}

La fila de S07 en la lista de estudiantes del panel.

Parte del JSON que devuelve `dashboard_students`:

<<< @/../.vitepress/data/sample/snippets/online-and-active.json

### En línea ahora (panel) {#metric-online-now}

Estudiantes con un inicio de sesión, una actualización de actividad, una pregunta o un evento en los últimos 10 minutos. Ignora el periodo. Los 10 minutos deben ser más que la actualización de 3 minutos de la extensión.

<FormulaVersion ids="metric.online_now" />

### Estudiantes activos (panel) {#metric-active-students}

Estudiantes con alguna huella en el periodo: un inicio de sesión, una actualización de actividad, una pregunta o un evento.

<FormulaVersion ids="metric.active_students" />

### Estudiantes nuevos (panel) {#metric-new-students}

Cuentas creadas en el periodo.

<FormulaVersion ids="metric.new_students" />

### Última actividad (panel) {#metric-last-active}

La más reciente entre el inicio de sesión, la actualización de actividad, la hora de las preguntas y la de los eventos del estudiante, en todo el tiempo.

<FormulaVersion ids="metric.last_active" />

## Uso en la investigación {#research}

- **Etapa:** durante la intervención y en el análisis (participación)
- **Un valor por estudiante para SPSS:** `weeks_active` por estudiante (número de semanas con alguna huella).
- **Análisis de ejemplo:** Informe de la participación semanal en la sección de Método y decida un número mínimo de semanas activas antes del análisis principal.

**Preguntas de investigación**

Todavía ninguna pregunta de investigación en borrador usa este dato como variable.

**Frase de ejemplo (Método):** «La participación se describió como el número de estudiantes con alguna actividad registrada en cada semana de la intervención.»

## Lo que estos datos no muestran {#limits}

Una sesión vacía o un solo evento bastan para contar como activo. El panel cuenta los eventos de investigación como actividad, pero la hoja diaria de su exportación no, así que los dos números pueden diferir. Estar activo no dice nada sobre la cantidad de trabajo.

## Para el profesorado {#teacher}

::: tip En clase
Al inicio de un laboratorio, «En línea ahora» muestra quién ha iniciado sesión. A un estudiante que no aparece puede fallarle la extensión.
:::
