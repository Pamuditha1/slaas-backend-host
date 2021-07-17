const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');

const router = express.Router();
const mysql = require('mysql');
const { v1: uuidv1 } = require('uuid');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0112704105',
    database : 'slaasproject'
});
let id = '';
   
  connection.connect((err) => {
      if(!err) return console.log("Successfully connected to MySql database");
  
      else console.log("Database connection failed" , JSON.stringify(err));

      
  });


router.post('/admin', async (req, res) => {

    // const { error } = validateUser(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    //Check whether the user available
    connection.query(`SELECT email FROM adminlogins WHERE email='${req.body.email}'`, async function (error, results, fields) {
        if (error) throw error;
        let i=0;
        let alreadyReg = false;
        for(i=0; i<results.length; i++) {
            if(req.body.email == results[i].email) {
                alreadyReg = true;
                break;
            }            
        }
        if (alreadyReg) {
            
            console.log("User already Registered .");
            res.status(400).send('User already Registered.');
        } else {

            const salt = await bcrypt.genSalt(10)
            let enPassword = await bcrypt.hash(req.body.password, salt)            
    
            const user = [req.body.userName, req.body.officeID, req.body.email, enPassword, req.body.nic, 
                req.body.mobile, req.body.fixed, req.body.address];
        
            connection.query("INSERT INTO adminlogins (userName, officeID, email, password, nic, mobile, fixed, address)\
            VALUES (?,?,?,?,?,?,?,?)" , user, (error, results, fields) => {
            !error ? res.status(200).send("Successfully Registered the User " + user[0]) 
            : console.log(error.sqlMessage);
            });
        }

    });
});



router.post('/applicant', async (req, res) => {

    id = uuidv1();

    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Check whether the user available
    connection.query(`SELECT email FROM applicants WHERE email='${req.body.email}'`, async function (error, results, fields) {
        if (error) throw error;
        let i=0;
        let alreadyReg = false;
        for(i=0; i<results.length; i++) {
            if(req.body.email == results[i].email) {
                alreadyReg = true;
                break;
            }            
        }
        if (alreadyReg) {
            
            console.log("Applicant already Registered .");
            res.status(400).send('Applicant already Registered.');
        } else {

            const salt = await bcrypt.genSalt(10)
            let enPassword = await bcrypt.hash(req.body.password, salt)            
    
            const user = [req.body.name, req.body.contact, req.body.email, enPassword, id, "Applicant"];
        
            connection.query("INSERT INTO applicants (username,mobile,email,password,applicantID, type)\
            VALUES (?,?,?,?,?,?)" , user, (error, results, fields) => {
            !error ? res.status(200).send("Successfully Registered Applicant " + user[0]) 
            : console.log(error.sqlMessage);
            });
        }

    });
});



router.post('/member', async (req, res) => {

    console.log("Reg Mem",req.body)

    // const { error } = validateUser(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    //Check whether the user available
    connection.query(`SELECT membershipNo FROM memberlogins WHERE membershipNo='${req.body.membershipNo}'`, async function (error, results, fields) {
        if (error) {
            console.log(error)
            throw error
        
        }
        let i=0;
        let alreadyReg = false;
        for(i=0; i<results.length; i++) {
            if(req.body.membershipNo == results[i].membershipNo) {
                alreadyReg = true;                
                break;
            }            
        }
        if (alreadyReg) {
            
            console.log("Member account already exists");
            res.status(400).send("Member account already exists");
        } else {

            connection.query(`SELECT membershipNo, memberID FROM members WHERE membershipNo='${req.body.membershipNo}'`, 
            async function (error, results, fields) {

                if (error) {
                    console.log(error)
                    throw error
                
                }

                const salt = await bcrypt.genSalt(10)
                let enPassword = await bcrypt.hash(req.body.password, salt)            
        
                const user = [results[0].memberID, req.body.membershipNo, enPassword];
            
                connection.query("INSERT INTO memberlogins (memberID, membershipNo, password)\
                VALUES (?,?,?)" , user, (error, results, fields) => {
                !error ? res.status(200).send("Successfully Registered the Member " + user[1]) 
                : console.log(error.sqlMessage);
                });
            })

            
        }

    });
});

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        contact: Joi.string().min(10).max(10).required(),
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required(),
    });
    return schema.validate(user);
}

module.exports = router;