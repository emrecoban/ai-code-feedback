---
title: Where questions start
items:
  - interactions.trigger_surface
  - metric.surfaces
sample:
  - views/trigger-surface.json#facts.featuredTop = diagnostic_codelens
  - views/trigger-surface.json#facts.topPct = 44.9
---

# Where questions start

## What is the starting point of a question? {#what}

The starting point is the exact button, link or shortcut the student used to ask. There are nine values, for example the CodeLens line above an error, the lightbulb menu, the status bar or the keyboard shortcut.

## Example with one student {#example}

S07 used "Error: CodeLens" most often, like the class as a whole. Each button stores its own value, so the data shows which ways of asking S07 found and used.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="trigger-surface" /></ClientOnly>
<template #takeaway>The CodeLens above an error is the most used way to ask (44.9% of all questions). The keyboard shortcut is rare.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Which buttons do students find and use?
- **Researcher:** Which entry points do students use, and does the visibility of an entry point change how often they ask?

## Raw data sample {#raw}

Two questions of S07 with their starting point.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/trigger-surface.json

### Where questions start (dashboard) {#metric-surfaces}

The questions of the period, grouped by starting point. A missing value is shown as "Not recorded".

<FormulaVersion ids="metric.surfaces" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** One share per group of entry points, for example `share_codelens` = CodeLens questions ÷ all questions.
- **Example analysis:** Describe the mix of entry points per week, and compare it between students who ask often and students who ask rarely.

**Research questions**

<RqList ids="interactions.trigger_surface,metric.surfaces" />

**Example sentence (Method):** "The interface element used for each request (CodeLens, lightbulb, gutter link, status bar, keyboard shortcut, sidebar button or command palette) was recorded."

## What this data does not show {#limits}

A click on the gutter link of a selection is stored as "Selection: shortcut", because that link passes no value. The sidebar button and the command palette ask a fixed question without showing the question list. The mix also depends on what was visible: the editor shows the CodeLens only for the first three errors of a file.

## For the teacher {#teacher}

::: tip In class
If almost nobody uses the selection features, show the shortcut Ctrl+Alt+Space (Cmd+Alt+Space on macOS) once in class.
:::
