import { Worker } from "bullmq";
import "dotenv/config";
import redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  console.log("REDIS URL not found!");
  process.exit(1);
}

const connection = new redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

//@ts-ignore
const processUrlVisit = async (visit) => {
  console.log(visit);
};

try {
  const urlVisitWorker = new Worker("visit-processing-queue", processUrlVisit, {
    connection,
  });
  console.log("visit worker starting...");
} catch (error) {
  console.log("error occurred in visit worker: ", error);
  process.exit(1);
}
