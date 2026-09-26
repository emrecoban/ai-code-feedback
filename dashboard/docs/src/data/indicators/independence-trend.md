---
title: Independence trend
items:
  - metric.pct_offers_taken
  - metric.pct_hint_enough_weekly
  - metric.pct_sessions_without_help_weekly
  - metric.analytics_dependency_trend
sample:
  - views/independence-trend.json#featuredRows.0.help_offers = 7
  - views/independence-trend.json#featuredRows.0.from_errors = 5
  - views/independence-trend.json#featuredRows.0.questions = 6
  - views/independence-trend.json#featuredRows.7.help_offers = 17
  - views/independence-trend.json#featuredRows.7.from_errors = 1
  - views/independence-trend.json#featuredRows.7.sessions_without_help = 2
  - views/independence-trend.json#featuredRows.2.sessions_without_help = 1
  - views/independence-trend.json#analysis.early.mean = 47.5
  - views/independence-trend.json#analysis.late.mean = 24.1
  - views/independence-trend.json#analysis.pairedT.t = -5.39
  - views/independence-trend.json#analysis.gainCorrelation.r = 0.07
---

# Independence trend

## What is the independence trend? {#what}

The independence trend is a set of three weekly rates. Together they show whether a student asks for help less often and needs fewer hint steps as the weeks go on. The research dashboard shows it for one student and for the whole class, over the last 12 weeks.

## Example with one student {#example}

S07 is a fictional student in the sample. In week 1, the extension offered help on 7 errors, and S07 asked about 5 of them. S07 opened the rule or the fix in 5 of 6 questions, so the hint was enough only once. By week 8 the picture changed. The extension offered help on 17 errors, and S07 asked about only 1. In week 3, S07 opened a second VS Code window without working in it. That window created an empty session, so half of the sessions that week count as sessions without help.

## On the sample data {#visual}

<Figure>
<ClientOnly><IndependenceTrend /></ClientOnly>
<template #takeaway>S07 starts above the class in asking for help and ends below it, while the first hint is enough more often.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Is my class starting to solve errors alone as the weeks go on?
- **Researcher:** Does help-seeking fall, and does the first hint suffice more often over the weeks, for the class and for each student?

## Raw data sample {#raw}

The trend uses two tables. These rows belong to S07 in week 3. Only the columns the formulas read are shown.

`coding_sessions` (the second row is the empty session of the second window):

<<< @/../.vitepress/data/sample/snippets/independence-trend.sessions.json

`interactions`:

<<< @/../.vitepress/data/sample/snippets/independence-trend.interactions.json

The dashboard function `dashboard.weekly_trend` returns one row per week. This is S07 in week 3:

<<< @/../.vitepress/data/sample/snippets/independence-trend.week.json

Weeks run from Monday to Sunday in the viewer's time zone. The dashboard shows the 12 weeks that end with the last week of the selected period.

### Asked for help when offered {#offers-taken}

Questions about errors created in the week, divided by the help offers counted in the sessions that started in the week, times 100. The value is capped at 100%. A week without offers has no value.

<FormulaVersion ids="metric.pct_offers_taken" />

### Hint was enough {#hint-enough}

Questions of the week in which the student opened neither the rule (L2) nor the fix (L3), divided by all questions of the week, times 100. A week without questions has no value.

<FormulaVersion ids="metric.pct_hint_enough_weekly" />

### Sessions without help {#sessions-without-help}

Sessions that started in the week and contain no question, divided by all sessions that started in the week, times 100. A week without sessions has no value.

<FormulaVersion ids="metric.pct_sessions_without_help_weekly" />

### The SQL report {#sql-report}

The file `supabase/analytics/dependency_trend.sql` builds a similar weekly table by hand in the SQL editor. It puts each question in the week of its session, uses UTC weeks and does not cap the first rate at 100%. Its values can therefore differ from the dashboard.

<FormulaVersion ids="metric.analytics_dependency_trend" />

## Use in research {#research}

- **Stage:** during the intervention (weekly monitoring) and in the analysis.
- **One value per student for SPSS:** pool the counts first, then divide. For example, `offers_taken_early` = 100 × (error questions in weeks 1 and 2) ÷ (help offers in weeks 1 and 2), capped at 100. Compute `offers_taken_late` the same way for weeks 7 and 8, and use the difference as a change score. Do not average the weekly percentages, because a week with one question would weigh as much as a week with ten.
- **Example analysis:** a paired t-test of `offers_taken_early` and `offers_taken_late`, and a correlation of the change score with the learning gain from pre-test to post-test. In the synthetic sample, the mean fell from 47.5% to 24.1%, t(24) = −5.39, p < .001, and the change score did not correlate with the gain, r(23) = .07, p = .744.

**Research questions**

<RqList ids="metric.pct_offers_taken,metric.pct_hint_enough_weekly,metric.pct_sessions_without_help_weekly" />

**Example sentence (synthetic numbers):** "Help-seeking was measured as the share of offered errors that the student asked about (dashboard formula, version 1.0), pooled over weeks 1 and 2 and over weeks 7 and 8. The share fell from 47.5% (SD = 27.4) to 24.1% (SD = 22.5), t(24) = −5.39, p < .001, dz = −1.08."

## What this data does not show {#limits}

The rates describe what students did inside the extension, not what they learned. A falling rate of asking can mean growing independence, but it can also mean easier tasks, less time in the lab, or help from classmates or browser AI tools. Help offers count only the errors marked with an icon in the active editor (at most three per file), so the base of the first rate is incomplete. Empty sessions from extra VS Code windows raise the share of sessions without help, and weeks with only one or two questions give unstable rates.

## For the teacher {#teacher}

::: tip In class
If the class line for "Asked for help when offered" stays high after the first weeks, read two or three common error messages together and show where each one points. If one student's line rises again, ask how the current task is going. The trend shows a change, not its cause.
:::
