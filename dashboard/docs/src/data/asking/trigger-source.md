---
title: Source of the question
items:
  - interactions.trigger_source
sample:
  - views/trigger-source.json#facts.featuredQuestions = 37
  - views/trigger-source.json#facts.featuredDiagnostic = 22
  - views/trigger-source.json#facts.featuredSelection = 15
  - views/trigger-source.json#facts.classDiagnosticPct = 70.8
---

# Source of the question

## What is the source of a question? {#what}

The source says how a help request started: from an error or warning in the code (diagnostic), or from code the student selected (selection). The database also allows runtime, stuck, paste and success, but the extension never sends these values.

## Example with one student {#example}

S07 asked 37 questions in the eight weeks. 22 started from an error message and 15 from selected code. The class asked 70.8% of its questions about errors, so S07 used selections more often than most students.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="trigger-source" /></ClientOnly>
<template #takeaway>Most questions in the class start from an error. S07 asks about selected code more often than most.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students ask mainly about errors, or also about code that works?
- **Researcher:** Through which route do students enter the help system, and do the two routes lead to different hint depths?

## Raw data sample {#raw}

Two questions of S07, one of each kind.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/trigger-source.json

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `share_selection` = selection questions ÷ all questions of the student.
- **Example analysis:** Describe the weekly share of each source, and compare hint depth between error and selection questions with a chi-square test.

**Research questions**

<RqList ids="interactions.trigger_source" />

**Example sentence (Method):** "Each help request was coded by its source: an error or warning shown by the editor, or code selected by the student."

## What this data does not show {#limits}

The source shows where the request started, not what the student intended. A student who selects the line with an error and asks about it counts as a selection. Errors the editor cannot detect, such as logic errors, can only appear as selection questions.

## For the teacher {#teacher}

::: tip In class
If a student almost never asks about selected code, show the class that they can also ask about code that works, for example with "Why does this work?".
:::
