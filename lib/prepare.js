/**
 * Created by YY on 2016/4/18.
 */
'use strict';
var dbs       = {read: {}, write: {}, all: {}}
, handler     = require('./handler')
, instance    = require('./instance')
, _           = require('lodash')
, models      = {};

var Prepare = function(_modelName){
    if(_.isNull(models[_modelName]) || _.isUndefined(models[_modelName])){
        models[_modelName] = instance(_modelName);
    }
    return models[_modelName];
};

Prepare.init = function(_config){
    var db = null, modelType = _config.type, dialect = _config.dialect;

    if((modelType != "read")&&(modelType != "write")){
        modelType = "all";
    }
    db = dbs[modelType][dialect];
    if(db != null && typeof db != "undefined"){return db;}
    switch(dialect){
        case 'mysql':
            db = require('./sequelize')(_config);
            break;
        case 'mongo':
            db = require('./mongoose')(_config);
            break;
        case 'memcache':
            db = require('./memcache')(_config);
            break;
        default:
            return;
    }
    //var wrdb = dbs[modelType];
    dbs[modelType][dialect] = db;
    handler.setDBs(dbs);
};

module.exports = Prepare;

