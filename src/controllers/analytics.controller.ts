import { Request, Response } from "express";
import Url from "../model/url.model.js";

const getAnalytics = async (req: Request, res: Response) => {
  try {
    const shortCode = req.params.shortCode;

    const url = await Url.findOne({ shortCode: shortCode });

    if (!url) {
      return res.status(400).json({ error: "invalid short url" });
    }

    return res.status(200).json(url);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

export { getAnalytics };
