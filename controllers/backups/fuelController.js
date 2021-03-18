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
	if (req.body.id) query.where.fuel_id = req.body.id;
	if (req.body.fuel_id) query.where.fuel_id = req.body.fuel_id;

	if (req.body.fuel) query.where.fuel = req.body.fuel;
	if (req.body.price) query.where.price = req.body.price;
	if (req.body.information) query.where.information = req.body.information;

	if (req.body.update_by) query.where.update_by = req.body.update_by;

	APP.models.mysql.easy.fuel.findAll(query).then((rows) => {
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
			from: 'fuel'
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
	if (req.body.id) query.where.fuel_id = req.body.id;
	if (req.body.fuel_id) query.where.fuel_id = req.body.fuel_id;

	if (req.body.fuel) query.where.fuel = req.body.fuel;
	if (req.body.price) query.where.price = req.body.price;
	if (req.body.information) query.where.information = req.body.information;

	if (req.body.update_by) query.where.update_by = req.body.update_by;
	APP.models.mysql.easy.fuel.count(query).then((rows) => {
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
			from: 'fuel'
		});
	});
};

exports.insert = function (APP, req, callback) {		
	var params = {				
		fuel_id:req.body.fuel_id,
		fuel:req.body.fuel,
		price:req.body.price,				
		information:req.body.information,				
		update_by:req.body.update_by,
		date_update:req.body.date_update
	};	
	APP.models.mysql.easy.fuel.build(params).save().then(result => {				
		return callback(null, {
			code: 'FUEL_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_FUEL_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_FUEL_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'fuel'
		});
	});

};

exports.update = function (APP, req, callback) {		
	var params = {};		
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};									
	if (req.body.dataQuery.id) params.dataQuery.where.fuel_id = req.body.dataQuery.id;
	if (req.body.dataQuery.fuel_id) params.dataQuery.where.fuel_id = req.body.dataQuery.fuel_id;

	if (req.body.dataUpdate.fuel) params.dataUpdate.fuel = req.body.dataUpdate.fuel;
	if (req.body.dataUpdate.price) params.dataUpdate.price = req.body.dataUpdate.price;
	if (req.body.dataUpdate.information) params.dataUpdate.information = req.body.dataUpdate.information;
	
	if (req.body.dataUpdate.date_update) params.dataUpdate.date_update = req.body.dataUpdate.date_update;
	if (req.body.dataUpdate.update_by) params.dataUpdate.update_by = req.body.dataUpdate.update_by;

	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_FUEL_UPDATE_NONE',
			data: req.body
		});	

	APP.models.mysql.easy.fuel.update(params.dataUpdate, params.dataQuery).then(result => {							
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_FUEL_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'FUEL_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_FUEL_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_FUEL_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'fuel'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.fuel_id = req.body.id;
	if (req.body.fuel_id) params.where.fuel_id = req.body.fuel_id;

	APP.models.mysql.easy.fuel.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_FUEL_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'FUEL_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'fuel'
		});
	});
};