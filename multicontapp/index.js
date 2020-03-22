const express = require("express");
const redis = require("redis");

const app = express();

const client = redis.createClient({
  host: 'my-redis-server',
  port: 6379
});

app.get('/', (req, res) => {
  res.send("Hello from my docker webbbb app");
});

app.listen(8090, () => {
  console.log("Listening on port 8090");
});
