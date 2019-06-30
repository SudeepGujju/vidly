const winston = require("winston");
const express = require("express");
const app = express();
const https = require("https");

require("./startup/logging")();
require("./startup/configuration")();
require("./startup/validation")();
require("./startup/database")();
require("./startup/routes")(app);
//require("./startup/upload")();

const port = process.env.PORT || 6800;
app.listen(port, () => {
  winston.info(`Listening on ${port}`);
});

/*

function handleException(ex) {
  let result = [];

  for (field in ex.errors) {
    result.push(ex.errors[field].message);
  }

  return result.join(" -> ");
}

const logger = winston.createLogger({
	level: 'error',
	transports:[
		new winston.transports.MongoDB({level:'error', db: "mongodb://localhost:27017/vidly"}),
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'combined.txt'})
	]
});
*/