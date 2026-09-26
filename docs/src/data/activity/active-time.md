---
title: Active coding time
items:
  - coding_sessions.active_seconds
  - metric.active_coding_time
sample:
  - views/active-time.json#facts.featuredHours = 11.7
  - views/active-time.json#facts.classMeanHours = 11.4
---

# Active coding time

## What is active coding time? {#what}

Active coding time is the time in which the student was doing something in VS Code: typing, moving the cursor, changing the file or saving. Pauses longer than two minutes are not counted.

## Example with one student {#example}

S07 had 11.7 hours of active coding time in eight weeks, and the class 11.4 hours on average. The student panel shows the same total as "Total active time". S07 worked much longer than usual in weeks 4 and 8.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="active-time" /></ClientOnly>
<template #takeaway>The class mean stays between 80 and 92 minutes a week. S07 has two peaks, in weeks 4 and 8.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** How much time do students spend on the tasks?
- **Researcher:** How long was each student exposed to the environment, as a base for rates per hour?

## Raw data sample {#raw}

Two sessions of S07.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/active-time.json

### How the time is measured {#coding-sessions-active-seconds}

Each edit, cursor move, change of file or save while the window has focus is a heartbeat. The gap to the previous heartbeat is added when it is two minutes or less.

<FormulaVersion ids="coding_sessions.active_seconds" />

### Active coding time (dashboard) {#metric-active-coding-time}

Sum of the active time over the sessions that started in the period.

<FormulaVersion ids="metric.active_coding_time" />

## Use in research {#research}

- **Stage:** in the analysis (as a control variable)
- **One value per student for SPSS:** `active_hours` per student. Use it as the denominator for rates such as questions per hour.
- **Example analysis:** Normalize counts by active hours before you compare students, and report the mean and SD of active hours per group.

**Research questions**

<RqList ids="coding_sessions.active_seconds,metric.active_coding_time" />

**Example sentence (Method):** "Active coding time was estimated from editor activity, counting gaps between events of up to two minutes."

## What this data does not show {#limits}

Reading code or an explanation without moving the cursor for more than two minutes is not counted. Time in the browser or on paper is not seen. A student who leaves the cursor moving in an idle window would add time, but this is unlikely.

## For the teacher {#teacher}

::: tip In class
Compare the active time with the length of the lab. A large difference can mean long reading, talking with classmates or work outside VS Code.
:::
