---
title: Usage limits
items:
  - usage_counters.requests
  - usage_counters.total_tokens
  - rate_limits.hourly
  - rate_limits.daily
  - metric.quota_today
sample:
  - views/usage-limits.json#facts.defaultHourly = 40
  - views/usage-limits.json#facts.defaultDaily = 200
  - views/usage-limits.json#facts.maxPerHour = 9
  - views/usage-limits.json#facts.hours = 368
---

# Usage limits

## What are the usage limits? {#what}

Each student may ask a limited number of questions per hour and per day. The server counts the generated answers of each student per hour. An admin can change the two limits in the dashboard.

## Example with one student {#example}

In the sample the limits were the defaults: 40 requests per hour and 200 per day. No student came close: the highest value in one hour was 9 requests. The counters have 368 rows, one per student and hour with at least one answer.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="usage-limits" /></ClientOnly>
<template #takeaway>Most student-hours have only one or two answers, far below the limit.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Is the limit high enough for a lab, and does anyone ask very often?
- **Researcher:** Did the limits restrict help-seeking during the study?

## Raw data sample {#raw}

Two hours of S07.

`usage_counters`:

<<< @/../.vitepress/data/sample/snippets/usage-limits.json

### How requests are counted {#usage-counters-requests}

Goes up by one for each generated answer in the UTC hour. Answers from the cache do not count.

<FormulaVersion ids="usage_counters.requests" />

### Limits {#rate-limits-daily}

An admin sets the hourly and the daily limit in the dashboard. Until then, the server uses its own defaults (40 and 200). The day starts at 00:00 UTC.

<FormulaVersion ids="rate_limits.daily" />

### Usage limits today (dashboard) {#metric-quota-today}

For the ten most active students: requests in the current UTC hour, and requests and tokens since 00:00 UTC.

<FormulaVersion ids="metric.quota_today" />

## Use in research {#research}

- **Stage:** in the analysis (data quality and Method section)
- **One value per student for SPSS:** `max_requests_hour` per student, to show that nobody was blocked often.
- **Example analysis:** Report the limits in the Method section together with the number of `rate_limited` failures.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "Each student could request up to a fixed number of AI answers per hour and per day, and the limits were rarely reached."

## What this data does not show {#limits}

The counters use UTC hours and days, which do not match local lab hours. Only generated answers count, so failed requests and answers from the cache are not in the counters. The table keeps only the current limits. Earlier values are in the audit log of the dashboard.

## For the teacher {#teacher}

::: tip In class
If a student reaches the limit in a lab, talk with them. Very frequent questions can be a sign of trial and error without reading the hints.
:::
