const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();
require('./startup/validation')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/configuration')();

const port = process.env.PORT || 6800;
app.listen(port, () => { winston.info(`Listening on ${port}`); });

/*
const logger = winston.createLogger({
	level: 'error',
	transports:[
		new winston.transports.MongoDB({level:'error', db: "mongodb://localhost:27017/vidly"}),
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'combined.txt'})
	]
});
*/

function handleException(ex){
	let result = [];

	for(field in ex.errors){
		result.push( ex.errors[field].message);
	}

	return result.join(" -> ");
}
/*
process.on('SIGINT',async function(){
	try{
		await mongoose.connection.close();
		console.log("Disconnected to MongoDB");
		process.exit(0);
	}catch(err){
		console.log(err);
		process.exit(1);
	}
});*/