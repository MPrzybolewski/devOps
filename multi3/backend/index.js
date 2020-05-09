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
    port: keys.redisPort
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
    .query('CREATE TABLE IF NOT EXISTS values (number FLOAT)')
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello from backend');
});

app.get('/arithmeticSum', (req, res) => {
    let a1 = parseFloat(req.query.firstNumber);
    let an = parseFloat(req.query.lastNumber);
    let n = parseFloat(req.query.numberOfElements);
    const key = `${a1}-${an}-${n}`;

    client.exists(key, (err, ok) => {
        if (ok === 1) {
            client.get(key, (err, value) => {
                let arithmeticSum = parseFloat(value);
                addArithmeticSumToDB(arithmeticSum);
                res.send('' + arithmeticSum );
            });
        } else {
            let arithmeticSum = getArithmeticSum(a1, an, n);
            addArithmeticSumToDB(arithmeticSum);
            client.set(key, arithmeticSum);
            res.send('' + arithmeticSum );
        }
    });
});

function getArithmeticSum(a1, an, n){
    console.log(a1);
    console.log(an);
    console.log(n);
    return ((n * (a1 + an)) / 2);
}

function addArithmeticSumToDB(arithmeticSum) {
    pgClient
        .query('INSERT INTO values VALUES ($1)', [arithmeticSum])
        .catch(err => console.log(err));
}


const port = 5000;
app.listen(port, () => {
    console.log(`Backend app listening on port ${port}`);
});
