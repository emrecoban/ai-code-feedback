---
title: Opened again later
items:
  - event.explanation_reopened
  - metric.reopened
sample:
  - views/reopened.json#facts.featured = 1
  - views/reopened.json#facts.reopened = 60
  - views/reopened.json#facts.explanations = 928
---

# Opened again later

## What is a reopened explanation? {#what}

The progress panel of the extension lists the last ten questions. A click on a card shows the stored explanation again, and the event records this.

## Example with one student {#example}

S07 reopened 1 explanation from the history list. In the class, 60 of 928 explanations were opened again later.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="reopened" /></ClientOnly>
<template #takeaway>Most explanations are reopened four to seven days later, around the next lab.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Which explanations are worth coming back to?
- **Researcher:** Do students use past feedback for review?

## Raw data sample {#raw}

One event from the sample. It has no payload.

`events`:

<<< @/../.vitepress/data/sample/snippets/reopened.json

### Opened again later (dashboard) {#metric-reopened}

Distinct questions of the period with at least one reopening, whenever it happened.

<FormulaVersion ids="metric.reopened" />

## Use in research {#research}

- **Stage:** during the intervention and after it (review)
- **One value per student for SPSS:** `reopen_count` per student.
- **Example analysis:** Correlate the number of reopenings in the last week with the post-test score (Spearman).

**Research questions**

<RqList ids="metric.reopened" />

**Example sentence (Method):** "Reopening a past explanation from the history list was logged as a review action."

## What this data does not show {#limits}

Only the last ten questions appear in the list, so older explanations cannot be reopened there. A click can be curiosity rather than study. The event says nothing about how long the student read.

## For the teacher {#teacher}

::: tip In class
Before a test, remind students that their past explanations are in the progress panel and can be read again.
:::
