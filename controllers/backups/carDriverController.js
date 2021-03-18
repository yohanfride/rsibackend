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
	var query = {}, car = {}, driver={};
	query.where = {};
	if(req.body.take)
		query.limit = parseInt(req.body.take);
	query.offset = parseInt(req.body.skip ? req.body.skip : 0);
	query.order = [];
	if (req.body.id) query.where.car_driver_id = req.body.id;
	if (req.body.car_driver_id) query.where.car_driver_id = req.body.car_driver_id;

	if (req.body.car_id) query.where.car_id = req.body.car_id;
	if (req.body.driver_id) query.where.driver_id = req.body.driver_id;
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.sector) query.where.sector = req.body.sector;

	if (req.body.vehicle_number) car.vehicle_number = { [Op.like] : '%'+req.body.vehicle_number+'%' };
	if (req.body.stnk) car.stnk = req.body.stnk;
	if (req.body.username) driver.username = req.body.username;
	if (req.body.name) driver.name = { [Op.like] : '%'+req.body.name+'%' };

	if (req.body.car_km_start) driver.car_km_start = req.body.car_km_start;
	if (req.body.car_km_end) driver.car_km_end = req.body.car_km_end;
	if (req.body.car_total_km) driver.car_total_km = req.body.car_total_km;
	if (req.body.car_tank_start) driver.car_tank_start = req.body.car_tank_start;
	if (req.body.car_tank_end) driver.car_tank_end = req.body.car_tank_end;

	if (req.body.fuel) car.fuel = req.body.fuel;

	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}
	if ( req.body.str_date_finish && req.body.end_date_finish ){
		query.where.date_finish = {
	        [Op.between]: [req.body.str_date_finish, req.body.end_date_finish]
	    }
	}
    
	if ( req.body.nearest ){
		query.attributes = ['car_id','driver_id','car_driver_id', 'car.postion_lat', 'car.postion_lng','car.vehicle_number',
							[Sequelize.literal('ST_DISTANCE(point('+req.body.pointLat+','+req.body.pointLng+') ,point(car.postion_lat,car.postion_lng) )'), 'distance'] ]; 
	    //query.raw = true;
	    query.order = Sequelize.literal('distance ASC');	
	} 

	APP.models.mysql.easy.cardriver.belongsTo(APP.models.mysql.easy.car, {foreignKey : 'car_id',targetKey: 'car_id'});	
	APP.models.mysql.easy.cardriver.belongsTo(APP.models.mysql.easy.driver, {foreignKey : 'driver_id',targetKey: 'driver_id'});	
	query.include = [
	        { 	model:APP.models.mysql.easy.car,
	           	where:car,         
	           	required:true},
	        { 	model:APP.models.mysql.easy.driver,
	           	where:driver,         
	           	required:true}   	
       	];
	
	APP.models.mysql.easy.cardriver.findAll(query).then((rows) => {
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
			from: 'car driver'
		});
	});
};

exports.count = function (APP, req, callback) {
	var query = {}, car = {}, driver={};
	query.where = {};
	if(req.body.take)
		query.limit = parseInt(req.body.take);
	query.offset = parseInt(req.body.skip ? req.body.skip : 0);
	query.order = [];
	if (req.body.id) query.where.car_driver_id = req.body.id;
	if (req.body.car_driver_id) query.where.car_driver_id = req.body.car_driver_id;

	if (req.body.car_id) query.where.car_id = req.body.car_id;
	if (req.body.driver_id) query.where.driver_id = req.body.driver_id;
	if (req.body.status) query.where.status = req.body.status;

	if (req.body.vehicle_number) car.vehicle_number = { [Op.like] : '%'+req.body.vehicle_number+'%' };
	if (req.body.stnk) car.stnk = req.body.stnk;
	if (req.body.username) driver.username = req.body.username;
	if (req.body.name) driver.name = { [Op.like] : '%'+req.body.name+'%' };
	if (req.body.sector) driver.sector = req.body.sector;

	if (req.body.car_km_start) driver.car_km_start = req.body.car_km_start;
	if (req.body.car_km_end) driver.car_km_end = req.body.car_km_end;
	if (req.body.car_total_km) driver.car_total_km = req.body.car_total_km;
	if (req.body.car_tank_start) driver.car_tank_start = req.body.car_tank_start;
	if (req.body.car_tank_end) driver.car_tank_end = req.body.car_tank_end;


	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}
	if (req.body.sector) driver.sector = req.body.sector;
	if (req.body.fuel) car.fuel = req.body.fuel;ss
	
	if ( req.body.str_date_finish && req.body.end_date_finish ){
		query.where.date_finish = {
	        [Op.between]: [req.body.str_date_finish, req.body.end_date_finish]
	    }
	}
	APP.models.mysql.easy.cardriver.count(query).then((rows) => {
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
			from: 'car driver'
		});
	});
};

exports.insert = function (APP, req, callback) {		
	var params = {				
		car_driver_id:req.body.car_driver_id,
		car_id:req.body.car_id,
		driver_id:req.body.driver_id,						
		date_add:req.body.date_add,
		date_finish:req.body.date_finish,
		status:req.body.status,		
		sector:req.body.sector,
		car_km_start:req.body.car_km_start,
		car_km_end:req.body.car_km_end,
		car_total_km:req.body.car_total_km,
		car_tank_start:req.body.car_tank_start,
		car_tank_end:req.body.car_tank_end
	};	
	APP.models.mysql.easy.cardriver.build(params).save().then(result => {				
		return callback(null, {
			code: 'CAR_DRIVER_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_CAR_DRIVER_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_CAR_DRIVER_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'car driver'
		});
	});

};

exports.update = function (APP, req, callback) {		
	var params = {};		
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};									
	if (req.body.dataQuery.id) params.dataQuery.where.car_driver_id = req.body.dataQuery.id;
	if (req.body.dataQuery.car_driver_id) params.dataQuery.where.car_driver_id = req.body.dataQuery.car_driver_id;

	if (req.body.dataUpdate.car_id) params.dataUpdate.car_id = req.body.dataUpdate.car_id;
	if (req.body.dataUpdate.driver_id) params.dataUpdate.driver_id = req.body.dataUpdate.driver_id;
	if (req.body.dataUpdate.status) params.dataUpdate.status = req.body.dataUpdate.status;
	if (req.body.dataUpdate.status == 0) params.dataUpdate.status = req.body.dataUpdate.status;

	if (req.body.dataUpdate.date_finish) params.dataUpdate.date_finish = req.body.dataUpdate.date_finish;
	if (req.body.dataUpdate.sector) params.dataUpdate.sector = req.body.dataUpdate.sector;

	if (req.body.dataUpdate.car_km_start) params.dataUpdate.car_km_start = req.body.dataUpdate.car_km_start;
	if (req.body.dataUpdate.car_km_end) params.dataUpdate.car_km_end = req.body.dataUpdate.car_km_end;
	if (req.body.dataUpdate.car_total_km) params.dataUpdate.car_total_km = req.body.dataUpdate.car_total_km;
	if (req.body.dataUpdate.car_tank_start) params.dataUpdate.car_tank_start = req.body.dataUpdate.car_tank_start;
	if (req.body.dataUpdate.car_tank_end) params.dataUpdate.car_tank_end = req.body.dataUpdate.car_tank_end;
	
	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_CAR_DRIVER_UPDATE_NONE',
			data: req.body
		});	

	APP.models.mysql.easy.cardriver.update(params.dataUpdate, params.dataQuery).then(result => {							
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_CAR_DRIVER_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'CAR_DRIVER_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_CAR_DRIVER_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_CAR_DRIVER_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'car driver'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.car_driver_id = req.body.id;
	if (req.body.car_driver_id) params.where.car_driver_id = req.body.car_driver_id;

	APP.models.mysql.easy.cardriver.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_CAR_DRIVER_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'CAR_DRIVER_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'car driver'
		});
	});
};