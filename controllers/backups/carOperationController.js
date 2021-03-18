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
	if (req.body.id) query.where.car_operation_id = req.body.id;
	if (req.body.car_operation_id) query.where.car_operation_id = req.body.car_operation_id;
	if (req.body.car_id) query.where.car_id = req.body.car_id;

	if (req.body.start_km) query.where.start_km = req.body.start_km;
	if (req.body.current_km) query.where.current_km = req.body.current_km;
	if (req.body.count_km) query.where.count_km = req.body.count_km;

	if (req.body.assurancce) query.where.assurancce = req.body.assurancce;
	if (req.body.assurancce_reminder) query.where.assurancce_reminder = req.body.assurancce_reminder;
	if (req.body.stnk) query.where.stnk = req.body.stnk;
	if (req.body.stnk_reminder) query.where.stnk_reminder = req.body.stnk_reminder;
	if (req.body.vehicle_tax) query.where.vehicle_tax = req.body.vehicle_tax;
	if (req.body.vehicle_tax_reminder) query.where.vehicle_tax_reminder = req.body.vehicle_tax_reminder;
	if (req.body.keur_dllajr) query.where.keur_dllajr = req.body.keur_dllajr;
	if (req.body.keur_dllajr_reminder) query.where.keur_dllajr_reminder = req.body.keur_dllajr_reminder;
	if (req.body.tank_callibration) query.where.tank_callibration = req.body.tank_callibration;
	if (req.body.tank_callibration_reminder) query.where.tank_callibration_reminder = req.body.tank_callibration_reminder;
	if (req.body.b3_truck_certification) query.where.b3_truck_certification = req.body.b3_truck_certification;
	if (req.body.b3_truck_certification_reminder) query.where.b3_truck_certification_reminder = req.body.b3_truck_certification_reminder;
	if (req.body.b3_driver_certification) query.where.b3_driver_certification = req.body.b3_driver_certification;
	if (req.body.b3_driver_certification_reminder) query.where.b3_driver_certification_reminder = req.body.b3_driver_certification_reminder;
	
	if (req.body.oil_filter) query.where.oil_filter = req.body.oil_filter;
	if (req.body.oil_filter_reminder) query.where.oil_filter_reminder = req.body.oil_filter_reminder;
	if (req.body.oil_gasket) query.where.oil_gasket = req.body.oil_gasket;
	if (req.body.oil_gasket_reminder) query.where.oil_gasket_reminder = req.body.oil_gasket_reminder;
	if (req.body.busi_4pcs) query.where.busi_4pcs = req.body.busi_4pcs;
	if (req.body.busi_4pcs_reminder) query.where.busi_4pcs_reminder = req.body.busi_4pcs_reminder;
	if (req.body.differential_oil) query.where.differential_oil = req.body.differential_oil;
	if (req.body.differential_oil_reminder) query.where.differential_oil_reminder = req.body.differential_oil_reminder;
	if (req.body.transmission_oil) query.where.transmission_oil = req.body.transmission_oil;
	if (req.body.transmission_oil_reminder) query.where.transmission_oil_reminder = req.body.transmission_oil_reminder;
	if (req.body.air_filter) query.where.air_filter = req.body.air_filter;
	if (req.body.air_filter_reminder) query.where.air_filter_reminder = req.body.air_filter_reminder;
	if (req.body.brake_fluid) query.where.brake_fluid = req.body.brake_fluid;
	if (req.body.brake_fluid_reminder) query.where.brake_fluid_reminder = req.body.brake_fluid_reminder;
	
	if (req.body.engine_coolant) query.where.engine_coolant = req.body.engine_coolant;
	if (req.body.engine_coolant_reminder) query.where.engine_coolant_reminder = req.body.engine_coolant_reminder;
	if (req.body.grease) query.where.grease = req.body.grease;
	if (req.body.grease_reminder) query.where.grease_reminder = req.body.grease_reminder;
	if (req.body.driving_tires) query.where.driving_tires = req.body.driving_tires;
	if (req.body.driving_tires_reminder) query.where.driving_tires_reminder = req.body.driving_tires_reminder;
	if (req.body.steering_wheel) query.where.steering_wheel = req.body.steering_wheel;
	if (req.body.steering_wheel_reminder) query.where.steering_wheel_reminder = req.body.steering_wheel_reminder;
	if (req.body.brake_canvas) query.where.brake_canvas = req.body.brake_canvas;
	if (req.body.brake_canvas_reminder) query.where.brake_canvas_reminder = req.body.brake_canvas_reminder;
	if (req.body.clutch_canvas) query.where.clutch_canvas = req.body.clutch_canvas;
	if (req.body.clutch_canvas_reminder) query.where.clutch_canvas_reminder = req.body.clutch_canvas_reminder;
	
	APP.models.mysql.easy.caroperation.findAll(query).then((rows) => {
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
			from: 'car operation'
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
	if (req.body.id) query.where.car_operation_id = req.body.id;
	if (req.body.car_operation_id) query.where.car_operation_id = req.body.car_operation_id;
	if (req.body.car_id) query.where.car_id = req.body.car_id;

	if (req.body.start_km) query.where.start_km = req.body.start_km;
	if (req.body.current_km) query.where.current_km = req.body.current_km;
	if (req.body.count_km) query.where.count_km = req.body.count_km;

	if (req.body.assurancce) query.where.assurancce = req.body.assurancce;
	if (req.body.assurancce_reminder) query.where.assurancce_reminder = req.body.assurancce_reminder;
	if (req.body.stnk) query.where.stnk = req.body.stnk;
	if (req.body.stnk_reminder) query.where.stnk_reminder = req.body.stnk_reminder;
	if (req.body.vehicle_tax) query.where.vehicle_tax = req.body.vehicle_tax;
	if (req.body.vehicle_tax_reminder) query.where.vehicle_tax_reminder = req.body.vehicle_tax_reminder;
	if (req.body.keur_dllajr) query.where.keur_dllajr = req.body.keur_dllajr;
	if (req.body.keur_dllajr_reminder) query.where.keur_dllajr_reminder = req.body.keur_dllajr_reminder;
	if (req.body.tank_callibration) query.where.tank_callibration = req.body.tank_callibration;
	if (req.body.tank_callibration_reminder) query.where.tank_callibration_reminder = req.body.tank_callibration_reminder;
	if (req.body.b3_truck_certification) query.where.b3_truck_certification = req.body.b3_truck_certification;
	if (req.body.b3_truck_certification_reminder) query.where.b3_truck_certification_reminder = req.body.b3_truck_certification_reminder;
	if (req.body.b3_driver_certification) query.where.b3_driver_certification = req.body.b3_driver_certification;
	if (req.body.b3_driver_certification_reminder) query.where.b3_driver_certification_reminder = req.body.b3_driver_certification_reminder;
	
	if (req.body.oil_filter) query.where.oil_filter = req.body.oil_filter;
	if (req.body.oil_filter_reminder) query.where.oil_filter_reminder = req.body.oil_filter_reminder;
	if (req.body.oil_gasket) query.where.oil_gasket = req.body.oil_gasket;
	if (req.body.oil_gasket_reminder) query.where.oil_gasket_reminder = req.body.oil_gasket_reminder;
	if (req.body.busi_4pcs) query.where.busi_4pcs = req.body.busi_4pcs;
	if (req.body.busi_4pcs_reminder) query.where.busi_4pcs_reminder = req.body.busi_4pcs_reminder;
	if (req.body.differential_oil) query.where.differential_oil = req.body.differential_oil;
	if (req.body.differential_oil_reminder) query.where.differential_oil_reminder = req.body.differential_oil_reminder;
	if (req.body.transmission_oil) query.where.transmission_oil = req.body.transmission_oil;
	if (req.body.transmission_oil_reminder) query.where.transmission_oil_reminder = req.body.transmission_oil_reminder;
	if (req.body.air_filter) query.where.air_filter = req.body.air_filter;
	if (req.body.air_filter_reminder) query.where.air_filter_reminder = req.body.air_filter_reminder;
	if (req.body.brake_fluid) query.where.brake_fluid = req.body.brake_fluid;
	if (req.body.brake_fluid_reminder) query.where.brake_fluid_reminder = req.body.brake_fluid_reminder;
	
	if (req.body.engine_coolant) query.where.engine_coolant = req.body.engine_coolant;
	if (req.body.engine_coolant_reminder) query.where.engine_coolant_reminder = req.body.engine_coolant_reminder;
	if (req.body.grease) query.where.grease = req.body.grease;
	if (req.body.grease_reminder) query.where.grease_reminder = req.body.grease_reminder;
	if (req.body.driving_tires) query.where.driving_tires = req.body.driving_tires;
	if (req.body.driving_tires_reminder) query.where.driving_tires_reminder = req.body.driving_tires_reminder;
	if (req.body.steering_wheel) query.where.steering_wheel = req.body.steering_wheel;
	if (req.body.steering_wheel_reminder) query.where.steering_wheel_reminder = req.body.steering_wheel_reminder;
	if (req.body.brake_canvas) query.where.brake_canvas = req.body.brake_canvas;
	if (req.body.brake_canvas_reminder) query.where.brake_canvas_reminder = req.body.brake_canvas_reminder;
	if (req.body.clutch_canvas) query.where.clutch_canvas = req.body.clutch_canvas;
	if (req.body.clutch_canvas_reminder) query.where.clutch_canvas_reminder = req.body.clutch_canvas_reminder;

	APP.models.mysql.easy.caroperation.count(query).then((rows) => {
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
			from: 'car operation'
		});
	});
};

exports.insert = function (APP, req, callback) {			
	var params = {				
		car_id:req.body.car_id,
		start_km:req.body.start_km,
		current_km:req.body.current_km,				
		count_km:req.body.count_km,				
		assurancce:req.body.assurancce,
		assurancce_reminder:req.body.assurancce_reminder,				
		stnk:req.body.stnk,
		stnk_reminder:req.body.stnk_reminder,				
		vehicle_tax:req.body.vehicle_tax,
		vehicle_tax_reminder:req.body.vehicle_tax_reminder,				
		keur_dllajr:req.body.keur_dllajr,
		keur_dllajr_reminder:req.body.keur_dllajr_reminder,				
		tank_callibration:req.body.tank_callibration,
		tank_callibration_reminder:req.body.tank_callibration_reminder,				
		b3_truck_certification:req.body.b3_truck_certification,
		b3_truck_certification_reminder:req.body.b3_truck_certification_reminder,				
		b3_driver_certification:req.body.b3_driver_certification,
		b3_driver_certification_reminder:req.body.b3_driver_certification_reminder,				
		oil_filter:req.body.oil_filter,
		oil_filter_reminder:req.body.oil_filter_reminder,				
		oil_gasket:req.body.oil_gasket,
		oil_gasket_reminder:req.body.oil_gasket_reminder,				
		machine_oil:req.body.machine_oil,
		machine_oil_reminder:req.body.machine_oil_reminder,				
		busi_4pcs:req.body.busi_4pcs,
		busi_4pcs_reminder:req.body.busi_4pcs_reminder,				
		differential_oil:req.body.differential_oil,
		differential_oil_reminder:req.body.differential_oil_reminder,				
		transmission_oil:req.body.transmission_oil,
		transmission_oil_reminder:req.body.transmission_oil_reminder,				
		air_filter:req.body.air_filter,
		air_filter_reminder:req.body.air_filter_reminder,				
		brake_fluid:req.body.brake_fluid,
		brake_fluid_reminder:req.body.brake_fluid_reminder,				
		engine_coolant:req.body.engine_coolant,
		engine_coolant_reminder:req.body.engine_coolant_reminder,				
		grease:req.body.grease,
		grease_reminder:req.body.grease_reminder,				
		driving_tires:req.body.driving_tires,
		driving_tires_reminder:req.body.driving_tires_reminder,				
		steering_wheel:req.body.steering_wheel,
		steering_wheel_reminder:req.body.steering_wheel_reminder,				
		brake_canvas:req.body.brake_canvas,
		brake_canvas_reminder:req.body.brake_canvas_reminder,				
		clutch_canvas:req.body.clutch_canvas,
		clutch_canvas_reminder:req.body.clutch_canvas_reminder
	};	
	APP.models.mysql.easy.caroperation.build(params).save().then(result => {				
		return callback(null, {
			code: 'CAR_OPERATION_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_CAR_OPERATION_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_CAR_OPERATION_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'car operation'
		});
	});

};

exports.update = function (APP, req, callback) {		
	var params = {};		
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};									
	if (req.body.dataQuery.id) params.dataQuery.where.car_operation_id = req.body.dataQuery.id;
	if (req.body.dataQuery.car_operation_id) params.dataQuery.where.car_operation_id = req.body.dataQuery.car_operation_id;
	if (req.body.dataQuery.car_id) params.dataQuery.where.car_id = req.body.dataQuery.car_id;

		
	if (req.body.dataUpdate.start_km) params.dataUpdate.start_km = req.body.dataUpdate.start_km;
	if (req.body.dataUpdate.current_km) params.dataUpdate.current_km = req.body.dataUpdate.current_km;
	if (req.body.dataUpdate.count_km) params.dataUpdate.count_km = req.body.dataUpdate.count_km;

	if (req.body.dataUpdate.assurancce) params.dataUpdate.assurancce = req.body.dataUpdate.assurancce;
	if (req.body.dataUpdate.assurancce_reminder) params.dataUpdate.assurancce_reminder = req.body.dataUpdate.assurancce_reminder;
	if (req.body.dataUpdate.stnk) params.dataUpdate.stnk = req.body.dataUpdate.stnk;
	if (req.body.dataUpdate.stnk_reminder) params.dataUpdate.stnk_reminder = req.body.dataUpdate.stnk_reminder;
	if (req.body.dataUpdate.vehicle_tax) params.dataUpdate.vehicle_tax = req.body.dataUpdate.vehicle_tax;
	if (req.body.dataUpdate.vehicle_tax_reminder) params.dataUpdate.vehicle_tax_reminder = req.body.dataUpdate.vehicle_tax_reminder;
	if (req.body.dataUpdate.keur_dllajr) params.dataUpdate.keur_dllajr = req.body.dataUpdate.keur_dllajr;
	if (req.body.dataUpdate.keur_dllajr_reminder) params.dataUpdate.keur_dllajr_reminder = req.body.dataUpdate.keur_dllajr_reminder;
	if (req.body.dataUpdate.tank_callibration) params.dataUpdate.tank_callibration = req.body.dataUpdate.tank_callibration;
	if (req.body.dataUpdate.tank_callibration_reminder) params.dataUpdate.tank_callibration_reminder = req.body.dataUpdate.tank_callibration_reminder;
	if (req.body.dataUpdate.b3_truck_certification) params.dataUpdate.b3_truck_certification = req.body.dataUpdate.b3_truck_certification;
	if (req.body.dataUpdate.b3_truck_certification_reminder) params.dataUpdate.b3_truck_certification_reminder = req.body.dataUpdate.b3_truck_certification_reminder;
	if (req.body.dataUpdate.b3_driver_certification) params.dataUpdate.b3_driver_certification = req.body.dataUpdate.b3_driver_certification;
	if (req.body.dataUpdate.b3_driver_certification_reminder) params.dataUpdate.b3_driver_certification_reminder = req.body.dataUpdate.b3_driver_certification_reminder;
	
	if (req.body.dataUpdate.oil_filter) params.dataUpdate.oil_filter = req.body.dataUpdate.oil_filter;
	if (req.body.dataUpdate.oil_filter_reminder) params.dataUpdate.oil_filter_reminder = req.body.dataUpdate.oil_filter_reminder;
	if (req.body.dataUpdate.oil_gasket) params.dataUpdate.oil_gasket = req.body.dataUpdate.oil_gasket;
	if (req.body.dataUpdate.oil_gasket_reminder) params.dataUpdate.oil_gasket_reminder = req.body.dataUpdate.oil_gasket_reminder;
	if (req.body.dataUpdate.busi_4pcs) params.dataUpdate.busi_4pcs = req.body.dataUpdate.busi_4pcs;
	if (req.body.dataUpdate.busi_4pcs_reminder) params.dataUpdate.busi_4pcs_reminder = req.body.dataUpdate.busi_4pcs_reminder;
	if (req.body.dataUpdate.differential_oil) params.dataUpdate.differential_oil = req.body.dataUpdate.differential_oil;
	if (req.body.dataUpdate.differential_oil_reminder) params.dataUpdate.differential_oil_reminder = req.body.dataUpdate.differential_oil_reminder;
	if (req.body.dataUpdate.transmission_oil) params.dataUpdate.transmission_oil = req.body.dataUpdate.transmission_oil;
	if (req.body.dataUpdate.transmission_oil_reminder) params.dataUpdate.transmission_oil_reminder = req.body.dataUpdate.transmission_oil_reminder;
	if (req.body.dataUpdate.air_filter) params.dataUpdate.air_filter = req.body.dataUpdate.air_filter;
	if (req.body.dataUpdate.air_filter_reminder) params.dataUpdate.air_filter_reminder = req.body.dataUpdate.air_filter_reminder;
	if (req.body.dataUpdate.brake_fluid) params.dataUpdate.brake_fluid = req.body.dataUpdate.brake_fluid;
	if (req.body.dataUpdate.brake_fluid_reminder) params.dataUpdate.brake_fluid_reminder = req.body.dataUpdate.brake_fluid_reminder;
	
	if (req.body.dataUpdate.engine_coolant) params.dataUpdate.engine_coolant = req.body.dataUpdate.engine_coolant;
	if (req.body.dataUpdate.engine_coolant_reminder) params.dataUpdate.engine_coolant_reminder = req.body.dataUpdate.engine_coolant_reminder;
	if (req.body.dataUpdate.grease) params.dataUpdate.grease = req.body.dataUpdate.grease;
	if (req.body.dataUpdate.grease_reminder) params.dataUpdate.grease_reminder = req.body.dataUpdate.grease_reminder;
	if (req.body.dataUpdate.driving_tires) params.dataUpdate.driving_tires = req.body.dataUpdate.driving_tires;
	if (req.body.dataUpdate.driving_tires_reminder) params.dataUpdate.driving_tires_reminder = req.body.dataUpdate.driving_tires_reminder;
	if (req.body.dataUpdate.steering_wheel) params.dataUpdate.steering_wheel = req.body.dataUpdate.steering_wheel;
	if (req.body.dataUpdate.steering_wheel_reminder) params.dataUpdate.steering_wheel_reminder = req.body.dataUpdate.steering_wheel_reminder;
	if (req.body.dataUpdate.brake_canvas) params.dataUpdate.brake_canvas = req.body.dataUpdate.brake_canvas;
	if (req.body.dataUpdate.brake_canvas_reminder) params.dataUpdate.brake_canvas_reminder = req.body.dataUpdate.brake_canvas_reminder;
	if (req.body.dataUpdate.clutch_canvas) params.dataUpdate.clutch_canvas = req.body.dataUpdate.clutch_canvas;
	if (req.body.dataUpdate.clutch_canvas_reminder) params.dataUpdate.clutch_canvas_reminder = req.body.dataUpdate.clutch_canvas_reminder;


	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_CAR_OPERATION_UPDATE_NONE',
			data: req.body
		});	

	APP.models.mysql.easy.caroperation.update(params.dataUpdate, params.dataQuery).then(result => {							
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_CAR_OPERATION_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'CAR_OPERATION_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_CAR_OPERATION_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_CAR_OPERATION_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'car operation'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.car_operation_id = req.body.id;
	if (req.body.car_operation_id) params.where.car_operation_id = req.body.car_operation_id;
	if (req.body.car_id) params.where.car_id = req.body.car_id;

	APP.models.mysql.easy.caroperation.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_CAR_OPERATION_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'CAR_OPERATION_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'car operation'
		});
	});
};