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
	if (req.body.id) query.where.customer_car_id = req.body.id;
	if (req.body.customer_car_id) query.where.customer_car_id = req.body.customer_car_id;

	if (req.body.customer_id) query.where.customer_id = req.body.customer_id;
	if (req.body.vehicle_number) query.where.vehicle_number = req.body.vehicle_number;
	if (req.body.brand) query.where.brand = req.body.brand;
	if (req.body.model) query.where.model = req.body.model;
	if (req.body.type) query.where.type = req.body.type;
	if (req.body.year) query.where.year = req.body.year;
	if (req.body.fuel_tank_capacity) query.where.fuel_tank_capacity = req.body.fuel_tank_capacity;
	if (req.body.fuel_type) query.where.fuel_type = req.body.fuel_type;
	
	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}
	if ( req.body.detail ){
		APP.models.mysql.easy.customercar.belongsTo(APP.models.mysql.easy.customer, {foreignKey : 'customer_id',targetKey: 'customer_id'});	
		query.include = [
           	{ 	model:APP.models.mysql.easy.customer,
	           	where:{},         
	           	required:true}   	
       	];
	}
	APP.models.mysql.easy.customercar.findAll(query).then((rows) => {
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
			from: 'Customer Car'
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
	if (req.body.id) query.where.customer_car_id = req.body.id;
	if (req.body.customer_car_id) query.where.customer_car_id = req.body.customer_car_id;

	if (req.body.customer_id) query.where.customer_id = req.body.customer_id;
	if (req.body.vehicle_number) query.where.vehicle_number = req.body.vehicle_number;
	if (req.body.brand) query.where.brand = req.body.brand;
	if (req.body.model) query.where.model = req.body.model;
	if (req.body.type) query.where.type = req.body.type;
	if (req.body.year) query.where.year = req.body.year;
	if (req.body.fuel_tank_capacity) query.where.fuel_tank_capacity = req.body.fuel_tank_capacity;
	if (req.body.fuel_type) query.where.fuel_type = req.body.fuel_type;
	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}

	APP.models.mysql.easy.customercar.count(query).then((rows) => {
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
			from: 'Customer Car'
		});
	});
};

exports.insert = function (APP, req, callback) {		
	var params = {				
		customer_car_id:req.body.customer_car_id,
		customer_id:req.body.customer_id,
		vehicle_number:req.body.vehicle_number,				
		brand:req.body.brand,				
		model:req.body.model,
		type:req.body.type,
		year:req.body.year,
		fuel_tank_capacity:req.body.fuel_tank_capacity,
		fuel_type:req.body.fuel_type,
		date_add:req.body.date_add
	};	
	APP.models.mysql.easy.customercar.build(params).save().then(result => {				
		return callback(null, {
			code: 'CUSTOMER_CAR_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_CUSTOMER_CAR_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_CUSTOMER_CAR_UPDATE_NONE',
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
	if (req.body.dataQuery.id) params.dataQuery.where.customer_car_id = req.body.dataQuery.id;
	if (req.body.dataQuery.customer_car_id) params.dataQuery.where.customer_car_id = req.body.dataQuery.customer_car_id;

	if (req.body.dataUpdate.customer_id) params.dataUpdate.customer_id = req.body.dataUpdate.customer_id;
	if (req.body.dataUpdate.vehicle_number) params.dataUpdate.vehicle_number = req.body.dataUpdate.vehicle_number;
	if (req.body.dataUpdate.brand) params.dataUpdate.brand = req.body.dataUpdate.brand;
	
	if (req.body.dataUpdate.type) params.dataUpdate.type = req.body.dataUpdate.type;
	if (req.body.dataUpdate.model) params.dataUpdate.model = req.body.dataUpdate.model;
	if (req.body.dataUpdate.year) params.dataUpdate.year = req.body.dataUpdate.year;
	if (req.body.dataUpdate.fuel_tank_capacity) params.dataUpdate.fuel_tank_capacity = req.body.dataUpdate.fuel_tank_capacity;
	if (req.body.dataUpdate.fuel_type) params.dataUpdate.fuel_type = req.body.dataUpdate.fuel_type;

	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_CUSTOMER_CAR_UPDATE_NONE',
			data: req.body
		});	

	APP.models.mysql.easy.customercar.update(params.dataUpdate, params.dataQuery).then(result => {							
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_CUSTOMER_CAR_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'CUSTOMER_CAR_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_CUSTOMER_CAR_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_CUSTOMER_CAR_DUPLICATE',
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
	if (req.body.id) params.where.customer_car_id = req.body.id;
	if (req.body.customer_car_id) params.where.customer_car_id = req.body.customer_car_id;

	APP.models.mysql.easy.customercar.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_CUSTOMER_CAR_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'CUSTOMER_CAR_DELETE_SUCCESS',
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