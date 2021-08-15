const express = require('express');
const router = express.Router();

const connection = require('../database')

var i = 0
var success = 0
var terminatedMembers = []

router.get('/last-update', async (req, res) => {

    //get last terminated date
    // try {
        connection.query(`SELECT date FROM terminationrecords ORDER BY id DESC LIMIT 1;`

        , async function (error, results, fields) {

            if (error) throw error;
            res.status(200).send(results[0].date);

        });
    // }
    // catch(e) {
    //     console.log("Get Terminated Dates Error : ", e)
    //     res.status(500).send(error);
    // }    
    
});


router.get('/', async (req, res) => {

    getTerminationDates(res)

});

function getTerminationDates(res) {

    // try{

        //get termination periods

        connection.query(`SELECT * FROM terminations;`
        , async function (error, results, fields) {

            if (error) throw error;
        
            let datesToTerminate = results[0].autoPeriod
            getMembersShouldTerminate(res, datesToTerminate)        

        });
    // }
    // catch(e) {
    //     console.log("Get Termination Periods Error : ", e)
    //     res.status(500).send(error);
    // }
}

function getMembersShouldTerminate(res, datesToTerminate) {

    // try{

    //select outdated members

    connection.query(`SELECT memberID, membershipNo, nameWinitials, status, lastMembershipPaid FROM members WHERE status != 'Terminated';`

    , async function (error, results, fields) {

        let today = new Date()

        if (error) throw error;

        //get outdated members according to last membership payment date (lastMembershipPaid) - more than 1 year

        let outdatedMembers = results.filter((m) => {

            if(m.lastMembershipPaid) {
                let lastPaidTime = new Date(m.lastMembershipPaid).getTime()

                let todayTime = new Date(today).getTime()

                let timeDiff = todayTime - lastPaidTime

                //difference between today and last membership payment date

                let diffDays = timeDiff / (1000 * 60 * 60 * 24)

                //select last membershi payment > termination period years

                if(diffDays > datesToTerminate*365) {
                    return true
                }
                return false
            }
            else false
        })

        // calculate arrears according to the last mambership paid for year (lastPaidForYear)

        let outdatedCount = outdatedMembers.length
        
        outdatedMembers.forEach(m => {
            setTerminated(m.memberID, m.nameWinitials, m.membershipNo, outdatedCount, res)
        })  
        
        connection.query(`INSERT INTO terminationrecords (date) VALUES ('${today.toISOString()}') `, 
        (error, results, fields) => {

            if(error) {
                console.log("Update last termination record error : ",error)
                throw error
            } 
        });
        
    });
    // }
    // catch(e) {
    //     console.log("Select Outdated Members Error : ", e)
    //     res.status(500).send(error);
    // }

    
}

function setTerminated(memberID, name, memNo, outdatedCount, res) {
    
    let dot = new Date().toISOString()

    // try {

    //update as terminated
    
    connection.query(`UPDATE members
    SET status='Terminated', dot='${dot}' WHERE memberID='${memberID}';`, (error, results, fields) => {

        if(error)   throw error
        
        i =  i + 1
        success = success + 1
        terminatedMembers.push({
            name: name,
            memNo: memNo,
            memberID: memberID
        })
        if(i == outdatedCount) {
            
            res.status(200).json({ list: terminatedMembers, msg: `Successfully Terminated ${success} Members`})
        }    

    });
    // }
    // catch(e) {
    //     console.log("Update member dot Error : ", e)
    //     res.status(500).send(error);
    // }
}


module.exports = router;