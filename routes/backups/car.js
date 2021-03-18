"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const carController = require('../controllers/carController.js');
const sectorController = require('../controllers/sectorController.js');
const router = express.Router();
const moment = require('moment');
var email = require('../functions/email.js');
var output = {};
const fs = require('fs')
const inside = require('point-in-polygon');

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function gettingData (index, callback) {
			carController.find(req.APP, req, (err, result) => {
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
			carController.count(req.APP, req, (err, result) => {
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
	var oldphoto;
	async.waterfall([
		function aliases (callback) {			
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
		function gettingCar(index, callback) {
			if(req.body.id)
				var id = req.body.id;
			else
				var id = req.body.car_id
			carController.find(req.APP, { body:{ id:id } }, (err, result) => {
				if (err) return callback(err);
				oldphoto = result.data[0].photo;
				callback(null, true);
			});
		},
		function deleteData (index, callback) {
			carController.delete(req.APP, req, (err, result) => {
				if (err) return callback(err);
				if(oldphoto)
					removeFile(oldphoto);
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
			if ( (!req.body.id) && (!req.body.car_id) ) return callback({
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
			carController.update(req.APP, req, (err, result) => {
				if (err) return callback(err);
				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});


router.post('/update_position', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function checkingParameters (index, callback) {
			if ( (!req.body.device_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'device_id'
					}
				});

			if ( (!req.body.postion_lat) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'postion_lat'
					}
				});

			if ( (!req.body.postion_lng) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'postion_lng'
					}
				});

			if ( (!req.body.sector) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'sector'
					}
				});
			callback(null, true);
		},
		function gettingCar(index, callback) {
			carController.find(req.APP, { body:{ device_id:req.body.device_id } }, (err, result) => {				
				if (err) return callback(err);
				if(result.data){					
					req.body.car_id = result.data[0].car_id;
					callback(null, true);
				} else {
					callback({
						code: 'MISSING_KEY',
						data: req.body,
						info: {
							missingParameter: 'device_id'
						}
					});
				}
			});
		},
		function checkLocation (index, callback) {
			var sector = {
				sector:req.body.sector
			}
			sectorController.find(req.APP, {body:sector}, (err, result) => {				
				if (err) return callback(err);
				var status = 0;
				for (var i = 0; i < result.data.length; i++) {
					var sector = result.data[i];
					var coordinates = sector.coordinates;
					// console.log("------------");
					// console.log(sector);
					if(sector.type != 'multipolygon'){
						var polygon = JSON.parse(coordinates);
						if(inside([ req.body.postion_lng, req.body.postion_lat ], polygon)){
							status = true;
						}
					} else {
						var mutltipolygon = JSON.parse(coordinates);
						for (var n = 0; n < mutltipolygon.length; n++) {
							var polygon = mutltipolygon[n][0];
							if(inside([ req.body.postion_lng, req.body.postion_lat ], polygon)){
								status = true;
							}
						}
					}
				}	
				if(!status){
					req.body.geo_alert = 1;
				} else {
					req.body.geo_alert = 0;
				}	
				callback(null, true);
			});
		},
		function aliasesParameter (index, callback) {
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;
			callback(null, true);
		},
		function updateData (index, callback) {
			carController.update(req.APP, req, (err, result) => {
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
			if (!req.body.vehicle_number) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Vechicle Number'
					}
				});

			if (!req.body.capacity) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Capacity'
					}
				});						
			callback(null, true);
		},
		function aliases (index,callback) {
			if (!req.body.car_id){
				var awal =  Number(moment().year());				
				req.body.car_id = awal.toString() + Math.ceil((microtime.now()/10000));				
			}			
			callback(null, true);
		},	
		function insertData (index, callback) {
			carController.insert(req.APP, req, (err, result) => {				
				if (err) return callback(err);
				callback(null, result);
			});
		}		
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

/* UPLOAD IMAGE */
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '/../public/assets/car')
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
	path = path+ "public/assets/car/"+file;
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

			if (!req.body.vehicle_number) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Vechicle Number'
					}
				});

			if (!req.body.capacity) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'Capacity'
					}
				});		

			callback(null, true);
		},
		function aliases (index,callback) {
			if (!req.body.car_id){
				var awal =  Number(moment().year());				
				req.body.car_id = awal.toString() + Math.ceil((microtime.now()/10000));				
			}			
			callback(null, true);
		},	
		function insertData (index, callback) {
			carController.insert(req.APP, req, (err, result) => {				
				if (err) return callback(err);
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
		function gettingCar(index, callback) {
			if(req.body.id)
				var id = req.body.id;
			else
				var id = req.body.car_id
			carController.find(req.APP, { body:{ id:id } }, (err, result) => {
				if (err) return callback(err);
				oldphoto = result.data[0].photo;
				callback(null, true);
			});
		},
		function aliasesParameter (index, callback) {
			req.body.dataQuery = req.body;
			req.body.dataUpdate = req.body;
			callback(null, true);
		},
		function updateData (index, callback) {
			carController.update(req.APP, req, (err, result) => {
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