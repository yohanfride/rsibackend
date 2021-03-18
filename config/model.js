"use strict";

const async = require('async');
const fs = require('fs');

module.exports = function (db, callback) {
	async.parallel([
		function getMySqlModel (callback) {
			fs.readdir(__dirname + '/../models', (err, files) => {
				var len = files.length;
				var lenX = len - 1;
				var n = 0;
				let models = {};

				files.map(model => {
				  	if (model.match('.js')) {			  
				  		var modelName = model.replace('.js', '');
				  		var dbName = modelName.split('-')[0];
				  		var modelName = modelName.split('-')[1];
				  		var Model = db.sequelize[dbName].import('../models/' + model);			  		
						if (models[dbName] === undefined) {
					        models[dbName] = {}
					    }					
						models[dbName][modelName] = Model;	
				  		if (n === lenX) {	
				  			let mysqls = {};			  			
				  			Object.keys(models).forEach(val => {
								if (models[val].associate) models[val].associate(models);
								  	mysqls[val] = models[val];
							});
							callback(null, mysqls);
				  		}

				  	}
				  	n++;
				});
			});
		},
	], (err, result) => {		
		if (err) return callback(err);

		let models = {};
		models.mysql = result[0];
		models.mongo = result[1];

		return callback(null, models);
	});
};