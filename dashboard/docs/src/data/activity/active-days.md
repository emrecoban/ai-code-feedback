---
title: Active days
items:
  - metric.active_days
sample:
  - views/active-days.json#facts.featured = 11
  - views/active-days.json#facts.classMedian = 12
  - views/active-days.json#facts.labs = 8
---

# Active days

## What are active days? {#what}

Active days are the number of different calendar dates on which at least one session started. It is a simple measure of how regularly a student worked with the extension.

## Example with one student {#example}

S07 was active on 11 days in eight weeks. The student panel shows the same number as "Days using this". The class median was 12 days, so most students also worked on some days outside the 8 labs.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="active-days" /></ClientOnly>
<template #takeaway>Every student was active on at least six days. S07 is in the 9–11 group, close to the class median.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Who uses the extension only in the lab, and who also at home?
- **Researcher:** How regular is the use, as a control for exposure?

## Raw data sample {#raw}

Active days are counted from the session start times. Three sessions of S07 on three different days:

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/active-days.json

### Active days (dashboard) {#metric-active-days}

Distinct calendar dates of the session starts in the period, in the time zone of the person who views the dashboard.

<FormulaVersion ids="metric.active_days" />

## Use in research {#research}

- **Stage:** in the analysis (as a control variable)
- **One value per student for SPSS:** `active_days` per student.
- **Example analysis:** Add it as a covariate when you relate usage patterns to learning gain.

**Research questions**

<RqList ids="metric.active_days" />

**Example sentence (Method):** "Regularity of use was measured as the number of distinct days with at least one coding session."

## What this data does not show {#limits}

The number has three versions: the dashboard uses the viewer's time zone, the student panel uses the student's computer, and the AI summary uses UTC. A day with only an empty session still counts. It says nothing about how long the student worked that day.

## For the teacher {#teacher}

::: tip In class
A student with active days only on lab days is not doing anything wrong. Use the number to plan: short tasks between labs can spread the practice.
:::
