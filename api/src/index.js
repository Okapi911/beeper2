// In index.js
import "dotenv/config.js";
import { checkJwt } from "./auth/jwt-middleware.js";
import { postBeep, BeepTooLongError } from "./use-case/post-beep.js";
console.log(process.env);

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(checkJwt);

app.get("/", (req, res) => {
  res.status(200).send(`Hello ${req.auth.sub}`);
});

app.post("/beep", async (req, res) => {
  try {
    const postedBeep = await postBeep(req.auth.sub, req.body.content);
    res.status(201).json(postedBeep);
  } catch (e) {
    if (e instanceof BeepTooLongError) {
      res.status(400).send("Beep too long");
    } else {
      throw e;
    }
  }
});

app.get("/home", async (req, res) => {
  const home = await getUserHome(req.auth.sub);
  res.status(200).json(home);
});

app.listen(8080);
