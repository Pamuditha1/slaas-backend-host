const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const DateDiff = require('date-diff');

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

var i = 0
var success = 0
var terminatedMembers = []

router.get('/last-update', async (req, res) => {

    connection.query(`SELECT date FROM terminationrecords ORDER BY id DESC LIMIT 1;`

    , async function (error, results, fields) {

        if (error) console.log(error);
        console.log("Last Auto Terminate", results[0].date)
        res.status(200).send(results[0].date);

    });
    
    
});


router.get('/', async (req, res) => {

    console.log('req came')
    getTerminationDates(res)

});

function getTerminationDates(res) {

    connection.query(`SELECT * FROM terminations;`

    , async function (error, results, fields) {

        if (error) console.log(error);
     
        // console.log("Date", results[0].period)
        let datesToTerminate = results[0].autoPeriod
        console.log("Period",results[0].autoPeriod)
        getMembersShouldTerminate(res, datesToTerminate)        

    });
}

function getMembersShouldTerminate(res, datesToTerminate) {


    connection.query(`SELECT memberID, membershipNo, nameWinitials, status, lastMembershipPaid FROM members WHERE status != 'Terminated';`

    , async function (error, results, fields) {

        let today = new Date()

        if (error) console.log(error);

        //get outdated members according to last membership payment date (lastMembershipPaid) - more than 1 year
        let outdatedMembers = results.filter((m) => {

            if(m.lastMembershipPaid) {
                let lastPaidTime = new Date(m.lastMembershipPaid).getTime()

                let todayTime = new Date(today).getTime()

                let timeDiff = todayTime - lastPaidTime

                //difference between today and last membership payment date
                let diffDays = timeDiff / (1000 * 60 * 60 * 24)

                //select last membershi payment > 1 year
                // if(diffDays > 365) {
                if(diffDays > datesToTerminate*365) {
                    return true
                }
                return false
            }
            else false
        })

        // calculate arrears according to the last mambership paid for year (lastPaidForYear)
        let outdatedCount = outdatedMembers.length
        
        console.log("Outdated", outdatedMembers)
        outdatedMembers.forEach(m => {
            setTerminated(m.memberID, m.nameWinitials, m.membershipNo, outdatedCount, res)
        })  
        
        connection.query(`INSERT INTO terminationrecords (date) VALUES ('${today.toISOString()}') `, 
        (error, results, fields) => {

            if(error) {
                console.log(error)
                throw error
            } 
        });
        
    });

    
}

function setTerminated(memberID, name, memNo, outdatedCount, res) {
    console.log('Fun Called')
    
    let dot = new Date().toISOString()

    connection.query(`UPDATE members
    SET status='Terminated', dot='${dot}' WHERE memberID='${memberID}';`, (error, results, fields) => {

        if(error) {
            console.log(error)
            throw error
        }
        i =  i + 1
        success = success + 1
        terminatedMembers.push({
            name: name,
            memNo: memNo,
            memberID: memberID
        })
        console.log(i)
        console.log('Success ' + memberID)
        if(i == outdatedCount) {
            
            res.status(200).json({ list: terminatedMembers, msg: `Successfully Terminated ${success} Members`})
        }    

    });
}


module.exports = router;