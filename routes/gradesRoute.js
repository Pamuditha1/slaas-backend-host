const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/', async (req, res) => {

    // try{
        connection.query(`SELECT grade, membershipFee FROM grades;`

        , async function (error, results, fields) {

            if (error) throw error
        
            res.status(200).send(results);

        });
    // }
    // catch(e) {
    //     console.log("Get grades Error : ", e)
    //     res.status(500).send(error);
    // }

});

router.post('/', async (req, res) => {

    // try{    

    //add new grade

        connection.query(`INSERT INTO grades (grade, membershipFee) VALUES ('${req.body.grade}', '${req.body.membershipFee}') `, 
        (error, results, fields) => {

            if(error) {
                res.status(404).send(error);
                throw error
            }

            res.status(200).send({
                msg: "Grade Successfully Added",
                data: req.body.grade
            })        
        });
    // }
    // catch(e) {
    //     console.log("Add grades Error : ", e)
    //     res.status(500).send(error);
    // }
    
});

router.post('/update', async (req, res) => {

    // try{

        //update grades membership fees

        connection.query(`UPDATE grades
        SET membershipFee='${req.body.membershipFee}' WHERE grade='${req.body.grade}';`, (error, results, fields) => {

            if(error) {
                
                res.status(404).send(error);
                throw error
            }
            return res.status(200).send("Membership Fee Successfully Updated.")      

        });
    // }
    // catch(e) {
    //     console.log("Update grades Error : ", e)
    //     res.status(500).send(error);
    // }
    
});

module.exports = router;