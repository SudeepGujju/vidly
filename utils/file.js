const config = require("config");
const mongoose = require("mongoose");
const gridfs = require("gridfs-stream");
const fs = require("fs");
//const crypto = require("crypto");
const path = require("path");
//const { getNewConnection } = require("../startup/database");

gridfs.mongo = mongoose.mongo;

module.exports.getFile = function(_id) {
  const fileProm = new Promise((resolve, reject) => {
    const gfs = gridfs(GblMongoConnection.db);

    gfs.findOne({ _id, root: config.Collections.File }, function(err, file) {
      if (err) {
        return reject(err);
      } else if (!file) {
        return reject(new Error({ message: "File not found" }));
      } else {
        const fileNamePath = path.join(config.Files.downloads, file.filename);
        const writeStream = fs.createWriteStream(fileNamePath);
        const readstream = gfs.createReadStream({
          _id,
          root: config.Collections.File
        });
        readstream.pipe(writeStream);
        writeStream.on("close", function() {
          return resolve({ fileName: fileNamePath, fileID: _id });
        });
      }
    });
  });
  return fileProm;
};

module.exports.removeFile = function(_id) {
  const fileProm = new Promise((resolve, reject) => {
    const gfs = gridfs(GblMongoConnection.db);

    gfs.remove({ _id, root: config.Collections.File }, function(err) {
      console.log("removing");
      if(err)
        reject(err);
      else
        resolve();
      
      return;
    });
  });
  return fileProm;
};

//let readstream = gfs.createReadStream({ _id: "5cc888f706e37f0450e9cbd8" });
//readstream.pipe(fs.createWriteStream("Test"));
//const connection = getNewConnection();
//connection.close();

/*
  let fileObject = {
    error: null,
    fileName: null
  };

  gfs.exist({ _id, root: config.Collections.File }, function(err, file) {
    console.log(arguments, err, file);

    if (err || !file) {
      fileObject.error = err ? err.message : "File not found";
      return reject(fileObject);
    } else {
      crypto.randomBytes(16, function(err, buf) {
        if (err) {
          fileObject.error;
          return reject(fileObject);
        } else {
          const fileName = buf.toString("hex");
          const FWP = path.join("temp", fileName);
          let writeStream = fs.createWriteStream(FWP);
          let readstream = gfs.createReadStream({
            _id,
            root: config.Collections.File
          });
          fileObject.fileName = FWP;
          readstream.pipe(writeStream);
          return resolve(fileObject);
        }
      });
    }
  });
*/
