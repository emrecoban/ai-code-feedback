---
title: Asked about the same error again
items:
  - interactions.error_signature_normalized
  - interactions.recurring_error_count
  - metric.repeat_errors
sample:
  - views/repeated-error.json#facts.pairWeek1 = 1
  - views/repeated-error.json#facts.pairMessage = "total" is not defined
  - views/repeated-error.json#facts.pairWeek2 = 2
  - views/repeated-error.json#facts.pairNormalized = "x" is not defined
  - views/repeated-error.json#facts.featuredRepeats = 10
  - views/repeated-error.json#facts.featuredQuestions = 37
---

# Asked about the same error again

## What is a repeated error? {#what}

For each error question, the server counts how many earlier questions of the same student had the same error. "The same" means the same normalized message: numbers and quoted names are replaced, so errors that differ only in a line number or a variable name match.

## Example with one student {#example}

In week 1, S07 asked about `"total" is not defined`. In week 2, the same kind of message came back, and the server stored 1 as the number of earlier questions. Both messages become `"x" is not defined` after normalization. In total, 10 of S07's 37 questions repeated an earlier error.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="repeated-error" /></ClientOnly>
<template #takeaway>In the class, the share of repeated errors rises in the first weeks and then stays near one half. The line of S07 jumps, because S07 asked few error questions per week.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Which students keep meeting the same error?
- **Researcher:** Does an explanation lead to lasting understanding, or does the same error come back?

## Raw data sample {#raw}

Two questions of S07 with the same normalized message.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/repeated-error.json

### How the message is normalized {#interactions-error-signature-normalized}

Every run of digits becomes #, every quoted text becomes "X", and the result is trimmed and written in lower case. The same function builds the cache key of the explanations.

<FormulaVersion ids="interactions.error_signature_normalized" />

### How repeats are counted {#interactions-recurring-error-count}

Number of earlier questions of the same student with the same normalized message, counted when the question is stored. 0 means "first time". Selection questions always have 0.

<FormulaVersion ids="interactions.recurring_error_count" />

### Asked about the same error again (dashboard) {#metric-repeat-errors}

Questions of the period with a repeat count above 0.

<FormulaVersion ids="metric.repeat_errors" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `repeat_share` = repeated error questions ÷ error questions, per student.
- **Example analysis:** Correlate the repeat share with the learning gain from pre-test to post-test (Spearman).

**Research questions**

<RqList ids="interactions.recurring_error_count,metric.repeat_errors" />

**Example sentence (Method):** "An error was counted as repeated when the same student had asked about the same normalized error message before."

## What this data does not show {#limits}

Normalization can also join different errors: every "name is not defined" becomes one error, whatever the name. The count only sees questions, not errors the student met without asking. It grows with time by construction, so compare periods of the same length.

## For the teacher {#teacher}

::: tip In class
If one student asks about the same error again and again, sit with them for two minutes and let them explain the rule of that error back to you.
:::
