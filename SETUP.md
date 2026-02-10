# Sentinel Setup Guide

This guide explains how to make your own version of Sentinel with your repositories.

## 1) Prerequisites

- Node.js 18+ (or 20+)
- Postgres database
- GitHub personal access token (recommended)

## 2) Clone and install

```
git clone <your-fork-url>
cd gh-org-event-tracker
```

## 3) Configure the backend worker

1. Go to the worker:

```
cd backend-worker
```

2. Create a `.env` file:

```bash
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DB?sslmode=require"
GITHUB_TOKEN="your_github_token"
REPO_LIST="owner1/repo1,owner2/repo2"
POLL_INTERVAL_MS="300000"
REQUEST_DELAY_MS="200"
```

3. Install dependencies:

```
pnpm install
```

4. Generate Prisma client and run migrations:

```
pnpm prisma generate
pnpm prisma migrate deploy
```

5. Start the worker:

```
pnpm dev
```

## 4) Configure the frontend

1. Go to the UI:

```
cd ../site
```

2. Install dependencies:

```
npm install
```

3. Optional: point the UI to your API:

```bash
EVENTS_API_URL="http://localhost:8080/api/events/<org>/<repo>"
```

4. Start the UI:

```
npm run dev
```

## 5) Customize your repo list

You can choose one of these approaches:

### Option A: Use the `.env` list (recommended)

```
REPO_LIST="owner1/repo1,owner2/repo2"
```

### Option B: Hard-code a list in the worker

Edit `backend-worker/src/index.ts` and replace the env-driven list with:

```ts
export const repoList = [{ owner: "OWASP-BLT", repo: "BLT" }];
```

## 6) Verify everything

- Worker logs show repo fetches every 5 minutes.
- UI displays events and filters.

## Common issues

- If no events appear, confirm your GitHub token and repo names.
- If Postgres fails, check the `DATABASE_URL` format.
- If the UI shows no data, confirm `EVENTS_API_URL`.
