---
title: Concepts and errors
items:
  - metric.concepts_top_class
  - metric.errors_top_class
sample:
  - views/concepts-and-errors.json#facts.top = tür dönüşümü
  - views/concepts-and-errors.json#facts.topQuestions = 92
  - views/concepts-and-errors.json#facts.topStudents = 17
  - views/concepts-and-errors.json#facts.trStudents = 20
  - views/concepts-and-errors.json#facts.topError = Pylance
  - views/concepts-and-errors.json#facts.topErrorQuestions = 203
  - views/concepts-and-errors.json#facts.topErrorStudents = 24
---

# Concepts and errors

## What are the top concepts and errors? {#what}

Two lists in the dashboard. The first counts the programming concepts that the model named in its answers. The second counts the errors students asked about. For each row the dashboard shows the questions, the students and the questions that reached the fix.

## Example with one student {#example}

The top concept in the sample is "tür dönüşümü" (type conversion), with 92 questions from 17 students. It appears in Turkish because the concept is written in the feedback language, and 20 of 25 students use Turkish. The top error row is "Pylance" with 203 questions from 24 students. This row mixes many different syntax errors (see below).

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="concepts-and-errors" /></ClientOnly>
<template #takeaway>The chart shows the concepts. The same concept can appear in up to three rows, one per feedback language.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Which topics and errors should I explain again in class?
- **Researcher:** Which concepts cause the most help requests in the course?

## Raw data sample {#raw}

The first two rows of the concept list.

Part of the JSON that `dashboard_insights` returns:

<<< @/../.vitepress/data/sample/snippets/concepts-and-errors.json

### Concepts students ask about most (dashboard) {#metric-concepts-top-class}

The 12 most frequent concepts of the period. Upper and lower case are treated as the same.

<FormulaVersion ids="metric.concepts_top_class" />

### Most common errors (dashboard) {#metric-errors-top-class}

The 12 most frequent errors of the period. An error is grouped by its source and rule code (for example `Pylance reportUndefinedVariable`). When the code is missing, the SQL keeps only the source, so all syntax errors of Pylance end up in one row called "Pylance".

<FormulaVersion ids="metric.errors_top_class" />

## Use in research {#research}

- **Stage:** after the intervention (course design)
- **One value per student for SPSS:** None. Recode the concepts into one list of topics in one language first, then count questions per topic and student.
- **Example analysis:** Relate the topics with the most questions to the test items with the lowest post-test scores.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "The concepts named in the feedback were recoded into a common topic list across the three feedback languages."

## What this data does not show {#limits}

The concept is chosen by the model, so the same idea can have several names. The "Pylance" row of the error list mixes different syntax errors and should not be read as one error. The lists show the frequency of questions, not the frequency of errors in the code.

## For the teacher {#teacher}

::: tip In class
Use the concept list to choose the topic of a short review at the start of the next lab. Open the detail of a student to see the actual error messages.
:::
