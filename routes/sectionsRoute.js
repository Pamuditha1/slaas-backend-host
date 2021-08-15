const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/', async (req, res) => {

    //get sections for dropdown

    connection.query(`SELECT keyName, section FROM sections;`

    , async function (error, results, fields) {

        if (error) {
            console.log("Get sections error : ",error);
            res.status(500).send(error);
        }
        res.status(200).send(results);

    });
});

router.post('/', async (req, res) => {

    let sectionData = [req.body.key, req.body.section]

    //add new sections
    
    connection.query(`INSERT INTO sections ( keyName, section) VALUES (?,?);` , 
    sectionData , (error, results, fields) => {

        if (error) {
            console.log("Add sections error : ",error);
            res.status(500).send(error);
        }
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