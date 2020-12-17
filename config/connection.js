// ============ Database Connection ==================
const mongoClient = require("mongodb").MongoClient;
const state = {
    db: null
};

module.exports.connect = function(done) {
    const URL = "mongodb://localhost:27017";
    const dbName = "Royal-Furniture";

    mongoClient.connect(URL, { useUnifiedTopology:true }, (err, data) => {
        if (err) return done(err);
        state.db = data.db(dbName);
        done();
    });
};

module.exports.get = function() {
    return state.db;
};