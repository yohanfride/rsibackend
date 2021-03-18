
const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const ebMoneyController = require('../controllers/ebMoneyController.js');
const ebTransactionController = require('../controllers/ebTransactionController.js');
const router = express.Router();
const moment = require('moment');
var email = require('../functions/email.js');
var output = {};

/* UPLOAD IMAGE */
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../public/assets/ebmoney')
  },
  filename: function (req, file, cb) {
    cb(null, md5(Date.now()+file.originalname) + '.' + file.mimetype.split('/')[1]);
  }
});
const upload = multer({storage:storage}).single('photo');

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {
			if(req.body.str_date) req.body.str_date = req.body.str_date+"T00:00:00.000";
			if(req.body.end_date) req.body.end_date = req.body.end_date+"T23:59:59.000";
				
			callback(null, true);
		},
		function gettingData (index, callback) {
			ebMoneyController.find(req.APP, req, (err, result) => {
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
				
			callback(null, true);
		},
		function gettingData (index, callback) {
			ebMoneyController.count(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.ebmoney_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function gettingData (index, callback) {
			ebMoneyController.delete(req.APP, req, (err, result) => {
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
			callback(null, true);
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.id) && (!req.body.ebmoney_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function aliasesParameter (index, callback) {
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;
			callback(null, true);
		},
		function updateData (index, callback) {
			ebMoneyController.update(req.APP, req, (err, result) => {
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
		function checkingParameters ( callback) {
			if (!req.body.customer_id) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Customer'
					}
				});

			if (!req.body.money) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Account'
					}
				});	
					
			callback(null, true);
		},	
		function insertData (index, callback) {
			ebMoneyController.insert(req.APP, req, (err, result) => {				
				if (err) return callback(err);
				callback(null, result);
			});
		}		
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/topup', (req, res, next) => {
	async.waterfall([		
		function checkingParameters ( callback) {
			if (!req.body.customer_id) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Customer'
					}
				});

			if (!req.body.amount) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Amount'
					}
				});	

			if (!req.body.hasOwnProperty("status")) 
				req.body.status = 1;

			callback(null, true);
		},
		function gettingDataEBMoney (index, callback) {
			if(req.body.status != 1){
				callback(null, null);
			} else {
				ebMoneyController.find(req.APP, req, (err, result) => {
					if (err) return callback(err);
					callback(null, result);
				});
			}
		},
		function updateData (ebMoney, callback) {
			if(req.body.status != 1){
				callback(null, null);
			} else {
				req.body.balance = parseFloat( parseFloat(req.body.amount) + parseFloat(ebMoney.data[0].money) );
				ebMoneyController.update(req.APP,{ body:{
					dataQuery:{ id:ebMoney.data[0].ebmoney_id },
					dataUpdate:{ money: req.body.balance }
				} }, (err, result) => {
					if (err) return callback({
						code: 'ERR_EB_MONEY_TOPUP_FAILED',
						data: req.body
					});
					callback(null, result);
				});
			}
		},
		function aliases (ebMoney,callback) {
			if (!req.body.transaction_code){			
				req.body.transaction_code = req.body.customer_id + Math.ceil((microtime.now()/10000));				
			}
			req.body.credit = req.body.amount;
			req.body.account = "TOP-UP";
			if(!req.body.information){
				req.body.information = "Top-up from administrator";
			}		
			callback(null, true);
		},	
		function insertData (index, callback){
			console.log(req.body);
			console.log("--------------");
			ebTransactionController.insert(req.APP, req, (err, result) => {				
				if (err) return callback({
					code: 'ERR_EB_MONEY_TOPUP_FAILED',
					data: req.body
				});
				callback(null, {
					code: 'EB_MONEY_TOPUP_SUCCESS',
					data: result.data
				});
			});
		},		
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/topup/upload', (req, res, next) => {
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
					callback(null, {
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
		function aliases (output,callback) {
			req.body = output.data.body;
			req.body.file = output.data.file.filename;
			if(!req.body.id){
				if (!req.body.transaction_code){			
					req.body.transaction_code = req.body.customer_id + Math.ceil((microtime.now()/10000));				
				}
				req.body.credit = req.body.amount;
				req.body.account = "TOP-UP";
				if(!req.body.information){
					req.body.information = "Top-up from administrator";
				}
			}
			callback(null, true);
		},	
		function insertData (index, callback){
			if(!req.body.id){
				ebTransactionController.insert(req.APP, req, (err, result) => {				
					if (err) return callback({
						code: 'ERR_EB_MONEY_TOPUP_FAILED',
						data: req.body
					});
					callback(null, {
						code: 'EB_MONEY_TOPUP_SUCCESS',
						data: result.data
					});
				});
			} else {
				callback(null, true);
			}
		},
		function aliasesParameter (index, callback) {
			if(req.body.id){
				req.body.dataQuery = req.body;
				req.body.dataUpdate = req.body;
			}
			callback(null, index);
		},
		function updateData (index, callback) {
			if(req.body.id){
				console.log("----------------------");
				console.log("UPDATE");
				ebTransactionController.update(req.APP, req, (err, result) => {
					console.log(err);				
					if (err) return callback({
						code: 'ERR_EB_MONEY_TOPUP_FAILED',
						data: req.body
					});
					callback(null, {
						code: 'EB_MONEY_TOPUP_SUCCESS',
						data: result.data
					});
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

router.post('/topup/approve', (req, res, next) => {
	async.waterfall([		
		function checkingParameters ( callback) {
			if (!req.body.id) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Transaction ID'
					}
				});
			callback(null, true);
		},
		function gettingData (index, callback) {
			ebTransactionController.find(req.APP, { body:{ id : req.body.id, status:2 } }, (err, result) => {
				if (err) return callback(err);
				if(result.code == 'NOT_FOUND') return callback({
					code: 'ERR_EB_MONEY_TOPUP_APPROVE_FAILED',
					data: req.body
				});

				callback(null, result.data[0]);
			});
		},
		function gettingDataEBMoney (ebTrans, callback) {
			ebMoneyController.find(req.APP, { body:{ customer_id:ebTrans.customer_id } }, (err, result) => {
				if (err) return callback(err);
				callback(null, ebTrans, result);
			});
		},
		function updateData (ebTrans, ebMoney, callback) {
			req.body.balance = parseFloat( parseFloat(ebTrans.credit) + parseFloat(ebMoney.data[0].money) );
			ebMoneyController.update(req.APP,{ body:{
				dataQuery:{ id:ebMoney.data[0].ebmoney_id },
				dataUpdate:{ money: req.body.balance }
			} }, (err, result) => {
				if (err) return callback({
					code: 'ERR_EB_MONEY_TOPUP_APPROVE_FAILED',
					data: req.body
				});
				callback(null, result);
			});
		},	
		function updateDataTrans (index, callback){
			req.body.status = 1;
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;
			ebTransactionController.update(req.APP, req, (err, result) => {
				if (err) return callback({
					code: 'ERR_EB_MONEY_TOPUP_APPROVE_FAILED',
					data: req.body
				});
				callback(null, {
					code: 'EB_MONEY_TOPUP_APPROVE_SUCCESS',
					data: result.data
				});
			});
		},		
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

module.exports = router;