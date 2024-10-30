import "reflect-metadata";
import express from "express";
import cors from "cors";
import routers from "./app/routes/routes";

const app = express();

app.use(cors());

app.use(express.json());

app.use(routers);

app.listen(3000, () => {
  console.log("Server ok");
});
