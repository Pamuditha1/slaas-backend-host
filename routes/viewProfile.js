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

router.get('/:id', async (req, res) => {

    console.log(req.params.id)
    const profileID = req.params.id

    // title, nameWinitials, commonFirst, commomLast, gender, dob, nic, mobileNo, fixedNo, email, resAddrs, perAddrs, gradeOfMembership, section, enrollDate, 
    // councilPosition, memberFolioNo, membershipNo, designation, department, placeOfWork, offMobile, offLand, offFax, offEmail, offAddrs, profession, 
    // specialization1, specialization2, specialization3, specialization4, specialization5, degree, university

    connection.query(`SELECT * FROM members
    WHERE 
    members.nic = "${profileID}" OR members.membershipNo = "${profileID}";`

    , async function (error, results, fields) {
        if (error) throw error;
        
        console.log(results[0]);
        results[0].enrollDate = new Date(results[0].enrollDate).toLocaleDateString()
        results[0].dot = new Date(results[0].dot).toLocaleDateString()
        // console.log('Updated Date', results[0]);

        console.log('With Member', results[0])
        getAcademicData(res, results[0])

        // res.status(200).send(results[0]);

    });
});

function getAcademicData(res, member) {

    connection.query(`SELECT * FROM 
    member_academic
    WHERE 
    memberID = '${member.memberID}';`

    , async function (error, results, fields) {
        if (error) throw error;
        
        const memberAaca = {
            member: member,
            academic: results
        }
        // console.log(results)
        // res.status(200).json({
        //     member: member,
        //     academic: results
        // });
        console.log('With Academic', memberAaca)
        getProposer(res, memberAaca)

    });
}

function getProposer(res, memberAaca) {
    connection.query(`SELECT name, membershipNo, address, contactNo FROM 
    proposers
    WHERE 
    proposerID = '${memberAaca.member.memberID}';`

    , async function (error, results, fields) {
        if (error) throw error;
        
        // console.log(results)
        // res.status(200).json({
        //     member: preResult,
        //     academic: results
        // });
        const memProposer = {
            ...memberAaca,
            proposer: results[0]
        }
        console.log('With Proposer', memProposer)
        getSeconder(res, memProposer)

    });
}
function getSeconder(res, memProposer) {
    connection.query(`SELECT name, membershipNo, address, contactNo FROM 
    seconders
    WHERE 
    seconderID = '${memProposer.member.memberID}';`

    , async function (error, results, fields) {
        if (error) throw error;
        
        // console.log(results)
        // res.status(200).json({
        //     member: preResult,
        //     academic: results
        // });
        const memSeconder = {
            ...memProposer,
            seconder: results[0]
        }
        console.log('With Seconder', memSeconder)
        getCommitties(res, memSeconder)
        // res.status(200).send(memSeconder)

    });
}

function getCommitties(res, memSeconder) {
    connection.query(`SELECT * FROM 
    officebearershistory
    WHERE 
    memberID = '${memSeconder.member.memberID}';`

    , async function (error, results, fields) {
        if (error) throw error;
        
        // console.log(results)
        // res.status(200).json({
        //     member: preResult,
        //     academic: results
        // });
        const memCommi = {
            ...memSeconder,
            committies: results
        }
        console.log('With Committee', memCommi)
        res.status(200).send(memCommi)

    });
}

module.exports = router;