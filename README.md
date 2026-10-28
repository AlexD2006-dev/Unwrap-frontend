# Unwrap

**Author:** Alex Draesner

Frontend repository: https://github.com/AlexD2006-dev/Unwrap-frontend
Backend repository: https://github.com/AlexD2006-dev/Unwrap
Backend integration branch: https://github.com/AlexD2006-dev/Unwrap/tree/frontend-backend-integration

## Overview

Unwrap is a web application that helps users explore their personal listening statistics in more detail than Spotify Wrapped.

The Unwrap project started before this frontend work began. This repository contains the individual frontend implementation and documents the frontend work completed for the coursework.

## Current status

The frontend supports the main user journey:
```text
Landing page
    -> account registration or login
    -> Spotify connection
    -> automatic history import through the backend
    -> statistics dashboard
```

The frontend and backend are kept in separate repositories. The complete real login and Spotify connection flow requires the backend to be running locally at:
```text
http://127.0.0.1:3000
```

## Current features

- Landing page
- About page
- Clickable Unwrap logo
- User registration and login
- Authentication loading and error messages
- Spotify connection interface
- Redirect to the existing backend Spotify authorisation route
- Dashboard statistics for top artists, top tracks, and total listening time
- Loading, empty, and error states
- Dashboard refresh without a full page reload
- Explicit demo mode using `?demo=true`
- Responsive layout and accessible form labels

## Technologies used

- HTML for page structure
- CSS for frontend styling
- JavaScript for frontend behaviour
- Vitest for automated testing
- jsdom for the simulated browser environment used by frontend tests
- Supertest for the backend health-check test
- Git and GitHub for version control

## Project structure

- `index.html` - landing page
- `about.html` - About page
- `auth.html` - registration and login page
- `connect.html` - Spotify connection page
- `dashboard.html` - statistics dashboard
- `app.js` - landing-page navigation
- `api.js` - frontend API requests and demo responses
- `auth.js` - registration and login behaviour
- `connect.js` - Spotify connection behaviour
- `dashboard.js` - loading, rendering, and refreshing dashboard statistics
- `styles.css` - shared frontend styling
- `tests/` - automated frontend tests
- `docs/` - technical and contributor documentation

## Automated testing

The frontend contains 23 automated tests across 7 test files. The latest complete test run completed with:
```text
7 test files passed
23 tests passed
0 tests failed
```

Run the frontend tests with:
```bash
npm test -- --run
```

The tests cover API requests, navigation, authentication, Spotify connection behaviour, dashboard rendering, dashboard refresh behaviour, the critical frontend journey, and the existing backend health response.

The frontend tests use mocked API and Spotify-related responses. This keeps them repeatable and avoids real account credentials or dependence on Spotify being available during every test run.

More detailed testing information is available in [docs/testing.md](docs/testing.md).

## Prerequisites

Before running the project, you need:

- Node.js and npm
- A local copy of the frontend repository
- A modern web browser
- A local development server, such as Python's built-in server
- The separate Unwrap backend at `http://127.0.0.1:3000` for the complete real login and Spotify connection flow

## Running the project locally

Install the frontend dependencies:
```bash
npm install
```

Start a local frontend server from the repository root:
```bash
python3 -m http.server 5500
```

Open the frontend at:
```text
http://127.0.0.1:5500/index.html
```

For the complete real login and Spotify connection flow, the separate backend must also be running at:
```text
http://127.0.0.1:3000
```

The exact backend setup and database instructions are available in the backend repository:

https://github.com/AlexD2006-dev/Unwrap

Use `127.0.0.1` rather than `localhost` so that the frontend origin matches the local backend configuration.

## Demo mode

The frontend can be demonstrated without real backend authentication or Spotify access at:
```text
http://127.0.0.1:5500/index.html?demo=true
```

Demo mode provides controlled example statistics and follows the main frontend navigation flow:
```text
Landing page
    -> demo registration or login
    -> demo Spotify connection
    -> dashboard with demo data
    -> refresh statistics
```

## Known limitations

Spotify listening history belongs to the connected Spotify account rather than to one individual person. If several people share an account, the imported statistics may contain listening data from all users of that account.

The dashboard refresh requests the latest statistics already available from the backend. It does not trigger a new Spotify history import.

The real authentication and Spotify connection flow depends on the separate backend being available.

## Individual contribution

This repository contains the individual frontend contribution to the wider Unwrap project.

The frontend contribution includes:

- Frontend page structure and styling
- Authentication screens
- Spotify connection flow
- Frontend API integration
- Dashboard rendering
- Loading, empty, and error states
- Dashboard refresh behaviour
- Demo mode
- Automated tests
- Technical documentation

The existing backend authentication, Spotify authorisation, database, and listening-history import are handled in the separate backend repository and are outside the scope of this frontend contribution.

## Further documentation

- [Technical documentation](docs/technical-documentation.md)
- [Testing documentation](docs/testing.md)
- [Contributor guide](docs/CONTRIBUTING.md)
- [Documentation planning and process](docs/documentation-process.md)