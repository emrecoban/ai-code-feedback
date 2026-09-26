---
title: Went back to the code
items:
  - event.returned_to_code
  - event.returned_to_code.level
  - event.returned_to_code.msToReturn
  - metric.reading_back_median
sample:
  - views/back-to-code.json#facts.featuredMedianSec = 24
  - views/back-to-code.json#facts.classMedianSec = 18
---

# Went back to the code

## What is the return to the code? {#what}

After an explanation or a new step appears, the extension waits for the first activity in the editor: a change in the text or a move of the cursor. The event stores how long this took and which step was on screen.

## Example with one student {#example}

S07 went back to the code after a median of 24 seconds, a little later than the class (18 seconds). After the fix (L3), S07 returned quickly, probably to type the change.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="back-to-code" /></ClientOnly>
<template #takeaway>The class goes back to the code about 15 to 20 seconds after a step. S07 takes longer after L0–L1 and L2 and returns fast after the fix.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students stop to read, or do they go back to typing at once?
- **Researcher:** How long do students engage with each step before acting on it?

## Raw data sample {#raw}

One event of S07.

`events`:

<<< @/../.vitepress/data/sample/snippets/back-to-code.json

### How the time is measured {#event-returned-to-code-mstoreturn}

Time from the moment a step became visible to the first text change or cursor move in any editor, in milliseconds. After 10 minutes without activity the event becomes "Left without acting" instead.

<FormulaVersion ids="event.returned_to_code.msToReturn" />

### Back to the code after (median, dashboard) {#metric-reading-back-median}

Median of the return times over the events of the questions asked in the period.

<FormulaVersion ids="metric.reading_back_median" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `median_return_s` per student, and per step if you study reading at each level.
- **Example analysis:** Compare the return time after L0–L1 between students with high and low learning gain (Mann–Whitney U).

**Research questions**

<RqList ids="event.returned_to_code.msToReturn,metric.reading_back_median" />

**Example sentence (Method):** "The time between the display of each feedback level and the first subsequent editor activity was used as an indicator of engagement with the feedback."

## What this data does not show {#limits}

Any change or cursor move counts, also in another file or document, so a quick return can be accidental. A long time can be reading, thinking or a break. When a new step is opened before the return, only the last step is measured.

## For the teacher {#teacher}

::: tip In class
If students go back to typing within a few seconds after every step, ask them in class to say in one sentence what the explanation told them before they change the code.
:::
