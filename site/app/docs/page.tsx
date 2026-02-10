import { SiteHeader } from "@/components/site-header";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Database, GitBranch, Server, FileCode, Terminal, Settings, GitPullRequest, BookOpen, ExternalLink, Code2, Workflow, Lock } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-24">
        {/* Header */}
        <div className="mb-16 space-y-4">
          <h1 className="text-4xl font-semibold lg:text-5xl">Documentation</h1>
          <p className="max-w-2xl text-lg text-muted-foreground">Everything you need to understand, deploy, and customize Sentinel for your open-source workflow.</p>
        </div>

        {/* Overview Section */}
        <section className="mb-16 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Overview</h2>
            <p className="text-muted-foreground">What Sentinel does and why it exists</p>
          </div>
          <div className="space-y-4 text-muted-foreground">
            <p>Sentinel tracks activity across open source repositories and turns it into a clean, queryable feed. Built for contributors and maintainers who want fast awareness of issues, pull requests, reviews, releases, and discussions without living inside GitHub tabs.</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <GitBranch className="mb-3 h-5 w-5" />
                  <h3 className="mb-2 font-medium text-foreground">Polls repositories</h3>
                  <p className="text-sm">Monitors GitHub events on a scheduled interval</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <Database className="mb-3 h-5 w-5" />
                  <h3 className="mb-2 font-medium text-foreground">Stores events</h3>
                  <p className="text-sm">Normalizes and saves to Postgres for fast queries</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <Server className="mb-3 h-5 w-5" />
                  <h3 className="mb-2 font-medium text-foreground">Serves data</h3>
                  <p className="text-sm">Exposes clean API endpoints for consumption</p>
                </CardContent>
              </Card>
              <Card className="border-border/60">
                <CardContent className="pt-6">
                  <Workflow className="mb-3 h-5 w-5" />
                  <h3 className="mb-2 font-medium text-foreground">Modern dashboard</h3>
                  <p className="text-sm">Next.js UI with filters and activity views</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Architecture Section */}
        <section className="mb-16 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Architecture</h2>
            <p className="text-muted-foreground">How the system works end-to-end</p>
          </div>
          <div className="space-y-4">
            <Card className="border-border/60 bg-muted/30">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2 text-sm font-mono">
                  <Code2 className="h-4 w-4" />
                  <span>GitHub API → Worker → Postgres → API → Next.js UI</span>
                </div>
                <ol className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-3">
                    <Badge variant="outline" className="h-6 w-6 shrink-0 items-center justify-center p-0">
                      1
                    </Badge>
                    <span>Backend worker reads a configured list of repositories</span>
                  </li>
                  <li className="flex gap-3">
                    <Badge variant="outline" className="h-6 w-6 shrink-0 items-center justify-center p-0">
                      2
                    </Badge>
                    <span>Calls GitHub Events API for each repository on a schedule</span>
                  </li>
                  <li className="flex gap-3">
                    <Badge variant="outline" className="h-6 w-6 shrink-0 items-center justify-center p-0">
                      3
                    </Badge>
                    <span>Events are normalized into typed payloads and stored in Postgres</span>
                  </li>
                  <li className="flex gap-3">
                    <Badge variant="outline" className="h-6 w-6 shrink-0 items-center justify-center p-0">
                      4
                    </Badge>
                    <span>Frontend fetches latest events via API and renders activity view</span>
                  </li>
                </ol>
              </CardContent>
            </Card>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Project Structure</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="border-border/60">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4" />
                      <h4 className="font-medium">backend-worker/</h4>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>Event ingestion worker, Prisma schema, and database migrations</p>
                  </CardContent>
                </Card>
                <Card className="border-border/60">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <FileCode className="h-4 w-4" />
                      <h4 className="font-medium">site/</h4>
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>Next.js frontend, UI components, and dashboard views</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Quick Start Section */}
        <section className="mb-16 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Quick Start</h2>
            <p className="text-muted-foreground">Get Sentinel running locally in minutes</p>
          </div>

          <div className="space-y-8">
            {/* Backend Setup */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                <h3 className="text-xl font-semibold">1. Backend Worker</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="mb-2 font-medium text-foreground">Prerequisites</h4>
                  <ul className="list-inside list-disc space-y-1 text-muted-foreground">
                    <li>Node.js 18+ (or 20+)</li>
                    <li>PostgreSQL database</li>
                    <li>GitHub token (recommended for higher rate limits)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 font-medium text-foreground">Installation</h4>
                  <Card className="border-border/60 bg-muted/40">
                    <CardContent className="p-4">
                      <pre className="overflow-x-auto text-xs">
                        <code>{`cd backend-worker
pnpm install

# Create .env file
DATABASE_URL="postgres://USER:PASSWORD@HOST:PORT/DB?sslmo   de=require"
GITHUB_TOKEN="your_github_token"
REPO_LIST="open-metadata/openmetadata,OWASP-BLT/BLT"
POLL_INTERVAL_MS="300000"
REQUEST_DELAY_MS="200"

# Run migrations
pnpm prisma generate
pnpm prisma migrate deploy

# Start worker
pnpm dev`}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            {/* Frontend Setup */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Workflow className="h-5 w-5" />
                <h3 className="text-xl font-semibold">2. Frontend Dashboard</h3>
              </div>

              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="mb-2 font-medium text-foreground">Installation</h4>
                  <Card className="border-border/60 bg-muted/40">
                    <CardContent className="p-4">
                      <pre className="overflow-x-auto text-xs">
                        <code>{`cd site
npm install

# Optional: Configure API endpoint
EVENTS_API_URL="http://localhost:8080/api/events/open-metadata/openmetadata"

# Start development server
npm run dev`}</code>
                      </pre>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Configuration Section */}
        <section className="mb-16 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Settings className="h-6 w-6" />
              <h2 className="text-3xl font-semibold">Configuration</h2>
            </div>
            <p className="text-muted-foreground">Environment variables and settings</p>
          </div>

          <div className="overflow-hidden rounded-lg border border-border/60">
            <table className="w-full text-sm">
              <thead className="border-b border-border/60 bg-muted/40">
                <tr>
                  <th className="p-3 text-left font-medium">Variable</th>
                  <th className="p-3 text-left font-medium">Description</th>
                  <th className="p-3 text-left font-medium">Required</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-3 font-mono text-xs">DATABASE_URL</td>
                  <td className="p-3 text-muted-foreground">Postgres connection string used by Prisma</td>
                  <td className="p-3">
                    <Badge variant="outline">Yes</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">GITHUB_TOKEN</td>
                  <td className="p-3 text-muted-foreground">GitHub API token to increase rate limits</td>
                  <td className="p-3">
                    <Badge variant="outline">Recommended</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">REPO_LIST</td>
                  <td className="p-3 text-muted-foreground">Comma-separated repository list (owner/repo format)</td>
                  <td className="p-3">
                    <Badge variant="outline">Yes</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">POLL_INTERVAL_MS</td>
                  <td className="p-3 text-muted-foreground">Worker poll interval in milliseconds</td>
                  <td className="p-3">
                    <Badge variant="outline">Optional</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">REQUEST_DELAY_MS</td>
                  <td className="p-3 text-muted-foreground">Delay between API calls to reduce rate spikes</td>
                  <td className="p-3">
                    <Badge variant="outline">Optional</Badge>
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-mono text-xs">EVENTS_API_URL</td>
                  <td className="p-3 text-muted-foreground">API endpoint used by the frontend</td>
                  <td className="p-3">
                    <Badge variant="outline">Optional</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <Separator className="my-12" />

        {/* API Reference Section */}
        <section className="mb-16 space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">API Reference</h2>
            <p className="text-muted-foreground">Expected response format and endpoints</p>
          </div>

          <div className="space-y-4">
            <Card className="border-border/60 bg-muted/40">
              <CardHeader>
                <h3 className="font-medium">Event Response Schema</h3>
              </CardHeader>
              <CardContent>
                <pre className="overflow-x-auto text-xs">
                  <code>{`{
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
}`}</code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Make It Your Own Section */}
        <section className="mb-16 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lock className="h-6 w-6" />
              <h2 className="text-3xl font-semibold">Make It Your Own</h2>
            </div>
            <p className="text-muted-foreground">Customize Sentinel for your specific needs</p>
          </div>

          <div className="space-y-4">
            <Card className="border-border/60">
              <CardHeader>
                <h3 className="font-medium">Repository List Configuration</h3>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  The worker supports a simple comma-separated list using the <code className="rounded bg-muted px-1 py-0.5 text-xs">REPO_LIST</code> environment variable:
                </p>
                <Card className="border-border/60 bg-muted/40">
                  <CardContent className="p-3">
                    <code className="text-xs">REPO_LIST=&quot;owner1/repo1,owner2/repo2&quot;</code>
                  </CardContent>
                </Card>
                <p className="pt-2">
                  For a hard-coded list, replace the env-driven configuration in <code className="rounded bg-muted px-1 py-0.5 text-xs">backend-worker/src/index.ts</code>:
                </p>
                <Card className="border-border/60 bg-muted/40">
                  <CardContent className="p-3">
                    <pre className="text-xs">
                      <code>{`export const repoList = [
  { owner: "OWASP-BLT", repo: "BLT" },
  { owner: "open-metadata", repo: "openmetadata" }
];`}</code>
                    </pre>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <h3 className="font-medium">Customize Polling Interval</h3>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>
                  Adjust <code className="rounded bg-muted px-1 py-0.5 text-xs">POLL_INTERVAL_MS</code> based on your rate limit and update frequency needs. Default is 5 minutes (300000ms).
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <h3 className="font-medium">Extend Event Types</h3>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p>Modify the Prisma schema and worker logic to track additional GitHub event types beyond the current set of issues, PRs, releases, and comments.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Contributing Section */}
        <section className="mb-16 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <GitPullRequest className="h-6 w-6" />
              <h2 className="text-3xl font-semibold">Contributing</h2>
            </div>
            <p className="text-muted-foreground">Help improve Sentinel</p>
          </div>

          <div className="space-y-4 text-sm text-muted-foreground">
            <p>Contributions are welcome! Here&apos;s how to get started:</p>

            <ol className="space-y-3">
              <li className="flex gap-3">
                <Badge variant="outline" className="h-6 w-6 shrink-0 items-center justify-center p-0">
                  1
                </Badge>
                <span>
                  Fork the repository and create a new branch from <code className="rounded bg-muted px-1 py-0.5 text-xs">main</code>
                </span>
              </li>
              <li className="flex gap-3">
                <Badge variant="outline" className="h-6 w-6 shrink-0 items-center justify-center p-0">
                  2
                </Badge>
                <span>Make your changes with a clear, focused scope</span>
              </li>
              <li className="flex gap-3">
                <Badge variant="outline" className="h-6 w-6 shrink-0 items-center justify-center p-0">
                  3
                </Badge>
                <span>Test locally to ensure everything runs correctly</span>
              </li>
              <li className="flex gap-3">
                <Badge variant="outline" className="h-6 w-6 shrink-0 items-center justify-center p-0">
                  4
                </Badge>
                <span>Open a pull request with a short, clear summary</span>
              </li>
            </ol>

            <div className="pt-4">
              <h3 className="mb-3 font-medium text-foreground">Code Standards</h3>
              <ul className="list-inside list-disc space-y-1">
                <li>Keep changes small and focused</li>
                <li>Use simple, clear naming conventions</li>
                <li>Avoid large refactors in a single PR</li>
                <li>Keep UI changes accessible and readable</li>
                <li>Add screenshots for UI changes</li>
              </ul>
            </div>

            <Card className="border-border/60 bg-muted/30">
              <CardContent className="p-4">
                <p className="text-xs">
                  For detailed contribution guidelines, see{" "}
                  <Link href="https://github.com/mdkaifansari04/sentinel/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-foreground hover:underline">
                    CONTRIBUTING.md
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        <Separator className="my-12" />

        {/* Resources Section */}
        <section className="mb-16 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <h2 className="text-3xl font-semibold">Resources</h2>
            </div>
            <p className="text-muted-foreground">Helpful links and references</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="https://github.com/mdkaifansari04/sentinel" target="_blank" rel="noopener noreferrer" className="group">
              <Card className="border-border/60 transition-colors hover:border-foreground/20">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <GitBranch className="h-5 w-5" />
                    <div>
                      <h3 className="font-medium">GitHub Repository</h3>
                      <p className="text-sm text-muted-foreground">View source code and contribute</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardContent>
              </Card>
            </Link>

            <Link href="https://github.com/mdkaifansari04/sentinel/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="group">
              <Card className="border-border/60 transition-colors hover:border-foreground/20">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <GitPullRequest className="h-5 w-5" />
                    <div>
                      <h3 className="font-medium">Contribution Guide</h3>
                      <p className="text-sm text-muted-foreground">Learn how to contribute</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardContent>
              </Card>
            </Link>

            <Link href="https://github.com/mdkaifansari04/sentinel/issues" target="_blank" rel="noopener noreferrer" className="group">
              <Card className="border-border/60 transition-colors hover:border-foreground/20">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <FileCode className="h-5 w-5" />
                    <div>
                      <h3 className="font-medium">Issue Tracker</h3>
                      <p className="text-sm text-muted-foreground">Report bugs or request features</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardContent>
              </Card>
            </Link>

            <Link href="/activity" className="group">
              <Card className="border-border/60 transition-colors hover:border-foreground/20">
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-3">
                    <Workflow className="h-5 w-5" />
                    <div>
                      <h3 className="font-medium">Live Dashboard</h3>
                      <p className="text-sm text-muted-foreground">See Sentinel in action</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Help Section */}
        <Card className="border-border/60 bg-muted/20">
          <CardContent className="p-8 text-center">
            <h3 className="mb-2 text-lg font-semibold">Need Help?</h3>
            <p className="mb-4 text-sm text-muted-foreground">If you have questions or run into issues, open a GitHub issue or start a discussion.</p>
            <div className="flex justify-center gap-4">
              <Link href="https://github.com/mdkaifansari04/sentinel/issues/new" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
                Open an Issue
                <ExternalLink className="h-3 w-3" />
              </Link>
              <Link href="https://github.com/mdkaifansari04/sentinel/discussions" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:underline">
                Start a Discussion
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
