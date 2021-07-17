const express = require('express');
const router = express.Router();
const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0112704105',
    database : 'slaasproject'
});

connection.connect((err) => {
    if(!err) return console.log("Successfully connected to MySql database");

    else console.log("Database connection failed" , send.stringify(err));   
});

router.get('/', async (req, res) => {

    connection.query(`SELECT * FROM committies;`

    , async function (error, results, fields) {

        if (error) console.log(error);
        
        // console.log(results)
        res.status(200).send(results);

    });
});

router.post('/', async (req, res) => {

    console.log("Committe Post", req.body)

    let committiesData = [req.body.committe]

    connection.query(`INSERT INTO committies ( committe ) VALUES (?);` , 
    committiesData , (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }

        // console.log(results)
        res.status(200).send({
            msg: "Committee Successfully Added",
            data: {
                committe: req.body.committe
            }
        })
        
    });
});

router.get('/history/:comm', async (req, res) => {

    connection.query(`SELECT fromD, toD from officebearershistory WHERE committee="${req.params.comm}" GROUP BY fromD ;`

    , async function (error, results, fields) {

        if (error) console.log(error);
        
        // console.log(results)
        let dateRanges = results
        getMemberAccordingToDates(dateRanges, req, res)
        // res.status(200).send(results);

    });
});

function getMemberAccordingToDates(dateRanges, req, res) {

    connection.query(`SELECT * from officebearershistory WHERE committee="${req.params.comm}";`

    , async function (error, results, fields) {

        if (error) console.log(error);
        
        // console.log(results)
        let response = {
            ranges: dateRanges,
            members: results
        }
        res.status(200).send(response);

    });
}

module.exports = router