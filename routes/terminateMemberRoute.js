var express = require('express');
const router = express.Router();

const connection = require('../database')

router.post('/:memNo',function(req, res) {

    let today = new Date();
    let dot = today.toISOString()

    connection.query(`UPDATE members
    SET status='Terminated', dot='${dot}' WHERE membershipNo='${req.params.memNo}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log("Terminate member error : ",error)
            return 
        }
        return res.status(200).send("Membership Terminated.")      

    });

});

module.exports = router;