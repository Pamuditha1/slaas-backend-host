const express = require('express');

const router = express.Router();
const mysql = require('mysql');

const connection = require('../database')

router.get('/all', async (req, res) => {

    //get member records

    try {
        connection.query(`SELECT 
        title, image, nameWinitials, commonFirst, status, commomLast, gender, dob, nic, mobileNo, fixedNo, email, resAddrs, perAddrs, gradeOfMembership, section, enrollDate, 
        councilPosition, memberFolioNo, membershipNo, designation, department, placeOfWork, offMobile, offLand, offFax, offEmail, offAddrs, profession, 
        specialization1, specialization2, specialization3, specialization4, specialization5, degree, university, appReasons
        FROM 
        members , member_academic 
        WHERE 
        members.memberID = member_academic.memberID ORDER BY enrollDate DESC;`

        , async function (error, results, fields) {
            if (error) throw error;

            res.status(200).send(results);

        });
    }
    catch(e) {
        console.log("Get member records Error : ", e)
        res.status(500).send(error);
    }
});


module.exports = router;