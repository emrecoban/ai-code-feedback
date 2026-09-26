---
title: Undid the change
items:
  - event.fix_undone
  - metric.after_undone
sample:
  - views/fix-undone.json#facts.featuredUndone = 1
  - views/fix-undone.json#facts.undone = 15
  - views/fix-undone.json#facts.edited = 194
---

# Undid the change

## What is an undone change? {#what}

The event is recorded when the student uses Undo in the same file within two minutes after the first edit after the fix. It is a sign that the change did not work or was not understood.

## Example with one student {#example}

S07 undid a change after a fix 1 time in the eight weeks. In the whole class, 15 of the 194 edits after a fix were undone within two minutes.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="fix-undone" /></ClientOnly>
<template #takeaway>Undoing a fix is rare. A small table is enough to show it.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Did a fix fail for some students?
- **Researcher:** How often does acting on the fix end in a quick reversal?

## Raw data sample {#raw}

One event from the sample. It has no payload.

`events`:

<<< @/../.vitepress/data/sample/snippets/fix-undone.json

### Undid the change (dashboard) {#metric-after-undone}

Distinct questions of the period with this event.

<FormulaVersion ids="metric.after_undone" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** `undo_count` per student. The numbers are small, so use them descriptively.
- **Example analysis:** Report the rate of undone fixes next to the self-reported outcome of the same questions.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "An undo in the same file within two minutes after the first post-feedback edit was logged as a reversal of the applied fix."

## What this data does not show {#limits}

An undo can also remove a typo that was made while typing the fix. Only the first edit after the fix is watched. The event is rare, so it cannot carry an analysis alone.

## For the teacher {#teacher}

::: tip In class
When several students undo the same fix, the suggested change may not fit the task. Check the explanation in the dashboard.
:::
