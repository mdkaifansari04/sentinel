-- CreateTable
CREATE TABLE "GitHubEvent" (
    "id" TEXT NOT NULL,
    "org" TEXT NOT NULL,
    "repo" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatar" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "data" JSONB NOT NULL,
    "isSensitive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "GitHubEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "GitHubEvent_org_idx" ON "GitHubEvent"("org");

-- CreateIndex
CREATE INDEX "GitHubEvent_repo_idx" ON "GitHubEvent"("repo");

-- CreateIndex
CREATE INDEX "GitHubEvent_type_idx" ON "GitHubEvent"("type");

-- CreateIndex
CREATE INDEX "GitHubEvent_createdAt_idx" ON "GitHubEvent"("createdAt");
