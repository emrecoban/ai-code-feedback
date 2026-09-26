---
title: Switched between files
items:
  - coding_sessions.editor_switch_count
  - coding_sessions.files_visited
sample:
  - views/file-switches.json#facts.featuredSwitches = 119
  - views/file-switches.json#facts.classMeanSwitches = 119
  - views/file-switches.json#facts.featuredFiles = 17
---

# Switched between files

## What are file switches? {#what}

The first counter goes up each time the active editor changes to a different file. The second number is how many different files became active in the session. File names are not stored here.

## Example with one student {#example}

S07 switched between files 119 times in eight weeks, the same as the class mean (119). Added over all sessions, S07 opened 17 files.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="file-switches" /></ClientOnly>
<template #takeaway>The class switches files about 13 to 17 times a week. S07 moves around the class mean from week to week.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students look at other files, such as an earlier solution, while they work?
- **Researcher:** How much do students navigate between files, as a sign of reuse of their own code?

## Raw data sample {#raw}

Two sessions of S07.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/file-switches.json

### Switched between files {#coding-sessions-editor-switch-count}

Adds 1 when the active editor changes to a different file on disk. The extension adds to the counter while the student works and merges it into the session row every 3 minutes.

<FormulaVersion ids="coding_sessions.editor_switch_count" />

### Files opened {#coding-sessions-files-visited}

Number of different files that became the active editor in the VS Code window. It is set, not added, at each update.

<FormulaVersion ids="coding_sessions.files_visited" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** `switches_per_hour` = switches ÷ active hours, per student.
- **Example analysis:** Describe it. It can be one variable in a cluster analysis of work styles.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "Navigation was described by the number of switches between files in the editor."

## What this data does not show {#limits}

Files opened in two sessions are counted twice when sessions are added. Switching to a settings page or an output panel does not count. The counter cannot tell why the student opened a file.

## For the teacher {#teacher}

::: tip In class
Looking at earlier solutions is a good habit. You can encourage it by keeping all tasks of a lab in one folder.
:::
