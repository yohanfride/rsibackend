"use strict";

var mysqlx = require('@mysql/xdevapi');
var convert;
try{
        convert = require('./object2NosqlQuery.js');
        console.log("loaded from "+process.cwd())
}
catch(e){
        console.log("loading from "+process.cwd())
        convert = require('./functions/object2NosqlQuery.js');
}

var user = process.env.MYSQL_NOSQL_USER.split(",")[0],
password = process.env.MYSQL_NOSQL_PASS.split(",")[0],
host = process.env.MYSQL_NOSQL_HOST.split(",")[0],
port = parseInt(process.env.MYSQL_NOSQL_PORT.split(",")[0]),
dbid = process.env.MYSQL_NOSQL_NAME.split(",")[0];

exports.add = (sender,req,collection,data,callback) =>{
    mysqlx.getSession( {
        user: user,
        password: password,
        host: host,
        port: port
    }).then(function(session){
        session.getSchema(dbid).getCollection(collection).add(data).execute()
        .then(function(result){
            var output = [];
            output = result.getGeneratedIds();
            return callback(null, {
                code: (output.length > 0) ? sender.toUpperCase()+'_ADD_SUCCESS' : sender.toUpperCase()+'CARTANK_ADD_FAILED',
                data: output,
                info: {
                    dataCount: output.length
                }
            });
        })
        .catch(function(err){
            return callback({
                code: 'ERR_DATABASE',
                info: err,
                data: req.body,
                from: sender
            });
        });
        session.close();
    })
    .catch(function(err){
        return callback({
            code: 'ERR_DATABASE',
            info: err,
            data: req.body,
            from: sender
        });
    });
}

exports.find = (sender,req,collection,query,limit,callback) =>{
    mysqlx.getSession( {
        user: user,
        password: password,
        host: host,
        port: port
    }).then(function(session){
        console.log("-------------------------------");
        console.log(convert.toFindQuery(query));
        console.log("-------------------------------");
        session.getSchema(dbid).getCollection(collection).find(convert.toFindQuery(query)).limit(limit).execute()
        .then(function(result){
            var output = [];
            output = result.fetchAll();
            return callback(null, {
                code: (output.length > 0) ? 'FOUND' : 'NOT_FOUND',
                data: output,
                info: {
                    dataCount: output.length
                }
            });
        })
        .catch(function(err){
            return callback({
                code: 'ERR_DATABASE',
                info: err,
                data: req.body,
                from: sender
            });
        });
        session.close();
    })
    .catch(function(err){
        return callback({
            code: 'ERR_DATABASE',
            info: err,
            data: req.body,
            from: sender
        });
    });
}

exports.update = (sender,req,collection,query,data,limit,callback) =>{
    mysqlx.getSession( {
        user: user,
        password: password,
        host: host,
        port: port
    }).then(function(session){
        convert.toSetValue(session.getSchema(dbid).getCollection(collection).modify(convert.toFindQuery(query)), data).limit(limit).execute()
        .then(function(result){
            var count = result.getAffectedItemsCount();
            return callback(null, {
                code: count > 0 ? sender.toUpperCase()+"_UPDATE_SUCCESS" : sender.toUpperCase()+"_UPDATE_NONE",
                data: req.body,
                info: {
                    updatedItem : count
                }
            });
        })
        .catch(function(err){
            return callback({
                code: 'ERR_DATABASE',
                info: err,
                data: req.body,
                from: sender
            });
        });
        session.close();
    })
    .catch(function(err){
        return callback({
            code: 'ERR_DATABASE',
            info: err,
            data: req.body,
            from: sender
        });
    });
}

exports.delete = (sender,req,collection,query,limit,callback) =>{
    mysqlx.getSession( {
        user: user,
        password: password,
        host: host,
        port: port
    }).then(function(session){
        session.getSchema(dbid).getCollection(collection).remove(convert.toFindQuery(query)).limit(limit).execute()
        .then(function(result){
            var count = result.getAffectedItemsCount();
            return callback(null, {
                code: count > 0 ? sender.toUpperCase()+"_DELETE_SUCCESS" : sender.toUpperCase()+"_DELETE_NONE",
                data: req.body,
                info: {
                    deletedItem : count
                }
            });
        })
        .catch(function(err){
            return callback({
                code: 'ERR_DATABASE',
                info: err,
                data: req.body,
                from: sender
            });
        });
        session.close();
    })
    .catch(function(err){
        return callback({
            code: 'ERR_DATABASE',
            info: err,
            data: req.body,
            from: sender
        });
    });
}

exports.findsql = (sender,req,collection,query,callback) =>{
    mysqlx.getSession( {
        user: user,
        password: password,
        host: host,
        port: port
    }).then(function(session){
        session.sql("USE "+dbid).execute();
        session.sql(query).execute()
        .then(function(result){
            var output = [];
            var row = result.fetchAll();
            var column = result.getColumns();
            for (var i = 0, len = row.length; i < len; i++) {
                console.log(i);
                var item = {};
                for (var h = 0, len2 = column.length; h < len2; h++) {
                    console.log(h);
                    item[column[h].name] = row[i][h];
                }
                output.push(item);
            }
            return callback(null, {
                code: (output.length > 0) ? 'FOUND' : 'NOT_FOUND',
                data: output,
                info: {
                    dataCount: output.length
                }
            });
        })
        .catch(function(err){
            return callback({
                code: 'ERR_DATABASE',
                info: err,
                data: req.body,
                from: sender
            });
        });
        session.close();
    })
    .catch(function(err){
        return callback({
            code: 'ERR_DATABASE',
            info: err,
            data: req.body,
            from: sender
        });
    });
}