---
title: Closed the question picker
items:
  - event.question_picker_abandoned
  - event.question_picker_abandoned.stage
  - event.question_picker_abandoned.triggerSurface
  - event.question_picker_abandoned.selectionLineCount
  - event.question_picker_abandoned.selectionCharCount
  - metric.picker_abandoned
sample:
  - views/question-picker-abandoned.json#facts.featured = 5
  - views/question-picker-abandoned.json#facts.preset = 44
  - views/question-picker-abandoned.json#facts.freeText = 12
  - views/question-picker-abandoned.json#facts.selection = 271
---

# Closed the question picker

## What is a closed question picker? {#what}

The event is recorded when a student opens the question list for selected code and closes it without asking, or closes the box for an own question without text. No question is created, so this event is the only trace of the attempt.

## Example with one student {#example}

S07 opened the question list 5 times without asking anything. Each time the event stored where the list was closed and how many lines were selected. In the interactions table these moments do not exist.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="question-picker-abandoned" /></ClientOnly>
<template #takeaway>In the class, the list was closed 44 times and the own-question box 12 times, against 271 selection questions asked.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students start to ask and then give up?
- **Researcher:** How often does hesitation occur before a question, and in which situations?

## Raw data sample {#raw}

One event from the sample.

`events`:

<<< @/../.vitepress/data/sample/snippets/question-picker-abandoned.json

### Closed the question list without asking (dashboard) {#metric-picker-abandoned}

Count of these events in the period, split by where the picker was closed: the list (preset) or the own-question box (free_text).

<FormulaVersion ids="metric.picker_abandoned" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `picker_abandoned_rate` = closed pickers ÷ (closed pickers + selection questions) per student.
- **Example analysis:** Correlate the rate with the TAM score for perceived usefulness (Spearman).

**Research questions**

<RqList ids="event.question_picker_abandoned" />

**Example sentence (Method):** "Opened but unused question pickers were logged as an indicator of hesitation before help-seeking."

## What this data does not show {#limits}

The event shows that the picker was closed, not why. The student may have found the answer, changed the selection or clicked by mistake. The event is only saved while a session exists.

## For the teacher {#teacher}

::: tip In class
If many pickers are closed without a question, show that the four ready questions are safe to try and that no question is "too simple".
:::
