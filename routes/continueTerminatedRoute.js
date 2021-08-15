var express = require('express');
const router = express.Router();

const connection = require('../database')

router.post('/:memNo',function(req, res) {

    // try{
        
        //Continue terminated membership
        
        connection.query(`UPDATE members
        SET status='Member', dot='' WHERE membershipNo='${req.params.memNo}';`, (error, results, fields) => {

            if(error) throw error
            return res.status(200).send("Membership Renewed.")      

        });
    // }
    // catch(e) {
    //     console.log("Continue terminated membership Error : ", e)
    //     res.status(500).send(error);
    // }

});

module.exports = router;