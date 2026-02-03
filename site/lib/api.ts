import { EventApiResponse, GitHubEventRecord } from "@/lib/types";

const DEFAULT_EVENTS_URL =
  "http://localhost:8080/api/events/open-metadata/openmetadata";

export async function fetchEvents(): Promise<GitHubEventRecord[]> {
  const endpoint = process.env.EVENTS_API_URL ?? DEFAULT_EVENTS_URL;

  const response = await fetch(endpoint, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch events (${response.status})`);
  }

  const payload = (await response.json()) as EventApiResponse;
  if (!payload.success || !Array.isArray(payload.data)) {
    return [];
  }

  return payload.data;
}
