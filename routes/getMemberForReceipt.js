const express = require('express');

const router = express.Router();
const mysql = require('mysql');

const connection = require('../database')

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