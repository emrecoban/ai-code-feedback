---
title: Student panel
items:
  - metric.ext_explanations_asked
  - metric.ext_errors_worked_out
  - metric.ext_days_using
  - metric.ext_activity_totals
sample:
  - views/student-panel.json#facts.explanationsAskedFor = 37
  - views/student-panel.json#facts.daysUsingThis = 11
  - views/student-panel.json#facts.totalActiveHours = 11.7
  - views/student-panel.json#facts.errorsWorkedOutYourself = 22
  - views/student-panel.json#facts.errorsFixedWithoutAsking = 52
---

# Student panel

## What is the student panel? {#what}

The sidebar of the extension shows each student a few numbers about their own work. The extension computes them on the student's computer from the student's own rows. Nothing new is stored for this panel.

## Example with one student {#example}

The panel of S07 at the end of the sample shows 37 explanations asked for, 11 days using this and 11.7 hours of active time. Two numbers are easy to confuse: "Errors you worked out yourself" (22) counts questions where S07 did not open the rule or the fix, and "Errors you fixed without asking" (52) counts errors that went away with no question at all.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="student-panel" /></ClientOnly>
<template #takeaway>The table lists every number of the panel for S07. Each number is described on its own data page.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** What does a student see about their own progress?
- **Researcher:** Which feedback about their own behaviour did students receive, which may itself change the behaviour?

## Raw data sample {#raw}

The panel stores nothing. It reads the student's rows in `interactions` and `coding_sessions`, which are described on the other data pages.

### Explanations asked for {#metric-ext-explanations-asked}

All questions of the student.

<FormulaVersion ids="metric.ext_explanations_asked" />

### Errors you worked out yourself {#metric-ext-errors-worked-out}

Questions of the student that ended at L0–L1. The student still asked for an explanation.

<FormulaVersion ids="metric.ext_errors_worked_out" />

### Days using this {#metric-ext-days-using}

Different calendar dates of the session starts, in the time zone of the student's computer.

<FormulaVersion ids="metric.ext_days_using" />

### Totals over all sessions {#metric-ext-activity-totals}

Sums over all sessions of the student: active time (in hours), lines added, lines deleted, files created and errors fixed without asking.

<FormulaVersion ids="metric.ext_activity_totals" />

## Use in research {#research}

- **Stage:** during the intervention (part of the treatment)
- **One value per student for SPSS:** None. The same values can be computed from the raw data on the other pages.
- **Example analysis:** Describe the panel in the Method section as part of the intervention.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "The extension showed each student a summary panel with their own usage statistics, which was part of the intervention."

## What this data does not show {#limits}

The two error numbers have similar names but measure different things. "Days using this" can differ from the dashboard because it uses the student's time zone. The panel shows all-time totals, so it cannot show change over the weeks.

## For the teacher {#teacher}

::: tip In class
Explain the two error numbers to the class once. Students may otherwise read "Errors you worked out yourself" as errors they solved without the tool.
:::
