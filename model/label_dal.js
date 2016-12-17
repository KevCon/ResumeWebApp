/**
 * Created by Kevin on 12/16/2016.
 */

var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view label_view as
 SELECT l.*, b.band_name FROM label l
 LEFT JOIN label_band lb ON lb.label_id = l.label_id
 LEFT JOIN band b ON b.band_id = lb.band_id;
 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM label;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(label_id, callback) {
    var query = 'SELECT * from label_view where label_id = ?;';
    var queryData = [label_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE LABEL
    var query = 'INSERT INTO label (label_name, street, city, state, zip, year_founded) VALUES (?, ?, ?, ?, ?, ?)';

    var queryData = [params.label_name, params.street, params.city, params.state, params.zip, params.year_formed];

    connection.query(query, queryData, function(err, result) {

        // THEN USE THE LABEL_ID RETURNED AS insertId AND THE SELECTED BAND_IDs INTO BAND_MEMBER
        var label_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO label_band (label_id, band_id) VALUES ?';

        // TO BULK INSERT AN ARRAY OF VALUES WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES        
        var labelBandData = [];
        // if only one value is submitted, JavaScript will treat the value as an array, so we skip it if its not an array
        // for example if the value of params.band_id was "10", it would loop over the "1" and then the "0", instead of
        // treating it as one value.
        if(params.band_id instanceof Array) {
            for(var i=0; i < params.band_id.length; i++) {
                labelBandData.push([label_id, params.band_id[i]]);
            }
        }
        else {
            labelBandData.push([label_id, params.band_id]);
        }

        // NOTE THE EXTRA [] AROUND labelBandData
        connection.query(query, [labelBandData], function(err, result){
            callback(err, result);
        });
    });

};

//declare the function so it can be used locally
var labelBandInsert = function(label_id, bandIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO label_band (label_id, band_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var labelBandData = [];
    for(var i=0; i < bandIdArray.length; i++) {
        labelBandData.push([label_id, bandIdArray[i]]);
    }
    connection.query(query, [labelBandData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.labelBandInsert = labelBandInsert;

exports.delete = function(label_id, callback) {
    var query = 'DELETE FROM label WHERE label_id = ?';
    var queryData = [label_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};