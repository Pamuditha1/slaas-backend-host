const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = require('../database')

router.get('/', async (req, res) => {

    connection.query(`SELECT period, autoPeriod FROM terminations;`

    , async function (error, results, fields) {

        if (error) console.log(error);

        // let grades = []
        // results.forEach(g => {
        //     grades.push(g.grade)
        // });
     
        res.status(200).send(results);

    });
});

router.post('/', async (req, res) => {

    console.log('Ter Req', req.body)

    if(req.body.type == "Terminate Suggestion Period") {
        connection.query(`UPDATE terminations
        SET period='${req.body.time}' WHERE id='1';`, (error, results, fields) => {

            if(error) {
                res.status(404).send(error);
                console.log(error)
                return 
            }
            return res.status(200).send("Termination Dates Successfully Updated.")      

        });
    }
    else {
        connection.query(`UPDATE terminations
        SET autoPeriod='${req.body.time}' WHERE id='1';`, (error, results, fields) => {

            if(error) {
                res.status(404).send(error);
                console.log(error)
                return 
            }
            return res.status(200).send("Termination Dates Successfully Updated.")      

        });
    }

        
});

module.exports = router;