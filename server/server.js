import express from "express"
import 'dotenv/config';
import { createClient } from 'redis';
import { getProductDetails, getProducts } from "./getProducts.js";
import { getCachedData } from "./middleware/redis.js";
const app = express();
const port = 3000;

app.use(express.json());

export const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.HOST_URL,
        port: 19931
    }
});

// 2. Handle connection events
client.on('error', (err) => console.log('Redis Client Error', err));
client.on('connect', () => console.log('Connected to Redis successfully!'));

// 3. Establish the connection (Async)
(async () => {
    await client.connect();
})();


app.get('/', async (req, res) => {

    console.log("here is my IP: ", req.ip)

    const clientIP = req.ip;


    const requestCount = await client.incr(clientIP);

    if(requestCount === 2){
        await client.expire(clientIP, 60)
    }

    const timeLeave = await client.ttl(clientIP);



    if(requestCount > 5){
        return res.status(409).send(`Too many request: ${timeLeave}`)
    }


    res.send(`Hello World ${requestCount}`)
})


app.get("/products", getCachedData("products"), async (req, res) => {

    // const exsitProducts = await client.exists("products")

    // if (exsitProducts) {
    //     console.log("Product from Cached")
    //     const products = await client.get("products");
    //     return res.json({
    //         products: JSON.parse(products)
    //     })
    // }

    const products = await getProducts();

    await client.set("products", JSON.stringify(products), {
        EX: 10
    })

    res.json({
        products
    })
});


app.get("/products/:id", async (req, res) => {
    const id = req.params.id;
    const key = `product:${id}`

    const getProduct = await client.get(key);
    if (getProduct) {
        console.log("Get from Cached");
        return res.json({
            product: JSON.parse(getProduct)
        })
    };

    const product = await getProductDetails(id);
    await client.set(key, JSON.stringify(product));

    res.json({
        product
    })

});


// invalided manually
app.get("/order/:id", async (req, res) => {
    const id = req.params.id;
    const key = `product:${id}`

    // mutation stuff from db

    // guess we do have store in redis, now need to invalid or delelte from redis
    await client.del(key)

    return res.json({
        order: `Order successfully placed: ${id}`
    })
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})