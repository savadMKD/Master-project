var db = require("../config/connection");
var collection = require('../config/collections');

module.exports = {
    // ============ Adding Product to database ===============
    addProduct: (product) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
                resolve(data.ops[0]._id)
            });
        });
    },
    // ================= Getting All Products ========================
    getAllProducts: () => {
        return new Promise( async (resolve, reject) => {
            let Products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
            resolve(Products);
        });
    }
};