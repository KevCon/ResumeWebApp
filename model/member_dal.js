/**
 * Created by Kevin on 12/16/2016.
 */

var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

exports.getAll = function(callback) {
    var query = 'SELECT * FROM member;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(member_id, callback) {
    var query = 'SELECT * FROM member WHERE member_id = ?';
    var queryData = [member_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};