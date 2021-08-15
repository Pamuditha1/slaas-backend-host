const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const nodemailMailGun = require('nodemailer-mailgun-transport')
const env = require('../envVariables')

const connection = require('../database')

let transporter = nodemailer.createTransport(nodemailMailGun(env.emailAuth));

let mailContent={
    from: 'slaasmembermanagement@gmail.com',
    to: '',
    subject: '',
    text: '',
};


router.post('/', (req, res) => {

    mailContent.subject = req.body.subject
    mailContent.text = req.body.body
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

    sendMailstoSections(sections, grades, totalEmailsList, res)
    
    
})
function sendMailstoSections(sections, grades, totalEmailsList, res) {

    // try {

    //select members of perticular sections

        if(sections.length>0) {

            let sectionQuery = sections.map((s) => {
                return `section="${s}" OR`
            })
            let sectionQueryString = sectionQuery.join(' ')
            let querArr = sectionQueryString.split(' ')
            querArr.pop()
            let finalString = querArr.join(' ')
            
            connection.query(`SELECT email FROM members WHERE ${finalString};`
            ,function (error, results, fields) {
                if (error) throw error;

                results.forEach(r => {
                    totalEmailsList.push(r.email)
                })
                sendMailstoGrades(grades, totalEmailsList, res)
            });
        }
        else {
            sendMailstoGrades(grades, totalEmailsList, res)
        }
    // }
    // catch(e) {
    //     console.log("Mail to secions error : ",e);
    //     res.status(500).send(e);
        
    // }
}

function sendMailstoGrades(grades, totalEmailsList, res) {

    // try {

        if(grades.length>0) {

        let gradeQuery = grades.map((g) => {
            return `gradeOfMembership="${g}" OR`
        })
        let gradeQueryQueryString = gradeQuery.join(' ')
        let querArr = gradeQueryQueryString.split(' ')
        querArr.pop()
        let finalString = querArr.join(' ')

        //select members from perticular grades

        connection.query(`SELECT email FROM members WHERE ${finalString};`
        , async function (error, results, fields) {
            if (error) throw error;

            results.forEach(r => {
                totalEmailsList.push(r.email)
            })
            sendMailstoEmails(totalEmailsList, res)
        });
        }
        else {
            sendMailstoEmails(totalEmailsList, res)
        }
    // }
    // catch(e) {
    //     console.log("Mail to gradeserror : ",e);
    //     res.status(500).send(e);
        
    // }
}

function sendMailstoEmails(emails, res) {

    // try {

        //send mails
        
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
                        // console.log(`Unable to send mail to ${e}`, error);
                        res.status(404).send(`Unable to send mail to ${e}`)
                    }
                    
                }
                else{
                    success++
                    i++
                    if(i==mailsCount) {
                        res.status(200).send(`Email successfully sent to ${success} mails`)
                    }
                    
                }
            });
            
        })
    // }
    // catch(e) {
    //     console.log("Sending mails : ",e);
    //     res.status(500).send(e);
        
    // }
}


module.exports = router;

