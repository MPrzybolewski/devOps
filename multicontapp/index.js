const express = require('express');
const redis = require('redis');
const process = require('process');

const app = express();

const client = redis.createClient({
  host: 'my-redis-server',
  port: 6379
});

client.set('counter', 0);

app.get('/', (req, resp) => {
  client.get('counter', (err, counter_value) => {
    resp.send('Counter: ' + counter_value);
    client.set('counter', parseInt(counter_value) + 1);
  });
});

app.get("/nwd", (req, res) => {
  const l1 = req.query.l1;
  const l2 = req.query.l2;

  const key = `${l1}_${l2}`;  
  client.exists(key, (err, exists) => {
    if (exists === 1) {
      client.get(key, (err, nwd) => {
        res.send(nwd);
        return;
      });
    } else {
      const nwd = countNWD(l1, l2);
      client.set(key, nwd);
      res.send(nwd);
    }
  });
});

app.listen(8090, () => {
  console.log("Listening on port 8090");
});
