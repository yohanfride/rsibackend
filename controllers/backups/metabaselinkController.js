"use strict";

const async = require('async');
const md5 = require('md5');
const moment = require('moment');
const microtime = require('microtime');
var email = require('../functions/email.js');
var encryption = require('../functions/encryption.js');
var output = {};
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
//////PENTING HAPUS FOLDER QUERY////

exports.find = function (APP, req, callback) {
	var query = {}
	query.where = {};
	if(req.body.take)
		query.limit = parseInt(req.body.take);
	query.offset = parseInt(req.body.skip ? req.body.skip : 0);
	query.order = [];
	if (req.body.id) query.where.metabaselink_id = req.body.id;
	if (req.body.metabaselink_id) query.where.metabaselink_id = req.body.metabaselink_id;

	if (req.body.name) query.where.name = req.body.name;
	if (req.body.code) query.where.code = req.body.code;
	if (req.body.detail) query.where.detail = req.body.detail;
	if (req.body.link) query.where.link = req.body.link;

	if (req.body.update_by) query.where.update_by = req.body.update_by;

	APP.models.mysql.easy.metabaselink.findAll(query).then((rows) => {
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
			from: 'metabaselink'
		});
	});
};

exports.count = function (APP, req, callback) {
	var query = {}
	query.where = {};
	if(req.body.take)
		query.limit = parseInt(req.body.take);
	query.offset = parseInt(req.body.skip ? req.body.skip : 0);
	query.order = [];
	if (req.body.id) query.where.metabaselink_id = req.body.id;
	if (req.body.metabaselink_id) query.where.metabaselink_id = req.body.metabaselink_id;

	if (req.body.metabaselink) query.where.metabaselink = req.body.metabaselink;
	if (req.body.code) query.where.code = req.body.code;
	if (req.body.detail) query.where.detail = req.body.detail;
	if (req.body.link) query.where.link = req.body.link;

	if (req.body.update_by) query.where.update_by = req.body.update_by;
	APP.models.mysql.easy.metabaselink.count(query).then((rows) => {
		return callback(null, {
			code: (rows && rows > 0) ? 'FOUND' : 'NOT_FOUND',
			data: {
				total: rows
			}
		});
	}).catch((err) => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'metabaselink'
		});
	});
};

exports.insert = function (APP, req, callback) {		
	var params = {				
		name:req.body.name,
		code:req.body.code,				
		detail:req.body.detail,				
		link:req.body.link,				
		update_by:req.body.update_by,
		date_update:req.body.date_update
	};	
	APP.models.mysql.easy.metabaselink.build(params).save().then(result => {				
		return callback(null, {
			code: 'METABASELINK_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_METABASELINK_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_METABASELINK_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'metabaselink'
		});
	});

};

exports.update = function (APP, req, callback) {		
	var params = {};		
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};									
	if (req.body.dataQuery.id) params.dataQuery.where.metabaselink_id = req.body.dataQuery.id;
	if (req.body.dataQuery.metabaselink_id) params.dataQuery.where.metabaselink_id = req.body.dataQuery.metabaselink_id;

	if (req.body.dataUpdate.name) params.dataUpdate.name = req.body.dataUpdate.name;
	if (req.body.dataUpdate.code) params.dataUpdate.code = req.body.dataUpdate.code;
	if (req.body.dataUpdate.detail) params.dataUpdate.detail = req.body.dataUpdate.detail;
	if (req.body.dataUpdate.link) params.dataUpdate.link = req.body.dataUpdate.link;
	
	if (req.body.dataUpdate.date_update) params.dataUpdate.date_update = req.body.dataUpdate.date_update;
	if (req.body.dataUpdate.update_by) params.dataUpdate.update_by = req.body.dataUpdate.update_by;

	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_METABASELINK_UPDATE_NONE',
			data: req.body
		});	

	APP.models.mysql.easy.metabaselink.update(params.dataUpdate, params.dataQuery).then(result => {							
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_METABASELINK_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'METABASELINK_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_METABASELINK_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_METABASELINK_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'metabaselink'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.metabaselink_id = req.body.id;
	if (req.body.metabaselink_id) params.where.metabaselink_id = req.body.metabaselink_id;

	APP.models.mysql.easy.metabaselink.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_METABASELINK_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'METABASELINK_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'metabaselink'
		});
	});
};