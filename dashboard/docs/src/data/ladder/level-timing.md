---
title: Opening the hint levels
items:
  - event.level_reached
  - event.level_reached.level
  - event.level_reached.isEscalation
  - event.level_reached.msSinceCreated
  - metric.reading_to_rule_median
  - metric.reading_to_fix_median
sample:
  - views/level-timing.json#facts.title = Undefined variable total
  - views/level-timing.json#facts.toRuleSec = 38
  - views/level-timing.json#facts.toFixSec = 47
  - views/level-timing.json#facts.classToRuleSec = 22
  - views/level-timing.json#facts.classToFixSec = 44
---

# Opening the hint levels

## What does the timing of the hint levels show? {#what}

Each time a student opens the rule (L2) or the fix (L3), the server stores an event with the time since the question was asked. The events show whether a student read the first steps first or clicked straight through to the fix.

## Example with one student {#example}

S07 asked about "Undefined variable total". S07 opened the rule 38 seconds after asking and the fix 47 seconds after asking. The class medians were 22 and 44 seconds. The timeline below shows what else happened after this question.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="level-timing" /></ClientOnly>
<template #takeaway>One question, many traces: the levels, the return to the code, the first edit and the moment the error went away.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students read the first steps, or do they jump to the answer?
- **Researcher:** How much time do students spend on each step before they open the next one?

## Raw data sample {#raw}

The two level events of the question in the timeline.

`events`:

<<< @/../.vitepress/data/sample/snippets/level-timing.json

### How the time is computed {#event-level-reached-mssincecreated}

Server time when the step was opened minus the time the question was stored, in milliseconds. The same step is stored only once per question.

<FormulaVersion ids="event.level_reached.msSinceCreated" />

### Opened L2 after (median, dashboard) {#metric-reading-to-rule-median}

Median of the times to open L2 over the level events of the questions asked in the period.

<FormulaVersion ids="metric.reading_to_rule_median" />

### Opened L3 after (median, dashboard) {#metric-reading-to-fix-median}

The same median for L3.

<FormulaVersion ids="metric.reading_to_fix_median" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `median_s_to_rule` and `median_s_to_fix` per student, over the questions where the step was opened.
- **Example analysis:** Compare the time to the fix in early and late weeks, or use it as a predictor of the similarity of the next edit to the fix.

**Research questions**

<RqList ids="metric.reading_to_rule_median,metric.reading_to_fix_median" />

**Example sentence (Method):** "The time from the request to the opening of each deeper level was recorded on the server."

## What this data does not show {#limits}

The time is measured on the server, so it includes network delay. A long time can mean careful reading, but also that the panel was hidden. When a student opens a step on an explanation reopened days later, the time is very long.

## For the teacher {#teacher}

::: tip In class
If students open the fix within a few seconds, show in class how to use the Locate question (L1) to find the line themselves.
:::
