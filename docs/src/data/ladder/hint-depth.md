---
title: Hint depth
items:
  - interactions.max_level_reached
  - metric.hint_depth_distribution
sample:
  - views/hint-depth.json#facts.featuredQuestions = 37
  - views/hint-depth.json#facts.featuredHint = 22
  - views/hint-depth.json#facts.featuredRule = 5
  - views/hint-depth.json#facts.featuredFix = 10
  - views/hint-depth.json#facts.classFixPct = 28.8
  - views/hint-depth.json#facts.levelOne = 0
---

# Hint depth

## What is the hint depth? {#what}

Every answer is a ladder of four steps. Decode (L0) and Locate (L1) appear together. The rule (L2) and the fix (L3) open only when the student clicks. The hint depth is the highest step the student opened: 0 for L0–L1, 2 for the rule and 3 for the fix.

## Example with one student {#example}

S07 asked 37 questions. 22 ended after L0–L1, 5 at the rule and 10 at the fix. In the early weeks S07 often opened the fix. Later S07 more often stopped after the first two steps.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="hint-depth" /></ClientOnly>
<template #takeaway>In the class, 28.8% of the questions reached the fix. S07 looks like the class as a whole.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** How often do students need the full fix, and how often is a hint enough?
- **Researcher:** How far do students go down the ladder, and does the depth change over the weeks?

## Raw data sample {#raw}

Two questions of S07: one ended after L0–L1, one reached the fix.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/hint-depth.json

### How far students went into the hints (dashboard) {#metric-hint-depth-distribution}

Questions of the period in three groups: hint only (depth 0 or 1), rule (2) and fix (3).

<FormulaVersion ids="metric.hint_depth_distribution" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `fix_share` = questions with depth 3 ÷ all questions, per student. Keep the counts per level too.
- **Example analysis:** Test the change in fix share from weeks 1–4 to weeks 5–8 with a paired t-test, or model depth per question with a mixed ordinal regression (student as random effect).

**Research questions**

<RqList ids="interactions.max_level_reached,metric.hint_depth_distribution" />

**Example sentence (Method):** "Hint depth was coded as the highest level of the four-step hint ladder that the student opened for each request (L0–L1, L2 or L3)."

## What this data does not show {#limits}

The value 1 is never stored (0 rows in the sample), because L0 and L1 always appear together. Opening a step does not mean reading it, and not opening the fix does not mean the student solved the problem. A student can open steps later, when the explanation is reopened from the history list.

## For the teacher {#teacher}

::: tip In class
If a student opens the fix for almost every question, talk about using the first two steps first. If the whole class needs the fix for one task, the task may need more support in class.
:::
