"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const usersController = require('../controllers/usersController.js');
const router = express.Router();
const moment = require('moment');
var email = require('../functions/email.js');
var validation = require('../functions/validation.js');
var output = {};

function hashClientId(data) {
    var time = moment.utc(moment()).format('YYYY_HH_MM_DD')
    // var time = "2019_10_04_02"
    return md5(data+time).toLowerCase();
}

function hashClientSecret(data) {
    var time = moment.utc(moment()).format('YYYY_HH_MM_DD')
    // var time = "2019_10_04_02"
    return md5(time+data).toLowerCase();
}

router.post('/login', (req, res, next) => {
	async.waterfall([
		function checkingParameters (callback) {
			if (!req.body.username) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'username'
					}
				});

			if (!req.body.password) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'password'
					}
				});
			callback(null, true);
		},
		function queryDecision (index, callback) {
			if (validation.email(req.body.username) === true) return callback(null, {
					email: req.body.username,
					password: req.body.password,					
				});

			callback(null, {
				username: req.body.username,
				password: req.body.password,				
			});
		},
		function logginIn (query, callback) {
			req.body = query;
			usersController.login(req.APP, req, (err, result) => {
				if (err) return callback(err);

				callback(null, result);
			});
		}, 
		function update(results,callback){
			var body = {
				dataQuery : {
					id:results.data.dataValues.id
				},
				dataUpdate : {
					last_login: Math.round(new Date().getTime()/1000)
				}
			}
			usersController.update(req.APP, {body}, (err, result) => {
				if (err) return callback(err);
				callback(null, results);
			});
		}
	], (err, result) => {		
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});


module.exports = router;