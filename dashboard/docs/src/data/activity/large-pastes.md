---
title: Large pastes
items:
  - coding_sessions.large_paste_count
  - coding_sessions.large_paste_lines
sample:
  - views/large-pastes.json#facts.featured = 2
  - views/large-pastes.json#facts.withAny = 17
  - views/large-pastes.json#facts.maxStudent = 10
  - views/large-pastes.json#facts.lines = 2538
---

# Large pastes

## What is a large paste? {#what}

A large paste is one edit that adds more than 20 lines at once and removes at most one line. VS Code does not say whether an edit was a paste, so this is an estimate. The pasted text is not sent.

## Example with one student {#example}

S07 made 2 large pastes in eight weeks. In the class, 17 of 25 students made at least one, and one student made 10. Together the class pasted 2538 lines this way.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="large-pastes" /></ClientOnly>
<template #takeaway>Most students paste a large block only a few times in eight weeks. One student stands out with many large pastes.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Is code coming into the tasks from outside?
- **Researcher:** How much of the code was not typed, which may affect the other activity measures?

## Raw data sample {#raw}

One session from the sample with a large paste.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/large-pastes.json

### How a large paste is detected {#coding-sessions-large-paste-count}

One edit event with exactly one change that adds more than 20 lines and removes at most 1 line.

<FormulaVersion ids="coding_sessions.large_paste_count" />

### Large paste lines {#coding-sessions-large-paste-lines}

Sum of the added lines of these edits.

<FormulaVersion ids="coding_sessions.large_paste_lines" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** `large_pastes` per student, and `paste_share` = large paste lines ÷ (lines added + large paste lines).
- **Example analysis:** Use it as a control or for a sensitivity analysis: repeat the main analysis without students with a high paste share.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "Single edits adding more than 20 lines were counted as large pastes and used in a sensitivity analysis."

## What this data does not show {#limits}

The source of the paste is unknown: it can be the student's own older code, a template from the teacher or code from the web. A code template from an extension can look the same. Pastes of 20 lines or less are not counted here.

## For the teacher {#teacher}

::: tip In class
Do not treat a large paste as copying from others. If you give starter code, a paste at the start of the lab is expected.
:::
