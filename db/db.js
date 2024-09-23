const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
let dbConnection;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db("learn2");
        return cb();
       })
      .catch((err) => {
       console.log(err);
       return cb(err);
       });
  },
  getDb: () => dbConnection,
};
