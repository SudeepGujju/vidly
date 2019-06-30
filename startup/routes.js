const express = require("express");
const cors = require("cors");
const customers = require("../routes/customers");
const genres = require("../routes/genres");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const errorHandler = require("../middlewares/error");
const config = require("config");
const logger = require("./logging");
const morgan = require("morgan");
const path = require("path");

module.exports = function(app) {
  /*
   ** origin: Access-Control-Allow-Origin
   ** methods: Access-Control-Allow-Methods
   ** allowedHeaders: Access-Control-Allow-Headers     - default Access-Control-Request-Headers
   ** exposedHeaders: Access-Control-Expose-Headers
   ** credentials: Access-Control-Allow-Credentials
   ** maxAge: Access-Control-Max-Age
   ** preflightContinue:
   ** optionsSuccessStatus: For successful OPTIONS requests choke on 204 status code
   */
  const corsOptions = {
    methods: ["GET", "POST", "PUT", "DELETE", "OPTION"],
    exposedHeaders: [config.get("authHeader")],
    optionsSuccessStatus: 204
  };
  app.use(morgan("dev", { stream: logger.stream })); // -> moved to logging.js
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname + "/../dist/AngularApp")));

  app.use("/uploads",   express.static(path.join("./", config.Files.uploads)));
  app.use("/downloads", express.static(path.join("./", config.Files.downloads)));
  app.use("/images",    express.static(path.join("./", config.Files.images)));

  app.use("/api/customers", customers);
  app.use("/api/genres", genres);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);

  app.get("/*", function(req, res, next) {
    return res.sendFile(
      path.join(__dirname + "/../dist/AngularApp/index.html")
    );
  });

  app.use(errorHandler);
};
