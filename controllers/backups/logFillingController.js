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
	if (req.body.id) query.where.log_filling_id = req.body.id;
	if (req.body.log_filling_id) query.where.log_filling_id = req.body.log_filling_id;

	if (req.body.driver_id) query.where.driver_id = req.body.driver_id;
	if (req.body.car_id) query.where.car_id = req.body.car_id;
	
	if (req.body.total_fuel) query.where.total_fuel = req.body.total_fuel;
	if (req.body.fuel_type) query.where.fuel_type = req.body.fuel_type;
	if (req.body.total_before_filling) query.where.total_before_filling = req.body.total_before_filling;
	if (req.body.total_after_filling) query.where.total_after_filling = req.body.total_after_filling;

	if (req.body.note) query.where.note = { [Op.like] : '%'+req.body.note+'%' };
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.status==0) query.where.status = req.body.status;

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
	
	console.log(req.body);
	if ( req.body.detail ){
       	APP.models.mysql.easy.logfilling.belongsTo(APP.models.mysql.easy.car, {foreignKey : 'car_id',targetKey: 'car_id'});	
		APP.models.mysql.easy.logfilling.belongsTo(APP.models.mysql.easy.driver, {foreignKey : 'driver_id',targetKey: 'driver_id'});	
		query.include = [
	        { 	model:APP.models.mysql.easy.car,
	           	where:{},         
	           	required:true},
	        { 	model:APP.models.mysql.easy.driver,
	           	where:{},         
	           	required:true}   	
       	];
	}

	APP.models.mysql.easy.logfilling.findAll(query).then((rows) => {
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
			from: 'Log Filling'
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
	if (req.body.id) query.where.log_filling_id = req.body.id;
	if (req.body.log_filling_id) query.where.log_filling_id = req.body.log_filling_id;

	if (req.body.driver_id) query.where.driver_id = req.body.driver_id;
	if (req.body.car_id) query.where.car_id = req.body.car_id;
	
	if (req.body.total_fuel) query.where.total_fuel = req.body.total_fuel;
	if (req.body.fuel_type) query.where.fuel_type = req.body.fuel_type;
	if (req.body.total_before_filling) query.where.total_before_filling = req.body.total_before_filling;
	if (req.body.total_after_filling) query.where.total_after_filling = req.body.total_after_filling;

	if (req.body.note) query.where.note = { [Op.like] : '%'+req.body.note+'%' };
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.status==0) query.where.status = req.body.status;

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

	APP.models.mysql.easy.logfilling.count(query).then((rows) => {
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
			from: 'Log Filling'
		});
	});
};

exports.insert = function (APP, req, callback) {		
	var params = {				
		driver_id:req.body.driver_id,
		car_id:req.body.car_id,
		total_fuel:req.body.total_fuel,				
		fuel_type:req.body.fuel_type,					
		total_before_filling:req.body.total_before_filling,				
		total_after_filling:req.body.total_after_filling,			
		date_add:req.body.date_add,
		date_finish:req.body.date_finish,
		note:req.body.note,
		status:req.body.status
	};	
	APP.models.mysql.easy.logfilling.build(params).save().then(result => {				
		return callback(null, {
			code: 'LOG_FILLING_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_LOG_FILLING_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_LOG_FILLING_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Log Filling'
		});
	});

};

exports.update = function (APP, req, callback) {		
	var params = {};		
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};									
	if (req.body.dataQuery.id) params.dataQuery.where.log_filling_id = req.body.dataQuery.id;
	if (req.body.dataQuery.log_filling_id) params.dataQuery.where.log_filling_id = req.body.dataQuery.log_filling_id;
	
	if (req.body.dataUpdate.driver_id) params.dataUpdate.driver_id = req.body.dataUpdate.driver_id;
	if (req.body.dataUpdate.car_id) params.dataUpdate.car_id = req.body.dataUpdate.car_id;

	if (req.body.dataUpdate.total_fuel) params.dataUpdate.total_fuel = req.body.dataUpdate.total_fuel;
	if (req.body.dataUpdate.fuel_type) params.dataUpdate.fuel_type = req.body.dataUpdate.fuel_type;
	if (req.body.dataUpdate.total_before_filling) params.dataUpdate.total_before_filling = req.body.dataUpdate.total_before_filling;
	if (req.body.dataUpdate.total_after_filling) params.dataUpdate.total_after_filling = req.body.dataUpdate.total_after_filling;
	
	if (req.body.dataUpdate.date_finish) params.dataUpdate.date_finish = req.body.dataUpdate.date_finish;
	if (req.body.dataUpdate.status) params.dataUpdate.status = req.body.dataUpdate.status;
	if (req.body.dataUpdate.status == 0) params.dataUpdate.status = req.body.dataUpdate.status;
	if (req.body.dataUpdate.note) params.dataUpdate.note = req.body.dataUpdate.note;

	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_LOG_FILLING_UPDATE_NONE',
			data: req.body
		});	

	APP.models.mysql.easy.logfilling.update(params.dataUpdate, params.dataQuery).then(result => {							
		console.log(result);
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_LOG_FILLING_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'LOG_FILLING_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_LOG_FILLING_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_LOG_FILLING_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Log Filling'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.log_filling_id = req.body.id;
	if (req.body.log_filling_id) params.where.log_filling_id = req.body.log_filling_id;

	APP.models.mysql.easy.logfilling.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_LOG_FILLING_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'LOG_FILLING_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Log Filling'
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
	if (req.body.id) query.where.log_filling_id = req.body.id;
	if (req.body.log_filling_id) query.where.log_filling_id = req.body.log_filling_id;

	if (req.body.driver_id) query.where.driver_id = req.body.driver_id;
	if (req.body.car_id) query.where.car_id = req.body.car_id;
	
	if (req.body.total_fuel) query.where.total_fuel = req.body.total_fuel;
	if (req.body.fuel_type) query.where.fuel_type = req.body.fuel_type;
	if (req.body.total_before_filling) query.where.total_before_filling = req.body.total_before_filling;
	if (req.body.total_after_filling) query.where.total_after_filling = req.body.total_after_filling;

	if (req.body.note) query.where.note = { [Op.like] : '%'+req.body.note+'%' };
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.status==0) query.where.status = req.body.status;

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
	
	if( req.body.groupby ){
		if(req.body.groupby == 'fuel_type'){
			query.attributes = ['fuel_type',[Sequelize.fn('sum', Sequelize.col('total_fuel')), 'total_fuel'],[Sequelize.fn('sum', Sequelize.col('pay')), 'total_income']]; 
			query.group = ['transaction.fuel_type'];
		    query.raw = true;
		    query.order = Sequelize.literal('fuel_type DESC');
		}
		if(req.body.groupby == 'date'){
			query.attributes = [ [Sequelize.fn('date', Sequelize.col('date_add')), 'date'], [Sequelize.fn('count', Sequelize.col('log_filling_id')), 'total_item'],[Sequelize.fn('sum', Sequelize.col('pay')), 'total_income']]; 
			query.group = [Sequelize.fn('date', Sequelize.col('date_add'))];
		    query.raw = true;
		    query.order = Sequelize.literal('date ASC');
		}
		if(req.body.groupby == 'car'){
			query.attributes = [ [Sequelize.fn('count', Sequelize.col('log_filling_id')), 'total_item'],[Sequelize.fn('sum', Sequelize.col('pay')), 'total_income'],
								 [Sequelize.fn('sum', Sequelize.col('total_fuel')), 'total_fuel'],'car_id' ]; 
			query.group = ['car_id'];
		    query.raw = true;
		    query.order = Sequelize.literal('car_id DESC');
		}
		if(req.body.groupby == 'hours'){
			if(req.body.str_date){
				var dateonly = req.body.str_date.split("T")[0];
			} else {
				var date = new Date();
				var dateonly = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
					.toISOString()
					.split("T")[0];
			}
			var hours = new Date().getHours();
			console.log(hours);
			console.log("-----------");
			query.attributes = [ 
				[Sequelize.fn('date', Sequelize.col('date_add')), 'date'],
				[Sequelize.literal('( SELECT SUM(pay) from transaction where status=1 and DATE(date_add) = "'+dateonly+'" and HOUR(CONVERT_TZ(date_add,"+00:00","+7:00")) = 0 )'), '00_01'],
				[Sequelize.literal('( SELECT COUNT(pay) from transaction where status=1 and DATE(date_add) = "'+dateonly+'" and HOUR(CONVERT_TZ(date_add,"+00:00","+7:00")) = 0 )'), '00_01_count'],
				[Sequelize.literal('( SELECT SUM(total_fuel) from transaction where status=1 and DATE(date_add) = "'+dateonly+'" and HOUR(CONVERT_TZ(date_add,"+00:00","+7:00")) = 0 )'), '00_01_fuel']  
			];
			var n=4;
			for(var i=1; i<=hours; i++){
				query.attributes[n++] = [ Sequelize.literal('( SELECT SUM(pay) from transaction where status=1 and DATE(date_add) = "'+dateonly+'" and HOUR(CONVERT_TZ(date_add,"+00:00","+7:00")) BETWEEN 0 AND '+i+'  )'), (('0' + i).slice(-2))+'_00'];  
				query.attributes[n++] = [ Sequelize.literal('( SELECT COUNT(pay) from transaction where status=1 and DATE(date_add) = "'+dateonly+'" and HOUR(CONVERT_TZ(date_add,"+00:00","+7:00")) BETWEEN 0 AND '+i+'  )'), (('0' + i).slice(-2))+'_00_count'];  
				query.attributes[n++] = [ Sequelize.literal('( SELECT SUM(total_fuel) from transaction where status=1 and DATE(date_add) = "'+dateonly+'" and HOUR(CONVERT_TZ(date_add,"+00:00","+7:00")) BETWEEN 0 AND '+i+'  )'), (('0' + i).slice(-2))+'_00_fuel'];  
			}			
			query.group = [Sequelize.fn('date', Sequelize.col('date_add'))];
		    query.raw = true;
		    query.order = Sequelize.literal('date ASC'); 
		}
	}

	APP.models.mysql.easy.logfilling.findAll(query).then((rows) => {
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
			from: 'Log Filling'
		});
	});
};