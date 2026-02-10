# Sentinel - Open source activity tracker

Sentinel tracks activity across open source repositories and turns it into a clean, queryable feed. It is built for contributors and maintainers who want fast awareness of issues, pull requests, reviews, releases, and discussions without living inside GitHub tabs.

## What it does

- Polls GitHub repository events on a schedule.
- Normalizes events into structured records.
- Stores events in Postgres for fast queries.
- Serves a modern dashboard with filters and a chat-ready side panel.

## How it works

1. The backend worker reads a list of repositories.
2. It calls the GitHub Events API for each repo.
3. Events are mapped into a small, typed payload and stored in Postgres.
4. The frontend fetches the latest events and renders a focused activity view.

## Architecture

![Architecture](docs/images/architecture.png)

High-level flow:

- GitHub API -> Worker -> Postgres -> API -> Next.js UI

## Project structure

- `backend-worker/` - Event ingestion worker and Prisma schema.
- `site/` - Next.js UI and dashboard.
- `todo-future.md` - Planned improvements.

## Quick start

### 1) Backend worker

Prerequisites:

- Node.js 18+ (or 20+)
- Postgres database
- GitHub token (recommended)

Install and configure:

1. `cd backend-worker`
2. `pnpm install` (or `npm install`)
3. Create a `.env` file:

```bash
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
GITHUB_TOKEN="your_github_token"
REPO_LIST="open-metadata/openmetadata,OWASP-BLT/BLT"
POLL_INTERVAL_MS="300000"
REQUEST_DELAY_MS="200"
```

4. Run migrations and generate Prisma client:

```bash
pnpm prisma generate
pnpm prisma migrate deploy
```

5. Start the worker:

```bash
pnpm dev
```

### Repo list configuration

The worker supports a simple comma-separated list using `REPO_LIST`:

```
REPO_LIST="owner1/repo1,owner2/repo2"
```

If you want a hard-coded list, you can replace the env-driven list in `backend-worker/src/index.ts` with a constant array and remove the env parsing. Use the format:

```ts
export const repoList = [{ owner: "OWASP-BLT", repo: "BLT" }];
```

### 2) Frontend

Prerequisites:

- Node.js 18+ (or 20+)

Install and run:

1. `cd site`
2. `npm install`
3. Optional API env var:

```bash
EVENTS_API_URL="http://localhost:8080/api/events/open-metadata/openmetadata"
```

4. Start the UI:

```bash
npm run dev
```

## API

The UI expects a JSON response shaped like:

```json
{
  "success": true,
  "message": "Events fetched successfully",
  "data": [
    {
      "id": "...",
      "org": "open-metadata",
      "repo": "openmetadata",
      "username": "...",
      "avatar": "...",
      "type": "IssueCommentEvent",
      "createdAt": "2026-02-03T11:26:54.000Z",
      "updatedAt": null,
      "data": { "type": "IssueCommentEvent" },
      "isSensitive": false
    }
  ]
}
```

## Configuration reference

- `DATABASE_URL` - Postgres connection string used by Prisma.
- `GITHUB_TOKEN` - GitHub API token to increase rate limits.
- `REPO_LIST` - Comma-separated repo list as `owner/repo`.
- `POLL_INTERVAL_MS` - Worker poll interval in milliseconds.
- `REQUEST_DELAY_MS` - Delay between repo API calls to reduce rate spikes.
- `EVENTS_API_URL` - API endpoint used by the frontend.

## Contributing

Read the contribution guide in `CONTRIBUTING.md`.
