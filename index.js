import express from 'express';
import bodyParser from 'body-parser';
import mongoose from "mongoose";
import crypto from 'crypto';
import http from 'http';
import { createReadStream } from 'fs'
import appSrc from './app';

const PORT = process.env.PORT || 3002;
const app = appSrc(express, bodyParser, createReadStream, crypto, http);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,OPTIONS,DELETE"
  );
  next();
});


// app.get("/test/", async (req, res) => {
//   console.log(req.query.URL);
//   const response = await axios.get(`${req.query.URL}`)
//   const $ = cheerio.load(response.data);

//   const button = $("#bt");
//   button.click();

//   const inputValue = $("#inp").val();
//   res.send(inputValue);
// });

const User = mongoose.model("User", { login: String, password: String });

app.post("/insert/", async (req, res) => {
  console.log(req.body);
  const { connection } = await mongoose.connect(req.body.URL);
  await new User({
    login: req.body.login,
    password: req.body.password,
  }).save();

  connection.close();
  res.end();
});

app.listen(PORT, () => console.log(`launched on ${PORT}`));
