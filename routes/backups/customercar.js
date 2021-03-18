"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const customerCarController = require('../controllers/customerCarController.js');
const router = express.Router();
const moment = require('moment');
var output = {};

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {	
			if(req.body.str_date) req.body.str_date = req.body.str_date+"T00:00:00.000Z";
			if(req.body.end_date) req.body.end_date = req.body.end_date+"T23:59:59.000Z";	
			callback(null, true);
		},
		function gettingData (index, callback) {
			customerCarController.find(req.APP, req, (err, result) => {
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
			callback(null, true);
		},
		function gettingData (index, callback) {
			customerCarController.count(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.customer_car_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function gettingData (index, callback) {
			customerCarController.delete(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.customer_car_id) ) return callback({
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
			customerCarController.update(req.APP, req, (err, result) => {
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
						missingParameter: 'Customer Id'
					}
				});

			if(!req.body.vehicle_number) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Vehicle Number'
					}
				});						
			callback(null, true);
		},
		function insertData (index, callback) {
			customerCarController.insert(req.APP, req, (err, result) => {				
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