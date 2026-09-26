---
title: Edits before asking
items:
  - interactions.edits_before_ask
  - metric.avg_edits_before_ask
sample:
  - views/edits-before-asking.json#facts.featuredAvg = 2.8
  - views/edits-before-asking.json#facts.classMedian = 2
  - views/edits-before-asking.json#facts.eightPlus = 4
---

# Edits before asking

## What are the edits before asking? {#what}

This number counts the changes the student made to the file between the moment the help offer appeared and the click on it. It shows how many attempts came before the question.

## Example with one student {#example}

S07 made 2.8 edits on average before asking. The class median was 2. Only 4 questions in the whole class came after eight or more edits.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="edits-before-asking" /></ClientOnly>
<template #takeaway>Most questions come after zero to four attempts. Long series of attempts before asking are rare.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students try something before they ask?
- **Researcher:** How much effort comes before a help request, and how does it compare with the effort of unaided fixes?

## Raw data sample {#raw}

Two error questions of S07.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/edits-before-asking.json

### How the edits are counted {#interactions-edits-before-ask}

Number of change events in the document between the offer and the click. One change event can be one typed character or one pasted block. Empty when there was no visible offer.

<FormulaVersion ids="interactions.edits_before_ask" />

### Edits before asking (dashboard) {#metric-avg-edits-before-ask}

The student view shows the mean of the non-empty values, with one decimal. The class view of learning behaviour shows the median instead.

<FormulaVersion ids="metric.avg_edits_before_ask" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `median_edits_before_ask` per student. Prefer the median, because single long sessions of typing inflate the mean.
- **Example analysis:** Compare it with the edits per unaided fix of the same student (paired Wilcoxon test).

**Research questions**

<RqList ids="interactions.edits_before_ask,metric.avg_edits_before_ask" />

**Example sentence (Method):** "Persistence before help-seeking was operationalized as the number of edits between the display of the help link and the request."

## What this data does not show {#limits}

An edit event is not an attempt in the learning sense: typing one word creates many events, and a paste creates one. Edits in other files are not counted. The value is empty for selection questions.

## For the teacher {#teacher}

::: tip In class
If a student asks without any edits most of the time, ask them to explain the error message in their own words first. If a student makes very many edits before asking, a hint to ask earlier can save frustration.
:::
