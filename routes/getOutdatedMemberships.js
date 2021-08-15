const express = require('express');
const router = express.Router();

const connection = require('../database')

router.get('/', async (req, res) => {

    getTerminationDates(res)
    
});

function getTerminationDates(res) {

    // try {

    //get termination dates

        connection.query(`SELECT * FROM terminations;`

        , async function (error, results, fields) {

            if (error) throw error
        
            let datesToTerminate = results[0].period
            selectOutdatedMemberships(res, datesToTerminate)      

        });
    // }
    // catch(e) {
    //     console.log("Get outdated termination period Error : ", e)
    //     res.status(500).send(error);
    // }
}

function selectOutdatedMemberships(res, datesToTerminate) {

    // try {
        let today = new Date()

        //Get outdated members

        connection.query(`SELECT 
        title, nameWinitials, status, dot, lastPaidForYear, lastMembershipPaid, arrearsConti, memPaidLast, nic, mobileNo, email, resAddrs, gradeOfMembership, section, enrollDate, 
        councilPosition, memberFolioNo, membershipNo
        FROM 
        members;`

        , async function (error, results, fields) {
            if (error) throw error
            
            let filtered = results.filter((m) => {

                if(m.lastMembershipPaid) {
                    let lastPaidTime = new Date(m.lastMembershipPaid).getTime()
                    let todayTime = new Date(today).getTime()

                    let timeDiff = todayTime - lastPaidTime
                    let diffDays = timeDiff / (1000 * 60 * 60 * 24)

                    //filter by last membership payment date
                    
                    if(diffDays > datesToTerminate) {
                        m.lastMembershipPaid = new Date(m.lastMembershipPaid).toLocaleDateString()
                        m.memPaidLast = new Date(m.memPaidLast).toLocaleDateString()
                        m.dot = new Date(m.dot).toLocaleDateString()
                        return true
                    }
                    return false
                }
                else false
            })
            res.status(200).send(filtered);

        });
    // }
    // catch(e) {
    //     console.log("Get outdated members Error : ", e)
    //     res.status(500).send(error);
    // }
}


module.exports = router;