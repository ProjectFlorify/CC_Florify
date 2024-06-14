require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./routes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to Florify");
});

app.use("/", router);

app.listen(port, () => {
  console.log(`Server is running on port:${port}`);
});
