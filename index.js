const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

mongoose
  .connect("mongodb://test:test123@ds033754.mlab.com:33754/spearsocial", {
    useNewUrlParser: true,
    useCreateIndex: true
  })
  .then(() => console.log("connected successfully to DB."))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use("/analysis", require("./routes/analysis"));
app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/profile"));

app.get("/", (req, res) => {
  res.send("hello world");
});

const PORT = 5000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
