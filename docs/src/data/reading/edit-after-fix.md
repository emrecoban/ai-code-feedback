---
title: First edit after the fix
items:
  - event.post_feedback_edit
  - event.post_feedback_edit.overlapRatio
  - event.post_feedback_edit.editedLineDistance
  - metric.after_edited
  - metric.after_on_line_pct
  - metric.after_overlap_avg
sample:
  - views/edit-after-fix.json#facts.featuredEdited = 9
  - views/edit-after-fix.json#facts.featuredOverlapPct = 60
  - views/edit-after-fix.json#facts.overlapPct = 53
  - views/edit-after-fix.json#facts.onLinePct = 84.5
---

# First edit after the fix

## What is the first edit after the fix? {#what}

When a student opens the fix (L3), the extension watches the next edit in the same file for five minutes. It stores two numbers: how similar the new text is to the suggested fix, and how far from the pointed line the edit landed. The text itself is not sent.

## Example with one student {#example}

S07 edited the code after 9 fixes. The average similarity of the new text to the suggested fix was 60%. In the class the average was 53%, and 84.5% of the edits landed within two lines of the pointed line.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="edit-after-fix" /></ClientOnly>
<template #takeaway>Most first edits have a similarity between 0.4 and 0.8 to the suggested fix. S07 is in the 0.6–0.8 group.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students copy the fix as it is, or do they write their own change?
- **Researcher:** How closely does the student's action follow the feedback?

## Raw data sample {#raw}

One event of S07.

`events`:

<<< @/../.vitepress/data/sample/snippets/edit-after-fix.json

### How similarity is computed {#event-post-feedback-edit-overlapratio}

Jaccard overlap of the lower-case word tokens (letters, digits, underscore) of the inserted text and of the suggested change: shared tokens divided by all distinct tokens. 0 means nothing in common, 1 means the same tokens.

<FormulaVersion ids="event.post_feedback_edit.overlapRatio" />

### How the distance is computed {#event-post-feedback-edit-editedlinedistance}

Lines from the line the explanation was about to the nearest edge of the changed range. 0 means an edit on the pointed line.

<FormulaVersion ids="event.post_feedback_edit.editedLineDistance" />

### Edited the code (dashboard) {#metric-after-edited}

Distinct questions of the period with this event.

<FormulaVersion ids="metric.after_edited" />

### Within 2 lines of the pointed line (dashboard) {#metric-after-on-line-pct}

Questions whose edit landed at most 2 lines away, divided by questions with this event.

<FormulaVersion ids="metric.after_on_line_pct" />

### Similar to the suggested fix (average, dashboard) {#metric-after-overlap-avg}

100 times the mean similarity, rounded to a whole number.

<FormulaVersion ids="metric.after_overlap_avg" />

## Use in research {#research}

- **Stage:** during the intervention and in the analysis
- **One value per student for SPSS:** `mean_overlap` and `on_line_share` per student, over the questions that reached the fix.
- **Example analysis:** Correlate the mean similarity with the learning gain: high copying with low gain can point to passive use of the fix.

**Research questions**

<RqList ids="event.post_feedback_edit.overlapRatio,metric.after_overlap_avg" />

**Example sentence (Method):** "After the fix was revealed, the similarity between the student's next edit and the suggested change was computed as a token-based Jaccard index."

## What this data does not show {#limits}

Only the first qualifying edit is measured, so a fix typed in several steps looks less similar than it is. A fix pasted into another file is not seen. Similarity of words does not show understanding: a student can type the fix without knowing why it works.

## For the teacher {#teacher}

::: tip In class
If a student's edits almost always match the fix word for word, ask them to explain the change in their own words before the next task.
:::
