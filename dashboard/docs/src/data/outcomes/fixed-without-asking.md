---
title: Fixed without asking
items:
  - coding_sessions.errors_resolved_without_asking
  - metric.fixed_unaided
sample:
  - views/fixed-without-asking.json#facts.featuredWeek1 = 5
  - views/fixed-without-asking.json#facts.featuredWeek8 = 15
  - views/fixed-without-asking.json#facts.featuredTotal = 52
  - views/fixed-without-asking.json#facts.workedOut = 22
---

# Fixed without asking

## What is an error fixed without asking? {#what}

It is an error or warning that disappeared from an open file although the student never asked about it. It is the only direct sign of unaided work that the extension can see.

## Example with one student {#example}

S07 fixed 5 errors without asking in week 1 and 15 in week 8, 52 in total. The student panel shows the same total as "Errors you fixed without asking". The panel number "Errors you worked out yourself" (22) is something else: it counts questions where S07 did not open the rule or the fix.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="fixed-without-asking" /></ClientOnly>
<template #takeaway>S07 fixes more errors alone in the last weeks than at the start.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Are students solving more errors on their own as the course goes on?
- **Researcher:** Does unaided error resolution grow over the weeks, next to help-seeking?

## Raw data sample {#raw}

Two sessions of S07 with their counters.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/fixed-without-asking.json

### How it is counted {#coding-sessions-errors-resolved-without-asking}

The extension compares the list of errors and warnings of an open file before and after each change settles (about 1.2 seconds). Each diagnostic that is gone and was never asked about adds 1.

<FormulaVersion ids="coding_sessions.errors_resolved_without_asking" />

### Fixed without asking (dashboard) {#metric-fixed-unaided}

Sum of the counter over the sessions that started in the period.

<FormulaVersion ids="metric.fixed_unaided" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `fixed_unaided` per student and per week or block of weeks. Divide by active hours when students work very different amounts.
- **Example analysis:** Test the change from early to late weeks with a paired t-test on errors fixed per active hour.

**Research questions**

<RqList ids="coding_sessions.errors_resolved_without_asking,metric.fixed_unaided" />

**Example sentence (Method):** "Errors and warnings that disappeared without a help request were counted as resolved without assistance."

## What this data does not show {#limits}

An error is identified by file, line and message, so an edit that only moves an error to another line counts as a fix. Errors that were never shown as an offer are counted too, so this counter and the help offers are not on the same base. More errors met also means more errors fixed.

## For the teacher {#teacher}

::: tip In class
A rising line is a good moment for positive feedback: tell the student that they fix most small errors alone now.
:::
