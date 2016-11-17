/**
 * Created by Kevin on 11/16/2016.
 */
/**
 * Created by Kevin on 11/16/2016.
 */
var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM resumes;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(resumes_id, callback) {
    var query = 'SELECT * FROM resumes WHERE resumes_id = ?';
    var queryData = [resumes_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};