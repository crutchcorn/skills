# Test decisions

Read this reference when deciding whether a proposed test is valuable or where to put its boundary. These examples illustrate the preferences; they do not require identical setups in every project.

## Form submission loses user input after a failed request

Render the page with the real form and submit it using labeled controls. Intercept the HTTP request with MSW to return a realistic failure. Assert that the user sees an actionable error, retains their input, and can retry successfully.

This is a browser integration test. It exercises the relevant behavior without requiring a deployed backend. Do not replace the submission hook or child inputs with mocks, or assert the component's internal loading flag.

## A recurrence calculation skips a date around a timezone transition

Use narrow unit tests for the complex calculation, with explicit dates and the domain invariant. Assert the resulting occurrences, not which date-library helper was called. Add a page or API integration case only if the bug also involves converting or displaying the result at that boundary.

The internal test earns its place because it prevents a difficult regression, even though it does not render a page.

## Several form failures share setup

Prefer separately named cases such as "retains input after a server error" and "focuses the first invalid field" when they exercise different user outcomes. Repeat a few setup or interaction lines if that keeps each scenario readable. Avoid a loop with conditionals that makes readers reconstruct which assertions belong to which case.

A small parameter table is useful when every row tests the same invariant, such as a pure parser rejecting several invalid values. Choose it because the cases become clearer, not simply because it reduces line count.

## A database constraint allows duplicate registrations under contention

Exercise the application operation against real disposable PostgreSQL and assert the duplicate is rejected in the intended way. Include the relevant concurrency when it is the source of the failure. A mocked repository returning a duplicate error cannot prove that the constraint or transaction behaves correctly.

## A provisional component interface is being redesigned

Skip new tests of prop shapes, child markup, and temporary helper APIs. If the work fixes a stable user-facing failure, test that outcome through the page. If it only reorganizes a temporary implementation, existing checks and inspection may be sufficient.

## A heading, spacing rule, or static illustration changes

Inspect the result and run relevant existing checks. Do not add DOM snapshots or screenshot tests for this change by default. A specific request for screenshot coverage permits it; merely changing the appearance does not.

## Login depends on a callback from an external identity provider

Use integration tests for application behavior that can be checked at the HTTP or provider boundary. If the reported failure concerns the actual cross-system redirect or callback configuration, focused end-to-end coverage may be justified. Do not expand every login assertion into a full-system test just because one flow needs it.
