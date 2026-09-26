---
title: Breaks
items:
  - coding_sessions.idle_gap_count
  - metric.breaks_avg
sample:
  - views/breaks.json#facts.featuredAvg = 1.7
  - views/breaks.json#facts.classAvg = 1.9
  - views/breaks.json#facts.sessions = 306
---

# Breaks

## What is a break? {#what}

A break is a pause of more than two minutes without any activity in VS Code. It is the same rule that decides what counts as active coding time.

## Example with one student {#example}

S07 had 1.7 breaks per session on average, the class 1.9. A break can be a talk with the teacher, a look at the task sheet or a longer time spent reading an explanation.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="breaks" /></ClientOnly>
<template #takeaway>Most of the 306 sessions have between zero and three breaks. The group with two breaks per session is the largest.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students get stuck and stop for long periods?
- **Researcher:** How continuous is the work within a session?

## Raw data sample {#raw}

Two sessions of S07.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/breaks.json

### How breaks are counted {#coding-sessions-idle-gap-count}

Adds 1 when the gap between two heartbeats (edit, cursor move, change of file or save) is longer than two minutes.

<FormulaVersion ids="coding_sessions.idle_gap_count" />

### Breaks per session (average, dashboard) {#metric-breaks-avg}

Mean number of breaks over the sessions of the period.

<FormulaVersion ids="metric.breaks_avg" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** `breaks_per_hour` = breaks ÷ active hours, per student.
- **Example analysis:** Describe it, and relate it to the number of "Still stuck" answers (Spearman).

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "Pauses of more than two minutes without editor activity were counted as breaks."

## What this data does not show {#limits}

A break does not mean the student stopped thinking about the task: reading, planning on paper and listening to the teacher all look the same. Time away from VS Code is not a heartbeat, so a visit to the browser can also end as a break.

## For the teacher {#teacher}

::: tip In class
Many breaks in one lab can show a task that needs more explanation at the start. Compare the breaks of the class across labs.
:::
