---
title: New errors right after a fix
items:
  - coding_sessions.follow_on_error_count
sample:
  - views/follow-on-errors.json#facts.featuredTotal = 8
  - views/follow-on-errors.json#facts.classTotal = 194
  - views/follow-on-errors.json#facts.classFixed = 1255
---

# New errors right after a fix

## What is a new error right after a fix? {#what}

It is an error or warning that appears in a file at the same moment another one there was fixed, or within 60 seconds after it. It separates a change that solved the problem from one that only moved it.

## Example with one student {#example}

S07 had 8 new errors right after a fix in the eight weeks, three of them in week 8. In the whole class, 194 follow-on errors were counted next to 1255 errors fixed without asking.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="follow-on-errors" /></ClientOnly>
<template #takeaway>Follow-on errors are few per week, about one per student. S07 has a peak in week 8.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do fixes create new problems for my students?
- **Researcher:** How often does a change only move the problem instead of solving it?

## Raw data sample {#raw}

Two sessions of S07 with follow-on errors.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/follow-on-errors.json

### How it is counted {#coding-sessions-follow-on-error-count}

Each diagnostic that newly appears in a file adds 1 when, in the same check, another diagnostic there was resolved, or when the last resolution in that file was at most 60 seconds earlier.

<FormulaVersion ids="coding_sessions.follow_on_error_count" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** `follow_on_rate` = follow-on errors ÷ errors fixed (with and without asking), per student.
- **Example analysis:** Compare the rate between early and late weeks, as a sign of more precise changes.

**Research questions**

<RqList ids="coding_sessions.follow_on_error_count" />

**Example sentence (Method):** "Diagnostics appearing within 60 seconds of a resolution in the same file were counted as follow-on errors."

## What this data does not show {#limits}

When an edit moves an error to another line, the code sees a fix and a new error, so the count can be too high. A new error can be unrelated, for example a half-typed line. The 60-second window is a fixed choice.

## For the teacher {#teacher}

::: tip In class
If a student often gets a new error right after a fix, show how to run the program after each small change instead of changing many lines at once.
:::
