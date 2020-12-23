var db = require("../config/connection");
var collection = require('../config/collections');
var objectId = require("mongodb").ObjectID;

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
    },
    // ================== delete Products ========================
    deleteProduct: (product_id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).removeOne({ _id: objectId(product_id) }).then((response) => {
                resolve(response);
            });
        });
    },
    // ============== Recieving all Products Informations ===============
    getProductDetails: (product_id) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(product_id) }).then((Product) => {
                resolve(Product);
            });
        });
    },
    // ================= Updating the Product ======================
    updateProduct: (product_id, product_details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).updateOne({
                _id: objectId(product_id)
            }, {
                $set: {
                    Name: product_details.Name,
                    Price: product_details.Price
                }
            }).then((response) => {
                resolve();
            });
        });
    }
};