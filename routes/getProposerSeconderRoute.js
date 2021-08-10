const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/:search', async (req, res) => {

    try {
        const searchWord = req.params.search

        //Search members for proposers and seconders
        connection.query(`SELECT membershipNo, nameWinitials, resAddrs, mobileNo 
        FROM members
        WHERE membershipNo LIKE '%${searchWord}%' OR nameWinitials LIKE '%${searchWord}%' OR mobileNo LIKE '%${searchWord}%'
        OR fullName LIKE '%${searchWord}%' OR commonFirst LIKE '%${searchWord}%' OR commomLast LIKE '%${searchWord}%' OR nic LIKE '%${searchWord}%' OR mobileNo LIKE '%${searchWord}%' 
        OR fixedNo LIKE '%${searchWord}%' OR email LIKE '%${searchWord}%' OR resAddrs LIKE '%${searchWord}%' OR perAddrs LIKE '%${searchWord}%'
        OR offMobile LIKE '%${searchWord}%' OR offLand LIKE '%${searchWord}%' OR offFax LIKE '%${searchWord}%' OR offEmail LIKE '%${searchWord}%';`

        , async function (error, results, fields) {
            if (error) throw error;
            res.send(results[0])
        });
    }
    catch(e) {
        console.log("Search members for proposers and seconders Error : ", e)
        res.status(500).send(error);
    }   
});

router.get('/proposer/:memNo', async (req, res) => {
    
    try {
    
        connection.query(`SELECT membershipNo, nameWinitials, resAddrs, mobileNo 
        FROM members
        WHERE membershipNo = "${req.params.memNo}";`

        , async function (error, results, fields) {
            if (error) throw error;
            res.send(results[0])
        });
    }
    catch(e) {
        console.log("Get proposer Error : ", e)
        res.status(500).send(error);
    }
});

router.get('/seconder/:memNo', async (req, res) => {

    try{
        connection.query(`SELECT membershipNo, nameWinitials, resAddrs, mobileNo 
        FROM members
        WHERE membershipNo = "${req.params.memNo}";`

        , async function (error, results, fields) {
            if (error) throw error;
            res.send(results[0])
        });
    }
    catch(e) {
        console.log("Get seconder Error : ", e)
        res.status(500).send(error);
    }
    
});


module.exports = router;