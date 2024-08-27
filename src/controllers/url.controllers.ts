import { Request, Response } from "express";
import { generateShortCode } from "../utils/common.js";
import { RETRIES } from "../constants.js";
import Url from "../model/url.model.js";
import visitQueue from "../services/visitQueue.js";
import { redis } from "../index.js";
import userAgentParser from "ua-parser-js";

const createRandomShortUrl = async (req: Request, res: Response) => {
  try {
    let retries = RETRIES;
    const originalUrl = req.body.originalUrl;

    while (retries > 0) {
      const shortCode = generateShortCode();

      const url = await Url.findOne({ shortCode: shortCode });

      if (url) {
        retries--;
        continue;
      }

      const newUrl = new Url({
        shortCode: shortCode,
        originalUrl: originalUrl,
        visitHistory: [],
      });

      const doc = await newUrl.save();

      return res.status(200).json({ shortUrl: doc.shortCode });
    }

    // all retries over
    return res.status(500).json({ error: "unable to generate short url" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: error });
  }
};

const createCustomShortUrl = async (req: Request, res: Response) => {
  try {
    const originalUrl = req.body.originalUrl;
    const customCode = req.body.customCode;

    if (customCode === "") {
      return res
        .status(400)
        .json({ error: "your custom code cannot be empty!" });
    }

    const url = await Url.findOne({ shortCode: customCode });

    if (url) {
      return res.status(400).json({ error: "short url already exists" });
    }

    const newUrl = new Url({
      shortCode: customCode,
      originalUrl: originalUrl,
      visitHistory: [],
    });

    const doc = await newUrl.save();

    return res.status(200).json({ shortUrl: newUrl.shortCode });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ error: error });
  }
};

const redirectToOriginalUrl = async (req: Request, res: Response) => {
  try {
    const shortCode = req.params.shortCode;

    //find in redis
    //@ts-ignore
    const longUrl = await redis.get(shortCode);
    const parser = new userAgentParser(req.headers["user-agent"]);
    const result = parser.getResult();

    // To Do: refactor code- remove repition
    if (longUrl) {
      console.log("added job from redis");
      //push visit update to queue
      visitQueue.add("visit-processing-queue", {
        shortCode: shortCode,
        deviceType: result.device.type,
        clientIp: req.clientIp,
        userAgent: req.headers["user-agent"],
      });

      return res.status(302).redirect(longUrl);
    }

    const url = await Url.findOne({ shortCode: shortCode });

    if (!url) {
      return res.status(400).json({ error: "invalid short url" });
    }

    console.log("added job from db");

    //push visit update to queue
    visitQueue.add("visit-processing-queue", {
      shortCode: shortCode,
      deviceType: result.device.type,
      clientIp: req.clientIp,
      userAgent: req.headers["user-agent"],
    });

    //add url to redis
    await redis.set(shortCode, url.originalUrl);

    return res.status(302).redirect(url.originalUrl as string);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

export { createRandomShortUrl, createCustomShortUrl, redirectToOriginalUrl };
