const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/:comm', async (req, res) => {

    try {

        connection.query(`SELECT * FROM currentcommittees WHERE committee='${req.params.comm}';`

        , async function (error, results, fields) {

            if (error) throw error
            
            res.status(200).send(results);

        });
    }
    catch(e) {
        console.log("Get current committees Error : ", e)
        res.status(500).send(error);
    }
});

module.exports = router