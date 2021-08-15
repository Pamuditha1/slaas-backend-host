const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/:id', async (req, res) => {

    // try {

    const profileID = req.params.id

    //get the member data

    connection.query(`SELECT * FROM members
    WHERE 
    members.nic = "${profileID}" OR members.membershipNo = "${profileID}";`

    , async function (error, results, fields) {
        if (error) throw error;
        
        results[0].enrollDate = new Date(results[0].enrollDate).toLocaleDateString()
        results[0].dot = new Date(results[0].dot).toLocaleDateString()

        //get the academic data

        getAcademicData(res, results[0])

    });

    // }
    // catch(e) {
    //     console.log("Get member profile Error : ", e)
    //     res.status(500).send(error);
    // }
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

        //get proposer details

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
        
        const memProposer = {
            ...memberAaca,
            proposer: results[0]
        }

        //get seconder details

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
        
        const memSeconder = {
            ...memProposer,
            seconder: results[0]
        }

        //get member committees

        getCommitties(res, memSeconder)

    });
}

function getCommitties(res, memSeconder) {
    connection.query(`SELECT * FROM 
    officebearershistory
    WHERE 
    memberID = '${memSeconder.member.memberID}';`

    , async function (error, results, fields) {
        if (error) throw error;
        
        const memCommi = {
            ...memSeconder,
            committies: results
        }

        //send the records
        
        res.status(200).send(memCommi)

    });
}

module.exports = router;