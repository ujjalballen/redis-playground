import express from "express"
import 'dotenv/config';
import { createClient } from 'redis';
import { getProductDetails, getProductOne, getProducts } from "./getProducts.js";
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

    if (requestCount === 2) {
        await client.expire(clientIP, 60)
    }

    const timeLeave = await client.ttl(clientIP);



    if (requestCount > 5) {
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
});


// LISTS

app.get("/products/add/:id", async (req, res) => {
    const productId = req.params.id;

    const getProduct = getProductOne(productId);
    console.log(getProduct)

    // await client.lPush("products", JSON.stringify(getProduct))
    // await client.RPUSH("products", JSON.stringify(getProduct))

    // await client.RPOP("products")

    //    const final = await client.LLEN("products")

    // await client.LPOP("products")

    // read all lists
    const getAll = await client.LRANGE("products", 0, -1);

    const result = [getProduct];

    res.json({ result: getAll })

})



// Sets
app.get("/product/sets/:id", async (req, res) => {
    const id = req.params.id;

    // const getProduc = getProductOne(id);

    // await client.SADD("product", id)

    // const result = await client.sAdd("bikes:racing:france", ['bike:2', 'bike:3'])

    // const result = await client.del("bikes:racing:france")
    // const result= await client.sRem("product", "1")
    const result = await client.sIsMember("product", "2120")


    res.json({ result })

});


// hashes
app.get("/hashes", async (req, res) => {
    const product = { id: 1, name: "Redis Cookbook", price: 29.99 };

    // const result = await client.hSet("products", product);
    // const result = await client.hGet("products", "price")
    // const result = await client.hGetAll("products")
    // const result = await client.hmGet("products", ["name", "price"])
    const result = await client.hIncrBy("products", "price", 100)

    res.json({ result })
})


//sorted sets
app.get("/sorted-sets", async (req, res) => {

    // const result = await client.zAdd("racer_scores", { score: 12, value: 'Castilla' })

    //     const result = await client.zAdd("racer_scores", [
    //   { score: 8, value: 'Sam-Bodden' },
    //   { score: 10, value: 'Royce' },
    //   { score: 6, value: 'Ford' },
    //   { score: 14, value: 'Prickett' },
    //   { score: 12, value: 'Castilla' }
    // ])

    // const result = await client.zRange('racer_scores', 0, -1)
    // const result = await client.zRangeWithScores('racer_scores', 0, -1)
    const result = await client.zRem('racer_scores', 'Castilla')

    res.json({ result })
})


// pub/sub

app.get("/users", async (req, res) => {

    const cachedValue = await client.get("users");
    if(cachedValue){
        return res.json(JSON.parse(cachedValue))
    }


    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    const data = await response.json();

    await client.set("users", JSON.stringify(data))
    await client.expire('users', 40)

   return res.json({ data })

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})