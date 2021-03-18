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
	query.order = [['date_add', 'DESC']];
	if (req.body.id) query.where.ebmoney_id = req.body.id;
	if (req.body.ebmoney_id) query.where.ebmoney_id = req.body.ebmoney_id;

	if (req.body.customer_id) query.where.customer_id = req.body.customer_id;
	if (req.body.money) query.where.money = req.body.money;
	
	if (req.body.status) query.where.status = req.body.status;
	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}
	if ( req.body.detail ){
		APP.models.mysql.easy.ebmoney.belongsTo(APP.models.mysql.easy.customer, {foreignKey : 'customer_id',targetKey: 'customer_id'});	
		query.include = [
	        { 	model:APP.models.mysql.easy.customer,
	           	where:{},         
	           	required:true} 	
       	];
	}
	APP.models.mysql.easy.ebmoney.findAll(query).then((rows) => {
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
			from: 'EB Money'
		});
	});
};

exports.count = function (APP, req, callback) {
	APP.models.mysql.easy.ebmoney.count().then((rows) => {
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
			from: 'EB Money'
		});
	});
};

exports.insert = function (APP, req, callback) {		
	var params = {				
		customer_id:req.body.customer_id,
		money:req.body.money,
		status:req.body.status
	};	
	APP.models.mysql.easy.ebmoney.build(params).save().then(result => {				
		return callback(null, {
			code: 'EB_MONEY_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_EB_MONEY_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_EB_MONEY_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'EB Money'
		});
	});

};

exports.update = function (APP, req, callback) {		
	var params = {};		
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};									
	if (req.body.dataQuery.id) params.dataQuery.where.ebmoney_id = req.body.dataQuery.id;
	if (req.body.dataQuery.ebmoney_id) params.dataQuery.where.ebmoney_id = req.body.dataQuery.ebmoney_id;
	if (req.body.dataQuery.customer_id) params.dataQuery.customer_id = req.body.dataQuery.customer_id;
	

	if (req.body.dataUpdate.money) params.dataUpdate.money = req.body.dataUpdate.money;
	if (req.body.dataUpdate.status) params.dataUpdate.status = req.body.dataUpdate.status;

	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_EB_MONEY_UPDATE_NONE',
			data: req.body
		});	

	APP.models.mysql.easy.ebmoney.update(params.dataUpdate, params.dataQuery).then(result => {							
		console.log(result);
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_EB_MONEY_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'EB_MONEY_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_EB_MONEY_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_EB_MONEY_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'EB Money'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.ebmoney_id = req.body.id;
	if (req.body.ebmoney_id) params.where.ebmoney_id = req.body.ebmoney_id;
	if (req.body.customer_id) params.where.customer_id = req.body.customer_id;

	APP.models.mysql.easy.ebmoney.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_EB_MONEY_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'EB_MONEY_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'EB Money'
		});
	});
};
