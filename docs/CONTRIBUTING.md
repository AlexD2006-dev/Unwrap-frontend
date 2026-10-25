# Contributing to Unwrap

## Purpose

This guide explains how to set up, run, test, and safely maintain the Unwrap frontend.

The frontend and backend are maintained in separate repositories. This repository contains the frontend implementation and frontend tests. The existing backend provides authentication, Spotify authorisation, listening-history import, database access, and statistics endpoints.

## Prerequisites

You need:

- Node.js and npm
- A modern web browser
- A local development server
- A local copy of the frontend repository
- The separate backend for the complete real login and Spotify flow

Backend repository:

https://github.com/AlexD2006-dev/Unwrap

## Installation

From the frontend repository root, install the dependencies:
```bash
npm install
```

## Running the frontend

Start a local server:
```bash
python3 -m http.server 5500
```

Open the frontend using:
```text
http://127.0.0.1:5500/index.html
```

For the complete real login and Spotify connection flow, run the backend at:
```text
http://127.0.0.1:3000
```

Use `127.0.0.1` rather than `localhost` so that the local frontend origin matches the backend configuration.

## Demo mode

To demonstrate the frontend without real backend authentication or Spotify access, open:
```text
http://127.0.0.1:5500/index.html?demo=true
```

Demo mode supplies controlled example data and follows the main frontend navigation flow.

## Running tests

Run the complete test suite with:
```bash
npm test -- --run
```

The current suite contains 23 tests across 7 test files. It uses Vitest, jsdom, and mocked API responses. Real Spotify credentials are not required for the automated tests.

## Scope

This is a university project for our group, so we are not looking for contributions from outside the group.
The guidance below is intended for current group members or anyone authorised to maintain the repository.

## Internal development and maintenance

Keep changes focused on one feature or responsibility:

- HTML files contain page structure.
- `styles.css` contains shared styling.
- `api.js` contains backend requests and demo responses.
- `app.js` contains landing-page navigation.
- `auth.js` contains registration and login behaviour.
- `connect.js` contains Spotify connection behaviour.
- `dashboard.js` contains dashboard loading, rendering, and refresh behaviour.
- `tests/` contains automated tests.

Keep changes consistent with the existing file responsibilities and use comments only when a decision is not obvious from the code.

## Testing a change

After making a change:

1. Run the relevant tests.
2. Run the complete test suite before committing.
3. Manually check the affected page.
4. Check loading, success, empty, and error states where relevant.
5. Check demo mode if navigation or dashboard behaviour changed.
6. Review the Git diff for accidental changes or sensitive information.

## Git and security

Review changes with:
```bash
git status --short
git diff
```

Use focused commits that describe one logical change.

Do not commit:

- Passwords
- API keys
- Spotify client secrets
- JWT secrets
- Refresh tokens
- Database credentials
- Environment files containing sensitive values
- Personal Spotify data

## Repository boundaries

Frontend changes belong in this repository. Backend authentication, Spotify authorisation, database, history-ingestion, and backend statistics changes belong in the separate backend repository.

For the architecture, testing strategy, implementation decisions, and project limitations, see the [technical documentation](technical-documentation.md).