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

    connection.query(`SELECT grade, membershipFee FROM grades;`

    , async function (error, results, fields) {

        if (error) console.log(error);

        // let grades = []
        // results.forEach(g => {
        //     grades.push(g.grade)
        // });
     
        res.status(200).send(results);

    });
});

router.post('/', async (req, res) => {

    // console.log(req.body)

    connection.query(`INSERT INTO grades (grade, membershipFee) VALUES ('${req.body.grade}', '${req.body.membershipFee}') `, 
    (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }

        // console.log(results)
        res.status(200).send({
            msg: "Grade Successfully Added",
            data: req.body.grade
        })
        
    });
});

router.post('/update', async (req, res) => {

    // console.log(req.body)

    connection.query(`UPDATE grades
    SET membershipFee='${req.body.membershipFee}' WHERE grade='${req.body.grade}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }
        return res.status(200).send("Membership Fee Successfully Updated.")      

    });
});

module.exports = router;