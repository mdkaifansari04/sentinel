import express from "express";
import { Worker } from "worker_threads";
import { globalError } from "./libs/globalError.js";
import eventRoute from "./router/event.route.js";
import cors from "cors";
import { initWorkerThread } from "./worker/init.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/events", eventRoute);

app.use(globalError);
initWorkerThread();

app.listen(8080, () => {
  console.log("Server started on port 8080");
});
