"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const logFillingController = require('../controllers/logFillingController.js');
const carController = require('../controllers/carController.js');
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
			logFillingController.find(req.APP, req, (err, result) => {
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
			logFillingController.count(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.log_filling_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function gettingData (index, callback) {
			logFillingController.delete(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.log_filling_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});			
			callback(null, true);
		},
		function gettingData(car_id, callback) {
			if(!req.body.status ){
				callback(null, false);
			} else if( req.body.status == 1 ){
				if ( req.body.id )
					var id = req.body.id;
				else
					var id = req.body.log_filling_id;
				logFillingController.find(req.APP, { body:{ id:id } }, (err, result) => {
					if (err) return callback(err);
					var car_id = parseFloat(result.data[0].car_id);
					callback(null, car_id);
				});
			} else {
				callback(null, false);
			}
		},
		function gettingCarTank(car_id, callback) {
			if( car_id ){
				carController.find(req.APP, { body:{ id:car_id } }, (err, result) => {
					if (err) return callback(err);
					var tank = parseFloat(result.data[0].tank);
					req.body.total_after_filling = tank;
					callback(null, true);
				});
			} else {
				callback(null, true);
			}
		},
		function aliasesParameter (index, callback) {
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
			logFillingController.update(req.APP, req, (err, result) => {
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

			if(!req.body.driver_id) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Driver Id'
					}
				});	

			if (!req.body.total_fuel) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Total Fuel'
					}
				});	

			if (!req.body.fuel_type) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Fuel Type'
					}
				});	
			
			callback(null, true);
		},
		function gettingCarTank(index, callback) {
			carController.find(req.APP, { body:{ id:req.body.car_id } }, (err, result) => {
				if (err) return callback(err);
				var tank = parseFloat(result.data[0].tank);
				req.body.total_before_filling = tank;
				callback(null, index);
			});
		},
		function insertData (index, callback) {
			logFillingController.insert(req.APP, req, (err, result) => {
				delete req.body.total_before_filling;				
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
			logFillingController.group(req.APP, req, (err, result) => {
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