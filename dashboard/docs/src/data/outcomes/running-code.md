---
title: Running the code
items:
  - event.run_finished
  - event.run_finished.exitCode
  - event.run_finished.success
  - metric.runs
sample:
  - views/running-code.json#facts.featuredRuns = 2
  - views/running-code.json#facts.runs = 103
  - views/running-code.json#facts.debugRuns = 768
---

# Running the code

## What is recorded about running the code? {#what}

When a VS Code task finishes, the extension records its exit code and whether it ended without error. A program started by typing a command into the terminal, or with the usual "Run Python File" button, is not a task and is not seen.

## Example with one student {#example}

S07 ran a task 2 times in eight weeks. Like most students, S07 ran programs with the Run button or the debugger, which the task events do not capture. In the class, 103 task runs were recorded next to 768 debug runs.

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="running-code" /></ClientOnly>
<template #takeaway>Task runs are rare next to debug runs. About six in ten task runs end without error.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students test their programs after a change?
- **Researcher:** Does a run after an explanation end without error more often?

## Raw data sample {#raw}

One event from the sample.

`events`:

<<< @/../.vitepress/data/sample/snippets/running-code.json

### Ended without error {#event-run-finished-success}

True when the exit code of the task is 0.

<FormulaVersion ids="event.run_finished.success" />

### Running the code (dashboard) {#metric-runs}

Runs of the period, runs without error, runs within 15 minutes after a question in the same session, and how many of those ended without error.

<FormulaVersion ids="metric.runs" />

## Use in research {#research}

- **Stage:** in the analysis (only if the course uses VS Code tasks)
- **One value per student for SPSS:** `task_runs` and `task_success_share` per student.
- **Example analysis:** Describe only. The measure is too incomplete for inference unless the course runs all programs as tasks.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "Program runs were observable only when started as VS Code tasks, so they were reported descriptively."

## What this data does not show {#limits}

Most beginner programs are not started as tasks, so this data misses most runs. The dashboard subtitle "Runs in the terminal" overstates what is observed. An exit code of 0 only means the program did not crash, not that its output was correct.

## For the teacher {#teacher}

::: tip In class
Do not read a low number of runs as a lack of testing. Ask students directly how they run their programs.
:::
