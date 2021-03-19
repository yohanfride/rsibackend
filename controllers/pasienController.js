"use strict";

const async = require('async');
const md5 = require('md5');
const moment = require('moment');
const microtime = require('microtime');
var email = require('../functions/email.js');
var encryption = require('../functions/encryption.js');
var output = {};
const { Op } = require('sequelize');
//////PENTING HAPUS FOLDER QUERY////

var log = require('../functions/log.js');
var queryStr = {};
function customLogger( queryString, queryObject ){
	queryStr = {
		queryString:queryString,
		queryObject:queryObject
	}
}

exports.find = function (APP, req, callback) {
	var query = {}

	query.where = {};
	if(req.body.take)
		query.limit = parseInt(req.body.take);
	query.offset = parseInt(req.body.skip ? req.body.skip : 0);
	query.order = [];
	if(req.body.order_by)
		query.order = [req.body.order_by];

	if (req.body.id) query.where.id_pasien = req.body.id;
	if (req.body.id_pasien) query.where.id_pasien = req.body.id_pasien;

	if (req.body.nama) query.where.nama = req.body.nama;
	if (req.body.no_rekam_medik) query.where.no_rekam_medik = req.body.no_rekam_medik;
	if (req.body.ktp) query.where.ktp = req.body.ktp;
	if (req.body.tgl_lahir) query.where.tgl_lahir = req.body.tgl_lahir;
	if (req.body.tempat_lahir) query.where.tempat_lahir = req.body.tempat_lahir;
	if (req.body.jenis_kelamin) query.where.jenis_kelamin = req.body.jenis_kelamin;

	if (req.body.alamat) query.where.alamat = req.body.alamat;
	if (req.body.kota) query.where.kota = req.body.kota;
	if (req.body.no_telp) query.where.no_telp = req.body.no_telp;
	if (req.body.pekerjaan) query.where.pekerjaan = req.body.pekerjaan;

	query.logging = customLogger;
	APP.models.mysql.rs.pasien.findAll(query).then((rows) => {
		log.sql(queryStr,req.user);
		return callback(null, {
			code: (rows && (rows.length > 0)) ? 'FOUND' : 'NOT_FOUND',
			data: rows,
			info: {
				dataCount: rows.length
			}
		});
	}).catch((err) => {		
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Pasien'
		});
	});
};

exports.count = function (APP, req, callback) {
	APP.models.mysql.rs.pasien.count().then((rows) => {
		return callback(null, {
			code: (rows && rows > 0) ? 'FOUND' : 'NOT_FOUND',
			data: {
				total_users: rows
			}
		});
	}).catch((err) => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Pasien'
		});
	});
};

exports.insert = function (APP, req, callback) {	
	var params = {				
		id_pasien:req.body.id_pasien,
		nama:req.body.nama,
		no_rekam_medik:req.body.no_rekam_medik,
		ktp:req.body.ktp,
		tgl_lahir:req.body.tgl_lahir,
		tempat_lahir:req.body.tempat_lahir,
		jenis_kelamin:req.body.jenis_kelamin,
		alamat:req.body.alamat,				
		kota:req.body.kota,				
		no_telp:req.body.no_telp,				
		pekerjaan:req.body.pekerjaan
	};	

	var query = {}
	query.logging = customLogger;
	
	APP.models.mysql.rs.pasien.build(params).save(query).then(result => {		
		log.sql(queryStr,req.user);
		return callback(null, {
			code: 'PASIEN_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_PASIEN_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_PASIEN_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Pasien'
		});
	});

};

exports.update = function (APP, req, callback) {	
	var params = {};
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};							
	if (req.body.dataQuery.id) params.dataQuery.where.id_pasien = req.body.dataQuery.id;
	if (req.body.dataQuery.id_pasien) params.dataQuery.where.id_pasien = req.body.dataQuery.id_pasien;
	
	if (req.body.dataUpdate.nama) params.dataUpdate.nama = req.body.dataUpdate.nama;
	if (req.body.dataUpdate.no_rekam_medik) params.dataUpdate.no_rekam_medik = req.body.dataUpdate.no_rekam_medik;
	if (req.body.dataUpdate.ktp) params.dataUpdate.ktp = req.body.dataUpdate.ktp;
	if (req.body.dataUpdate.tgl_lahir) params.dataUpdate.tgl_lahir = req.body.dataUpdate.tgl_lahir;
	if (req.body.dataUpdate.tempat_lahir) params.dataUpdate.tempat_lahir = req.body.dataUpdate.tempat_lahir;
	if (req.body.dataUpdate.jenis_kelamin) params.dataUpdate.jenis_kelamin = req.body.dataUpdate.jenis_kelamin;
	
	if (req.body.dataUpdate.alamat) params.dataUpdate.alamat = req.body.dataUpdate.alamat;
	if (req.body.dataUpdate.kota) params.dataUpdate.kota = req.body.dataUpdate.kota;
	if (req.body.dataUpdate.no_telp) params.dataUpdate.no_telp = req.body.dataUpdate.no_telp;
	if (req.body.dataUpdate.pekerjaan) params.dataUpdate.pekerjaan = req.body.dataUpdate.pekerjaan;
	
	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_PASIEN_UPDATE_NONE',
			data: req.body
		});

	params.dataQuery.logging = customLogger;
	APP.models.mysql.rs.pasien.update(params.dataUpdate, params.dataQuery).then(result => {							
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_PASIEN_UPDATE_NONE',
				data: req.body
			});

		log.sql(queryStr,req.user);
		return callback(null, {
			code: 'PASIEN_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
					
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_PASIEN_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_PASIEN_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Pasien'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.id_pasien = req.body.id;
	if (req.body.id_pasien) params.where.id_pasien = req.body.id_pasien;
	params.logging = customLogger;

	APP.models.mysql.rs.pasien.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_PASIEN_DELETE_NONE',
				data: params.where
			});

		log.sql(queryStr,req.user);
		return callback(null, {
			code: 'PASIEN_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Pasien'
		});
	});
};


exports.last_number = function (APP, req, callback) {
	module.exports.find(APP, {
		body:{
			order_by:['id_pasien','DESC']
		}  
	}, (err, result) => {
		var code = req.body.code;
		if (err) return callback({
				code: 'ERR_DATABASE'
			});
		
		if (result && result.code !== 'FOUND'){
			code = code + ".00001";
			return callback(null,{
				code: code
			});		
		} else {
			var norekam = result.data[0].dataValues.no_rekam_medik;
			norekam = parseInt(norekam.slice(-5));
			norekam+=1;
			code = code+"."+('0000'+norekam).slice(-5);
			return callback(null,{
				code: code
			});
		}
	});	
};
