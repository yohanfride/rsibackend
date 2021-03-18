"use strict";

/* -------------------------------------------------------------------------------------------------------------------- */
/* ----------------------------------------------------- MYSQL -------------------------------------------------------- */
/* -------------------------------------------------------------------------------------------------------------------- */
const Sequelize = require('sequelize');
const mysqlPool = {
	min: Number(process.env.MYSQL_POOL_MIN),
	max: Number(process.env.MYSQL_POOL_MAX),
	idle: Number(process.env.MYSQL_POOL_IDLE),
	acquire: Number(process.env.MYSQL_POOL_ACQUIRE),
	evict: Number(process.env.MYSQL_POOL_EVICT),
	handleDisconnects: true
};
const define = {
	//useUTC: false,
	timestamps: false,
	paranoid: true,
	freezeTableName: true
};
const mysqlDialectOptions = {
	requestTimeout: Number(process.env.MYSQL_DIALECT_REQUEST_TIMEOUT)
};
const mysqlDialect = process.env.MYSQL_DIALECT;

var allHost = process.env.MYSQL_HOST.split(",");
var allDb = process.env.MYSQL_DBID.split(",");
var allPort = process.env.MYSQL_PORT.split(",");
var allName = process.env.MYSQL_NAME.split(",");
var allUser = process.env.MYSQL_USER.split(",");
var allPass = process.env.MYSQL_PASS.split(",");

const op = Sequelize.Op;
const operatorsAliases = {
    $between: op.between, //create an alias for Op.between
}

var sequelize = [];
var i=0;
allHost.forEach(function(value){
	var options = (process.env.NODE_ENV === 'production') ? {
		host: value,
		port: allPort[i],
		dialect: mysqlDialect,
		pool: mysqlPool,
		timezone: '+07:00',
		//dialectOptions: mysqlDialectOptions,
		define: define
		// logging: function (str) {
		// 	console.log("------------");
		// 	console.log(str);
		// }
	} : {
		host: value,
		port: allPort[i],
		dialect: mysqlDialect,
		pool: mysqlPool,
		timezone: '+07:00',
		//dialectOptions: mysqlDialectOptions,
		define: define
		// logging:false
		// logging: function (str) {
		// 	console.log("------*------");
		// 	console.log(str);
		// }
		//,timezone:"Asia/Jakarta"
	};
	sequelize[allDb[i]] = new Sequelize(allName[i], allUser[i], allPass[i], options);  	
	// sequelize[allDb[i]].authenticate().then(function(err) {
 //    	console.log('Connection has been established successfully.');
 //  	})
 //  	.catch(function (err) {
 //    	console.log('Unable to connect to the database:', err);
 //  	});
	i++;
});

function customLogger ( queryString, queryObject) {
	if(queryObject.type != 'SELECT'){
		console.log( "------SQL SCRIPT------" );
		queryString = queryString.replace('Executing (default): ', '');
	    // console.log( queryString );      // outputs a string S
	    // console.log( queryObject.bind ); // outputs an array   
	    for(var i=0; i<queryObject.bind.length; i++){
	    	if(Number.isInteger(queryObject.bind[i])){
	    		var str = queryObject.bind[i];
	    	} else {
	    		var str = '"'+queryObject.bind[i]+'"';
	    	}
	    	queryString = queryString.replace('?',str);		
	    } 
	    console.log( queryString );      // outputs a string S
		console.log( "--------------" );	
	}
	
}


exports.sequelize = sequelize;
exports.Sequelize = Sequelize;
exports.allDb = allDb;