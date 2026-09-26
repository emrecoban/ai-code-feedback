---
title: Edits per unaided fix
items:
  - coding_sessions.silent_resolution_edits
  - metric.edits_per_unaided_fix
sample:
  - views/edits-per-unaided-fix.json#facts.featuredEpf = 1.9
  - views/edits-per-unaided-fix.json#facts.classEpf = 1.8
  - views/edits-per-unaided-fix.json#facts.classEdits = 2214
  - views/edits-per-unaided-fix.json#facts.classFixed = 1255
---

# Edits per unaided fix

## What are the edits per unaided fix? {#what}

For every error fixed without asking, the extension adds up the edits made while the error was shown. Divided by the number of such fixes, this gives the average cost of an unaided fix.

## Example with one student {#example}

S07 needed 1.9 edits on average for an error fixed alone, and made about three edits before asking about an error. In the class the values were 1.8 and a little more than two.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="edits-per-unaided-fix" /></ClientOnly>
<template #takeaway>Unaided fixes take about two edits. Errors that end in a question have a few more edits before them.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Are the errors students fix alone the easy ones?
- **Researcher:** How does the effort of unaided fixes compare with the effort before a help request?

## Raw data sample {#raw}

Two sessions of S07 with unaided fixes.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/edits-per-unaided-fix.json

### How the edits are counted {#coding-sessions-silent-resolution-edits}

For each error fixed without asking, the edit events in its file between the first offer and the disappearance. An error without a visible offer adds 0.

<FormulaVersion ids="coding_sessions.silent_resolution_edits" />

### Edits per unaided fix (dashboard) {#metric-edits-per-unaided-fix}

Sum of the edits divided by the sum of errors fixed without asking, over the sessions of the period (2214 ÷ 1255 in the sample). The dashboard computes this in the browser.

<FormulaVersion ids="metric.edits_per_unaided_fix" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** `edits_per_unaided_fix` per student, computed from the two sums, not as a mean of session ratios.
- **Example analysis:** Compare it with the median edits before asking of the same student (paired Wilcoxon test).

**Research questions**

<RqList ids="metric.edits_per_unaided_fix" />

**Example sentence (Method):** "The effort of unaided fixes was expressed as the mean number of edits made while the resolved error was displayed."

## What this data does not show {#limits}

Errors fixed without a visible offer add a fix but no edits, which pulls the average down. Line shifts can create false fixes with zero edits. An edit event is not the same as an attempt.

## For the teacher {#teacher}

::: tip In class
Use the number only together with the questions: a student who fixes alone with few edits and asks after many edits may be asking about the right things.
:::
