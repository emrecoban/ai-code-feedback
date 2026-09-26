---
title: Concept
items:
  - interactions.concept
  - interactions.recurring_concept_count
  - metric.concepts_top_student
sample:
  - views/recurring-concept.json#facts.featuredTop = lists
  - views/recurring-concept.json#facts.featuredTopCount = 5
  - views/recurring-concept.json#facts.maxRecurring = 4
  - views/recurring-concept.json#facts.typeConversionEn = 22
  - views/recurring-concept.json#facts.typeConversionTr = 92
  - views/recurring-concept.json#facts.typeConversionEs = 13
---

# Concept

## What is the concept of a question? {#what}

The concept is a short name for the general programming idea behind a question, for example "variable scope". The AI model writes it with every answer, in the feedback language. The server also counts how many earlier questions of the student had the same concept.

## Example with one student {#example}

The most frequent concept of S07 was "lists" with 5 questions. The highest repeat count of a concept for S07 was 4. In the class, one idea appeared under three names, one per language: "type conversion" 22 times, "tür dönüşümü" 92 times and "conversión de tipos" 13 times.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="recurring-concept" /></ClientOnly>
<template #takeaway>"lists" leads the concepts of S07. The labels come from the model, in the language of the student.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Which ideas does each student struggle with, beyond single error messages?
- **Researcher:** Do misconceptions recur across different-looking errors?

## Raw data sample {#raw}

A question of S07 whose concept had come up before.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/recurring-concept.json

### How concept repeats are counted {#interactions-recurring-concept-count}

Number of earlier questions of the same student whose concept matches this one, ignoring upper and lower case. Counted when the question is stored.

<FormulaVersion ids="interactions.recurring_concept_count" />

### Recurring concepts (dashboard) {#metric-concepts-top-student}

The five most frequent concepts of a student in the period, grouped by lower-case, trimmed text.

<FormulaVersion ids="metric.concepts_top_student" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** Map the concepts to a fixed list of topics in all three languages first. Then compute `n_topic_<name>` per student.
- **Example analysis:** Describe the topics per week, and compare the number of topics with repeats between students with high and low gain.

**Research questions**

<RqList ids="interactions.concept,interactions.recurring_concept_count" />

**Example sentence (Method):** "The concepts assigned by the model were mapped to a common topic list across the three feedback languages before analysis."

## What this data does not show {#limits}

The concept is written by the model and is not checked against a fixed list. The same idea can get different names, also in different languages, and the dashboard counts them separately. Treat the concept as a hint for coding, not as a measured category.

## For the teacher {#teacher}

::: tip In class
Look at the recurring concepts of a student before a one-to-one talk. Pick one concept and give a small, focused exercise on it.
:::
