import mongoose from "mongoose";
import axios from "axios";
import cheerio from "cheerio";

export default (express, bodyParser, createReadStream, crypto, http) => {
  const app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.text());

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,OPTIONS,DELETE"
    );
    next();
  });

  app.all("/login/", (req, res) => res.send("itmo336261"));

  app.all("/code/", (req, res) => {
    const filePath = import.meta.url.substring(7);

    createReadStream(filePath).pipe(res);
  });

  app.all("/sha1/:input", (req, res) => {
    const hash = crypto
      .createHash("sha1")
      .update(req.params.input)
      .digest("hex");

    res.send(hash);
  });

  app.all("/req/", async (req, res) => {
    http.get(`${req.query.addr}`, (resp) => {
      let data = "";

      resp.on("data", (chunk) => (data += chunk));

      resp.on("end", () => res.send(data));
    });
  });

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

  app.get("/test/", async (req, res) => {
    console.log(req.query.URL);
    axios
      .get(`${req.query.URL}`)
      .then((response) => {
        const $ = cheerio.load(response.data);

        const button = $("#bt");
        button.click();

        const inputValue = $("#inp").val();
        res.send(inputValue);
      })
      .catch((error) => {
        console.log(error);
        res.end();
      });
  });

  app.all("*", (req, res) => res.send("itmo336261"));

  return app;
};
