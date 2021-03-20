"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const rekamMedikController = require('../controllers/rekamMedikController.js');
const dokterController = require('../controllers/dokterController.js');
const pasienController = require('../controllers/pasienController.js');
const router = express.Router();
const moment = require('moment');
var email = require('../functions/email.js');
var output = {};
const fs = require('fs')

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {	
			if(req.body.str_date) req.body.str_date = req.body.str_date+"T00:00:00.000Z";
			if(req.body.end_date) req.body.end_date = req.body.end_date+"T23:59:59.000Z";	
			if(req.body.str_pemeriksaan) req.body.str_pemeriksaan = req.body.str_pemeriksaan+" 00:00:00";
			if(req.body.end_pemeriksaan) req.body.end_pemeriksaan = req.body.end_pemeriksaan+" 23:59:59";	
			callback(null, true);
		},
		function gettingData (index, callback) {
			rekamMedikController.find(req.APP, req, (err, result) => {
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
			if(req.body.str_pemeriksaan) req.body.str_pemeriksaan = req.body.str_pemeriksaan+" 00:00:00";
			if(req.body.end_pemeriksaan) req.body.end_pemeriksaan = req.body.end_pemeriksaan+" 23:59:59";	
			callback(null, true);
		},
		function gettingData (index, callback) {
			rekamMedikController.count(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.id_rekam_medik) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function deleteData (index, callback) {
			rekamMedikController.delete(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.id_rekam_medik) ) return callback({
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
			rekamMedikController.update(req.APP, req, (err, result) => {
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
			if (!req.body.id_dokter) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'ID Dokter'
					}
				});

			if (!req.body.no_rekam_medik) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'No. Rekam Medik'
					}
				});		

			if (!req.body.tanggal_pemeriksaan) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Tanggal Pemeriksaan'
					}
				});		

			if (!req.body.add_by) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'add by'
					}
				});	
			callback(null, true);
		},	
		function checkingUsername(index,callback) {
			dokterController.find(req.APP, {user:req.user,body:{id_dokter:req.body.id_dokter}}, (err, result) => {
				if (err) return callback(err);
				if (result.code != 'FOUND') return callback({
					code: 'ERR_REKAM_MEDIK_PARAMS_NOT_VALID',
					data: req.body,
					info: {
						notValidParameter: 'ID Dokter'
					}
				});							
				callback(null, true);
			});
		},	
		function checkingUsername(index,callback) {
			pasienController.find(req.APP, {user:req.user,body:{no_rekam_medik:req.body.no_rekam_medik}}, (err, result) => {
				if (err) return callback(err);
				if (result.code != 'FOUND') return callback({
					code: 'ERR_REKAM_MEDIK_PARAMS_NOT_VALID',
					data: req.body,
					info: {
						notValidParameter: 'No. Rekam Medik'
					}
				});							
				callback(null, true);
			});
		},
		function aliases (index,callback) {
			if(!req.body.add_by){
				if(req.user){
					req.body.add_by = req.user.id
				}
			}
			callback(null, true);
		},
		function insertData (index, callback) {
			rekamMedikController.insert(req.APP, req, (err, result) => {				
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