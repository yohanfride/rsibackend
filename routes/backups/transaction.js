"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const TransactionController = require('../controllers/TransactionController.js');
const ebMoneyController = require('../controllers/ebMoneyController.js');
const ebTransactionController = require('../controllers/ebTransactionController.js');
const carDriverController = require('../controllers/carDriverController.js');
const carController = require('../controllers/carController.js');
const sectorController = require('../controllers/sectorController.js');
const router = express.Router();
const moment = require('moment');
var email = require('../functions/email.js');
var fcm = require('../functions/fcm.js');
const Xendit = require('xendit-node');
var mqttcom = require('../functions/mqttcom.js');
const { EWallet } = new Xendit({
  secretKey: process.env.XENDIT_API_KEY
});
const ewalletSpecificOptions = {};
const ew = new EWallet(ewalletSpecificOptions);
var output = {};

router.post('/get-detail', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			if(req.body.str_date) req.body.str_date = req.body.str_date+"T00:00:00.000";
			if(req.body.end_date) req.body.end_date = req.body.end_date+"T23:59:59.000";
			if(req.body.str_date_finish) req.body.str_date_finish = req.body.str_date_finish+"T00:00:00.000";
			if(req.body.end_date_finish) req.body.end_date_finish = req.body.end_date_finish+"T23:59:59.000";
			callback(null, true);
		},
		function gettingData (index, callback) {
			TransactionController.find(req.APP, req, (err, result) => {
				if (err) return callback(err);

				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			if(req.body.str_date) req.body.str_date = req.body.str_date+"T00:00:00.000";
			if(req.body.end_date) req.body.end_date = req.body.end_date+"T23:59:59.000";
			if(req.body.str_date_finish) req.body.str_date_finish = req.body.str_date_finish+"T00:00:00.000";
			if(req.body.end_date_finish) req.body.end_date_finish = req.body.end_date_finish+"T23:59:59.000";
			callback(null, true);
		},
		function gettingData (index, callback) {
			TransactionController.find(req.APP, req, (err, result) => {
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
		function aliases (callback) {
			if(req.body.str_date) req.body.str_date = req.body.str_date+"T00:00:00.000";
			if(req.body.end_date) req.body.end_date = req.body.end_date+"T23:59:59.000";
			if(req.body.str_date_finish) req.body.str_date_finish = req.body.str_date_finish+"T00:00:00.000";
			if(req.body.end_date_finish) req.body.end_date_finish = req.body.end_date_finish+"T23:59:59.000";
				
			callback(null, true);
		},
		function gettingData (index, callback) {
			TransactionController.count(req.APP, req, (err, result) => {
				if (err) return callback(err);
				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/insert', (req, res, next) => {
	var balance;
	async.waterfall([		
		function checkingParameters ( callback) {
			if (!req.body.customer_id) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Customer'
					}
				});
			if(!req.body.customer_add){
				if (!req.body.driver_id) return callback({
						code: 'MISSING_KEY',
						data: req.body,
						info: {
							missingParameter: 'Driver Id'
						}
					});	

			if (!req.body.car_id) return callback({
						code: 'MISSING_KEY',
						data: req.body,
						info: {
							missingParameter: 'Car Id'
						}
					});	
			}
			if (!req.body.total_fuel) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Total Fuel'
					}
				});	

			if (!req.body.fuel_type) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Fuel Type'
					}
				});	

			if (!req.body.pay) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Pay'
					}
				});	
			if (!req.body.location_lat) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Location Lat'
					}
				});
			if (!req.body.location_lng) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Location Lng'
					}
				});							
			callback(null, true);
		},
		function aliases (index,callback) {
			if(!req.body.status){
				req.body.status = 0;
			}
			if (!req.body.transaction_code){			
				req.body.transaction_code = req.body.customer_id + Math.ceil((microtime.now()/10000));				
			}			
			callback(null, true);
		},
		///Convert GPS location to sector based on PIP Algorithm
		function getSector (index, callback) {
			var query = {
				body:{
					latitude: req.body.location_lat,
					longitude: req.body.location_lng
				}
			}
			sectorController.findsector(req.APP, query, (err, result) => {				
				if (err)return callback(err);
				var data = result.data;
				if(data.total){
					req.body.sector = data.sector[0];
				}
				callback(null, true);
			});
		},
		///Select Car based on sector data
		function getCarDriverBySector (index, callback) {
			if(req.body.customer_add && req.body.sector){
				var now = moment().format("YYYY-MM-DD");
				var query = {
					body:{
						str_date: now+"T00:00:00.000",
						end_date: now+"T23:59:59.000",
						status:1,
						fuel:req.body.fuel_type,
						sector:req.body.sector
					}
				}
				carDriverController.find(req.APP, query, (err, result) => {				
					if (err)return callback(err);
					var data = result.data;
					if(result.code == 'FOUND'){
						req.body.car_id = data[0].car_id;					
						req.body.driver_id = data[0].driver_id;	
					}
					callback(null, true);
				});
			} else {
				callback(null, true);
			}
		},
		///Select Car based on geospatial position, order by nearest
		function getCarDriver (index, callback) {
			if(req.body.customer_add && !(req.body.car_id) ){
				var now = moment().format("YYYY-MM-DD");
				var query = {
					body:{
						str_date: now+"T00:00:00.000",
						end_date: now+"T23:59:59.000",
						status:1,
						nearest:1,
						fuel:req.body.fuel_type,
						pointLat:req.body.location_lat,
						pointLng:req.body.location_lng
					}
				}
				carDriverController.find(req.APP, query, (err, result) => {				
					if (err)return callback(err);
					var data = result.data;
					if(result.code == 'FOUND'){
						req.body.car_id = data[0].car_id;					
						req.body.driver_id = data[0].driver_id;	
					} else {
						return callback({
							code: 'ERR__TRANSACTION_CAR_NOT_FOUND',
							data: req.body
						});
					}
					callback(null, true);
				});
			} else {
				callback(null, true);
			}
		},
		function gettingCarTank(index, callback) {
			carController.find(req.APP, { body:{ id:req.body.car_id } }, (err, result) => {
				if (err) return callback(err);
				var tank = parseFloat( parseFloat(result.data[0].tank) - parseFloat(req.body.total_fuel) );
				if(tank<0) return callback({
					code: 'ERR__CAR_TANK',
					data: req.body
				});
				callback(null, true);
			});
		},	
		function insertData (index, callback) {
			TransactionController.insert(req.APP, req, (err, result) => {				
				if (err) return callback(err);
				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/cancel', (req, res, next) => {
	var balance;
	async.waterfall([
		function checkingParameters (callback) {
			if ( (!req.body.id) && (!req.body.transaction_id) )  return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			if ( !req.body.cancel_by )  return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'cancel by'
					}
				});

			if ( !req.body.cancel_info )  return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'cancel info'
					}
				});

			callback(null, true);
		},
		function aliases (index, callback) {
			if ( !req.body.date_finish )
				req.body.date_finish = moment().toISOString(true).split("+")[0]+"Z";
			if( new String(req.body.cancel_by).toLowerCase() == 'customer' ){
				req.body.status = 7;

			}
			if( new String(req.body.cancel_by).toLowerCase() == 'driver' ){
				req.body.status = 6;
			}			
			callback(null, true);
		},
		function gettingDataTrans (index, callback) {
			if ( req.body.id )
				var id = req.body.id;
			else
				var id = req.body.transaction_id; 
			TransactionController.find(req.APP, { body:{ id: id } }, (err, result) => {
				if (err) return callback(err);
				var data = result.data[0];
				if( (data.status == 1) || (data.status == 4) || (data.status == 5)){
					 return callback({
						code: 'ERR__TRANSACTION_DELETE_FAILED',
						data: req.body
					});
				}
				callback(null,data);
			});
		},
		function aliasesParameter (trans, callback) {
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;			
			callback(null, trans);
		},
		function updateData (trans, callback) {
			TransactionController.update(req.APP, req, (err, result) => {
				if (err) return callback(err);
				result.code = "TRANSACTION_CANCEL_SUCCESS";
				callback(null,trans, result);
			});
		},
		function sendFCM(trans, index, callback){
			if( new String(req.body.cancel_by).toLowerCase() == 'driver' && (trans.fcm_device_id) ){
				var message = {
					notification:{
						title: "PT. Solusi Integra Indonesia - Transaction Order",
			            body: "Canceled By Driver",
			            icon: "/icon-eb.png",
			            click_action: "easy-customer"
			        }
				}
				var params = {
			    	registrationToken : trans.fcm_device_id,
			    	message : message
			    }
				fcm.send({body:params},function(err,result){		    				        
			        if(err){
			        	console.log(err);
			        }			        
			        callback(null,trans, index);
			    })
			} else {
				callback(null,trans, index);
			}
		},
		function payTransaction (trans, index, callback) {
			if(trans.status){
				if(trans.paid) 
					var pay = trans.pay;
				else 
					var pay = 0;
				console.log("---payTransacation---");
				ebTransactionController.insert(req.APP, { body:{
					account:"CANCEL-ORDER-TRANSACTION",
					transaction_code:trans.transaction_code,
					customer_id:trans.customer_id,
					credit:pay,
					information:"Cancel Order Transaction - "+trans.transaction_code
				} }, (err, result) => {
					if (err) return callback({
						code: 'ERR_DATABASE',
						data: req.body
					});
					callback(null,index);
				});
			} else {
				callback(null, index);
			}
		}

	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/update', (req, res, next) => {
	var balance;
	var message_body;
	async.waterfall([
		function aliases (callback) {
			if(!req.body.status){
				req.body.status = 0;
			}
			if( req.body.status == 2 ){
				if(!req.body.date_take_order){
					req.body.date_take_order = moment().toISOString(true).split("+")[0]+"Z";
				}
				message_body = "Driver on The Way to Your Location"
			}
			
			if( req.body.status == 3 ){
				if(!req.body.date_on_location){
					req.body.date_on_location = moment().toISOString(true).split("+")[0]+"Z";
				}
				message_body = "Driver Arrives to Your Location";
			}

			if( req.body.status == 4 ){
				if(!req.body.date_start_transaction){
					req.body.date_start_transaction = moment().toISOString(true).split("+")[0]+"Z";
				}
				message_body = "Start Refuelling Transaction on Your Car";
			}	

			if( req.body.status == 5 || req.body.status == 1 ){
				if(!req.body.date_finish){
					req.body.date_finish = moment().toISOString(true).split("+")[0]+"Z";
				}
				message_body = "Transaction Finished";
			}	
			callback(null, true);
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.id) && (!req.body.transaction_id) )  return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function gettingDataTrans (index, callback) {
			if ( req.body.id )
				var id = req.body.id;
			else
				var id = req.body.transaction_id; 
			TransactionController.find(req.APP, { body:{ id: id, detail:true } }, (err, result) => {
				if (err) return callback(err);
				console.log(result);
				var data = result.data[0];
				callback(null,data);
			});
		},
		function aliasesParameter (trans, callback) {
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;			
			callback(null, trans );
		},
		function updateData (trans, callback) {
			TransactionController.update(req.APP, req, (err, result) => {				
				if (err) return callback(err);
				callback(null,trans, result);
			});
		},
		function sendFCM(trans, index, callback){
			if(trans.fcm_device_id){
				var message = {
					notification:{
						title: "PT. Solusi Integra Indonesia - Transaction Order",
			            body: message_body,
			            icon: "/icon-eb.png",
			            click_action: "easy-customer"
					}
				}
				var params = {
			    	registrationToken : trans.fcm_device_id,
			    	message : message
			    }
				fcm.send({body:params},function(err,result){		    				        
			        if(err){
			        	console.log(err);
			        }			        
			        callback(null,trans, index);
			    })
			} else {
			    callback(null,trans, index);
			}
		},
		function sendMQTT(trans, index, callback){
			if( req.body.status == 4 ){
				var device_id = trans.car.device_id;
				var topic = "managerial/transaction/"+device_id;
				var data = {
					"flow_clock": trans.car.flow_clock,
    				"total":trans.total_fuel,
				}
				mqttcom.send({topic:topic,data:data},function(err,result){		    				        
			        if(err){
			        	console.log(err);
			        }			        
			        console.log(result);
			    });	
			}
		},
		function sendEmailStruct(trans, index, callback) {   						
			console.log("---sendEmailStruct---");
			if( !(req.body.status == 5 || req.body.status == 1) ){
				callback(null,index);
			} else if(req.body.sendmail){	
				if(!trans.date_finish) trans.date_finish = req.body.date_finish;
				email.struct_transaction({body:{data:trans}},(err,body_email) => {		    				        
			        if(err){
			        	err.data = req.body;		        	
			          	return callback(err);
			        }	
			        ////Kirim Email
					var user_email = trans.customer.email;
				    var params = {
				    	email : user_email,
				    	subject : 'Transaction Struct - '+trans.transaction_code,
				    	body_email : body_email
				    }					   
				    email.send({body:params},function(err,email_result){		    				        
				        if(err){
				        	err.data = req.body;		        	
				          	return callback(err);
				        }			        
				        return callback(null,index);
				    })				        
			    });			
			} else {				
				callback(null,index);
			}			
        },
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/payment', (req, res, next) => {
	async.waterfall([
		function checkingParameters (callback) {
			if ( (!req.body.id) && (!req.body.transaction_id) )  return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			if ( (!req.body.phone) )  return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			if ( (!req.body.payment_method) )
				req.body.payment_method = 'OVO';
			callback(null, true);
		},
		function gettingDataTrans (index, callback) {
			if ( req.body.id )
				var id = req.body.id;
			else
				var id = req.body.transaction_id; 
			TransactionController.find(req.APP, { body:{ id: id, detail:true } }, (err, result) => {
				if (err) return callback(err);
				var data = result.data[0];
				callback(null,data);
			});
		},
		function createPayment (trans, callback) {
			console.log("------PAYMENT-------");
			var params = {
			  externalID: trans.transaction_code+"-"+Math.ceil((microtime.now()/10000)),
			  amount: trans.pay,
			  phone: req.body.phone,
			  ewalletType: EWallet.Type.OVO,
			};
			console.log(params);
			ew.createPayment(params).then(r => {
			  	callback(null,trans,{
					code: 'TRANSACTION_PAYMENT_SUCCESS',
					data: params
				});
			}).catch((error) => {
			  	return callback({
					code: 'ERR__TRANSACTION_PAYMENT',
					data: req.body,
					info:error
				});
			});
		},
		function aliasesParameter (trans, index, callback) {
			var params = {
				body:{
					id:trans.transaction_id,
					date_create_payment:moment().toISOString(true).split("+")[0]+"Z",
					payment_method:req.body.payment_method
				}
			}
			params.body.dataQuery = params.body;
			params.body.dataUpdate = params.body;			
			callback(null, params, index);
		},
		function updateData (params, index, callback) {
			TransactionController.update(req.APP, params, (err, result) => {				
				if (err) return callback(err);
				callback(null,index);
			});
		},
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/getgroup', (req, res, next) => {
	async.waterfall([
		function checkingParameters ( callback) {
			if (!req.body.groupby) return callback({
				code: 'MISSING_KEY',
				data: req.body,
				info: {
					missingParameter: 'Group By'
				}
			});							
			callback(null, true);
		},
		function aliases (index,callback) {			
			if(req.body.str_date) req.body.str_date = req.body.str_date+"T00:00:00.000";
			if(req.body.end_date) req.body.end_date = req.body.end_date+"T23:59:59.000";
			if(req.body.str_date_finish) req.body.str_date_finish = req.body.str_date_finish+"T00:00:00.000";
			if(req.body.end_date_finish) req.body.end_date_finish = req.body.end_date_finish+"T23:59:59.000";
			callback(null, true);
		},
		function gettingData (index, callback) {
			TransactionController.group(req.APP, req, (err, result) => {
				if (err) return callback(err);

				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/email', (req, res, next) => {
	async.waterfall([
		function checkingParameters (callback) {
			if ( (!req.body.id) && (!req.body.transaction_id) )  return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});
			callback(null, true);
		},
		function gettingData (index, callback) {
			req.body.detail = true;
			TransactionController.find(req.APP, req, (err, result) => {
		        console.log(err);	        
				console.log("---------------------------")
				if (err) return callback(err);
				var data = result.data[0];
				callback(null,data);
			});
		},
		function sendEmailStruct(data, callback) {   						
			email.struct_transaction({body:{data:data}},(err,body_email) => {		    				        
		        if(err){
		        	err.data = req.body;		        	
		          	return callback(err);
		        }	
		        ////Kirim Email
				var user_email = data.customer.email;
			    var params = {
			    	email : user_email,
			    	subject : 'Transaction Struct - '+data.transaction_code,
			    	body_email : body_email
			    }					   
			    email.send({body:params},function(err,email_result){		    				        
			        if(err){
			        	err.data = req.body;		        	
			          	return callback(err);
			        }			        
			        return callback(null,{
						code: 'TRANSACTION_EMAIL_SUCCESS',
						data: req.body
					});
			    })				        
		    });			
        }
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/delete', (req, res, next) => {
	var balance;
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.id) && (!req.body.transaction_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},		
		function gettingDataTrans (index, callback) {
			if ( req.body.id )
				var id = req.body.id;
			else
				var id = req.body.transaction_id; 
			
			TransactionController.find(req.APP, { body:{ id: id } }, (err, result) => {
				if (err) return callback(err);
				var data = result.data[0];
				if( (data.status == 1) || (data.status == 3) ){
					 return callback({
						code: 'ERR__TRANSACTION_DELETE_FAILED',
						data: req.body
					});
				}
				callback(null,data);
			});
		},
		function gettingDataEBMoney (trans, callback) {
			console.log(trans);
			ebMoneyController.find(req.APP, { body:{ customer_id: trans.customer_id } }, (err, result) => {
				if (err) return callback(err);
				if(trans.status){
					balance = parseFloat( parseFloat(result.data[0].money) + parseFloat(trans.pay) );										
				}
				callback(null, trans, result);
			});
		},
		function gettingData (trans, ebmoney, callback) {
			TransactionController.delete(req.APP, req, (err, result) => {
				if (err) return callback(err);

				callback(null, trans, ebmoney, result);
			});
		},
		function payTransaction (trans, ebmoney, index, callback) {
			if(trans.status){
				console.log("---payTransacation---");
				ebMoneyController.update(req.APP,{ body:{
					dataQuery:{ id:ebmoney.data[0].ebmoney_id },
					dataUpdate:{ money: balance }
				} }, (err, result) => {
					console.log(err);
					if (err) return callback({
						code: 'ERR_DATABASE',
						data: req.body
					});
					callback(null,trans, index);
				});
			} else {
				callback(null,trans, index);
			}
		},
		function payTransaction2 (trans, index, callback) {
			if(trans.status){
				console.log("---payTransacation2---");
				ebTransactionController.insert(req.APP, { body:{
					account:"CANCEL-ORDER-TRANSACTION",
					transaction_code:trans.transaction_code,
					customer_id:trans.customer_id,
					credit:trans.pay,
					balance:balance,
					information:"Cancel Order Transaction - "+trans.transaction_code
				} }, (err, result) => {
					if (err) return callback({
						code: 'ERR_DATABASE',
						data: req.body
					});
					callback(null,index);
				});
			} else {
				callback(null, index);
			}
		}

	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/searchcar', (req, res, next) => {
	var balance;
	async.waterfall([		
		function checkingParameters ( callback) {
			if (!req.body.location_lat) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Location Latitude'
					}
				});
			if (!req.body.location_lng) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Location Longitude'
					}
				});		
			if (!req.body.fuel_type) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Fuel Type'
					}
				});						
			callback(null, true);
		},
		///Convert GPS location to sector based on PIP Algorithm
		function getSector (index, callback) {
			var query = {
				body:{
					latitude: req.body.location_lat,
					longitude: req.body.location_lng
				}
			}
			sectorController.findsector(req.APP, query, (err, result) => {				
				if (err)return callback(err);
				console.log("--------SEKTOR------------");
				console.log(data)
				console.log("--------------------");
				var data = result.data;
				if(data.total){
					req.body.sector = data.sector[0];
				}
				callback(null, true);
			});
		},
		///Select Car based on sector data
		function getCarDriverBySector (index, callback) {
			console.log("getCarDriverBySector");
			if(req.body.sector){
				var now = moment().format("YYYY-MM-DD");
				var query = {
					body:{
						str_date: now+"T00:00:00.000",
						end_date: now+"T23:59:59.000",
						status:1,
						fuel:req.body.fuel_type,
						sector:req.body.sector
					}
				}
				carDriverController.find(req.APP, query, (err, result) => {				
					if (err)return callback(err);

					if(result.code == 'FOUND'){
						var data = result.data[0];
						data.sector = req.body.sector;
						result.data = data;
						callback(null, result);
					} else {
						callback(null, false);
					}
				});
			} else {
				callback(null, false);
			}
		},
		///Select Car based on geospatial position, order by nearest
		function getCarDriver (index, callback) {
			console.log("getCarDriver");
			if(!index){
				var now = moment().format("YYYY-MM-DD");
				var query = {
					body:{
						str_date: now+"T00:00:00.000",
						end_date: now+"T23:59:59.000",
						status:1,
						nearest:1,
						fuel:req.body.fuel_type,
						pointLat:req.body.location_lat,
						pointLng:req.body.location_lng
					}
				}
				carDriverController.find(req.APP, query, (err, result) => {				
					if (err)return callback(err);
					console.log("-----------");
					console.log(result.data);
					console.log("-----------");
					if(result.code == 'FOUND'){
						var data = result.data[0];
						data.sector = req.body.sector;
						result.data = data;
						callback(null, result);
					} else {
						return callback({
							code: 'ERR__TRANSACTION_CAR_NOT_FOUND',
							data: req.body
						});
					}
				});
			} else {
				callback(null, index);
			}
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});


module.exports = router;

// Backup COde With EBMONEY
// router.post('/cancel', (req, res, next) => {
// 	var balance;
// 	async.waterfall([
// 		function checkingParameters (callback) {
// 			if ( (!req.body.id) && (!req.body.transaction_id) )  return callback({
// 					code: 'MISSING_KEY',
// 					data: req.body,
// 					info: {
// 						missingParameter: 'id'
// 					}
// 				});

// 			if ( !req.body.cancel_by )  return callback({
// 					code: 'MISSING_KEY',
// 					data: req.body,
// 					info: {
// 						missingParameter: 'cancel by'
// 					}
// 				});

// 			if ( !req.body.cancel_info )  return callback({
// 					code: 'MISSING_KEY',
// 					data: req.body,
// 					info: {
// 						missingParameter: 'cancel info'
// 					}
// 				});

// 			callback(null, true);
// 		},
// 		function aliases (index, callback) {
// 			if ( !req.body.date_finish )
// 				req.body.date_finish = moment().toISOString(true).split("+")[0]+"Z";
// 			if( new String(req.body.cancel_by).toLowerCase() == 'customer' ){
// 				req.body.status = 7;

// 			}
// 			if( new String(req.body.cancel_by).toLowerCase() == 'driver' ){
// 				req.body.status = 6;
// 			}			
// 			callback(null, true);
// 		},
// 		function gettingDataTrans (index, callback) {
// 			if ( req.body.id )
// 				var id = req.body.id;
// 			else
// 				var id = req.body.transaction_id; 
// 			TransactionController.find(req.APP, { body:{ id: id } }, (err, result) => {
// 				if (err) return callback(err);
// 				var data = result.data[0];
// 				if( (data.status == 1) || (data.status == 4) || (data.status == 5)){
// 					 return callback({
// 						code: 'ERR__TRANSACTION_DELETE_FAILED',
// 						data: req.body
// 					});
// 				}
// 				callback(null,data);
// 			});
// 		},
// 		function gettingDataEBMoney (trans, callback) {
// 			ebMoneyController.find(req.APP, { body:{ customer_id: trans.customer_id } }, (err, result) => {
// 				if (err) return callback(err);
// 				if(trans.status){
// 					balance = parseFloat( parseFloat(result.data[0].money) + parseFloat(trans.pay) );										
// 				}
// 				callback(null, trans, result);
// 			});
// 		},
// 		function aliasesParameter (trans, ebmoney, callback) {
// 			req.body.dataQuery = req.body;
// 			req.body.dataUpdate = req.body;			
// 			callback(null, trans, ebmoney);
// 		},
// 		function updateData (trans, ebmoney, callback) {
// 			TransactionController.update(req.APP, req, (err, result) => {
// 				if (err) return callback(err);
// 				result.code = "TRANSACTION_CANCEL_SUCCESS";
// 				callback(null,trans, ebmoney, result);
// 			});
// 		},
// 		function sendFCM(trans, ebmoney, index, callback){
// 			if( new String(req.body.cancel_by).toLowerCase() == 'driver' && (trans.fcm_device_id) ){
// 				var message = {
// 					notification:{
// 						title: "PT. Solusi Integra Indonesia - Transaction Order",
// 			            body: "Canceled By Driver",
// 			            icon: "/icon-eb.png",
// 			            click_action: "easy-customer"
// 			        }
// 				}
// 				var params = {
// 			    	registrationToken : trans.fcm_device_id,
// 			    	message : message
// 			    }
// 				fcm.send({body:params},function(err,result){		    				        
// 			        if(err){
// 			        	console.log(err);
// 			        }			        
// 			        callback(null,trans, ebmoney, index);
// 			    })
// 			} else {
// 				callback(null,trans, ebmoney, index);
// 			}
// 		},
// 		function payTransaction (trans, ebmoney, index, callback) {
// 			if(trans.status){
// 				console.log("---payTransacation---");
// 				ebMoneyController.update(req.APP,{ body:{
// 					dataQuery:{ id:ebmoney.data[0].ebmoney_id },
// 					dataUpdate:{ money: balance }
// 				} }, (err, result) => {
// 					console.log(err);
// 					if (err) return callback({
// 						code: 'ERR_DATABASE',
// 						data: req.body
// 					});
// 					callback(null,trans, index);
// 				});
// 			} else {
// 				callback(null,trans, index);
// 			}
// 		},
// 		function payTransaction2 (trans, index, callback) {
// 			if(trans.status){
// 				console.log("---payTransacation2---");
// 				ebTransactionController.insert(req.APP, { body:{
// 					account:"CANCEL-ORDER-TRANSACTION",
// 					transaction_code:trans.transaction_code,
// 					customer_id:trans.customer_id,
// 					credit:trans.pay,
// 					balance:balance,
// 					information:"Cancel Order Transaction - "+trans.transaction_code
// 				} }, (err, result) => {
// 					if (err) return callback({
// 						code: 'ERR_DATABASE',
// 						data: req.body
// 					});
// 					callback(null,index);
// 				});
// 			} else {
// 				callback(null, index);
// 			}
// 		}

// 	], (err, result) => {
// 		if (err) return req.APP.output.print(req, res, err);

// 		return req.APP.output.print(req, res, result);
// 	});
// });

// router.post('/delete', (req, res, next) => {
// 	var balance;
// 	async.waterfall([
// 		function aliases (callback) {			
// 			callback(null, true);
// 		},
// 		function checkingParameters (index, callback) {
// 			if ( (!req.body.id) && (!req.body.transaction_id) ) return callback({
// 					code: 'MISSING_KEY',
// 					data: req.body,
// 					info: {
// 						missingParameter: 'id'
// 					}
// 				});

// 			callback(null, true);
// 		},		
// 		function gettingDataTrans (index, callback) {
// 			if ( req.body.id )
// 				var id = req.body.id;
// 			else
// 				var id = req.body.transaction_id; 
			
// 			TransactionController.find(req.APP, { body:{ id: id } }, (err, result) => {
// 				if (err) return callback(err);
// 				var data = result.data[0];
// 				if( (data.status == 1) || (data.status == 3) ){
// 					 return callback({
// 						code: 'ERR__TRANSACTION_DELETE_FAILED',
// 						data: req.body
// 					});
// 				}
// 				callback(null,data);
// 			});
// 		},
// 		function gettingDataEBMoney (trans, callback) {
// 			console.log(trans);
// 			ebMoneyController.find(req.APP, { body:{ customer_id: trans.customer_id } }, (err, result) => {
// 				if (err) return callback(err);
// 				if(trans.status){
// 					balance = parseFloat( parseFloat(result.data[0].money) + parseFloat(trans.pay) );										
// 				}
// 				callback(null, trans, result);
// 			});
// 		},
// 		function gettingData (trans, ebmoney, callback) {
// 			TransactionController.delete(req.APP, req, (err, result) => {
// 				if (err) return callback(err);

// 				callback(null, trans, ebmoney, result);
// 			});
// 		},
// 		function payTransaction (trans, ebmoney, index, callback) {
// 			if(trans.status){
// 				console.log("---payTransacation---");
// 				ebMoneyController.update(req.APP,{ body:{
// 					dataQuery:{ id:ebmoney.data[0].ebmoney_id },
// 					dataUpdate:{ money: balance }
// 				} }, (err, result) => {
// 					console.log(err);
// 					if (err) return callback({
// 						code: 'ERR_DATABASE',
// 						data: req.body
// 					});
// 					callback(null,trans, index);
// 				});
// 			} else {
// 				callback(null,trans, index);
// 			}
// 		},
// 		function payTransaction2 (trans, index, callback) {
// 			if(trans.status){
// 				console.log("---payTransacation2---");
// 				ebTransactionController.insert(req.APP, { body:{
// 					account:"CANCEL-ORDER-TRANSACTION",
// 					transaction_code:trans.transaction_code,
// 					customer_id:trans.customer_id,
// 					credit:trans.pay,
// 					balance:balance,
// 					information:"Cancel Order Transaction - "+trans.transaction_code
// 				} }, (err, result) => {
// 					if (err) return callback({
// 						code: 'ERR_DATABASE',
// 						data: req.body
// 					});
// 					callback(null,index);
// 				});
// 			} else {
// 				callback(null, index);
// 			}
// 		}

// 	], (err, result) => {
// 		if (err) return req.APP.output.print(req, res, err);

// 		return req.APP.output.print(req, res, result);
// 	});
// });

// router.post('/update', (req, res, next) => {
// 	var balance;
// 	var message_body;
// 	async.waterfall([
// 		function aliases (callback) {
// 			if(!req.body.status){
// 				req.body.status = 0;
// 			}
// 			if( req.body.status == 2 ){
// 				if(!req.body.date_take_order){
// 					req.body.date_take_order = moment().toISOString(true).split("+")[0]+"Z";
// 				}
// 				message_body = "Driver on The Way to Your Location"
// 			}
			
// 			if( req.body.status == 3 ){
// 				if(!req.body.date_on_location){
// 					req.body.date_on_location = moment().toISOString(true).split("+")[0]+"Z";
// 				}
// 				message_body = "Driver Arrives to Your Location";
// 			}

// 			if( req.body.status == 4 ){
// 				if(!req.body.date_start_transaction){
// 					req.body.date_start_transaction = moment().toISOString(true).split("+")[0]+"Z";
// 				}
// 				message_body = "Start Refuelling Transaction on Your Car";
// 			}	

// 			if( req.body.status == 5 || req.body.status == 1 ){
// 				if(!req.body.date_finish){
// 					req.body.date_finish = moment().toISOString(true).split("+")[0]+"Z";
// 				}
// 				message_body = "Transaction Finished";
// 			}	
// 			callback(null, true);
// 		},
// 		function checkingParameters (index, callback) {
// 			if ( (!req.body.id) && (!req.body.transaction_id) )  return callback({
// 					code: 'MISSING_KEY',
// 					data: req.body,
// 					info: {
// 						missingParameter: 'id'
// 					}
// 				});

// 			callback(null, true);
// 		},
// 		function gettingDataTrans (index, callback) {
// 			if ( req.body.id )
// 				var id = req.body.id;
// 			else
// 				var id = req.body.transaction_id; 
// 			TransactionController.find(req.APP, { body:{ id: id, detail:true } }, (err, result) => {
// 				if (err) return callback(err);
// 				console.log(result);
// 				var data = result.data[0];
// 				callback(null,data);
// 			});
// 		},
// 		function gettingDataEBMoney (trans, callback) {
// 			console.log(trans);
// 			ebMoneyController.find(req.APP, { body:{ customer_id: trans.customer_id } }, (err, result) => {
// 				if (err) return callback(err);
// 				if(req.body.status){
// 					balance = parseFloat( parseFloat(result.data[0].money) - parseFloat(trans.pay) );					
// 					if(balance<0) return callback({
// 						code: 'ERR__TRANSACTION_BALANCE',
// 						data: req.body
// 					});
// 				}
// 				callback(null, trans, result);
// 			});
// 		},
// 		function aliasesParameter (trans, ebmoney, callback) {
// 			req.body.dataQuery = req.body;
// 			req.body.dataUpdate = req.body;			
// 			callback(null, trans, ebmoney);
// 		},
// 		function updateData (trans, ebmoney, callback) {
// 			TransactionController.update(req.APP, req, (err, result) => {				
// 				if (err) return callback(err);
// 				callback(null,trans, ebmoney, result);
// 			});
// 		},
// 		function sendFCM(trans, ebmoney, index, callback){
// 			if(trans.fcm_device_id){
// 				var message = {
// 					notification:{
// 						title: "PT. Solusi Integra Indonesia - Transaction Order",
// 			            body: message_body,
// 			            icon: "/icon-eb.png",
// 			            click_action: "easy-customer"
// 					}
// 				}
// 				var params = {
// 			    	registrationToken : trans.fcm_device_id,
// 			    	message : message
// 			    }
// 				fcm.send({body:params},function(err,result){		    				        
// 			        if(err){
// 			        	console.log(err);
// 			        }			        
// 			        callback(null,trans, ebmoney, index);
// 			    })
// 			} else {
// 			    callback(null,trans, ebmoney, index);
// 			}
// 		},
// 		function payTransacation (trans, ebmoney, index, callback) {
// 			console.log("---payTransacation---");
// 			if(req.body.paid){
// 				ebMoneyController.update(req.APP,{ body:{
// 					dataQuery:{ id:ebmoney.data[0].ebmoney_id },
// 					dataUpdate:{ money: balance }
// 				} }, (err, result) => {
// 					if (err) return callback({
// 						code: 'ERR_DATABASE',
// 						data: req.body
// 					});
// 					callback(null,trans, index);
// 				});
// 			} else {
// 				callback(null,trans, index);
// 			}
// 		},
// 		function payTransacation2 (trans, index, callback) {
// 			console.log("---payTransacation2---");
// 			if(req.body.paid){
// 				ebTransactionController.insert(req.APP, { body:{
// 					account:"ORDER-TRANSACTION",
// 					transaction_code:trans.transaction_code,
// 					customer_id:trans.customer_id,
// 					debit:trans.pay,
// 					balance:balance,
// 					information:"Order Transaction - "+trans.transaction_code
// 				} }, (err, result) => {	
// 					if (err) return callback({
// 						code: 'ERR_DATABASE',
// 						data: req.body
// 					});
// 					callback(null,trans, index);
// 				});
// 			} else {
// 				callback(null,trans, index);
// 			}
// 		},
// 		function sendEmailStruct(trans, index, callback) {   						
// 			console.log("---sendEmailStruct---");
// 			if( !(req.body.status == 5 || req.body.status == 1) ){
// 				callback(null,index);
// 			} else if(req.body.sendmail){	
// 				if(!trans.date_finish) trans.date_finish = req.body.date_finish;
// 				email.struct_transaction({body:{data:trans}},(err,body_email) => {		    				        
// 			        if(err){
// 			        	err.data = req.body;		        	
// 			          	return callback(err);
// 			        }	
// 			        ////Kirim Email
// 					var user_email = trans.customer.email;
// 				    var params = {
// 				    	email : user_email,
// 				    	subject : 'Transaction Struct - '+trans.transaction_code,
// 				    	body_email : body_email
// 				    }					   
// 				    email.send({body:params},function(err,email_result){		    				        
// 				        if(err){
// 				        	err.data = req.body;		        	
// 				          	return callback(err);
// 				        }			        
// 				        return callback(null,index);
// 				    })				        
// 			    });			
// 			} else {				
// 				callback(null,index);
// 			}			
//         },
// 	], (err, result) => {
// 		if (err) return req.APP.output.print(req, res, err);

// 		return req.APP.output.print(req, res, result);
// 	});
// });

// router.post('/insert', (req, res, next) => {
// 	var balance;
// 	async.waterfall([		
// 		function checkingParameters ( callback) {
// 			if (!req.body.customer_id) return callback({
// 					code: 'MISSING_KEY',
// 					data: req.body,
// 					info: {
// 						missingParameter: 'Customer'
// 					}
// 				});
// 			if(!req.body.customer_add){
// 				if (!req.body.driver_id) return callback({
// 						code: 'MISSING_KEY',
// 						data: req.body,
// 						info: {
// 							missingParameter: 'Driver Id'
// 						}
// 					});	

// 			if (!req.body.car_id) return callback({
// 						code: 'MISSING_KEY',
// 						data: req.body,
// 						info: {
// 							missingParameter: 'Car Id'
// 						}
// 					});	
// 			}
// 			if (!req.body.total_fuel) return callback({
// 					code: 'MISSING_KEY',
// 					data: req.body,
// 					info: {
// 						missingParameter: 'Total Fuel'
// 					}
// 				});	

// 			if (!req.body.pay) return callback({
// 					code: 'MISSING_KEY',
// 					data: req.body,
// 					info: {
// 						missingParameter: 'Pay'
// 					}
// 				});	
// 			if (!req.body.location_lat) return callback({
// 					code: 'MISSING_KEY',
// 					data: req.body,
// 					info: {
// 						missingParameter: 'Pay'
// 					}
// 				});
// 			if (!req.body.location_lng) return callback({
// 					code: 'MISSING_KEY',
// 					data: req.body,
// 					info: {
// 						missingParameter: 'Pay'
// 					}
// 				});							
// 			callback(null, true);
// 		},
// 		function gettingDataEBMoney (index, callback) {
// 			ebMoneyController.find(req.APP, req, (err, result) => {
// 				if (err) return callback(err);
// 				balance = parseFloat( parseFloat(result.data[0].money) - parseFloat(req.body.pay) );
// 				if(balance<0) return callback({
// 					code: 'ERR__TRANSACTION_BALANCE',
// 					data: req.body
// 				});
// 				callback(null, result);
// 			});
// 		},
// 		function aliases (ebmoney,callback) {
// 			if(!req.body.status){
// 				req.body.status = 0;
// 			}
// 			if (!req.body.transaction_code){			
// 				req.body.transaction_code = req.body.customer_id + Math.ceil((microtime.now()/10000));				
// 			}			
// 			callback(null, ebmoney);
// 		},
// 		function getSector (ebmoney, callback) {
// 			var query = {
// 				body:{
// 					latitude: req.body.location_lat,
// 					longitude: req.body.location_lng
// 				}
// 			}
// 			sectorController.findsector(req.APP, query, (err, result) => {				
// 				if (err)return callback(err);
// 				var data = result.data;
// 				console.log("--------------------------------");
// 				console.log(data);
// 				console.log("--------------------------------");
// 				if(data.total){
// 					req.body.sector = data.sector[0];
// 				}
// 				callback(null, ebmoney);
// 			});
// 		},
// 		function getCarDriverBySector (ebmoney, callback) {
// 			if(req.body.customer_add && req.body.sector){
// 				var now = moment().format("YYYY-MM-DD");
// 				var query = {
// 					body:{
// 						str_date: now+"T00:00:00.000",
// 						end_date: now+"T23:59:59.000",
// 						status:1,
// 						sector:req.body.sector
// 					}
// 				}
// 				carDriverController.find(req.APP, query, (err, result) => {				
// 					if (err)return callback(err);
// 					var data = result.data;
// 					if(result.code == 'FOUND'){
// 						req.body.car_id = data[0].car_id;					
// 						req.body.driver_id = data[0].driver_id;	
// 					}
// 					callback(null, ebmoney);
// 				});
// 			} else {
// 				callback(null, ebmoney);
// 			}
// 		},
// 		function getCarDriver (ebmoney, callback) {
// 			if(req.body.customer_add && !(req.body.car_id) ){
// 				var now = moment().format("YYYY-MM-DD");
// 				var query = {
// 					body:{
// 						str_date: now+"T00:00:00.000",
// 						end_date: now+"T23:59:59.000",
// 						status:1
// 					}
// 				}
// 				carDriverController.find(req.APP, query, (err, result) => {				
// 					if (err)return callback(err);
// 					var data = result.data;
// 					if(result.code == 'FOUND'){
// 						req.body.car_id = data[0].car_id;					
// 						req.body.driver_id = data[0].driver_id;	
// 					} else {
// 						return callback({
// 							code: 'ERR__TRANSACTION_CAR_NOT_FOUND',
// 							data: req.body
// 						});
// 					}
// 					callback(null, ebmoney);
// 				});
// 			} else {
// 				callback(null, ebmoney);
// 			}
// 		},
// 		function gettingCarTank(ebmoney, callback) {
// 			carController.find(req.APP, { body:{ id:req.body.car_id } }, (err, result) => {
// 				if (err) return callback(err);
// 				var tank = parseFloat( parseFloat(result.data[0].tank) - parseFloat(req.body.total_fuel) );
// 				if(tank<0) return callback({
// 					code: 'ERR__CAR_TANK',
// 					data: req.body
// 				});
// 				callback(null, ebmoney);
// 			});
// 		},	
// 		function insertData (ebmoney, callback) {
// 			TransactionController.insert(req.APP, req, (err, result) => {				
// 				if (err) return callback(err);
// 				callback(null, ebmoney, result);
// 			});
// 		},
// 		function payTransacation (ebmoney, index, callback) {
// 			if(req.body.paid){
// 				ebMoneyController.update(req.APP,{ body:{
// 					dataQuery:{ id:ebmoney.data[0].ebmoney_id },
// 					dataUpdate:{ money: balance }
// 				} }, (err, result) => {
// 					if (err) return callback({
// 						code: 'ERR_DATABASE',
// 						data: req.body
// 					});
// 					callback(null, index);
// 				});
// 			} else {
// 				callback(null, index);
// 			}
// 		},
// 		function payTransacation2 (index, callback) {
// 			if(req.body.paid){
// 				ebTransactionController.insert(req.APP, { body:{
// 					account:"ORDER-TRANSACTION",
// 					transaction_code:req.body.transaction_code,
// 					customer_id:req.body.customer_id,
// 					debit:req.body.pay,
// 					balance:balance,
// 					information:"Order Transaction - "+req.body.transaction_code
// 				} }, (err, result) => {				
// 					if (err) return callback({
// 						code: 'ERR_DATABASE',
// 						data: req.body
// 					});
// 					callback(null,index);
// 				});
// 			} else {
// 				callback(null, index);
// 			}
// 		}


// 	], (err, result) => {
// 		if (err) return req.APP.output.print(req, res, err);

// 		return req.APP.output.print(req, res, result);
// 	});
// });
