const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const {router} = require("./routes");
const {webhookMiddleware} = require("./controller");
const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "live" });
});

app.use("/v1/", router);
app.use(webhookMiddleware);

const port = 8000;
const host = "localhost";

app.listen(port, () => {
  console.log("listening at http://" + host + ":" + port);
});
