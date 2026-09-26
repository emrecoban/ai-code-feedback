---
title: Copied from the explanation
items:
  - event.explanation_copied
  - event.explanation_copied.level
  - metric.copied
sample:
  - views/copied.json#facts.featured = 5
  - views/copied.json#facts.copyEvents = 60
  - views/copied.json#facts.fromFix = 23
---

# Copied from the explanation

## What is a copy from the explanation? {#what}

The event is recorded each time the student copies text from the explanation panel. It stores the step the selection started in (L0 to L3), but never the copied text.

## Example with one student {#example}

S07 copied from 5 explanations. In the class, 60 copies were recorded, and 23 of them came from the fix (L3).

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="copied" /></ClientOnly>
<template #takeaway>Students copy most often from the fix (L3). Some copies start outside a step and have no level.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students take code from the explanations into their programs?
- **Researcher:** How often is the answer taken directly, which the edit similarity may miss?

## Raw data sample {#raw}

One copy from the fix.

`events`:

<<< @/../.vitepress/data/sample/snippets/copied.json

### Copied from it (dashboard) {#metric-copied}

Distinct questions of the period with a copy event. The dashboard also counts the copies by level.

<FormulaVersion ids="metric.copied" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `copies_fix` = copies from L3 per student, and `copy_share` = questions with a copy ÷ questions.
- **Example analysis:** Compare the learning gain of students who copy often from L3 with the others (Mann–Whitney U).

**Research questions**

<RqList ids="metric.copied" />

**Example sentence (Method):** "Copy actions within the feedback panel were logged with the hint level they came from, without the copied content."

## What this data does not show {#limits}

A copy is not always a paste into the code: students also copy to take notes or to search. The level is the one where the selection starts, so a selection across several steps gets only the first.

## For the teacher {#teacher}

::: tip In class
Copying the fix is not a problem in itself. Ask students to close the panel and change the code from memory, then compare.
:::
