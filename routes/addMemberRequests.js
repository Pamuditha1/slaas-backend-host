const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');

const router = express.Router();
const mysql = require('mysql');
const { v1: uuidv1 } = require('uuid');

const connection = require('../database')
  let id = '';

router.post('/', async (req, res) => {

    let today = new Date().toISOString()

    connection.query(`SELECT membershipNo, memberID, nameWinitials, commonFirst, commomLast FROM members WHERE membershipNo='${req.body.membershipNo}'`, 
    async function (error, results, fields) {

        if (error) {
            console.log(error)
            throw error        
        }         

        const request = [today, req.body.request, "Requested", req.body.membershipNo, results[0].memberID, results[0].nameWinitials,
        results[0].commonFirst, results[0].commomLast ];
    
        connection.query("INSERT INTO memberrequests (timestamp, request, status, memNo, memberID, name, fname, lname)\
        VALUES (?,?,?,?,?,?,?,?)" , request, (error, results, fields) => {
        !error ? res.status(200).send("Request Sent") 
        : console.log(error);
        });
    })     
});

module.exports = router;