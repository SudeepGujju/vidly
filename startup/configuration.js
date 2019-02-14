const config = require('config');

module.exports = function(){

	if(!config.get('jwtSecretKey')){
		throw new Error("Fatal error: jwtSecretKey not configured");
	}
};