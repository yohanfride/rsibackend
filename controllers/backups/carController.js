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
	if (req.body.id) query.where.car_id = req.body.id;
	if (req.body.car_id) query.where.car_id = req.body.car_id;

	if (req.body.postion_lat) query.where.postion_lat = req.body.postion_lat;
	if (req.body.postion_lng) query.where.postion_lng = req.body.postion_lng;
	if (req.body.gps_uid) query.where.gps_uid = req.body.gps_uid;

	if (req.body.capacity) query.where.capacity = req.body.capacity;
	if (req.body.vehicle_number) query.where.vehicle_number = req.body.vehicle_number;
	if (req.body.model) query.where.model = req.body.model;

	if (req.body.date_add) query.where.date_add = req.body.date_add;
	if (req.body.add_by) query.where.add_by = req.body.add_by;
	if (req.body.body_machine) query.where.body_machine = req.body.body_machine;
	if (req.body.stnk) query.where.stnk = req.body.stnk;
				
	if (req.body.tank) query.where.tank = req.body.tank;
	if (req.body.photo) query.where.photo = req.body.photo;
	if (req.body.device_id) query.where.device_id = req.body.device_id;
	if (req.body.owner) query.where.owner = req.body.owner;
	if (req.body.status) query.where.status = req.body.status;

	if (req.body.total_km) query.where.total_km = req.body.total_km;
	if (req.body.maintance_km) query.where.maintance_km = req.body.maintance_km;
	if (req.body.next_service_date) query.where.next_service_date = req.body.next_service_date;
	if (req.body.last_service_date) query.where.last_service_date = req.body.last_service_date;
	if (req.body.geo_alert) query.where.geo_alert = req.body.geo_alert;

	if (req.body.speed_limit) query.where.speed_limit = req.body.speed_limit;
	if (req.body.speed_limit_alert) query.where.speed_limit_alert = req.body.speed_limit_alert;
	if (req.body.last_speed_limit) query.where.last_speed_limit = req.body.last_speed_limit;
	if (req.body.sector) query.where.sector = req.body.sector;
	if (req.body.fuel) query.where.fuel = req.body.fuel;
	if (req.body.emergency_alert) query.where.emergency_alert = req.body.emergency_alert;
	if (req.body.flow_clock) query.where.flow_clock = req.body.flow_clock;
	if (req.body.atg_temp) query.where.atg_temp = req.body.atg_temp;
	if (req.body.atg_level) query.where.atg_level = req.body.atg_level;
	



	APP.models.mysql.easy.car.findAll(query).then((rows) => {
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
			from: 'car'
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
	if (req.body.id) query.where.car_id = req.body.id;
	if (req.body.car_id) query.where.car_id = req.body.car_id;

	if (req.body.postion_lat) query.where.postion_lat = req.body.postion_lat;
	if (req.body.postion_lng) query.where.postion_lng = req.body.postion_lng;
	if (req.body.gps_uid) query.where.gps_uid = req.body.gps_uid;

	if (req.body.capacity) query.where.capacity = req.body.capacity;
	if (req.body.vehicle_number) query.where.vehicle_number = req.body.vehicle_number;
	if (req.body.model) query.where.model = req.body.model;

	if (req.body.date_add) query.where.date_add = req.body.date_add;
	if (req.body.add_by) query.where.add_by = req.body.add_by;
	if (req.body.body_machine) query.where.body_machine = req.body.body_machine;
	if (req.body.stnk) query.where.stnk = req.body.stnk;
				
	if (req.body.tank) query.where.tank = req.body.tank;
	if (req.body.photo) query.where.photo = req.body.photo;
	if (req.body.device_id) query.where.device_id = req.body.device_id;
	if (req.body.owner) query.where.owner = req.body.owner;
	if (req.body.status) query.where.status = req.body.status;

	if (req.body.total_km) query.where.total_km = req.body.total_km;
	if (req.body.maintance_km) query.where.maintance_km = req.body.maintance_km;
	if (req.body.next_service_date) query.where.next_service_date = req.body.next_service_date;
	if (req.body.last_service_date) query.where.last_service_date = req.body.last_service_date;
	if (req.body.geo_alert) query.where.geo_alert = req.body.geo_alert;

	if (req.body.speed_limit) query.where.speed_limit = req.body.speed_limit;
	if (req.body.speed_limit_alert) query.where.speed_limit_alert = req.body.speed_limit_alert;
	if (req.body.last_speed_limit) query.where.last_speed_limit = req.body.last_speed_limit;
	if (req.body.sector) query.where.sector = req.body.sector;
	if (req.body.fuel) query.where.fuel = req.body.fuel;
	if (req.body.emergency_alert) query.where.emergency_alert = req.body.emergency_alert;
	if (req.body.flow_clock) query.where.flow_clock = req.body.flow_clock;
	if (req.body.atg_temp) query.where.atg_temp = req.body.atg_temp;
	if (req.body.atg_level) query.where.atg_level = req.body.atg_level;
	
	APP.models.mysql.easy.car.count(query).then((rows) => {
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
			from: 'car'
		});
	});
};

exports.insert = function (APP, req, callback) {			
	var params = {				
		car_id:req.body.car_id,
		gps_uid:req.body.gps_uid,
		postion_lat:req.body.postion_lat,
		postion_lng:req.body.postion_lng,				
		capacity:req.body.capacity,				
		vehicle_number:req.body.vehicle_number,
		model:req.body.model,		
		add_by:req.body.add_by,
		date_add:req.body.date_add,
		status:req.body.status,
		body_machine:req.body.body_machine,
		stnk:req.body.stnk,
		tank:req.body.tank,
		device_id:req.body.device_id,
		photo:req.body.photo,
		owner:req.body.owner,
		total_km:req.body.total_km,
		maintance_km:req.body.maintance_km,
		next_service_date:req.body.next_service_date,
		last_service_date:req.body.last_service_date,
		geo_alert:req.body.geo_alert,
		speed_limit:req.body.speed_limit,
		speed_limit_alert:req.body.speed_limit_alert,
		last_speed_limit:req.body.last_speed_limit,		
		sector:req.body.sector,
		fuel:req.body.fuel,
		flow_clock:req.body.flow_clock,
		atg_temp:req.body.atg_temp,
		atg_level:req.body.atg_level,
		emergency_alert:req.body.emergency_alert
	};	
	APP.models.mysql.easy.car.build(params).save().then(result => {				
		return callback(null, {
			code: 'CAR_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_CAR_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_CAR_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'car'
		});
	});

};

exports.update = function (APP, req, callback) {		
	var params = {};		
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};									
	if (req.body.dataQuery.id) params.dataQuery.where.car_id = req.body.dataQuery.id;
	if (req.body.dataQuery.car_id) params.dataQuery.where.car_id = req.body.dataQuery.car_id;

	if (req.body.dataUpdate.postion_lat) params.dataUpdate.postion_lat = req.body.dataUpdate.postion_lat;
	if (req.body.dataUpdate.postion_lng) params.dataUpdate.postion_lng = req.body.dataUpdate.postion_lng;
	if (req.body.dataUpdate.gps_uid) params.dataUpdate.gps_uid = req.body.dataUpdate.gps_uid;

	if (req.body.dataUpdate.capacity) params.dataUpdate.capacity = req.body.dataUpdate.capacity;
	if (req.body.dataUpdate.vehicle_number) params.dataUpdate.vehicle_number = req.body.dataUpdate.vehicle_number;
	if (req.body.dataUpdate.model) params.dataUpdate.model = req.body.dataUpdate.model;

	if (req.body.dataUpdate.body_machine) params.dataUpdate.body_machine = req.body.dataUpdate.body_machine;
	if (req.body.dataUpdate.stnk) params.dataUpdate.stnk = req.body.dataUpdate.stnk;
				
	if (req.body.dataUpdate.tank) params.dataUpdate.tank = req.body.dataUpdate.tank;
	if (req.body.dataUpdate.photo) params.dataUpdate.photo = req.body.dataUpdate.photo;
	if (req.body.dataUpdate.device_id) params.dataUpdate.device_id = req.body.dataUpdate.device_id;
	if (req.body.dataUpdate.status) params.dataUpdate.status = req.body.dataUpdate.status;
	if (req.body.dataUpdate.owner) params.dataUpdate.owner = req.body.dataUpdate.owner;

	if (req.body.dataUpdate.total_km) params.dataUpdate.total_km = req.body.dataUpdate.total_km;
	if (req.body.dataUpdate.maintance_km) params.dataUpdate.maintance_km = req.body.dataUpdate.maintance_km;
	if (req.body.dataUpdate.next_service_date) params.dataUpdate.next_service_date = req.body.dataUpdate.next_service_date;
	if (req.body.dataUpdate.last_service_date) params.dataUpdate.last_service_date = req.body.dataUpdate.last_service_date;
	if (req.body.dataUpdate.geo_alert) params.dataUpdate.geo_alert = req.body.dataUpdate.geo_alert;

	if (req.body.dataUpdate.speed_limit) params.dataUpdate.speed_limit = req.body.dataUpdate.speed_limit;
	if (req.body.dataUpdate.speed_limit_alert) params.dataUpdate.speed_limit_alert = req.body.dataUpdate.speed_limit_alert;
	if (req.body.dataUpdate.last_speed_limit) params.dataUpdate.last_speed_limit = req.body.dataUpdate.last_speed_limit;
	if (req.body.dataUpdate.sector) params.dataUpdate.sector = req.body.dataUpdate.sector;
	if (req.body.dataUpdate.fuel) params.dataUpdate.fuel = req.body.dataUpdate.fuel;
	if (req.body.dataUpdate.emergency_alert) params.dataUpdate.emergency_alert = req.body.dataUpdate.emergency_alert;

	if (req.body.dataUpdate.flow_clock) params.dataUpdate.flow_clock = req.body.dataUpdate.flow_clock;
	if (req.body.dataUpdate.atg_temp) params.dataUpdate.atg_temp = req.body.dataUpdate.atg_temp;
	if (req.body.dataUpdate.atg_level) params.dataUpdate.atg_level = req.body.dataUpdate.atg_level;
	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_CAR_UPDATE_NONE',
			data: req.body
		});	

	APP.models.mysql.easy.car.update(params.dataUpdate, params.dataQuery).then(result => {							
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_CAR_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'CAR_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_CAR_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_CAR_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'car'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.car_id = req.body.id;
	if (req.body.car_id) params.where.car_id = req.body.car_id;

	APP.models.mysql.easy.car.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_CAR_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'CAR_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'car'
		});
	});
};