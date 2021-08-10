const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/', async (req, res) => {

    try {
        //get committees
        connection.query(`SELECT * FROM committies;`

        , async function (error, results, fields) {

            if (error) throw error
            
            res.status(200).send(results);

        });
    }
    catch(e) {
        console.log("Get committees Error : ", e)
        res.status(500).send(error);
    }
});

router.post('/', async (req, res) => {

    try{
        //add new committee
        let committiesData = [req.body.committe]

        connection.query(`INSERT INTO committies ( committe ) VALUES (?);` , 
        committiesData , (error, results, fields) => {

            if(error) throw error

            // console.log(results)
            res.status(200).send({
                msg: "Committee Successfully Added",
                data: {
                    committe: req.body.committe
                }
            })
            
        });
    }
    catch(e) {
        console.log("Add committees Error : ", e)
        res.status(500).send(error);
    }
});

router.get('/history/:comm', async (req, res) => {

    try{

        connection.query(`SELECT fromD, toD from officebearershistory WHERE committee="${req.params.comm}" GROUP BY fromD ;`

        , async function (error, results, fields) {

            if (error) throw error
            
            let dateRanges = results
            getMemberAccordingToDates(dateRanges, req, res)

        });
    }
    catch(e) {
        console.log("Get committee history Error : ", e)
        res.status(500).send(error);
    }
});

function getMemberAccordingToDates(dateRanges, req, res) {

    try {

        //get member history
        connection.query(`SELECT * from officebearershistory WHERE committee="${req.params.comm}";`

        , async function (error, results, fields) {

            if (error) throw error
            
            let response = {
                ranges: dateRanges,
                members: results
            }
            res.status(200).send(response);

        });
    }
    catch(e) {
        console.log("Get committee member history Error : ", e)
        res.status(500).send(error);
    }
}

module.exports = router