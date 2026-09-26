---
title: Files worked through
items:
  - event.file_cleared
  - event.file_cleared.fileName
  - event.file_cleared.msWithErrors
  - event.file_cleared.editsWhileErrors
  - event.file_cleared.diagnosticsSeen
  - event.file_cleared.diagnosticsAsked
  - metric.files_cleared_list
sample:
  - views/files-worked-through.json#facts.exFile = hw8.py
  - views/files-worked-through.json#facts.exMin = 26.1
  - views/files-worked-through.json#facts.exEdits = 14
  - views/files-worked-through.json#facts.exSeen = 3
  - views/files-worked-through.json#facts.exAsked = 1
  - views/files-worked-through.json#facts.featuredEpisodes = 26
  - views/files-worked-through.json#facts.medianMin = 6.6
---

# Files worked through

## What is a file worked through? {#what}

The event is recorded when a file that had errors or warnings has none left. It summarizes the whole episode: how long the file had problems, how many edits it took, how many problems appeared and how many the student asked about.

## Example with one student {#example}

The latest episode of S07 was in hw8.py. The file had errors for 26.1 minutes. S07 made 14 edits, saw 3 problems and asked about 1 of them. Over the eight weeks, S07 cleared files 26 times.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="files-worked-through" /></ClientOnly>
<template #takeaway>A small table works best here. In the class, a file took a median of 6.6 minutes to become error-free.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** How much work does it take my students to get a file working?
- **Researcher:** What does the whole repair of a file cost, and which share of its problems needed help?

## Raw data sample {#raw}

The latest episode of S07.

`events`:

<<< @/../.vitepress/data/sample/snippets/files-worked-through.json

### How the episode is measured {#event-file-cleared-mswitherrors}

The episode starts when the first problem appears in a file and ends when the last one goes away. Time with errors is the difference in milliseconds. Edits are the change events in between.

<FormulaVersion ids="event.file_cleared.msWithErrors" />

### Edits {#event-file-cleared-editswhileerrors}

Edit events in the file during the episode.

<FormulaVersion ids="event.file_cleared.editsWhileErrors" />

### Errors seen {#event-file-cleared-diagnosticsseen}

Problems present at the start of the episode plus those that appeared later.

<FormulaVersion ids="event.file_cleared.diagnosticsSeen" />

### Files worked through (dashboard) {#metric-files-cleared-list}

The latest 25 episodes of the period with their values.

<FormulaVersion ids="metric.files_cleared_list" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** `median_episode_min` and `asked_share` = asked ÷ seen, per student over all episodes.
- **Example analysis:** Compare the median episode time of weeks 1–4 and 5–8 (Wilcoxon), as a measure of growing fluency.

**Research questions**

<RqList ids="event.file_cleared.msWithErrors" />

**Example sentence (Method):** "A repair episode was defined as the period from the first diagnostic in a file until the file had no diagnostics left."

## What this data does not show {#limits}

The file name is stored, and a file name can contain personal information. An episode also ends when the problems disappear because code was deleted. Files closed before they became error-free produce no event.

## For the teacher {#teacher}

::: tip In class
If files stay broken for a long time in a lab, stop the class once and show a strategy: fix the first error at the top of the file, then run again.
:::
