"use strict";

const async = require('async');
const trycatch = require('trycatch');
const messages = require('../config/messages.json');
const log = require('../functions/log.js');

exports.print = function (req, res, params) {
	let output = {};
	console.log("-----------------");
	console.log(params);
	async.waterfall([
		function generateMessage (callback) {
			let message = {
				company: {}
			};
			if (messages[params.code]) message = messages[params.code];
			output.code = message.code || params.code;
			output.message = params.message || message.message;
			output.data = params.data || message.data;
			output.debug = undefined;
			output.info = params.info || message.info;			
			
			callback(null, message);
		}
		// ,
		// function logging (message, callback) {						
		// 	log.insert(req.APP, {
		// 		body: {
		// 			request: req.body,
		// 			response: output,
		// 			status: message.status || 200,
		// 			endpoint: req.originalUrl
		// 		}
		// 	}, (err, result) => {
		// 		callback(null, message);
		// 	});
		// }
	], (err, message) => {		
		trycatch(() => {						
			return res.status(message.status || 200).json(output);
		}, () => {
			return res.status(message.status || 200).json(output);
		});
	});
};