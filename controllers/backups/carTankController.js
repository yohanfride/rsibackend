"use strict";

var nosql = require('../functions/nosqlDatabase.js');
var collection = "car_tank"
var name = 'cartank';
//////PENTING HAPUS FOLDER QUERY////

const checkFuel = (fuels) => {
    try{
        fuels.forEach(fuel => {
            if(Object.prototype.toString.call(fuel.type) !== "[object String]") throw "invalid fuel type";
            else if(!Number.isInteger(fuel.capacity)) throw "invalid fuel capacity";
            else if(!fuel.atg) throw "invalid fuel atg";
            else if(!Number.isInteger(fuel.atg.temp)) throw "invalid fuel atg temp";
            else if(!Number.isInteger(fuel.atg.level)) throw "invalid fuel atg level";
        });
        return true;
    }
    catch(err){
        console.log(err);
        return false;
    }
}

exports.add = function (APP, req, callback) {
    var data = {};
    if(req.body.data) data = req.body.data;
    try{
        if(!data.car_id || !data.fuel || !Array.isArray(data.fuel) || data.fuel.length <= 0 || !checkFuel(data.fuel)) throw "car_id or fuel not properly defined";
        nosql.add(name,req,collection,data,(err, result) => {
            if (err) return callback(err);
    
            callback(null, result);
        })
    }
    catch (err){
        return callback({
            code: 'INVALID_REQUEST',
            info: err,
            data: req.body,
            from: 'cartank'
        });
    }
};

exports.find = function (APP, req, callback) {
    var query = {}, limit = 0;
    if(req.body.query) query = req.body.query;
    if(req.body.limit) limit = req.body.limit;
    nosql.find(name,req,collection,query,limit,(err, result) => {
        if (err) return callback(err);

		callback(null, result);
    })
};

exports.update = function (APP, req, callback) {
    var query = {}, data = {}, limit = 0;
    if(req.body.query) query = req.body.query;
    if(req.body.data) data = req.body.data;
    if(req.body.limit) limit = req.body.limit;
    nosql.update(name,req,collection,query,data,limit,(err, result) => {
        if (err) return callback(err);

		callback(null, result);
    })
};

exports.delete = function (APP, req, callback) {
    var query = {}, limit = 0;
    if(req.body.query) query = req.body.query;
    if(req.body.limit) limit = req.body.limit;
    nosql.delete(name,req,collection,query,limit,(err, result) => {
        if (err) return callback(err);

		callback(null, result);
    })
};

exports.findgroup = function (APP, req, callback) {
    var query = '';
    if(req.body.query) query = req.body.query;
    nosql.findsql(name,req,collection,query,(err, result) => {
        if (err) return callback(err);

        callback(null, result);
    })
};