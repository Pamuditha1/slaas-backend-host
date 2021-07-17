var express = require('express');
const router = express.Router();

const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0112704105',
    database : 'slaasproject'
});
router.post('/:memNo',function(req, res) {

    console.log("Req Received")
    console.log(req.params.memNo)
    let today = new Date();
    let dot = today.toISOString()
    // return res.status(200).send("Membership Terminated.")  

    connection.query(`UPDATE members
    SET status='Terminated', dot='${dot}' WHERE membershipNo='${req.params.memNo}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }
        return res.status(200).send("Membership Terminated.")      

    });

});

module.exports = router;