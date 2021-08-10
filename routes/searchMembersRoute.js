const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser')

const connection = require('../database')

router.use(bodyParser.json())

router.get('/:word', async (req, res) => {

    const searchWord = req.params.word

    if(!req.params.word) {
        return res.status(404).send('Empty Search')
    }
    searchMember(searchWord, res)   

});

function searchMember(searchWord, res) {

    try {
        connection.query(`SELECT * FROM members WHERE 
        membershipNo LIKE '%${searchWord}%' OR nameWinitials LIKE '%${searchWord}%' OR fullName LIKE '%${searchWord}%' OR commonFirst LIKE '%${searchWord}%' 
        OR commomLast LIKE '%${searchWord}%' OR dob LIKE '%${searchWord}%' OR nic LIKE '%${searchWord}%' OR mobileNo LIKE '%${searchWord}%' 
        OR fixedNo LIKE '%${searchWord}%' OR email LIKE '%${searchWord}%' OR resAddrs LIKE '%${searchWord}%' OR perAddrs LIKE '%${searchWord}%'
        OR designation LIKE '%${searchWord}%' OR department LIKE '%${searchWord}%' OR placeOfWork LIKE '%${searchWord}%' OR offMobile LIKE '%${searchWord}%' 
        OR offLand LIKE '%${searchWord}%' OR offFax LIKE '%${searchWord}%' OR offEmail LIKE '%${searchWord}%' OR offAddrs LIKE '%${searchWord}%'
        OR profession LIKE '%${searchWord}%' OR specialization1 LIKE '%${searchWord}%' OR specialization2 LIKE '%${searchWord}%' OR specialization3 LIKE '%${searchWord}%' 
        OR specialization4 LIKE '%${searchWord}%' OR specialization5 LIKE '%${searchWord}%' OR gradeOfMembership LIKE '%${searchWord}%' OR section LIKE '%${searchWord}%' 
        OR status LIKE '%${searchWord}%' OR enrollDate LIKE '%${searchWord}%' OR appliedDate LIKE '%${searchWord}%' OR councilPosition LIKE '%${searchWord}%' 
        OR memberFolioNo LIKE '%${searchWord}%' OR memPaidLast LIKE '%${searchWord}%' ORDER BY enrollDate DESC;`,

        async function (error, results, fields) {
            if (error) throw error;
            
            if(results.length === 0) {
                res.status(404).send('No Record Found')
                return
            }
            res.status(200).send(results)        

        });
    }
    catch(e) {
        console.log("Search member Error : ", e)
        res.status(500).send(error);
    }
}

module.exports = router;