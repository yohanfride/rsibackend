"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const carTankController = require('../controllers/carTankController.js');
const router = express.Router();
const moment = require('moment');
var email = require('../functions/email.js');
var output = {};
const fs = require('fs')

router.post('/add', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function storingData (index, callback) {
			carTankController.add(req.APP, req, (err, result) => {
				if (err) return callback(err);

				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function gettingData (index, callback) {
			carTankController.find(req.APP, req, (err, result) => {
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
		function updatingData (index, callback) {
			carTankController.update(req.APP, req, (err, result) => {
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
		function deletingData (index, callback) {
			carTankController.delete(req.APP, req, (err, result) => {
				if (err) return callback(err);

				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/getsql', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			req.body.query = " SELECT JSON_EXTRACT(doc, '$.fuel[0].atg.temp') as temp, JSON_EXTRACT(doc, '$.car_id') as car_id, "+
							" JSON_EXTRACT(doc, '$._id') as _id  FROM `car_tank` WHERE JSON_EXTRACT(doc, '$._id') IN " +
							" ( SELECT MAX(JSON_EXTRACT(doc, '$._id') ) as _id FROM `car_tank` GROUP BY JSON_EXTRACT(doc, '$.car_id') ) ";
			callback(null, true);
		},
		function gettingData (index, callback) {
			carTankController.findgroup(req.APP, req, (err, result) => {
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