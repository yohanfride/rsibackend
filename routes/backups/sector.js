"use strict";

const express = require('express');
const async = require('async');
const md5 = require('md5');
const microtime = require('microtime');
const sectorController = require('../controllers/sectorController.js');
const router = express.Router();
const moment = require('moment');
const inside = require('point-in-polygon');
const fs = require('fs');
var output = {};

router.post('/get', (req, res, next) => {
	async.waterfall([
		function aliases (callback) {			
			callback(null, true);
		},
		function gettingData (index, callback) {
			sectorController.find(req.APP, req, (err, result) => {
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
			sectorController.count(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.sector_id) ) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'id'
					}
				});

			callback(null, true);
		},
		function gettingData (index, callback) {
			sectorController.delete(req.APP, req, (err, result) => {
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
			if ( (!req.body.id) && (!req.body.sector_id) ) return callback({
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
			sectorController.update(req.APP, req, (err, result) => {
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
			if (!req.body.sector) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'sector'
					}
				});
			if (!req.body.group) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'group'
					}
				});
			if (!req.body.coordinates) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'coordinates'
					}
				});						
			callback(null, true);
		},
		function aliases (index,callback) {
			if (!req.body.sector_id){
				var awal =  Number(moment().year());				
				req.body.sector_id = awal.toString() + Math.ceil((microtime.now()/10000));				
			}			
			callback(null, true);
		},	
		function insertData (index, callback) {
			sectorController.insert(req.APP, req, (err, result) => {				
				if (err) return callback(err);
				callback(null, result);
			});
		}		
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

router.post('/pip', (req, res, next) => {
	async.waterfall([
		function checkingParameters ( callback) {
			if (!req.body.latitude) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'latitude'
					}
				});
			if (!req.body.longitude) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'longitude'
					}
				});					
			callback(null, true);
		},
		function gettingData (index, callback) {
			sectorController.find(req.APP, {body:{}}, (err, result) => {
				if (err) return callback(err);
				var result_data = new Array();
				for (var i = 0; i < result.data.length; i++) {
					var sector = result.data[i];
					var coordinates = sector.coordinates;
					if(sector.type != 'multipolygon'){
						var polygon = JSON.parse(coordinates);
						if(inside([ req.body.longitude, req.body.latitude ], polygon)){
							result_data.push(sector.sector);
						}
					} else {
						var mutltipolygon = JSON.parse(coordinates);
						for (var n = 0; n < mutltipolygon.length; n++) {
							var polygon = mutltipolygon[n][0];
							if(inside([ req.body.longitude, req.body.latitude ], polygon)){
								result_data.push(sector.sector);
							}
						}
					}
				}	
				result.data = {};
				result.data.hasil =  result_data;	
				callback(null, result);
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});


router.post('/creategeojson', (req, res, next) => {
	async.waterfall([
		function checkingParameters ( callback) {
			if (!req.body.group) return callback({
					code: 'MISSING_KEY',
					data: req.body,
					info: {
						missingParameter: 'group'
					}
				});				
			callback(null, true);
		},
		function gettingData (index, callback) {
			var fileName = req.body.group;
			var geoJsonName = fileName.replace(/\s+/g, '-');
			fileName = fileName.replace(/\s+/g, '-').toLowerCase()
			var geoJson = {
				type: "FeatureCollection",
				name: geoJsonName,
				crs: {
					"type": "name",
					"properties": {
						"name": "urn:ogc:def:crs:OGC:1.3:CRS84"
					}
				},
				features:[]
			}
			var features = []
			sectorController.find(req.APP, req, (err, result) => {
				if (err) return callback(err);
				for (var i = 0; i < result.data.length; i++) {
					var sector = result.data[i];
					var itemFeature = {
						"type": "Feature",
						"properties": {
							"id": "relation-"+sector.sector_id,
							"@id": "relation-"+sector.sector_id,
							"admin_level": "6",
							"name": sector.sector,
							"type": "boundary",
							"boundary": "administrative",
							"is_in:city": sector.city,
							"is_in:province": sector.province,
							"source": "Easy Bensin"
						},
						"geometry": {}
					};
					var coordinates = sector.coordinates;
					if(sector.type != 'multipolygon'){
						var polygon = JSON.parse(coordinates);
						itemFeature.geometry = {
							"type": "Polygon",
							"coordinates":[polygon]
						};
						features.push(itemFeature);
					} else {
						var mutltipolygon = JSON.parse(coordinates);
						itemFeature.geometry = {
							"type": "MultiPolygon",
							"coordinates":mutltipolygon
						};
						features.push(itemFeature);
					}
				}	
				geoJson.features = features;
				let data = JSON.stringify(geoJson);
				fs.writeFileSync('public/assets/maps/'+fileName+'.geojson', data);
				callback(null, {
					code: 'SECTOR_WRITE_SUCCESS',
					data: {
						filename:fileName,
						total:result.data.length
					}
				});
			});
		}
	], (err, result) => {
		if (err) return req.APP.output.print(req, res, err);

		return req.APP.output.print(req, res, result);
	});
});

module.exports = router;