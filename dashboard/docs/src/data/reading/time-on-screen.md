---
title: Time on screen
items:
  - event.explanation_visibility
  - event.explanation_visibility.visibleMs
  - event.explanation_visibility.visibleAtDelivery
  - metric.reading_on_screen_pct
  - metric.reading_visible_median
sample:
  - views/time-on-screen.json#facts.featuredMedianSec = 52
  - views/time-on-screen.json#facts.classMedianSec = 44
  - views/time-on-screen.json#facts.onScreenPct = 84.9
  - views/time-on-screen.json#facts.measured = 837
  - views/time-on-screen.json#facts.explanations = 928
---

# Time on screen

## What is the time on screen? {#what}

The time on screen is how long the panel of the extension was visible while an explanation was the current one. The event also says whether the panel was visible when the explanation arrived.

## Example with one student {#example}

For S07 the median time on screen was 52 seconds, and for the class 44 seconds. The time ends when the next explanation replaces the current one, or when VS Code closes.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="time-on-screen" /></ClientOnly>
<template #takeaway>Most explanations stay on screen between 10 seconds and 2 minutes. S07 is in the 30–60 s group.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students actually look at the explanations?
- **Researcher:** Can the other reading measures be trusted, that is, was the panel visible at all?

## Raw data sample {#raw}

One event of S07.

`events`:

<<< @/../.vitepress/data/sample/snippets/time-on-screen.json

### How the time is measured {#event-explanation-visibility-visiblems}

The sum of the periods in which the panel view was visible while this explanation was the current one, in milliseconds.

<FormulaVersion ids="event.explanation_visibility.visibleMs" />

### On screen when it arrived (dashboard) {#metric-reading-on-screen-pct}

Questions with an event where the panel was visible at delivery, divided by questions with any such event. In the sample: 84.9%.

<FormulaVersion ids="metric.reading_on_screen_pct" />

### Time on screen (median, dashboard) {#metric-reading-visible-median}

Median of the time on screen over the events of the questions asked in the period.

<FormulaVersion ids="metric.reading_visible_median" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `median_visible_s` per student, and `on_screen_share` as the share of explanations visible at delivery.
- **Example analysis:** Use it to filter or weight the other reading measures, and correlate the median with hint depth.

**Research questions**

<RqList ids="event.explanation_visibility.visibleMs,metric.reading_visible_median" />

**Example sentence (Method):** "The time the feedback panel was visible was recorded for each explanation as an upper bound of reading time."

## What this data does not show {#limits}

Visible does not mean read: the student may look at the code while the panel is open. The event of the last explanation before VS Code closes is often lost, so 837 of 928 explanations have a value in the sample. The time is an upper bound of reading.

## For the teacher {#teacher}

::: tip In class
If explanations disappear from the screen after a few seconds, show students where the panel is and that it can stay open next to the code.
:::
