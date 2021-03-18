"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const customerController = require('../controllers/customerController.js');
const ebTransactionController = require('../controllers/ebTransactionController.js');
const TransactionController = require('../controllers/TransactionController.js');
const ebMoneyController = require('../controllers/ebMoneyController.js');
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
			customerController.find(req.APP, req, (err, result) => {
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
			customerController.count(req.APP, req, (err, result) => {
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
	var customer_id;
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.id) && (!req.body.customer_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function checkingEBTransaction (index, callback) {
			if(req.body.id){
				customer_id = req.body.id;
			} else {
				customer_id = req.body.customer_id;
			}
			ebTransactionController.find(req.APP, {body:{customer_id:customer_id}}, (err, result) => {
				if (err) return callback(err);
				if(result.code == "FOUND"){
					return callback({
						code: 'ERR_CUSTOMER_DELETE_FAILED',
						data: req.body
					});		
				}
				callback(null, result);
			});
		},
		function checkingTransaction (index, callback) {
			TransactionController.find(req.APP, {body:{customer_id:customer_id}}, (err, result) => {
				if (err) return callback(err);
				if(result.code == "FOUND"){
					return callback({
						code: 'ERR_CUSTOMER_DELETE_FAILED',
						data: req.body
					});		
				}
				callback(null, result);
			});
		},
		function deleteEBMoney (index, callback) {
			ebMoneyController.delete(req.APP, {body:{customer_id:customer_id}}, (err, result) => {
				if (err) return callback(err);
				callback(null, result);
			});
		},
		function deleteData (index, callback) {
			customerController.delete(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.customer_id) ) return callback({
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
			customerController.update(req.APP, req, (err, result) => {
				if (err) return callback(err);
				callback(null, result);
			});
		}
		// function updateClientAuth(response, callback) {   
		// 	if(req.body.username || req.body.password){
		// 		var params = {};
		// 		if(req.body.username) params.clientId = md5(req.body.username);
		// 		if(req.body.password) params.clientSecret = md5(req.body.password);				      
				
		// 		if(req.body.customer_id) var filter = { userId:req.body.customer_id };
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

			// if (!req.body.username) return callback({
			// 		code: 'MISSING_KEY',
			// 		data: req.body,
			// 		info: {
			// 			missingParameter: 'Username'
			// 		}
			// 	});
			
			if (!req.body.name) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Nama'
					}
				});

			// if (!req.body.ktp) return callback({
			// 		code: 'MISSING_KEY',
			// 		data: req.body,
			// 		info: {
			// 			missingParameter: 'KTP'
			// 		}
			// 	});			

			callback(null, true);
		},
		function checkingEmail(index,callback) {
			customerController.find(req.APP, {body:{email:req.body.email}}, (err, result) => {
				if (err) return callback(err);
				if (result.code == 'FOUND') return callback({
					code: 'ERR_CUSTOMER_DUPLICATE',
					data: req.body,
					info: {
						missingParameter: 'email'
					}
				});							
				callback(null, true);
			});
		},
		// function checkingUsername(index,callback) {
		// 	customerController.find(req.APP, {body:{username:req.body.username}}, (err, result) => {
		// 		if (err) return callback(err);
		// 		if (result.code == 'FOUND') return callback({
		// 			code: 'ERR_CUSTOMER_DUPLICATE',
		// 			data: req.body,
		// 			info: {
		// 				missingParameter: 'username'
		// 			}
		// 		});							
		// 		callback(null, true);
		// 	});
		// },
		function aliases (index,callback) {
			if (!req.body.customer_id){
				var awal =  Number(moment().year()) + 5;				
				req.body.customer_id = awal.toString() + Math.ceil((microtime.now()/10000));				
			}
			// if (!req.body.username){
			// 	var mail =  req.body.email;								
			// 	req.body.username = mail.replace("_","").replace(".","").substring(0, 6).toUpperCase() + 
			// 						Math.random().toString(36).substring(2, 7).toUpperCase();
			// }		
			if(!req.body.password){
				req.body.password = Math.random().toString(36).substring(2, 10);	
			}
			req.body.token = Math.random().toString(36).substring(2, 10).toUpperCase();	
			
			req.body.passwordNoEncpty = req.body.password;
			callback(null, true);
		},		
		function insertData (index, callback) {
			customerController.insert(req.APP, req, (err, result) => {	
				if (err) return callback(err);
				callback(null, result);
			});
		},	
		function insertDataEBMoney (index, callback) {
			ebMoneyController.insert(req.APP, {body:{customer_id:index.data.customer_id}}, (err, result) => {	
				if (err) return callback(err);
				callback(null, index);
			});
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
			    	subject : 'Information Customer Account - Easy Bensin',
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
			    	subject : 'Information Customer - Easy Bensin',
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
		// function insertingClientAuth(response, callback) {   
		// 	var params = {
  //               name: req.body.name || req.body.email ,
  //               clientId: md5(req.body.username),
  //               clientSecret: md5(req.body.passwordNoEncpty),
  //               userId:req.body.customer_id,    
  //               tusers_id:response.data.tusers_id,            
  //               grants: 'client_credentials'
  //           };         
  //           req.APP.models.mongo.OAuthClients.create(params, (err, result) => {
  //               if (err) return callback({
  //                   code: 'ERR_DATABASE',
  //                   data: JSON.stringify(err)
  //               });
  //               delete params.name;
  //               var oAuth = params;                
  //               oAuth.HeaderAuth = new Buffer(params.clientId + ':' + params.clientSecret).toString('base64');
  //               return callback(null,response,oAuth);
  //           });
  //       },
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
			customerController.find(req.APP, {
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
						code: 'ERR_CUSTOMER_ACTIVATION_INVALID',
						data: req.body
					});

				callback(null, {
					code: 'CUSTOMER_ACTIVATION_VALID',
					data: result.data
				});
			});			
		},
		function updatingData (output, callback) {
			if(!req.body.check){
				customerController.update(req.APP, {
					body: {
						dataQuery: {
							customer_id: output.data[0].dataValues.customer_id
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
			} else {
				callback(null, output);
			}
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);
		return req.APP.output.print(req, res, result);
	});
});

router.post('/login', (req, res, next) => {
	async.waterfall([
		function checkingParameters (callback) {
			// if (!req.body.username) return callback({
			// 		code: 'MISSING_KEY',
			// 		data: req.body,
			// 		info: {
			// 			missingParameter: 'username'
			// 		}
			// 	});

			if (!req.body.email) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'email'
					}
				});

			if (!req.body.password) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'password'
					}
				});
			callback(null, req.body);
		},
		// function queryDecision (index, callback) {
		// 	if (validation.email(req.body.username) === true) return callback(null, {
		// 			email: req.body.username,
		// 			password: req.body.password,					
		// 		});

		// 	callback(null, {
		// 		username: req.body.username,
		// 		password: req.body.password,				
		// 	});
		// },
		function logginIn (query, callback) {
			req.body = query;
			customerController.login(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.customer_id) ) return callback({
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
			customerController.update(req.APP, req, (err, result) => {
				if (err) return callback(err);				
				if(result.data.status == 1){
					result.data.status = 'active';	
				} else {
					result.data.status = 'not-active';	
				}
				if(result.code == "CUSTOMER_UPDATE_SUCCESS"){
					if(result.data.status == 'active'){
						result.code = "CUSTOMER_ACTIVE_SUCCESS";
					} else {
						result.code = "CUSTOMER_NOT_ACTIVE_SUCCESS";
					}
				}
				callback(null, result);
			});
		}
		// ,
		// function updateClientAuth(response, callback) {
		// 	var params = {};
		// 	if(req.body.status == 'active')
		// 		params.status = true;
		// 	else
		// 		params.status = false;
		// 	req.APP.models.mongo.OAuthClients.findOneAndUpdate({userId:req.body.userId}, params, {upsert:true}, (err, result) => {
		// 		if (err) return callback({
		// 			code: 'ERR_DATABASE',
		// 			data: JSON.stringify(err)
		// 		});	
		// 		return callback(null,response);
		// 	});	
		// }
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/resetPassword', (req, res, next) => {
	var password;	
	async.waterfall([
		function aliases (callback) {
			if (req.body.customer_id) req.body.id = req.body.customer_id;
			callback(null, true);
		},
		function checkingParameters (index, callback) {			
			if (!req.body.email) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'email'
					}
				});
					
			callback(null, true);
		},
		function permission (index, callback) {						
			if (req.body.otp) {
				customerController.otpValidation(req.APP, {
					body: {
						type: 1,
						referrer: req.body.email,
						otp: req.body.otp,						
						method: 'resetPasswordcustomer'
					}
				}, (err, result) => {									
					if (err){
						err.data = req.body;
						return callback(err);					
					}
					if (result && result.code !== 'OTP_VALID') return callback(result);

					callback(null, {
						code: result.code,
						data: result.data,
						valid: true
					})
				});
			} else {
				
				customerController.otpSend(req.APP, {
					body: {
						type: 1,
						referrer: req.body.email,
						baseURL: req.body.url,
						method: 'resetPasswordCustomer'
					}
				}, (err, result) => {					
					if (err) return callback(err);
					if (result && result.code !== 'OTP_GENERATED_SUCCESS') return callback(result);
					callback(null, {
						code: result.code,
						data: result.data,
						generated: true
					});
				});
			}
		},
		function updatingData (output, callback) {
			console.log("Check Update Data Start");					
			if (output.valid) {
				if(req.body.password){
					password = req.body.password;				
					customerController.update(req.APP, {
						body: {
							dataQuery: {
								customer_id: output.data[0].dataValues.customer_id
							},
							dataUpdate: {
								password: req.body.password,
								expired_otp:moment().toDate()
							},
							password: req.body.password
						}
					}, (err, result) => {
						if (err) return callback(err);
						result.data = req.body;
						callback(null, output);
					});	
				} else {
					return callback(null,output);
				}	
			} else if (output.generated) {				
				return callback(null,output);
			} else {
				return callback(output);
			}
		},
		// 
		// function updateClientAuth(output,response, callback) {   			
		// 	if(output){
		// 		var params = {
		// 			clientSecret : md5(password)
		// 		};									    
	 //            req.APP.models.mongo.OAuthClients.findOneAndUpdate({userId:output.data[0].dataValues.Userid}, params, {upsert:true}, (err, result) => {	                	            	
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


router.post('/updatepass', (req, res, next) => {
	async.waterfall([
		function checkingParameters (callback) {
			if ((!req.body.id) && (!req.body.customer_id)) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			if (!req.body.oldpassword) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'old password'
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
		function checkingPassword (index, callback) {
			customerController.checkPass(req.APP, {
				body:{
					id:req.body.id,
					password:req.body.oldpassword
				}
			}, (err, result) => {
				if (err) return callback(err);
				callback(null, result);
			});
		},
		function updatingData (output, callback) {
			customerController.update(req.APP, {
				body: {
					dataQuery: {
						customer_id: req.body.id,
					},
					dataUpdate: {
						password: req.body.password
					},
					password: req.body.password
				}
			}, (err, result) => {
				if (err) return callback(err);
				result.data = req.body;
				callback(null, result);
			});	
		}
	], (err, result) => {		
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});



module.exports = router;