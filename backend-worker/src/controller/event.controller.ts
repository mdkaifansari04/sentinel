import type { NextFunction, Request, Response } from "express";
import { ErrorResponse } from "../libs/globalError.js";
import { prisma } from "../libs/client.js";

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { repo, org } = req.params as { repo: string; org: string };
    if (!repo || !org) {
      throw new ErrorResponse("Repo and org are required", 400);
    }

    const events = await prisma.gitHubEvent.findMany({
      where: {
        repo: repo,
        org: org,
      },
      take: 100, // top 100 new events
      orderBy: {
        createdAt: "asc",
      },
    });
    res.status(200).json({
      success: true,
      message: "Events fetched successfully",
      data: events,
    });
  } catch (error) {
    console.log("Error in getEvents controller", error);
    next(new ErrorResponse("Error in getEvents controller", 500));
  }
};
