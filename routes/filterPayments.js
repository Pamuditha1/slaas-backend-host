const express = require('express');
const router = express.Router();

const connection = require('../database')

// const bodyParser = require('body-parser')
// router.use(bodyParser.json())

router.get('/:from/:to', async (req, res) => {

    const from = req.params.from
    const to = req.params.to

    filterPayments(from, to, res)   

});


function filterPayments(from, to, res) {

    try{
        //Filter payments records
        connection.query(`SELECT * FROM payments`,

        async function (error, results, fields) {
            if (error) throw error;
            
            if(results.length == 0) {
                res.status(404).send('No Record Found')
                return
            }

            let filteredRenge = results.filter(p => {

                var checkDate = new Date(p.timeStamp)
                var minDate = new Date(from)
                var maxDate = new Date(to)

                if (checkDate > minDate && checkDate < maxDate ){
                    return true
                }
                else{
                    return false
                }
            })
            res.status(200).send(filteredRenge)        

        });
    }
    catch(e) {
        console.log("Filter payments records Error : ", e)
        res.status(500).send(error);
    }
}


module.exports = router;