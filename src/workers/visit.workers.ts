import { Worker } from "bullmq";
import "dotenv/config";
import redis from "ioredis";
import connectToDB from "../config/database.js";
import Url from "../model/url.model.js";

const REDIS_URL = process.env.REDIS_URL;

if (!REDIS_URL) {
  console.log("REDIS URL not found!");
  process.exit(1);
}

//@ts-ignore
const connection = new redis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

//make db connection
await connectToDB();

//@ts-ignore
const processUrlVisit = async (visit) => {
  const { shortCode, clientIp, userAgent } = visit.data;

  const url = await Url.findOne({ shortCode: shortCode });

  if (!url) {
    console.log("error processsing shortcode: ", shortCode);
    return;
  }

  //find unique visitors
  let uniqueVisitor = 0;
  let uniqueVisitorIdx = url.visitHistory.findIndex((visit) => {
    return visit.clientIp === clientIp && visit.userAgent == userAgent;
  });

  if (uniqueVisitorIdx === -1) {
    uniqueVisitor = 1;
  }

  const updated = {
    totalVisits: url.totalVisits + 1,
    uniqueVisits: url.uniqueVisits + uniqueVisitor,
    visitHistory: [...url.visitHistory, { clientIp, userAgent }],
  };
  

  await Url.findOneAndUpdate({ shortCode: shortCode }, updated);
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
