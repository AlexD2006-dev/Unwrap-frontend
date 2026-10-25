# Documentation Planning and Process

## Purpose

The main purpose of the Unwrap documentation is to explain the project clearly to the people who need to use, assess, maintain, or understand it.
The documents are split by purpose so the README stays clean and concise.

## Documentation audiences

The documentation is written for:

- **Developers and group members**, who need to set up, test, maintain, and understand how the frontend connects to the backend.
- **Assessors**, who need to understand the architecture, technical decisions, testing work, and the difference between the frontend contribution and the existing backend.
- **Users and demonstrators**, who need a short explanation of the purpose and available frontend features.

During planning, the intended product audience was considered using the Maya Thompson proto-persona. It is based on assumptions rather than completed user research.

## Planning and drafting

The documentation began when the frontend was a smaller prototype containing landing-page navigation, an About page, and sample dashboard content.

As the frontend developed, the documentation was revised to match the implemented system rather than keeping descriptions of the earlier prototype.

The current documentation reflects the implemented journey:

```text
Landing page
    -> registration or login
    -> Spotify connection
    -> history import through the existing backend
    -> statistics dashboard
```

The frontend and backend are kept in separate repositories. This document focuses on the frontend and explains how it connects to the existing backend.

The documentation describes the frontend implementation and its integration points without claiming ownership of backend authentication, Spotify authorisation, database, or listening-history import code.

The documentation was also updated as the test suite expanded from navigation tests to API, authentication, connection, dashboard, refresh, and critical user-journey tests.

Current test counts, commands, URLs, and feature descriptions are kept consistent across the README, technical documentation, testing documentation, and contributor guide.

## Review and maintenance

The documentation was checked against the implementation by reviewing:

- Page and JavaScript filenames
- Backend URLs and frontend routes
- Current test files and test count
- Demo-mode behaviour
- Dashboard refresh behaviour
- Loading, empty, and error states
- Frontend and backend ownership boundaries
- Setup commands and local development URLs

The documentation should be updated when the architecture, API routes, test strategy, deployment process, or user journey changes.

Outdated prototype descriptions should be removed rather than left alongside current instructions.

This document explains how the project documentation was planned, reviewed, and maintained for the Technical Documentation module.