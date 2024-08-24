import "dotenv/config";
import express from "express";
import cors from "cors";
import requestIp from "request-ip";
import connectToDB from "./config/database.js";
import urlRouter from "./routes/url.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import Redis from "ioredis";
const REDIS_URL = process.env.REDIS_URL;

const PORT = process.env.PORT;

//db connection
await connectToDB();

//redis connection
//@ts-ignore
const redis = new Redis(REDIS_URL);

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestIp.mw());

app.use("/", urlRouter);
app.use("/analytics", analyticsRouter);

app.listen(PORT, () => {
  console.log(`server started at PORT: ${PORT}`);
});

export { redis };
