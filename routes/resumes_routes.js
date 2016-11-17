/**
 * Created by Kevin on 11/16/2016.
 */
var express = require('express');
var router = express.Router();
var resumes_dal = require('../model/resumes_dal');


// View All resumess
router.get('/all', function(req, res) {
    resumes_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('resumes/resumesViewAll', { 'result':result });
        }
    });

});

// View the resumes for the given id
router.get('/', function(req, res){
    if(req.query.resumes_id == null) {
        res.send('resumes_id is null');
    }
    else {
        resumes_dal.getById(req.query.resumes_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('resumes/resumesViewById', {'result': result});
            }
        });
    }
});

module.exports = router;
