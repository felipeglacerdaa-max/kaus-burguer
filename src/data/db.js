const DB_KEY = 'kaus_burguer_db';

const initialData = {
    "products": [
        {
            "id": "1",
            "name": "Kaus Clássico",
            "description": "O nosso carro-chefe. Pão brioche, hambúrguer artesanal 180g, queijo cheddar, alface e tomate frescos.",
            "price": 25,
            "image": "https://img.freepik.com/fotos-gratis/hamburguer-de-vista-frontal-em-um-carrinho_141793-15542.jpg",
            "ingredients": [
                "pao",
                "carne",
                "queijo",
                "alface",
                "tomate"
            ]
        },
        {
            "id": "2",
            "name": "Monster Bacon",
            "description": "Para quem tem fome de verdade. Duas carnes, muito bacon crocante e molho barbecue especial.",
            "price": 32,
            "image": "https://s2-casavogue.glbimg.com/D1eZZYJZhz3ur3PQW1lGBwCmh8Q=/419x24:1135x1303/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_d72fd4bf0af74c0c89d27a5a226dbbf8/internal_photos/bs/2022/p/X/eb4KQdToys327cGqnRGg/receita-ceboloni-bacon.jpg",
            "ingredients": [
                "pao",
                "carne-dupla",
                "bacon",
                "queijo",
                "barbecue"
            ]
        },
        {
            "id": "3",
            "name": "Veggie Supreme",
            "description": "Saboroso e leve. Hambúrguer de grão de bico, rúcula, tomate seco e maionese de ervas.",
            "price": 28,
            "image": "https://s2-vogue.glbimg.com/HSrfFZSHwlmhebQ1GW145kRU_Ow=/0x0:620x466/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_5dfbcf92c1a84b20a5da5024d398ff2f/internal_photos/bs/2022/V/i/sHBuE9TCAU2AXQjMwEcQ/2016-04-04-veggie-2.jpg",
            "ingredients": [
                "pao-integral",
                "hamburguer-grao",
                "rucula",
                "tomate-seco"
            ]
        }
    ],
    "ingredients": [
        {
            "id": "pao",
            "name": "Pão Brioche",
            "price": 0
        },
        {
            "id": "carne",
            "name": "Carne 180g",
            "price": 0
        },
        {
            "id": "queijo",
            "name": "Queijo Cheddar",
            "price": 0
        },
        {
            "id": "alface",
            "name": "Alface",
            "price": 0
        },
        {
            "id": "tomate",
            "name": "Tomate",
            "price": 0
        },
        {
            "id": "bacon",
            "name": "Bacon",
            "price": 4
        },
        {
            "id": "pao-integral",
            "name": "Pão Integral",
            "price": 0
        },
        {
            "id": "carne-dupla",
            "name": "Carne Dupla",
            "price": 0
        },
        {
            "id": "rucula",
            "name": "Rúcula",
            "price": 0
        },
        {
            "id": "tomate-seco",
            "name": "Tomate Seco",
            "price": 0
        },
        {
            "id": "barbecue",
            "name": "Barbecue",
            "price": 0
        },
        {
            "id": "hamburguer-grao",
            "name": "Hambúrguer de Grão de Bico",
            "price": 0
        },
        {
            "id": "maionese-ervas",
            "name": "Maionese de Ervas",
            "price": 0
        }
    ]
};

export const db = {
    get: () => {
        const localDataRaw = localStorage.getItem(DB_KEY);
        let localData = localDataRaw ? JSON.parse(localDataRaw) : { products: [], ingredients: [] };

        // Sync logic: Keep local changes, but add new items from initialData if they don't exist
        const syncedProducts = [...localData.products];
        initialData.products.forEach(defaultProd => {
            const exists = syncedProducts.some(p => p.id === defaultProd.id);
            if (!exists) {
                syncedProducts.push(defaultProd);
            }
        });

        const syncedIngredients = [...localData.ingredients];
        initialData.ingredients.forEach(defaultIng => {
            const exists = syncedIngredients.some(i => i.id === defaultIng.id);
            if (!exists) {
                syncedIngredients.push(defaultIng);
            }
        });

        const finalData = {
            products: syncedProducts,
            ingredients: syncedIngredients
        };

        // If we made changes (or if it's the first time), save it back
        if (JSON.stringify(localData) !== JSON.stringify(finalData)) {
            localStorage.setItem(DB_KEY, JSON.stringify(finalData));
        }

        return finalData;
    },

    save: (data) => {
        localStorage.setItem(DB_KEY, JSON.stringify(data));
    },

    getProducts: () => {
        return db.get().products;
    },

    getIngredients: () => {
        return db.get().ingredients;
    },

    addProduct: (product) => {
        const data = db.get();
        const newProduct = { ...product, id: Date.now().toString() };
        data.products.push(newProduct);
        db.save(data);
        return newProduct;
    },

    updateProduct: (updatedProduct) => {
        const data = db.get();
        const index = data.products.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
            data.products[index] = updatedProduct;
            db.save(data);
        }
    },

    deleteProduct: (id) => {
        const data = db.get();
        data.products = data.products.filter(p => p.id !== id);
        db.save(data);
    },

    addIngredient: (name, price) => {
        const data = db.get();
        const newIngredient = {
            id: name.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, ''),
            name,
            price: parseFloat(price)
        };
        // Ensure unique ID
        if (data.ingredients.find(i => i.id === newIngredient.id)) {
            newIngredient.id += '-' + Date.now();
        }
        data.ingredients.push(newIngredient);
        db.save(data);
        return newIngredient;
    },

    deleteIngredient: (id) => {
        const data = db.get();
        data.ingredients = data.ingredients.filter(i => i.id !== id);
        db.save(data);
    },

    updateIngredient: (updatedIng) => {
        const data = db.get();
        const index = data.ingredients.findIndex(i => i.id === updatedIng.id);
        if (index !== -1) {
            data.ingredients[index] = {
                ...data.ingredients[index],
                ...updatedIng,
                price: parseFloat(updatedIng.price)
            };
            db.save(data);
        }
    }
};
