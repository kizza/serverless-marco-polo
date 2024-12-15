import { log } from "console"
import { pollCloudWatchLogs } from "./helpers/cloudwatch";

const waitSeconds = 60;

const randomString = (length = 8) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars.charAt(Math.floor(Math.random() * chars.length))).join('');
};

test("enqueueing and reading a message", async () => {
  const endpoint = process.env.ENDPOINT
  if (!endpoint) {
    throw new Error("💡 Marco ENDPOINT required in .env");
  }

  // Enqueue a message via the marco function
  const salt = randomString()
  const response = await fetch(`${endpoint}?message=${salt}`)
  expect(response.status).toBe(200);
  log("🚀 Sent", salt)

  // Find the logged message via polo function
  const logGroupName = "/aws/lambda/play-dev-polo";
  const filterPattern = salt
  const logs = await pollCloudWatchLogs(logGroupName, filterPattern, waitSeconds);
  expect(logs.length).toBe(1)
  log("👌 Received")
}, waitSeconds * 1000);
