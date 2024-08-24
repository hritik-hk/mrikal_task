import express from "express";
import {
  createCustomShortUrl,
  createRandomShortUrl,
  redirectToOriginalUrl,
} from "../controllers/url.controllers.js";

const router = express.Router();

router
  .post("/random", createRandomShortUrl)
  .post("/custom", createCustomShortUrl)
  .get("/:shortCode", redirectToOriginalUrl);

export default router;
