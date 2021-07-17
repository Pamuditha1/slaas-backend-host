const express = require('express');
var moment = require('moment'); 
var compareDates = require("compare-dates")
// moment().format(); 

// const connection = require('../index')

// moment().diff(Moment|String|Number|Date|Array);
// moment().diff(Moment|String|Number|Date|Array, String);
// moment().diff(Moment|String|Number|Date|Array, String, Boolean);

const router = express.Router();
const mysql = require('mysql');

const bodyParser = require('body-parser')

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0112704105',
    database : 'slaasproject'
});

// connection.connect((err) => {
//     if(!err) return console.log("Successfully connected to MySql database");

//     else console.log("Database connection failed" , send.stringify(err));   
// });

router.use(bodyParser.json())

router.get('/:from/:to', async (req, res) => {
    //:from/:to

    // console.log(req)
    // console.log(req.body)
    // console.log("params", req.params.word)
    console.log(req.params)
    const from = req.params.from
    const to = req.params.to
    // console.log("Searched Word",searchWord)

    // if(!req.params.word) {
    //     return res.status(404).send('Empty Search')
    // }

    // res.status(200).send('search received')

    filterPayments(from, to, res)   

});


function filterPayments(from, to, res) {

    connection.query(`SELECT * FROM payments`,

    async function (error, results, fields) {
        if (error) throw error;
        
        // console.log("printing results", results)
        if(results.length == 0) {
            // searchAcademic(searchWord, res)
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
        console.log(filteredRenge.length)
        console.log("Filtered Payments", filteredRenge)
        res.status(200).send(filteredRenge) 
        // let today = new Date().toLocaleDateString();
        // let dateCheck = new Date(results[2].timeStamp).toLocaleDateString();
        // let nextDate = new Date('6/15/2021').toLocaleDateString();

        // console.log(today)
        // console.log(dateCheck)
        // console.log(nextDate)

        // var currentDate = new Date('7/15/2021');
    
        // var minDate = new Date(results[2].timeStamp)
        // var maxDate = new Date('6/15/2021')
        
        






        // var d1 = dateCheck.split("/");
        // var d2 = nextDate.split("/");
        // var c = today.split("/");

        // var from = new Date(d1[2], parseInt(d1[1])-1, d1[0]);  // -1 because months are from 0 to 11
        // var to   = new Date(d2[2], parseInt(d2[1])-1, d2[0]);
        // var check = new Date(c[2], parseInt(c[1])-1, c[0]);

        // console.log(check > from && check < to)

        // 

        // let result1 = moment().isBetween('', dateCheck, nextDate, today, '')
        // console.log(result1)

        // if(today>results[2].timeStamp) console.log('Today is bigger')
        // else console.log('Time is bigger')

        // results[2]
        // let differ = moment(today).diff(moment(results[2]))
        // console.log(differ)

        // console.log(results.length)
        // res.status(200).send(results)        

    });
}


module.exports = router;