# Automated Testing Documentation

## Purpose

Automated testing is used to check that important frontend behaviour continues to work after changes are made.

The tests make it quicker to check the frontend and give the same result each time, instead of manually checking every feature in the browser.

The tests focus on:

- API requests
- Page navigation
- Authentication
- Spotify connection behaviour
- Dashboard rendering
- Dashboard refresh behaviour
- Error handling
- The critical frontend user journey

## Testing tools

The frontend tests use:

- Vitest as the testing framework
- jsdom as the simulated browser environment
- Supertest for the existing backend health-check test
- Mocked API responses for frontend tests

jsdom provides a browser-like environment for code that uses:

- `document`
- Forms
- Events
- Buttons
- DOM updates

The tests do not require real Spotify credentials or a live Spotify account.

## Running the tests

Run the complete test suite with:
```bash
npm test -- --run
```

The latest complete test run completed with:
```text
7 test files passed
23 tests passed
0 tests failed
```

## Test files

### `tests/api.test.js`

This file contains five tests:

- Login uses the correct endpoint, method, request body, and cookies.
- Registration sends the expected user details.
- Backend authentication errors are reported.
- The requested top-artist limit is included in the request.
- Network failures are reported.

The tests mock `fetch` so that the API client can be checked without sending real backend requests.

### `tests/navigation.test.js`

This file contains three tests:

- The About button returns `about.html`.
- The Login button returns `auth.html`.
- An unknown button returns no page.

The navigation decision is tested separately from the browser redirect. This makes the function easier to test.

### `tests/connect.test.js`

This file contains two tests:

- Normal mode redirects to the backend Spotify route.
- Demo mode redirects to the demo dashboard.

The tests also check that:

- The connection button becomes disabled.
- The button text changes.
- The correct status message is displayed.

### `tests/dashboard.test.js`

This file contains six tests:

- Statistics returned by the backend are displayed.
- Empty artist and track states are displayed.
- A failed backend request displays an error state.
- Tracks without artist names are handled safely.
- Statistics are updated after a successful refresh.
- A failed refresh displays an error and re-enables the button.

These tests cover successful, empty, failed, and incomplete dashboard data.

### `tests/auth.test.js`

This file contains five tests:

- Successful login calls the API and redirects.
- Failed login displays the backend error.
- Successful registration is followed by automatic login.
- Registration failure displays an error and does not log the user in.
- A failed automatic login displays a fallback message after registration succeeds.

The API is mocked so that these tests focus on the authentication page rather than real backend authentication.

### `tests/userJourney.test.js`

This file contains one larger critical-flow test.

It combines the main frontend modules in this journey:
```text
Login
    -> Spotify connection
    -> mocked dashboard responses
    -> rendered dashboard statistics
```

The test uses the actual frontend authentication, connection, and dashboard modules while mocking external API responses.

It checks that the main frontend modules work together rather than checking only isolated functions.

This is an integration-style frontend test, not a full browser end-to-end test, because it uses jsdom and does not perform real Spotify OAuth.

### `tests/backend.test.js`

This file contains one supporting test for the existing backend health response.

It checks that the backend health route returns a successful response with the expected status.

This test supports the frontend/backend integration but does not test the backend's internal authentication, Spotify, database, or history-import logic.

## Test levels

The test suite covers several levels of testing:

- **Focused tests:** `tests/api.test.js` and `tests/navigation.test.js` check individual API and navigation behaviours.
- **Page and DOM tests:** `tests/auth.test.js`, `tests/connect.test.js`, and `tests/dashboard.test.js` check page behaviour using jsdom and mocked responses.
- **Frontend integration testing:** `tests/userJourney.test.js` combines several frontend modules in one critical-flow test.
- **Backend health checking:** `tests/backend.test.js` checks the existing backend health response.
- **Manual end-to-end testing:** the real and demo user journeys are checked manually in a browser.

The automated suite does not currently include a fully automated browser end-to-end test. The integration-style test and manual testing provide coverage of the main user journey. Browser-based end-to-end testing could be added in the future.

## Mocking external services

External API responses are mocked because real external services would make the tests:

- Dependent on network availability
- Dependent on credentials
- Slower to run
- More difficult to reproduce
- Vulnerable to unrelated Spotify or backend changes

The tests use controlled responses to check:

- Successful requests
- Authentication failures
- Network failures
- Empty results
- Missing artist data
- Dashboard refresh errors

Mocking does not prove that Spotify itself is available. It checks that the frontend responds correctly to the types of responses it may receive.

## Problems found through testing

The tests also showed where the expected behaviour did not match what the frontend was actually doing.

Examples included:

- An outdated navigation expectation that assumed Login went directly to the dashboard.
- Expected interface text that did not match the text actually rendered.
- A time-format expectation that omitted the `0m` portion returned by the formatter.
- Test assumptions that needed updating after demo mode and refresh behaviour were added.

These were useful findings because they showed where the tests and current user interface had become inconsistent.

The failures were mainly expectation and consistency issues rather than major production defects. The tests helped identify and correct those mismatches.

## Test development approach

The project used a mixture of approaches rather than strict test-driven development. Some parts were developed with tests alongside the code, while other features were implemented first and tested afterwards. As the frontend developed, existing tests were expanded and used to check that later changes did not break the behaviour that was already working.

Tests were used during development to:

- Check new behaviour
- Identify incorrect assumptions
- Confirm fixes
- Protect important user flows
- Check error and empty states

## Manual testing

Automated tests are supported by manual testing of the application.

The real local flow was checked using:
```text
http://127.0.0.1:5500/index.html
```

with the backend running at:
```text
http://127.0.0.1:3000
```

The demo flow was checked using:
```text
http://127.0.0.1:5500/index.html?demo=true
```

The main manual journey is:
```text
Landing page
    -> registration or login
    -> Continue with Spotify
    -> Spotify authorisation
    -> automatic history import
    -> dashboard
```

The demo journey is:
```text
Landing page
    -> demo registration or login
    -> demo Spotify connection
    -> dashboard with demo data
    -> refresh statistics
```

The demo journey provides an alternative way to assess the frontend if a tester does not have a Spotify account or does not want to connect one.

Manual testing is needed because automated frontend tests do not prove that real browser navigation, real Spotify OAuth, CORS configuration, or the deployed environment will work.

## Testing confidence and limitations

The current tests provide good confidence in the tested frontend behaviour.

They cover:

- Main API request configuration
- Navigation decisions
- Authentication page behaviour
- Spotify connection states
- Dashboard success, empty, and error states
- Dashboard refresh behaviour
- The main frontend journey

The tests do not prove:

- That Spotify is available
- That real Spotify OAuth will succeed
- That the deployed backend is always available
- That the database contains the expected listening history
- That every screen size works perfectly
- That the interface has no accessibility problems
- That users will understand the product without usability testing
- That the full journey works automatically in a real browser

The tests are therefore strong evidence for the tested frontend behaviour but not complete proof of the entire external system.

## Value and cost of tests

The tests provide:

- Fast feedback after code changes
- Repeatable checks
- Protection against regressions
- Clear examples of expected behaviour
- Safer changes to authentication and dashboard functionality

The costs include:

- Time required to write and maintain tests
- Updating expectations when the interface changes
- Mocking external responses
- Keeping tests aligned with the current backend contract

The project uses a focused test suite rather than adding large numbers of repetitive tests. The aim is to protect important behaviour and meaningful edge cases.

## Continuous integration

A future improvement would be to add a GitHub Actions workflow that runs:
```bash
npm install
npm test -- --run
```

on every push or pull request.

This would provide automatic confirmation that the test suite still passes when changes are committed or reviewed.

## Related documentation

- [Technical documentation](technical-documentation.md)
- [Contributor guide](CONTRIBUTING.md)
- [Documentation planning and process](documentation-process.md)