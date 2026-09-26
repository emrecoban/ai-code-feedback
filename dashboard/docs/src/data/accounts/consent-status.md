---
title: Consent
items:
  - profiles.consent_status
  - profiles.consent_at
  - consent_log.status
  - consent_log.version
sample:
  - views/consent-status.json#facts.featuredTime = 10:07
  - views/consent-status.json#facts.version = 2026-08-v1
  - views/consent-status.json#facts.granted = 27
  - views/consent-status.json#facts.accounts = 28
  - views/consent-status.json#facts.declined = 1
---

# Consent

## What is the consent status? {#what}

The consent status is the answer of a student to the consent notice of the extension: pending, granted or declined. The notice opens at the first sign-in, before the first question. Every answer is also written to a log, together with the version of the notice text.

## Example with one student {#example}

S07 signed in for the first time in the first lab, at 10:07. The consent notice opened and S07 clicked "I agree". The profile now says granted, and the log keeps one row with the text version 2026-08-v1. If S07 had closed the notice without an answer, the status would stay pending and the notice would open again before the next question.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="consent-status" /></ClientOnly>
<template #takeaway>In the sample, 27 of 28 accounts granted consent and 1 declined.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Which students have answered the consent notice?
- **Researcher:** Which accounts may enter the analysis, and under which version of the consent text?

## Raw data sample {#raw}

The status is stored in two tables. These rows belong to S07.

`profiles` (some columns):

<<< @/../.vitepress/data/sample/snippets/consent-status.profiles.json

`consent_log`:

<<< @/../.vitepress/data/sample/snippets/consent-status.consent_log.json

## Use in research {#research}

- **Stage:** design and analysis (defining the sample)
- **One value per student for SPSS:** `consent` coded 1 = granted, 2 = declined, 3 = pending, and `consent_version` as text.
- **Example analysis:** Report the number of accounts per status in the participant flow, and keep only granted accounts (cleaning rule C1).

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "Only students who granted consent in the extension (consent text version 2026-08-v1) were included in the analysis."

## What this data does not show {#limits}

The status records an answer to the notice, not whether the student read or understood it. It does not replace the signed consent of the study. Before any analysis, check which data exists for declined and pending accounts, and remove it (cleaning rule C1).

## For the teacher {#teacher}

::: tip In class
If some students are still pending, remind the class that the notice opens again before the next question and that both answers are fine. Do not ask a student to explain the choice.
:::
