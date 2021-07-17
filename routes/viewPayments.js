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

    connection.query(`SELECT 
    date, time, invoiceNo, nameWinitials, membershipNo, nic, total, yearOfPayment, type, admission, arrears, yearlyFee, idCardFee,
    description
    FROM payments, members
    WHERE members.memberID = payments.memberID `

    , async function (error, results, fields) {
        if (error) throw error;
        
        console.log(results);
        res.status(200).send(results);

    });
});


module.exports = router;