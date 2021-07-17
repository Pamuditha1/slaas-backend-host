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

router.get('/:search', async (req, res) => {

    console.log(req.params.search)
    const searchWord = req.params.search

    connection.query(`SELECT membershipNo, nameWinitials, resAddrs, mobileNo 
    FROM members
    WHERE membershipNo LIKE '%${searchWord}%' OR nameWinitials LIKE '%${searchWord}%' OR mobileNo LIKE '%${searchWord}%'
    OR fullName LIKE '%${searchWord}%' OR commonFirst LIKE '%${searchWord}%' OR commomLast LIKE '%${searchWord}%' OR nic LIKE '%${searchWord}%' OR mobileNo LIKE '%${searchWord}%' 
    OR fixedNo LIKE '%${searchWord}%' OR email LIKE '%${searchWord}%' OR resAddrs LIKE '%${searchWord}%' OR perAddrs LIKE '%${searchWord}%'
    OR offMobile LIKE '%${searchWord}%' OR offLand LIKE '%${searchWord}%' OR offFax LIKE '%${searchWord}%' OR offEmail LIKE '%${searchWord}%';`

    , async function (error, results, fields) {
        if (error) throw error;
        
        // console.log(results[0]);
        res.send(results[0])

        // getSeconder(req, res, results[0])
    });
});

router.get('/proposer/:memNo', async (req, res) => {

    console.log(req.params.memNo)

    connection.query(`SELECT membershipNo, nameWinitials, resAddrs, mobileNo 
    FROM members
    WHERE membershipNo = "${req.params.memNo}";`

    , async function (error, results, fields) {
        if (error) throw error;
        
        // console.log(results[0]);
        res.send(results[0])

        // getSeconder(req, res, results[0])
    });
});

router.get('/seconder/:memNo', async (req, res) => {

    console.log(req.params.memNo)

    connection.query(`SELECT membershipNo, nameWinitials, resAddrs, mobileNo 
    FROM members
    WHERE membershipNo = "${req.params.memNo}";`

    , async function (error, results, fields) {
        if (error) throw error;
        
        // console.log(results[0]);
        res.send(results[0])

        // getSeconder(req, res, results[0])
    });
});

// function getSeconder(res, res, proposer) {

//     connection.query(`SELECT nameWinitials, sendingAddrs, mobileNo 
//     FROM members
//     WHERE membershipNo = "${req.params.memNo}";`

//     , async function (error, results, fields) {
//         if (error) throw error;
        
//         console.log(results[0])

//         res.status(200).json({
//             proposer: proposer,
//             seconder: results
//         });

//     });
// }

module.exports = router;