import express from "express";
import cors from "cors";
import { Redis } from "ioredis";

const { REDIS_URL } = process.env;
// const { REDIS_URL } = "http://127.0.0.1:6379"

const app = express();

app.use(express.json());
app.use(cors());


const redis = new Redis(REDIS_URL);

app.post("/webHook", async (req, res) => {
  await redis.rpush("MABL_WEBHOOK", JSON.stringify(req.body));
  res.sendStatus(201);
});

app.get("/webhook", async (req, res) => {
  let data = await redis.lpop("MABL_WEBHOOK");
  if (data) {
    data = JSON.parse(data);
    res.status(200).send(data);
  } else {
    res.sendStatus(404);
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
