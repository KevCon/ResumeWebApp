/**
 * Created by Kevin on 12/16/2016.
 */
var express = require('express');
var router = express.Router();
var band_dal = require('../model/band_dal');
var member_dal = require('../model/member_dal');


// View All bands
router.get('/all', function(req, res) {
    band_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('band/bandViewAll', { 'result':result });
        }
    });

});

// View the band for the given id
router.get('/', function(req, res){
    if(req.query.band_id == null) {
        res.send('band_id is null');
    }
    else {
        band_dal.getById(req.query.band_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('band/bandViewById', {'result': result});
            }
        });
    }
});

// Return the add a new band form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    member_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('band/bandAdd', {'member': result});
        }
    });
});

// insert a band record
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.band_name == null) {
        res.send('A band name must be provided.');
    }
    else if(req.query.member_id == null) {
        res.send('At least one member must be selected.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        band_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/band/all');
            }
        });
    }
});

router.get('/update', function(req, res) {
    band_dal.update(req.query, function(err, result){
        res.redirect(302, '/band/all');
    });
});

// Delete a band for the given band_id
router.get('/delete', function(req, res){
    if(req.query.band_id == null) {
        res.send('band_id is null');
    }
    else {
        band_dal.delete(req.query.band_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/band/all');
            }
        });
    }
});

module.exports = router;