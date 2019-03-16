const config = require('config');
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){

	const token = req.header(config.get('authHeader'));
	if(!token)return res.status(401).send('Access Denied. No token found');

	try{
		const decoded = jwt.verify(token, config.get('jwtSecretKey'));
		req.user = decoded;
		next();
	}catch(ex){
		return res.status(400).send('Invalid token.');
	}	
}