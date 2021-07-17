const express = require('express');

const router = express.Router();
const mysql = require('mysql');

const connection = require('../database')

router.get('/:memID', async (req, res) => {

    console.log("History Came", req.params.memID)

    connection.query(`SELECT * FROM payments
    WHERE memberID = "${req.params.memID}";`

    , async function (error, results, fields) {
        if (error) console.log(error);
        
        console.log("Payments History", results);
        // let lastDate = new Date(results[0].memPaidLast).toLocaleDateString()
        // results[0].memPaidLast = lastDate
        res.send(results)

        // getSeconder(req, res, results[0])
    });
});

module.exports = router;