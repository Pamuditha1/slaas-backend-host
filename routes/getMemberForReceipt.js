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

router.get('/:memNo', async (req, res) => {

    console.log("Sumery Came", req.params.memNo)

    connection.query(`SELECT memberID, membershipNo, nameWinitials, nic, memPaidLast, lastPaidForYear, lastMembershipPaid, arrearsConti, arrearsUpdated
    FROM members
    WHERE membershipNo = "${req.params.memNo}";`

    , async function (error, results, fields) {
        if (error) throw error;
        
        console.log(results[0]);
        let lastDate = results[0].memPaidLast ? new Date(results[0].memPaidLast).toLocaleDateString() : ''
        let lastMembershipPaidDate = results[0].lastMembershipPaid ? new Date(results[0].lastMembershipPaid).toLocaleDateString() : ''
        results[0].memPaidLast = lastDate
        res.send(results[0])

        // getSeconder(req, res, results[0])
    });
});

module.exports = router;