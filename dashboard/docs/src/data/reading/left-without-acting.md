---
title: Left without acting
items:
  - event.feedback_abandoned
  - event.feedback_abandoned.level
  - event.feedback_abandoned.reason
  - metric.abandoned
sample:
  - views/left-without-acting.json#facts.featuredAbandoned = 3
  - views/left-without-acting.json#facts.abandonedPct = 12.2
---

# Left without acting

## What does "left without acting" mean? {#what}

The event is recorded when a student does nothing in the editor for 10 minutes after an explanation or a step appeared, or when VS Code closes first. It is the opposite of "Went back to the code".

## Example with one student {#example}

S07 left without acting after 3 explanations. In each case ten minutes passed without any activity in the editor.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="left-without-acting" /></ClientOnly>
<template #takeaway>In the class, 12.2% of the explanations were left without acting, mostly after 10 minutes without activity.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** After which explanations did students stop working?
- **Researcher:** How often is feedback read and then dropped, and does this relate to the hint depth or the rating?

## Raw data sample {#raw}

One event from the sample.

`events`:

<<< @/../.vitepress/data/sample/snippets/left-without-acting.json

### Left without acting (dashboard) {#metric-abandoned}

Distinct questions of the period with at least one such event.

<FormulaVersion ids="metric.abandoned" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `abandon_share` = questions left without acting ÷ all questions, per student.
- **Example analysis:** Compare the rate between rated-helpful and rated-unhelpful explanations (chi-square test).

**Research questions**

<RqList ids="metric.abandoned" />

**Example sentence (Method):** "Explanations followed by ten minutes without editor activity, or by the end of the session, were coded as abandoned."

## What this data does not show {#limits}

A student can read the explanation and think about it for more than ten minutes, or work on paper. "VS Code closed" is sent during shutdown and is often lost. The event says nothing about why the student stopped.

## For the teacher {#teacher}

::: tip In class
Look at the questions that were left without acting near the end of the lab. They can show a task that students gave up on.
:::
