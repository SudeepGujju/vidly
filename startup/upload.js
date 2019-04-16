//const multer = require('multer');
const path = require('path');

module.exports = function(multer){

	const storage = multer.diskStorage({
		destination: function(req, file, next){
			console.log(__dirname);
			next(null, 'uploads');
		},
		filename: function(req, file, next){
			next(null, Date.now()+"_"+path.extname(file.originalname))
		}
	});
	const fileFilter = function(req, file, next){

		if(file.mimetype.startsWith("image"))
			next(null, true);
		else
			next(new Error('Invalid File'));
	};/* 
console.log(multer({
			storage: storage,
			fileFilter: fileFilter,
			limits: {
				fileSize: 1024*1024
			}
		})); */
	return multer({
			storage: storage,
			fileFilter: fileFilter,
			limits: {
				fileSize: 1024*1024
			}
		});
}