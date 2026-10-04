---
title: Fine-tuning data
---

# Fine-tuning data

Since migration 0025, every answer the model writes is also kept as training data. This page explains what is kept, how a question becomes training examples and how to export them. The data is never public. Only admins of the dashboard can see or export it.

## What is kept {#kept}

For every newly generated answer, the server function explain stores one row in [training_samples](../reference/training-samples):

- the system message and the user message exactly as the model received them,
- the same request as separate fields: the redacted code, the focus line, all diagnostics, the languages, the question and the private learner notes,
- the raw answer of the model and the checks it passed,
- the model, the sampling settings and a prompt version.

Answers that came from the cache are not kept, because they were written for another request. The labels are not stored either. They are worked out from what the student did next, each time the data is read.

## Three kinds of question {#capture}

| Kind | What it is | What it can teach |
|---|---|---|
| `full` | The request was stored | The whole answer and every hint level |
| `reduced` | An error question asked before the request was stored | Only L0 and L2, from the error message |
| `none` | A cache hit, or a question about a selection asked before the request was stored | Nothing |

L0 and L2 never depend on the student's code, so they can be rebuilt from the error message alone. L1 and L3 point at the code, so they need the full request.

## Training views {#views}

- **Whole answer** (`sft`): the production messages, with the whole answer as the target, in the order of the output schema.
- **Per level** (`levels`): one example for each of L0, L1, L2 and L3. The user message names the level to write and lists the levels the student has already seen.
- **Good or bad example** (`kto`): the same prompt and answer with a label, for preference training.

Every line of an export is one JSON object (JSONL). With metadata on, a line also carries a `metadata` field: the question id, a student pseudonym (`group`), a fixed `split` (train, validation or test, by student), the prompt version, the model and all labels.

## Labels {#labels}

| Label | Rule |
|---|---|
| Read the answer | On screen for at least 5 seconds, or the student went back to the code |
| Error went away | The extension reported that the error left the file. "No" only after one day |
| Same error again within 10 min | Asked about the same error again within 10 minutes |
| Same concept again within 7 days | Another question on the same concept within 7 days |
| Lowest level that was enough | The error went away after it, with no quick repeat and no undo |
| Example: good or bad | Bad if rated not helpful, still stuck, asked again within 10 minutes or the fix was undone. Otherwise good if rated helpful, solved, or the error went away after a read answer |

Labels can change for 7 days after the question. The export can skip labels that are not final yet.

## What is left out {#excluded}

- questions of students who did not give consent,
- answers from the cache,
- answers where the model said the context was not enough,
- answers whose L2 and L3 were removed after failed checks. Their L0 and L1 stay in the per-level view,
- answers known to have failed. They stay in the good or bad view as bad examples, but never as an example to imitate.

## How to export {#export}

In the dashboard, open Overview, then Export and "Fine-tuning data (.jsonl)". Choose the view and download a file for the selected period. Every export is written to the activity log. To inspect one question first, open it and expand "Fine-tuning data" at the bottom.

## Privacy {#privacy}

The messages contain the student's code after the extension removed keys, tokens and email addresses. Names in comments or strings are not removed. The private learner notes are part of the user message. Remove the metadata before a file leaves the research team, and review the code in it before any release.
