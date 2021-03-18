"use strict";
const async = require('async');
const md5 = require('md5');
const moment = require('moment');
const microtime = require('microtime');
var email = require('../functions/email.js');
var encryption = require('../functions/encryption.js');
var validation = require('../functions/validation.js');
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
	if (req.body.id) query.where.transaction_id = req.body.id;
	if (req.body.transaction_id) query.where.transaction_id = req.body.transaction_id;

	if (req.body.customer_id) query.where.customer_id = req.body.customer_id;
	if (req.body.driver_id) query.where.driver_id = req.body.driver_id;
	if (req.body.car_id) query.where.car_id = req.body.car_id;
	if (req.body.transaction_code) query.where.transaction_code = req.body.transaction_code;
	
	if (req.body.total_fuel) query.where.total_fuel = req.body.total_fuel;
	if (req.body.fuel_type) query.where.fuel_type = req.body.fuel_type;
	if (req.body.price) query.where.price = req.body.price;
	if (req.body.pay) query.where.pay = req.body.pay;
	if (req.body.discount) query.where.discount = req.body.discount;
	if (req.body.tax) query.where.tax = req.body.tax;
	
	if (req.body.location_lat) query.where.location_lat = req.body.location_lat;
	if (req.body.location_lng) query.where.location_lng = req.body.location_lng;
	if (req.body.location_address) query.where.location_address = { [Op.like] : '%'+req.body.location_address+'%' };
	if (req.body.location_label) query.where.location_label = req.body.location_label;
	if (req.body.sector) query.where.sector = req.body.sector;
	if (req.body.payment_method) query.where.payment_method = req.body.payment_method;
	if (req.body.fcm_device_id) query.where.fcm_device_id = req.body.fcm_device_id;
	
	if (req.body.customer_car) query.where.customer_car = req.body.customer_car;
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.paid) query.where.paid = req.body.paid;
	if (req.body.cancel_by) query.where.cancel_by = req.body.cancel_by;
	if (req.body.cancel_info) query.where.cancel_info = { [Op.like] : '%'+req.body.cancel_info+'%' };

	if (req.body.note) query.where.note = { [Op.like] : '%'+req.body.note+'%' };
	if ("status" in req.body) {
		if (!validation.isArray(req.body.status)) query.where.status = req.body.status;
		else if(req.body.status[0].toLowerCase() == "or") query.where.status = {[Op.or] : req.body.status.slice(1)};
		else if(req.body.status[0].toLowerCase() == "and") query.where.status = {[Op.and] : req.body.status.slice(1)};
	}

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
	if ( req.body.str_date_take && req.body.end_date_take ){
		query.where.date_take_order = {
	        [Op.between]: [req.body.str_date_take, req.body.end_date_take]
	    }
	}
	if ( req.body.str_date_transaction && req.body.end_date_transaction ){
		query.where.date_start_transaction = {
	        [Op.between]: [req.body.str_date_transaction, req.body.end_date_transaction]
	    }
	}
	if ( req.body.str_date_on_location && req.body.end_date_on_location ){
		query.where.date_on_location = {
	        [Op.between]: [req.body.str_date_on_location, req.body.end_date_on_location]
	    }
	}
	if ( req.body.str_date_create_payment && req.body.end_date_create_payment ){
		query.where.date_create_payment = {
	        [Op.between]: [req.body.str_date_create_payment, req.body.end_date_create_payment]
	    }
	}
	if ( req.body.str_date_payment_finish && req.body.end_date_payment_finish ){
		query.where.date_payment_finish = {
	        [Op.between]: [req.body.str_date_payment_finish, req.body.end_date_payment_finish]
	    }
	}
	if ( req.body.booked ){
		query.where.status = {
	        [Op.or]: [0,2,3,4,5]
	    }
	}
	if ( req.body.detail ){
		APP.models.mysql.easy.transaction.belongsTo(APP.models.mysql.easy.customer, {foreignKey : 'customer_id',targetKey: 'customer_id'});	
       	APP.models.mysql.easy.transaction.belongsTo(APP.models.mysql.easy.car, {foreignKey : 'car_id',targetKey: 'car_id'});	
		APP.models.mysql.easy.transaction.belongsTo(APP.models.mysql.easy.driver, {foreignKey : 'driver_id',targetKey: 'driver_id'});	
		query.include = [
	        { 	model:APP.models.mysql.easy.car,
	           	where:{},         
	           	required:true},
	        { 	model:APP.models.mysql.easy.driver,
	           	where:{},         
	           	required:true},
           	{ 	model:APP.models.mysql.easy.customer,
	           	where:{},         
	           	required:true}   	
       	];
	}
	

	APP.models.mysql.easy.transaction.findAll(query).then((rows) => {
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
			from: 'Transaction'
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
	if (req.body.id) query.where.transaction_id = req.body.id;
	if (req.body.transaction_id) query.where.transaction_id = req.body.transaction_id;

	if (req.body.customer_id) query.where.customer_id = req.body.customer_id;
	if (req.body.driver_id) query.where.driver_id = req.body.driver_id;
	if (req.body.car_id) query.where.car_id = req.body.car_id;
	if (req.body.transaction_code) query.where.transaction_code = req.body.transaction_code;
	
	if (req.body.total_fuel) query.where.total_fuel = req.body.total_fuel;
	if (req.body.fuel_type) query.where.fuel_type = req.body.fuel_type;
	if (req.body.price) query.where.price = req.body.price;
	if (req.body.pay) query.where.pay = req.body.pay;
	if (req.body.discount) query.where.discount = req.body.discount;
	if (req.body.tax) query.where.tax = req.body.tax;
	
	if (req.body.location_lat) query.where.location_lat = req.body.location_lat;
	if (req.body.location_lng) query.where.location_lng = req.body.location_lng;
	if (req.body.location_address) query.where.location_address = { [Op.like] : '%'+req.body.location_address+'%' };
	if (req.body.location_label) query.where.location_label = req.body.location_label;
	if (req.body.sector) query.where.sector = req.body.sector;
	if (req.body.customer_car) query.where.customer_car = req.body.customer_car;
	if (req.body.payment_method) query.where.payment_method = req.body.payment_method;
	if (req.body.fcm_device_id) query.where.fcm_device_id = req.body.fcm_device_id;
	
	if (req.body.note) query.where.note = { [Op.like] : '%'+req.body.note+'%' };
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.paid) query.where.paid = req.body.paid;
	if (req.body.cancel_by) query.where.cancel_by = req.body.cancel_by;
	if (req.body.cancel_info) query.where.cancel_info = { [Op.like] : '%'+req.body.cancel_info+'%' };

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
	if ( req.body.str_date_take && req.body.end_date_take ){
		query.where.date_take_order = {
	        [Op.between]: [req.body.str_date_take, req.body.end_date_take]
	    }
	}
	if ( req.body.str_date_transaction && req.body.end_date_transaction ){
		query.where.date_start_transaction = {
	        [Op.between]: [req.body.str_date_transaction, req.body.end_date_transaction]
	    }
	}
	if ( req.body.str_date_on_location && req.body.end_date_on_location ){
		query.where.date_on_location = {
	        [Op.between]: [req.body.str_date_on_location, req.body.end_date_on_location]
	    }
	}

	if ( req.body.str_date_create_payment && req.body.end_date_create_payment ){
		query.where.date_create_payment = {
	        [Op.between]: [req.body.str_date_create_payment, req.body.end_date_create_payment]
	    }
	}
	if ( req.body.str_date_payment_finish && req.body.end_date_payment_finish ){
		query.where.date_payment_finish = {
	        [Op.between]: [req.body.str_date_payment_finish, req.body.end_date_payment_finish]
	    }
	}

	if ( req.body.booked ){
		query.where.status = {
	        [Op.or]: [0,2,3,4,5]
	    }
	}

	APP.models.mysql.easy.transaction.count(query).then((rows) => {
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
			from: 'Transaction'
		});
	});
};

exports.insert = function (APP, req, callback) {		
	var params = {				
		customer_id:req.body.customer_id,
		driver_id:req.body.driver_id,
		car_id:req.body.car_id,
		transaction_code:req.body.transaction_code,
		total_fuel:req.body.total_fuel,				
		fuel_type:req.body.fuel_type,				
		price:req.body.price,				
		pay:req.body.pay,				
		discount:req.body.discount,				
		tax:req.body.tax,				
		location_lat:req.body.location_lat,
		location_lng:req.body.location_lng,		
		location_address:req.body.location_address,
		location_label:req.body.location_label,
		sector:req.body.sector,
		customer_car:req.body.customer_car,
		date_add:req.body.date_add,
		date_finish:req.body.date_finish,
		date_take_order:req.body.date_take_order,
		date_start_transaction:req.body.date_start_transaction,
		date_on_location:req.body.date_on_location,
		date_create_payment:req.body.date_create_payment,
		date_payment_finish:req.body.date_payment_finish,
		note:req.body.note,
		cancel_by:req.body.cancel_by,
		cancel_info:req.body.cancel_info,
		payment_method:req.body.payment_method,
		fcm_device_id:req.body.fcm_device_id,
		status:req.body.status,
		status:req.body.paid
	};	

	APP.models.mysql.easy.transaction.build(params).save().then(result => {				
		return callback(null, {
			code: 'TRANSACTION_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_TRANSACTION_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_TRANSACTION_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Transaction'
		});
	});

};

exports.update = function (APP, req, callback) {		
	var params = {};		
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};									
	if (req.body.dataQuery.id) params.dataQuery.where.transaction_id = req.body.dataQuery.id;
	if (req.body.dataQuery.transaction_id) params.dataQuery.where.transaction_id = req.body.dataQuery.transaction_id;
	
	if (req.body.dataUpdate.customer_id) params.dataUpdate.customer_id = req.body.dataUpdate.customer_id;
	if (req.body.dataUpdate.driver_id) params.dataUpdate.driver_id = req.body.dataUpdate.driver_id;
	if (req.body.dataUpdate.car_id) params.dataUpdate.car_id = req.body.dataUpdate.car_id;
	if (req.body.dataUpdate.transaction_code) params.dataUpdate.transaction_code = req.body.dataUpdate.transaction_code;

	if (req.body.dataUpdate.total_fuel) params.dataUpdate.total_fuel = req.body.dataUpdate.total_fuel;
	if (req.body.dataUpdate.fuel_type) params.dataUpdate.fuel_type = req.body.dataUpdate.fuel_type;
	if (req.body.dataUpdate.price) params.dataUpdate.price = req.body.dataUpdate.price;
	if (req.body.dataUpdate.pay) params.dataUpdate.pay = req.body.dataUpdate.pay;
	if (req.body.dataUpdate.discount) params.dataUpdate.discount = req.body.dataUpdate.discount;
	if (req.body.dataUpdate.tax) params.dataUpdate.tax = req.body.dataUpdate.tax;

	if (req.body.dataUpdate.location_lat) params.dataUpdate.location_lat = req.body.dataUpdate.location_lat;
	if (req.body.dataUpdate.location_lng) params.dataUpdate.location_lng = req.body.dataUpdate.location_lng;
	if (req.body.dataUpdate.location_address) params.dataUpdate.location_address = req.body.dataUpdate.location_address;
	if (req.body.dataUpdate.location_label) params.dataUpdate.location_label = req.body.dataUpdate.location_label;
	if (req.body.dataUpdate.sector) params.dataUpdate.sector = req.body.dataUpdate.sector;
	if (req.body.dataUpdate.customer_car) params.dataUpdate.customer_car = req.body.dataUpdate.customer_car;
	if (req.body.dataUpdate.payment_method) params.dataUpdate.payment_method = req.body.dataUpdate.payment_method;
	if (req.body.dataUpdate.fcm_device_id) params.dataUpdate.fcm_device_id = req.body.dataUpdate.fcm_device_id;

	if (req.body.dataUpdate.date_finish) params.dataUpdate.date_finish = req.body.dataUpdate.date_finish;
	if (req.body.dataUpdate.date_start_transaction) params.dataUpdate.date_start_transaction = req.body.dataUpdate.date_start_transaction;
	if (req.body.dataUpdate.date_on_location) params.dataUpdate.date_on_location = req.body.dataUpdate.date_on_location;
	if (req.body.dataUpdate.date_take_order) params.dataUpdate.date_take_order = req.body.dataUpdate.date_take_order;
	
	if (req.body.dataUpdate.date_create_payment) params.dataUpdate.date_create_payment = req.body.dataUpdate.date_create_payment;
	if (req.body.dataUpdate.date_payment_finish) params.dataUpdate.date_payment_finish = req.body.dataUpdate.date_payment_finish;
	if (req.body.dataUpdate.paid) params.dataUpdate.paid = req.body.dataUpdate.paid;
	
	if (req.body.dataUpdate.status) params.dataUpdate.status = req.body.dataUpdate.status;
	if (req.body.dataUpdate.note) params.dataUpdate.note = req.body.dataUpdate.note;
	if (req.body.dataUpdate.cancel_by) params.dataUpdate.cancel_by = req.body.dataUpdate.cancel_by;
	if (req.body.dataUpdate.cancel_info) params.dataUpdate.cancel_info = req.body.dataUpdate.cancel_info;

	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_TRANSACTION_UPDATE_NONE',
			data: req.body
		});	

	APP.models.mysql.easy.transaction.update(params.dataUpdate, params.dataQuery).then(result => {							
		console.log(result);
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_TRANSACTION_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'TRANSACTION_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_TRANSACTION_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_TRANSACTION_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Transaction'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.transaction_id = req.body.id;
	if (req.body.transaction_id) params.where.transaction_id = req.body.transaction_id;

	APP.models.mysql.easy.transaction.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_TRANSACTION_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'TRANSACTION_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Transaction'
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
	if (req.body.id) query.where.transaction_id = req.body.id;
	if (req.body.transaction_id) query.where.transaction_id = req.body.transaction_id;

	if (req.body.customer_id) query.where.customer_id = req.body.customer_id;
	if (req.body.driver_id) query.where.driver_id = req.body.driver_id;
	if (req.body.car_id) query.where.car_id = req.body.car_id;
	if (req.body.transaction_code) query.where.transaction_code = req.body.transaction_code;
	
	if (req.body.total_fuel) query.where.total_fuel = req.body.total_fuel;
	if (req.body.fuel_type) query.where.fuel_type = req.body.fuel_type;
	if (req.body.price) query.where.price = req.body.price;
	if (req.body.pay) query.where.pay = req.body.pay;
	if (req.body.discount) query.where.discount = req.body.discount;
	if (req.body.tax) query.where.tax = req.body.tax;
	
	if (req.body.location_lat) query.where.location_lat = req.body.location_lat;
	if (req.body.location_lng) query.where.location_lng = req.body.location_lng;
	if (req.body.location_label) query.where.location_label = req.body.location_label;
	if (req.body.sector) query.where.sector = req.body.sector;
	if (req.body.customer_car) query.where.customer_car = req.body.customer_car;
	if (req.body.payment_method) query.where.payment_method = req.body.payment_method;
	if (req.body.fcm_device_id) query.where.fcm_device_id = req.body.fcm_device_id;

	if (req.body.location_address) query.where.location_address = { [Op.like] : '%'+req.body.location_address+'%' };
	if (req.body.note) query.where.note = { [Op.like] : '%'+req.body.note+'%' };
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.paid) query.where.paid = req.body.paid;
	if (req.body.cancel_by) query.where.cancel_by = req.body.cancel_by;
	if (req.body.cancel_info) query.where.cancel_info = { [Op.like] : '%'+req.body.cancel_info+'%' };

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
	if ( req.body.str_date_take && req.body.end_date_take ){
		query.where.date_take_order = {
	        [Op.between]: [req.body.str_date_take, req.body.end_date_take]
	    }
	}
	if ( req.body.str_date_transaction && req.body.end_date_transaction ){
		query.where.date_start_transaction = {
	        [Op.between]: [req.body.str_date_transaction, req.body.end_date_transaction]
	    }
	}
	if ( req.body.str_date_on_location && req.body.end_date_on_location ){
		query.where.date_on_location = {
	        [Op.between]: [req.body.str_date_on_location, req.body.end_date_on_location]
	    }
	}
	if ( req.body.str_date_create_payment && req.body.end_date_create_payment ){
		query.where.date_create_payment = {
	        [Op.between]: [req.body.str_date_create_payment, req.body.end_date_create_payment]
	    }
	}
	if ( req.body.str_date_payment_finish && req.body.end_date_payment_finish ){
		query.where.date_payment_finish = {
	        [Op.between]: [req.body.str_date_payment_finish, req.body.end_date_payment_finish]
	    }
	}
	if ( req.body.booked ){
		query.where.status = {
	        [Op.or]: [0,2,3,4,5]
	    }
	}
	if ( req.body.active ){
		query.where.status = {
	        [Op.or]: [2,3,4]
	    }
	}
	if( req.body.groupby ){
		if(req.body.groupby == 'location_label'){
			// query.attributes = ['location_label','location_lat','location_lng','location_address',[Sequelize.fn('count', Sequelize.col('location_label')), 'count_label']]; 
			// // query.group = ['transaction.location_label','DESC'];
			// query.group = Sequelize.literal('transaction.location_label DESC');
			// query.raw = true;
			// query.order = Sequelize.literal('count_label DESC');
			query.attributes = ['location_label','location_lat','location_lng','location_address']; 
			query.raw = true;
			query.where = {};
			query.where.transaction_id = {
				[Op.in] : Sequelize.literal('( SELECT Max(transaction_id) FROM `transaction` WHERE `customer_id` = '+req.body.customer_id+' GROUP BY `location_label` )')
			};
		}
		if(req.body.groupby == 'fuel_type'){
			query.attributes = ['fuel_type',[Sequelize.fn('sum', Sequelize.col('total_fuel')), 'total_fuel'],[Sequelize.fn('sum', Sequelize.col('pay')), 'total_income']]; 
			query.group = ['transaction.fuel_type'];
		    query.raw = true;
		    query.order = Sequelize.literal('fuel_type DESC');
		}
		else if(req.body.groupby == 'date'){
			query.attributes = [ [Sequelize.fn('date', Sequelize.col('date_add')), 'date'], [Sequelize.fn('count', Sequelize.col('transaction_id')), 'total_item'],[Sequelize.fn('sum', Sequelize.col('pay')), 'total_income']]; 
			query.group = [Sequelize.fn('date', Sequelize.col('date_add'))];
		    query.raw = true;
		    query.order = Sequelize.literal('date ASC');
		}
		else if(req.body.groupby == 'car'){
			query.attributes = [ [Sequelize.fn('count', Sequelize.col('transaction_id')), 'total_item'],[Sequelize.fn('sum', Sequelize.col('pay')), 'total_income'],
								 [Sequelize.fn('sum', Sequelize.col('total_fuel')), 'total_fuel'],'car_id' ]; 
			query.group = ['car_id'];
		    query.raw = true;
		    query.order = Sequelize.literal('car_id DESC');
		}
		else if(req.body.groupby == 'car_next'){
			query.attributes = [ 'total_fuel', [Sequelize.fn('count', Sequelize.col('transaction_id')), 'total_item'],[Sequelize.fn('sum', Sequelize.col('pay')), 'total_income'],
								 [Sequelize.fn('sum', Sequelize.col('total_fuel')), 'total_next_fuel'],'car_id' ]; 
			query.group = ['car_id'];
		    query.raw = true;
		    //query.order = Sequelize.literal('car_id DESC');
		}
		else if(req.body.groupby == 'hours'){
			if(req.body.str_date){
				var dateonly = req.body.str_date.split("T")[0];
			} else {
				var date = new Date();
				var dateonly = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
					.toISOString()
					.split("T")[0];
			}
			var hours = new Date().getHours();
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
	APP.models.mysql.easy.transaction.findAll(query).then((rows) => {
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
			from: 'Transaction'
		});
	});
};