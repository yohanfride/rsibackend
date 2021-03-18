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
	if (req.body.id) query.where.cargo_inspection_id = req.body.id;
	if (req.body.cargo_inspection_id) query.where.cargo_inspection_id = req.body.cargo_inspection_id;

	if (req.body.car_id) query.where.car_id = req.body.car_id;
	if (req.body.note) query.where.note = { [Op.like] : '%'+req.body.note+'%' };
	

	if (req.body.tank) query.where.tank = req.body.tank;
	if (req.body.tank==0) query.where.tank = req.body.tank;

	if (req.body.atg) query.where.atg = req.body.atg;
	if (req.body.atg==0) query.where.atg = req.body.atg;

	if (req.body.flow_meter) query.where.flow_meter = req.body.flow_meter;
	if (req.body.flow_meter==0) query.where.flow_meter = req.body.flow_meter;

	if (req.body.pump) query.where.pump = req.body.pump;
	if (req.body.pump==0) query.where.pump = req.body.pump;

	if (req.body.power_system) query.where.power_system = req.body.power_system;
	if (req.body.power_system==0) query.where.power_system = req.body.power_system;

	if (req.body.pipeline) query.where.pipeline = req.body.pipeline;
	if (req.body.pipeline==0) query.where.pipeline = req.body.pipeline;

	if (req.body.hose) query.where.hose = req.body.hose;
	if (req.body.hose==0) query.where.hose = req.body.hose;

	if (req.body.box) query.where.box = req.body.box;
	if (req.body.box==0) query.where.box = req.body.box;

	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}
	
	console.log(req.body);
	if ( req.body.detail ){
       	APP.models.mysql.easy.cargoinspection.belongsTo(APP.models.mysql.easy.car, {foreignKey : 'car_id',targetKey: 'car_id'});	
		query.include = [
	        { 	model:APP.models.mysql.easy.car,
	           	where:{},         
	           	required:true}  	
       	];
	}

	APP.models.mysql.easy.cargoinspection.findAll(query).then((rows) => {
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
			from: 'Cargo Inspection'
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
	if (req.body.id) query.where.cargo_inspection_id = req.body.id;
	if (req.body.cargo_inspection_id) query.where.cargo_inspection_id = req.body.cargo_inspection_id;

	if (req.body.car_id) query.where.car_id = req.body.car_id;
	if (req.body.note) query.where.note = { [Op.like] : '%'+req.body.note+'%' };
	

	if (req.body.tank) query.where.tank = req.body.tank;
	if (req.body.tank==0) query.where.tank = req.body.tank;

	if (req.body.atg) query.where.atg = req.body.atg;
	if (req.body.atg==0) query.where.atg = req.body.atg;

	if (req.body.flow_meter) query.where.flow_meter = req.body.flow_meter;
	if (req.body.flow_meter==0) query.where.flow_meter = req.body.flow_meter;

	if (req.body.pump) query.where.pump = req.body.pump;
	if (req.body.pump==0) query.where.pump = req.body.pump;

	if (req.body.power_system) query.where.power_system = req.body.power_system;
	if (req.body.power_system==0) query.where.power_system = req.body.power_system;

	if (req.body.pipeline) query.where.pipeline = req.body.pipeline;
	if (req.body.pipeline==0) query.where.pipeline = req.body.pipeline;

	if (req.body.hose) query.where.hose = req.body.hose;
	if (req.body.hose==0) query.where.hose = req.body.hose;

	if (req.body.box) query.where.box = req.body.box;
	if (req.body.box==0) query.where.box = req.body.box;

	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}

	APP.models.mysql.easy.cargoinspection.count(query).then((rows) => {
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
			from: 'Cargo Inspection'
		});
	});
};

exports.insert = function (APP, req, callback) {		
	var params = {				
		car_id:req.body.car_id,
		note:req.body.note,				
		tank:req.body.tank,					
		atg:req.body.atg,				
		total_after_filling:req.body.total_after_filling,			
		flow_meter:req.body.flow_meter,
		pump:req.body.pump,
		pipeline:req.body.pipeline,
		hose:req.body.hose,
		box:req.body.box,
		add_by:req.body.add_by
	};	
	APP.models.mysql.easy.cargoinspection.build(params).save().then(result => {				
		return callback(null, {
			code: 'CARGO_INSPECTION_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_CARGO_INSPECTION_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_CARGO_INSPECTION_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Cargo Inspection'
		});
	});

};

exports.update = function (APP, req, callback) {		
	var params = {};		
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};									
	if (req.body.dataQuery.id) params.dataQuery.where.cargo_inspection_id = req.body.dataQuery.id;
	if (req.body.dataQuery.cargo_inspection_id) params.dataQuery.where.cargo_inspection_id = req.body.dataQuery.cargo_inspection_id;
	if (req.body.dataUpdate.car_id) params.dataUpdate.car_id = req.body.dataUpdate.car_id;
	if (req.body.dataUpdate.note) params.dataUpdate.note = req.body.dataUpdate.note;
	

	if (req.body.dataUpdate.tank) params.dataUpdate.tank = req.body.dataUpdate.tank;
	if (req.body.dataUpdate.tank == 0) params.dataUpdate.tank = req.body.dataUpdate.tank;

	if (req.body.dataUpdate.atg) params.dataUpdate.atg = req.body.dataUpdate.atg;
	if (req.body.dataUpdate.atg == 0) params.dataUpdate.atg = req.body.dataUpdate.atg;
	
	if (req.body.dataUpdate.flow_meter) params.dataUpdate.flow_meter = req.body.dataUpdate.flow_meter;
	if (req.body.dataUpdate.flow_meter == 0) params.dataUpdate.flow_meter = req.body.dataUpdate.flow_meter;
	
	if (req.body.dataUpdate.pump) params.dataUpdate.pump = req.body.dataUpdate.pump;
	if (req.body.dataUpdate.pump == 0) params.dataUpdate.pump = req.body.dataUpdate.pump;
	
	if (req.body.dataUpdate.power_system) params.dataUpdate.power_system = req.body.dataUpdate.power_system;
	if (req.body.dataUpdate.power_system == 0) params.dataUpdate.power_system = req.body.dataUpdate.power_system;
	
	if (req.body.dataUpdate.pipeline) params.dataUpdate.pipeline = req.body.dataUpdate.pipeline;
	if (req.body.dataUpdate.pipeline == 0) params.dataUpdate.pipeline = req.body.dataUpdate.pipeline;
	
	if (req.body.dataUpdate.hose) params.dataUpdate.hose = req.body.dataUpdate.hose;
	if (req.body.dataUpdate.hose == 0) params.dataUpdate.hose = req.body.dataUpdate.hose;
	
	if (req.body.dataUpdate.box) params.dataUpdate.box = req.body.dataUpdate.box;
	if (req.body.dataUpdate.box == 0) params.dataUpdate.box = req.body.dataUpdate.box;
	
	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_CARGO_INSPECTION_UPDATE_NONE',
			data: req.body
		});	

	APP.models.mysql.easy.cargoinspection.update(params.dataUpdate, params.dataQuery).then(result => {							
		console.log(result);
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_CARGO_INSPECTION_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'CARGO_INSPECTION_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_CARGO_INSPECTION_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_CARGO_INSPECTION_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Cargo Inspection'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.cargo_inspection_id = req.body.id;
	if (req.body.cargo_inspection_id) params.where.cargo_inspection_id = req.body.cargo_inspection_id;

	APP.models.mysql.easy.cargoinspection.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_CARGO_INSPECTION_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'CARGO_INSPECTION_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Cargo Inspection'
		});
	});
};
