import fs from "node:fs";

// Amplify injects console variables into the build shell, not into an old
// Next bundle. Write them where Next.js loads production env.
if (!process.env.AWS_BRANCH) process.exit(0);

const keys = [
  "DAILY_API_KEY",
  "DAILY_DOMAIN",
  "CALL_LINK_SECRET",
  "CALL_JOIN_ORIGIN",
  "SMTP_HOST",
  "SMTP_PORT",
  "SMTP_USER",
  "SMTP_PASSWORD",
];

const lines = keys
  .filter((key) => process.env[key])
  .map((key) => `${key}=${JSON.stringify(process.env[key])}`);

if (lines.length === 0) process.exit(0);

fs.appendFileSync(".env.production", `${lines.join("\n")}\n`);
