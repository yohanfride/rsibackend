"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const dokterController = require('../controllers/dokterController.js');
const usersController = require('../controllers/usersController.js');
const router = express.Router();
const moment = require('moment');
var email = require('../functions/email.js');
var output = {};
const fs = require('fs')

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function gettingData (index, callback) {
			dokterController.find(req.APP, req, (err, result) => {
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
			dokterController.count(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.id_dokter) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function deleteData (index, callback) {
			dokterController.delete(req.APP, req, (err, result) => {
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
			callback(null, true);
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.id) && (!req.body.id_dokter) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function aliasesParameter (index, callback) {
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;
			callback(null, true);
		},
		function updateData (index, callback) {
			dokterController.update(req.APP, req, (err, result) => {

				if(err){
					if( (req.body.nipd) || (req.body.username) ){
						callback(null, result, err);
					} else {
						return callback(err);	
					}
				} else {
					callback(null, result,null);
				}
			});
		},
		function updateDataUser(results, errs, callback) {
			if( (req.body.nipd) || (req.body.username) ){
				req.body.id_dokter = req.body.id;
				req.body.dataQuery = req.body;
				req.body.dataUpdate = req.body;
				usersController.update(req.APP, req, (err, result) => {					
					if(errs && err ){
						return callback(errs);
					}
					if(errs && result){
						errs.code = 'DOKTER_UPDATE_SUCCESS';
						callback(null,errs);
					} else {
						callback(null,results)
					}
				});
			} else {
				callback(null, results);
			}
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);
		return req.APP.output.print(req, res, result);
	});
});


router.post('/insert', (req, res, next) => {
	async.waterfall([		
		function checkingParameters ( callback) {
			if (!req.body.nama_dokter) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Nama Dokter'
					}
				});

			if (!req.body.no_telp) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'No. Telp'
					}
				});		

			if (!req.body.spesialis) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Spesialis'
					}
				});	

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

			if (!req.body.nipd) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'NIPD'
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
			dokterController.insert(req.APP, req, (err, result) => {				
				if (err) return callback(err);
				callback(null, result);
			});
		},		
		function insertDataUser (results, callback) {
			var body = {
				username:req.body.username,
				password:req.body.password,
			    name:req.body.nama_dokter,
			    nip:req.body.nipd,
			    role:"dokter",
			    id_dokter:results.data.id_dokter,
			    add_by:req.body.add_by
			};
			usersController.insert(req.APP, {user:req.user,body:body}, (err, result) => {		
				if (err) return callback(err);
				results.data.users = result.data;
				callback(null, results);
			});
		}		
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

module.exports = router;