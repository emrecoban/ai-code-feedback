---
title: Hint was enough
items:
  - metric.hint_enough_pct
sample:
  - views/hint-was-enough.json#facts.featuredQuestions = 37
  - views/hint-was-enough.json#facts.featuredSolvedAlone = 22
  - views/hint-was-enough.json#facts.featuredPct = 59.5
  - views/hint-was-enough.json#facts.classPct = 57.1
---

# Hint was enough

## What does "hint was enough" mean? {#what}

It is the share of questions in which the student did not open the rule (L2) or the fix (L3). The first hint, which shows the error in plain words and where it is (L0–L1), was enough to go on.

## Example with one student {#example}

S07 asked 37 questions and stopped after the first hint in 22 of them, which is 59.5%. The class value was 57.1%. The weekly version of this rate is on the page [Independence trend](./independence-trend#hint-enough).

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="hint-was-enough" /></ClientOnly>
<template #takeaway>Most students stopped after the first hint in more than 40% of their questions. S07 is in the 40–60% group.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** How often is a small hint enough for my students?
- **Researcher:** How much support do students need per question, as one measure of independence?

## Raw data sample {#raw}

The value comes from the hint depth of each question. The row of S07 in the student list of the dashboard:

Part of the JSON that `dashboard_students` returns:

<<< @/../.vitepress/data/sample/snippets/hint-was-enough.json

### Hint was enough (dashboard) {#metric-hint-enough-pct}

Questions of the period that ended at L0–L1 (hint depth 0 or 1) divided by all questions of the period. For one student the dashboard uses the same rule on that student's questions.

<FormulaVersion ids="metric.hint_enough_pct" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `hint_enough_pct` per student over the whole study, and per week for trend analyses.
- **Example analysis:** Compare the early and late weeks with a paired t-test, and correlate the overall value with the learning gain.

**Research questions**

<RqList ids="metric.hint_enough_pct" />

**Example sentence (Method):** "The proportion of help requests that ended after the first hint level was used as an indicator of independence."

## What this data does not show {#limits}

A student who stopped after the first hint may have given up, asked a classmate or solved the problem. The rate says nothing about errors fixed without asking. The level L1 is never stored alone, so L0 and L1 always appear together.

## For the teacher {#teacher}

::: tip In class
Read this rate together with "Error gone after explaining". A high rate with errors that go away is a good sign. A high rate with errors that stay can mean students give up early.
:::
