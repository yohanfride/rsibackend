"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const pasienController = require('../controllers/pasienController.js');
const router = express.Router();
const moment = require('moment');
var email = require('../functions/email.js');
var log = require('../functions/log.js');
var output = {};
const fs = require('fs')
var prefix_rekam = "PS.";

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function gettingData (index, callback) {
			pasienController.find(req.APP, req, (err, result) => {
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
			pasienController.count(req.APP, req, (err, result) => {
				if (err) return callback(err);

				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/norekammedik', (req, res, next) => {
	async.waterfall([
		function gettingData (callback) {
			var code = prefix_rekam + moment().format('YYYYMM');
			pasienController.last_number(req.APP, { body:{ code:code } }, (err, result) => {
				if (err) return callback(err);
				var rekam = {
					code:"PASIEN_NUMBER_GENERATED_SUCCESS",
					data:{
						no_rekam_medik:result.code
					}
				}
				callback(null, rekam);
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
			if ( (!req.body.id) && (!req.body.id_pasien) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function deleteData (index, callback) {
			pasienController.delete(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.id_pasien) ) return callback({
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
			pasienController.update(req.APP, req, (err, result) => {
				if (err) return callback(err);
				callback(null, result);
			});
		},
		function gettingData (results, callback) {
			if (req.body.id) 
				var id = req.body.id;
			if (req.body.id_pasien) 
				var id = req.body.id_pasien;
			pasienController.find(req.APP, {user:req.user,body:{id_pasien:id}}, (err, result) => {
				if (err) return callback(err);
				callback(null, results,result.data[0]);
			});
		},
		function updateBC(results,pasien,callback){
			var params = {
				id:pasien.idhash,
				user:req.user,
				body:pasien.dataValues
			};
			log.update(req.APP, params, (err, result) => {	
				console.log(err);
				console.log(result);
			});
			callback(null, results);
		}	
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});


router.post('/insert', (req, res, next) => {
	async.waterfall([		
		function checkingParameters ( callback) {
			if (!req.body.nama) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Nama Dokter'
					}
				});
			
			if (!req.body.ktp) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'KTP'
					}
				});
			
			if (!req.body.tgl_lahir) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Tanggal Lahir'
					}
				});
			
			if (!req.body.tempat_lahir) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Tempat Lahir'
					}
				});

			
			if (!req.body.jenis_kelamin) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Jenis Kelamin'
					}
				});

			if (!req.body.alamat) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Alamat'
					}
				});


			if (!req.body.kota) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Kota'
					}
				});

			if (!req.body.no_telp) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'No. Telp'
					}
				});		
					
			callback(null, true);
		},	
		function checkingKTP(index,callback) {
			pasienController.find(req.APP, {user:req.user,body:{ktp:req.body.ktp}}, (err, result) => {
				if (err) return callback(err);
				if (result.code == 'FOUND') return callback({
					code: 'ERR_PASIEN_DUPLICATE',
					data: req.body,
					info: {
						missingParameter: 'ktp'
					}
				});							
				callback(null, true);
			});
		},
		function checkingNoRekamMedik(index,callback) {
			if(req.body.no_rekam_medik){
				pasienController.find(req.APP, {user:req.user,body:{no_rekam_medik:req.body.no_rekam_medik}}, (err, result) => {
					if (err) return callback(err);
					if (result.code == 'FOUND') return callback({
						code: 'ERR_PASIEN_DUPLICATE',
						data: req.body,
						info: {
							missingParameter: 'ktp'
						}
					});							
					callback(null, true);
				});
			} else {
				var code = prefix_rekam + moment().format('YYYYMM');
				pasienController.last_number(req.APP, { user:req.user,body:{ code:code } }, (err, result) => {
					if (err) return callback(err);
					req.body.no_rekam_medik = result.code;
					callback(null, true);
				});
			}
		},
		function insertData (index, callback) {
			pasienController.insert(req.APP, req, (err, result) => {				
				if (err) return callback(err);
				console.log(err);
				callback(null, result);
			});
		},
		function createBC(pasien,callback){
			var params = {
				user:req.user,
				body:pasien.data
			};
			log.create(req.APP, params, (err, result) => {	
				console.log(err);
				console.log(result);
				if (err) return callback(err);
				params.body = {
					id:pasien.data.id_pasien,
					idhash:result.data.id
				}
				params.body.dataQuery = params.body;
				params.body.dataUpdate = params.body;
				pasienController.update(req.APP, params, (err, result) => {
					if (err) return callback(err);
					callback(null, pasien);
				});
			});
		}		
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

module.exports = router;