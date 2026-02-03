import express from "express";
import { globalError } from "./libs/globalError";
import eventRoute from "./router/event.route";
import "./worker";

const app = express();

app.use(express.json())
app.use("/event", eventRoute)



app.use(globalError)

app.listen(8080, () => {
  console.log("Server started on port 8080");
});