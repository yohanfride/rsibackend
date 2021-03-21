//Tambahkan Mekanisme menyimpan Log UPDATE INI//
const moment = require('moment');
var request = require('../functions/request.js');

exports.insert = function (APP, req, callback) {
	params = {
		endpoint: req.body.endpoint,
		request: JSON.stringify(req.body.request),
		response: JSON.stringify(req.body.response),
		status: req.body.status
	};
	console.log("-----++++------");
	console.log(params);
	console.log("------------");
	APP.models.easy.log.create(params, (err, result) => {
		console.log("------------");
		console.log(err);
		console.log("------------");
	    if (err) return callback({
					code: 'ERR_DATABASE',
					data: err
				});

	    return callback(null, {
	    	code: 'LOG_INSERT_SUCCESS',
	    	data: result
	    });
	});
};

exports.sql = function ( queryStr, users ) {
	// queryString = queryStr.queryString;
	// queryObject = queryStr.queryObject;
	// if(queryObject.type != 'SELECT'){
	// 	if(queryObject.type == 'INSERT' || queryObject.type == 'UPDATE'){
	// 		queryString = queryString.replace('Executing (default): ', '');  
	// 	    for(var i=0; i<queryObject.bind.length; i++){
	// 	    	if(Number.isInteger(queryObject.bind[i])){
	// 	    		var str = queryObject.bind[i];
	// 	    	} else {
	// 	    		var str = '"'+queryObject.bind[i]+'"';
	// 	    	}
	// 	    	queryString = queryString.replace('?',str);		
	// 	    } 
	// 	} else {
	// 		queryString = queryString.replace('Executing (default): ', '');  
	// 	}
	// 	var send = {
	// 		id : users.nip,
	// 		timestamp:moment().format("YYYYMMDDHHMMSS"),
	// 		command :queryString,
	// 		admin: users.name
	// 	};
	// 	var url = process.env.BLOKCHAIN_URL;
	// 	console.log(url);
	// 	request.blockchain(url,send,function(err,result){
	// 		if(err){
	// 			console.log("Error");
	// 			console.log(err);
	// 			console.log(result);
	// 		} else {
	// 			console.log(result);
	// 		}
	// 	});	
	// }
};

exports.create = function (APP, req, callback) {
	var send = {
		timestamp:moment().format("YYYYMMDDHHMMSS"),
		value: req.body,
		admin: req.user.name
	};
	console.log("-----++++------");
	console.log(send);
	console.log("------------");
	var url = process.env.BLOKCHAIN_URL_CREATE;
	request.blockchain(url,send,function(err,result){
		if (err) return callback({
					code: 'ERR_DATABASE',
					data: err
				});

	    return callback(null, {
	    	code: 'BLOCKCHAIN_CREATE_SUCCESS',
	    	data: result
	    });
	});	
};

exports.update = function (APP, req, callback) {
	var send = {
		id:req.id,
		timestamp:moment().format("YYYYMMDDHHMMSS"),
		value: req.body,
		admin: req.user.name
	};
	console.log("-----++++------");
	console.log(send);
	console.log("------------");
	var url = process.env.BLOKCHAIN_URL_UPDATE;
	request.blockchain(url,send,function(err,result){
		if (err) return callback({
					code: 'ERR_DATABASE',
					data: err
				});

	    return callback(null, {
	    	code: 'BLOKCHAIN_UPDATE_SUCCESS',
	    	data: result
	    });
	});	
};