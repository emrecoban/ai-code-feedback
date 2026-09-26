---
title: Needs attention
items:
  - metric.needs_attention
sample:
  - views/needs-attention.json#facts.flagged = 25
  - views/needs-attention.json#facts.cohort = 25
  - views/needs-attention.json#facts.stillStuck = 23
  - views/needs-attention.json#facts.lastWeekFlagged = 16
  - views/needs-attention.json#facts.featuredLastWeek = 0
---

# Needs attention

## What does "needs attention" mean? {#what}

The dashboard lists students who meet at least one of six rules in the chosen period, with the reasons. The list helps the teacher decide whom to visit first in a lab.

## Example with one student {#example}

Over the whole eight weeks, 25 of 25 students are on the list, S07 among them. For example, 23 students answered "Still stuck" at least once. In week 8 alone, 16 students are on the list, and S07 is not.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="needs-attention" /></ClientOnly>
<template #takeaway>Over a long period almost every student meets a rule. The list is useful for a short period, such as one lab week.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Who needs my help now?
- **Researcher:** Can simple rules on the log data find students at risk, and do they agree with the test results?

## Raw data sample {#raw}

One entry of the list over the whole range.

Part of the JSON that `dashboard_overview` returns:

<<< @/../.vitepress/data/sample/snippets/needs-attention.json

### The six rules {#metric-needs-attention}

Same error 3+ times (the same normalized error asked about three or more times). Said "still stuck" (at least one such answer). Needed the fix for 70%+ of 5+ questions. 8+ edits before asking on average (at least two measured questions). 2+ "not helpful" ratings. No activity for 7+ days (this rule ignores the period). Students are sorted by the number of reasons.

<FormulaVersion ids="metric.needs_attention" />

## Use in research {#research}

- **Stage:** during the intervention (to follow the class)
- **One value per student for SPSS:** Not needed as such. If you want a flag variable, compute each rule per week from the raw data.
- **Example analysis:** Check whether the number of weeks a student was flagged relates to a low post-test score (Spearman).

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "The dashboard flagged students for the instructor with six rule-based indicators computed for the selected period."

## What this data does not show {#limits}

The rules count events and do not grow stricter with the length of the period, so over many weeks almost everyone is flagged. A student who asks nothing is flagged only by the inactivity rule. The list is a prompt for the teacher, not a diagnosis.

## For the teacher {#teacher}

::: tip In class
Set the period to the current lab or week before you read the list. Start with students who have two or more reasons.
:::
