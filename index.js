const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");

const Analysis = require("./analysis");
const Auth = require("./auth");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use("/analysis", Analysis);
app.use("/auth", Auth);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.post("/posting/youtube", (req, res) => {
  setTimeout(() => {
    res.json({});
  }, 500);
});
app.post("/posting/twitter", (req, res) => {
  setTimeout(() => {
    res.status(401).json({});
  }, 500);
});

const PORT = 5000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
