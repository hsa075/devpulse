#!/usr/bin/env node
import { checkEndpoints } from "./index.js";

function readTimeout(args: string[]): number {
  const index = args.indexOf("--timeout");
  if (index === -1) return 5000;

  const value = Number(args[index + 1]);
  if (!Number.isInteger(value) || value < 1) {
    throw new Error("--timeout must be a positive integer (milliseconds)");
  }
  return value;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const urls = args.filter((arg, index) =>
    /^https?:\/\//i.test(arg) && args[index - 1] !== "--timeout"
  );

  if (args.includes("--help") || urls.length === 0) {
    console.log("Usage: devpulse <url...> [--timeout milliseconds]");
    process.exitCode = urls.length === 0 && !args.includes("--help") ? 2 : 0;
    return;
  }

  const report = await checkEndpoints(urls, { timeoutMs: readTimeout(args) });
  console.log(JSON.stringify(report, null, 2));
  if (report.summary.down > 0) process.exitCode = 1;
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 2;
});
