const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/:memID', async (req, res) => {

    //get payments records
    
    connection.query(`SELECT * FROM payments
    WHERE memberID = "${req.params.memID}" ORDER BY invoiceNo DESC;`

    , async function (error, results, fields) {
        if (error) console.log("Get payments history error : ", error);

        res.send(results)
    });
});

module.exports = router;