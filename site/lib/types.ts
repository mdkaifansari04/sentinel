export type EventApiResponse = {
  success: boolean;
  message: string;
  data: GitHubEventRecord[];
};

export type OrgApiResponse = {
  success: boolean;
  data: { org: string }[];
};

export type RepoApiResponse = {
  success: boolean;
  data: { repo: string }[];
};

export type GitHubEventRecord = {
  id: string;
  org: string;
  repo: string;
  username: string;
  avatar: string;
  type: string;
  createdAt: string;
  updatedAt: string | null;
  data: GitHubEventData;
  isSensitive: boolean;
};

export type GitHubEventData =
  | IssueCommentEvent
  | PullRequestEvent
  | PushEvent
  | GenericEvent
  | Record<string, any>;

export type IssueCommentEvent = {
  type: "IssueCommentEvent";
  action: "created" | "edited" | "deleted";
  issue: {
    number: number;
    html_url: string;
    is_pull_request: boolean;
  };
  comment: {
    id: number;
    body?: string;
    html_url: string;
  };
};

export type PullRequestEvent = {
  type: "PullRequestEvent";
  action: "opened" | "closed" | "reopened" | "merged" | "labeled" | "unlabeled";
  pull_request: {
    number: number;
    title: string;
    state: "open" | "closed";
    merged: boolean;
    html_url: string;
    base: {
      ref: string;
      sha: string;
    };
    head: {
      ref: string;
      sha: string;
    };
  };
};

export type PushEvent = {
  type: "PushEvent";
  ref: string;
  before: string;
  head: string;
  commits: {
    sha: string;
    message: string;
    url: string;
  }[];
  commit_count: number;
};

export type GenericEvent = {
  type: "UnknownEvent";
  raw: Record<string, any>;
};
