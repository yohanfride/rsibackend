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
	if (req.body.id) query.where.id = req.body.id;

	if (req.body.customer_id) query.where.customer_id = req.body.customer_id;
	if (req.body.transaction_code) query.where.transaction_code = req.body.transaction_code;
	if (req.body.account) query.where.account = req.body.account;
	
	if (req.body.debit) query.where.debit = req.body.debit;
	if (req.body.credit) query.where.credit = req.body.credit;
	if (req.body.balance) query.where.balance = req.body.balance;

	if (req.body.information) query.where.information = req.body.information;
	if (req.body.status) query.where.status = req.body.status;

	if (req.body.file) query.where.file = req.body.file;
	if (req.body.approved_by) query.where.approved_by = req.body.approved_by;

	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}
	
	if ( req.body.detail ){
		APP.models.mysql.easy.ebtransaction.belongsTo(APP.models.mysql.easy.customer, {foreignKey : 'customer_id',targetKey: 'customer_id'});	
		query.include = [
           	{ 	model:APP.models.mysql.easy.customer,
	           	where:{},         
	           	required:true}   	
       	];
	}
	
	APP.models.mysql.easy.ebtransaction.findAll(query).then((rows) => {
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
			from: 'EB Money Transaction'
		});
	});
};

exports.count = function (APP, req, callback) {
	var query = {}
	query.where = {};
	if(req.body.take)
		query.limit = parseInt(req.body.take);
	query.offset = parseInt(req.body.skip ? req.body.skip : 0);
	query.order = [['date_add', 'DESC']];
	if (req.body.id) query.where.id = req.body.id;

	if (req.body.customer_id) query.where.customer_id = req.body.customer_id;
	if (req.body.transaction_code) query.where.transaction_code = req.body.transaction_code;
	if (req.body.account) query.where.account = req.body.account;
	
	if (req.body.debit) query.where.debit = req.body.debit;
	if (req.body.credit) query.where.credit = req.body.credit;
	if (req.body.balance) query.where.balance = req.body.balance;

	if (req.body.information) query.where.information = req.body.information;
	if (req.body.status) query.where.status = req.body.status;

	if (req.body.file) query.where.file = req.body.file;
	if (req.body.approved_by) query.where.approved_by = req.body.approved_by;

	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}

	APP.models.mysql.easy.ebtransaction.count(query).then((rows) => {
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
			from: 'EB Money Transaction'
		});
	});
};

exports.insert = function (APP, req, callback) {		
	var params = {				
		customer_id:req.body.customer_id,
		transaction_code:req.body.transaction_code,
		account:req.body.account,				
		debit:req.body.debit,				
		credit:req.body.credit,
		balance:req.body.balance,
		information:req.body.information,		
		date_add:req.body.date_add,
		status:req.body.status,		
		file:req.body.file,
		approved_by:req.body.approved_by
	};	
	APP.models.mysql.easy.ebtransaction.build(params).save().then(result => {				
		return callback(null, {
			code: 'EB_MONEY_TRANSACTION_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_EB_MONEY_TRANSACTION_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_EB_MONEY_TRANSACTION_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'EB Money Transaction'
		});
	});

};

exports.update = function (APP, req, callback) {		
	var params = {};		
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};									
	if (req.body.dataQuery.id) params.dataQuery.where.id = req.body.dataQuery.id;
	
	if (req.body.dataUpdate.customer_id) params.dataUpdate.customer_id = req.body.dataUpdate.customer_id;
	if (req.body.dataUpdate.transaction_code) params.dataUpdate.transaction_code = req.body.dataUpdate.transaction_code;

	if (req.body.dataUpdate.account) params.dataUpdate.account = req.body.dataUpdate.account;
	if (req.body.dataUpdate.debit) params.dataUpdate.debit = req.body.dataUpdate.debit;
	if (req.body.dataUpdate.credit) params.dataUpdate.credit = req.body.dataUpdate.credit;
	if (req.body.dataUpdate.balance) params.dataUpdate.balance = req.body.dataUpdate.balance;

	if (req.body.dataUpdate.information) params.dataUpdate.information = req.body.dataUpdate.information;
	if (req.body.dataUpdate.status) params.dataUpdate.status = req.body.dataUpdate.status;

	if (req.body.dataUpdate.file) params.dataUpdate.file = req.body.dataUpdate.file;
	if (req.body.dataUpdate.approved_by) params.dataUpdate.approved_by = req.body.dataUpdate.approved_by;

	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_EB_MONEY_TRANSACTION_UPDATE_NONE',
			data: req.body
		});	
	if (Object.keys(params.dataQuery).length < 1) return callback({
			code: 'ERR_EB_MONEY_TRANSACTION_UPDATE_NONE',
			data: req.body
		});		
		
	APP.models.mysql.easy.ebtransaction.update(params.dataUpdate, params.dataQuery).then(result => {							
		console.log(result);
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_EB_MONEY_TRANSACTION_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'EB_MONEY_TRANSACTION_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_EB_MONEY_TRANSACTION_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_EB_MONEY_TRANSACTION_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'EB Money Transaction'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.id = req.body.id;

	APP.models.mysql.easy.ebtransaction.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_EB_MONEY_TRANSACTION_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'EB_MONEY_TRANSACTION_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'EB Money Transaction'
		});
	});
};