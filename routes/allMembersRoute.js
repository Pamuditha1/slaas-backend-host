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

router.get('/all', async (req, res) => {

    connection.query(`SELECT * FROM member_personal`, async function (error, results, fields) {
        if (error) throw error;
        
        console.log(results);
        res.status(200).send(results);

    });
});

router.get('/personal', async (req, res) => {

    connection.query(`SELECT * FROM member_personal`, async function (error, results, fields) {
        if (error) throw error;
        
        console.log(results);
        res.status(200).send(results);

    });
});
router.get('/official', async (req, res) => {

    connection.query(`SELECT * FROM member_official`, async function (error, results, fields) {
        if (error) throw error;
        
        console.log(results);
        res.status(200).send(results);

    });
});

router.get('/professional', async (req, res) => {

    connection.query(`SELECT * FROM member_professional`, async function (error, results, fields) {
        if (error) throw error;
        
        console.log(results);
        res.status(200).send(results);

    });
});

module.exports = router;