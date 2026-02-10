# Contributing to Sentinel

Thanks for helping improve Sentinel. This guide keeps contributions consistent and easy to review.

## Getting started

1. Fork the repository.
2. Create a new branch from `main`.
3. Make your changes with a clear, focused scope.
4. Open a pull request with a short, clear summary.

## Development setup

Follow the setup steps in `README.md` for the backend worker and frontend.

## Code standards

- Keep changes small and focused.
- Use simple, clear naming.
- Avoid large refactors in a single PR.
- Keep UI changes accessible and readable.

## Running locally

- Backend worker:
  - `cd backend-worker`
  - `pnpm dev`
- Frontend:
  - `cd site`
  - `npm run dev`

## Commit messages

Use short, descriptive commit messages. Example:

- `fix: handle empty event payload`
- `feat: add repo filter in activity view`

## Pull request checklist

- The app runs locally.
- Changes are scoped to one concern.
- Screenshots added for UI changes.
- New config or env vars documented.

## Reporting issues

If you find a bug, open an issue with:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Logs or screenshots if relevant
