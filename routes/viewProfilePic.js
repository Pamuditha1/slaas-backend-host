var express = require('express');
var app = express();
const router = express.Router();
var cors = require('cors');
const path = require('path');

app.use(cors());

const connection = require('../database')

router.get('/:name', function (req, res, next) {

  // try {

  if(req.params.name) {

      var options = {
        root: path.join(appRoot + '/profilePics'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        } 
    }

    //get image name from database

    connection.query(`SELECT image FROM members
    WHERE nic='${req.params.name}';`

    , async function (error, results, fields) {
        if (error) throw error;

        const fileName = results[0].image

        if(fileName) {

          //send the selected image

          res.sendFile(fileName, options, function (err) {
            if (err) {
              console.log("Send profile pic error : ", err)
            }
          })
        }

    });
  }
  else {
    res.status(404).send("No member image")
  }
  
  // }
  // catch(e) {
  //     console.log("Get member profile pic Error : ", e)
  //     res.status(500).send(error);
  // }
})

module.exports = router;