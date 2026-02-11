import type { EventApiResponse, GitHubEventRecord, OrgApiResponse, RepoApiResponse } from "@/lib/types";

const DEFAULT_API_BASE = "http://localhost:8080";

function getApiBase() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? DEFAULT_API_BASE;
}

async function handleJson<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }
  return (await response.json()) as T;
}

export async function fetchEventsForRepo(org: string, repo: string): Promise<GitHubEventRecord[]> {
  const endpoint = `${getApiBase()}/api/events/${org}/${repo}`;
  const response = await fetch(endpoint, { cache: "no-store" });
  const payload = await handleJson<EventApiResponse>(response);
  if (!payload.success || !Array.isArray(payload.data)) {
    return [];
  }
  return payload.data;
}

export async function fetchOrgs(): Promise<string[]> {
  const endpoint = `${getApiBase()}/api/orgs`;
  const response = await fetch(endpoint, { cache: "no-store" });
  const payload = await handleJson<OrgApiResponse>(response);
  if (!payload.success || !Array.isArray(payload.data)) {
    return [];
  }
  return payload.data.map((item) => item.org);
}

export async function fetchRepos(org: string): Promise<string[]> {
  const endpoint = `${getApiBase()}/api/orgs/${org}/repos`;
  const response = await fetch(endpoint, { cache: "no-store" });
  const payload = await handleJson<RepoApiResponse>(response);
  if (!payload.success || !Array.isArray(payload.data)) {
    return [];
  }
  return payload.data.map((item) => item.repo);
}
