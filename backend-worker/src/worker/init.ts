import { Worker } from "worker_threads";

export function initWorkerThread() {
  const worker = new Worker("./dist/worker/index.js");
  worker.on("message", (message) => {
    console.log(message);
  });
  worker.on("error", (error) => {
    console.log(error);
  });
  worker.on("exit", (code) => {
    console.log(`Worker exited with code ${code}`);
  });
}
