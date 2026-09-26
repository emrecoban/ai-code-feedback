---
title: Files created
items:
  - coding_sessions.files_created
sample:
  - views/files-created.json#facts.featured = 5
  - views/files-created.json#facts.classMedian = 6
---

# Files created

## What are files created? {#what}

The counter goes up by one for each file that the student creates through VS Code, for example with "New File" in the explorer. File names are not stored here.

## Example with one student {#example}

S07 created 5 files in eight weeks. The class median was 6.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="files-created" /></ClientOnly>
<template #takeaway>Most students created three to eight files in eight weeks. S07 is in the 3–5 group.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students start a new file for each task?
- **Researcher:** How do students organize their work?

## Raw data sample {#raw}

Two sessions of S07.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/files-created.json

### How it is counted {#coding-sessions-files-created}

The extension adds to the counter while the student works and merges it into the session row every 3 minutes.

<FormulaVersion ids="coding_sessions.files_created" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** `files_created` per student.
- **Example analysis:** Describe only. Use it to check whether students followed the task structure of the course.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "The number of files created in the editor was recorded as a descriptive indicator of how students organised their work."

## What this data does not show {#limits}

Files created in the terminal, by another program or by copying a folder are not counted. Files given by the teacher are not counted either. The number says nothing about what the files contain.

## For the teacher {#teacher}

::: tip In class
If your tasks expect one file per exercise, a very low number can explain why students lose track of older solutions.
:::
