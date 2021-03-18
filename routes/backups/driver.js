"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const driverController = require('../controllers/driverController.js');
const router = express.Router();
const moment = require('moment');
var email = require('../functions/email.js');
var validation = require('../functions/validation.js');
var output = {};

function hashClientId(data) {
    var time = moment.utc(moment()).format('YYYY_HH_MM_DD')
    // var time = "2019_10_04_02"
    return md5(data+time).toLowerCase();
}

function hashClientSecret(data) {
    var time = moment.utc(moment()).format('YYYY_HH_MM_DD')
    // var time = "2019_10_04_02"
    return md5(time+data).toLowerCase();
}

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function gettingData (index, callback) {
			driverController.find(req.APP, req, (err, result) => {
				if (err) return callback(err);

				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/total', (req, res, next) => {
	async.waterfall([
		function gettingData (callback) {
			driverController.count(req.APP, req, (err, result) => {
				if (err) return callback(err);

				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/delete', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.id) && (!req.body.driver_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function gettingData (index, callback) {
			driverController.delete(req.APP, req, (err, result) => {
				if (err) return callback(err);

				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/update', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			req.body.lastupdate = Math.round(new Date().getTime()/1000);
			callback(null, true);
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.id) && (!req.body.driver_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function dataUpdate (index, callback) {
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;

			callback(null, true);
		},
		function gettingData (index, callback) {
			driverController.update(req.APP, req, (err, result) => {
				if (err) return callback(err);
				callback(null, result);
			});
		}
		// function updateClientAuth(response, callback) {   
		// 	if(req.body.driver_code || req.body.password){
		// 		var params = {};
		// 		if(req.body.driver_code) params.clientId = md5(req.body.driver_code);
		// 		if(req.body.password) params.clientSecret = md5(req.body.password);				      
				
		// 		if(req.body.driver_id) var filter = { userId:req.body.driver_id };
		// 		else var filter = { tusers_id:req.body.id };

	 //            req.APP.models.mongo.OAuthClients.findOneAndUpdate(filter, params, {upsert:true}, (err, result) => {
	 //                if (err) return callback({
	 //                    code: 'ERR_DATABASE',
	 //                    data: JSON.stringify(err)
	 //                });	                
	 //                return callback(null,response);
	 //            });
		// 	} else {
		// 		return callback(null,response);
		// 	}			
  //       }
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

//DONT FORGET UPDATE ON BOTTOM EITHER!!!
router.post('/insert', (req, res, next) => {
	async.waterfall([		
		function checkingParameters ( callback) {
			if (!req.body.email) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Email'
					}
				});

			if (!req.body.driver_code) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Driver Code'
					}
				});
			
			if (!req.body.name) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Nama'
					}
				});

			if (!req.body.ktp) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'KTP'
					}
				});	

			if (!req.body.sim) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'SIM'
					}
				});	

			if (!req.body.gender) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Gender'
					}
				});								
			callback(null, true);
		},
		function checkingEmail(index,callback) {
			driverController.find(req.APP, {body:{email:req.body.email}}, (err, result) => {
				if (err) return callback(err);
				if (result.code == 'FOUND') return callback({
					code: 'ERR_DRIVER_DUPLICATE',
					data: req.body,
					info: {
						missingParameter: 'email'
					}
				});							
				callback(null, true);
			});
		},
		function checkingdriver_code(index,callback) {
			driverController.find(req.APP, {body:{driver_code:req.body.driver_code}}, (err, result) => {
				if (err) return callback(err);
				if (result.code == 'FOUND') return callback({
					code: 'ERR_DRIVER_DUPLICATE',
					data: req.body,
					info: {
						missingParameter: 'Driver Code'
					}
				});							
				callback(null, true);
			});
		},
		function aliases (index,callback) {
			if (!req.body.driver_id){
				var awal =  Number(moment().year()) + 5;				
				req.body.driver_id = awal.toString() + Math.ceil((microtime.now()/10000));				
			}
			if (!req.body.driver_code){
				var mail =  req.body.email;								
				req.body.driver_code = mail.replace("_","").replace(".","").substring(0, 6).toUpperCase() + 
									Math.random().toString(36).substring(2, 7).toUpperCase();
			}		
			if(!req.body.password){
				req.body.password = Math.random().toString(36).substring(2, 10);	
			}
			req.body.token = Math.random().toString(36).substring(2, 10).toUpperCase();	
			req.body.passwordNoEncpty = req.body.password;
			callback(null, true);
		},		
		function insertData (index, callback) {
			driverController.insert(req.APP, req, (err, result) => {				
				if (err) return callback(err);
				callback(null, result);
			});
		},
		function sendEmailPassword(response, callback) {   						
			if(req.body.sendmail){				
				////Kirim Email
				var password = response.data.password || req.body.passwordNoEncpty;
			    delete response.data.password;
				delete response.data.Password;
			    var moment = require('moment');		
			    var params = {
			    	email : req.body.email,
			    	subject : 'Information Driver Account - Easy Bensin',
			    	body_email : 'Your password Account is <b> '+password+' </b><br/>'
			    }					   
			    email.send({body:params},function(err,email_result){		    				        
			        if(err){
			        	err.data = response.data;		        	
			          	return callback(err);
			        }			        
			        return callback(null,response);
			    })			    
			} else {				
				callback(null,response);
			}			
        },
		function sendEmailActivation(response, callback) {   						
			if(req.body.url){				
				////Kirim Email
				var user_email = req.body.email;
		    	var link = req.body.url+"/"+user_email.replace("@","518ed29525738cebdac49c49e60ea9d3")+"/"+req.body.token;
			    delete response.data.password;
				delete response.data.Password;
			    var moment = require('moment');		
			    var params = {
			    	email : req.body.email,
			    	subject : 'Information Driver Account - Easy Bensin',
			    	body_email : 'Your active Account link is <b> '+link+' </b><br/>'
			    }					   
			    email.send({body:params},function(err,email_result){		    				        
			        if(err){
			        	err.data = response.data;		        	
			          	return callback(err);
			        }			        
			        return callback(null,response);
			    })			    
			} else {				
				callback(null,response);
			}			
        }
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/activation', (req, res, next) => {
	var password;	
	async.waterfall([
		function checkingParameters ( callback) {			
			if (!req.body.email) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'email'
					}
				});
			if (!req.body.token) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'token'
					}
				});
					
			callback(null, true);
		},
		function permission (index, callback) {						
			driverController.find(req.APP, {
				body: {
					email: req.body.email,
					token: req.body.token
				}
			}, (err, result) => {									
				if (err){
					err.data = req.body;
					return callback(err);					
				}
				if (result && result.code !== 'FOUND') return callback({
						code: 'ERR_DRIVER_ACTIVATION_INVALID',
						data: req.body
					});

				callback(null, {
					code: 'DRIVER_ACTIVATION_VALID',
					data: result.data
				});
			});			
		},
		function updatingData (output, callback) {
			driverController.update(req.APP, {
				body: {
					dataQuery: {
						driver_id: output.data[0].dataValues.driver_id
					},
					dataUpdate: {
						status:1
					}
				}
			}, (err, result) => {
				if (err) return callback(err);
				result.data = req.body;
				callback(null, output);
			});	
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);
		return req.APP.output.print(req, res, result);
	});
});

router.post('/login', (req, res, next) => {
	async.waterfall([
		function checkingParameters (callback) {
			if (!req.body.driver_code) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Driver Code'
					}
				});

			if (!req.body.password) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'password'
					}
				});
			callback(null, true);
		},
		function queryDecision (index, callback) {
			if (validation.email(req.body.driver_code) === true) return callback(null, {
					email: req.body.driver_code,
					password: req.body.password,					
				});

			callback(null, {
				driver_code: req.body.driver_code,
				password: req.body.password,				
			});
		},
		function logginIn (query, callback) {
			req.body = query;
			driverController.login(req.APP, req, (err, result) => {
				if (err) return callback(err);

				callback(null, result);
			});
		}
	], (err, result) => {		
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/status', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			req.body.lastupdate = Math.round(new Date().getTime()/1000);			
			callback(null, true);
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.id) && (!req.body.driver_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			if (!req.body.status) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'status'
					}
				});

			if (!req.body.status == 'active' && !req.body.status == 'not-active') return callback({
					code: 'NOT_VALID_KEY',
					data: req.body,
					info: {
						missingParameter: 'status'
					}
				});			
			callback(null, true);
		},
		function dataUpdate (index, callback) {			
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;
			if(req.body.status == 'active'){
				req.body.dataUpdate.status = 1;				
			} else{				
				req.body.dataUpdate.status = 2;
			}
			callback(null, true);
		},
		function gettingData (index, callback) {			
			driverController.update(req.APP, req, (err, result) => {
				if (err) return callback(err);				
				if(result.data.status == 1){
					result.data.status = 'active';	
				} else {
					result.data.status = 'not-active';	
				}
				if(result.code == "DRIVER_UPDATE_SUCCESS"){
					if(result.data.status == 'active'){
						result.code = "DRIVER_ACTIVE_SUCCESS";
					} else {
						result.code = "DRIVER_NOT_ACTIVE_SUCCESS";
					}
				}
				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/resetPassword', (req, res, next) => {
	var password;	
	async.waterfall([
		function aliases (callback) {
			if (req.body.driver_id) req.body.id = req.body.driver_id;
			callback(null, true);
		},		
		function gettingDriver(index, callback) {
			if(req.body.id)
				var id = req.body.id;
			else
				var id = req.body.driver_id
			driverController.find(req.APP, { body:{ id:id } }, (err, result) => {
				if (err) return callback(err);
				var driver_email = result.data[0].email;
				callback(null, driver_email);
			});
		},
		function aliases (driver_email,callback) {
			if(!req.body.password){
				req.body.password = Math.random().toString(36).substring(2, 10);	
			}
			req.body.passwordNoEncpty = req.body.password;
			callback(null, driver_email);
		},
		function dataUpdate (driver_email, callback) {
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;
			callback(null, driver_email);
		},
		function gettingData (driver_email, callback) {
			driverController.update(req.APP, req, (err, result) => {
				if (err) return callback(err);				
				callback(null, driver_email, result);
			});
		},
		function sendEmailPassword(driver_email, response, callback) {   						
			var password = req.body.passwordNoEncpty;
		    delete response.data.password;
			delete response.data.Password;
		    var moment = require('moment');		
		    var params = {
		    	email : driver_email,
		    	subject : 'Information Driver Account - Easy Bensin',
		    	body_email : 'Your password Account is <b> '+password+' </b><br/>'
		    }					   
		    email.send({body:params},function(err,email_result){		    				        
		        if(err){
		        	err.data = response.data;		        	
		          	return callback(err);
		        }			        
		        return callback(null,response);
		    })			    
        }
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);
		return req.APP.output.print(req, res, result);
	});
});

// router.post('/resetPassword', (req, res, next) => {
// 	var password;	
// 	async.waterfall([
// 		function aliases (callback) {
// 			if (req.body.driver_id) req.body.id = req.body.driver_id;
// 			callback(null, true);
// 		},
// 		function checkingParameters (index, callback) {			
// 			if (!req.body.email) return callback({
// 					code: 'MISSING_KEY',
// 					data: req.body,
// 					info: {
// 						missingParameter: 'email'
// 					}
// 				});
					
// 			callback(null, true);
// 		},
// 		function permission (index, callback) {						
// 			if (req.body.otp) {
// 				driverController.otpValidation(req.APP, {
// 					body: {
// 						type: 1,
// 						referrer: req.body.email,
// 						otp: req.body.otp,						
// 						method: 'resetPassworddriver'
// 					}
// 				}, (err, result) => {									
// 					if (err){
// 						err.data = req.body;
// 						return callback(err);					
// 					}
// 					if (result && result.code !== 'OTP_VALID') return callback(result);

// 					callback(null, {
// 						code: result.code,
// 						data: result.data,
// 						valid: true
// 					})
// 				});
// 			} else {
// 				// Send OTP
// 				driverController.otpSend(req.APP, {
// 					body: {
// 						type: 1,
// 						referrer: req.body.email,
// 						baseURL: req.body.url,
// 						method: 'resetPassworddriver'
// 					}
// 				}, (err, result) => {					
// 					if (err) return callback(err);
// 					if (result && result.code !== 'OTP_GENERATED_SUCCESS') return callback(result);
// 					callback(null, {
// 						code: result.code,
// 						data: result.data,
// 						generated: true
// 					});
// 				});
// 			}
// 		},
// 		function updatingData (output, callback) {
// 			console.log("Check Update Data Start");					
// 			if (output.valid) {
// 				if(req.body.password){
// 					password = req.body.password;				
// 					driverController.update(req.APP, {
// 						body: {
// 							dataQuery: {
// 								driver_id: output.data[0].dataValues.driver_id
// 							},
// 							dataUpdate: {
// 								password: req.body.password,
// 								expired_otp:moment().toDate()
// 							},
// 							password: req.body.password
// 						}
// 					}, (err, result) => {
// 						if (err) return callback(err);
// 						result.data = req.body;
// 						callback(null, output);
// 					});	
// 				} else {
// 					return callback(null,output);
// 				}	
// 			} else if (output.generated) {				
// 				return callback(null,output);
// 			} else {
// 				return callback(output);
// 			}
// 		}
// 	], (err, result) => {
// 		if (err) return req.APP.output.print(req, res, err);
// 		return req.APP.output.print(req, res, result);
// 	});
// });


/* UPLOAD IMAGE */
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../public/assets/driver')
  },
  filename: function (req, file, cb) {
    cb(null, md5(Date.now()+file.originalname) + '.' + file.mimetype.split('/')[1]);
  }
});
const upload = multer({storage:storage}).single('photo');
/*--------------*/

function removeFile(file){
	var path = __dirname;
	path = path.replace("\\","/");
	path = path.replace("routes","");
	path = path+ "public/assets/driver/"+file;
	try {
	  fs.unlinkSync(path)
	  //file removed
	} catch(err) {
	  console.error(err)
	}
}

router.post('/insert/upload', (req, res, next) => {
	async.waterfall([		
		function uploadImage(callback){
			try {				
				upload(req, res, (err) => {
					console.log(err);					
					if (err) return callback({
							code: 'ERR_UPLOAD_FAILED',
							data: {
								file: req.file,
								body: req.body 
							}
						});
					console.log(req.body);
					return callback(null, {
						code: 'UPLOAD_SUCCESS',
						data: {
							file: req.file,
						  	body: req.body
						}
					});				
				});
			} catch (err) {	
				console.log(err);			
				return callback({
					code: 'ERR_UPLOAD_FAILED',
					data: {
						file: req.file,
						body: req.body 
					}
				});
			}	
		},
		function checkingParameters ( output, callback) {
			req.body = output.data.body;
			req.body.photo = output.data.file.filename;
			callback(null, true);
		},
		function checkingParameters ( output, callback) {
			if (!req.body.email) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Email'
					}
				});

			if (!req.body.driver_code) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Driver Code'
					}
				});
			
			if (!req.body.name) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Nama'
					}
				});

			if (!req.body.ktp) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'KTP'
					}
				});	

			if (!req.body.sim) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'SIM'
					}
				});	

			if (!req.body.gender) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Gender'
					}
				});								
			callback(null, true);
		},
		function checkingEmail(index,callback) {
			driverController.find(req.APP, {body:{email:req.body.email}}, (err, result) => {
				if (err) return callback(err);
				if (result.code == 'FOUND') return callback({
					code: 'ERR_DRIVER_DUPLICATE',
					data: req.body,
					info: {
						missingParameter: 'email'
					}
				});							
				callback(null, true);
			});
		},
		function checkingdriver_code(index,callback) {
			driverController.find(req.APP, {body:{driver_code:req.body.driver_code}}, (err, result) => {
				if (err) return callback(err);
				if (result.code == 'FOUND') return callback({
					code: 'ERR_DRIVER_DUPLICATE',
					data: req.body,
					info: {
						missingParameter: 'Driver Code'
					}
				});							
				callback(null, true);
			});
		},
		function aliases (index,callback) {
			if (!req.body.driver_id){
				var awal =  Number(moment().year()) + 5;				
				req.body.driver_id = awal.toString() + Math.ceil((microtime.now()/10000));				
			}
			if (!req.body.driver_code){
				var mail =  req.body.email;								
				req.body.driver_code = mail.replace("_","").replace(".","").substring(0, 6).toUpperCase() + 
									Math.random().toString(36).substring(2, 7).toUpperCase();
			}		
			if(!req.body.password){
				req.body.password = Math.random().toString(36).substring(2, 10);	
			}
			req.body.token = Math.random().toString(36).substring(2, 10).toUpperCase();	
			req.body.passwordNoEncpty = req.body.password;
			callback(null, true);
		},		
		function insertData (index, callback) {
			driverController.insert(req.APP, req, (err, result) => {				
				if (err) return callback(err);
				callback(null, result);
			});
		},
		function sendEmailPassword(response, callback) {   						
			if(req.body.sendmail){				
				////Kirim Email
				var password = response.data.password || req.body.passwordNoEncpty;
			    delete response.data.password;
				delete response.data.Password;
			    var moment = require('moment');		
			    var params = {
			    	email : req.body.email,
			    	subject : 'Information Driver Account - Easy Bensin',
			    	body_email : 'Your password Account is <b> '+password+' </b><br/>'
			    }					   
			    email.send({body:params},function(err,email_result){		    				        
			        if(err){
			        	err.data = response.data;		        	
			          	return callback(err);
			        }			        
			        return callback(null,response);
			    })			    
			} else {				
				callback(null,response);
			}			
        },
		function sendEmailActivation(response, callback) {   						
			if(req.body.url){				
				////Kirim Email
				var user_email = req.body.email;
		    	var link = req.body.url+"/"+user_email.replace("@","518ed29525738cebdac49c49e60ea9d3")+"/"+req.body.token;
			    delete response.data.password;
				delete response.data.Password;
			    var moment = require('moment');		
			    var params = {
			    	email : req.body.email,
			    	subject : 'Information Driver Account - Easy Bensin',
			    	body_email : 'Your active Account link is <b> '+link+' </b><br/>'
			    }					   
			    email.send({body:params},function(err,email_result){		    				        
			        if(err){
			        	err.data = response.data;		        	
			          	return callback(err);
			        }			        
			        return callback(null,response);
			    })			    
			} else {				
				callback(null,response);
			}			
        }	
	], (err, result) => {
		if (err){
			removeFile(req.body.photo );
			return req.APP.output.print(req, res, err);
		}

		return req.APP.output.print(req, res, result);
	});
});

router.post('/update/upload', (req, res, next) => {
	var oldphoto;
	async.waterfall([
		function uploadImage(callback){
			try {				
				upload(req, res, (err) => {
					console.log(err);					
					if (err) return callback({
							code: 'ERR_UPLOAD_FAILED',
							data: {
								file: req.file,
								body: req.body 
							}
						});
					console.log(req.body);
					return callback(null, {
						code: 'UPLOAD_SUCCESS',
						data: {
							file: req.file,
						  	body: req.body
						}
					});				
				});
			} catch (err) {	
				console.log(err);			
				return callback({
					code: 'ERR_UPLOAD_FAILED',
					data: {
						file: req.file,
						body: req.body 
					}
				});
			}	
		},
		function aliases (output, callback) {
			req.body = output.data.body;
			req.body.photo = output.data.file.filename;
			req.body.lastupdate = Math.round(new Date().getTime()/1000);
			callback(null, true);
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.id) && (!req.body.car_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function gettingDriver(index, callback) {
			if(req.body.id)
				var id = req.body.id;
			else
				var id = req.body.driver_id
			driverController.find(req.APP, { body:{ id:id } }, (err, result) => {
				if (err) return callback(err);
				oldphoto = result.data[0].photo;
				callback(null, true);
			});
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.id) && (!req.body.driver_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function dataUpdate (index, callback) {
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;

			callback(null, true);
		},
		function gettingData (index, callback) {
			driverController.update(req.APP, req, (err, result) => {
				if (err) return callback(err);
				if(oldphoto)
					removeFile(oldphoto);
				callback(null, result);
			});
		}
	], (err, result) => {
		if (err){
			removeFile(req.body.photo );
			return req.APP.output.print(req, res, err);
		}

		return req.APP.output.print(req, res, result);
	});
});

module.exports = router;