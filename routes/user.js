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

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function gettingData (index, callback) {
			usersController.find(req.APP, req, (err, result) => {
				if (err) return callback(err);

				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/total', (req, res, next) => {
	async.waterfall([
		function gettingData (callback) {
			usersController.count(req.APP, req, (err, result) => {
				if (err) return callback(err);

				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/delete', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function gettingData (index, callback) {
			usersController.delete(req.APP, req, (err, result) => {
				console.log("--------ERRE-----------");
				console.log(err);
				if (err) return callback(err);
				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/update', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			req.body.lastupdate = Math.round(new Date().getTime()/1000);
			callback(null, true);
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.id)  ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function dataUpdate (index, callback) {
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;

			callback(null, true);
		},
		function gettingData (index, callback) {
			usersController.update(req.APP, req, (err, result) => {
				if (err) return callback(err);
				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/insert', (req, res, next) => {
	async.waterfall([		
		function checkingParameters ( callback) {
			if (!req.body.username) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Username'
					}
				});
			
			if (!req.body.password) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Password'
					}
				});

			if (!req.body.name) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Name'
					}
				});

			if (!req.body.role) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Role'
					}
				});
			callback(null, true);
		},
		function checkingUsername(index,callback) {
			usersController.find(req.APP, {body:{username:req.body.username}}, (err, result) => {
				if (err) return callback(err);
				if (result.code == 'FOUND') return callback({
					code: 'ERR_USERS_DUPLICATE',
					data: req.body,
					info: {
						missingParameter: 'username'
					}
				});							
				callback(null, true);
			});
		},
		function aliases (index,callback) {
			if (!req.body.username){
				var mail =  req.body.email;								
				req.body.username = mail.replace("_","").replace(".","").substring(0, 6).toUpperCase() + 
									Math.random().toString(36).substring(2, 7).toUpperCase();
			}		
			if(!req.body.password){
				req.body.password = Math.random().toString(36).substring(2, 10);	
			}
			if(!req.body.add_by){
				if(req.user){
					req.body.add_by = req.user.id
				}
			}
			req.body.passwordNoEncpty = req.body.password;
			callback(null, true);
		},		
		function insertData (index, callback) {
			usersController.insert(req.APP, req, (err, result) => {				
				if (err) return callback(err);
				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);
		return req.APP.output.print(req, res, result);
	});
});

router.post('/status', (req, res, next) => {
	async.waterfall([
		function checkingParameters (callback) {
			if ( (!req.body.id)  ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			if (!req.body.status) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'status'
					}
				});

			if (!req.body.status == 'active' && !req.body.status == 'not-active') return callback({
					code: 'NOT_VALID_KEY',
					data: req.body,
					info: {
						missingParameter: 'status'
					}
				});			
			callback(null, true);
		},
		function dataUpdate (index, callback) {			
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;
			if(req.body.status == 'active'){
				req.body.dataUpdate.status = 1;				
			} else{				
				req.body.dataUpdate.status = 0;
			}
			callback(null, true);
		},
		function gettingData (index, callback) {			
			usersController.update(req.APP, req, (err, result) => {
				if (err) return callback(err);				
				if(result.data.status == 1){
					result.data.status = 'active';	
				} else {
					result.data.status = 'not-active';
				}
				if(result.code == "USERS_UPDATE_SUCCESS"){
					if(result.data.status == 'active'){	
						result.code = "USERS_ACTIVE_SUCCESS";
					} else {	
						result.code = "USERS_NOT_ACTIVE_SUCCESS";
					}
				}
				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/updatepass', (req, res, next) => {
	async.waterfall([
		function checkingParameters (callback) {
			if ((!req.body.id)) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			if (!req.body.oldpassword) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'old password'
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
		function checkingPassword (index, callback) {
			usersController.checkPass(req.APP, {
				body:{
					id:req.body.id,
					password:req.body.oldpassword
				}
			}, (err, result) => {
				if (err) return callback(err);
				callback(null, result);
			});
		},
		function updatingData (output, callback) {
			usersController.update(req.APP, {
				body: {
					dataQuery: {
						id: req.body.id,
					},
					dataUpdate: {
						password: req.body.password
					},
					password: req.body.password
				}
			}, (err, result) => {
				if (err) return callback(err);
				result.data = req.body;
				callback(null, result);
			});	
		}
	], (err, result) => {		
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

module.exports = router;