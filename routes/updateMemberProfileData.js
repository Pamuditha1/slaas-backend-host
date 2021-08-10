const express = require('express');
const router = express.Router();

const connection = require('../database')

router.post('/', async (req, res) => {    

    //update member details
    
    connection.query(`UPDATE members
    SET ${req.body.name}='${req.body.value}' WHERE memberID='${req.body.id}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log("Updationg member error : ", error)
            return 
        }
        return res.status(200).send("Membership Data Successfully Updated.")      

    });
});

module.exports = router;