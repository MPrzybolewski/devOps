const express = require('express');
const app = express();
const redis = require('redis');

const {v4: uuidv4} = require('uuid');

const appId = uuidv4();

const port = 5000;

const client  = redis.createClient({
    host: "redis-service",
    port: 6379
});

app.get('/', (req, resp) => {
	resp.send(`[${appId} Hello from my backend app]`)
});

app.listen(port, err => {
	console.log(`Listening on port ${port}`);
})