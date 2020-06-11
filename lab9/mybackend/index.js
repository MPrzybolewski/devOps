const express = require('express');
const app = express();
const redis = require('redis');
const keys = require('./keys');

const {v4: uuidv4} = require('uuid');

const appId = uuidv4();

const port = 5000;

const client  = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const { Pool } = require('pg');
const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.pgHost,
    password: keys.pgPassword,
    port: keys.pgPort
});

pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
    .query('CREATE TABLE IF NOT EXISTS values (number FLOAT)')
    .catch(err => console.log(err));

app.get('/', (req, resp) => {
	resp.send(`[${appId} Hello from my backend app]`)
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
    return ((n * (a1 + an)) / 2);
}

function addArithmeticSumToDB(arithmeticSum) {
    pgClient
        .query('INSERT INTO values VALUES ($1)', [arithmeticSum])
        .catch(err => console.log(err));
}


app.listen(port, err => {
	console.log(`Listening on port ${port}`);
})
