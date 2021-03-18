"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const xenditLogController = require('../controllers/xenditLogController.js');
const TransactionController = require('../controllers/TransactionController.js');
const ebTransactionController = require('../controllers/ebTransactionController.js');
const router = express.Router();
const moment = require('moment');
var email = require('../functions/email.js');
var fcm = require('../functions/fcm.js');
var output = {};

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function gettingData (index, callback) {
			xenditLogController.find(req.APP, req, (err, result) => {
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
			xenditLogController.count(req.APP, req, (err, result) => {
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
	async.waterfall([		
		function insertData (callback) {
			xenditLogController.insert(req.APP, { body:{data:JSON.stringify(req.body)} }, (err, result) => {				
				if (err) return callback(err);
				callback(null, result);
			});
		},
		function gettingData (index, callback) {
			if(req.body.status == "COMPLETED"){
				var code = req.body.external_id.split("-")[0];
				TransactionController.find(req.APP, {body:{transaction_code:code}}, (err, result) => {			        
					if (err) return callback(err);
					var data = result.data[0];
					callback(null,data,index);
				});	
			} else {
				return callback(index);	
			}
		},
		function aliasesParameter (trans,index, callback) {
			req.body = {
				id:trans.transaction_id,
				date_payment_finish:moment().toISOString(true).split("+")[0]+"Z",
				paid:1
			}
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;			
			callback(null, trans,index);
		},
		function updateData (trans, index, callback) {
			TransactionController.update(req.APP, req, (err, result) => {				
				if (err) return callback(err);
				callback(null,trans, result);
			});
		},
		function payTransacation (trans, index, callback) {
			if(req.body.paid){
				ebTransactionController.insert(req.APP, { body:{
					account:"ORDER-TRANSACTION",
					transaction_code:trans.transaction_code,
					customer_id:trans.customer_id,
					debit:trans.pay,
					information:"Order Transaction - "+trans.transaction_code
				} }, (err, result) => {	
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
		function sendFCM(trans, index, callback){
			if(trans.fcm_device_id){
				var message = {
					notification:{
						title: "Easy Bensin - Transaction Order",
			            body: "Payment Success",
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
			        callback(null,index);
			    })
			} else {
			    callback(null,index);
			}
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

module.exports = router;