export const getProducts = async () => {
    return new Promise((resolve) => {
        // Create the product objects
        const products = [
            { id: 1, name: "Redis Cookbook", price: 29.99 },
            { id: 2, name: "Node.js Guide", price: 34.50 }
        ]

        // Wrap the resolution in a 2-second (2000ms) delay
        setTimeout(() => {
            resolve(products);
        }, 2000);
    });
};

export const getProductDetails = async (id) => {
    return new Promise((resolve) => {

        // Wrap the resolution in a 2-second (2000ms) delay
        setTimeout(() => {
            resolve([
                {
                    id: id,
                    name: `product ${id}`,
                    price: id
                },
            ]);
        }, 2000);
    });
};