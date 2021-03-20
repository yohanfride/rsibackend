"use strict";

const async = require('async');
const md5 = require('md5');
const moment = require('moment');
const microtime = require('microtime');
var email = require('../functions/email.js');
var encryption = require('../functions/encryption.js');
var output = {};
const { Op } = require('sequelize');
//////PENTING HAPUS FOLDER QUERY////

var log = require('../functions/log.js');
var queryStr = {};
function customLogger( queryString, queryObject ){
	queryStr = {
		queryString:queryString,
		queryObject:queryObject
	}
}

exports.find = function (APP, req, callback) {
	var query = {}

	query.where = {};
	if(req.body.take)
		query.limit = parseInt(req.body.take);
	query.offset = parseInt(req.body.skip ? req.body.skip : 0);
	query.order = [['tanggal_pemeriksaan', 'DESC']];
	if (req.body.id) query.where.id_rekam_medik = req.body.id;
	if (req.body.id_rekam_medik) query.where.id_rekam_medik = req.body.id_rekam_medik;

	if (req.body.no_rekam_medik) query.where.no_rekam_medik = req.body.no_rekam_medik;
	if (req.body.id_dokter) query.where.id_dokter = req.body.id_dokter;
	if (req.body.keluhan) query.where.keluhan = req.body.keluhan;
	if (req.body.pemeriksaan) query.where.pemeriksaan = req.body.pemeriksaan;
	if (req.body.diagnosis) query.where.diagnosis = req.body.diagnosis;
	if (req.body.pengobatan) query.where.pengobatan = req.body.pengobatan;
	if (req.body.resep_obat) query.where.resep_obat = req.body.resep_obat;
	if (req.body.catatan) query.where.catatan = req.body.catatan;
	if (req.body.add_by) query.where.add_by = req.body.add_by;

	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}

	if ( req.body.str_pemeriksaan && req.body.end_pemeriksaan ){
		query.where.tanggal_pemeriksaan = {
	        [Op.between]: [req.body.str_pemeriksaan, req.body.end_pemeriksaan]
	    }
	}

	APP.models.mysql.rs.rekammedik.belongsTo(APP.models.mysql.rs.dokter, {foreignKey : 'id_dokter',targetKey: 'id_dokter'});	
    APP.models.mysql.rs.rekammedik.belongsTo(APP.models.mysql.rs.pasien, {foreignKey : 'no_rekam_medik',targetKey: 'no_rekam_medik'});	
		query.include = [
	        { 	model:APP.models.mysql.rs.dokter,
	           	where:{},         
	           	required:true},
           	{ 	model:APP.models.mysql.rs.pasien,
	           	where:{},         
	           	required:true},   	
       	];

	APP.models.mysql.rs.rekammedik.findAll(query).then((rows) => {
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
			from: 'Rekam Medik'
		});
	});
};

exports.count = function (APP, req, callback) {
	var query = {}
	query.logging = customLogger;
	
	query.where = {};
	if(req.body.take)
		query.limit = parseInt(req.body.take);
	query.offset = parseInt(req.body.skip ? req.body.skip : 0);
	query.order = [];
	if (req.body.id) query.where.id_rekam_medik = req.body.id;
	if (req.body.id_rekam_medik) query.where.id_rekam_medik = req.body.id_rekam_medik;

	if (req.body.no_rekam_medik) query.where.no_rekam_medik = req.body.no_rekam_medik;
	if (req.body.id_dokter) query.where.id_dokter = req.body.id_dokter;
	if (req.body.keluhan) query.where.keluhan = req.body.keluhan;
	if (req.body.pemeriksaan) query.where.pemeriksaan = req.body.pemeriksaan;
	if (req.body.diagnosis) query.where.diagnosis = req.body.diagnosis;
	if (req.body.pengobatan) query.where.pengobatan = req.body.pengobatan;
	if (req.body.resep_obat) query.where.resep_obat = req.body.resep_obat;
	if (req.body.catatan) query.where.catatan = req.body.catatan;
	if (req.body.add_by) query.where.add_by = req.body.add_by;

	if ( req.body.str_date && req.body.end_date ){
		query.where.date_add = {
	        [Op.between]: [req.body.str_date, req.body.end_date]
	    }
	}

	if ( req.body.str_pemeriksaan && req.body.end_pemeriksaan ){
		query.where.tanggal_pemeriksaan = {
	        [Op.between]: [req.body.str_pemeriksaan, req.body.end_pemeriksaan]
	    }
	}
	APP.models.mysql.rs.rekammedik.count(query).then((rows) => {
		log.sql(queryStr,req.user);
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
			from: 'Rekam Medik'
		});
	});
};

exports.insert = function (APP, req, callback) {	
	var params = {				
		id_rekam_medik:req.body.id_rekam_medik,
		no_rekam_medik:req.body.no_rekam_medik,
		tanggal_pemeriksaan:req.body.tanggal_pemeriksaan,
		id_dokter:req.body.id_dokter,				
		keluhan:req.body.keluhan,				
		pemeriksaan:req.body.pemeriksaan,
		diagnosis:req.body.diagnosis,
		pengobatan:req.body.pengobatan,
		resep_obat:req.body.resep_obat,
		catatan:req.body.catatan,
		date_add:req.body.date_add,
		add_by:req.body.add_by
	};	

	var query = {}
	query.logging = customLogger;
	
	APP.models.mysql.rs.rekammedik.build(params).save(query).then(result => {
		log.sql(queryStr,req.user);
		return callback(null, {
			code: 'REKAM_MEDIK_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_REKAM_MEDIK_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_REKAM_MEDIK_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Rekam Medik'
		});
	});

};

exports.update = function (APP, req, callback) {	
	var params = {};
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};							
	if (req.body.dataQuery.id) params.dataQuery.where.id_rekam_medik = req.body.dataQuery.id;
	if (req.body.dataQuery.id_rekam_medik) params.dataQuery.where.id_rekam_medik = req.body.dataQuery.id_rekam_medik;
	
	if (req.body.dataUpdate.no_rekam_medik) params.dataUpdate.no_rekam_medik = req.body.dataUpdate.no_rekam_medik;
	if (req.body.dataUpdate.tanggal_pemeriksaan) params.dataUpdate.tanggal_pemeriksaan = req.body.dataUpdate.tanggal_pemeriksaan;
	if (req.body.dataUpdate.id_dokter) params.dataUpdate.id_dokter = req.body.dataUpdate.id_dokter;
	if (req.body.dataUpdate.keluhan) params.dataUpdate.keluhan = req.body.dataUpdate.keluhan;
	if (req.body.dataUpdate.pemeriksaan) params.dataUpdate.pemeriksaan = req.body.dataUpdate.pemeriksaan;
	if (req.body.dataUpdate.diagnosis) params.dataUpdate.diagnosis = req.body.dataUpdate.diagnosis;
	if (req.body.dataUpdate.pengobatan) params.dataUpdate.pengobatan = req.body.dataUpdate.pengobatan;
	if (req.body.dataUpdate.resep_obat) params.dataUpdate.resep_obat = req.body.dataUpdate.resep_obat;
	if (req.body.dataUpdate.catatan) params.dataUpdate.catatan = req.body.dataUpdate.catatan;
	if (req.body.dataUpdate.add_by) params.dataUpdate.add_by = req.body.dataUpdate.add_by;
	
	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_REKAM_MEDIK_UPDATE_NONE',
			data: req.body
		});

	params.dataQuery.logging = customLogger;
	APP.models.mysql.rs.rekammedik.update(params.dataUpdate, params.dataQuery).then(result => {							
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_REKAM_MEDIK_UPDATE_NONE',
				data: req.body
			});

		log.sql(queryStr,req.user);
		return callback(null, {
			code: 'REKAM_MEDIK_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
					
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_REKAM_MEDIK_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_REKAM_MEDIK_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Rekam Medik'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.id_rekam_medik = req.body.id;
	if (req.body.id_rekam_medik) params.where.id_rekam_medik = req.body.id_rekam_medik;
	params.logging = customLogger;

	APP.models.mysql.rs.rekammedik.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_REKAM_MEDIK_DELETE_NONE',
				data: params.where
			});

		log.sql(queryStr,req.user);
		return callback(null, {
			code: 'REKAM_MEDIK_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Rekam Medik'
		});
	});
};
