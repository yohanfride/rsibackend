"use strict";

const unirest = require('unirest');
const nodemailer = require('nodemailer');

exports.emoney = function (url, params, key_ewl, callback) {		
	console.log("============= EMONEY REQUEST ==============");
	console.log(url);
	console.log(params);
	console.log("===========================================");
	unirest.post(url)
		.headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'cache-control': 'no-cache',
			'Authorization':key_ewl})
		.send(params)
		.end(function (response) {		  
		  	if (response.error) return callback(response);
		 	callback(null, response.body);
		});
};

exports.getToken = function (callback) {		
	var url = process.env.DEFINE_URL_TOKEN;
	var auth = 'Basic ' + new Buffer(process.env.DEFINE_CLIENT_ID + ':' + process.env.DEFINE_CLIENT_SECRET).toString('base64');
	var params = {
		client_id:process.env.DEFINE_CLIENT_ID,
		client_secret:process.env.DEFINE_CLIENT_SECRET,
		grant_type:'client_credentials',
		auth:auth
	}
	
	console.log("============= Token REQUEST ==============");
	console.log(url);
	console.log(params);
	console.log("===========================================");
	unirest.post(url)
		.headers({ 'Content-Type': 'application/x-www-form-urlencoded', 'cache-control': 'no-cache', 'Authorization':auth})
		.send("client_id="+process.env.DEFINE_CLIENT_ID)
		.send("client_secret="+process.env.DEFINE_CLIENT_SECRET)
		.send("grant_type=client_credentials")							
		.end(function (response) {									
		  	if (response.error) return callback(response);
		 	callback(null, response.body);
		});
};

exports.post = function (url, params,key, callback) {	
	url=url+"?access_token="+key;
	var auth = 'Basic ' + new Buffer(process.env.DEFINE_CLIENT_ID + ':' + process.env.DEFINE_CLIENT_SECRET).toString('base64');
	console.log("=============== KEAGENAN REQUEST ============");
	console.log(url);
	console.log(auth);
	console.log(params);
	console.log("=============================================");
	unirest.post(url)
		.headers({'Accept': 'application/json', 'Content-Type': 'application/json', 'cache-control': 'no-cache','Authorization':auth})		
		.send(params)
		.end(function (response) {			
			if (response.error) {
			  	if (response.code == 500) return callback(null, response.body);
					callback({
					  	code : response.code,
						  message : response.message
					});

		  	} else {
		  		callback(null,response.body);
		  	}
		});
};

exports.post_cdn = function (url, file, name, key, callback) {	
	url=url+"?access_token="+key;
	var auth = new Buffer(process.env.DEFINE_DEALER_USER + ':' + process.env.DEFINE_DEALER_PASS).toString('base64');	
	//var auth = 'Bearer 49a554b3888e89adf228fa2aa754b97a';
	console.log("=============== KEAGENAN REQUEST ============");
	console.log(url);
	console.log(auth);
	console.log("=============================================");
	unirest.post(url)
		.headers({'Content-Type': 'multipart/form-data', 'cache-control': 'no-cache','X-Auth':auth})		
		.field("name", name)
		.attach("photo", file)
		.end(function (response) {			
			if (response.error) {
			  	if (response.code == 500) return callback(null, response.body);
					callback({
					  	code : response.code,
						  message : response.message
					});

		  	} else {
		  		callback(null,response.body);
		  	}
		});
};

exports.soa = function (url, key, callback){
	unirest.post(url)
		.headers({'Accept': 'application/xml','Content-Type': 'application/xml','SOAPAction': 'inquiry'})
		.send(key)
		.end(function (response) {
		  if (response.error) {
		  	if (response.code == 500) return callback(null, response.body);

			  callback({
			  	code : response.code,
				  message : response.message
			  });

		  } else {
		  	callback(null,response.body);
		  }
		});
};

exports.sendEmail = function (params, callback) {
	const mailOptions = {
    from: process.env.EMAIL_SENDER,
    to: params.to,
    subject: params.subject,
    text: params.text,
    html: params.html
  };

	nodemailer.createTransport({
	  host: String(process.env.EMAIL_HOST),
	  port: String(process.env.EMAIL_PORT),
	  secure: false,
	  auth: {
	    user: String(process.env.EMAIL_USER),
	    pass: String(process.env.EMAIL_PASSWORD)
	}, tls: {
   	rejectUnauthorized: true
	}}).sendMail(mailOptions, (error, info) => {
    if (error) return callback({
      	code: 'GENERAL_ERR',
      	message: 'Failed to sent email.',
      	data: error
      });

  	callback(null, {
      code: 'OK',
      message: 'Email sent.',
      data: info
    });
  });
};

exports.blockchain = function (url, params,callback) {	
	console.log("=============== BLOCKCHAIN REQUEST ============");
	console.log(url);
	console.log(params);
	console.log("=============================================");
	unirest.post(url)
		.headers({'Content-Type': 'application/json', 'cache-control': 'no-cache'})	//'Accept': 'application/json', 	
		.send(params)
		.end(function (response) {			
			if (response.error) {
		  		callback(response);
		  	} else {
		  		callback(null,response);
		  	}
		});
};

