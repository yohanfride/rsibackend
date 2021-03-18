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
	if (req.body.id) query.where.rate_id = req.body.id;
	if (req.body.rate_id) query.where.rate_id = req.body.rate_id;

	if (req.body.driver_id) query.where.driver_id = req.body.driver_id;
	if (req.body.customer_id) query.where.customer_id = req.body.customer_id;
	
	if (req.body.transaction_code) query.where.transaction_code = req.body.transaction_code;
	if (req.body.rate) query.where.rate = req.body.rate;
	if (req.body.comment) query.where.comment = req.body.comment;

	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}
	
	console.log(req.body);
	if ( req.body.detail ){
       	APP.models.mysql.easy.rate.belongsTo(APP.models.mysql.easy.customer, {foreignKey : 'customer_id',targetKey: 'customer_id'});	
		APP.models.mysql.easy.rate.belongsTo(APP.models.mysql.easy.driver, {foreignKey : 'driver_id',targetKey: 'driver_id'});	
		query.include = [
	        { 	model:APP.models.mysql.easy.customer,
	           	where:{},         
	           	required:true},
	        { 	model:APP.models.mysql.easy.driver,
	           	where:{},         
	           	required:true}   	
       	];
	}

	if ( req.body.detail_trans ){
       	APP.models.mysql.easy.rate.belongsTo(APP.models.mysql.easy.transaction, {foreignKey : 'transaction_code',targetKey: 'transaction_code'});	
       	if ( req.body.detail ){
       		query.include.push(
       			{ 	model:APP.models.mysql.easy.transaction,
		           	where:{},         
		           	required:true} 
		        );
       	} else {
       		query.include = [
		        { 	model:APP.models.mysql.easy.transaction,
		           	where:{},         
		           	required:true}  	
	       	];	
       	}
		
	}


	APP.models.mysql.easy.rate.findAll(query).then((rows) => {
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
			from: 'Rate'
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
	if (req.body.id) query.where.rate_id = req.body.id;
	if (req.body.rate_id) query.where.rate_id = req.body.rate_id;

	if (req.body.driver_id) query.where.driver_id = req.body.driver_id;
	if (req.body.customer_id) query.where.customer_id = req.body.customer_id;
	
	if (req.body.transaction_code) query.where.transaction_code = req.body.transaction_code;
	if (req.body.rate) query.where.rate = req.body.rate;
	if (req.body.comment) query.where.comment = req.body.comment;
	

	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}

	APP.models.mysql.easy.rate.count(query).then((rows) => {
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
			from: 'Rate'
		});
	});
};

exports.insert = function (APP, req, callback) {		
	var params = {				
		driver_id:req.body.driver_id,
		customer_id:req.body.customer_id,
		transaction_code:req.body.transaction_code,				
		rate:req.body.rate,					
		comment:req.body.comment,				
		total_after_filling:req.body.total_after_filling,			
		date_add:req.body.date_add,
		date_finish:req.body.date_finish,
		note:req.body.note,
		status:req.body.status
	};	
	APP.models.mysql.easy.rate.build(params).save().then(result => {				
		return callback(null, {
			code: 'RATE_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_RATE_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_RATE_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Rate'
		});
	});

};

exports.update = function (APP, req, callback) {		
	var params = {};		
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};									
	if (req.body.dataQuery.id) params.dataQuery.where.rate_id = req.body.dataQuery.id;
	if (req.body.dataQuery.rate_id) params.dataQuery.where.rate_id = req.body.dataQuery.rate_id;
	
	if (req.body.dataUpdate.driver_id) params.dataUpdate.driver_id = req.body.dataUpdate.driver_id;
	if (req.body.dataUpdate.customer_id) params.dataUpdate.customer_id = req.body.dataUpdate.customer_id;

	if (req.body.dataUpdate.transaction_code) params.dataUpdate.transaction_code = req.body.dataUpdate.transaction_code;
	if (req.body.dataUpdate.rate) params.dataUpdate.rate = req.body.dataUpdate.rate;
	if (req.body.dataUpdate.comment) params.dataUpdate.comment = req.body.dataUpdate.comment;
	
	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_RATE_UPDATE_NONE',
			data: req.body
		});	

	APP.models.mysql.easy.rate.update(params.dataUpdate, params.dataQuery).then(result => {							
		console.log(result);
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_RATE_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'RATE_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_RATE_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_RATE_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Rate'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.transaction_code = req.body.id;
	if (req.body.transaction_code) params.where.transaction_code = req.body.transaction_code;

	APP.models.mysql.easy.rate.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_RATE_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'RATE_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Rate'
		});
	});
};

exports.group = function (APP, req, callback) {
	var query = {}
	query.where = {};
	if(req.body.take)
		query.limit = parseInt(req.body.take);
	query.offset = parseInt(req.body.skip ? req.body.skip : 0);
	query.order = [['date_add', 'DESC']];
	if (req.body.id) query.where.rate_id = req.body.id;
	if (req.body.rate_id) query.where.rate_id = req.body.rate_id;

	if (req.body.driver_id) query.where.driver_id = req.body.driver_id;
	if (req.body.customer_id) query.where.customer_id = req.body.customer_id;
	
	if (req.body.transaction_code) query.where.transaction_code = req.body.transaction_code;
	if (req.body.rate) query.where.rate = req.body.rate;
	if (req.body.comment) query.where.comment = req.body.comment;

	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}
	
	if( req.body.groupby ){
		if(req.body.groupby == 'rate'){
			query.attributes = ['rate',[Sequelize.fn('sum', Sequelize.col('transaction_code')), 'transaction_code'],[Sequelize.fn('sum', Sequelize.col('rate')), 'total_rate']]; 
			query.group = ['transaction.rate'];
		    query.raw = true;
		    query.order = Sequelize.literal('rate DESC');
		}
		if(req.body.groupby == 'date'){
			query.attributes = [ [Sequelize.fn('date', Sequelize.col('date_add')), 'date'], [Sequelize.fn('count', Sequelize.col('rate_id')), 'total_item'],[Sequelize.fn('sum', Sequelize.col('rate')), 'total_rate']]; 
			query.group = [Sequelize.fn('date', Sequelize.col('date_add'))];
		    query.raw = true;
		    query.order = Sequelize.literal('date ASC');
		}
		if(req.body.groupby == 'customer'){
			query.attributes = [ [Sequelize.fn('count', Sequelize.col('rate_id')), 'total_item'],[Sequelize.fn('sum', Sequelize.col('rate')), 'total_rate'],
								 [Sequelize.fn('average', Sequelize.col('rate')), 'average_rate'],'customer_id' ]; 
			query.group = ['customer_id'];
		    query.raw = true;
		    query.order = Sequelize.literal('customer_id DESC');
		}
	}

	APP.models.mysql.easy.rate.findAll(query).then((rows) => {
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
			from: 'Rate'
		});
	});
};