---
title: Answered from cache
items:
  - interactions.cache_hit
  - explanations.reuse_count
  - metric.cache_rate
sample:
  - views/cache.json#facts.hits = 69
  - views/cache.json#facts.questions = 928
  - views/cache.json#facts.ratePct = 7.4
  - views/cache.json#facts.cacheRows = 868
  - views/cache.json#facts.reusedRows = 63
---

# Answered from cache

## What is an answer from the cache? {#what}

When an earlier answer exists for the same language, question type, error and code, the server sends that answer again instead of asking the AI model. In the error, numbers and quoted text are replaced first. In the code, comments and extra spaces are removed first.

## Example with one student {#example}

In the sample, 69 of 928 questions (7.4%) were answered from the cache. The cache held 868 answers, and 63 of them were used again at least once.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="cache" /></ClientOnly>
<template #takeaway>Few answers come from the cache, because students' code is rarely identical.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Did students get the same answer as a classmate?
- **Researcher:** Which answers were not personalised, which matters for the private notes and the analysis?

## Raw data sample {#raw}

One cached answer (the text of the answer is not shown).

`explanations` (some columns):

<<< @/../.vitepress/data/sample/snippets/cache.json

### Times reused {#explanations-reuse-count}

Goes up by one on every answer from the cache. Hits before migration 0022 (a bug fix) were not counted.

<FormulaVersion ids="explanations.reuse_count" />

### Answered from cache (dashboard) {#metric-cache-rate}

Questions of the period answered from the cache, divided by all questions of the period, also per provider.

<FormulaVersion ids="metric.cache_rate" />

## Use in research {#research}

- **Stage:** in the analysis (data quality and Method section)
- **One value per student for SPSS:** `cache_share` per student, if you want to control for answers that were not personalised.
- **Example analysis:** Run a sensitivity analysis without answers from the cache.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "Answers served from the cache were identified and excluded in a sensitivity analysis."

## What this data does not show {#limits}

An answer from the cache was written for another question, possibly of another student, and does not use the private notes of the current student. Cached answers do not count toward the next rewrite of the notes. Old hits before the bug fix are missing from the reuse count.

## For the teacher {#teacher}

::: tip In class
When several students get the same answer, they probably made the same error in the same task. It can be worth one explanation for the whole class.
:::
