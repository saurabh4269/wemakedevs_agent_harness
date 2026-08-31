import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { formatBenchmarkMarkdown, runLoopBenchmark } from "../src/benchmark.js";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
process.stdout.write(formatBenchmarkMarkdown(runLoopBenchmark({ repoRoot })));
