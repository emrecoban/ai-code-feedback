---
title: Could do it alone
items:
  - interactions.post_confidence
  - metric.calibration
sample:
  - views/confidence.json#facts.featuredYes = 1
  - views/confidence.json#facts.featuredMaybe = 9
  - views/confidence.json#facts.featuredNo = 4
  - views/confidence.json#facts.yesAgainPct = 51.7
  - views/confidence.json#facts.noAgainPct = 80.6
---

# Could do it alone

## What is the confidence answer? {#what}

Under each explanation the student can answer "Could you do this one yourself now?" with Yes, Maybe or Not yet. The dashboard checks later whether the same error or concept came back.

## Example with one student {#example}

S07 answered Yes 1 time, Maybe 9 times and Not yet 4 times. In the class, students who said Yes came back later with the same error or concept in 51.7% of the cases, and students who said No in 80.6%.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="confidence" /></ClientOnly>
<template #takeaway>The less confident the answer, the more often the same error or concept came back. The answers carry some real information.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students feel able to solve similar problems alone after an explanation?
- **Researcher:** Is the students' confidence calibrated, that is, does it predict whether the problem comes back?

## Raw data sample {#raw}

Two answered questions of S07.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/confidence.json

### Does confidence hold up? (dashboard) {#metric-calibration}

For each answer (Yes, Maybe, No) on the questions of the period: the number of answers, and how many of them were followed later, at any time, by a question of the same student with the same normalized error or the same concept.

<FormulaVersion ids="metric.calibration" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `conf_yes_share` = Yes ÷ answers per student, and a calibration variable = share of Yes answers not followed by a repeat.
- **Example analysis:** Test whether the answer predicts a later repeat with a mixed logistic regression (student as random effect).

**Research questions**

<RqList ids="interactions.post_confidence,metric.calibration" />

**Example sentence (Method):** "Calibration was assessed as the proportion of confident answers that were not followed by a later request about the same error or concept."

## What this data does not show {#limits}

The check has no time limit, so answers from early weeks have more time for a repeat than late ones. A repeat is only visible when the student asks again, not when they meet the error and fix it alone. Concepts written differently are not matched.

## For the teacher {#teacher}

::: tip In class
When a student often answers "Not yet", give one short practice task on the same idea and ask them to try it without the extension.
:::
