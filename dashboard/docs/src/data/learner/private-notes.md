---
title: Private learner notes
items:
  - learner_profiles.summary
  - learner_profiles.summary_generated_at
  - learner_profiles.interactions_since_update
  - metric.ext_summary_progress
  - metric.summary_cadence
sample:
  - views/private-notes.json#facts.rewrites = 8
  - views/private-notes.json#facts.featuredQuestions = 37
  - views/private-notes.json#facts.cacheHits = 3
  - views/private-notes.json#facts.current = 1
---

# Private learner notes

## What are the private learner notes? {#what}

The private learner notes are a short English text about the student that the model writes for itself. They are sent with every later request for an explanation, so the model can adapt its hints. The sidebar and the dashboard do not show them.

## Example with one student {#example}

The notes of S07 were rewritten 8 times in eight weeks, together with the AI learning summary. S07 asked 37 questions, and 3 answers came from the cache and did not count toward the next rewrite. At the end, 1 new question was waiting for the next rewrite. The database keeps only the last version. The list of rewrites in the next section comes from the sample generator and shows how the rule works.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="private-notes" /></ClientOnly>
<template #takeaway>The notes of S07 were rewritten about once a week, each time after three to six new questions.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** What does the model "remember" about a student?
- **Researcher:** How is the feedback personalised, and how often does the personalisation change?

## Raw data sample {#raw}

The notes of S07 at the end of the sample.

`learner_profiles` (some columns):

<<< @/../.vitepress/data/sample/snippets/private-notes.json

### How the notes are written {#learner-profiles-summary}

Two to four short sentences in English, in the third person, for the model only. The model writes them in the same call as the AI learning summary.

<FormulaVersion ids="learner_profiles.summary" />

### When the notes are rewritten {#metric-summary-cadence}

A new version is written when 24 hours have passed since the last one and there are at least 3 new questions. After a change of the feedback language it is written at once. The model sees the last 30 questions with their titles and outcomes.

<FormulaVersion ids="metric.summary_cadence" />

### New questions since the summary {#learner-profiles-interactions-since-update}

Goes up by 1 for each answer that did not come from the cache, and goes back to 0 when the notes are rewritten.

<FormulaVersion ids="learner_profiles.interactions_since_update" />

### Summary progress bar {#metric-ext-summary-progress}

The sidebar shows the smaller of two shares: hours since the last summary ÷ 24 and new questions ÷ 3, with 1 as the maximum. At 1 the extension asks for a new summary.

<FormulaVersion ids="metric.ext_summary_progress" />

## Use in research {#research}

- **Stage:** in the analysis (to describe the personalisation)
- **One value per student for SPSS:** None. Only the last text and its time are stored, so the number of rewrites cannot be counted afterwards.
- **Example analysis:** Describe the rule in the Method section. Read a sample of final notes to check that they contain no personal data.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "Feedback was personalised with a short learner profile that the model rewrote at most once a day from the student's recent questions."

## What this data does not show {#limits}

Only the last version is stored, so the history of the notes is lost. Answers from the cache do not count toward the next rewrite. The notes are the model's view of the student and can be wrong.

## For the teacher {#teacher}

::: tip In class
Students may ask why the hints change over time. You can explain that the tool keeps short notes on their recent questions to adapt the hints.
:::
