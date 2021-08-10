const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken')
const env = require('../envVariables')

const router = express.Router();

const connection = require('../database')

router.post('/admin', async (req, res) => {

    // const { error } = validateLogin(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    //Check whether the user available
    try {
    
        connection.query(`SELECT email,password,userName, adminID FROM adminlogins WHERE email='${req.body.email}'`, async function (error, results, fields) {
            
            if (error) throw error;
            let i=0;
            let alreadyReg = false;
            let passwordCorrect = false;
            let username = '';
            let type = '';
            let admin = ''

            for(i=0; i<results.length; i++) {
                if(req.body.email == results[i].email) {
                    alreadyReg = true;
                    passwordCorrect = await bcrypt.compare(req.body.password, results[i].password);
                    if(passwordCorrect){
                        
                        username = results[i].userName;
                        admin = results[i].adminID
                    }
                    break;
                }            
            }
            if (!alreadyReg) {
                
                res.status(400).json({
                    msg: "User haven't Registered"
                });
            } 
            else if(!passwordCorrect) {
                res.status(400).json({
                    msg: 'Password is incorrect.'
                })
            }
            else {

                const token = jwt.sign({id : admin, username: username, type: "Admin"}, env.jewtKey)
                res.status(200).header('x-auth-token', token).json({
                    jwt: token,
                    msg: 'Logged In Successfully',
                    type: 'Admin'
                })
            }

        })
    }
    catch(e) {
        console.log("Login user Error : ", e)
        res.status(500).send(error);
    }
});


function validateLogin(user) {
    const schema = Joi.object({
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
        type: Joi.string().min(3).max(255).required()
        
    });
    return schema.validate(user);
}

module.exports = router;