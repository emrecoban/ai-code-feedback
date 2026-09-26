---
title: Lines added and deleted
items:
  - coding_sessions.lines_written
  - coding_sessions.lines_deleted
sample:
  - views/lines.json#facts.featuredWritten = 791
  - views/lines.json#facts.featuredDeleted = 281
  - views/lines.json#facts.classMeanWritten = 712
---

# Lines added and deleted

## What are lines added and deleted? {#what}

The extension counts the new lines and the removed lines in each edit of a file. Undo, redo and very large edits (more than 20 lines at once) are left out. The code itself is not sent.

## Example with one student {#example}

S07 added 791 lines and deleted 281 lines in eight weeks. The class added 712 lines per student on average. S07 added the most lines in weeks 4 and 8, the same weeks with the longest active time.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="lines" /></ClientOnly>
<template #takeaway>The class adds about 90 lines per student each week. S07 is close to the class, with peaks in weeks 4 and 8.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** How much code do students write in a lab?
- **Researcher:** How much production is there, and how much of it is rewriting?

## Raw data sample {#raw}

Two sessions of S07.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/lines.json

### How lines added are counted {#coding-sessions-lines-written}

Sum of the new line breaks in the edits of files on disk. Undo and redo are left out, and an edit that adds or removes more than 20 lines is ignored.

<FormulaVersion ids="coding_sessions.lines_written" />

### How lines deleted are counted {#coding-sessions-lines-deleted}

Sum of the removed line spans in the same edits, with the same rules.

<FormulaVersion ids="coding_sessions.lines_deleted" />

## Use in research {#research}

- **Stage:** in the analysis (as a control variable)
- **One value per student for SPSS:** `lines_added` and `lines_deleted` per student, and `rewrite_ratio` = deleted ÷ added.
- **Example analysis:** Use lines added per active hour as a rough productivity control.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "Code production was approximated by the number of lines added and deleted, excluding undo, redo and edits larger than 20 lines."

## What this data does not show {#limits}

A line is a line break, so a long line and an empty line count the same. Pasted code up to 20 lines is counted as written. The numbers say nothing about the quality of the code.

## For the teacher {#teacher}

::: tip In class
Many deleted lines are not a bad sign. They often show that a student tries, checks and rewrites.
:::
