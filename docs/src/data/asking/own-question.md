---
title: Student's own words
items:
  - interactions.free_text
sample:
  - views/own-question.json#facts.exampleStudent = S22
  - views/own-question.json#facts.exampleText = why does this loop stop too early?
  - views/own-question.json#facts.exampleLength = 34
  - views/own-question.json#facts.freeText = 22
  - views/own-question.json#facts.selection = 271
  - views/own-question.json#facts.pctOfSelection = 8.1
---

# Student's own words

## What is the student's own question? {#what}

When a student chooses "Something else…" for selected code, the student types a question of up to 300 characters. This text is stored as it was typed. It is the only text written by students that the system keeps.

## Example with one student {#example}

S07 never wrote an own question. S22 did: the student selected a loop and wrote "why does this loop stop too early?" (34 characters). The explanation that followed answered this question in the usual four steps.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="own-question" /></ClientOnly>
<template #takeaway>Own questions are rare: 22 of 271 selection questions (8.1%).</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** What do students want to know in their own words?
- **Researcher:** Which misconceptions and question forms appear when students are free to ask?

## Raw data sample {#raw}

One own question from the sample.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/own-question.json

## Use in research {#research}

- **Stage:** in the analysis (qualitative coding)
- **One value per student for SPSS:** `n_own_questions` per student. Code the texts themselves outside SPSS, for example by question form and topic.
- **Example analysis:** Content analysis with two coders and Cohen's kappa for agreement.

**Research questions**

<RqList ids="interactions.free_text" />

**Example sentence (Method):** "The free-text questions (at most 300 characters) were coded by two researchers for question form and topic."

## What this data does not show {#limits}

The texts are short and few, so they show examples, not a representative picture. A student may write personal information into the box, so read and pseudonymize the texts before sharing them.

## For the teacher {#teacher}

::: tip In class
Read the own questions of the week before the next lab. Similar questions from several students can be a good start for a short class discussion.
:::
