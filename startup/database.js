const config = require("config");
const winston = require("winston");
const mongoose = require("mongoose");
const Fawn = require("fawn");

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  autoReconnect: true,
  reconnectTries: 5,
  reconnectInterval: 1000,
  bufferMaxEntries: 0,
  family: 4 //Ipv4 - 4,
};

const schemaOptions = {
  bufferCommands: true,
  id: true,
  _id: true,
  minimize: false,
  strict: true
};

module.exports = function() {
  Fawn.init(mongoose, "TransactionDocument");

  //@host @Port @Database
  //mongoose.connect("mongodb://localhost:27017/vidly", mongooseOptions);
  // .then(() => {
  //   winston.info("Connected to MongoDB");
  // });

  mongoose.connect(config.DBConfig.url, mongooseOptions);

  global.GblMongoConnection = mongoose.connection.on("connected", e =>
    console.log("connection success")
  ); //Remove.

  process.on("SIGINT", async function() {
    try {
      await mongoose.connection.close();
      console.log("Disconnected to MongoDB");
      process.exit(0);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  });
};

module.exports.getNewConnection = function() {
  return mongoose.connect(config.DBConfig.url, mongooseOptions).connection;
};
