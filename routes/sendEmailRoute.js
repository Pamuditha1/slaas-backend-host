const express = require('express');
const { result, reject } = require('lodash');
const router = express.Router();
const mysql = require('mysql');
const nodemailer = require('nodemailer');
const nodemailMailGun = require('nodemailer-mailgun-transport')
const env = require('../envVariables')

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
let transporter = nodemailer.createTransport(nodemailMailGun(env.emailAuth));

let mailContent={
    from: 'slaasmembermanagement@gmail.com',
    to: '',
    subject: '',
    text: '',
    // html: '<h1>You can send html formatted content using Nodemailer with attachments</h1>',
    // attachments: [
    //     {
    //         filename: 'image1.png',
    //         path: appRoot + '/profilePics/image1.png'
    //     }
    // ]
};


router.post('/', (req, res) => {

    console.log("Body", req.body)

    // mailContent.from = req.body.from
    mailContent.subject = req.body.subject
    mailContent.text = req.body.body
    // let emails = []
    let emails = []
    let sections = []
    let grades = []

    let totalEmailsList = []

    const mailsList = req.body.to
    mailsList.forEach((m) => {
        if(m.includes('@')) {
            emails.push(m)
            totalEmailsList.push(m)
            return
        }
        else if(m.includes('Section')) {
            let sectionPart = m.split(" ")[1]
            sections.push(sectionPart)
            return
        }
        grades.push(m)
    })
    console.log("Emails -> ", emails)
    console.log("Sections -> ",sections)
    console.log("Grades -> ",grades)

    
    // res.send('Received')
    sendMailstoSections(sections, grades, totalEmailsList, res)
    // sendMailstoGrades(grades)
    // sendMailstoEmails(emails, res)
    // sendMailstoSections(sections)
    //     .then(r => console.log("Resolved", r))
    
    
})
function sendMailstoSections(sections, grades, totalEmailsList, res) {

    if(sections.length>0) {

    let sectionQuery = sections.map((s) => {
        return `section="${s}" OR`
    })
    let sectionQueryString = sectionQuery.join(' ')
    let querArr = sectionQueryString.split(' ')
    querArr.pop()
    let finalString = querArr.join(' ')
    // console.log("Sec Query", finalString)
    
    connection.query(`SELECT email FROM members WHERE ${finalString};`
    ,function (error, results, fields) {
        if (error) throw error;

        results.forEach(r => {
            totalEmailsList.push(r.email)
        })
        
        console.log('Section Emails', results)
        sendMailstoGrades(grades, totalEmailsList, res)
    });
    }
    else {
        sendMailstoGrades(grades, totalEmailsList, res)
    }
}

function sendMailstoGrades(grades, totalEmailsList, res) {

    if(grades.length>0) {

    let gradeQuery = grades.map((g) => {
        return `gradeOfMembership="${g}" OR`
    })
    let gradeQueryQueryString = gradeQuery.join(' ')
    let querArr = gradeQueryQueryString.split(' ')
    querArr.pop()
    let finalString = querArr.join(' ')

    connection.query(`SELECT email FROM members WHERE ${finalString};`
    , async function (error, results, fields) {
        if (error) throw error;

        results.forEach(r => {
            totalEmailsList.push(r.email)
        })

        console.log('Grade List', results)
        console.log("Total Mails", totalEmailsList)

        sendMailstoEmails(totalEmailsList, res)
        
    });
    }
    else {
        sendMailstoEmails(totalEmailsList, res)
    }
}

function sendMailstoEmails(emails, res) {
    let mailsCount = emails.length
    let i = 0
    let failed = 0
    let success = 0
    let failedMails = []
    emails.map((e) => {

        mailContent.to = e;

        transporter.sendMail(mailContent, function(error, data){
            if(error){
                failed++
                i++
                failedMails.push(e)
                if(i==mailsCount) {
                    console.log(`Unable to send mail to ${e}`, error);
                    res.status(404).send(`Unable to send mail to ${e}`)
                }
                
            }
            else{
                success++
                i++
                if(i==mailsCount) {
                    console.log(`Email send successfully to ${e}`);
                    res.status(200).send(`Email successfully sent to ${success} mails`)
                }
                
            }
        });
        
    })
}


module.exports = router;

