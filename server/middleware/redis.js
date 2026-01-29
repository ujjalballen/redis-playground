import { client } from "../server.js";

export const getCachedData = (key) => {
    return async (req, res, next) => {

        const data = await client.get(key);

        console.log("from cached")
        if (data) {
            console.log("Get from Cached");
            return res.json({
                product: JSON.parse(data)
            })
        };

        next();
    }
}