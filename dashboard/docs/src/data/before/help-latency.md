---
title: Waited after the offer
items:
  - interactions.help_latency_ms
  - metric.median_help_latency
sample:
  - views/help-latency.json#facts.featuredMedianSec = 27
  - views/help-latency.json#facts.classMedianSec = 30
  - views/help-latency.json#facts.withLatency = 653
  - views/help-latency.json#facts.questions = 928
---

# Waited after the offer

## What is the wait after the offer? {#what}

The wait is the time between the moment the help offer appeared next to an error and the moment the student clicked it. It shows how long the student worked on the error alone before asking.

## Example with one student {#example}

The median wait of S07 was 27 seconds, close to the class median of 30 seconds. In many cases S07 read the error, tried something, and asked after half a minute.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="help-latency" /></ClientOnly>
<template #takeaway>The weekly median of S07 moves around the class median, with large jumps in weeks with few questions.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students try on their own before they ask, or do they click at once?
- **Researcher:** How long do students persist before seeking help, and does this time grow over the weeks?

## Raw data sample {#raw}

Two error questions of S07 that started from a visible offer.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/help-latency.json

### How the wait is measured {#interactions-help-latency-ms}

Click time minus the time the offer icon first appeared for this diagnostic, in milliseconds. It is empty when there was no visible offer (all selection questions, and errors past the third one in a file). A negative value is stored as empty.

<FormulaVersion ids="interactions.help_latency_ms" />

### Waited after the offer (median, dashboard) {#metric-median-help-latency}

Median of the non-empty waits of the questions asked in the period.

<FormulaVersion ids="metric.median_help_latency" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `median_wait_s` per student, in seconds. Use the median, because a few very long waits (a break) distort the mean.
- **Example analysis:** Compare the median wait of weeks 1–2 and weeks 7–8 with a Wilcoxon signed-rank test, and correlate the change with the learning gain.

**Research questions**

<RqList ids="interactions.help_latency_ms,metric.median_help_latency" />

**Example sentence (Method):** "Help latency was defined as the time between the display of the help link and the student's request, and summarized per student as a median."

## What this data does not show {#limits}

A long wait can mean effort, but also a break or work in another file. Only questions that started from a visible offer have a value (653 of 928 in the sample), so the measure describes error questions only. The clock runs in the extension, so a sleeping laptop can add time.

## For the teacher {#teacher}

::: tip In class
If a student almost always asks within a few seconds, suggest a simple habit: read the message twice and try one change before clicking.
:::
