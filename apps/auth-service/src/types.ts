import type { Request } from "express";

/** Request augmented by the authenticate middleware. */
export interface AuthedRequest extends Request {
  userId: string;
}
