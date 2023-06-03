const dotenv = require("dotenv");
dotenv.config();
const BodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const {router} = require("./routes");
const {webhookMiddleware} = require("./controller");
const app = express();
app.use(cors({
  origin: "*",
}));

app.use(BodyParser.json());

app.get("/", (req, res) => {
  res.json({ message: "live" });
});

app.use("/v1/", router);
app.use(webhookMiddleware);

const port = 8080;
const host = "localhost";

app.listen(port, () => {
  console.log("listening at http://" + host + ":" + port);
});
