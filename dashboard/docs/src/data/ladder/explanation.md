---
title: The explanation
items:
  - interactions.title
  - interactions.ladder_payload
sample:
  - views/explanation.json#facts.title = Undefined variable total
  - views/explanation.json#facts.degraded = 10
---

# The explanation

## What is stored about the explanation? {#what}

For every question the system stores the full answer of the AI model: a short title, the concept, the four steps and two flags (confidence and "needs more context"). The student can read it again from the history list.

## Example with one student {#example}

S07's question got the title "Undefined variable total". The answer below is the synthetic text used for every row of the sample. In real data every answer is different and written in the feedback language.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="explanation" /></ClientOnly>
<template #takeaway>The four steps go from understanding the message to the concrete change.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** What exactly did the student read?
- **Researcher:** What was the quality and content of the feedback the student received?

## Raw data sample {#raw}

The title, the concept and the stored answer of the question above.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/explanation.json

## Use in research {#research}

- **Stage:** in the analysis (quality of the feedback)
- **One value per student for SPSS:** The text itself does not go into SPSS. Rate a random sample of answers with a rubric, and add the rubric scores per question.
- **Example analysis:** Check the accuracy of the answers with two raters and report the agreement (Cohen's kappa).

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "A random sample of the generated explanations was rated for accuracy and adherence to the four-step format by two researchers."

## What this data does not show {#limits}

The text can quote parts of the student's code. When two hard checks fail twice (wrong language, or private notes leaked), L2 and L3 are stored empty (10 answers in the sample). Answers from the cache were written for another student's identical question.

## For the teacher {#teacher}

::: tip In class
When a student says an explanation was confusing, open the question in the dashboard and read the four steps together. It is a quick way to see where the misunderstanding started.
:::
