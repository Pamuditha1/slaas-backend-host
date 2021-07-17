const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const connection = require('../database')

const router = express.Router();

router.post('/', async (req, res) => {

    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check whether the user available
    connection.query(`SELECT email,password,accountType,username FROM users WHERE email='${req.body.email}'`, async function (error, results, fields) {
        if (error) throw error;
        let i=0;
        let alreadyReg = false;
        let passwordCorrect = false;
        let username = '';
        let accountType = '';
        // console.log(results)
        for(i=0; i<results.length; i++) {
            if(req.body.email == results[i].email) {
                alreadyReg = true;
                passwordCorrect = await bcrypt.compare(req.body.password, results[i].password);
                if(passwordCorrect){
                    
                    username = results[i].username;
                    accountType = results[i].accountType;
                }
                break;
            }            
        }
        if (!alreadyReg) {
            
            // console.log("User haven't Registered .");
            res.status(400).send("User haven't Registered .");
        } 
        else if(!passwordCorrect) {
            // console.log("Password is incorrect .");
            res.status(400).send('Password is incorrect.');
        }
        else {
            // console.log(`${username} , ${accountType}`)
            res.status(200).json({
                username: username,
                accountType: accountType
            })
        }

    });
});

function validateLogin(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        accountType: Joi.string().min(3).max(255).required()
        
    });
    return schema.validate(user);
}

module.exports = router;




