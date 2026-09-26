---
title: Failed requests
items:
  - event.request_failed
  - event.request_failed.kind
  - event.request_failed.code
  - event.request_failed.retryAfterSeconds
  - metric.failed_requests
  - metric.failure_rate
sample:
  - views/failed-requests.json#facts.failures = 30
  - views/failed-requests.json#facts.questions = 928
  - views/failed-requests.json#facts.ratePct = 3.1
---

# Failed requests

## What is a failed request? {#what}

The event is recorded when the student asked for help but no answer arrived: no answer within 25 seconds, an error from the server, or another error. The student sees an error message and no question is stored.

## Example with one student {#example}

In the sample, 30 requests failed next to 928 answered questions, a failure rate of 3.1%. Most failures were errors of the AI service. Two requests hit the usage limit.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="failed-requests" /></ClientOnly>
<template #takeaway>Failures are rare. Most come from the AI service, not from the students.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Did the tool fail when students needed it?
- **Researcher:** How reliable was the service, and are there requests missing from the question data?

## Raw data sample {#raw}

One event from the sample.

`events`:

<<< @/../.vitepress/data/sample/snippets/failed-requests.json

### Kind and code {#event-request-failed-kind}

The kind is `timeout` (no answer within 25 seconds), `backend` (the server returned an error) or `unknown`. For `backend` the code of the server is stored, for example `provider_error` or `rate_limited`. For `rate_limited` the event also stores the seconds until the limit resets.

<FormulaVersion ids="event.request_failed.kind" />

### Failed requests (dashboard) {#metric-failed-requests}

Failure events of the period, grouped by kind and code.

<FormulaVersion ids="metric.failed_requests" />

### Failure rate (dashboard) {#metric-failure-rate}

Failures divided by the sum of questions and failures in the period.

<FormulaVersion ids="metric.failure_rate" />

## Use in research {#research}

- **Stage:** in the analysis (data quality and Method section)
- **One value per student for SPSS:** `failed_requests` per student, to check that no student was affected much more than others.
- **Example analysis:** Report the failure rate in the Method section. Add failed requests to the questions when you count help-seeking attempts.

**Research questions**

<RqList ids="event.request_failed" />

**Example sentence (Method):** "Failed help requests were logged separately and counted as help-seeking attempts."

## What this data does not show {#limits}

The event is sent by the extension, so a failure without a network connection may never arrive. A student who tried twice creates two events. The event does not tell which error or question the student asked about.

## For the teacher {#teacher}

::: tip In class
If many requests fail during a lab, tell the students to wait a minute and try again. The error message does not mean their code is wrong.
:::
