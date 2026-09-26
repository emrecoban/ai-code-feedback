---
title: Left VS Code
items:
  - coding_sessions.focus_loss_count
  - coding_sessions.unfocused_seconds
  - metric.habits_totals
sample:
  - views/left-vscode.json#facts.featuredLosses = 55
  - views/left-vscode.json#facts.featuredAwayMin = 57
  - views/left-vscode.json#facts.classMeanLosses = 57
---

# Left VS Code

## What does "left VS Code" mean? {#what}

The counter goes up each time the VS Code window loses focus, for example when the student clicks on the browser. A second number sums the time until the student comes back, with at most ten minutes per absence.

## Example with one student {#example}

S07 left VS Code 55 times in eight weeks and was away for 57 minutes in total. The class mean was 57 times. In week 8, S07 left VS Code most often.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="left-vscode" /></ClientOnly>
<template #takeaway>The class leaves VS Code about seven times a week. S07 is close to the class, with a peak in week 8.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students look for help outside the editor, for example in the browser?
- **Researcher:** How often do students switch to other sources, which the extension cannot see?

## Raw data sample {#raw}

Two sessions of S07.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/left-vscode.json

### How the time away is measured {#coding-sessions-unfocused-seconds}

Length of each finished absence (the window loses focus, then gets it back), with at most ten minutes per absence. An absence that never ends, for example because VS Code closes, is not counted.

<FormulaVersion ids="coding_sessions.unfocused_seconds" />

### Work habits (dashboard) {#metric-habits-totals}

The dashboard sums this counter and the other habit counters on the next pages over the sessions of the period.

<FormulaVersion ids="metric.habits_totals" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `focus_losses_per_hour` = times left ÷ active hours, and `away_min`, per student.
- **Example analysis:** Relate leaving VS Code to the number of questions: students who ask less may look for help elsewhere (Spearman).

**Research questions**

<RqList ids="coding_sessions.focus_loss_count" />

**Example sentence (Method):** "Switches away from the editor window were counted as an indirect indicator of help sought outside the extension."

## What this data does not show {#limits}

The extension does not know where the student went: it can be the task sheet, a search engine, another AI tool or a chat. A click on the terminal panel inside VS Code does not count. Time away is capped, so long breaks look short.

## For the teacher {#teacher}

::: tip In class
If you give the task sheet as a PDF, students must leave VS Code to read it. Putting the task into the code file as a comment keeps them in one place.
:::
