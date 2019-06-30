const winston = require("winston");

module.exports = function(err, req, res, next) {
  winston.error(err.message, err);

  // //console.log("error.js \r\n Error handling >>> ", err);
  // let errMsg =
  //   "Something Failed Internally" + (err.message ? " - " + err.message : "");
  // // switch (err.name) {
  // //   case "MulterError":
  // //     errMsg += 'file errors';
  // //     break;
  // // }

  let errMsg = err.message ? err.message : "Something Failed Internally";
  console.log("Handling Error in error .js Error Code", err.code);
  return res.status(500).send(errMsg);
};
