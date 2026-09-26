---
title: Debug and task runs
items:
  - coding_sessions.debug_session_count
  - coding_sessions.task_run_count
sample:
  - views/debug-and-task-runs.json#facts.featuredDebug = 24
  - views/debug-and-task-runs.json#facts.featuredTasks = 2
  - views/debug-and-task-runs.json#facts.classDebug = 768
  - views/debug-and-task-runs.json#facts.classTasks = 103
---

# Debug and task runs

## What are debug and task runs? {#what}

Two counters. The first goes up each time a debug session starts in VS Code, which also happens with "Run Without Debugging" in the Run menu. The second goes up each time a VS Code task starts. A program typed as a command into the terminal is neither.

## Example with one student {#example}

S07 started 24 debug runs and 2 task runs in eight weeks. Week 4 had the most debug runs. In the class, debug runs (768) were far more common than task runs (103).

## On the sample data {#visual}

<Figure>
<ClientOnly><SampleVisual view="debug-and-task-runs" /></ClientOnly>
<template #takeaway>The chart shows debug runs. The class starts about four a week. S07 has a clear peak in week 4.</template>
</Figure>

## What it is for {#purpose}

- **Teacher:** Do students use the debugger?
- **Researcher:** How often do students run their programs from VS Code, as far as the extension can see it?

## Raw data sample {#raw}

Two sessions of S07.

`coding_sessions` (some columns):

<<< @/../.vitepress/data/sample/snippets/debug-and-task-runs.json

### Debug runs {#coding-sessions-debug-session-count}

Each debug session started in VS Code adds 1. The extension adds to the counter while the student works and merges it into the session row every 3 minutes.

<FormulaVersion ids="coding_sessions.debug_session_count" />

### Task runs {#coding-sessions-task-run-count}

Each VS Code task started adds 1. The result of the task is recorded on the page "Running the code".

<FormulaVersion ids="coding_sessions.task_run_count" />

## Use in research {#research}

- **Stage:** in the analysis
- **One value per student for SPSS:** `runs_per_hour` = (debug runs + task runs) ÷ active hours, per student.
- **Example analysis:** Describe it next to saves. Do not use it as a full count of program runs.

**Research questions**

No draft research question uses this item as a variable yet.

**Example sentence (Method):** "Runs started from the editor (debug sessions and tasks) were counted, while runs typed into the terminal were not observable."

## What this data does not show {#limits}

The "Run Python File" button of the Python extension runs the program in the terminal and is not counted. So the numbers depend on how each student runs code. A debug run does not mean the student used breakpoints.

## For the teacher {#teacher}

::: tip In class
If almost nobody uses the debugger, a short demo of breakpoints in one lab can be worth the time.
:::
