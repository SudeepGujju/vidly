const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function() {
  winston.add(winston.transports.File, { filename: "./logs/complete.log" });
  //winston.add(winston.transports.MongoDB, { db: "mongodb://localhost:27017" });
  winston.add(winston.transports.MongoDB, {
    db: "mongodb://localhost:27017/vidly"
  });

  winston.handleExceptions(
    new winston.transports.File({ filename: "./logs/uncaughtExceptions.log" })
  );

  process.on("uncaughtException", function(ex) {
    //console.log("Uncaught >>>", ex);
    throw ex;
    // 'EADDRINUSE' Address already in use
  });

  process.on("unhandledRejection", function(ex) {
    //console.log("unhandledRejection >>>", ex);
    throw ex;
  });

  /*
	process.on('uncaughtException', function(err){
		winston.error(err.message, err);
		process.exit(1);
		return false;
	});

	process.on('unhandledRejection', function(err){
		winston.error(err.message, err);
		process.exit(1);
		return false;
	});
	*/
};

module.exports.stream = {
  write: function(message, encoding) {
    console.log(message);
    winston.info(message);
  }
};
