const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/', async (req, res) => {

    try{
        //Get new membership no
        connection.query(`SELECT membershipNo FROM members ORDER BY enrollDate DESC LIMIT 1;`

        , async function (error, results, fields) {
            if (error) throw error;
            
            const newMemNo = parseInt(results[0].membershipNo) + 1
            res.send(newMemNo.toString())
        });
    }
    catch(e) {
        console.log("Get new membership no Error : ", e)
        res.status(500).send(error);
    }
});

module.exports = router;