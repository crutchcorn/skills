---
name: sql-like-corbin
description: "Write and review SQL database access using Corbin Crutchley's preferences. Use when implementing ORM queries, composing SQL, replacing per-record database calls with bulk operations, or grouping related database changes in a transaction. Prefer an ORM, safe typed query construction, and atomic user actions; frontend fetching and unrelated database administration do not need this skill."
---

# SQL Like Corbin

Keep database access typed, composable, and safe. Let the database handle work across rows, and keep related changes together so a failure cannot leave half a user action saved.

## Use an ORM where possible

Use an ORM when one can support the task. Start with the project's existing database layer and its supported query, relation, bulk-operation, and transaction APIs. Apply these preferences to the requested work without turning an ordinary query change into a database-layer migration.

When using an ORM, lean into it. Express queries through its supported APIs before reaching for raw SQL. Frequent raw statements bypass the type checking and support that made the ORM useful in the first place.

Use a raw SQL escape hatch when a concrete operation needs capabilities the ORM cannot reasonably express. Keep that boundary narrow and preserve safe parameters and useful input and result types. Do not claim a handwritten type assertion verifies a query against the schema.

When an ORM is not suitable, use the language's type-safe SQL tooling, akin to [Reylo](https://github.com/colinhacks/reylo), with a small set of shared ORM-like functions for safe construction and execution. Reylo illustrates the approach; it is not a required dependency for every language or project. Keep binding and escaping in these shared helpers rather than making each caller construct SQL safely on its own.

## Build statements with functions

Do not derive a query by calling the host language's `replace` or similar text rewriting on another SQL string. Write a function that builds the statement from explicit inputs using the ORM, query builder, or safe SQL composition primitives.

For example, build a shared filter expression for a list query and its count query instead of replacing the list query's `SELECT` text. Compose the relevant clauses so a new join or nested query does not silently change what gets replaced.

Keep values bound as parameters. A helper for injection-safe escaping should delegate to the database library's supported facilities, not implement ad hoc quote replacement. Dynamic identifiers and SQL structure need the library's identifier or composition APIs, or a mapping to known supported choices; value placeholders do not stand in for column names or keywords. Type safety alone does not make string interpolation injection-safe.

## Bundle work across rows

Before putting a query or mutation in a `for` loop, look for a bulk ORM operation or a single SQL statement that expresses the work. The same applies to `map` plus `Promise.all`: concurrent per-record requests still send separate operations to the database.

- Fetch related data with the ORM's relation APIs, joins, or a batched query instead of fetching once per parent row.
- Express filtering, aggregation, and related reads in SQL when that avoids several application-level fetches.
- Use bulk inserts, updates, or deletes for a collection of changes when the database and ORM can represent them together.

Preserve the operation's filters, result shape, and dependencies when combining work. A join that duplicates parent rows or an aggregate that changes which records are included is not an equivalent replacement. When one statement cannot reasonably express the operation, use the smallest useful batch or set of statements and explain the concrete limitation. Do not force unrelated reads together solely to meet a query-count target.

## Make a user action atomic

Identify the database changes that must succeed or fail together for the requested user action. Use one transaction for those chained operations, including dependent reads when needed for the decision. For example, creating an order and its line items should not leave an empty order saved when writing a line item fails.

Pass the transaction-scoped client through participating helpers so every operation belongs to the same transaction. Let a failure abort the transaction; catching an error and continuing to commit defeats the rollback requirement. Bulk operations reduce round trips, but do not replace a transaction when the action still needs multiple statements.

Aim for a single rollback boundary for each user action's related database changes. A database transaction cannot roll back an email, an external API call, or a write to another independent database; identify that boundary rather than promising atomicity it cannot provide.
