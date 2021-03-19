"use strict";
const environment = require('./env.json').env;
console.log(environment);
require('env2')('.env.' + environment);

const events = require('events');

events.EventEmitter.prototype._maxListeners = 100;
events.EventEmitter.defaultMaxListeners = 100;

const fs = require('fs');
const async = require('async');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const trycatch = require('trycatch');
const path = require('path');
const ip = require('ip');

const output = require('./functions/output.js');
const basicAuth = require('./functions/basicAuth.js');
const db = require('./config/db.js');
const model = require('./config/model.js');

// const OAuthServer = require('oauth2-server');
// const Request = OAuthServer.Request;
// const Response = OAuthServer.Response;

let Auth = {};
const md5 = require('md5');
const cors = require('cors');

const app = express();

app.use(cors({origin: true, methods: ['GET', 'POST']}));
app.use(bodyParser.json({limit: process.env.JSON_LIMIT}));
app.use(bodyParser.urlencoded({extended: true}));
//app.use(bodyParser.urlencoded({extended: true,limit: process.env.JSON_LIMIT}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/ebmoney', express.static( path.join(__dirname, '/public/assets/ebmoney') ));
app.use('/driverphoto', express.static( path.join(__dirname, '/public/assets/driver') ));
app.use('/maps', express.static( path.join(__dirname, '/public/assets/maps') ));
app.use(morgan(process.env.LOG_ENV));

let APP = {};

app.use((req, res, next) => {
	async.waterfall([
		function initializeBaseAPP (callback) {			
			req.customDate = new Date();
			req.APP = {};
			req.APP.db = db;
			req.APP.output = output;
			APP = req.APP;
			callback(null, true);
		},
		function initializeModels (index, callback) {
			model(db, (err, result) => {
				if (err) return callback(err);

				req.APP.models = result;

				callback(null, true);
			});
		}	
	], (err, result) => {
		if (err) return output.print(req, res, {
				code: 'GENERAL_ERR'
			});

		return next();
	});
});

app.all('/', (req, res, next) => {
	return output.print(req, res, {
		code: 'SERVICE_NOT_FOUND'
	});
});

fs.readdir('./routes', (err, files) => {
	var len = files.length;
	var lenX = len - 1;
	var n = 0;

  files.map(route => {
  	if (route.match('.js')) {
  		app.use('/' + route.replace('.js', ''),require('./routes/' + route));
  		if (n === lenX) {
  				app.use((req, res, next) => {
					return output.print(req, res, {
						code: 'SERVICE_NOT_FOUND'
					});
				});
				app.listen(process.env.PORT, () => {							
					return console.log(process.env.SERVICE_NAME + ' start on port ' + process.env.PORT);
				});
				// app.use(function(err, req, res, next) {	
				// 	console.log(err.message);
				// 	return req.APP.output.print(req, res, {
				// 		code : "GENERAL_SYSTEM_ERR",
				// 		data : req.body,
				// 		info : err.message
				// 	}); 
				// });
  		}
  	}
  	n++;
  });
});

app.use(basicAuth);
