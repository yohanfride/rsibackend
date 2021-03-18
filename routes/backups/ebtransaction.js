"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const ebTransactionController = require('../controllers/ebTransactionController.js');
const ebMoneyController = require('../controllers/ebMoneyController.js');
const router = express.Router();
const moment = require('moment');
var email = require('../functions/email.js');
var output = {};

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {
			if(req.body.str_date) req.body.str_date = req.body.str_date+"T00:00:00.000";
			if(req.body.end_date) req.body.end_date = req.body.end_date+"T23:59:59.000";
				
			callback(null, true);
		},
		function gettingData (index, callback) {
			ebTransactionController.find(req.APP, req, (err, result) => {
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
		function aliases (callback) {
			if(req.body.str_date) req.body.str_date = req.body.str_date+"T00:00:00.000";
			if(req.body.end_date) req.body.end_date = req.body.end_date+"T23:59:59.000";
				
			callback(null, true);
		},
		function gettingData (index, callback) {
			ebTransactionController.count(req.APP, req, (err, result) => {
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
			ebTransactionController.delete(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) ) return callback({
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
			ebTransactionController.update(req.APP, req, (err, result) => {
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
			if (!req.body.customer_id) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Customer'
					}
				});

			if (!req.body.account) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Account'
					}
				});	

			if (!req.body.debit) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Debit'
					}
				});	

			if (!req.body.credit) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Credit'
					}
				});								
			callback(null, true);
		},
		function aliases (index,callback) {
			if (!req.body.transaction_code){			
				req.body.transaction_code = req.body.customer_id + Math.ceil((microtime.now()/10000));				
			}			
			callback(null, true);
		},	
		function insertData (index, callback) {
			ebTransactionController.insert(req.APP, req, (err, result) => {				
				if (err) return callback(err);
				callback(null, result);
			});
		}		
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});


module.exports = router;