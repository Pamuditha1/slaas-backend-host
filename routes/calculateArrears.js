const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/last-update', async (req, res) => {

    // try{

        //get last arrears calculated date

        connection.query(`SELECT date FROM arrears ORDER BY id DESC LIMIT 1;`

        , async function (error, results, fields) {

            if (error) throw error
        
            res.status(200).send(results[0].date);

        });
    // }
    // catch(e) {
    //     console.log("Get last calculated date Error : ", e)
    //     res.status(500).send(error);
    // }
    
    
});

router.get('/', async (req, res) => {

    getTerminationDates(res)

});

function getTerminationDates(res) {

    // try {

        //get period of membership outdating

        connection.query(`SELECT * FROM terminations;`

        , async function (error, results, fields) {

            if (error) throw error;
        
            let datesToTerminate = results[0].period
            getGrades(res, datesToTerminate)        

        });
    // }
    // catch(e) {
    //     console.log("Get termination periods Error : ", e)
    //     res.status(500).send(error);
    // }
}

function getGrades(res, datesToTerminate) {
    console.log('dste to terminate : ', datesToTerminate)
    // try{

    //Get membership paying grades

        connection.query(`SELECT grade, membershipFee FROM grades WHERE membershipFee != 0;`

        , async function (error, results, fields) {

            if (error) throw error;

            let gradesWfee = results
            let grades = []
            results.forEach(g => {
                grades.push(g.grade)
            });
        
            getMembersOfPayingGrades(grades, gradesWfee, res, datesToTerminate)        

        });
    // }
    // catch(e) {
    //     console.log("Get membership paying grades Error : ", e)
    //     res.status(500).send(error);
    // }
}

function getMembersOfPayingGrades(grades, gradesWfee, res, datesToTerminate) {

    // try{

        //select membership paying members

        let orString = ''

        grades.forEach(g => {
            orString = orString + `gradeOfMembership='${g}' OR `
        })
        let withoutSpace = orString.split(' ')
        withoutSpace.pop()
        withoutSpace.pop()
        let newOrString = withoutSpace.join(' ')

        console.log("NEw Stroing ", newOrString)

        connection.query(`SELECT memberID, lastPaidForYear, lastMembershipPaid, arrearsUpdated, gradeOfMembership, arrearsConti 
        FROM members WHERE ${newOrString};`

        , async function (error, results, fields) {

            let today = new Date()

            // if (error) throw error;

            if (error) console.log("Query Error", error)

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

                    //select last membershi payment > mem period year

                        if(diffDays > datesToTerminate) {
                        
                        //select last update diff > difference between today and last membership payment date diff

                        if(diffDaysUpdated > diffDays || diffDaysUpdated > datesToTerminate) {
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
                        let finalUpdateYear = new Date(m.arrearsUpdated).getFullYear()
                        let thisYear = new Date().getFullYear()

                        // ********************calculate arrears from last updated year

                        //let yearsDiff = thisYear - finalPaidYear
                        let yearsDiff = thisYear - finalUpdateYear

                        if(yearsDiff >= 1) {
                            let arrears = g.membershipFee * yearsDiff
                            let newArrears = parseInt(m.arrearsConti) + arrears

                            setNewArrears(newArrears, m.memberID)
                            console.log(newArrears)
                        }
                    }
                })
            })  
            
            //update last arrears calculated date

            connection.query(`INSERT INTO arrears (date) VALUES ('${today.toISOString()}') `, 
            (error, results, fields) => {

                if(error) throw error
                res.status(200).send({
                    msg: `Arreas Successfully Calculated upto ${new Date(today).toLocaleDateString()} - ${new Date(today).toLocaleTimeString()}`,
                    data: today
                })
                
            });
            
        });
    // }
    // catch(e) {
    //     console.log("Get membership paying members Error : ", e)
    //     res.status(500).send(error);
    // }

    
}

function setNewArrears(newArrears, memberID) {

    // try {

        //set arrears updated date
        connection.query(`UPDATE members
        SET arrearsConti='${newArrears}', arrearsUpdated='${new Date().toISOString()}' WHERE memberID='${memberID}';`, (error, results, fields) => {

            if(error) throw error

        });
    // }
    // catch(e) {
    //     console.log("Member set arrears updating : ", e)
    //     res.status(500).send(error);
    // }
}


module.exports = router;