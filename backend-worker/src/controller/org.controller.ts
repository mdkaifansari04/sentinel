import type { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../libs/globalError.js";
import { prisma } from "../libs/client.js";

export const getAllOrgs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const orgs = await prisma.gitHubEvent.findMany({ select: { org: true }, distinct: ["org"] });
    if (!orgs.length) {
      return next(new ErrorResponse("No organizations found", 404));
    }
    res.status(200).json({ success: true, data: orgs });
  } catch (error) {
    console.error("Error fetching organizations:", error);
    next(new ErrorResponse("Failed to fetch organizations", 500));
  }
};

export const getAllReposOfOrg = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { org } = req.params as { org: string };
    const repos = await prisma.gitHubEvent.findMany({ where: { org }, select: { repo: true }, distinct: ["repo"] });
    if (!repos.length) {
      return next(new ErrorResponse("No repositories found for this organization", 404));
    }
    res.status(200).json({ success: true, data: repos });
  } catch (error) {
    console.error("Error fetching repositories:", error);
    next(new ErrorResponse("Failed to fetch repositories", 500));
  }
};
