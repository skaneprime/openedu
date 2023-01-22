import mongoose from "mongoose";
import axios from "axios";
import cheerio from "cheerio";

export default (express, bodyParser, createReadStream, crypto, http) => {
  const app = express();
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

  app.get("/test/", async (req, res) => {
    try {
      const response = await axios.get(`${req.query.URL}`);
      const $ = cheerio.load(response.data);
      
      $("#bt").click();
      res.send($("#inp").val());
    } catch (err) {
      console.log(err);
      res.end();
    }
  });

  app.get('/login/', (req, res) => res.send('itmo338931'));

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

  return app;
};
