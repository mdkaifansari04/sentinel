/* =========================================================
   Base envelope (shared for ALL events)
   ========================================================= */

export interface GitHubEventEnvelope {
  id: string
  org: string
  repo: string

  actor: {
    username: string
    avatar: string
  }

  created_at: string
  updated_at?: string

  data: GitHubEventData
}

/* =========================================================
   Discriminated union (this is the spine)
   ========================================================= */

export type GitHubEventData =
  | PullRequestEvent
  | IssueEvent
  | IssueCommentEvent
  | PullRequestReviewEvent
  | PullRequestReviewCommentEvent
  | PushEvent
  | ReleaseEvent
  | ForkEvent
  | WatchEvent
  | CreateEvent
  | DeleteEvent
  | GenericEvent

/* =========================================================
   Pull Request
   ========================================================= */

export interface PullRequestEvent {
  type: "PullRequestEvent"
  action: "opened" | "closed" | "reopened" | "merged" | "labeled" | "unlabeled"

  pull_request: {
    number: number
    title: string
    state: "open" | "closed"
    merged: boolean
    html_url: string

    base: {
      ref: string
      sha: string
    }

    head: {
      ref: string
      sha: string
    }
  }
}

/* =========================================================
   Issues
   ========================================================= */

export interface IssueEvent {
  type: "IssuesEvent"
  action: "opened" | "closed" | "reopened" | "labeled" | "assigned"

  issue: {
    number: number
    title: string
    state: "open" | "closed"
    html_url: string
    labels?: string[]
  }
}

/* =========================================================
   Issue Comment
   ========================================================= */

export interface IssueCommentEvent {
  type: "IssueCommentEvent"
  action: "created" | "edited" | "deleted"

  issue: {
    number: number
    html_url: string
    is_pull_request: boolean
  }

  comment: {
    id: number
    body?: string
    html_url: string
  }
}

/* =========================================================
   Pull Request Review
   ========================================================= */

export interface PullRequestReviewEvent {
  type: "PullRequestReviewEvent"
  action: "submitted"

  pull_request: {
    number: number
    html_url: string
  }

  review: {
    state: "approved" | "commented" | "changes_requested"
    body?: string
  }
}

/* =========================================================
   Pull Request Review Comment
   ========================================================= */

export interface PullRequestReviewCommentEvent {
  type: "PullRequestReviewCommentEvent"
  action: "created" | "edited" | "deleted"

  pull_request: {
    number: number
    html_url: string
  }

  comment: {
    id: number
    body?: string
    path?: string
    html_url: string
  }
}

/* =========================================================
   Push
   ========================================================= */

export interface PushEvent {
  type: "PushEvent"

  ref: string
  before: string
  head: string

  commits: {
    sha: string
    message: string
    url: string
  }[]

  commit_count: number
}

/* =========================================================
   Release
   ========================================================= */

export interface ReleaseEvent {
  type: "ReleaseEvent"
  action: "published" | "created" | "edited"

  release: {
    tag_name: string
    name?: string
    draft: boolean
    prerelease: boolean
    html_url: string
  }
}

/* =========================================================
   Fork
   ========================================================= */

export interface ForkEvent {
  type: "ForkEvent"

  forkee: {
    full_name: string
    html_url: string
  }
}

/* =========================================================
   Watch (star)
   ========================================================= */

export interface WatchEvent {
  type: "WatchEvent"
  action: "started"
}

/* =========================================================
   Create / Delete (branch / tag / repo)
   ========================================================= */

export interface CreateEvent {
  type: "CreateEvent"
  ref_type: "repository" | "branch" | "tag"
  ref?: string
}

export interface DeleteEvent {
  type: "DeleteEvent"
  ref_type: "branch" | "tag"
  ref: string
}

/* =========================================================
   Escape hatch (future-proof)
   ========================================================= */

export interface GenericEvent {
  type: "UnknownEvent"
  raw: Record<string, any>
}
