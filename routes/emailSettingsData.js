const express = require('express');

const router = express.Router();
const mysql = require('mysql');

const connection = require('../database')

router.get('/', async (req, res) => {


    connection.query(`SELECT * FROM emailbodies;`

    , async function (error, results, fields) {
        if (error) throw error;
        
        res.status(200).send(results)

        // getSeconder(req, res, results[0])
    });
});

router.get('/:id', async (req, res) => {


    connection.query(`SELECT * FROM emailbodies WHERE id='${req.params.id}';`

    , async function (error, results, fields) {
        if (error) throw error;
        res.status(200).send(results[0])

        // getSeconder(req, res, results[0])
    });
});

router.post('/', async (req, res) => {    
    console.log(req.body)

    let today = new Date().toISOString()

    connection.query(`UPDATE emailbodies
    SET subject='${req.body.subject}', body='${req.body.body}' WHERE id='${req.body.id}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }
        return res.status(200).send("Email Content Updated")      

    });
});



module.exports = router;