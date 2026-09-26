---
title: Selection size
items:
  - interactions.selection_line_count
  - interactions.selection_char_count
sample:
  - views/selection-size.json#facts.featuredSelections = 15
  - views/selection-size.json#facts.featuredMedian = 18
  - views/selection-size.json#facts.classMedian = 5
  - views/selection-size.json#facts.missing = 22
---

# Selection size

## What is the selection size? {#what}

The selection size is how much code the student highlighted before asking, in lines and in characters. It is empty for error questions, and for questions asked without a selection.

## Example with one student {#example}

S07 asked 15 questions about selected code. The median selection was 18 lines, while the class median was 5 lines. A small selection often means a precise idea of where the problem is, and a large one means the student does not know yet.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="selection-size" /></ClientOnly>
<template #takeaway>Most selections are short. S07 usually selects whole blocks of code.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students point at the exact place of a problem, or at a large block?
- **Researcher:** Does the precision of the question change over the weeks, and does it relate to hint depth?

## Raw data sample {#raw}

Two selection questions of S07.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/selection-size.json

### How the line count is computed {#interactions-selection-line-count}

Last line of the selection minus first line, plus 1. An empty selection gives no value, not 0.

<FormulaVersion ids="interactions.selection_line_count" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** `median_selection_lines` per student, over the questions that have a selection.
- **Example analysis:** Compare the median selection size of the first and the last weeks with a Wilcoxon signed-rank test.

**Research questions**

<RqList ids="interactions.selection_line_count" />

**Example sentence (Method):** "The number of selected lines was used as an indicator of how precisely the student located the problem."

## What this data does not show {#limits}

The size depends on the task: a question about a whole function needs a large selection. The sidebar button can ask without any selection, which gives no value (22 questions in the sample). Line count is a rough proxy for precision, not a measure of understanding.

## For the teacher {#teacher}

::: tip In class
If students always select large blocks, show how to narrow a problem down first, for example by printing a value or by commenting out lines.
:::
