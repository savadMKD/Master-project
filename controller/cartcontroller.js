var db = require("../config/connection");
var collection = require('../config/collections');
var objectId = require("mongodb").ObjectID;

module.exports = {
    // ================ Add To Cart =======================
    AddToCart: (product_id, user_id) => {
        let product_object = {
            item: objectId(product_id),
            quantity: 1
        };
        return new Promise( async (resolve, reject) => {
            let user_cart = await db.get().collection(collection.CART_COLLECTION).findOne({ user:objectId(user_id) });
            if(user_cart){
                let product_exist = user_cart.products.findIndex(
                    (product) => product.item == product_id
                );
                if(product_exist != -1){
                    db.get().collection(collection.CART_COLLECTION).updateOne(
                        { user: objectId(user_id), "products.item": objectId(product_id) },
                        { $inc: { "products.$.quantity": 1 } }
                    ).then(() => {
                        resolve();
                    });
                }
                else{
                    db.get().collection(collection.CART_COLLECTION).updateOne(
                        { user: objectId(user_id) },
                        { $push: { products: product_object } }
                    ).then((response) => {
                        resolve();
                    })
                };
            }
            else{
                let cart_object = {
                    user: objectId(user_id),
                    products: [product_object]
                };
                db.get().collection(collection.CART_COLLECTION).insertOne(cart_object).then((response) => {
                    resolve();
                });
            };
        });
    }
};