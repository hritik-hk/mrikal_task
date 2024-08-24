import { Queue } from "bullmq";
import redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL) {
  console.log("REDIS URL not found!");
  process.exit(1);
}

//@ts-ignore
const connection = new redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

const visitQueue = new Queue("visit-processing-queue", { connection });

export default visitQueue;
