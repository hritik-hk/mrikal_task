import { NextFunction, Request, Response } from "express";
import { redis } from "../index.js";

export default function rateLimiter({
  window,
  requestsAllowed,
}: {
  window: number;
  requestsAllowed: number;
}) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      const ip = req.clientIp;
      const url = req.url;

      const identifier = `${url} ${ip}`;
      const req_count = await redis.incr(identifier);

      let try_after = 0;
      if (req_count === 1) {
        await redis.expire(identifier, window);
      } else {
        try_after = await redis.ttl(identifier);
      }

      if (req_count > requestsAllowed) {
        return res.status(429).json({ msg: `try after ${try_after} seconds` });
      }
    } catch (error) {
      console.log("rate limiter error: ", error);
    }

    next();
  };
}
