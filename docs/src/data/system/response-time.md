---
title: AI response time
items:
  - interactions.model_used
  - interactions.latency_ms
  - metric.ai_response_time_avg
  - metric.response_time_median
sample:
  - views/response-time.json#facts.avgSec = 4.5
  - views/response-time.json#facts.p50Sec = 4.3
  - views/response-time.json#facts.p95Sec = 7.6
  - views/response-time.json#facts.cacheHits = 69
---

# AI response time

## What is the AI response time? {#what}

It is the time the server spent waiting for the AI model for one answer, in milliseconds. The same row also stores which AI provider answered.

## Example with one student {#example}

In the sample, the mean response time was 4.5 seconds. Half of the answers took less than 4.3 seconds, and 95% less than 7.6 seconds. The 69 answers from the cache have no response time.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="response-time" /></ClientOnly>
<template #takeaway>Most answers take between 3 and 6 seconds. Few take more than 8 seconds.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students wait long for an answer?
- **Researcher:** Was the service fast and stable enough during the study, as a condition of the intervention?

## Raw data sample {#raw}

A generated answer and an answer from the cache.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/response-time.json

### How the time is measured {#interactions-latency-ms}

Time inside the server function from before the first model call to after the last check, including a repair call when the first answer failed a check. Empty for answers from the cache.

<FormulaVersion ids="interactions.latency_ms" />

### AI provider {#interactions-model-used}

The id of the provider type that answered (for example `openai_compatible`), not the name of the model. For an answer from the cache it is the provider of the cached answer.

<FormulaVersion ids="interactions.model_used" />

### AI response time (dashboard) {#metric-ai-response-time-avg}

Mean response time of the questions of the period, without the answers from the cache.

<FormulaVersion ids="metric.ai_response_time_avg" />

### Response time (median, dashboard) {#metric-response-time-median}

Median and 95th percentile of the same times.

<FormulaVersion ids="metric.response_time_median" />

## Use in research {#research}

- **Stage:** in the analysis (data quality and Method section)
- **One value per student for SPSS:** Not needed per student. Report the median and the 95th percentile for the whole study.
- **Example analysis:** Check that the response time did not change between weeks or groups, so it cannot explain differences in use.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "The median server-side response time of the AI feedback service was recorded to document the conditions of the intervention."

## What this data does not show {#limits}

This is not the wait the student saw: the network and the extension add time. Failed requests have no row, so slow requests that ran out of time are missing. The provider field does not name the exact model.

## For the teacher {#teacher}

::: tip In class
If students say the tool is slow, check this page of the dashboard during the lab. Long times for everyone point to the AI service, not to the students' computers.
:::
