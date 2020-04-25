const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const keys = require('./keys');
const redis = require('redis');

const app = express();
app.use(cors());
app.use(bodyParser.json());

console.log(keys);

const client  = redis.createClient({
  host: keys.redisHost,
  port: 6379
});

const { Pool } = require('pg');
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err));

app.get("/nwd", (req, res) => {
  let number1 = req.query.firstNumber;
  let number2 = req.query.secondNumber;

  const key = `${number1}-${number2}`;

  client.exists(key, (err, ok) => {
    var nwd;
    if (ok === 1) {
      client.get(key, (err, value) => {
        nwd = value;
        addNwd(nwd);
      });
    } else {
      nwd = getNWD(number1, number2);
      addNwd(nwd);
      client.set(key, nwd);
    }
    res.send({ value: nwd });
  });
});

app.get("/getAllNwd", (req, res) => {
  pgClient
      .query('Select number from values', (err, value) => {
        if (err) {
          console.log(err);
        } else {
          res.send( {values: value.rows})
        }
      })
});

function getNWD(number1, number2){
  if (number2 === 0) {
    return number1;
  }
  return getNWD(number2, number1 % number2)
}

function addNwd(nwd) {
  pgClient
      .query('INSERT INTO values VALUES ($1)', [nwd])
      .catch(err => console.log(err));
}

app.listen(8090, () => {
  console.log("Listening on port 8090");
});
