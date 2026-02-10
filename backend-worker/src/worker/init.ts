import { Worker } from "worker_threads";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const workerPath = new URL("./index.js", import.meta.url).pathname;

export function initWorkerThread() {
  const worker = new Worker(workerPath);
  worker.on("message", (message) => {
    console.log(message);
  });
  worker.on("error", (error) => {
    console.log(error);
  });
  worker.on("exit", (code, signal) => {
    console.log(`Worker exited with code ${code} and signal ${signal}`);
  });
}
