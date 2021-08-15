const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/', async (req, res) => {

    // try {
    
    //get payments records

    connection.query(`SELECT 
    date, time, invoiceNo, nameWinitials, membershipNo, nic, total, yearOfPayment, type, admission, arrears, yearlyFee, idCardFee,
    description
    FROM payments, members
    WHERE members.memberID = payments.memberID
    ORDER BY invoiceNo DESC`

    , async function (error, results, fields) {
        if (error) throw error;
        
        //send results
        
        res.status(200).send(results);

    });

    // }
    // catch(e) {
    //     console.log("Get payment records Error : ", e)
    //     res.status(500).send(error);
    // }
});


module.exports = router;