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

exports.find = function (APP, req, callback) {
	var query = {}
	query.where = {};
	if(req.body.take)
		query.limit = parseInt(req.body.take);
	query.offset = parseInt(req.body.skip ? req.body.skip : 0);
	query.order = [];
	if (req.body.id) query.where.id = req.body.id;

	if (req.body.username) query.where.username = req.body.username;
	if (req.body.name) query.where.name = req.body.name;
	if (req.body.phone) query.where.phone = req.body.phone;

	if (req.body.add_by) query.where.add_by = req.body.add_by;
	if (req.body.status) query.where.status = req.body.status;
	if (req.body.token) query.where.token = req.body.token;
	if (req.body.role) query.where.role = req.body.role;
	
	if (req.body.last_login) query.where.last_login = {
      	[Op.gte]: req.body.last_login
    }; 
	if (req.body.date_otp) query.where.date_otp = {
      	[Op.gte]: req.body.date_otp
    }; 

	APP.models.mysql.easy.users.findAll(query).then((rows) => {
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
			from: 'Users'
		});
	});
};

exports.count = function (APP, req, callback) {
	APP.models.mysql.easy.users.count().then((rows) => {
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
			from: 'Users'
		});
	});
};

exports.insert = function (APP, req, callback) {	
	var pass = req.body.password;
	req.body.password = encryption.encrypt(req.body.password || 'easybensin123');
	
	var params = {				
		id:req.body.id,
		username:req.body.username,
		password:req.body.password,				
		nama:req.body.nama,				
		add_by:req.body.add_by,
		date_add:req.body.date_add,
		status:req.body.status,
		role:req.body.role
	};	

	APP.models.mysql.easy.users.build(params).save().then(result => {		
		if(result.dataValues) result.dataValues.password = pass;
		else params.password = pass;

		return callback(null, {
			code: 'USERS_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_USERS_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_USERS_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Users'
		});
	});

};

exports.update = function (APP, req, callback) {	
	var params = {};
	if(req.body.password){		
		req.body.dataUpdate.password = encryption.encrypt(req.body.password);
	}
	params.dataUpdate = {};
	params.dataQuery = {};	
	params.dataQuery.where = {};							
	if (req.body.dataQuery.id) params.dataQuery.where.id = req.body.dataQuery.id;
	if (req.body.dataUpdate.username) params.dataUpdate.username = req.body.dataUpdate.username;
	if (req.body.dataUpdate.password) params.dataUpdate.password = req.body.dataUpdate.password;
	if (req.body.dataUpdate.nama) params.dataUpdate.nama = req.body.dataUpdate.nama;
	if (req.body.dataUpdate.status) params.dataUpdate.status = req.body.dataUpdate.status;
	if (req.body.dataUpdate.status == 0) params.dataUpdate.status = req.body.dataUpdate.status;
	if (req.body.dataUpdate.role) params.dataUpdate.role = req.body.dataUpdate.role;
	if (req.body.dataUpdate.token) params.dataUpdate.token = req.body.dataUpdate.token;
	if (req.body.dataUpdate.last_login) params.dataUpdate.expired_otp = req.body.dataUpdate.expired_otp;
	
	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_USERS_UPDATE_NONE',
			data: req.body
		});

	APP.models.mysql.easy.users.update(params.dataUpdate, params.dataQuery).then(result => {							
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_USERS_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'USERS_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
					
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_USERS_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_USERS_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Users'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.id = req.body.id;

	APP.models.mysql.easy.users.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_USERS_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'USERS_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'Users'
		});
	});
};

exports.login = function (APP, req, callback) {
	module.exports.find(APP, {
		body:req.body  
	}, (err, result) => {
		if (err) return callback({
				code: 'ERR_LOGIN',
				data: req.body
			});
		if (result && result.code !== 'FOUND') return callback({
				code: 'ERR_LOGIN_WRONG',
				data: req.body
			});					
		var password_dec = encryption.extract(result.data[0].dataValues.password)[0];						
		if ( !(password_dec == req.body.password) ){
			callback({
				code: 'ERR_LOGIN_WRONG',
				data: req.body
			});
		} else if(result.data[0].dataValues.status == 1){
			callback(null, {
				code: 'LOGIN_SUCCESS',
				data: result.data
			});
		} else {
			callback({
				code: 'ERR_LOGIN_PERMISSION',
				data: req.body
			});
		}		
	});
};

exports.checkPass = function (APP, req, callback) {	
	console.log(req);
	module.exports.find(APP, {
		body:req.body  
	}, (err, result) => {
		if (err) return callback({
				code: 'ERR_PASSWORD',
				data: req.body
			});
		if (result && result.code !== 'FOUND') return callback({
				code: 'ERR_PASSWORD_WRONG',
				data: req.body
			});					
		var password_dec = encryption.extract(result.data[0].dataValues.password)[0];						
		console.log(password_dec);
		console.log(req.body.password);
		if ( !(password_dec == req.body.password) ){
			callback({
				code: 'ERR_PASSWORD_WRONG',
				data: req.body
			});
		} else {
			callback(null, {
				code: 'PASSWORD_VALID',
				data: result.data
			});
		}		
	});
};

var add_minutes =  function (dt, minutes) {
    return new Date(dt.getTime() + minutes*60000);
}

exports.otpSend = function (APP, req, callback) {
	async.waterfall([
		function checkUserExists(callback) {
			module.exports.find(APP, {
				body: {
					email: req.body.referrer,
					take: 1,
					skip: 0
				}
			}, (err, result) => {
				if (err) return callback(err);

				if (result && result.code !== 'FOUND') return callback(result);

				callback(null, result);
			});
		},
		function updateData (user, callback) {			
			var params = {};
			params.dataQuery = {
				id:user.data[0].dataValues.users_id
			};
			const otp_file = {
				otp:  Math.random().toString(36).substring(2,8).toUpperCase(),
				expired_otp: add_minutes(moment().toDate(),process.env.OTP_EXPIRED_DURATION)
			};	
			params.dataUpdate = otp_file;	
			module.exports.update(APP,{body:params}, (err, result) => {
		    	if (err) return callback({
					code: 'ERR_DATABASE',
					data: err
				});		    
		    	///set refrence
		    	var prefer = "change your password Account";
		    	if(req.body.method == "register"){
		    		prefer = "validate your Account";
		    	}
		    	var user_email = user.data[0].dataValues.email;
		    	var link = req.body.baseURL+"/"+user_email.replace("@","518ed29525738cebdac49c49e60ea9d3")+"/"+otp_file.otp;
			    ////Kirim Email
			    var moment = require('moment');		
			    req.body.email = user_email;
			    req.body.subject = 'OTP - Easy Bensin';    
			    req.body.body_email = 'Use this link  to '+prefer+', Link valid for '+process.env.OTP_EXPIRED_DURATION+' minutes.<br/><br/>'+link;
			    email.send(req,function(err,email_result){		    	
			        if(err){
			        	err.data = { email : req.body.referrer };		        	
			          	return callback(err);
			        }
			        return callback(null, {
				    	code: 'OTP_GENERATED_SUCCESS',
				    	data: { email : req.body.referrer }
				    });
			    })
			    ///End Kirim EMail		    
		  	});
		}
	], (err, result) => {

		if (err) return callback(err);
		callback(null, result);
	});		
};

exports.otpValidation = function (APP, req, callback) {
	async.waterfall([
		function checkOTP(callback) {
			module.exports.find(APP, {
				body: {
					email: req.body.referrer,
					otp: req.body.otp,
					date_otp:moment().toDate(),
					take: 1,
					skip: 0
				}
			}, (err, result) => {
				if (err) return callback(err);

				if (result && result.code !== 'FOUND') return callback({
						code: 'ERR_OTP_INVALID',
						data: req.body
					});

				callback(null, {
					code: 'OTP_VALID',
					data: result.data
				});
			});
		}
	], (err, result) => {
		if (err) return callback(err);
		callback(null, result);
	});		
};