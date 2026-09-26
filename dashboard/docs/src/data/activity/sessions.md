---
title: Sessions
items:
  - coding_sessions.started_at
  - coding_sessions.last_seen_at
  - metric.sessions
  - metric.session_length_avg
  - metric.analytics_session_rhythm
sample:
  - views/sessions.json#facts.featuredSessions = 12
  - views/sessions.json#facts.classMeanSessions = 12.8
  - views/sessions.json#facts.avgMinutes = 77.5
  - views/sessions.json#facts.emptySessions = 15
  - views/sessions.json#facts.allSessions = 321
---

# Sessions

## What is a session? {#what}

A session is one row in the `coding_sessions` table. The extension creates it when the student signs in or when VS Code opens a window with the student already signed in. All activity counters on the following pages belong to a session.

## Example with one student {#example}

S07 had 12 sessions in the eight weeks, the class 12.8 on average. Most weeks S07 had one session in the lab. In weeks 3 and 4 there were two, and in week 8 three. In the class, a session lasted 77.5 minutes on average.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="sessions" /></ClientOnly>
<template #takeaway>Most students have one or two sessions a week. S07 has more sessions in weeks 3, 4 and 8.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students work with the extension outside the lab?
- **Researcher:** What is the unit for the activity counters, and how much did each student use the environment?

## Raw data sample {#raw}

Two sessions of S07.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/sessions.json

### Sessions (dashboard) {#metric-sessions}

Number of session rows that started in the period.

<FormulaVersion ids="metric.sessions" />

### Session length (average, dashboard) {#metric-session-length-avg}

Mean of the last activity update minus the session start, in minutes, over the sessions of the period.

<FormulaVersion ids="metric.session_length_avg" />

### Session rhythm report (SQL) {#metric-analytics-session-rhythm}

A read-only SQL report in the repository. Per student and week: sessions, mean session minutes, mean active minutes, mean breaks, and sessions by part of the day. It uses the time zone of the database.

<FormulaVersion ids="metric.analytics_session_rhythm" />

## Use in research {#research}

- **Stage:** in the analysis (as a control variable)
- **One value per student for SPSS:** `n_sessions` and `mean_session_min` per student. Leave out empty sessions (no active time).
- **Example analysis:** Use the number of sessions as a measure of exposure when you compare students or groups.

**Research questions**

<RqList ids="metric.sessions" />

**Example sentence (Method):** "Usage was summarised per student as the number of coding sessions and their mean length."

## What this data does not show {#limits}

A reload of VS Code or a second window starts a new session, so a session is not the same as a lab. The end of a session is never stored, and the length is only a lower bound. Sessions without any activity exist (15 of 321 in the sample).

## For the teacher {#teacher}

::: tip In class
Sessions outside lab hours show who practises at home. They are a good starting point for a short talk about study habits.
:::
