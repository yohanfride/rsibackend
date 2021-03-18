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
	if(req.body.order_by){
		if(req.body.order_by == 'date_start_1')
			query.order = [['date_start', 'DESC']];
		if(req.body.order_by == 'date_finish_1')
			query.order = [['date_finish', 'DESC']];
		if(req.body.order_by == 'date_start_0')
			query.order = [['date_start', 'ASC']];
		if(req.body.order_by == 'date_finish_0')
			query.order = [['date_finish', 'ASC']];
		if(req.body.order_by == 'date_add_0')
			query.order = [['date_add', 'ASC']];
	}

	if (req.body.id) query.where.maintenance_id = req.body.id;
	if (req.body.maintenance_id) query.where.maintenance_id = req.body.maintenance_id;

	if (req.body.car_id) query.where.car_id = req.body.car_id;
	if (req.body.pic) query.where.pic = req.body.pic;
	if (req.body.note) query.where.note = { [Op.like] : '%'+req.body.note+'%' };
	
	if (req.body.maintenance_location) query.where.maintenance_location = req.body.maintenance_location;
	if (req.body.maintenance_type) query.where.maintenance_type = req.body.maintenance_type;
	if (req.body.cost) query.where.cost = req.body.cost;
	
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.status == 0) query.where.status = req.body.status;

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
	if ( req.body.str_date_start && req.body.end_date_start ){
		query.where.date_start = {
	        [Op.between]: [req.body.str_date_start, req.body.end_date_start]
	    }
	}
	
	console.log(req.body);
	if ( req.body.detail ){
       	APP.models.mysql.easy.maintenance.belongsTo(APP.models.mysql.easy.car, {foreignKey : 'car_id',targetKey: 'car_id'});	
		query.include = [
	        { 	model:APP.models.mysql.easy.car,
	           	where:{},         
	           	required:true} 	
       	];
	}

	APP.models.mysql.easy.maintenance.findAll(query).then((rows) => {
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
			from: 'Maintenance'
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
	if (req.body.id) query.where.maintenance_id = req.body.id;
	if (req.body.maintenance_id) query.where.maintenance_id = req.body.maintenance_id;

	if (req.body.car_id) query.where.car_id = req.body.car_id;
	if (req.body.pic) query.where.pic = req.body.pic;
	if (req.body.note) query.where.note = { [Op.like] : '%'+req.body.note+'%' };
	
	if (req.body.maintenance_location) query.where.maintenance_location = req.body.maintenance_location;
	if (req.body.maintenance_type) query.where.maintenance_type = req.body.maintenance_type;
	if (req.body.cost) query.where.cost = req.body.cost;
	
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.status == 0) query.where.status = req.body.status;

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
	if ( req.body.str_date_start && req.body.end_date_start ){
		query.where.date_start = {
	        [Op.between]: [req.body.str_date_start, req.body.end_date_start]
	    }
	}

	APP.models.mysql.easy.maintenance.count(query).then((rows) => {
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
			from: 'Maintenance'
		});
	});
};

exports.insert = function (APP, req, callback) {		
	var params = {				
		car_id:req.body.car_id,
		pic:req.body.pic,
		maintenance_location:req.body.maintenance_location,				
		maintenance_type:req.body.maintenance_type,				
		date_add:req.body.date_add,
		date_start:req.body.date_start,
		date_finish:req.body.date_finish,
		date_next:req.body.date_next,
		note:req.body.note,
		cost:req.body.cost,
		status:req.body.status
	};	
	APP.models.mysql.easy.maintenance.build(params).save().then(result => {				
		return callback(null, {
			code: 'MAINTENANCE_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_MAINTENANCE_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_MAINTENANCE_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Maintenance'
		});
	});

};

exports.update = function (APP, req, callback) {		
	var params = {};		
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};									
	if (req.body.dataQuery.id) params.dataQuery.where.maintenance_id = req.body.dataQuery.id;
	if (req.body.dataQuery.maintenance_id) params.dataQuery.where.maintenance_id = req.body.dataQuery.maintenance_id;
	
	if (req.body.dataUpdate.car_id) params.dataUpdate.car_id = req.body.dataUpdate.car_id;
	if (req.body.dataUpdate.pic) params.dataUpdate.pic = req.body.dataUpdate.pic;
	if (req.body.dataUpdate.note) params.dataUpdate.note = req.body.dataUpdate.note;
	
	if (req.body.dataUpdate.maintenance_location) params.dataUpdate.maintenance_location = req.body.dataUpdate.maintenance_location;
	if (req.body.dataUpdate.maintenance_type) params.dataUpdate.maintenance_type = req.body.dataUpdate.maintenance_type;
	if (req.body.dataUpdate.cost) params.dataUpdate.cost = req.body.dataUpdate.cost;

	if (req.body.dataUpdate.date_start) params.dataUpdate.date_start = req.body.dataUpdate.date_start;
	if (req.body.dataUpdate.date_finish) params.dataUpdate.date_finish = req.body.dataUpdate.date_finish;
	if (req.body.dataUpdate.date_next) params.dataUpdate.date_next = req.body.dataUpdate.date_next;
	if (req.body.dataUpdate.status) params.dataUpdate.status = req.body.dataUpdate.status;

	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_MAINTENANCE_UPDATE_NONE',
			data: req.body
		});	

	APP.models.mysql.easy.maintenance.update(params.dataUpdate, params.dataQuery).then(result => {							
		console.log(result);
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_MAINTENANCE_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'MAINTENANCE_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_MAINTENANCE_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_MAINTENANCE_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Maintenance'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.maintenance_id = req.body.id;
	if (req.body.maintenance_id) params.where.maintenance_id = req.body.maintenance_id;

	APP.models.mysql.easy.maintenance.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_MAINTENANCE_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'MAINTENANCE_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Maintenance'
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
	if(req.body.order_by){
		if(req.body.order_by == 'date_start_1')
			query.order = [['date_start', 'DESC']];
		if(req.body.order_by == 'date_finish_1')
			query.order = [['date_finish', 'DESC']];
		if(req.body.order_by == 'date_start_0')
			query.order = [['date_start', 'ASC']];
		if(req.body.order_by == 'date_finish_0')
			query.order = [['date_finish', 'ASC']];
		if(req.body.order_by == 'date_add_0')
			query.order = [['date_add', 'ASC']];
	}

	if (req.body.id) query.where.maintenance_id = req.body.id;
	if (req.body.maintenance_id) query.where.maintenance_id = req.body.maintenance_id;

	if (req.body.car_id) query.where.car_id = req.body.car_id;
	if (req.body.pic) query.where.pic = req.body.pic;
	if (req.body.note) query.where.note = { [Op.like] : '%'+req.body.note+'%' };
	
	if (req.body.maintenance_location) query.where.maintenance_location = req.body.maintenance_location;
	if (req.body.maintenance_type) query.where.maintenance_type = req.body.maintenance_type;
	if (req.body.cost) query.where.cost = req.body.cost;
	
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.status == 0) query.where.status = req.body.status;

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
	if ( req.body.str_date_start && req.body.end_date_start ){
		query.where.date_start = {
	        [Op.between]: [req.body.str_date_take, req.body.end_date_take]
	    }
	}

	if( req.body.groupby ){
		if(req.body.groupby == 'date'){
			query.attributes = [ [Sequelize.fn('date', Sequelize.col('date_add')), 'date'], [Sequelize.fn('count', Sequelize.col('maintenance_id')), 'total_item']]; 
			query.group = [Sequelize.fn('date', Sequelize.col('date_add'))];
		    query.raw = true;
		    query.order = Sequelize.literal('date ASC');
		}
		if(req.body.groupby == 'car'){
			query.attributes = [ [Sequelize.fn('count', Sequelize.col('maintenance_id')), 'total_item'],'car_id' ]; 
			query.group = ['car_id'];
		    query.raw = true;
		    query.order = Sequelize.literal('car_id DESC');
		}
	}

	APP.models.mysql.easy.maintenance.findAll(query).then((rows) => {
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
			from: 'Maintenance'
		});
	});
};