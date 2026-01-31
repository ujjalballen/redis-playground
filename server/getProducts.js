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

export const getProductOne = (id) => {

    return {
        id: id,
        name: `product ${id}`,
        price: id
    }

};


export const inventoryJSON = {
  "inventory": {
    "mountain_bikes": [{
        "id": "bike:1",
        "model": "Phoebe",
        "description": "This is a mid-travel trail slayer that is a fantastic daily driver or one bike quiver. The Shimano Claris 8-speed groupset gives plenty of gear range to tackle hills and there\u2019s room for mudguards and a rack too.  This is the bike for the rider who wants trail manners with low fuss ownership.",
        "price": 1920,
        "specs": {
          "material": "carbon",
          "weight": 13.1
        },
        "colors": ["black", "silver"],
      },
      {
        "id": "bike:2",
        "model": "Quaoar",
        "description": "Redesigned for the 2020 model year, this bike impressed our testers and is the best all-around trail bike we've ever tested. The Shimano gear system effectively does away with an external cassette, so is super low maintenance in terms of wear and teaawait client. All in all it's an impressive package for the price, making it very competitive.",
        "price": 2072,
        "specs": {
          "material": "aluminium",
          "weight": 7.9
        },
        "colors": ["black", "white"],
      },
      {
        "id": "bike:3",
        "model": "Weywot",
        "description": "This bike gives kids aged six years and older a durable and uberlight mountain bike for their first experience on tracks and easy cruising through forests and fields. A set of powerful Shimano hydraulic disc brakes provide ample stopping ability. If you're after a budget option, this is one of the best bikes you could get.",
        "price": 3264,
        "specs": {
          "material": "alloy",
          "weight": 13.8
        },
      },
    ],
    "commuter_bikes": [{
        "id": "bike:4",
        "model": "Salacia",
        "description": "This bike is a great option for anyone who just wants a bike to get about on With a slick-shifting Claris gears from Shimano\u2019s, this is a bike which doesn\u2019t break the bank and delivers craved performance.  It\u2019s for the rider who wants both efficiency and capability.",
        "price": 1475,
        "specs": {
          "material": "aluminium",
          "weight": 16.6
        },
        "colors": ["black", "silver"],
      },
      {
        "id": "bike:5",
        "model": "Mimas",
        "description": "A real joy to ride, this bike got very high scores in last years Bike of the year report. The carefully crafted 50-34 tooth chainset and 11-32 tooth cassette give an easy-on-the-legs bottom gear for climbing, and the high-quality Vittoria Zaffiro tires give balance and grip.It includes a low-step frame , our memory foam seat, bump-resistant shocks and conveniently placed thumb throttle. Put it all together and you get a bike that helps redefine what can be done for this price.",
        "price": 3941,
        "specs": {
          "material": "alloy",
          "weight": 11.6
        },
      },
    ],
  }
};