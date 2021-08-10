const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/', async (req, res) => {

    try{
        connection.query(`SELECT 
        title, nameWinitials, status, dot, lastPaidForYear, lastMembershipPaid, arrearsConti, memPaidLast, nic, mobileNo, email, resAddrs, gradeOfMembership, section, enrollDate, 
        councilPosition, memberFolioNo, membershipNo
        FROM 
        members WHERE status="Terminated";`

        , async function (error, results, fields) {
            if (error) throw error
            res.status(200).send(results);

        });
    }
    catch(e) {
        console.log("Get terminated members Error : ", e)
        res.status(500).send(error);
    }

    
});


module.exports = router;