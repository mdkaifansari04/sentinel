/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, Filter, MessageSquare, X } from "lucide-react";
import { useQuery, useQueries } from "@tanstack/react-query";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchEventsForRepo, fetchOrgs, fetchRepos } from "@/lib/api";
import type { GitHubEventRecord } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const quickPrompts = ["What are the most trending issues?", "Which PRs are ready to merge?", "Show me urgent review requests.", "Summarize activity in the last 6 hours."];

const EVENT_TYPES = ["CreateEvent", "DeleteEvent", "ForkEvent", "IssueCommentEvent", "IssuesEvent", "PullRequestEvent", "PullRequestReviewCommentEvent", "PullRequestReviewEvent", "PushEvent", "WatchEvent"];

const EVENT_LABELS: Record<string, { label: string; priority: "high" | "medium" | "low" }> = {
  PullRequestEvent: { label: "Pull request created", priority: "high" },
  IssuesEvent: { label: "Issue created", priority: "high" },
  PullRequestReviewEvent: { label: "PR review", priority: "high" },
  PullRequestReviewCommentEvent: { label: "PR review comment", priority: "high" },
  IssueCommentEvent: { label: "Issue comment", priority: "medium" },
  PushEvent: { label: "Push", priority: "medium" },
  CreateEvent: { label: "Created", priority: "medium" },
  DeleteEvent: { label: "Deleted", priority: "low" },
  ForkEvent: { label: "Forked", priority: "low" },
  WatchEvent: { label: "Starred", priority: "low" },
};

const PAGE_SIZE = 12;
const BOT_USERS = ["dependabot[bot]", "github-actions[bot]", "copilot", "coderabbitai[bot]"];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return dateFormatter.format(date);
}

function getEventMeta(type: string) {
  return EVENT_LABELS[type] ?? { label: type, priority: "low" as const };
}

function getEventHref(event: GitHubEventRecord): string | null {
  const data = event.data as Record<string, any>;

  if (data?.comment?.html_url) {
    return data.comment.html_url;
  }
  if (data?.issue?.html_url) {
    return data.issue.html_url;
  }
  if (data?.pull_request?.html_url) {
    return data.pull_request.html_url;
  }
  return null;
}

function getEventSummary(event: GitHubEventRecord) {
  const data = event.data as Record<string, any>;

  if (data?.pull_request?.title) {
    return data.pull_request.title;
  }
  if (data?.issue?.number) {
    return `Issue #${data.issue.number}`;
  }
  if (data?.ref) {
    return data.ref;
  }
  return getEventMeta(event.type).label;
}

function timeMatchesFilter(createdAt: string, range: string) {
  if (range === "all") {
    return true;
  }
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return true;
  }
  const now = Date.now();
  const diff = now - date.getTime();
  if (range === "24h") {
    return diff <= 24 * 60 * 60 * 1000;
  }
  if (range === "7d") {
    return diff <= 7 * 24 * 60 * 60 * 1000;
  }
  return true;
}

export function ActivityClient() {
  const [query, setQuery] = React.useState("");
  const [selectedRepos, setSelectedRepos] = React.useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  const [timeRange, setTimeRange] = React.useState("24h");
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [expandedOrgs, setExpandedOrgs] = React.useState<Set<string>>(new Set());
  const [page, setPage] = React.useState(1);
  const [hideBots, setHideBots] = React.useState(true);
  const [selectAllRepos, setSelectAllRepos] = React.useState(false);

  const orgsQuery = useQuery({
    queryKey: ["orgs"],
    queryFn: fetchOrgs,
  });

  const orgs = orgsQuery.data ?? [];

  const repoQueries = useQueries({
    queries: orgs.map((org) => ({
      queryKey: ["repos", org],
      queryFn: () => fetchRepos(org),
      enabled:
        selectAllRepos ||
        expandedOrgs.has(org) ||
        selectedRepos.some((repo) => repo.startsWith(`${org}/`)),
    })),
  });

  const reposByOrg = React.useMemo(() => {
    const map = new Map<string, string[]>();
    orgs.forEach((org, index) => {
      map.set(org, repoQueries[index]?.data ?? []);
    });
    return map;
  }, [orgs, repoQueries]);

  const selectedRepoPairs = selectedRepos.map((entry) => {
    const [org, repo] = entry.split("/");
    return { org, repo };
  });

  const allRepos = React.useMemo(() => {
    const list: string[] = [];
    orgs.forEach((org) => {
      const repos = reposByOrg.get(org) ?? [];
      repos.forEach((repo) => {
        list.push(`${org}/${repo}`);
      });
    });
    return list;
  }, [orgs, reposByOrg]);

  const eventQueries = useQueries({
    queries: selectedRepoPairs.map((pair) => ({
      queryKey: ["events", pair.org, pair.repo],
      queryFn: () => fetchEventsForRepo(pair.org, pair.repo),
      enabled: selectedRepoPairs.length > 0,
      staleTime: 30_000,
    })),
  });

  const isEventsLoading = eventQueries.some((queryResult) => queryResult.isLoading);
  const events = React.useMemo(() => {
    if (selectedRepoPairs.length === 0) {
      return [] as GitHubEventRecord[];
    }
    const merged = new Map<string, GitHubEventRecord>();
    eventQueries.forEach((queryResult) => {
      queryResult.data?.forEach((event) => {
        merged.set(event.id, event);
      });
    });
    return Array.from(merged.values());
  }, [eventQueries, selectedRepoPairs.length]);

  const availableTypes = React.useMemo(() => {
    const fromEvents = events.map((event) => event.type);
    return Array.from(new Set([...EVENT_TYPES, ...fromEvents]));
  }, [events]);

  const filteredEvents = React.useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();

    return events
      .filter((event) => (selectedRepos.length === 0 ? true : selectedRepos.includes(`${event.org}/${event.repo}`)))
      .filter((event) => (selectedTypes.length === 0 ? true : selectedTypes.includes(event.type)))
      .filter((event) => (hideBots ? !BOT_USERS.includes(event.username.toLowerCase()) : true))
      .filter((event) => timeMatchesFilter(event.createdAt, timeRange))
      .filter((event) => {
        if (!lowerQuery) {
          return true;
        }
        const summary = getEventSummary(event).toLowerCase();
        return event.username.toLowerCase().includes(lowerQuery) || summary.includes(lowerQuery) || `${event.org}/${event.repo}`.toLowerCase().includes(lowerQuery);
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [events, query, selectedRepos, selectedTypes, timeRange, hideBots]);

  React.useEffect(() => {
    setPage(1);
  }, [query, selectedRepos, selectedTypes, timeRange, hideBots]);

  React.useEffect(() => {
    if (!selectAllRepos) {
      return;
    }
    if (allRepos.length === 0) {
      return;
    }
    setSelectedRepos(allRepos);
  }, [selectAllRepos, allRepos]);

  const totalPages = Math.max(1, Math.ceil(filteredEvents.length / PAGE_SIZE));
  const pageIndex = Math.min(page, totalPages);
  const pageStart = (pageIndex - 1) * PAGE_SIZE;
  const pageEvents = filteredEvents.slice(pageStart, pageStart + PAGE_SIZE);

  const activeFilters = [
    ...selectedRepos.map((repo) => ({ label: repo, onClear: () => toggleRepo(repo) })),
    ...selectedTypes.map((type) => ({ label: getEventMeta(type).label, onClear: () => toggleType(type) })),
    timeRange !== "all"
      ? {
          label: timeRange === "24h" ? "Last 24 hours" : "Last 7 days",
          onClear: () => setTimeRange("all"),
        }
      : null,
  ].filter(Boolean) as Array<{ label: string; onClear: () => void }>;

  function toggleRepo(repo: string) {
    setSelectedRepos((prev) => (prev.includes(repo) ? prev.filter((item) => item !== repo) : [...prev, repo]));
  }

  function toggleType(type: string) {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type]));
  }

  function clearFilters() {
    setSelectedRepos([]);
    setSelectedTypes([]);
    setQuery("");
    setTimeRange("all");
    setHideBots(true);
    setSelectAllRepos(false);
  }

  function toggleOrg(org: string) {
    setExpandedOrgs((prev) => {
      const next = new Set(prev);
      if (next.has(org)) {
        next.delete(org);
      } else {
        next.add(org);
      }
      return next;
    });
  }

  return (
    <div className="relative mt-10 grid gap-6 lg:grid-cols-[280px_1fr]">
      <aside className="h-fit rounded-2xl border border-border/60 bg-card/60 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold">Filters</p>
          <Filter className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="mt-4 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Search</p>
          <Input placeholder="Search repo, actor, title" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Time window</p>
          <div className="flex flex-col gap-2">
            {["24h", "7d", "all"].map((range) => (
              <Button key={range} type="button" variant={timeRange === range ? "default" : "outline"} size="sm" onClick={() => setTimeRange(range)}>
                {range === "24h" ? "Last 24 hours" : range === "7d" ? "Last 7 days" : "All time"}
              </Button>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Organizations</p>
          <div className="space-y-2 text-sm">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={selectAllRepos}
                onCheckedChange={(value) => {
                  const next = Boolean(value);
                  setSelectAllRepos(next);
                  if (!next) {
                    setSelectedRepos([]);
                  }
                }}
              />
              <span>All repositories</span>
            </label>
            {orgsQuery.isLoading ? (
              <p className="text-xs text-muted-foreground">Loading organizations...</p>
            ) : orgs.length === 0 ? (
              <p className="text-xs text-muted-foreground">No organizations available.</p>
            ) : (
              orgs.map((org, index) => {
                const isExpanded = expandedOrgs.has(org);
                const repos = reposByOrg.get(org) ?? [];
                const repoQuery = repoQueries[index];

                return (
                  <div key={org} className="rounded-lg border border-border/60 bg-background/40 p-2">
                    <button type="button" className="flex w-full items-center justify-between text-sm font-medium" onClick={() => toggleOrg(org)}>
                      <span>{org}</span>
                      {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    </button>
                    {isExpanded && (
                      <div className="mt-2 space-y-2 pl-2">
                        {repoQuery?.isLoading ? (
                          <p className="text-xs text-muted-foreground">Loading repos...</p>
                        ) : repos.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No repos found.</p>
                        ) : (
                          repos.map((repo) => {
                            const key = `${org}/${repo}`;
                            return (
                              <label key={key} className="flex cursor-pointer items-center gap-2 text-sm">
                                <Checkbox checked={selectedRepos.includes(key)} onCheckedChange={() => toggleRepo(key)} />
                                <span>{repo}</span>
                              </label>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Event types</p>
          <div className="max-h-44 space-y-2 overflow-auto pr-1 text-sm">
            {availableTypes.map((type) => {
              const meta = getEventMeta(type);
              return (
                <label key={type} className="flex cursor-pointer items-center gap-2">
                  <Checkbox checked={selectedTypes.includes(type)} onCheckedChange={() => toggleType(type)} />
                  <span>{meta.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Actors</p>
          <label className="flex items-center gap-2 text-sm">
            <Checkbox checked={hideBots} onCheckedChange={(value) => setHideBots(Boolean(value))} />
            <span>Hide bot accounts</span>
          </label>
        </div>

        <div className="mt-6 rounded-xl border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Need more?</p>
          <p className="mt-1">Ask Pulse AI to highlight important PRs, risky issues, or review queues.</p>
        </div>

        <div className="mt-4">
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      </aside>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">Activity feed</h2>
            <p className="text-sm text-muted-foreground">{filteredEvents.length} events match your current filters.</p>
          </div>
          <Button variant="outline" onClick={() => setIsChatOpen(true)}>
            <MessageSquare className="mr-2 h-4 w-4" />
            Open Pulse AI
          </Button>
        </div>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            {activeFilters.map((filter) => (
              <Badge key={filter.label} variant="secondary" className="gap-2">
                {filter.label}
                <button type="button" onClick={filter.onClear} aria-label={`Remove ${filter.label}`}>
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/60">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-border/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <span>Event</span>
            <span>Repository</span>
            <span>Actor</span>
            <span>Time</span>
            <span></span>
          </div>
          <div className="divide-y divide-border/60">
            {selectedRepos.length === 0 ? (
              <div className="px-6 py-8 text-sm text-muted-foreground">Select one or more repositories to load activity.</div>
            ) : isEventsLoading ? (
              <div className="px-6 py-8 text-sm text-muted-foreground">Loading events...</div>
            ) : pageEvents.length === 0 ? (
              <div className="px-6 py-8 text-sm text-muted-foreground">No events match these filters.</div>
            ) : (
              pageEvents.map((event) => {
                const href = getEventHref(event);
                const summary = getEventSummary(event);
                const meta = getEventMeta(event.type);

                return (
                  <div key={event.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={meta.priority}>{meta.label}</Badge>
                        <span className="font-semibold text-foreground">{summary}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{event.type}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.org}/{event.repo}
                    </div>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={event.avatar} alt={event.username} />
                        <AvatarFallback>{event.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-foreground">{event.username}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{formatDate(event.createdAt)}</div>
                    <div className="text-right">
                      {href ? (
                        <Link className="text-sm font-medium text-foreground underline-offset-4 hover:underline" href={href} target="_blank" rel="noreferrer">
                          View
                        </Link>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {filteredEvents.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Page {pageIndex} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={pageIndex === 1}>
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))} disabled={pageIndex === totalPages}>
                Next
              </Button>
            </div>
          </div>
        )}
      </section>

      {isChatOpen && (
        <div className="fixed inset-0 z-40">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setIsChatOpen(false)} aria-label="Close chat" />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-border/60 bg-background p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Pulse AI</p>
                <p className="text-xs text-muted-foreground">Chat over the current activity set</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="relative mt-6 overflow-hidden rounded-2xl border border-border/60 bg-card/60">
              <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
              <div className="relative z-10 p-6 text-center">
                <Badge variant="outline" className="mx-auto mb-3">
                  Coming soon
                </Badge>
                <p className="text-sm font-semibold">Pulse AI is on the way</p>
                <p className="mt-2 text-xs text-muted-foreground">We are building a focused assistant for open-source activity insights.</p>
              </div>
              <div className="absolute inset-0 opacity-40" aria-hidden>
                <div className="h-full w-full bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
              </div>
            </div>

            <div className="mt-6 space-y-4 opacity-60">
              <Card className="border-border/60 bg-card/60">
                <CardHeader>
                  <CardTitle className="text-sm">Quick prompts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickPrompts.map((prompt) => (
                    <Button key={prompt} variant="outline" className="w-full justify-start" size="sm" disabled>
                      {prompt}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-border/60 bg-card/60">
                <CardHeader>
                  <CardTitle className="text-sm">Chat</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded-xl border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">Connect the RAG layer to enable summaries, insights, and action lists.</div>
                  <Input placeholder="Ask about trends, blockers, or priorities..." disabled />
                  <Button className="w-full" disabled>
                    Send
                  </Button>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
