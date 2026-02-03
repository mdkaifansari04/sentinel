import Link from "next/link";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchEvents } from "@/lib/api";
import type { GitHubEventRecord } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

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

export default async function ActivityPage() {
  const events = await fetchEvents();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 pb-16 pt-12">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-muted-foreground">
            Live activity
          </p>
          <h1 className="text-3xl font-semibold">Latest repository events</h1>
          <p className="text-muted-foreground">
            Showing the most recent activity from your tracked repositories.
          </p>
        </header>

        <section className="mt-8 grid gap-4">
          {events.length === 0 ? (
            <Card className="border-border/60 bg-card/60">
              <CardContent className="p-6 text-sm text-muted-foreground">
                No events yet. Make sure your worker is running and the API is reachable.
              </CardContent>
            </Card>
          ) : (
            events.map((event) => {
              const href = getEventHref(event);
              const summary = getEventSummary(event);

              return (
                <Card key={event.id} className="border-border/60 bg-card/60">
                  <CardContent className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={event.avatar} alt={event.username} />
                        <AvatarFallback>{event.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-semibold text-foreground">{event.username}</p>
                          <Badge variant="outline">{event.type}</Badge>
                          <Badge variant="muted">
                            {event.org}/{event.repo}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{summary}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(event.createdAt)}</p>
                      </div>
                    </div>
                    {href ? (
                      <Link
                        className="text-sm font-medium text-foreground underline-offset-4 hover:underline"
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open on GitHub
                      </Link>
                    ) : null}
                  </CardContent>
                </Card>
              );
            })
          )}
        </section>
      </main>
    </div>
  );
}
