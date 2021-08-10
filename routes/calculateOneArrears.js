const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/:id', async (req, res) => {

    getTerminationDates(res, req.params.id)

});

function getTerminationDates(res, id) {

    try {
        connection.query(`SELECT * FROM terminations;`

        , async function (error, results, fields) {

            if (error) throw error
        
            let datesToTerminate = results[0].period
            getGrades(res, datesToTerminate, id)        

        });
    }
    catch(e) {
        console.log("Get Termination period Error : ", e)
        res.status(500).send(error);
    }
}

function getGrades(res, datesToTerminate, id) {

    try {

        //get membership paying grades
        connection.query(`SELECT grade, membershipFee FROM grades WHERE membershipFee != 0;`

        , async function (error, results, fields) {

            if (error) throw error

            let gradesWfee = results
            let grades = []
            results.forEach(g => {
                grades.push(g.grade)
            });
        
            getMembersOfPayingGrades(grades, gradesWfee, res, datesToTerminate, id)        

        });
    }
    catch(e) {
        console.log("Get membership paying grades Error : ", e)
        res.status(500).send(error);
    }
}

function getMembersOfPayingGrades(grades, gradesWfee, res, datesToTerminate, id) {

    try{
        let orString = ''

        grades.forEach(g => {
            orString = orString + `gradeOfMembership='${g}' OR `
        })
        let withoutSpace = orString.split(' ')
        withoutSpace.pop()
        withoutSpace.pop()
        let newOrString = withoutSpace.join(' ')


        connection.query(`SELECT memberID, lastPaidForYear, lastMembershipPaid, arrearsUpdated, gradeOfMembership, arrearsConti 
        FROM members WHERE memberID=${id} AND ${newOrString};`

        , async function (error, results, fields) {

            let today = new Date()

            if (error) throw error

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

                    //select last membershi payment > period year
                        if(diffDays > datesToTerminate) {
                        
                        //select last update diff > difference between today and last membership payment date diff
                        if(diffDaysUpdated > diffDays) {
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
                        }
                    }
                })
            })  
            
        });
    }
    catch(e) {
        console.log("Get outdated members Error : ", e)
        res.status(500).send(error);
    }
}

function setNewArrears(newArrears, memberID) {

    try {
        connection.query(`UPDATE members
        SET arrearsConti='${newArrears}', arrearsUpdated='${new Date().toISOString()}' WHERE memberID='${memberID}';`, (error, results, fields) => {

            if(error) throw error 

        });
    }
    catch(e) {
        console.log("Update arrears Error : ", e)
        res.status(500).send(error);
    }
}


module.exports = router;