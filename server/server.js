import express from "express"
import { createClient } from 'redis';
const app = express();
const port = 3000;

app.use(express.json());

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.HOST_URL,
        port: 19931
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})