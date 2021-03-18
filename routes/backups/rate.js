"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const rateController = require('../controllers/rateController.js');
const carController = require('../controllers/carController.js');
const TransactionController = require('../controllers/TransactionController.js');
const router = express.Router();
const moment = require('moment');
var email = require('../functions/email.js');
var output = {};

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {	
			if(req.body.str_date) req.body.str_date = req.body.str_date+"T00:00:00.000Z";
			if(req.body.end_date) req.body.end_date = req.body.end_date+"T23:59:59.000Z";	
			if(req.body.str_date_finish) req.body.str_date_finish = req.body.str_date_finish+"T00:00:00.000Z";
			if(req.body.end_date_finish) req.body.end_date_finish = req.body.end_date_finish+"T23:59:59.000Z";	
			callback(null, true);
		},
		function gettingData (index, callback) {
			rateController.find(req.APP, req, (err, result) => {
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
			if(req.body.str_date) req.body.str_date = req.body.str_date+"T00:00:00.000Z";
			if(req.body.end_date) req.body.end_date = req.body.end_date+"T23:59:59.000Z";	
			if(req.body.str_date_finish) req.body.str_date_finish = req.body.str_date_finish+"T00:00:00.000Z";
			if(req.body.end_date_finish) req.body.end_date_finish = req.body.end_date_finish+"T23:59:59.000Z";	
			callback(null, true);
		},
		function gettingData (index, callback) {
			rateController.count(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.transaction_code) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function gettingData (index, callback) {
			rateController.delete(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.rate_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});			
			callback(null, true);
		},
		function gettingDataTrans (index, callback) {
			if(req.body.transaction_code){
				TransactionController.find(req.APP, { body:{ transaction_code: transaction_code } }, (err, result) => {
					if (err) return callback(err);
					var data = result.data[0];
					if( (data.status != 1) ){
						 return callback({
							code: 'ERR_RATE_TRANSACTION_NOT_FOUND',
							data: req.body
						});
					}
					callback(null,data);
				});
			} else {
				callback(null, false);
			}
		},
		function aliasesParameter (data, callback) {
			if(data){
				req.body.driver_id = data.driver_id;
				req.body.customer_id = data.customer_id;
			}
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;
			if( req.body.dataUpdate.status == 1 ){
				if(!req.body.dataUpdate.date_finish){
					req.body.dataUpdate.date_finish = moment().toISOString(true).split("+")[0]+"Z";
				}
			}
			callback(null, true);
		},
		function updateData (index, callback) {
			rateController.update(req.APP, req, (err, result) => {
				if(req.body.transaction_code){
					delete req.body.driver_id;				
					delete req.body.customer_id;
				}
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
			
			if(!req.body.rate) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Rate'
					}
				});	

			if(!req.body.transaction_code) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Transaction Code'
					}
				});	
			
			callback(null, true);
		},
		function gettingDataTrans (index, callback) {
			TransactionController.find(req.APP, { body:{ transaction_code: req.body.transaction_code } }, (err, result) => {
				if (err) return callback(err);
				var data = result.data[0];
				if( !(data) ){
					 return callback({
						code: 'ERR_RATE_TRANSACTION_NOT_FOUND',
						data: req.body
					});
				}
				if( (data.status != 5) ){
					 return callback({
						code: 'ERR_RATE_TRANSACTION_NOT_FOUND',
						data: req.body
					});
				}
				callback(null,data);
			});
		},
		function updateDataTrans (data, callback) {
			var trans = {
				id:data.transaction_id,
				status:1	
			};
			trans.dataQuery = trans;
			trans.dataUpdate = trans;
			TransactionController.update(req.APP, {body:trans}, (err, result) => {});
			callback(null,data);
		},
		function insertData (data, callback) {
			req.body.driver_id = data.driver_id;
			req.body.customer_id = data.customer_id;
			rateController.insert(req.APP, req, (err, result) => {
				delete req.body.driver_id;				
				delete req.body.customer_id;				
				if (err) return callback(err);
				callback(null, result);
			});
		}		
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/getgroup', (req, res, next) => {
	async.waterfall([
		function checkingParameters ( callback) {
			if (!req.body.groupby) return callback({
				code: 'MISSING_KEY',
				data: req.body,
				info: {
					missingParameter: 'Group By'
				}
			});							
			callback(null, true);
		},
		function aliases (index,callback) {			
			if(req.body.str_date) req.body.str_date = req.body.str_date+"T00:00:00.000";
			if(req.body.end_date) req.body.end_date = req.body.end_date+"T23:59:59.000";
			if(req.body.str_date_finish) req.body.str_date_finish = req.body.str_date_finish+"T00:00:00.000";
			if(req.body.end_date_finish) req.body.end_date_finish = req.body.end_date_finish+"T23:59:59.000";
			callback(null, true);
		},
		function gettingData (index, callback) {
			rateController.group(req.APP, req, (err, result) => {
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