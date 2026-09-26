---
title: Ethics and data protection
---

# Ethics and data protection

::: warning Draft
This page is not published yet. Some points are still open and are marked as TODO or CONFIRM.
:::

This page explains, in plain words, what the AI Code Feedback extension records about you, why, where it is kept and who can see it.

## What is recorded and why {#what}

- **Your account:** the username you type at the first sign-in, your feedback language and your answer to the consent question.
- **Your questions:** each time you ask for help, the error message, the file name, the size of the selected code, the steps of the explanation you opened and your answers to the short questions under it (helpful, solved, could do it alone). If you write your own question, its text is stored (at most 300 characters). Your code is sent to the AI provider to write the explanation but is not stored. The explanation can quote parts of it.
- **How you work:** counts and times, for example active time, lines added, saves, breaks and errors that went away. The extension does not send your code for this.
- **Summaries:** short texts that the AI writes about your recent questions.

The data has two purposes: to give you better feedback, and to study how on-demand help changes the way students learn to program. The page [Data at a glance](./data-at-a-glance) lists every item.

## Legal framework {#law}

The study follows the General Data Protection Regulation (GDPR) for the data collected in Spain and the Turkish Personal Data Protection Law (KVKK) for the data collected in Türkiye.

- Data controller: <Todo kind="confirm">from the ethics application</Todo>
- Ethics committee approval in Spain: <Todo>committee name and approval number</Todo>
- Ethics committee approval in Türkiye: <Todo>committee name and approval number</Todo>

## Where the data is kept {#where}

- The data is stored in a Supabase project in the European Union.
- To write an explanation, the server sends your question and the redacted code to the AI provider Doubleword.ai. Before the code leaves your computer, the extension masks likely secrets such as keys, passwords and e-mail addresses. <Todo kind="confirm">where Doubleword.ai processes the data (inside or outside the EU)</Todo>
- Retention period and deletion: <Todo>from the ethics application</Todo>

## Who can see it {#access}

- You can see your own questions, summaries and statistics in the extension.
- The teacher and the researchers see the data in the dashboard. Dashboard accounts have the role admin or viewer. <Todo>who holds which role</Todo>
- The dashboard shows your username. In the files used for analysis, the username is replaced by a code such as S07 (see [Linking with external instruments](./research/linking)).
- An explanation is kept in a shared answer cache and can be shown to another student who asks the same question. The cache has no student id, but an explanation can quote parts of an error message or of code.

## Consent and withdrawal {#consent}

- How consent was obtained: <Todo>not documented yet</Todo>
- The extension asks for your consent at the first sign-in and records your answer with the version of the consent text. <Todo>I-01</Todo>
- You can withdraw from the panel of the extension at any time, and withdrawal deletes your stored interaction history. <Todo>I-02</Todo>

## Contact {#contact}

Emre Çoban, e.coban.2024@alumnos.urjc.es. Data protection officer: <Todo>institutional contact</Todo>
