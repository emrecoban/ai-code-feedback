---
title: Error gone after explaining
items:
  - event.diagnostic_resolved
  - event.diagnostic_resolved.msToResolution
  - event.diagnostic_resolved.msPresent
  - event.diagnostic_resolved.editsWhilePresent
  - metric.error_gone_pct
  - metric.error_gone_by_level
sample:
  - views/error-gone.json#facts.featuredQuestions = 22
  - views/error-gone.json#facts.featuredResolved = 19
  - views/error-gone.json#facts.classPct = 72.9
  - views/error-gone.json#facts.classMedianSec = 86
---

# Error gone after explaining

## What does "error gone after explaining" mean? {#what}

After a student asks about an error, the extension watches that error in the open file. When it disappears, an event stores how long this took from the question. It is the most direct sign that the explanation was followed by a fix.

## Example with one student {#example}

S07 asked about 22 errors, and 19 of them later went away. In the class the share was 72.9%, with a median time of 86 seconds from the question to the moment the error disappeared.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="error-gone" /></ClientOnly>
<template #takeaway>The error went away in about three of four questions at every hint depth. S07 is above the class.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Did the explanations help students get rid of their errors?
- **Researcher:** Is a deeper hint level related to a higher or faster resolution of the error?

## Raw data sample {#raw}

One event of S07.

`events`:

<<< @/../.vitepress/data/sample/snippets/error-gone.json

### How the time is measured {#event-diagnostic-resolved-mstoresolution}

Time from the click on the help link to the moment the error was no longer in the file, in milliseconds. An error is identified by file, line and message.

<FormulaVersion ids="event.diagnostic_resolved.msToResolution" />

### Time the error was present {#event-diagnostic-resolved-mspresent}

Time from the first display of the help offer to the disappearance. Missing when there was no visible offer.

<FormulaVersion ids="event.diagnostic_resolved.msPresent" />

### Edits while the error was present {#event-diagnostic-resolved-editswhilepresent}

Edit events in the file between the offer and the disappearance. Missing when there was no visible offer.

<FormulaVersion ids="event.diagnostic_resolved.editsWhilePresent" />

### Error gone after explaining (dashboard) {#metric-error-gone-pct}

Error questions of the period with at least one such event, divided by all error questions of the period. The median time uses the first event of each question.

<FormulaVersion ids="metric.error_gone_pct" />

### Did the error go away? By hint depth (dashboard) {#metric-error-gone-by-level}

The same share and median time, split into questions that ended at L0–L1, at L2 and at L3.

<FormulaVersion ids="metric.error_gone_by_level" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis (proximal outcome)
- **One value per student for SPSS:** `resolved_share` = error questions with the event ÷ error questions, and `median_resolution_s`, per student.
- **Example analysis:** Model resolution per question with a mixed logistic regression, with hint depth as predictor and student as random effect.

**Research questions**

<RqList ids="metric.error_gone_pct,event.diagnostic_resolved.msToResolution" />

**Example sentence (Method):** "An error was considered resolved when the diagnostic the student had asked about disappeared from the open file."

## What this data does not show {#limits}

An error is identified by file, line and message, so an edit that moves the error to another line looks like a resolution. An error can also disappear because code was deleted, not fixed. Errors in closed files are not watched.

## For the teacher {#teacher}

::: tip In class
If many errors stay after the explanation for one task, go through that error with the class. If they go away quickly, the explanations are doing their job for that topic.
:::
