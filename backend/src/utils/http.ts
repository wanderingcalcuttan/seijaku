import { z, ZodError } from "zod";

import type { NextFunction, Request, Response } from "express";

export class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function parseBody<T>(schema: z.ZodSchema<T>, payload: unknown) {
  return schema.parse(payload);
}

export function asyncHandler<T extends Request>(
  fn: (req: T, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: T, res: Response, next: NextFunction) => {
    void fn(req, res, next).catch(next);
  };
}

export function errorMiddleware(error: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof HttpError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      issues: error.flatten(),
    });
    return;
  }

  // Multer surfaces upload failures as a MulterError with a `code` discriminator.
  // We recognise it by name to avoid importing multer's types into this shared
  // util. The LIMIT_FILE_SIZE case maps to HTTP 413 so admin UIs can show a
  // precise "too large" message rather than a generic 500.
  if (
    error instanceof Error &&
    (error as { name?: string; code?: string }).name === "MulterError"
  ) {
    const code = (error as { code?: string }).code;
    if (code === "LIMIT_FILE_SIZE") {
      res
        .status(413)
        .json({ error: "File is too large. Uploads are capped at 50 MB." });
      return;
    }
    res.status(400).json({ error: error.message });
    return;
  }

  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
    return;
  }

  res.status(500).json({ error: "Unknown error" });
}
