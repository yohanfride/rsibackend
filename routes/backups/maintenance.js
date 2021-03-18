"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const maintenanceController = require('../controllers/maintenanceController.js');
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
			if(req.body.str_date_start) req.body.str_date_start = req.body.str_date_start+"T00:00:00.000Z";
			if(req.body.end_date_start) req.body.end_date_start = req.body.end_date_start+"T23:59:59.000Z";	
			callback(null, true);
		},
		function gettingData (index, callback) {
			maintenanceController.find(req.APP, req, (err, result) => {
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
			if(req.body.str_date_start) req.body.str_date_start = req.body.str_date_start+"T00:00:00.000Z";
			if(req.body.end_date_start) req.body.end_date_start = req.body.end_date_start+"T23:59:59.000Z";	
			callback(null, true);
		},
		function gettingData (index, callback) {
			maintenanceController.count(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.maintenance_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function gettingData (index, callback) {
			maintenanceController.delete(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.maintenance_id) ) return callback({
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
			if( req.body.dataUpdate.status == 0 ){
				if(!req.body.dataUpdate.date_finish){
					req.body.dataUpdate.date_finish = moment().toISOString(true).split("+")[0]+"Z";
				}
			}
			callback(null, true);
		},
		function updateData (index, callback) {
			maintenanceController.update(req.APP, req, (err, result) => {
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
			
			if(!req.body.car_id) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Car Id'
					}
				});						
			callback(null, true);
		},
		function insertData (index, callback) {
			maintenanceController.insert(req.APP, req, (err, result) => {				
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