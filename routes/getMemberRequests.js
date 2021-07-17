const express = require('express');

const router = express.Router();
const mysql = require('mysql');

const connection = require('../database')

router.get('/', async (req, res) => {

    connection.query(`SELECT * FROM memberrequests ORDER BY id DESC`, async function (error, results, fields) {
        if (error) throw error;
        
        // console.log(results);
        res.status(200).send(results);

    });
});

module.exports = router;