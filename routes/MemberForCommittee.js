const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/:memNo', async (req, res) => {

    connection.query(`SELECT membershipNo, nameWinitials, memberID
    FROM members
    WHERE membershipNo = "${req.params.memNo}";`

    , async function (error, results, fields) {
        if (error) throw error;        
        res.send(results[0])

    });
});

router.post('/', async (req, res) => {

    connection.query(
        `INSERT INTO currentcommittees (committee, position, fromD, toD, memberID, name, membershipNo) 
        VALUES ('${req.body.committe}', '${req.body.position}','${req.body.fromD}','${req.body.toD}'
        ,'${req.body.memberID}','${req.body.name}','${req.body.membershipNo}')`
    ,(error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            return 
        }
        addToOfficeBarears(req, res)
        
    });
});


router.post('/update', async (req, res) => {

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
            console.log("Update committee error : ", error)
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
            console.log("Add committee positions error : ", error)
            return 
        }

        if(update) {
            return res.status(200).send({
                msg: "Position Successfully Updated",
                data: req.body.grade
            })
            
        }
        res.status(200).send({
            msg: "Position Successfully Assigned",
            data: req.body.grade
        })
        
    });
    
}

module.exports = router;