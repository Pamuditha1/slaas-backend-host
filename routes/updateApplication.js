const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = require('../database')

router.post('/reject', async (req, res) => {    
    console.log(req.body)

    connection.query(`UPDATE members
    SET status='Rejected', appReasons='${req.body.reasons}' WHERE memberID='${req.body.id}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }
        return res.status(200).send("Application Rejected.")      

    });
});

router.post('/approve', async (req, res) => {    
    console.log(req.body)

    let today = new Date().toISOString()

    connection.query(`UPDATE members
    SET status='Member', membershipNo='${req.body.memNo}', enrollDate='${today}' WHERE memberID='${req.body.id}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }
        return res.status(200).send("Applicant Registered.")      

    });
});

module.exports = router;