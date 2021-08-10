const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = require('../database')

router.get('/', async (req, res) => {

    //get termination periods

    try {
        connection.query(`SELECT period, autoPeriod FROM terminations;`
        , async function (error, results, fields) {

            if (error) throw error
            res.status(200).send(results);

        });
    }
    catch(e) {
        console.log("Get committee member history Error : ", e)
        res.status(500).send(error);
    }
});

router.post('/', async (req, res) => {

    //update termination periods

    if(req.body.type == "Terminate Suggestion Period") {
        connection.query(`UPDATE terminations
        SET period='${req.body.time}' WHERE id='1';`, (error, results, fields) => {

            if(error) {
                res.status(404).send(error);
                console.log("Update terminate suggesting period error : ", error)
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
                console.log("Update auto terminating period error : ", error)
                return 
            }
            return res.status(200).send("Termination Dates Successfully Updated.")      

        });
    }

        
});

module.exports = router;