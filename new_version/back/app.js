const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/post", (req, res) => {
  console.log("Connected to React");
  res.redirect("/");
});

app.listen(8080);
