---
code: BIL121-2026F
name: Introduction to Programming
prog_language: python
runtime_note: Python 3.11, standard library only
run_command: python ${file}
error_surface: both
start_date: 2026-09-07
week_length_days: 7
forbidden_concepts: pointers, multithreading, decorators
---

## Week 1: Variables and Output

Concepts:
- variable_assignment: Assigning a value to a variable
- print_statement: Printing output with print()
- data_types_basic: Basic types (int, float, str, bool)

Notes: First week -- students set up the environment and run their first
scripts. Expect syntax errors from missing colons and mismatched
indentation; these are new sources of friction, not sloppiness.

## Week 2: Conditionals

Concepts:
- if_statement: if / elif / else
- boolean_expressions: Comparison and boolean operators
- input_function: Reading input with input()

Notes: Common confusion this week is chained comparisons and using `=`
instead of `==`.

## Week 3: Loops

Concepts:
- for_loop: for loops over a range or sequence
- while_loop: while loops
- off_by_one: Off-by-one errors in loop bounds
- infinite_loop: Infinite loops and how to spot them

Notes: Off-by-one errors on range() bounds are the single most common
error this week -- worth a dedicated explanation path.

## Week 4: Functions

Concepts:
- function_definition: Defining functions with def
- function_parameters: Parameters and arguments
- return_statement: Returning values
- variable_scope: Local vs. global scope

Notes: Scope confusion (expecting a local variable to be visible outside
the function) is the dominant error class this week.

## Week 5: Lists

Concepts:
- list_basics: Creating and indexing lists
- list_iteration: Iterating over a list
- list_mutation: append, insert, remove
- index_error: IndexError and out-of-range access

Notes: Builds directly on Week 3's off_by_one concept -- connect the two
when relevant instead of re-teaching indexing from scratch.

## Week 6: Debugging and Strings

Concepts:
- string_methods: Common string methods (split, strip, join, format)
- traceback_reading: Reading a Python traceback
- type_error: TypeError from mixing incompatible types

Notes: This week is explicitly about reading error output, not new
syntax -- the traceback_reading concept should be used generously when
the trigger is a runtime crash rather than a static diagnostic.
