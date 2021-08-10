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


router.get('/last-update', async (req, res) => {

    try{

        //Get reminder mails last update

        connection.query(`SELECT date FROM remindermails ORDER BY id DESC LIMIT 1;`

        , async function (error, results, fields) {

            if (error) throw error     
            res.status(200).send(results[0].date);

        });
    }
    catch(e) {
        console.log("Get reminder mails last update Error : ", e)
        res.status(500).send(error);
    }        
    
});

router.get('/', async (req, res) => {

    getTerminationDates(res)
});

function getTerminationDates(res) {


    try {

        //Get reminder mails termination periods

        connection.query(`SELECT * FROM terminations;`

        , async function (error, results, fields) {

            if (error) throw error
    
            let datesToTerminate = results[0].period
            getMembersOfSendingMails(res, datesToTerminate)       

        });
    }
    catch(e) {
        console.log("Get reminder mails termination periods Error : ", e)
        res.status(500).send(error);
    }
}

function getMembersOfSendingMails(res, datesToTerminate) {

    try {
        
        //select members to send reminder mails

        connection.query(`SELECT memberID, email, lastMembershipPaid, reminderMailDate FROM members;`

        , async function (error, results, fields) {

            let today = new Date()

            if (error) throw error
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

                    //select last membershi payment > period
                    
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
            
            sendMailstoEmails(outdatedMails, res)

            //update last arrears calculated date
            connection.query(`INSERT INTO remindermails (date) VALUES ('${today.toISOString()}') `, 
            (error, results, fields) => {

                if(error) {
                    throw error
                    throw error
                } 
            });
            
        });
    }
    catch(e) {
        console.log("Reminder mails select members Error : ", e)
        res.status(500).send(error);
    }

    
}

function sendMailstoEmails(emails, res) {
    let mailsCount = emails.length
    let i = 0
    let failed = 0
    let success = 0
    let failedMails = []

    //get the email content

    connection.query(`SELECT * FROM emailbodies WHERE type='Membership Payment Reminder';`

    , async function (error, results, fields) {
        if (error) {
            console.log("Reminder mails gettings Mail Data Error", error)
            throw error
        } ;

        let subject = results[0].subject
        let body = results[0].body

        mailContent.subject = subject
        mailContent.text = body

        emails.map((e) => {

            mailContent.to = e.email;

            // send mails
            
            transporter.sendMail(mailContent, function(error, data){
                if(error){
                    failed++
                    i++
                    failedMails.push(e.email)
                    if(i==mailsCount) {
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

    //update reminder mails date

    connection.query(`UPDATE members
    SET reminderMailDate='${today}' WHERE memberID='${memberID}';`, (error, results, fields) => {

        if(error) {
            console.log("Reminder mails update reminder mails date Error : ", error)
            throw error
        } 

    });
}

module.exports = router;