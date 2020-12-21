var db = require("../config/connection");
var collection = require("../config/collections");
const bcrypt = require("bcrypt")

module.exports = {
    // ================ User Signup ======================
    signup: (userData) => {
        return new Promise(async (resolve, reject) => {
            userData.Password = await bcrypt.hash(userData.Password, 10);
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data) => {
                resolve(data.ops[0])
            });
        });
    },

    // ==================== User Login ========================
    userLogin: (userData) => {
        return new Promise( async (resolve, reject) => {
            let loginStatus = false;
            let response = {  };
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })

            // =============== Checking User ====================
            if(user){
                bcrypt.compare(userData.Password, user.Password).then((status) => {
                    if(status){
                        response.user = user;
                        response.status = true;
                        resolve(response);
                    }
                    else {
                        resolve({ status: false });
                    }
                });
            }
            else {
                resolve({ status: false });
            }
        });
    },

    // =================== Admin Login ==========================
    adminLogin: (adminData) => {
        return new Promise( async (resolve, reject) => {
            let admin_login_status = false;
            let admin_response = {  };
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ Email: adminData.Email });

            // ============== Checking admin exising in database =================
            if(admin){
                bcrypt.compare(adminData.Password, admin.Password).then((status) => {
                    if(status){
                        admin_response.admin = admin;
                        admin_response.status = true;
                        resolve(admin_response);
                    }
                    else {
                        resolve({ status: false });
                    }
                });
            }
            else{
                resolve({ status: false });
            };
        });
    },

    // ================= Create Admin ============================
    admin_sigup: (adminData) => {
        return new Promise( async (resolve, reject) => {
            adminData.Password = await bcrypt.hash(adminData.Password, 10);
            db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then((data) => {
                resolve(data.ops[0])
            });
        });
    }
};