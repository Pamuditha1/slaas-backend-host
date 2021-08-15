const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/', async (req, res) => {

    // try{

        //Get current email settings

        connection.query(`SELECT * FROM emailbodies;`

        , async function (error, results, fields) {
            if (error) throw error;            
            res.status(200).send(results)
        });
    // }
    // catch(e) {
    //     console.log("Get current email settings Error : ", e)
    //     res.status(500).send(error);
    // }
});

router.get('/:id', async (req, res) => {

    // try {

        //Get one email settings

        connection.query(`SELECT * FROM emailbodies WHERE id='${req.params.id}';`

        , async function (error, results, fields) {
            if (error) throw error;
            res.status(200).send(results[0])
        });

    // }
    // catch(e) {
    //     console.log("Get one email settings Error : ", e)
    //     res.status(500).send(error);
    // }
});

router.post('/', async (req, res) => {    

    // try{

        //Update email settings

        connection.query(`UPDATE emailbodies
        SET subject='${req.body.subject}', body='${req.body.body}' WHERE id='${req.body.id}';`, (error, results, fields) => {

            if (error) throw error;
            return res.status(200).send("Email Content Updated")      

        });
    // }
    // catch(e) {
    //     console.log("Update email settings Error : ", e)
    //     res.status(500).send(error);
    // }
});



module.exports = router;