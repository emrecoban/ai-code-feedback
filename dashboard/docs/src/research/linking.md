---
title: Linking with external instruments
---

# Linking with external instruments

The pre-test, the post-test and the TAM questionnaire are collected outside the extension. This page explains how to join them with the data of the extension so that the analysis file contains no names.

## The only key: the username {#key}

The extension knows a student only by the username typed at the first sign-in. There is no student number, course code or other sign-in in the system. A new or mistyped username silently creates a second account.

- What students were told to use as username: <Todo>not documented yet</Todo>
- The key table links each username to the student number that is written on the tests. It is kept outside Supabase and outside the repository. <Todo kind="confirm">where it is kept and who can see it</Todo>

## Join steps {#steps}

1. Export the long tables: questions, events and sessions.
2. Apply the [cleaning rules](./cleaning).
3. Aggregate to one row per student (wide format). Each data page gives the rule under "One value per student for SPSS".
4. Map each username to the student number with the key table.
5. Join the pre-test, post-test and TAM scores by the student number.
6. Give every student a participant code (S01, S02 …) and delete the username and the student number from the analysis file.

## Worked example with the synthetic cohort {#example}

S07 typed the username `s07`. The key table gives the student number `SYN-2030-007`. S12 once typed a wrong username (`s12x`), so the key table has two rows with the same number, and rule C3 merges the two accounts.

<LinkingExample part="key" />

After the join, S07 has one row in the wide file. Here is a part of it:

<LinkingExample part="wide" />

The full file is in the [downloads](./codebook).

## Instrument items {#instrument-items}

The pre-test and the post-test have 28 items each (PreQ1 to PreQ28 and PostQ1 to PostQ28), scored 0 or 1. The TAM questionnaire has 19 items (Item1 to Item19) in five constructs: perceived usefulness, subjective norm, behavioral intention, attitude and actual use.

- Content areas of the test: <Todo>not documented yet</Todo>
- Items per TAM construct and the Likert scale: <Todo>not documented yet</Todo> The synthetic data use a 5-point scale and the grouping 1–5, 6–8, 9–12, 13–16 and 17–19 as placeholders.

## Instrument scores {#instrument-scores}

The test score is the sum of the 28 items. The learning gain is the post-test score minus the pre-test score. Each TAM construct is the mean of its items.

<FormulaVersion ids="external.pre_total,external.post_total,external.gain,external.tam_pu,external.tam_sn,external.tam_bi,external.tam_att,external.tam_au" />
