/**
 * Created by YY on 2016/4/18.
 */
'use strict';
var fs        = require('fs')
, path        = require('path')
, Sequelize   = require('sequelize')
, basename    = path.basename(module.filename)
, env         = process.env.NODE_ENV || 'development'
, dbs         = {read: {}, write: {}, all: {}}
, handler     = require('./handler')
, instance    = require('./instance');

var Prepare = function(_modelName){
    return instance(_modelName);
}

Prepare.init = function(_dialect, _wr, _config){
    var db = null, modelType = _wr;

    if((modelType != "read")&&(modelType != "write")){
        modelType = "all";
    }
    db = dbs[modelType][_dialect];
    if(db != null && typeof db != "undefined"){return db;}
    switch(_dialect){
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
    dbs[modelType][_dialect] = db;
    handler.setDBs(dbs);
};

module.exports = Prepare
