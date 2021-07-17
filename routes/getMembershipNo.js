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

router.get('/', async (req, res) => {

    console.log(req.params.section)

    connection.query(`SELECT membershipNo FROM members ORDER BY enrollDate DESC LIMIT 1;`

    , async function (error, results, fields) {
        if (error) throw error;
        
        console.log(results[0].membershipNo);
        const newMemNo = parseInt(results[0].membershipNo) + 1
        res.send(newMemNo.toString())

        // getSeconder(req, res, results[0])
    });
});

module.exports = router;