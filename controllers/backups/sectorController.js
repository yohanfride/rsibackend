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
const inside = require('point-in-polygon');

//////PENTING HAPUS FOLDER QUERY////

exports.find = function (APP, req, callback) {
	var query = {}
	query.where = {};
	if(req.body.take)
		query.limit = parseInt(req.body.take);
	query.offset = parseInt(req.body.skip ? req.body.skip : 0);
	query.order = [['date_add', 'DESC']];
	if (req.body.id) query.where.sector_id = req.body.id;
	if (req.body.sector_id) query.where.sector_id = req.body.sector_id;

	if (req.body.sector) query.where.sector = req.body.sector;
	if (req.body.group) query.where.group = req.body.group;
	if (req.body.city) query.where.city = req.body.city;
	if (req.body.province) query.where.province = req.body.province;
	if (req.body.type) query.where.type = req.body.type;
	if (req.body.coordinates) query.where.coordinates = req.body.coordinates;
	
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.status==0) query.where.status = req.body.status;

	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}
	if ( req.body.str_date_update && req.body.end_date_update ){
		query.where.date_update = {
	        [Op.between]: [req.body.str_date_update, req.body.end_date_update]
	    }
	}
	
	if( req.body.groupby ){
		if(req.body.groupby == 'group'){
			query.attributes = ['group']; 
			query.group = ['sector.group'];
		    query.raw = true;
		    //query.order = Sequelize.literal('group ASC');
		}
	}
	APP.models.mysql.easy.sector.findAll(query).then((rows) => {
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
			from: 'Sector'
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
	if (req.body.id) query.where.sector_id = req.body.id;
	if (req.body.sector_id) query.where.sector_id = req.body.sector_id;

	if (req.body.sector) query.where.sector = req.body.sector;
	if (req.body.group) query.where.group = req.body.group;
	if (req.body.city) query.where.city = req.body.city;
	if (req.body.province) query.where.province = req.body.province;
	if (req.body.type) query.where.type = req.body.type;
	if (req.body.coordinates) query.where.coordinates = req.body.coordinates;
	
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.status==0) query.where.status = req.body.status;

	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}
	if ( req.body.str_date_update && req.body.end_date_update ){
		query.where.date_update = {
	        [Op.between]: [req.body.str_date_update, req.body.end_date_update]
	    }
	}

	APP.models.mysql.easy.sector.count(query).then((rows) => {
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
			from: 'Sector'
		});
	});
};

exports.insert = function (APP, req, callback) {		
	var params = {				
		sector_id:req.body.sector_id,
		sector:req.body.sector,
		group:req.body.group,
		city:req.body.city,
		province:req.body.province,
		type:req.body.type,				
		coordinates:req.body.coordinates,				
		date_add:req.body.date_add,
		note:req.body.note,
		status:req.body.status
	};	
	APP.models.mysql.easy.sector.build(params).save().then(result => {				
		return callback(null, {
			code: 'SECTOR_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_SECTOR_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_SECTOR_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Sector'
		});
	});

};

exports.update = function (APP, req, callback) {		
	var params = {};		
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};									
	if (req.body.dataQuery.id) params.dataQuery.where.sector_id = req.body.dataQuery.id;
	if (req.body.dataQuery.sector_id) params.dataQuery.where.sector_id = req.body.dataQuery.sector_id;
	
	if (req.body.dataUpdate.sector) params.dataUpdate.sector = req.body.dataUpdate.sector;
	if (req.body.dataUpdate.group) params.dataUpdate.group = req.body.dataUpdate.group;
	if (req.body.dataUpdate.city) params.dataUpdate.city = req.body.dataUpdate.city;
	if (req.body.dataUpdate.province) params.dataUpdate.province = req.body.dataUpdate.province;
	if (req.body.dataUpdate.type) params.dataUpdate.type = req.body.dataUpdate.type;
	if (req.body.dataUpdate.coordinates) params.dataUpdate.coordinates = req.body.dataUpdate.coordinates;
	
	if (req.body.dataUpdate.date_update) params.dataUpdate.date_update = req.body.dataUpdate.date_update;
	if (req.body.dataUpdate.status) params.dataUpdate.status = req.body.dataUpdate.status;
	if (req.body.dataUpdate.status == 0) params.dataUpdate.status = req.body.dataUpdate.status;
	
	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_SECTOR_UPDATE_NONE',
			data: req.body
		});	

	APP.models.mysql.easy.sector.update(params.dataUpdate, params.dataQuery).then(result => {							
		console.log(result);
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_SECTOR_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'SECTOR_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_SECTOR_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_SECTOR_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Sector'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.sector_id = req.body.id;
	if (req.body.sector_id) params.where.sector_id = req.body.sector_id;

	APP.models.mysql.easy.sector.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_SECTOR_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'SECTOR_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Sector'
		});
	});
};

exports.findsector = function (APP, req, callback) {	
	var find = {};
	if(req.body.group){
		find = {
			group:req.body.group
		};
	}

	module.exports.find(APP, {
		body: { find }
	}, (err, result) => {		
		var result_data = new Array();
		for (var i = 0; i < result.data.length; i++) {
			var sector = result.data[i];
			var coordinates = sector.coordinates;
			if(sector.type != 'multipolygon'){
				var polygon = JSON.parse(coordinates);
				if(inside([ req.body.longitude, req.body.latitude ], polygon)){
					result_data.push(sector.sector);
				}
			} else {
				var mutltipolygon = JSON.parse(coordinates);
				for (var n = 0; n < mutltipolygon.length; n++) {
					var polygon = mutltipolygon[n][0];
					if(inside([ req.body.longitude, req.body.latitude ], polygon)){
						result_data.push(sector.sector);
					}
					console.log("--------"+sector.sector+"--------");
					console.log(polygon);
					console.log("----------------");
				}
			}

		}

		if(result_data){
			return callback(null, {
				code: 'FOUND',
				data: {
					sector:result_data,
					total: result_data.length
				}
			});
		} else {
			return callback(null, {
				code: 'NOT_FOUND',
				data: {
					total: 0
				}
			});
		}
	});
};