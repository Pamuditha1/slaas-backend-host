const express = require('express');
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
let transporter = nodemailer.createTransport(nodemailMailGun(env.emailAuth));

let mailContent={
    from: 'slaasmembermanagement@gmail.com',
    to: '',
    subject: 'Reminder Email',
    text: 'Your Membership Going to be terminated',
    // html: '<h1>You can send html formatted content using Nodemailer with attachments</h1>',
    // attachments: [
    //     {
    //         filename: 'image1.png',
    //         path: appRoot + '/profilePics/image1.png'
    //     }
    // ]
};

connection.connect((err) => {
    if(!err) return console.log("Successfully connected to MySql database");

    else console.log("Database connection failed" , send.stringify(err));   
});

router.get('/last-update', async (req, res) => {

    connection.query(`SELECT date FROM remindermails ORDER BY id DESC LIMIT 1;`

    , async function (error, results, fields) {

        if (error) console.log(error);
     
        res.status(200).send(results[0].date);

    });
    
    
});

router.get('/', async (req, res) => {

    getTerminationDates(res)
});

function getTerminationDates(res) {

    connection.query(`SELECT * FROM terminations;`

    , async function (error, results, fields) {

        if (error) console.log(error);
     
        // console.log("Date", results[0].period)
        let datesToTerminate = results[0].period
        getMembersOfSendingMails(res, datesToTerminate)       

    });
}

function getMembersOfSendingMails(res, datesToTerminate) {


    connection.query(`SELECT memberID, email, lastMembershipPaid, reminderMailDate FROM members;`

    , async function (error, results, fields) {

        let today = new Date()

        if (error) console.log(error);
        let outdatedMails = []
        //get outdated members according to last membership payment date (lastMembershipPaid) - more than 1 year
        let outdatedMembers = results.filter((m) => {

            if(m.lastMembershipPaid) {
                let lastPaidTime = new Date(m.lastMembershipPaid).getTime()
                let lastUpdated = new Date(m.reminderMailDate).getTime()

                let todayTime = new Date(today).getTime()

                let timeDiff = todayTime - lastPaidTime
                let timeDiffUpdate = todayTime - lastUpdated

                //difference between today and last membership payment date
                let diffDays = timeDiff / (1000 * 60 * 60 * 24)
                //difference between today and last update date
                let diffDaysUpdated = timeDiffUpdate/ (1000 * 60 * 60 * 24)

                //select last membershi payment > 1 year
                // if(diffDays > 365) {
                    if(diffDays > datesToTerminate) {
                    
                    //select last update diff < difference between today and last membership payment date diff
                    if(diffDaysUpdated > diffDays) {
                        return true
                    }
                }
                return false
            }
            else false
        })

        // send mails
        outdatedMembers.forEach(m => {
            outdatedMails.push({email : m.email, id: m.memberID})
        })
        
        console.log(outdatedMails)
        sendMailstoEmails(outdatedMails, res)

        //update last arrears calculated date
        connection.query(`INSERT INTO remindermails (date) VALUES ('${today.toISOString()}') `, 
        (error, results, fields) => {

            if(error) {
                console.log(error)
                throw error
            } 
        });
        
    });

    
}

function sendMailstoEmails(emails, res) {
    let mailsCount = emails.length
    let i = 0
    let failed = 0
    let success = 0
    let failedMails = []


    connection.query(`SELECT * FROM emailbodies WHERE type='Membership Payment Reminder';`

    , async function (error, results, fields) {
        if (error) {
            console.log("Gettings Mail Data Error", error)
            throw error
        } ;

        let subject = results[0].subject
        let body = results[0].body

        mailContent.subject = subject
        mailContent.text = body

        emails.map((e) => {

            console.log(e)

            mailContent.to = e.email;

            transporter.sendMail(mailContent, function(error, data){
                if(error){
                    console.log("Sending Error", error)
                    failed++
                    i++
                    failedMails.push(e.email)
                    if(i==mailsCount) {
                        console.log(`Unable to send mail to ${e.email}`, error);
                        res.status(200).json({
                            msg: `Emails successfully sent to ${success} emails`,
                            failed: failedMails
                        })
                    }
                    
                }
                else{
                    success++
                    i++
                    setNewReminderDate(e.id)
                    if(i==mailsCount) {
                        console.log(`Email send successfully to ${e.email}`);
                        res.status(200).json({
                            msg: `Emails successfully sent to ${success} emails`,
                            failed: failedMails
                        })
                    }                
                }
            });
        
        })
    });
}


function setNewReminderDate(memberID) {

    let today = new Date().toISOString()

    connection.query(`UPDATE members
    SET reminderMailDate='${today}' WHERE memberID='${memberID}';`, (error, results, fields) => {

        if(error) {
            console.log(error)
            throw error
        }
        console.log("Remindaer Date Updated" + memberID)    

    });
}

module.exports = router;