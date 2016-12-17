/**
 * Created by Kevin on 12/16/2016.
 */
var mysql   = require('mysql');
var db  = require('./db_connection.js');

/* DATABASE CONFIGURATION */
var connection = mysql.createConnection(db.config);

/*
 create or replace view band_view as
 SELECT b.*, m.first_name, m.last_name FROM band b
 LEFT JOIN band_member bm ON bm.band_id = b.band_id
 LEFT JOIN member m ON m.member_id = bm.member_id;
 */

exports.getAll = function(callback) {
    var query = 'SELECT * FROM band;';

    connection.query(query, function(err, result) {
        callback(err, result);
    });
};

exports.getById = function(band_id, callback) {
    var query = 'SELECT * from band_view where band_id = ?;';
    var queryData = [band_id];
    console.log(query);

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });
};

exports.insert = function(params, callback) {

    // FIRST INSERT THE BAND
    var query = 'INSERT INTO band (band_name, home_town, year_formed, biography) VALUES (?, ?, ?, ?)';

    var queryData = [params.band_name, params.home_town, params.year_formed, params.biography];

    connection.query(query, queryData, function(err, result) {

        // THEN USE THE BAND_ID RETURNED AS insertId AND THE SELECTED MEMBER_IDs INTO BAND_MEMBER
        var band_id = result.insertId;

        // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
        var query = 'INSERT INTO band_member (band_id, member_id) VALUES ?';

        // TO BULK INSERT AN ARRAY OF VALUES WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES        
        var bandMemberData = [];
        // if only one value is submitted, JavaScript will treat the value as an array, so we skip it if its not an array
        // for example if the value of params.member_id was "10", it would loop over the "1" and then the "0", instead of
        // treating it as one value.
        if(params.member_id instanceof Array) {
            for(var i=0; i < params.member_id.length; i++) {
                bandMemberData.push([band_id, params.member_id[i]]);
            }
        }
        else {
            bandMemberData.push([band_id, params.member_id]);
        }

        // NOTE THE EXTRA [] AROUND bandMemberData
        connection.query(query, [bandMemberData], function(err, result){
            callback(err, result);
        });
    });

};

//declare the function so it can be used locally
var bandMemberInsert = function(band_id, memberIdArray, callback){
    // NOTE THAT THERE IS ONLY ONE QUESTION MARK IN VALUES ?
    var query = 'INSERT INTO band_member (band_id, member_id) VALUES ?';

    // TO BULK INSERT RECORDS WE CREATE A MULTIDIMENSIONAL ARRAY OF THE VALUES
    var bandMemberData = [];
    for(var i=0; i < memberIdArray.length; i++) {
        bandMemberData.push([band_id, memberIdArray[i]]);
    }
    connection.query(query, [bandMemberData], function(err, result){
        callback(err, result);
    });
};
//export the same function so it can be used by external callers
module.exports.bandMemberInsert = bandMemberInsert;


exports.delete = function(band_id, callback) {
    var query = 'DELETE FROM band WHERE band_id = ?';
    var queryData = [band_id];

    connection.query(query, queryData, function(err, result) {
        callback(err, result);
    });

};