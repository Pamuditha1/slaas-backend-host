const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const connection = require('../database')

router.post('/', async (req, res) => {    
    console.log(req.body)

    connection.query(`UPDATE members
    SET ${req.body.name}='${req.body.value}' WHERE memberID='${req.body.id}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }
        return res.status(200).send("Membership Data Successfully Updated.")      

    });
});

module.exports = router;