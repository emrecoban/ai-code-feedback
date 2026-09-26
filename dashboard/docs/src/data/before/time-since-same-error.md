---
title: Time since the same error
items:
  - interactions.ms_since_previous_same_error
  - metric.quick_repeats
sample:
  - views/time-since-same-error.json#facts.featuredRepeats = 10
  - views/time-since-same-error.json#facts.featuredQuick = 1
  - views/time-since-same-error.json#facts.quickPct = 12.3
---

# Time since the same error

## What is the time since the same error? {#what}

For a repeated error, this is the time since the student last asked about the same normalized error. A short time means the last explanation did not land. A long time means the mistake came back later.

## Example with one student {#example}

S07 repeated an earlier error 10 times. Only 1 of these came within ten minutes of the earlier question. Most repeats came days later, when a similar task brought the same mistake back.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="time-since-same-error" /></ClientOnly>
<template #takeaway>In the class, 12.3% of the repeats came within ten minutes.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Did the last explanation help, or did the student ask again at once?
- **Researcher:** Can quick repeats serve as a sign that an explanation failed, separate from forgetting over time?

## Raw data sample {#raw}

A repeated error question of S07.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/time-since-same-error.json

### How the time is computed {#interactions-ms-since-previous-same-error}

Time of the new question minus the time of the latest earlier question with the same normalized message, in milliseconds. Empty for a first occurrence and for selection questions.

<FormulaVersion ids="interactions.ms_since_previous_same_error" />

### Asked again within 10 minutes (dashboard) {#metric-quick-repeats}

Questions of the period with a time since the same error of at most 600,000 ms (10 minutes).

<FormulaVersion ids="metric.quick_repeats" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `quick_repeats` = number of repeats within 10 minutes per student, and `quick_repeat_share` = quick repeats ÷ repeats.
- **Example analysis:** Compare the rate of quick repeats between questions that ended at L0–L1 and those that reached L3 (chi-square test).

**Research questions**

<RqList ids="metric.quick_repeats" />

**Example sentence (Method):** "A repeat within ten minutes of the previous request for the same error was taken as a sign that the earlier explanation had not resolved the problem."

## What this data does not show {#limits}

Two different errors with the same normalized message count as the same error, so a quick "repeat" may be a new but similar problem. The ten-minute limit is a fixed choice of the dashboard, not a tested threshold.

## For the teacher {#teacher}

::: tip In class
A quick repeat is a good moment for a personal word: the explanation on screen did not help, so a different way of explaining is likely to work better.
:::
