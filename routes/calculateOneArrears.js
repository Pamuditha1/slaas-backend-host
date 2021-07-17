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

router.get('/:id', async (req, res) => {

    console.log('One Update Calculate', req.params)
    getGrades(res)
    getTerminationDates(res, req.params.id)

});

function getTerminationDates(res, id) {

    connection.query(`SELECT * FROM terminations;`

    , async function (error, results, fields) {

        if (error) console.log(error);
     
        // console.log("Date", results[0].period)
        let datesToTerminate = results[0].period
        getGrades(res, datesToTerminate, id)        

    });
}

function getGrades(res, datesToTerminate, id) {

    connection.query(`SELECT grade, membershipFee FROM grades WHERE membershipFee != 0;`

    , async function (error, results, fields) {

        if (error) console.log(error);

        let gradesWfee = results
        let grades = []
        results.forEach(g => {
            grades.push(g.grade)
        });
     
        console.log(gradesWfee)
        getMembersOfPayingGrades(grades, gradesWfee, res, datesToTerminate, id)        

    });
}

function getMembersOfPayingGrades(grades, gradesWfee, res, datesToTerminate, id) {

    let orString = ''

    grades.forEach(g => {
        orString = orString + `gradeOfMembership='${g}' OR `
    })
    let withoutSpace = orString.split(' ')
    withoutSpace.pop()
    withoutSpace.pop()
    let newOrString = withoutSpace.join(' ')

    console.log(newOrString)

    connection.query(`SELECT memberID, lastPaidForYear, lastMembershipPaid, arrearsUpdated, gradeOfMembership, arrearsConti 
    FROM members WHERE memberID=${id} AND ${newOrString};`

    , async function (error, results, fields) {

        let today = new Date()

        if (error) console.log(error);

        //get outdated members according to last membership payment date (lastMembershipPaid) - more than 1 year
        let outdatedMembers = results.filter((m) => {

            if(m.lastMembershipPaid) {
                let lastPaidTime = new Date(m.lastMembershipPaid).getTime()
                let lastUpdated = new Date(m.arrearsUpdated).getTime()

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
                    if(diffDaysUpdated < diffDays) {
                        return true
                    }
                }
                return false
            }
            else false
        })

        // calculate arrears according to the last mambership paid for year (lastPaidForYear)
        outdatedMembers.forEach(m => {

            gradesWfee.forEach(g => {
                if(m.gradeOfMembership == g.grade) {
                    let finalPaidYear = parseInt(m.lastPaidForYear)
                    let thisYear = new Date().getFullYear()

                    let yearsDiff = thisYear - finalPaidYear

                    if(yearsDiff >= 1) {
                        let arrears = g.membershipFee * yearsDiff
                        let newArrears = parseInt(m.arrearsConti) + arrears

                        setNewArrears(newArrears, m.memberID)
                        console.log(newArrears)
                    }
                }
            })
        })  
        
    });
}

function setNewArrears(newArrears, memberID) {

    connection.query(`UPDATE members
    SET arrearsConti='${newArrears}', arrearsUpdated='${new Date().toISOString()}' WHERE memberID='${memberID}';`, (error, results, fields) => {

        if(error) {
            console.log(error)
            throw error
        }
        console.log("Arrears Updated")    

    });
}


module.exports = router;