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

    // connection.query(`SELECT title, nameWinitials, commonFirst, commomLast, gender, dob, nic, mobileNo, fixedNo, email, resAddrs, perAddrs, gradeOfMembership, section, enrollDate, 
    // councilPosition, memberFolioNo, membershipNo, designation, department, placeOfWork, offMobile, offLand, offFax, offEmail, offAddrs, profession, 
    // specialization1, specialization2, specialization3, specialization4, specialization5, degree, university
    // FROM member_personal , member_membership, members, member_official, member_professional, member_academic WHERE member_official.officialID = member_personal.personalID 
    // AND member_personal.personalID = member_membership.membershipID AND members.memberID = member_personal.personalID
    // AND member_personal.personalID = member_professional.professionalID AND member_academic.professionalID = member_professional.professionalID;`
    connection.query(`SELECT 
    title, nameWinitials, commonFirst, status, commomLast, gender, dob, nic, mobileNo, fixedNo, email, resAddrs, perAddrs, gradeOfMembership, section, enrollDate, 
    councilPosition, memberFolioNo, membershipNo, designation, department, placeOfWork, offMobile, offLand, offFax, offEmail, offAddrs, profession, 
    specialization1, specialization2, specialization3, specialization4, specialization5, degree, university, appReasons
    FROM 
    members , member_academic 
    WHERE 
    members.memberID = member_academic.memberID ORDER BY enrollDate DESC;`

    , async function (error, results, fields) {
        if (error) throw error;
        
        // console.log(results);
        // results = results.map(m => {
        //     m.enrollDate = new Date(m.enrollDate).toLocaleDateString()
        // })
        // console.log(results);
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