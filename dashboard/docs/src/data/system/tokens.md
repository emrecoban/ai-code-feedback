---
title: Tokens used
items:
  - interactions.prompt_tokens
  - interactions.completion_tokens
  - metric.tokens_used
sample:
  - views/tokens.json#facts.total = 1977570
  - views/tokens.json#facts.prompt = 1502433
  - views/tokens.json#facts.completion = 475137
  - views/tokens.json#facts.perAnswer = 2302
---

# Tokens used

## What are tokens? {#what}

Tokens are the units in which an AI provider counts text. Each answer stores the tokens of the request (prompt) and of the answer (completion), as the provider reported them. The cost of the service depends on them.

## Example with one student {#example}

In the sample the class used 1,977,570 tokens: 1,502,433 for requests and 475,137 for answers. A generated answer used 2,302 tokens on average.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="tokens" /></ClientOnly>
<template #takeaway>Tokens follow the number of questions: most in week 3, fewest in week 8.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** How much does the service cost for my class?
- **Researcher:** What are the running costs, for a report on the feasibility of the approach?

## Raw data sample {#raw}

One generated answer of S07.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/tokens.json

### Tokens used (dashboard) {#metric-tokens-used}

Sum of the request and answer tokens of the questions of the period, also per time slot and per provider.

<FormulaVersion ids="metric.tokens_used" />

## Use in research {#research}

- **Stage:** in the analysis (data quality and Method section)
- **One value per student for SPSS:** Not needed per student. Report the total and the mean per answer.
- **Example analysis:** Estimate the cost per student and course from the provider's price per token.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "The token usage reported by the AI provider was used to estimate the running cost per student."

## What this data does not show {#limits}

Only the last successful call is stored, so a repair call or a failed first call is not counted and the real cost is higher. The fallback provider may count tokens in another way. The AI learning summaries are not included.

## For the teacher {#teacher}

::: tip In class
This page is mainly for the people who run the service. For teaching, the number of questions is more useful.
:::
