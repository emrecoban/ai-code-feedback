---
title: Feedback language
items:
  - profiles.feedback_language
  - event.feedback_language_changed
  - event.feedback_language_changed.from
  - event.feedback_language_changed.to
sample:
  - views/feedback-language.json#facts.featuredLanguage = en
  - views/feedback-language.json#facts.exampleStudent = S03
  - views/feedback-language.json#facts.exampleFrom = en
  - views/feedback-language.json#facts.exampleTo = tr
  - views/feedback-language.json#facts.exampleWeek = 2
  - views/feedback-language.json#facts.tr = 20
  - views/feedback-language.json#facts.en = 4
  - views/feedback-language.json#facts.es = 1
  - views/feedback-language.json#facts.changes = 3
---

# Feedback language

## What is the feedback language? {#what}

The feedback language is the language in which a student reads the extension and the AI explanations: English, Turkish or Spanish. Each student chooses it, so students who share a lab computer can use different languages. Every change is also logged as an event.

## Example with one student {#example}

S07 chose English at the first sign-in and never changed it. S03 started in English and switched to Turkish in week 2. The profile keeps only the current language, so the event log is the only place where the switch is visible.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="feedback-language" /></ClientOnly>
<template #takeaway>At the end of the sample, 20 students use Turkish, 4 English and 1 Spanish. 3 students switched once.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** In which language does each student read the explanations?
- **Researcher:** Does the feedback language, or a switch to the first language, relate to how students use the hints?

## Raw data sample {#raw}

The current language is in the profile. The change is an event (here the switch of the example student).

`profiles` (some columns):

<<< @/../.vitepress/data/sample/snippets/feedback-language.profiles.json

`events`:

<<< @/../.vitepress/data/sample/snippets/feedback-language.event.json

## Use in research {#research}

- **Stage:** design (grouping) and analysis
- **One value per student for SPSS:** `feedback_language` as a nominal variable (1 = English, 2 = Turkish, 3 = Spanish) and `language_changes` as the number of change events.
- **Example analysis:** Compare hint depth between language groups with a Kruskal–Wallis test, because the groups are small.

**Research questions**

<RqList ids="profiles.feedback_language" />

**Example sentence (Method):** "Students chose the language of the feedback (English, Turkish or Spanish) in the extension, and every later change was logged."

## What this data does not show {#limits}

The profile stores only the current language. The language of an older question can be rebuilt only from the change events, and only for changes made while the student was signed in. A switch can reflect comprehension, but also curiosity or a shared computer.

## For the teacher {#teacher}

::: tip In class
If a student switches to the first language after a hard week, the task may have been difficult. Ask about the task, not about the language.
:::
