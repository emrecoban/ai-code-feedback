---
title: Online and active students
items:
  - metric.online_now
  - metric.active_students
  - metric.new_students
  - metric.last_active
sample:
  - views/online-and-active.json#facts.active = 25
  - views/online-and-active.json#facts.total = 25
  - views/online-and-active.json#facts.week1 = 24
  - views/online-and-active.json#facts.week8 = 24
---

# Online and active students

## What do "online" and "active" mean? {#what}

The dashboard shows four simple counts. Online now: students with any trace in the last 10 minutes. Active students: students with any trace in the period. New students: accounts created in the period. Last active: the latest trace of each student.

## Example with one student {#example}

In the sample, 25 of 25 students were active over the eight weeks, 24 in week 1 and 24 in week 8. While S07 works in a lab, the extension sends activity every 3 minutes, so S07 stays "online" in the dashboard.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="online-and-active" /></ClientOnly>
<template #takeaway>Almost every student was active in every week of the course.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Who is working right now, and who has not been seen for a while?
- **Researcher:** How many students took part in each week, as a base for attrition and missing data?

## Raw data sample {#raw}

The row of S07 in the student list of the dashboard.

Part of the JSON that `dashboard_students` returns:

<<< @/../.vitepress/data/sample/snippets/online-and-active.json

### Online now (dashboard) {#metric-online-now}

Students with a session start, an activity update, a question or an event in the last 10 minutes. It ignores the period. The 10 minutes must stay longer than the 3-minute update of the extension.

<FormulaVersion ids="metric.online_now" />

### Active students (dashboard) {#metric-active-students}

Students with any trace in the period: a session start, an activity update, a question or an event.

<FormulaVersion ids="metric.active_students" />

### New students (dashboard) {#metric-new-students}

Accounts created in the period.

<FormulaVersion ids="metric.new_students" />

### Last active (dashboard) {#metric-last-active}

The latest of the session start, the activity update, the question time and the event time of the student, over all time.

<FormulaVersion ids="metric.last_active" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis (participation)
- **One value per student for SPSS:** `weeks_active` per student (number of weeks with any trace).
- **Example analysis:** Report participation per week in the Method section, and decide on a minimum number of active weeks before the main analysis.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "Participation was described as the number of students with any recorded activity in each week of the intervention."

## What this data does not show {#limits}

An empty session or a single event is enough to count as active. The dashboard counts research events as activity, but the daily sheet of its export does not, so the two numbers can differ. Being active says nothing about the amount of work.

## For the teacher {#teacher}

::: tip In class
At the start of a lab, "Online now" shows who has signed in. A student who is missing may have a problem with the extension.
:::
