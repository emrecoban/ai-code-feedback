---
title: Question type
items:
  - interactions.question_type
  - metric.analytics_question_type_resolution
sample:
  - views/question-type.json#facts.featured_what_does_this_mean = 22
  - views/question-type.json#facts.featured_what_does_this_do = 10
  - views/question-type.json#facts.featuredSidebar = 4
  - views/question-type.json#facts.featured_why_works = 2
  - views/question-type.json#facts.featured_whats_wrong = 2
  - views/question-type.json#facts.whatsWrongHintPct = 75.4
---

# Question type

## What is the question type? {#what}

The question type is the question the student asked. Every error question is "What does this mean?". For selected code the student picks one of four ready questions or writes an own question.

## Example with one student {#example}

S07 asked "What does this mean?" 22 times. For selected code, S07 stored "What does this do?" 10 times, but 4 of these came from the sidebar button, which asks this question without showing the list. S07 chose "Why does this work?" 2 times and "What's wrong here?" 2 times.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="question-type" /></ClientOnly>
<template #takeaway>The SQL report shows that "What's wrong here?" ended at the hint in 75.4% of the questions.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** What do students want to know when they select code?
- **Researcher:** Does the kind of question relate to how far the student goes into the hints?

## Raw data sample {#raw}

Two questions of S07, one about an error and one about a selection.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/question-type.json

### The SQL report {#metric-analytics-question-type-resolution}

`supabase/analytics/question_type_resolution.sql` counts the questions per type, and how many ended at the hint (L0–L1), at the rule (L2) and at the fix (L3). The table above is this report, run on the sample.

<FormulaVersion ids="metric.analytics_question_type_resolution" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** One count per type and student, for example `n_whats_wrong`, and the share of each type among the selection questions.
- **Example analysis:** Cross-tabulate question type and hint depth, and test the association with a chi-square test on selection questions only.

**Research questions**

<RqList ids="interactions.question_type" />

**Example sentence (Method):** "For selected code, students chose one of four preset questions or wrote their own question, and the chosen type was stored with each request."

## What this data does not show {#limits}

"What does this do?" is also the fixed question of the sidebar button and the command palette, so it mixes a real choice with a default. Use the starting point to separate the two. Error questions always have the same type, so the type says nothing about them.

## For the teacher {#teacher}

::: tip In class
If students rarely use "What's wrong here?", remind them that they can ask it even when the editor shows no error, for example when the output looks wrong.
:::
