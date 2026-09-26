---
title: Rating
items:
  - interactions.helpful_rating
  - metric.rated_helpful_pct
sample:
  - views/helpful-rating.json#facts.featuredUp = 18
  - views/helpful-rating.json#facts.featuredDown = 2
  - views/helpful-rating.json#facts.ratedHelpfulPct = 81
---

# Rating

## What is the helpful rating? {#what}

Under each explanation the student can answer "Was this helpful?" with one click: Yes (1) or Not really (−1). The answer is optional. No answer leaves the value empty.

## Example with one student {#example}

S07 rated 18 explanations as helpful and 2 as not helpful, and left the rest without an answer. In the class, 81% of the given ratings were "Helpful".

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="helpful-rating" /></ClientOnly>
<template #takeaway>About half of the answers get no rating. When students rate, most ratings are "Helpful".</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students find the explanations helpful?
- **Researcher:** How do students judge the feedback, and does their judgement relate to what they did next?

## Raw data sample {#raw}

Two rated questions of S07.

`interactions` (some columns):

<<< @/../.vitepress/data/sample/snippets/helpful-rating.json

### Rated helpful (dashboard) {#metric-rated-helpful-pct}

Ratings of 1 divided by all given ratings (1 and −1) in the period. Questions without a rating are left out.

<FormulaVersion ids="metric.rated_helpful_pct" />

## Use in research {#research}

- **Stage:** during the intervention and after it
- **One value per student for SPSS:** `helpful_share` = ratings of 1 ÷ given ratings, and `rating_rate` = given ratings ÷ questions, per student. Missing: −97 when no rating was given.
- **Example analysis:** Correlate the helpful share with the TAM perceived usefulness score (Spearman).

**Research questions**

<RqList ids="interactions.helpful_rating,metric.rated_helpful_pct" />

**Example sentence (Method):** "After each explanation, students could rate its helpfulness with one click, and unanswered ratings were treated as missing."

## What this data does not show {#limits}

The rating is optional, so the students and moments with a rating may differ from the rest. There is no time stamp for the answer, and a later answer from the history list replaces the first one. "Helpful" is a feeling, not a learning outcome.

## For the teacher {#teacher}

::: tip In class
Read the explanations rated "Not helpful" in the dashboard. A pattern, such as one topic, can show where your own explanation in class can add most.
:::
