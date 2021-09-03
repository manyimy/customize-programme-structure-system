const express = require("express");
const app = express();
const cors = require('cors');

app.use(cors());

app.use('/login', (req, res) => {
  res.send({
    token: 'test123'
  });
});

app.get("/", (req, res, next) => {
  res.send("Civil management");
});

app.listen(4000, () => {
  console.log("Listing on port 4000");
});
