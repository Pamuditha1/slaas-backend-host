var express = require('express');
const router = express.Router();

const mysql = require('mysql');

const connection = require('../database')

router.post('/:memNo',function(req, res) {

    console.log("Req Received")
    console.log(req.params.memNo)
    let today = new Date();
    let dot = today.toISOString()
    // return res.status(200).send("Membership Terminated.")  

    connection.query(`UPDATE members
    SET status='Member', dot='' WHERE membershipNo='${req.params.memNo}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }
        return res.status(200).send("Membership Renewed.")      

    });

});

module.exports = router;