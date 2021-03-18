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
	query.logging = customLogger;
	
	query.where = {};
	if(req.body.take)
		query.limit = parseInt(req.body.take);
	query.offset = parseInt(req.body.skip ? req.body.skip : 0);
	query.order = [];
	if (req.body.id) query.where.id_ruangan = req.body.id;
	if (req.body.id_ruangan) query.where.id_ruangan = req.body.id_ruangan;

	if (req.body.nomor_ruangan) query.where.nomor_ruangan = req.body.nomor_ruangan;
	if (req.body.jenis_ruangan) query.where.jenis_ruangan = req.body.jenis_ruangan;

	if (req.body.add_by) query.where.add_by = req.body.add_by;
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.status == 0) query.where.status = req.body.status;
	if (req.body.harga) query.where.harga = req.body.harga;
	if (req.body.keterangan) query.where.keterangan = req.body.keterangan;

	APP.models.mysql.rs.ruangan.findAll(query).then((rows) => {
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
			from: 'Ruangan'
		});
	});
};

exports.count = function (APP, req, callback) {
	APP.models.mysql.rs.ruangan.count().then((rows) => {
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
			from: 'Ruangan'
		});
	});
};

exports.insert = function (APP, req, callback) {	
	var params = {				
		id_ruangan:req.body.id_ruangan,
		nomor_ruangan:req.body.nomor_ruangan,
		jenis_ruangan:req.body.jenis_ruangan,				
		harga:req.body.harga,				
		status:req.body.status,
		keterangan:req.body.keterangan
	};		

	var query = {}
	query.logging = customLogger;
	

	APP.models.mysql.rs.ruangan.build(params).save(query).then(result => {		
		log.sql(queryStr,req.user);
		return callback(null, {
			code: 'RUANGAN_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_RUANGAN_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_RUANGAN_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Ruangan'
		});
	});

};

exports.update = function (APP, req, callback) {	
	var params = {};
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};							
	if (req.body.dataQuery.id) params.dataQuery.where.id_ruangan = req.body.dataQuery.id;
	if (req.body.dataQuery.id_ruangan) params.dataQuery.where.id_ruangan = req.body.dataQuery.id_ruangan;
	
	if (req.body.dataUpdate.nomor_ruangan) params.dataUpdate.nomor_ruangan = req.body.dataUpdate.nomor_ruangan;
	if (req.body.dataUpdate.jenis_ruangan) params.dataUpdate.jenis_ruangan = req.body.dataUpdate.jenis_ruangan;
	if (req.body.dataUpdate.status) params.dataUpdate.status = req.body.dataUpdate.status;
	if (req.body.dataUpdate.status == 0) params.dataUpdate.status = req.body.dataUpdate.status;
	if (req.body.dataUpdate.harga) params.dataUpdate.harga = req.body.dataUpdate.harga;
	if (req.body.dataUpdate.keterangan) params.dataUpdate.keterangan = req.body.dataUpdate.keterangan;
	
	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_RUANGAN_UPDATE_NONE',
			data: req.body
		});

	params.dataQuery.logging = customLogger;
	APP.models.mysql.rs.ruangan.update(params.dataUpdate, params.dataQuery).then(result => {							
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_RUANGAN_UPDATE_NONE',
				data: req.body
			});

		log.sql(queryStr,req.user);
		return callback(null, {
			code: 'RUANGAN_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
					
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_RUANGAN_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_RUANGAN_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Ruangan'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.id_ruangan = req.body.id;
	if (req.body.id_ruangan) params.where.id_ruangan = req.body.id_ruangan;
	params.logging = customLogger;

	APP.models.mysql.rs.ruangan.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_RUANGAN_DELETE_NONE',
				data: params.where
			});

		log.sql(queryStr,req.user);
		return callback(null, {
			code: 'RUANGAN_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Ruangan'
		});
	});
};
