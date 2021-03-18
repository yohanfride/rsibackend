"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const carDriverController = require('../controllers/carDriverController.js');
const carController = require('../controllers/carController.js');
const router = express.Router();
const moment = require('moment');
var email = require('../functions/email.js');
var mqttcom = require('../functions/mqttcom.js');
var output = {};

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {	
			if(req.body.str_date) req.body.str_date = req.body.str_date+"T00:00:00.000Z";
			if(req.body.end_date) req.body.end_date = req.body.end_date+"T23:59:59.000Z";	
			callback(null, true);
		},
		function gettingData (index, callback) {
			carDriverController.find(req.APP, req, (err, result) => {
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
			carDriverController.count(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.car_driver_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function gettingData (index, callback) {
			carDriverController.delete(req.APP, req, (err, result) => {
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
	var device_id = '';
	var last_status = '';
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.id) && (!req.body.car_driver_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});			
			callback(null, true);
		},
		function gettingData(car_id, callback) {
			// if(!req.body.status ){
			if (!('status' in req.body)){
				callback(null, false, false);
			} else if( req.body.status == 0 ){
				if ( req.body.id )
					var id = req.body.id;
				else
					var id = req.body.car_driver_id;
				carDriverController.find(req.APP, { body:{ id:id } }, (err, result) => {
					if (err) return callback(err);
					var car_id = parseFloat(result.data[0].car_id);
					var car_km_start = result.data[0].car_km_start;
					last_status = result.data[0].status;
					callback(null, car_id, car_km_start);
				});
			} else {
				callback(null, false, false);
			}
		},
		function gettingCarTankKm(car_id,car_km_start, callback) {
			if( car_id ){
				carController.find(req.APP, { body:{ id:car_id } }, (err, result) => {
					if (err) return callback(err);
					var total_km = result.data[0].total_km;
					console.log(total_km);
					console.log(parseFloat(total_km));
					var tank = result.data[0].tank;
					req.body.car_tank_end = tank;
					req.body.car_km_end = total_km;
					req.body.car_total_km = parseFloat(total_km - car_km_start);
					device_id = result.data[0].device_id;
					callback(null, true);
				});
			} else {
				callback(null, true);
			}
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
			carDriverController.update(req.APP, req, (err, result) => {
				if (err) return callback(err);
				if(req.body.status == 0 && last_status == 1){
					var topic = "mangerial/position/unsubscribe";
					var data = {
						device_code : device_id
					}
					mqttcom.send({topic:topic,data:data},function(err,result){		    				        
				        if(err){
				        	console.log(err);
				        }			        
				        console.log(result);
				    });
				}
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
			if (!req.body.driver_id) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Driver Id'
					}
				});

			if(!req.body.car_id) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Capacity'
					}
				});						
			callback(null, true);
		},
		function gettingCarTankKm(index, callback) {
			carController.find(req.APP, { body:{ id:req.body.car_id } }, (err, result) => {
				if (err) return callback(err);
				var total_km = result.data[0].total_km;
				var tank = result.data[0].tank;
				req.body.car_km_start = total_km;
				req.body.car_tank_start = tank;
				callback(null, result.data[0]);
			});
		},
		function insertData (car, callback) {
			carDriverController.insert(req.APP, req, (err, result) => {				
				if (err) return callback(err);
				if(req.body.status){
					var topic = "mangerial/position/subscribe";
					var data = {
						device_code : car.device_id,
						sector_id : req.body.sector
					}
					mqttcom.send({topic:topic,data:data},function(err,result){		    				        
				        if(err){
				        	console.log(err);
				        }			        
				        console.log(result);
				    });
				}
				callback(null, result);
			});
		}		
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/cekmqtt', (req, res, next) => {
	async.waterfall([		
		function checkingParameters ( callback) {
			var data = {
				device_code:"28c8gr-ie40",
    			sector_id:"2020159816206787"
			};
			var topic = "mangerial/position/unsubscribe";
			mqttcom.send({topic:topic,data:data},function(err,result){		    				        
		        if(err){
		        	callback(err);
		        }			        
		        callback(null,result);
		    });
		},
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/near', (req, res, next) => {
	async.waterfall([
		function checkingParameters ( callback) {
			if (!req.body.location_lat) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'location_lat'
					}
				});

			if(!req.body.location_lng) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'location_lng'
					}
				});						
			callback(null, true);
		},
		function getCarDriver (index, callback) {
			var now = moment().format("YYYY-MM-DD");
			var query = {
				body:{
					status:1,
					nearest:1,
					pointLat:req.body.location_lat,
					pointLng:req.body.location_lng
				}
			}
			carDriverController.find(req.APP, query, (err, result) => {				
				if (err) return callback(err);
				callback(null, result);
			});
		},
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});



module.exports = router;

