import "dotenv/config";
import type { Prisma } from "@prisma/client";
import type { GitHubEventData } from "../types/type";
import { prisma } from "../libs/client";
import { repoList } from "../libs/repo";
import { parentPort } from "worker_threads"

type RepoRef = {
  owner: string;
  repo: string;
};

type RawGitHubEvent = {
  id: string;
  type: string;
  actor?: {
    login?: string;
    avatar_url?: string;
  };
  created_at: string;
  payload?: Record<string, any>;
};

const POLL_INTERVAL_MS = parseNumberEnv("POLL_INTERVAL_MS", 5 * 60 * 1000);
const REQUEST_DELAY_MS = parseNumberEnv("REQUEST_DELAY_MS", 200);

const githubToken = process.env.GITHUB_TOKEN;
let isRunning = false;

function parseNumberEnv(key: string, fallback: number): number {
  const raw = process.env[key];
  if (!raw) {
    return fallback;
  }
  const parsed = Number.parseInt(raw, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function parseRepoList(raw: string | undefined): RepoRef[] {
  if (!raw) {
    return [];
  }

  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [owner, repo] = entry.split("/");
      return {
        owner: owner?.trim() ?? "",
        repo: repo?.trim() ?? "",
      };
    })
    .filter((ref) => ref.owner.length > 0 && ref.repo.length > 0);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchRepoEvents(repo: RepoRef): Promise<RawGitHubEvent[]> {
  const url = new URL(`https://api.github.com/repos/${repo.owner}/${repo.repo}/events`);
  url.searchParams.set("per_page", "100");

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "gh-org-event-tracker-worker",
  };

  if (githubToken) {
    headers.Authorization = `Bearer ${githubToken}`;
  }

  const response = await fetch(url.toString(), { headers });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`GitHub API error ${response.status} for ${repo.owner}/${repo.repo}: ${body}`);
  }

  const data = (await response.json()) as RawGitHubEvent[];
  return Array.isArray(data) ? data : [];
}

function mapEventData(event: RawGitHubEvent): GitHubEventData {
  const payload = event.payload ?? {};

  switch (event.type) {
    case "PullRequestEvent":
      return mapPullRequestEvent(payload);
    case "IssuesEvent":
      return mapIssuesEvent(payload);
    case "IssueCommentEvent":
      return mapIssueCommentEvent(payload);
    case "PullRequestReviewEvent":
      return mapPullRequestReviewEvent(payload);
    case "PullRequestReviewCommentEvent":
      return mapPullRequestReviewCommentEvent(payload);
    case "PushEvent":
      return mapPushEvent(payload);
    case "ReleaseEvent":
      return mapReleaseEvent(payload);
    case "ForkEvent":
      return mapForkEvent(payload);
    case "WatchEvent":
      return mapWatchEvent(payload);
    case "CreateEvent":
      return mapCreateEvent(payload);
    case "DeleteEvent":
      return mapDeleteEvent(payload);
    default:
      return {
        type: "UnknownEvent",
        raw: {
          event_type: event.type,
          action: payload.action,
        },
      };
  }
}

function mapPullRequestEvent(payload: Record<string, any>): GitHubEventData {
  const pr = payload.pull_request;
  if (!pr || typeof pr.number !== "number") {
    return unknownEvent("PullRequestEvent");
  }

  const rawAction = payload.action;
  const mergedAction = rawAction === "closed" && pr.merged ? "merged" : rawAction;
  const action = normalizeAction(mergedAction, ["opened", "closed", "reopened", "merged", "labeled", "unlabeled"]);
  if (!action) {
    return unknownEvent("PullRequestEvent");
  }

  return {
    type: "PullRequestEvent",
    action,
    pull_request: {
      number: pr.number,
      title: pr.title ?? "",
      state: pr.state ?? "open",
      merged: Boolean(pr.merged),
      html_url: pr.html_url ?? "",
      base: {
        ref: pr.base?.ref ?? "",
        sha: pr.base?.sha ?? "",
      },
      head: {
        ref: pr.head?.ref ?? "",
        sha: pr.head?.sha ?? "",
      },
    },
  };
}

function mapIssuesEvent(payload: Record<string, any>): GitHubEventData {
  const issue = payload.issue;
  const action = normalizeAction(payload.action, ["opened", "closed", "reopened", "labeled", "assigned"]);
  if (!issue || !action) {
    return unknownEvent("IssuesEvent");
  }

  return {
    type: "IssuesEvent",
    action,
    issue: {
      number: issue.number ?? 0,
      title: issue.title ?? "",
      state: issue.state ?? "open",
      html_url: issue.html_url ?? "",
      labels: Array.isArray(issue.labels) ? issue.labels.map((label: any) => label?.name).filter((label: any) => typeof label === "string") : undefined,
    },
  };
}

function mapIssueCommentEvent(payload: Record<string, any>): GitHubEventData {
  const issue = payload.issue;
  const comment = payload.comment;
  const action = normalizeAction(payload.action, ["created", "edited", "deleted"]);
  if (!issue || !comment || !action) {
    return unknownEvent("IssueCommentEvent");
  }

  return {
    type: "IssueCommentEvent",
    action,
    issue: {
      number: issue.number ?? 0,
      html_url: issue.html_url ?? "",
      is_pull_request: Boolean(issue.pull_request),
    },
    comment: {
      id: comment.id ?? 0,
      body: comment.body,
      html_url: comment.html_url ?? "",
    },
  };
}

function mapPullRequestReviewEvent(payload: Record<string, any>): GitHubEventData {
  const review = payload.review;
  const pr = payload.pull_request;
  const action = normalizeAction(payload.action, ["submitted"]);
  if (!review || !pr || !action) {
    return unknownEvent("PullRequestReviewEvent");
  }

  return {
    type: "PullRequestReviewEvent",
    action,
    pull_request: {
      number: pr.number ?? 0,
      html_url: pr.html_url ?? "",
    },
    review: {
      state: normalizeAction(review.state, ["approved", "commented", "changes_requested"]) ?? "commented",
      body: review.body,
    },
  };
}

function mapPullRequestReviewCommentEvent(payload: Record<string, any>): GitHubEventData {
  const comment = payload.comment;
  const pr = payload.pull_request;
  const action = normalizeAction(payload.action, ["created", "edited", "deleted"]);
  if (!comment || !pr || !action) {
    return unknownEvent("PullRequestReviewCommentEvent");
  }

  return {
    type: "PullRequestReviewCommentEvent",
    action,
    pull_request: {
      number: pr.number ?? 0,
      html_url: pr.html_url ?? "",
    },
    comment: {
      id: comment.id ?? 0,
      body: comment.body,
      path: comment.path,
      html_url: comment.html_url ?? "",
    },
  };
}

function mapPushEvent(payload: Record<string, any>): GitHubEventData {
  const commits = Array.isArray(payload.commits) ? payload.commits : [];
  const normalizedCommits = commits.map((commit: any) => ({
    sha: commit?.sha ?? "",
    message: commit?.message ?? "",
    url: commit?.url ?? "",
  }));

  return {
    type: "PushEvent",
    ref: payload.ref ?? "",
    before: payload.before ?? "",
    head: payload.head ?? "",
    commits: normalizedCommits,
    commit_count: payload.size ?? normalizedCommits.length,
  };
}

function mapReleaseEvent(payload: Record<string, any>): GitHubEventData {
  const release = payload.release;
  const action = normalizeAction(payload.action, ["published", "created", "edited"]);
  if (!release || !action) {
    return unknownEvent("ReleaseEvent");
  }

  return {
    type: "ReleaseEvent",
    action,
    release: {
      tag_name: release.tag_name ?? "",
      name: release.name,
      draft: Boolean(release.draft),
      prerelease: Boolean(release.prerelease),
      html_url: release.html_url ?? "",
    },
  };
}

function mapForkEvent(payload: Record<string, any>): GitHubEventData {
  const forkee = payload.forkee;
  if (!forkee) {
    return unknownEvent("ForkEvent");
  }

  return {
    type: "ForkEvent",
    forkee: {
      full_name: forkee.full_name ?? "",
      html_url: forkee.html_url ?? "",
    },
  };
}

function mapWatchEvent(payload: Record<string, any>): GitHubEventData {
  const action = normalizeAction(payload.action, ["started"]);
  if (!action) {
    return unknownEvent("WatchEvent");
  }

  return {
    type: "WatchEvent",
    action,
  };
}

function mapCreateEvent(payload: Record<string, any>): GitHubEventData {
  const refType = normalizeAction(payload.ref_type, ["repository", "branch", "tag"]);
  if (!refType) {
    return unknownEvent("CreateEvent");
  }

  return {
    type: "CreateEvent",
    ref_type: refType,
    ref: payload.ref ?? undefined,
  };
}

function mapDeleteEvent(payload: Record<string, any>): GitHubEventData {
  const refType = normalizeAction(payload.ref_type, ["branch", "tag"]);
  if (!refType) {
    return unknownEvent("DeleteEvent");
  }

  return {
    type: "DeleteEvent",
    ref_type: refType,
    ref: payload.ref ?? "",
  };
}

function normalizeAction<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  if (typeof value !== "string") {
    return null;
  }
  return (allowed as readonly string[]).includes(value) ? (value as T) : null;
}

function unknownEvent(type: string): GitHubEventData {
  return {
    type: "UnknownEvent",
    raw: {
      event_type: type,
    },
  };
}

function toInputJsonValue(data: GitHubEventData): Prisma.InputJsonValue {
  // Force JSON-serializable shape for Prisma JSON input typing.
  return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
}

async function storeEvents(repo: RepoRef, events: RawGitHubEvent[]): Promise<number> {
  if (events.length === 0) {
    return 0;
  }

  const lastEvent = await prisma.gitHubEvent.findFirst({
    where: { org: repo.owner, repo: repo.repo },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  const cutoff = lastEvent?.createdAt?.getTime();
  const records = events
    .filter((event) => {
      if (!cutoff) {
        return true;
      }
      const createdAt = Date.parse(event.created_at);
      return !Number.isNaN(createdAt) && createdAt >= cutoff;
    })
    .map((event) => ({
      id: event.id,
      org: repo.owner,
      repo: repo.repo,
      username: event.actor?.login ?? "",
      avatar: event.actor?.avatar_url ?? "",
      type: event.type,
      createdAt: new Date(event.created_at),
      data: toInputJsonValue(mapEventData(event)),
      isSensitive: false,
    }));

  if (records.length === 0) {
    return 0;
  }

  const result = await prisma.gitHubEvent.createMany({
    data: records,
    skipDuplicates: true,
  });

  return result.count;
}

async function runOnce(): Promise<void> {
  if (repoList.length === 0) {
    console.error("REPO_LIST is empty. Add repos like: owner/repo,owner2/repo2");
    return;
  }

  if (isRunning) {
    console.warn("Previous cycle still running. Skipping this tick.");
    return;
  }

  isRunning = true;
  try {
    for (const repo of repoList) {
      try {
        const events = await fetchRepoEvents(repo);
        const inserted = await storeEvents(repo, events);
        console.log(`[${repo.owner}/${repo.repo}] fetched ${events.length} events, inserted ${inserted}`);
      } catch (error) {
        console.error(`[${repo.owner}/${repo.repo}] failed`, error);
      }

      if (REQUEST_DELAY_MS > 0) {
        await sleep(REQUEST_DELAY_MS);
      }
    }
  } finally {
    isRunning = false;
  }
}

async function main(): Promise<void> {
  if (!githubToken) {
    console.warn("GITHUB_TOKEN is not set. Requests may be rate-limited.");
  }

  await runOnce();

  setInterval(async () => {
    await runOnce();
  }, POLL_INTERVAL_MS);
}

main().catch((error) => {
  console.error("Worker crashed", error);
  process.exitCode = 1;
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
