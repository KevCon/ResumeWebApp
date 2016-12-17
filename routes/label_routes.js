/**
 * Created by Kevin on 12/16/2016.
 */
var express = require('express');
var router = express.Router();
var label_dal = require('../model/label_dal');
var band_dal = require('../model/band_dal');


// View All labels
router.get('/all', function(req, res) {
    label_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('label/labelViewAll', { 'result':result });
        }
    });

});

// View the label for the given id
router.get('/', function(req, res){
    if(req.query.label_id == null) {
        res.send('label_id is null');
    }
    else {
        label_dal.getById(req.query.label_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('label/labelViewById', {'result': result});
            }
        });
    }
});

// Return the add a new label form
router.get('/add', function(req, res){
    // passing all the query parameters (req.query) to the insert function instead of each individually
    band_dal.getAll(function(err,result) {
        if (err) {
            res.send(err);
        }
        else {
            res.render('label/labelAdd', {'band': result});
        }
    });
});

// insert a label record
router.get('/insert', function(req, res){
    // simple validation
    if(req.query.label_name == null) {
        res.send('A label name must be provided.');
    }
    else if(req.query.band_id == null) {
        res.send('At least one band must be selected.');
    }
    else {
        // passing all the query parameters (req.query) to the insert function instead of each individually
        label_dal.insert(req.query, function(err,result) {
            if (err) {
                console.log(err)
                res.send(err);
            }
            else {
                //poor practice for redirecting the user to a different page, but we will handle it differently once we start using Ajax
                res.redirect(302, '/label/all');
            }
        });
    }
});

router.get('/update', function(req, res) {
    label_dal.update(req.query, function(err, result){
        res.redirect(302, '/label/all');
    });
});

// Delete a label for the given label_id
router.get('/delete', function(req, res){
    if(req.query.label_id == null) {
        res.send('label_id is null');
    }
    else {
        label_dal.delete(req.query.label_id, function(err, result){
            if(err) {
                res.send(err);
            }
            else {
                //poor practice, but we will handle it differently once we start using Ajax
                res.redirect(302, '/label/all');
            }
        });
    }
});

module.exports = router;
