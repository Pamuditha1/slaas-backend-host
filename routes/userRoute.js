const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

const connection = require('../database')

router.post('/admin', async (req, res) => {

    // const { error } = validateUser(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

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
            
            res.status(400).send('User already Registered.');
        } else {

            const salt = await bcrypt.genSalt(10)
            let enPassword = await bcrypt.hash(req.body.password, salt)            
    
            const user = [req.body.userName, req.body.officeID, req.body.email, enPassword, req.body.nic, 
                req.body.mobile, req.body.fixed, req.body.address];
        
            connection.query("INSERT INTO adminlogins (userName, officeID, email, password, nic, mobile, fixed, address)\
            VALUES (?,?,?,?,?,?,?,?)" , user, (error, results, fields) => {
            !error ? res.status(200).send("Successfully Registered the User " + user[0]) 
            : console.log("User Register Error", error.sqlMessage);
            });
        }

    });
});


// function validateUser(user) {
//     const schema = Joi.object({
//         userName: Joi.string().min(5).max(50).required(),
//         contact: Joi.string().min(10).max(10).required(),
//         email: Joi.string().min(5).max(255).required().email(),
//         password: Joi.string().min(5).max(255).required(),
//     });
//     return schema.validate(user);
// }

module.exports = router;