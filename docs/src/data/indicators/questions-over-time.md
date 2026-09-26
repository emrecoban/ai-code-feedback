---
title: Questions over time
items:
  - metric.questions
  - metric.questions_total
sample:
  - views/questions-over-time.json#facts.featured = 37
  - views/questions-over-time.json#facts.featuredWeek1 = 6
  - views/questions-over-time.json#facts.featuredWeek8 = 2
  - views/questions-over-time.json#facts.total = 928
  - views/questions-over-time.json#facts.week1 = 130
  - views/questions-over-time.json#facts.week8 = 85
---

# Questions over time

## What is the number of questions? {#what}

Each help request that received an answer is one question, that is, one row in the `interactions` table. The dashboard counts them per period and compares the count with the previous period of the same length.

## Example with one student {#example}

S07 asked 37 questions in eight weeks: 6 in week 1 and 2 in week 8. The class asked 928 questions, 130 in week 1 and 85 in week 8.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="questions-over-time" /></ClientOnly>
<template #takeaway>The class asks most in week 3 and less in each week after it.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Is the class asking more or less than before?
- **Researcher:** How does help-seeking change over the weeks?

## Raw data sample {#raw}

Two days of the class series in the dashboard.

Part of the JSON that `dashboard_overview` returns:

<<< @/../.vitepress/data/sample/snippets/questions-over-time.json

### Questions (dashboard) {#metric-questions}

Questions created in the period. The previous period has the same length and ends where this one starts.

<FormulaVersion ids="metric.questions" />

### All-time questions (dashboard) {#metric-questions-total}

All questions of the student, whatever the period.

<FormulaVersion ids="metric.questions_total" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `questions` per student, and `questions_per_hour` = questions ÷ active hours.
- **Example analysis:** Model the weekly count per student with a mixed Poisson regression, with week as predictor.

**Research questions**

<RqList ids="metric.questions" />

**Example sentence (Method):** "Help-seeking was measured as the number of help requests per student and week."

## What this data does not show {#limits}

Failed requests do not create a question. Fewer questions can mean more independence, harder tasks that students give up on, or simply fewer errors. The tasks change every week, so weeks are not fully comparable.

## For the teacher {#teacher}

::: tip In class
A sudden rise in one week often points to a new topic. Plan a short explanation at the start of the next lab.
:::
