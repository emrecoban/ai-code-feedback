---
title: Sessions without help
items:
  - metric.sessions_without_help_pct
  - metric.analytics_sessions_without_help
sample:
  - views/sessions-without-help.json#facts.featuredPct = 25
  - views/sessions-without-help.json#facts.featuredPctNoEmpty = 18.2
  - views/sessions-without-help.json#facts.classPct = 22.1
  - views/sessions-without-help.json#facts.classPctNoEmpty = 18.3
---

# Sessions without help

## What is a session without help? {#what}

It is a session in which the student asked no question at all. The dashboard shows the share of such sessions among all sessions of the period.

## Example with one student {#example}

25% of the sessions of S07 had no question. One of them was an empty session: VS Code was opened and closed again without any activity. Without empty sessions the value of S07 falls to 18.2%, and the class value from 22.1% to 18.3%.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="sessions-without-help" /></ClientOnly>
<template #takeaway>Empty sessions raise the rate. Leaving them out gives a fairer picture of real work without help.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students also work without asking the tool?
- **Researcher:** Does the share of sessions without help grow over the weeks?

## Raw data sample {#raw}

An empty session and a normal session of S07.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/sessions-without-help.json

### Sessions without help (dashboard) {#metric-sessions-without-help-pct}

Sessions of the period with no question linked to them, divided by all sessions of the period. Empty sessions are included.

<FormulaVersion ids="metric.sessions_without_help_pct" />

### Sessions without help report (SQL) {#metric-analytics-sessions-without-help}

A read-only SQL report in the repository. Per student: sessions, sessions without a question, their share, errors fixed without asking and help offers.

<FormulaVersion ids="metric.analytics_sessions_without_help" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `no_help_share` per student, computed without empty sessions (active time 0).
- **Example analysis:** Test the change from the first to the second half of the course (paired Wilcoxon test).

**Research questions**

<RqList ids="metric.sessions_without_help_pct" />

**Example sentence (Method):** "The proportion of coding sessions without any help request was computed after excluding sessions without editor activity."

## What this data does not show {#limits}

The dashboard counts empty sessions, and a reload of VS Code creates one. A session without help can also be a short session in which the student only read code. It does not show that the student met a difficulty and solved it alone.

## For the teacher {#teacher}

::: tip In class
Do not read a low rate as a problem in the lab: most lab tasks lead to at least one question. Look at the trend over the weeks instead.
:::
