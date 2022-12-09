const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const requestIp = require("request-ip");

app.use(cors());

app.get("/", (req, res) => {
  let hours = new Date().getUTCHours();
  var hourStamp = new Date().setUTCHours(hours, 0, 0, 0);
  let ip = requestIp.getClientIp(req);
  if (fs.existsSync(`./data/first/${hourStamp}.json`)) {
    let file = require(`./data/first/${hourStamp}.json`);
    let index = file.length + 1;
    file.push({ id: index, ...req.headers, ip, timestamp: Date.now() });
    fs.writeFileSync(`./data/first/${hourStamp}.json`, JSON.stringify(file), null, 4);
  } else {
    fs.writeFileSync(
      `./data/first/${hourStamp}.json`,
      JSON.stringify([{ id: 1, ...req.headers, ip, timestamp: Date.now() }])
    );
  }
  res.sendFile(path.join(__dirname + "/temp.html"));
});

app.get("/push", (req, res) => {
  let hours = new Date().getUTCHours();
  var hourStamp = new Date().setUTCHours(hours, 0, 0, 0);
  let ip = requestIp.getClientIp(req);

  if (fs.existsSync(`./data/second/${hourStamp}.json`)) {
    let file = require(`./data/second/${hourStamp}.json`);
    let index = file.length + 1;
    file.push({ id: index, ...req.headers, ip, timestamp: Date.now() });
    fs.writeFileSync(`./data/second/${hourStamp}.json`, JSON.stringify(file), null, 4);
  } else {
    fs.writeFileSync(
      `./data/second/${hourStamp}.json`,
      JSON.stringify([{ id: 1, ...req.headers, timestamp: Date.now(), ip }])
    );
  }
  res.send(true);
});

app.listen(port, () => {
  console.log(`localhost:${port}`);
});
