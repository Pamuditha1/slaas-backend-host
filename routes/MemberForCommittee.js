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

router.get('/:memNo', async (req, res) => {

    console.log(req.params.memNo)

    connection.query(`SELECT membershipNo, nameWinitials, memberID
    FROM members
    WHERE membershipNo = "${req.params.memNo}";`

    , async function (error, results, fields) {
        if (error) throw error;
        
        // console.log(results[0]);
        res.send(results[0])

        // getSeconder(req, res, results[0])
    });
});

router.post('/', async (req, res) => {

    console.log(req.body)

    let dataArr = [req.body.committe, req.body.position,req.body.from,req.body.to, req.body.memberID, req.body.name, req.body.membershipNo]

    connection.query(
        `INSERT INTO currentcommittees (committee, position, fromD, toD, memberID, name, membershipNo) 
        VALUES ('${req.body.committe}', '${req.body.position}','${req.body.fromD}','${req.body.toD}'
        ,'${req.body.memberID}','${req.body.name}','${req.body.membershipNo}')`
    // `INSERT INTO currentcommittees (committee, position, from, to, memberID )\
    //     VALUES (?,?,?,?,?)` , dataArr, 
    ,(error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }
        addToOfficeBarears(req, res)
        
    });
});


router.post('/update', async (req, res) => {

    console.log(req.body)

    connection.query(
        `UPDATE currentcommittees
    SET fromD='${req.body.fromD}', toD='${req.body.toD}',memberID='${req.body.memberID}',
    name='${req.body.name}',membershipNo='${req.body.membershipNo}'
     WHERE committee='${req.body.committe}' AND position='${req.body.position}';`
    // `INSERT INTO currentcommittees (committee, position, from, to, memberID )\
    //     VALUES (?,?,?,?,?)` , dataArr, 
    ,(error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }
        let update = true
        addToOfficeBarears(req, res, update)
        
    });
});


function addToOfficeBarears(req, res, update) {

    connection.query(`INSERT INTO officebearershistory (committee, position, fromD, toD, memberID, name, membershipNo)
    VALUES ('${req.body.committe}', '${req.body.position}','${req.body.fromD}','${req.body.toD}'
    ,'${req.body.memberID}','${req.body.name}','${req.body.membershipNo}') `, 
    (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }

        if(update) {
            return res.status(200).send({
                msg: "Position Successfully Updated",
                data: req.body.grade
            })
            
        }
        console.log(results)
        res.status(200).send({
            msg: "Position Successfully Assigned",
            data: req.body.grade
        })
        
    });
    
}

module.exports = router;