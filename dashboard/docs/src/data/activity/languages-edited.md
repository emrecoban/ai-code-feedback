---
title: Languages edited
items:
  - coding_sessions.language_counts
  - metric.languages_top
sample:
  - views/languages-edited.json#facts.languages = 3
  - views/languages-edited.json#facts.pythonPct = 98.3
---

# Languages edited

## What are the languages edited? {#what}

For each counted edit, the extension adds one to the language of the file, as VS Code names it (for example `python` or `markdown`). The result is a small list of languages with a number each.

## Example with one student {#example}

S07 edited files in 3 languages, and 98.3% of the edits were in Python. The other edits were in Markdown and plain text files.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="languages-edited" /></ClientOnly>
<template #takeaway>Almost all edits of S07 are in Python, as expected in a Python course.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students work in the language of the course?
- **Researcher:** Which share of the activity belongs to the course language, as a check on the data?

## Raw data sample {#raw}

Two sessions of S07.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/languages-edited.json

### How it is counted {#coding-sessions-language-counts}

Each edit that counts for the lines added or deleted adds 1 to the language of its file. The numbers are merged by addition for each language.

<FormulaVersion ids="coding_sessions.language_counts" />

### Languages edited (dashboard) {#metric-languages-top}

The six languages with the most edits over the sessions of the period.

<FormulaVersion ids="metric.languages_top" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** `course_language_share` = edits in the course language ÷ all edits, per student.
- **Example analysis:** Use it for data cleaning: a student with little activity in the course language may have used another editor for the tasks.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "The share of editing activity in the course language was used to check that the logged activity reflected the programming tasks."

## What this data does not show {#limits}

The count is of edits, not of lines or time. The language comes from VS Code, so a Python file saved without the `.py` extension can appear as plain text. It does not show which language the student knows best.

## For the teacher {#teacher}

::: tip In class
If many edits are in plain text, remind students to save their programs with the right file extension. Otherwise VS Code cannot show errors for them.
:::
