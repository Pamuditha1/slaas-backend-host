const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const { v1: uuidv1 } = require('uuid');

const generateUniqueId = require('generate-unique-id');
// const {addPersonal,addResAddress} = require('../queries/memberRegisterQueries')

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

    else console.log("Database connection failed" , send.stringify(err));   
});

router.get('/get-invoice', async (req, res) => {

    connection.query(`SELECT invoiceNo FROM payments ORDER BY paymentID DESC LIMIT 1`, async function (error, results, fields) {

        if (error) throw error;

        const invoiceNo = results[0].invoiceNo
        const newInvoiceNo = invoiceNo + 1

        res.send(`${newInvoiceNo}`)

    });
    
});

router.post('/', async (req, res) => {

    // const { error } = validateUser(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    //Check whether the member available
    console.log(req.body)
    const payment = req.body;
    const paymentData = req.body.paymentData
    const previousRecords = req.body.previousRecords

    console.log(payment)
    console.log("payment data", paymentData)
    console.log("previous data", payment)

    // res.status(200).send('Payment Received')

    // connection.query(`SELECT memberID FROM members WHERE membershipNo='${paymentData.paymentRecord.membershipNo}' 
    // OR nic='${paymentData.paymentRecord.nic}'`, async function (error, results, fields) {
    connection.query(`SELECT memberID FROM members WHERE memberID='${paymentData.paymentRecord.memberID}'`
    , async function (error, results, fields) {

        if (error) throw error;
        
        if(results.length > 1) {
            console.log("More than 1 member Found");
            res.status(404).send('More than 1 member found. Payment Rejected');
            return;
        }
        if (results.length === 0) {
            console.log("No member record");
            res.status(400).send('No member record. Payment Rejected');
            return;
        } 
        console.log(results[0].memberID)
        const memberID = results[0].memberID
        addPayment(res, paymentData, previousRecords, memberID)

    });
    
});

function addPayment(res, paymentData, previousRecords, memberID) {

    const paymentDataSave = [paymentData.invoiceNo, paymentData.dateTimeSave, paymentData.today, paymentData.time,
        paymentData.paymentRecord.paymentMethod , paymentData.paymentRecord.yearOfPayment ,
        paymentData.paymentRecord.admissionFee,paymentData.paymentRecord.arrearsFee,
        paymentData.paymentRecord.yearlyFee, paymentData.paymentRecord.idCardFee, 
        paymentData.total, paymentData.paymentRecord.description, paymentData.totalWords,  memberID];
        
    connection.query(`INSERT INTO payments (invoiceNo, timeStamp, date, time, type, yearOfPayment, admission, arrears, yearlyFee, idCardFee, total ,description \
        ,totalWords, memberID) \
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)` , paymentDataSave , (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }

        updateArrears(res, paymentData, previousRecords, memberID)
        // if(arrearsPaid > 0) {
        //     updateArrears(res, paymentData, previousRecords, memberID, arrearsPaid, arrearsContinued)
        //     return
        // }
        // else {
        //     console.log('Successfully Added Payment')
        //     res.status(200).send('Payment Successfully Recorded')  
        // }
        
        // let arrearsPaid = parseInt(paymentData.paymentRecord.arrearsFee) 
        // let arrearsContinued = parseInt(previousRecords.arrearsConti)
        // console.log(arrearsPaid)
        // console.log(arrearsContinued)
    });
}

function updateArrears(res, paymentData, previousRecords, memberID) {

    // let arrearsPaid = parseInt(paymentData.paymentRecord.arrearsFee) 
    // let arrearsContinued = parseInt(previousRecords.arrearsConti)
    let arrearsPaid = paymentData.paymentRecord.arrearsFee ? parseInt(paymentData.paymentRecord.arrearsFee) : 0
    let arrearsContinued = previousRecords.arrearsConti ? parseInt(previousRecords.arrearsConti) : 0

    let newArrears = 0 ; 
    let lastYear = ''

    newArrears = arrearsContinued - arrearsPaid
    if(newArrears < 0) newArrears = 0

    let today = new Date()
    todayISO = today.toISOString()

    // (typeof paymentData.paymentRecord.yearOfPayment != undefined || 
    // typeof paymentData.paymentRecord.yearOfPayment != null || 
    // paymentData.paymentRecord.yearOfPayment != '') 
    paymentData.paymentRecord.yearOfPayment? 
    lastYear = paymentData.paymentRecord.yearOfPayment : lastYear = previousRecords.lastPaidForYear

    paymentData.paymentRecord.yearOfPayment?
    lastMemPaidDate = todayISO : lastMemPaidDate = previousRecords.lastMembershipPaid

    connection.query(`UPDATE members
    SET arrearsConti='${newArrears}', lastPaidForYear='${lastYear}', lastMembershipPaid='${lastMemPaidDate}', 
    memPaidLast='${todayISO}'
    WHERE memberID='${memberID}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }        
        console.log("newArrears", newArrears)
        res.status(200).json({
            msg: "Payment Successfully Recorded",
            data: newArrears.toString()
        })
        return   

    });
    

}


module.exports = router;

