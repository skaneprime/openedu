import express from 'express';
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import crypto from 'crypto';
import http from 'http';
import { createReadStream } from 'fs'
import appSrc from './app.js';

const PORT = process.env.PORT || 3002;
const app = appSrc(express, bodyParser, createReadStream, crypto, http);
const User = mongoose.model("User", { login: String, password: String });

app.post("/insert/", async (req, res) => {
  const { connection } = await mongoose.connect(req.body.URL);
  await new User({
    login: req.body.login,
    password: req.body.password,
  }).save();

  connection.close();
  res.end();
});

app.all("*", (req, res) => res.send("itmo338893"));

app.listen(PORT, () => console.log(`launched on ${PORT}`));
