---
title: Saves
items:
  - coding_sessions.save_count
sample:
  - views/saves.json#facts.featured = 172
  - views/saves.json#facts.classMean = 178
---

# Saves

## What are saves? {#what}

The counter goes up by one each time a file is saved in VS Code. Beginners often save right before they run the program, so saves are a rough sign of the "try it and see" loop.

## Example with one student {#example}

S07 saved files 172 times in eight weeks, and the class 178 times on average. S07 saved most often in weeks 4 and 8.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="saves" /></ClientOnly>
<template #takeaway>The class saves about 21 to 23 times a week. S07 follows the same peaks as in active time.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** How often do students test their changes?
- **Researcher:** How short is the edit-and-run cycle?

## Raw data sample {#raw}

Two sessions of S07.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/saves.json

### How it is counted {#coding-sessions-save-count}

Each save event of a document adds 1. The extension adds to the counter while the student works and merges it into the session row every 3 minutes.

<FormulaVersion ids="coding_sessions.save_count" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** `saves_per_hour` = saves ÷ active hours, per student.
- **Example analysis:** Describe it, and check that auto save was off in the lab before you interpret it.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "Save events were counted as a proxy for the frequency of edit-and-test cycles."

## What this data does not show {#limits}

With auto save turned on, VS Code saves by itself and the number loses its meaning. Some students save out of habit after every line. A save does not show that the program was run.

## For the teacher {#teacher}

::: tip In class
A student who saves very rarely may run big blocks of code at once. Encourage small steps: change, save, run.
:::
