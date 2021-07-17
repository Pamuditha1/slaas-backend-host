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

    connection.query(`SELECT keyName, section FROM sections;`

    , async function (error, results, fields) {

        if (error) console.log(error);
        
        // console.log(results)
        res.status(200).send(results);

    });
});

router.post('/', async (req, res) => {

    console.log(req.body)

    let sectionData = [req.body.key, req.body.section]

    connection.query(`INSERT INTO sections ( keyName, section) VALUES (?,?);` , 
    sectionData , (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }

        // console.log(results)
        res.status(200).send({
            msg: "Section Successfully Added",
            data: {
                key: req.body.key,
                sections: req.body.section
            }
        })
        
    });
});

module.exports = router;