const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/', async (req, res) => {

    connection.query(`SELECT 
    title, nameWinitials, status, dot, lastPaidForYear, lastMembershipPaid, arrearsConti, memPaidLast, nic, mobileNo, email, resAddrs, gradeOfMembership, section, enrollDate, 
    councilPosition, memberFolioNo, membershipNo
    FROM 
    members WHERE status="Terminated";`

    , async function (error, results, fields) {
        if (error) console.log(error);
        // console.log(filtered);
        // console.log(filtered.length)
        res.status(200).send(results);

    });
});


module.exports = router;