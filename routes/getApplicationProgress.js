const express = require('express');

const router = express.Router();
const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0112704105',
    database : 'slaasproject'
});

connection.connect((err) => {
    if(!err) return console.log("Successfully connected to MySql database");

    else console.log("Database connection failed" , send.stringify(err));   
});

router.get('/:id', async (req, res) => {

    console.log(req.params.id)
    connection.query(`SELECT status, enrollDate, appReasons
    FROM members
    WHERE memberID = "${req.params.id}";`

    , async function (error, results, fields) {
        if (error) throw error;
        
        console.log(results[0]);
        res.send(results[0])

        // getSeconder(req, res, results[0])
    });
});

module.exports = router;