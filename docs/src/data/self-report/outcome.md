---
title: Outcome
items:
  - interactions.self_reported_outcome
sample:
  - views/outcome.json#facts.featuredSolved = 21
  - views/outcome.json#facts.featuredStuck = 2
  - views/outcome.json#facts.answeredPct = 44.8
---

# Outcome

## What is the self-reported outcome? {#what}

Under each explanation the student can answer "How did it go?" with one click: Solved it, or Still stuck. It is the student's own view of the result, next to the behaviour the system measures.

## Example with one student {#example}

S07 answered "Solved it" 21 times and "Still stuck" 2 times. In the class, 44.8% of the questions got an answer.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="outcome" /></ClientOnly>
<template #takeaway>Questions that reached the fix have the highest share of "Still stuck".</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Which students say they are still stuck after an explanation?
- **Researcher:** Do the behavioural signals, such as the error going away, agree with what students report?

## Raw data sample {#raw}

Two answered questions of S07.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/outcome.json

## Use in research {#research}

- **Stage:** during the intervention and in the analysis (validation)
- **One value per student for SPSS:** `solved_share` = solved ÷ answered, per student. Missing: −97 when there was no answer.
- **Example analysis:** Cross-tabulate the answer with "Error gone after explaining" for error questions and report the agreement (Cohen's kappa).

**Research questions**

<RqList ids="interactions.self_reported_outcome" />

**Example sentence (Method):** "Self-reported outcomes were compared with the disappearance of the diagnostic to validate the behavioural indicator."

## What this data does not show {#limits}

Students answer at different moments, some right away and some later, and the time of the answer is not stored. The answer can be changed from the history list. Students who are stuck may leave without answering.

## For the teacher {#teacher}

::: tip In class
"Still stuck" is a direct request for help. The dashboard lists these students under "Needs attention", so check it during the lab.
:::
