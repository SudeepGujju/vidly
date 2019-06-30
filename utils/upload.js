//const multer = require('multer');
const path = require("path");
const config = require("config");
const crypto = require("crypto");
const multerGridFSStorage = require("multer-gridfs-storage");

module.exports = function(multer) {
  const diskStorage = multer.diskStorage({
    destination: function(req, file, next) {
      //console.log(__dirname);
      next(null, "uploads");
    },
    filename: function(req, file, next) {
      next(null, Date.now() + "_" + path.extname(file.originalname));
    }
  });
  const gridStorage = new multerGridFSStorage({
    db: GblMongoConnection,
    file: function(req, file) {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename =
            buf.toString("hex") + path.extname(file.originalname);
          const fileInfo = {
            filename,
            bucketName: config.Collections.File,
            metadata: { originalname: file.originalname }
          };
          return resolve(fileInfo);
        });
      });
    }
  });
  const fileFilter = function(req, file, next) {
    if (file.mimetype.startsWith("image")) next(null, true);
    else next(new Error("Invalid File"));
  }; /* 
console.log(multer({
			storage: storage,
			fileFilter: fileFilter,
			limits: {
				fileSize: 1024*1024
			}
		})); */
  return multer({
    storage: gridStorage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024
    }
  });
};
