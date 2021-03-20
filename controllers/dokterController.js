"use strict";

const async = require('async');
const md5 = require('md5');
const moment = require('moment');
const microtime = require('microtime');
var email = require('../functions/email.js');
var encryption = require('../functions/encryption.js');
var output = {};
const { Op } = require('sequelize');

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
	if (req.body.id) query.where.id_dokter = req.body.id;
	if (req.body.id_dokter) query.where.id_dokter = req.body.id_dokter;

	if (req.body.nama_dokter) query.where.nama_dokter = req.body.nama_dokter;
	if (req.body.alamat) query.where.alamat = req.body.alamat;
	if (req.body.no_telp) query.where.no_telp = req.body.no_telp;
	if (req.body.spesialis) query.where.spesialis = req.body.spesialis;

	APP.models.mysql.rs.dokter.findAll(query).then((rows) => {
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
			from: 'Dokter'
		});
	});
};

exports.count = function (APP, req, callback) {
	APP.models.mysql.rs.dokter.count().then((rows) => {
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
			from: 'Dokter'
		});
	});
};

exports.insert = function (APP, req, callback) {	
	var params = {				
		id_dokter:req.body.id_dokter,
		nama_dokter:req.body.nama_dokter,
		alamat:req.body.alamat,				
		no_telp:req.body.no_telp,				
		spesialis:req.body.spesialis
	};	
	var query = {}
	query.logging = customLogger;

	APP.models.mysql.rs.dokter.build(params).save(query).then(result => {		
		log.sql(queryStr,req.user);
		return callback(null, {
			code: 'DOKTER_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_DOKTER_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_DOKTER_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Dokter'
		});
	});

};

exports.update = function (APP, req, callback) {	
	var params = {};
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};							
	if (req.body.dataQuery.id) params.dataQuery.where.id_dokter = req.body.dataQuery.id;
	if (req.body.dataQuery.id_dokter) params.dataQuery.where.id_dokter = req.body.dataQuery.id_dokter;
	
	if (req.body.dataUpdate.nama_dokter) params.dataUpdate.nama_dokter = req.body.dataUpdate.nama_dokter;
	if (req.body.dataUpdate.alamat) params.dataUpdate.alamat = req.body.dataUpdate.alamat;
	if (req.body.dataUpdate.no_telp) params.dataUpdate.no_telp = req.body.dataUpdate.no_telp;
	if (req.body.dataUpdate.spesialis) params.dataUpdate.spesialis = req.body.dataUpdate.spesialis;
	
	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_DOKTER_UPDATE_NONE',
			data: req.body
		});

	params.dataQuery.logging = customLogger;
	APP.models.mysql.rs.dokter.update(params.dataUpdate, params.dataQuery).then(result => {							
		if (!result || (result && !result[0])) return callback({
				code: 'ERR_DOKTER_UPDATE_NONE',
				data: req.body
			});
		
		log.sql(queryStr,req.user);
		return callback(null, {
			code: 'DOKTER_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
					
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_DOKTER_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_DOKTER_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Dokter'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.id_dokter = req.body.id;
	if (req.body.id_dokter) params.where.id_dokter = req.body.id_dokter;
	params.logging = customLogger;

	APP.models.mysql.rs.dokter.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_DOKTER_DELETE_NONE',
				data: params.where
			});
		log.sql(queryStr,req.user);
		return callback(null, {
			code: 'DOKTER_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Dokter'
		});
	});
};
