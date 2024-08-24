import { Request, Response } from "express";
import { generateShortCode } from "../utils/common.js";
import { RETRIES } from "../constants.js";

const createRandomShortUrl = async (req: Request, res: Response) => {
  try {
    let retries = RETRIES;

    while (retries > 0) {
      const shortCode = generateShortCode();

      retries--;
    }
  } catch {}
};

export { createRandomShortUrl };
