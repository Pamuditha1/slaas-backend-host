const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const jwt = require('jsonwebtoken')
const env = require('../envVariables')

const router = express.Router();
const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0112704105',
    database : 'slaasproject'
});
   
  connection.connect((err) => {
      if(!err) return console.log("Successfully connected to MySql database");
  
      else console.log("Database connection failed" , JSON.stringify(err));

      
  });

  router.post('/admin', async (req, res) => {

    // const { error } = validateLogin(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    //Check whether the user available
    connection.query(`SELECT email,password,userName, adminID FROM adminlogins WHERE email='${req.body.email}'`, async function (error, results, fields) {
        console.log("results", results)
        if (error) throw error;
        let i=0;
        let alreadyReg = false;
        let passwordCorrect = false;
        let username = '';
        let type = '';
        let admin = ''
        // console.log(results)
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
            
            console.log("User haven't Registered .");
            res.status(400).json({
                msg: "User haven't Registered"
            });
        } 
        else if(!passwordCorrect) {
            console.log("Password is incorrect .");
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

    });
});


router.post('/applicant', async (req, res) => {

    const { error } = validateLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check whether the user available
    connection.query(`SELECT email,password,type,username, applicantID FROM applicants WHERE email='${req.body.email}'`, async function (error, results, fields) {
        console.log("results", results)
        if (error) throw error;
        let i=0;
        let alreadyReg = false;
        let passwordCorrect = false;
        let username = '';
        let type = '';
        let applicant = ''
        // console.log(results)
        for(i=0; i<results.length; i++) {
            if(req.body.email == results[i].email) {
                alreadyReg = true;
                passwordCorrect = await bcrypt.compare(req.body.password, results[i].password);
                if(passwordCorrect){
                    
                    username = results[i].username;
                    type = results[i].type;
                    applicant = results[i].applicantID
                }
                break;
            }            
        }
        if (!alreadyReg) {
            
            console.log("User haven't Registered .");
            res.status(400).json({
                msg: "User haven't Registered"
            });
        } 
        else if(!passwordCorrect) {
            console.log("Password is incorrect .");
            res.status(400).json({
                msg: 'Password is incorrect.'
            })
        }
        else {
            console.log(`${username} , ${type}`)

            const token = jwt.sign({id : applicant, username: username, type: type}, env.jewtKey)
            res.status(200).header('x-auth-token', token).json({
                jwt: token,
                msg: 'Logged In Successfully',
                type: 'Applicant'
            })
        }

    });
});


router.post('/member', async (req, res) => {

    // const { error } = validateLogin(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    //Check whether the user available
    console.log('Mem', req.body)
    connection.query(`SELECT memberID, membershipNo, password FROM memberlogins WHERE membershipNo='${req.body.membershipNo}'`, async function (error, results, fields) {
        console.log("results", results)
        if (error) throw error;
        let i=0;
        let alreadyReg = false;
        let passwordCorrect = false;
        let memberID = '';
        let firstName = ''
        let lastName = ''
        // console.log(results)
        for(i=0; i<results.length; i++) {
            if(req.body.membershipNo == results[i].membershipNo) {
                alreadyReg = true;
                passwordCorrect = await bcrypt.compare(req.body.password, results[i].password);
                console.log('pass corr', passwordCorrect)
                if(passwordCorrect){
                    
                    memberID = results[i].memberID;
                    // firstName = results[i].commonFirst
                    // lastName = results[i].commomLast
                }
                break;
            }            
        }
        if (!alreadyReg) {
            
            console.log("User haven't Registered .");
            res.status(400).json({
                msg: "User haven't Registered"
            });
        } 
        else if(!passwordCorrect) {
            console.log("Password is incorrect .");
            res.status(400).json({
                msg: 'Password is incorrect.'
            })
        }
        else {

            const token = jwt.sign({id : memberID, memNo: req.body.membershipNo, type: "Member"}, env.jewtKey)
            res.status(200).header('x-auth-token', token).json({
                jwt: token,
                msg: 'Logged In Successfully',
                type: 'Member'
            })
        }

    });
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