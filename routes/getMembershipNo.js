const express = require('express');

const router = express.Router();
const mysql = require('mysql');

const connection = require('../database')

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