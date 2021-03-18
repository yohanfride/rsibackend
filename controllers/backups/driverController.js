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
	if (req.body.id) query.where.driver_id = req.body.id;
	if (req.body.driver_id) query.where.driver_id = req.body.driver_id;

	if (req.body.driver_code) query.where.driver_code = req.body.driver_code;
	
	if (req.body.name) query.where.name = req.body.name;
	if (req.body.phone) query.where.phone = req.body.phone;
	if (req.body.email) query.where.email = req.body.email;
	if (req.body.photo) query.where.photo = req.body.photo;

	if (req.body.date_add) query.where.date_add = req.body.date_add;
	if (req.body.add_by) query.where.add_by = req.body.add_by;
	if (req.body.otp) query.where.otp = req.body.otp;
	if (req.body.status) query.where.status = req.body.status;
				
	if (req.body.token) query.where.token = req.body.token;
	if (req.body.expired_otp) query.where.expired_otp = req.body.expired_otp;

	
	if (req.body.ktp) query.where.ktp = req.body.ktp;
	if (req.body.sim) query.where.sim = req.body.sim;
	if (req.body.birth) query.where.birth = req.body.birth;
	if (req.body.address) query.where.address = req.body.address;
	if (req.body.gender) query.where.gender = req.body.gender;
	if (req.body.date_otp) query.where.expired_otp = {
      	[Op.gte]: req.body.date_otp
    }; 

	APP.models.mysql.easy.driver.findAll(query).then((rows) => {
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
			from: 'Driver'
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
	if (req.body.id) query.where.driver_id = req.body.id;
	if (req.body.driver_id) query.where.driver_id = req.body.driver_id;

	if (req.body.driver_code) query.where.driver_code = req.body.driver_code;
	
	if (req.body.name) query.where.name = req.body.name;
	if (req.body.phone) query.where.phone = req.body.phone;
	if (req.body.email) query.where.email = req.body.email;
	if (req.body.photo) query.where.photo = req.body.photo;

	if (req.body.date_add) query.where.date_add = req.body.date_add;
	if (req.body.add_by) query.where.add_by = req.body.add_by;
	if (req.body.otp) query.where.otp = req.body.otp;
	if (req.body.status) query.where.status = req.body.status;
				
	if (req.body.token) query.where.token = req.body.token;
	if (req.body.expired_otp) query.where.expired_otp = req.body.expired_otp;

	
	if (req.body.ktp) query.where.ktp = req.body.ktp;
	if (req.body.sim) query.where.sim = req.body.sim;
	if (req.body.birth) query.where.birth = req.body.birth;
	if (req.body.address) query.where.address = req.body.address;
	if (req.body.gender) query.where.gender = req.body.gender;
	if (req.body.date_otp) query.where.expired_otp = {
      	[Op.gte]: req.body.date_otp
    }; 
    
	APP.models.mysql.easy.driver.count(query).then((rows) => {
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
			from: 'Driver'
		});
	});
};

exports.insert = function (APP, req, callback) {	
	//req.body.password = md5(req.body.password || 'vascomm123');	
	var pass = req.body.password;
	req.body.password = encryption.encrypt(req.body.password || 'easybensin123');	
	var params = {				
		driver_id:req.body.driver_id,
		driver_code:req.body.driver_code,
		password:req.body.password,				
		name:req.body.name,				
		email:req.body.email,
		phone:req.body.phone,
		photo:req.body.photo,		
		add_by:req.body.add_by,
		date_add:req.body.date_add,
		status:req.body.status,
		expired_otp:req.body.expired_otp,
		otp:req.body.otp,
		token:req.body.token,
		ktp:req.body.ktp,
		sim:req.body.sim,
		birth:req.body.birth,
		address:req.body.address,
		gender:req.body.gender
	};	
	APP.models.mysql.easy.driver.build(params).save().then(result => {		
		if(result.dataValues) result.dataValues.password = pass;
		else params.password = pass;

		return callback(null, {
			code: 'DRIVER_INSERT_SUCCESS',
			data: result.dataValues || params
		});
	}).catch(err => {
		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
				code: 'ERR_DRIVER_DUPLICATE',
				data: params
			});

		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_DRIVER_UPDATE_NONE',
				data: params
			});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'driver'
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
	if (req.body.dataQuery.id) params.dataQuery.where.driver_id = req.body.dataQuery.id;
	if (req.body.dataQuery.driver_id) params.dataQuery.where.driver_id = req.body.dataQuery.driver_id;

	if (req.body.dataUpdate.driver_code) params.dataUpdate.driver_code = req.body.dataUpdate.driver_code;
	if (req.body.dataUpdate.password) params.dataUpdate.password = req.body.dataUpdate.password;
	if (req.body.dataUpdate.name) params.dataUpdate.name = req.body.dataUpdate.name;
	if (req.body.dataUpdate.email) params.dataUpdate.email = req.body.dataUpdate.email;	
	if (req.body.dataUpdate.phone) params.dataUpdate.phone = req.body.dataUpdate.phone;
	if (req.body.dataUpdate.photo) params.dataUpdate.photo = req.body.dataUpdate.photo;
	if (req.body.dataUpdate.otp) params.dataUpdate.otp = req.body.dataUpdate.otp;
	if (req.body.dataUpdate.status) params.dataUpdate.status = req.body.dataUpdate.status;
	if (req.body.dataUpdate.status == 0) params.dataUpdate.status = req.body.dataUpdate.status;
	if (req.body.dataUpdate.token) params.dataUpdate.token = req.body.dataUpdate.token;
	if (req.body.dataUpdate.expired_otp) params.dataUpdate.expired_otp = req.body.dataUpdate.expired_otp;
	if (req.body.dataUpdate.ktp) params.dataUpdate.ktp = req.body.dataUpdate.ktp;
	if (req.body.dataUpdate.sim) params.dataUpdate.sim = req.body.dataUpdate.sim;	
	if (req.body.dataUpdate.birth) params.dataUpdate.birth = req.body.dataUpdate.birth;
	if (req.body.dataUpdate.address) params.dataUpdate.address = req.body.dataUpdate.address;
	if (req.body.dataUpdate.gender) params.dataUpdate.gender = req.body.dataUpdate.gender;

	delete req.body.dataQuery;
	delete req.body.dataUpdate;
	if (Object.keys(params.dataUpdate).length < 1) return callback({
			code: 'ERR_DRIVER_UPDATE_NONE',
			data: req.body
		});

	APP.models.mysql.easy.driver.update(params.dataUpdate, params.dataQuery).then(result => {							
		if (!result || (result && !result[0])) return callback(null, {
				code: 'ERR_DRIVER_UPDATE_NONE',
				data: req.body
			});

		return callback(null, {
			code: 'DRIVER_UPDATE_SUCCESS',
			data: req.body
		});
	}).catch(err => {			
		if (err.original && err.original.code === 'ER_EMPTY_QUERY') return callback({
				code: 'ERR_DRIVER_UPDATE_NONE',
				data: params
			});

		if (err.original && err.original.code === 'ER_DUP_ENTRY') return callback({
					code: 'ERR_DRIVER_DUPLICATE',
					data: params
				});

		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'driver'
		});
	});	
};

exports.delete = function (APP, req, callback) {
	var params = {};
	params.where = {};
	if (req.body.id) params.where.driver_id = req.body.id;
	if (req.body.driver_id) params.where.driver_id = req.body.driver_id;

	APP.models.mysql.easy.driver.destroy(params).then(deleted => {
		if (!deleted) return callback(null, {
				code: 'ERR_DRIVER_DELETE_NONE',
				data: params.where
			});

		return callback(null, {
			code: 'DRIVER_DELETE_SUCCESS',
			data: params.where
		});
	}).catch(err => {
		return callback({
			code: 'ERR_DATABASE',
			info: err,
			data: req.body,
			from: 'driver'
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
		console.log(password_dec);
		console.log(req.body.password);
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
				id:user.data[0].dataValues.driver_id
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