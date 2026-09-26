---
title: AI learning summary
items:
  - learner_profiles.student_summary
sample:
  - views/ai-learning-summary.json#facts.writtenDay = 2030-04-16
  - views/ai-learning-summary.json#facts.withSummary = 25
---

# AI learning summary

## What is the AI learning summary? {#what}

The AI learning summary is a short text of three to five sentences that the AI model writes for the student. It is based on the last 30 questions. It is written in the feedback language and shown in the sidebar and in the dashboard.

## Example with one student {#example}

The last summary of S07 was written on 2030-04-16 in English. The text is shown in the next section. In the sample, 25 of 25 students had a summary at the end of the course.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="ai-learning-summary" /></ClientOnly>
<template #takeaway>The summary speaks to the student and ends with one thing worth going back over. The sample text is a synthetic example in English.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** What does the tool tell each student about their own work?
- **Researcher:** What reflective feedback did students receive, beside the hints?

## Raw data sample {#raw}

The summary of S07 at the end of the sample.

`learner_profiles` (some columns):

<<< @/../.vitepress/data/sample/snippets/ai-learning-summary.json

### How it is written {#learner-profiles-student-summary}

The model gets the last 30 questions with their titles and outcomes and a few counts about the student. It must write three to five sentences to the student, at most 700 characters. It must describe what happened, never judge the student's ability, and it may end with one sentence that starts with "Worth going back over:". It is rewritten together with the private notes.

<FormulaVersion ids="learner_profiles.student_summary" />

## Use in research {#research}

- **Stage:** after the intervention (qualitative)
- **One value per student for SPSS:** None. It is text. Code it first if you need a variable, for example the topic named in the last sentence.
- **Example analysis:** Qualitative content analysis of the final summaries: which topics does the model name, and do they match the pre-test and post-test items the student got wrong?

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "The AI-generated learning summaries shown to students were analysed qualitatively for the topics they recommended for review."

## What this data does not show {#limits}

The text is written by an AI model and can be wrong. Only the last version is stored, so earlier summaries are lost. The summary says what the model saw in the questions, not what the student learned.

## For the teacher {#teacher}

::: tip In class
Read the summaries of a few students before a one-to-one talk. Check the claims against the questions in the dashboard before you repeat them.
:::
