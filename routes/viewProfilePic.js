var express = require('express');
var app = express();
const router = express.Router();
var cors = require('cors');
const path = require('path');

app.use(cors());

const mysql = require('mysql');
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


// router.get('/:id',function(req, res) {

//     // const image = path.join(__dirname, '/', req.nic)
//     console.log(`${__dirname}/../profilePics/`)
//     // res.status(200).sendFile(image)
// });
router.get('/:name', function (req, res, next) {
  console.log('Request Params Image name', req.params.name)
  if(req.params.name) {

      var options = {
        root: path.join(appRoot + '/profilePics'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        } 
    }

    // var fileName = req.params.name + '.jpg'
    // console.log(fileName)

    connection.query(`SELECT image FROM members
    WHERE nic='${req.params.name}';`

    , async function (error, results, fields) {
        if (error) throw error;
        
        console.log(results[0].image);

        const fileName = results[0].image

        if(fileName) {

        res.sendFile(fileName, options, function (err) {
          if (err) {
            console.log(err)
          } else {
            console.log('Sent:', fileName)
          }
        })
      }

    });
  }
})

module.exports = router;