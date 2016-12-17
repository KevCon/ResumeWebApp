/**
 * Created by Kevin on 12/16/2016.
 */

var express = require('express');
var router = express.Router();
var member_dal = require('../model/member_dal');


// View All members
router.get('/all', function(req, res) {
    member_dal.getAll(function(err, result){
        if(err) {
            res.send(err);
        }
        else {
            res.render('member/memberViewAll', { 'result':result });
        }
    });

});

// View the member for the given id
router.get('/', function(req, res){
    if(req.query.member_id == null) {
        res.send('member_id is null');
    }
    else {
        member_dal.getById(req.query.member_id, function(err,result) {
            if (err) {
                res.send(err);
            }
            else {
                res.render('member/memberViewById', {'result': result});
            }
        });
    }
});

module.exports = router;
