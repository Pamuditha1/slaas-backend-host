const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = require('../database')

router.post('/', async (req, res) => {    
    console.log(req.body)

    connection.query(`UPDATE memberrequests
    SET status='Responded' WHERE timestamp='${req.body.timestamp}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }
        return res.status(200).send("Responded to the Request.")      

    });
});


module.exports = router;