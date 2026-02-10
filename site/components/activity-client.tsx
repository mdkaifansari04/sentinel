"use client";

import * as React from "react";
import Link from "next/link";
import { Filter, MessageSquare, X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { GitHubEventRecord } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

const quickPrompts = ["What are the most trending issues?", "Which PRs are ready to merge?", "Show me urgent review requests.", "Summarize activity in the last 6 hours."];

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return dateFormatter.format(date);
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
  return event.type;
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

export function ActivityClient({ events }: { events: GitHubEventRecord[] }) {
  const [query, setQuery] = React.useState("");
  const [selectedRepos, setSelectedRepos] = React.useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = React.useState<string[]>([]);
  const [timeRange, setTimeRange] = React.useState("24h");
  const [isChatOpen, setIsChatOpen] = React.useState(false);

  const repos = React.useMemo(() => {
    return Array.from(new Set(events.map((event) => `${event.org}/${event.repo}`))).sort();
  }, [events]);

  const types = React.useMemo(() => {
    return Array.from(new Set(events.map((event) => event.type))).sort();
  }, [events]);

  const filteredEvents = React.useMemo(() => {
    const lowerQuery = query.trim().toLowerCase();

    return events
      .filter((event) => (selectedRepos.length === 0 ? true : selectedRepos.includes(`${event.org}/${event.repo}`)))
      .filter((event) => (selectedTypes.length === 0 ? true : selectedTypes.includes(event.type)))
      .filter((event) => timeMatchesFilter(event.createdAt, timeRange))
      .filter((event) => {
        if (!lowerQuery) {
          return true;
        }
        const summary = getEventSummary(event).toLowerCase();
        return event.username.toLowerCase().includes(lowerQuery) || summary.includes(lowerQuery) || `${event.org}/${event.repo}`.toLowerCase().includes(lowerQuery);
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [events, query, selectedRepos, selectedTypes, timeRange]);

  const activeFilters = [
    ...selectedRepos.map((repo) => ({ label: repo, onClear: () => toggleRepo(repo) })),
    ...selectedTypes.map((type) => ({ label: type, onClear: () => toggleType(type) })),
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
  }

  return (
    <div className="relative mt-10 grid gap-6 lg:grid-cols-[260px_1fr]">
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
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Repositories</p>
          <div className="max-h-40 space-y-2 overflow-auto pr-1 text-sm">
            {repos.map((repo) => (
              <label key={repo} className="flex cursor-pointer items-center gap-2">
                <Checkbox checked={selectedRepos.includes(repo)} onCheckedChange={() => toggleRepo(repo)} />
                <span>{repo}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Event types</p>
          <div className="max-h-40 space-y-2 overflow-auto pr-1 text-sm">
            {types.map((type) => (
              <label key={type} className="flex cursor-pointer items-center gap-2">
                <Checkbox checked={selectedTypes.includes(type)} onCheckedChange={() => toggleType(type)} />
                <span>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-border/60 bg-muted/40 p-3 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Need more?</p>
          <p className="mt-1">Ask gitbot to highlight important PRs, risky issues, or review queues.</p>
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
            Open Gitbot
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
            {filteredEvents.length === 0 ? (
              <div className="px-6 py-8 text-sm text-muted-foreground">No events match these filters.</div>
            ) : (
              filteredEvents.map((event) => {
                const href = getEventHref(event);
                const summary = getEventSummary(event);

                return (
                  <div key={event.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{event.type}</Badge>
                        <span className="font-semibold text-foreground">{summary}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{event.data?.type ?? event.type}</p>
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
      </section>

      {isChatOpen && (
        <div className="fixed inset-0 z-40">
          <button type="button" className="absolute inset-0 bg-black/40" onClick={() => setIsChatOpen(false)} aria-label="Close chat" />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md border-l border-border/60 bg-background p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">Gitbot AI</p>
                <p className="text-xs text-muted-foreground">Chat over the current activity set</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-6 space-y-4">
              <Card className="border-border/60 bg-card/60">
                <CardHeader>
                  <CardTitle className="text-sm">Quick prompts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickPrompts.map((prompt) => (
                    <Button key={prompt} variant="outline" className="w-full justify-start" size="sm">
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
                  <Input placeholder="Ask about trends, blockers, or priorities..." />
                  <Button className="w-full">Send</Button>
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
