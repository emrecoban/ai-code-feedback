---
title: Error type
items:
  - interactions.error_signature
  - interactions.error_source
  - interactions.error_code
  - interactions.error_severity
  - metric.severity_mix
sample:
  - views/error-type.json#facts.featuredMessage = "total" is not defined
  - views/error-type.json#facts.featuredCode = reportUndefinedVariable
  - views/error-type.json#facts.featuredSeverity = error
  - views/error-type.json#facts.top = Pylance
  - views/error-type.json#facts.topQuestions = 203
  - views/error-type.json#facts.errors = 568
  - views/error-type.json#facts.warnings = 89
---

# Error type

## What is the error type? {#what}

For an error question, the system stores the error message as the editor showed it, the tool that reported it (for example Pylance), its rule code and its severity (error or warning). Selection questions have no error type.

## Example with one student {#example}

S07's first error question was about the message `"total" is not defined`. Pylance reported it with the code `reportUndefinedVariable` and the severity "Error". The rule code is a precise category, while the message changes with every variable name.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="error-type" /></ClientOnly>
<template #takeaway>The largest bar, "Pylance", holds 203 questions: syntax errors without a rule code, which the dashboard groups together.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Which errors do my students need help with most?
- **Researcher:** Which classes of error lead students to ask, and which of them need the full fix?

## Raw data sample {#raw}

An error question of S07 with its classification.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/error-type.json

### Error questions by severity (dashboard) {#metric-severity-mix}

Error questions of the period grouped by severity. In the sample: 568 errors and 89 warnings.

<FormulaVersion ids="metric.severity_mix" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** Counts per error category and student, for example `n_err_undefined`. Build the categories from the rule code, and from the message when there is no code.
- **Example analysis:** Describe the ten most frequent categories, and compare the share of questions that reached the fix between categories.

**Research questions**

<RqList ids="interactions.error_code,metric.severity_mix" />

**Example sentence (Method):** "Errors were classified by the rule code of the language server (Pylance), and by the normalized message for errors without a code."

## What this data does not show {#limits}

The dashboard groups errors by "tool + code", and an error without a code falls under the tool name alone. So all syntax errors appear as one row called "Pylance". The message can contain names and values from the student's code. Only the first diagnostic of a request is stored.

## For the teacher {#teacher}

::: tip In class
If one error type dominates a week, show it once at the start of the next lab and let students predict what the message means before you explain it.
:::
