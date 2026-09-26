---
title: Suggested practice
items:
  - learner_profiles.suggested_practice
sample:
  - views/suggested-practice.json#facts.writtenDay = 2030-04-16
---

# Suggested practice

## What is the suggested practice? {#what}

The suggested practice is a short exercise of two or three sentences. The model writes it together with the AI learning summary, on the error or topic that repeats most in the student's questions.

## Example with one student {#example}

The practice for S07 was written on 2030-04-16 and is about lists, one of the two topics S07 asked about most often. The text is shown in the next section.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="suggested-practice" /></ClientOnly>
<template #takeaway>The practice is short and names one topic. It ends with a small prediction task.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** What extra practice does the tool suggest to each student?
- **Researcher:** Does the suggested topic match the student's weak points in the tests?

## Raw data sample {#raw}

The practice of S07 at the end of the sample.

`learner_profiles` (some columns):

<<< @/../.vitepress/data/sample/snippets/suggested-practice.json

### How it is written {#learner-profiles-suggested-practice}

One short practice problem of two or three sentences, at most 400 characters, on the error or topic that repeats most. When nothing repeats, the model uses the latest question.

<FormulaVersion ids="learner_profiles.suggested_practice" />

## Use in research {#research}

- **Stage:** after the intervention (qualitative)
- **One value per student for SPSS:** None. It is text. Code the topic if you need a variable.
- **Example analysis:** Code the topic of each final practice and compare it with the test items the student got wrong.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "The topics of the AI-suggested practice tasks were coded and compared with the students' post-test errors."

## What this data does not show {#limits}

The extension does not record whether the student did the practice. Only the last version is stored. The text is written by an AI model and can be too easy, too hard or off topic.

## For the teacher {#teacher}

::: tip In class
You can use the suggested practices of the class as a source of short warm-up tasks for the next lab.
:::
