---
title: When students work
items:
  - metric.work_rhythm
sample:
  - views/work-rhythm.json#facts.peakDay = 2
  - views/work-rhythm.json#facts.peakHour = 10
  - views/work-rhythm.json#facts.labPct = 78
---

# When students work

## What is the work rhythm? {#what}

The dashboard counts questions and session starts by day of the week and hour of the day. The result is a grid of 7 days and 24 hours.

## Example with one student {#example}

The busiest cell of the class is day 2 of the week (Tuesday) at 10:00, which is lab time. 78% of all questions were asked on Tuesday between 10:00 and 12:00. The rest were spread over the evenings of the other days.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="work-rhythm" /></ClientOnly>
<template #takeaway>Most questions are asked in the lab. Work at home happens in the evening.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students also ask for help outside lab hours?
- **Researcher:** How much of the use happens in class and how much in self-study?

## Raw data sample {#raw}

Three cells of the grid: day of the week (1 = Monday), hour and number of questions.

Part of the JSON that `dashboard_insights` returns:

<<< @/../.vitepress/data/sample/snippets/work-rhythm.json

### When students work (dashboard) {#metric-work-rhythm}

Counts by ISO day of the week (1 to 7) and hour (0 to 23) in the time zone of the viewer: questions by their time and sessions by their start.

<FormulaVersion ids="metric.work_rhythm" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** `lab_share` = questions in lab hours ÷ all questions, per student.
- **Example analysis:** Compare students who also work at home with those who work only in the lab on the learning gain (Mann–Whitney U).

**Research questions**

<RqList ids="metric.work_rhythm" />

**Example sentence (Method):** "Help requests were classified as made during scheduled lab hours or outside them."

## What this data does not show {#limits}

The hours are shown in the time zone of the person who views the dashboard, not of the student. The grid does not know the lab timetable, so "lab hours" must be defined by the researcher. It counts events, not time spent working.

## For the teacher {#teacher}

::: tip In class
If many questions come late in the evening before a deadline, consider an earlier deadline or a short online office hour.
:::
