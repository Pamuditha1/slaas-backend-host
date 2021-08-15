const bcrypt = require('bcrypt')
const express = require('express');
const router = express.Router();

const connection = require('../database')

router.post('/admin', async (req, res) => {

    //Check whether the user available

    connection.query(`SELECT email FROM adminlogins WHERE email='${req.body.email}'`, async function (error, results, fields) {
        if (error) {
            console.log("User Login Error", error)
            throw error;
        }
        let i=0;
        let alreadyReg = false;
        for(i=0; i<results.length; i++) {
            if(req.body.email == results[i].email) {
                alreadyReg = true;
                break;
            }            
        }
        if (alreadyReg) {
            
            //already registered

            res.status(400).send('User already Registered.');
        } else {

            //check password

            const salt = await bcrypt.genSalt(10)
            let enPassword = await bcrypt.hash(req.body.password, salt)            
    
            const user = [req.body.userName, req.body.officeID, req.body.email, enPassword, req.body.nic, 
                req.body.mobile, req.body.fixed, req.body.address];
                
            //send success
            
            connection.query("INSERT INTO adminlogins (userName, officeID, email, password, nic, mobile, fixed, address)\
            VALUES (?,?,?,?,?,?,?,?)" , user, (error, results, fields) => {
            !error ? res.status(200).send("Successfully Registered the User " + user[0]) 
            : console.log("User Register Error", error.sqlMessage);
            });
        }

    });
});


module.exports = router;