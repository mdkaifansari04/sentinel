import type { NextFunction, Request, Response } from "express";

export class ErrorResponse extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const globalError = (err: Error, req: Request, res: Response, next: NextFunction) => {
  try {
    const { statusCode, message } = err as any;

    if (statusCode === 404) {
      return res.status(404).json({
        success: false,
        message: message || "Not Found",
      });
    }
    if (statusCode == 500) {
      res.status(500).json({
        success: false,
        message: message || "Internal Server Error",
      });
    }
    if (statusCode == 400) {
      res.status(400).json({
        success: false,
        message: message || "Bad Request",
      });
    }
  } catch (error) {
    console.log("Error in globalError handler", error);
  }
};
