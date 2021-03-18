"use strict";

const async = require('async');
const md5 = require('md5');
const vascommkit = require('vascommkit');
const moment = require('moment');
const microtime = require('microtime');
var email = require('../functions/email.js');
var output = {};

//////PENTING HAPUS FOLDER QUERY////

exports.find = function (APP, req, callback) {
	var params = APP.queries.select('user', req, APP.models);	
	APP.models.mysql.conndbd.users.findAll(params).then((rows) => {
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
			from: 'User'
		});
	});
};

exports.count = function (APP, req, callback) {
	APP.models.mysql.conndbd.users.count().then((rows) => {
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
			from: 'User'
		});
	});
};

exports.insert = function (APP, req, callback) {	
	//req.body.password = md5(req.body.password || 'vascomm123');	
	var pass = req.body.password;
	req.body.password = APP.encryption.encrypt(req.body.password || 'vascomm123');
	var params = APP.queries.insert('user', req, APP.models);

	APP.models.mysql.conndbd.users.build(params).save().then(user => {		
		if(user.dataValues) user.dataValues.password = pass;
		else params.password = pass;

		return callback(null, {
			code: 'USER_INSERT_SUCCESS',
			data: user.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_USER_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_USER_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'User'
		});
	});

};

exports.update = function (APP, req, callback) {	
	if(req.body.password){		
		req.body.dataUpdate.password = APP.encryption.encrypt(req.body.password);
	}
	var params = APP.queries.update('user', req, APP.models);
	if (Object.keys(req.body.dataUpdate).length < 1) return callback({
			code: 'ERR_USER_UPDATE_NONE',
			data: params
		});
	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	console.log("------------------");
	console.log(params);
	console.log("------------------");
	APP.models.mysql.conndbd.users.update(params.dataUpdate, params.dataQuery).then(user => {							
		if (!user || (user && !user[0])) return callback(null, {
				code: 'ERR_USER_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'USER_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_USER_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_USER_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'User'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = APP.queries.delete('user', req, APP.models);

	APP.models.mysql.conndbd.users.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_USER_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'USER_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'User'
		});
	});
};

exports.cekUser = function (APP, req, callback) {
	if(!req.body.status) req.body.status = 'Y';
	var params = APP.queries.select('user', req, APP.models);
	APP.models.mysql.conndbd.users.findAll(params).then((rows) => {
		return callback(null, {
			code: (rows && (rows.length > 0)) ? 'FOUND' : 'NOT_FOUND',
			data: (rows[0])? rows[0] : rows,
			info: {}
		});
	}).catch((err) => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'User'
		});
	});
};

exports.login = function (APP, req, callback) {	
	module.exports.find(APP, {
		body: { username : req.body.username }
	}, (err, user) => {		
		if (err) return callback({
				code: 'ERR_LOGIN',
				data: req.body
			});
		if (user && user.code !== 'FOUND') return callback({
				code: 'ERR_LOGIN_WRONG',
				data: req.body
			});					
		//var password_dec = APP.encryption.decrypt(user.data[0].dataValues.Password).substring(0, 8);						
		var password_dec = APP.encryption.decrypt(user.data[0].dataValues.Password);						
		if ( !(password_dec == req.body.password) ){
			callback({
				code: 'ERR_LOGIN_WRONG',
				data: req.body
			});
		} else if(user.data[0].dataValues.Status == 'Y'){
			callback(null, {
				code: 'LOGIN_SUCCESS',
				data: user.data
			});
		} else {
			callback({
				code: 'ERR_LOGIN_PERMISSION',
				data: req.body
			});
		}		
	});
};