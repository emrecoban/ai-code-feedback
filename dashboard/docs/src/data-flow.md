---
title: Data flow
---

# Data flow

The system has three parts: the VS Code extension on the student's computer, a Supabase project in the EU region, and the dashboard for teachers and researchers. An external AI provider writes the explanations.

## Diagram {#diagram}

<DataFlow part="diagram" />

- The extension writes the student's own rows directly: the account, the consent answers and the coding sessions with their activity counters.
- Help requests go to the server function `explain`. Before the code leaves the computer, the extension masks likely secrets such as keys, passwords and e-mail addresses. The server then asks the AI provider and stores the answer.
- Research events go to the server function `log-event`. They carry only measurements such as times, counts and ratios, never code or typed text.
- The dashboard reads the data only through database functions that check its own session token. When the data changes, a short live signal with the table name tells it to load again.

## Where each category lives {#table}

<DataFlow part="table" />
