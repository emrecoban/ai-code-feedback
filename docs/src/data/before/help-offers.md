---
title: Help offers
items:
  - coding_sessions.diagnostics_offered
sample:
  - views/help-offers.json#facts.featuredWeek1 = 7
  - views/help-offers.json#facts.featuredWeek8 = 17
  - views/help-offers.json#facts.featuredTotal = 67
---

# Help offers

## What is a help offer? {#what}

A help offer is an error or warning next to which the extension showed "What does this mean?". The counter grows by one the first time the offer icon appears for a diagnostic in the open editor. It is the base for the question "how often did the student ask when help was offered?".

## Example with one student {#example}

The extension offered help 7 times to S07 in week 1 and 17 times in week 8. Over the eight weeks S07 saw 67 offers. More offers do not mean more questions: in week 8 S07 asked about only one of them.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="help-offers" /></ClientOnly>
<template #takeaway>The number of offers follows the errors a student meets, so it rises and falls with the difficulty of the week.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** How many errors did my students meet while they worked?
- **Researcher:** What is the base for the share of errors on which students asked for help?

## Raw data sample {#raw}

Two sessions of S07. The counter is merged into the session every three minutes.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/help-offers.json

### How an offer is counted {#coding-sessions-diagnostics-offered}

+1 the first time the offer icon is drawn next to an error or warning in the active editor, for at most three diagnostics per file. When the diagnostic goes away and comes back, it counts again.

<FormulaVersion ids="coding_sessions.diagnostics_offered" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `help_offers_total` per student, and per week or per block of weeks when you study change.
- **Example analysis:** Use it as the denominator of the rate "Asked for help when offered", and as a covariate for task difficulty.

**Research questions**

<RqList ids="coding_sessions.diagnostics_offered" />

**Example sentence (Method):** "Help offers were counted each time the extension displayed a help link next to an error or warning in the active editor."

## What this data does not show {#limits}

Only the first three diagnostics of a file get an offer, and only in the editor that is active. So errors that the student fixed without asking are counted more widely than offers, and the two counters are not on the same base. The counter follows the difficulty of the task as much as the student.

## For the teacher {#teacher}

::: tip In class
A week with many offers for the whole class points to a hard task or a new topic. Plan a short recap of the most common error at the start of the next lab.
:::
